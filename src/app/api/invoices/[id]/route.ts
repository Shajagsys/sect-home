import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUSES = ['draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled'];

/** Update invoice status (e.g. mark overdue or cancel). */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid invoice id' }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const status = String(body.status || '');
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const existing = await query<{ client_id: number; number: string; total: string; status: string }>(
      'SELECT client_id, number, total, status FROM invoices WHERE id = $1',
      [id]
    );
    if (existing.rowCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    await query('UPDATE invoices SET status = $1 WHERE id = $2', [status, id]);

    // Cancelling reverses the receivable in the client ledger.
    if (status === 'cancelled' && existing.rows[0].status !== 'cancelled') {
      await query(
        `INSERT INTO ledger_entries (client_id, type, description, credit, ref_id)
         VALUES ($1, 'credit_note', $2, $3, $4)`,
        [existing.rows[0].client_id, `Invoice ${existing.rows[0].number} cancelled`,
         Number(existing.rows[0].total), id]
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Invoice update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
