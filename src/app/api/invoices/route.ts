import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { computeGst, financialYear, GstItem, parseGstItems } from '@/lib/gst';
import { COMPANY } from '@/lib/company';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Create a GST tax invoice. Either pass full line items, or pass
 * { from_project_id } to generate a branded invoice from a signed project's
 * value (one 18% service line). Also writes the client-ledger debit entry.
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    let clientId: number;
    let projectId: number | null = null;
    let items: GstItem[];
    let notes = String(body.notes || '').trim().slice(0, 4000) || null;

    if (body.from_project_id) {
      const project = await query<{ id: number; client_id: number; name: string; value: string; status: string }>(
        'SELECT id, client_id, name, value, status FROM projects WHERE id = $1',
        [Number(body.from_project_id)]
      );
      if (project.rowCount === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      const p = project.rows[0];
      if (!['signed', 'active', 'completed', 'renewed'].includes(p.status)) {
        return NextResponse.json(
          { error: 'The contract must be signed before an invoice can be generated' },
          { status: 400 }
        );
      }
      clientId = p.client_id;
      projectId = p.id;
      items = [
        {
          description: p.name,
          hsn_sac: '998313', // IT consulting & support services SAC
          qty: 1,
          unit_price: Number(p.value) || 0,
          gst_rate: 18,
        },
      ];
      notes = notes || 'Generated from signed project contract.';
    } else {
      clientId = Number(body.client_id);
      projectId = body.project_id ? Number(body.project_id) : null;
      const parsed = parseGstItems(body.items);
      if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
      items = parsed;
    }

    const client = await query<{ id: number; state_code: string; name: string }>(
      'SELECT id, state_code, name FROM clients WHERE id = $1',
      [clientId]
    );
    if (client.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const placeOfSupply = client.rows[0].state_code;
    const interState = placeOfSupply !== COMPANY.stateCode;
    const discountPercent = Number(body.discount_percent) || 0;
    const totals = computeGst(items, discountPercent, interState);
    const dueDate = body.due_date
      ? String(body.due_date).slice(0, 10)
      : new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10);

    // FY-series invoice number, e.g. INV-2026-27-00012.
    const seq = await query<{ n: string }>(
      `SELECT COUNT(*) + 1 AS n FROM invoices WHERE number LIKE $1`,
      [`INV-${financialYear()}-%`]
    );
    const number = `INV-${financialYear()}-${String(seq.rows[0].n).padStart(5, '0')}`;

    const result = await query<{ id: number }>(
      `INSERT INTO invoices (number, client_id, project_id, due_date, items, discount_percent,
                             place_of_supply, inter_state, taxable, cgst, sgst, igst, total,
                             status, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'sent', $14, $15)
       RETURNING id`,
      [
        number, clientId, projectId, dueDate, JSON.stringify(items), discountPercent,
        placeOfSupply, interState, totals.taxable, totals.cgst, totals.sgst, totals.igst,
        totals.total, notes, Number(session.sub),
      ]
    );
    const invoiceId = result.rows[0].id;

    // Ledger: invoicing debits the client (they owe us the total).
    await query(
      `INSERT INTO ledger_entries (client_id, type, description, debit, ref_id)
       VALUES ($1, 'invoice', $2, $3, $4)`,
      [clientId, `Invoice ${number}`, totals.total, invoiceId]
    );

    return NextResponse.json({ ok: true, id: invoiceId, number }, { status: 201 });
  } catch (err) {
    console.error('Invoice create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
