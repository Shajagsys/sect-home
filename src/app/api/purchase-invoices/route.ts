import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Record a vendor bill (purchase invoice — GST inward / input tax credit). */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const billNumber = String(body.bill_number || '').trim().slice(0, 60);
  const vendorName = String(body.vendor_name || '').trim().slice(0, 200);
  const vendorGstin = String(body.vendor_gstin || '').trim().toUpperCase().slice(0, 15) || null;
  const poId = body.po_id ? Number(body.po_id) : null;
  const projectId = body.project_id ? Number(body.project_id) : null;
  const billDate = body.bill_date ? String(body.bill_date).slice(0, 10) : new Date().toISOString().slice(0, 10);
  const taxable = Number(body.taxable);
  const cgst = Number(body.cgst) || 0;
  const sgst = Number(body.sgst) || 0;
  const igst = Number(body.igst) || 0;
  const notes = String(body.notes || '').trim().slice(0, 4000) || null;

  if (!billNumber) return NextResponse.json({ error: 'Vendor bill number is required' }, { status: 400 });
  if (!vendorName) return NextResponse.json({ error: 'Vendor name is required' }, { status: 400 });
  if (!Number.isFinite(taxable) || taxable < 0) {
    return NextResponse.json({ error: 'Invalid taxable amount' }, { status: 400 });
  }
  if (cgst < 0 || sgst < 0 || igst < 0) {
    return NextResponse.json({ error: 'Invalid GST amounts' }, { status: 400 });
  }
  const total = Math.round((taxable + cgst + sgst + igst) * 100) / 100;

  try {
    const result = await query<{ id: number }>(
      `INSERT INTO purchase_invoices (bill_number, vendor_name, vendor_gstin, po_id, project_id,
                                      bill_date, taxable, cgst, sgst, igst, total, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id`,
      [billNumber, vendorName, vendorGstin, poId, projectId, billDate,
       taxable, cgst, sgst, igst, total, notes, Number(session.sub)]
    );
    if (poId) {
      await query(`UPDATE purchase_orders SET status = 'billed' WHERE id = $1`, [poId]);
    }
    return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    console.error('Purchase invoice error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
