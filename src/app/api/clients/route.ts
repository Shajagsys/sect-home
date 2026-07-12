import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await query(
    `SELECT id, name, company, email, phone, gstin, state_code, credit_limit::float8 AS credit_limit,
            portal_enabled, created_at::text AS created_at
     FROM clients ORDER BY created_at DESC`
  );
  return NextResponse.json({ clients: result.rows });
}

/**
 * Create a client — either from explicit fields or from a won lead
 * ({ from_lead_id }). Reuses the existing client when the email already exists.
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    if (body.from_lead_id) {
      const leadId = Number(body.from_lead_id);
      const lead = await query<{ name: string; email: string; phone: string | null; company: string | null }>(
        'SELECT name, email, phone, company FROM leads WHERE id = $1',
        [leadId]
      );
      if (lead.rowCount === 0) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      const l = lead.rows[0];
      const result = await query<{ id: number }>(
        `INSERT INTO clients (name, company, email, phone, lead_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET phone = COALESCE(clients.phone, EXCLUDED.phone)
         RETURNING id`,
        [l.name, l.company, l.email.toLowerCase(), l.phone, leadId]
      );
      return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
    }

    const name = String(body.name || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
    const company = String(body.company || '').trim().slice(0, 160) || null;
    const phone = String(body.phone || '').trim().slice(0, 30) || null;
    const gstin = String(body.gstin || '').trim().toUpperCase().slice(0, 15) || null;
    const address = String(body.address || '').trim().slice(0, 500) || null;
    // Default the GST state from the GSTIN's first two digits when present.
    const stateCode =
      String(body.state_code || '').trim().slice(0, 2) ||
      (gstin ? gstin.slice(0, 2) : '29');
    const creditLimit = Number(body.credit_limit) || 0;

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const result = await query<{ id: number }>(
      `INSERT INTO clients (name, company, email, phone, gstin, address, state_code, credit_limit)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [name, company, email, phone, gstin, address, stateCode, creditLimit]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && (err as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'A client with this email already exists' }, { status: 409 });
    }
    console.error('Client create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
