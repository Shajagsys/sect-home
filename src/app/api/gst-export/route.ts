import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * CSV export of the GST registers for accountants / GSTR filing.
 * GET /api/gst-export?direction=outward|inward&from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const direction = params.get('direction') === 'inward' ? 'inward' : 'outward';
  const from = (params.get('from') || '2000-01-01').slice(0, 10);
  const to = (params.get('to') || '2099-12-31').slice(0, 10);

  try {
    let header: string[];
    let rows: unknown[][];

    if (direction === 'outward') {
      const result = await query<{
        number: string; issue_date: string; client: string; gstin: string | null;
        place_of_supply: string; taxable: string; cgst: string; sgst: string;
        igst: string; total: string; status: string;
      }>(
        `SELECT i.number, i.issue_date::text AS issue_date,
                COALESCE(c.company, c.name) AS client, c.gstin, i.place_of_supply,
                i.taxable, i.cgst, i.sgst, i.igst, i.total, i.status
         FROM invoices i JOIN clients c ON c.id = i.client_id
         WHERE i.status <> 'cancelled' AND i.issue_date BETWEEN $1 AND $2
         ORDER BY i.issue_date`,
        [from, to]
      );
      header = ['Invoice No', 'Date', 'Client', 'GSTIN', 'Place of Supply',
                'Taxable Value', 'CGST', 'SGST', 'IGST', 'Total', 'Status'];
      rows = result.rows.map((r) => [r.number, r.issue_date, r.client, r.gstin || 'Unregistered',
        r.place_of_supply, r.taxable, r.cgst, r.sgst, r.igst, r.total, r.status]);
    } else {
      const result = await query<{
        bill_number: string; bill_date: string; vendor_name: string; vendor_gstin: string | null;
        taxable: string; cgst: string; sgst: string; igst: string; total: string; status: string;
      }>(
        `SELECT bill_number, bill_date::text AS bill_date, vendor_name, vendor_gstin,
                taxable, cgst, sgst, igst, total, status
         FROM purchase_invoices
         WHERE status <> 'cancelled' AND bill_date BETWEEN $1 AND $2
         ORDER BY bill_date`,
        [from, to]
      );
      header = ['Bill No', 'Date', 'Vendor', 'Vendor GSTIN',
                'Taxable Value', 'CGST', 'SGST', 'IGST', 'Total', 'Status'];
      rows = result.rows.map((r) => [r.bill_number, r.bill_date, r.vendor_name,
        r.vendor_gstin || 'Unregistered', r.taxable, r.cgst, r.sgst, r.igst, r.total, r.status]);
    }

    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="gst-${direction}-${from}-to-${to}.csv"`,
      },
    });
  } catch (err) {
    console.error('GST export error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
