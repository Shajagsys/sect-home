import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { computeGst, financialYear, parseGstItems } from '@/lib/gst';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Raise a purchase request (a PO in 'requested' state). */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const vendorName = String(body.vendor_name || '').trim().slice(0, 200);
  const vendorGstin = String(body.vendor_gstin || '').trim().toUpperCase().slice(0, 15) || null;
  const vendorEmail = String(body.vendor_email || '').trim().toLowerCase().slice(0, 200) || null;
  const projectId = body.project_id ? Number(body.project_id) : null;
  const interState = Boolean(body.inter_state);
  const notes = String(body.notes || '').trim().slice(0, 4000) || null;

  if (!vendorName) {
    return NextResponse.json({ error: 'Vendor name is required' }, { status: 400 });
  }
  const parsed = parseGstItems(body.items);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const totals = computeGst(parsed, 0, interState);
    const seq = await query<{ n: string }>(
      `SELECT COUNT(*) + 1 AS n FROM purchase_orders WHERE number LIKE $1`,
      [`PO-${financialYear()}-%`]
    );
    const number = `PO-${financialYear()}-${String(seq.rows[0].n).padStart(5, '0')}`;

    const result = await query<{ id: number }>(
      `INSERT INTO purchase_orders (number, vendor_name, vendor_gstin, vendor_email, project_id,
                                    items, inter_state, taxable, cgst, sgst, igst, total, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [number, vendorName, vendorGstin, vendorEmail, projectId, JSON.stringify(parsed),
       interState, totals.taxable, totals.cgst, totals.sgst, totals.igst, totals.total,
       notes, Number(session.sub)]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id, number }, { status: 201 });
  } catch (err) {
    console.error('PO create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
