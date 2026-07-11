import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Admin only: list webhook API keys. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  try {
    const result = await query(
      `SELECT id, name, key, source_label, active, created_at::text AS created_at
       FROM webhook_keys ORDER BY created_at DESC`
    );
    return NextResponse.json({ keys: result.rows });
  } catch (err) {
    console.error('Webhook key list error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/** Admin only: create a webhook API key for a lead source. */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  const sourceLabel =
    String(body.source_label || '').trim().toLowerCase().slice(0, 60) || 'webhook';
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const key = `sect_${randomBytes(24).toString('hex')}`;
  try {
    const result = await query<{ id: number }>(
      'INSERT INTO webhook_keys (name, key, source_label) VALUES ($1, $2, $3) RETURNING id',
      [name, key, sourceLabel]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id, key }, { status: 201 });
  } catch (err) {
    console.error('Webhook key create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
