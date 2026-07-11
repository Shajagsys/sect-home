import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Protected: list team members (used for lead assignment and admin screen). */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const result = await query(
      `SELECT id, name, email, role, phone, active, created_at::text AS created_at
       FROM users ORDER BY name`
    );
    return NextResponse.json({ users: result.rows });
  } catch (err) {
    console.error('User list error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/** Admin only: create a team member. */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone || '').trim().slice(0, 30) || null;
  const password = String(body.password || '');
  const role = body.role === 'admin' ? 'admin' : 'sales';

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await query<{ id: number }>(
      `INSERT INTO users (name, email, password_hash, role, phone)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, hash, role, phone]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && (err as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }
    console.error('User create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
