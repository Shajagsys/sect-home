import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Record a payment against an invoice; updates status and the client ledger. */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid invoice id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const amount = Number(body.amount);
  const method = String(body.method || 'bank_transfer').slice(0, 40);
  const reference = String(body.reference || '').trim().slice(0, 120) || null;
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
  }

  try {
    const invoice = await query<{ client_id: number; number: string; total: string; amount_paid: string; status: string }>(
      'SELECT client_id, number, total, amount_paid, status FROM invoices WHERE id = $1',
      [id]
    );
    if (invoice.rowCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    const inv = invoice.rows[0];
    if (inv.status === 'cancelled') {
      return NextResponse.json({ error: 'Cannot record payment on a cancelled invoice' }, { status: 400 });
    }
    const newPaid = Number(inv.amount_paid) + amount;
    if (newPaid > Number(inv.total) + 0.01) {
      return NextResponse.json({ error: 'Payment exceeds the invoice balance' }, { status: 400 });
    }

    await query(
      `INSERT INTO invoice_payments (invoice_id, amount, method, reference, created_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, amount, method, reference, Number(session.sub)]
    );
    const newStatus = newPaid >= Number(inv.total) - 0.01 ? 'paid' : 'partial';
    await query('UPDATE invoices SET amount_paid = $1, status = $2 WHERE id = $3', [
      newPaid, newStatus, id,
    ]);
    await query(
      `INSERT INTO ledger_entries (client_id, type, description, credit, ref_id)
       VALUES ($1, 'payment', $2, $3, $4)`,
      [inv.client_id, `Payment received — Invoice ${inv.number}${reference ? ` (${reference})` : ''}`, amount, id]
    );

    return NextResponse.json({ ok: true, status: newStatus, amount_paid: newPaid }, { status: 201 });
  } catch (err) {
    console.error('Payment error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
