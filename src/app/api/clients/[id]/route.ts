import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Update client details, credit limit, or portal access. */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid client id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const sets: string[] = [];
  const values: unknown[] = [];
  const push = (fragment: string, value: unknown) => {
    values.push(value);
    sets.push(`${fragment} = $${values.length}`);
  };

  if (body.name !== undefined) push('name', String(body.name).trim().slice(0, 120));
  if (body.company !== undefined) push('company', String(body.company).trim().slice(0, 160) || null);
  if (body.phone !== undefined) push('phone', String(body.phone).trim().slice(0, 30) || null);
  if (body.gstin !== undefined) push('gstin', String(body.gstin).trim().toUpperCase().slice(0, 15) || null);
  if (body.address !== undefined) push('address', String(body.address).trim().slice(0, 500) || null);
  if (body.state_code !== undefined) push('state_code', String(body.state_code).trim().slice(0, 2) || '29');
  if (body.credit_limit !== undefined) {
    const limit = Number(body.credit_limit);
    if (!Number.isFinite(limit) || limit < 0) {
      return NextResponse.json({ error: 'Invalid credit limit' }, { status: 400 });
    }
    push('credit_limit', limit);
  }
  if (body.portal_enabled !== undefined) push('portal_enabled', Boolean(body.portal_enabled));
  if (body.portal_code !== undefined) {
    const code = String(body.portal_code);
    if (code.length < 6) {
      return NextResponse.json({ error: 'Portal access code must be at least 6 characters' }, { status: 400 });
    }
    push('portal_code_hash', await bcrypt.hash(code, 12));
    push('portal_enabled', true);
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  try {
    values.push(id);
    const result = await query(
      `UPDATE clients SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING id`,
      values
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Client update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
