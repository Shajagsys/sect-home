import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Admin only: update a team member (role, active, password reset, name/phone). */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.name !== undefined) {
    const name = String(body.name).trim().slice(0, 120);
    if (!name) return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
    values.push(name);
    sets.push(`name = $${values.length}`);
  }
  if (body.phone !== undefined) {
    values.push(String(body.phone).trim().slice(0, 30) || null);
    sets.push(`phone = $${values.length}`);
  }
  if (body.role !== undefined) {
    const role = body.role === 'admin' ? 'admin' : 'sales';
    if (id === Number(session.sub) && role !== 'admin') {
      return NextResponse.json({ error: 'You cannot remove your own admin role' }, { status: 400 });
    }
    values.push(role);
    sets.push(`role = $${values.length}`);
  }
  if (body.active !== undefined) {
    const active = Boolean(body.active);
    if (id === Number(session.sub) && !active) {
      return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 });
    }
    values.push(active);
    sets.push(`active = $${values.length}`);
  }
  if (body.password !== undefined) {
    const password = String(body.password);
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    values.push(await bcrypt.hash(password, 12));
    sets.push(`password_hash = $${values.length}`);
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  try {
    values.push(id);
    const result = await query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING id`,
      values
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('User update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
