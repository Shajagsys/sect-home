import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUSES = ['requested', 'approved', 'ordered', 'received', 'billed', 'cancelled'];

/** Advance a purchase order through its lifecycle. Approval is admin-only. */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid PO id' }, { status: 400 });
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
  if (status === 'approved' && session.role !== 'admin') {
    return NextResponse.json({ error: 'Only an admin can approve purchase orders' }, { status: 403 });
  }

  try {
    const result = await query('UPDATE purchase_orders SET status = $1 WHERE id = $2 RETURNING id', [
      status, id,
    ]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PO update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
