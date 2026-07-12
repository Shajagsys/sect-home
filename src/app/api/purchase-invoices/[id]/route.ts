import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Mark a vendor bill paid / unpaid / cancelled. */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid bill id' }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const status = String(body.status || '');
  if (!['unpaid', 'paid', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const result = await query(
      `UPDATE purchase_invoices
       SET status = $1, paid_on = CASE WHEN $1 = 'paid' THEN CURRENT_DATE ELSE paid_on END
       WHERE id = $2 RETURNING id`,
      [status, id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Purchase invoice update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
