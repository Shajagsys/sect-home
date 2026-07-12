import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUSES = ['draft', 'contract_sent', 'signed', 'active', 'completed', 'renewed', 'closed'];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const sets: string[] = [];
  const values: unknown[] = [];
  const push = (col: string, value: unknown) => {
    values.push(value);
    sets.push(`${col} = $${values.length}`);
  };

  if (body.status !== undefined) {
    if (!STATUSES.includes(String(body.status))) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    push('status', String(body.status));
  }
  if (body.name !== undefined) push('name', String(body.name).trim().slice(0, 200));
  if (body.description !== undefined) push('description', String(body.description).trim().slice(0, 4000) || null);
  if (body.value !== undefined) push('value', Number(body.value) || 0);
  if (body.signer_name !== undefined) push('signer_name', String(body.signer_name).trim().slice(0, 120) || null);
  if (body.signer_email !== undefined) push('signer_email', String(body.signer_email).trim().toLowerCase().slice(0, 200) || null);
  if (body.start_date !== undefined) push('start_date', body.start_date ? String(body.start_date).slice(0, 10) : null);
  if (body.end_date !== undefined) push('end_date', body.end_date ? String(body.end_date).slice(0, 10) : null);
  if (body.renewal_date !== undefined) push('renewal_date', body.renewal_date ? String(body.renewal_date).slice(0, 10) : null);

  if (sets.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  try {
    values.push(id);
    const result = await query(
      `UPDATE projects SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING id`,
      values
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Project update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
