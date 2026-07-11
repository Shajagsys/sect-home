import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public endpoint: the website lead-generation form posts here. */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone || '').trim().slice(0, 30) || null;
  const company = String(body.company || '').trim().slice(0, 160) || null;
  const interest = String(body.interest || '').trim().slice(0, 200) || null;
  const message = String(body.message || '').trim().slice(0, 2000) || null;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  try {
    const result = await query<{ id: number }>(
      `INSERT INTO leads (name, email, phone, company, interest, message, source)
       VALUES ($1, $2, $3, $4, $5, $6, 'website')
       RETURNING id`,
      [name, email, phone, company, interest, message]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    console.error('Lead insert error:', err);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}

/** Protected endpoint: list leads for the CRM dashboard. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await query(
      `SELECT l.id, l.name, l.email, l.phone, l.company, l.interest, l.message,
              l.source, l.status, l.created_at, u.name AS assigned_to_name
       FROM leads l
       LEFT JOIN users u ON u.id = l.assigned_to
       ORDER BY l.created_at DESC
       LIMIT 500`
    );
    return NextResponse.json({ leads: result.rows });
  } catch (err) {
    console.error('Lead list error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
