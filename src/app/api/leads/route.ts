import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { notifyNewLead } from '@/lib/mailer';

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
  const utmSource = String(body.utm_source || '').trim().slice(0, 100) || null;
  const utmMedium = String(body.utm_medium || '').trim().slice(0, 100) || null;
  const utmCampaign = String(body.utm_campaign || '').trim().slice(0, 100) || null;
  // Campaign traffic (e.g. a LinkedIn/Facebook ad with ?utm_source=) is
  // attributed to that channel instead of the generic "website" source.
  const source = utmSource ? `social:${utmSource}` : 'website';

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  try {
    const result = await query<{ id: number }>(
      `INSERT INTO leads (name, email, phone, company, interest, message, source,
                          utm_source, utm_medium, utm_campaign)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [name, email, phone, company, interest, message, source, utmSource, utmMedium, utmCampaign]
    );
    const id = result.rows[0].id;
    await logActivity(id, 'created', `Lead captured from ${source}`);
    notifyNewLead({ id, name, email, phone, company, interest, message, source });
    return NextResponse.json({ ok: true, id }, { status: 201 });
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
              l.source, l.status, l.value, l.assigned_to, l.created_at,
              u.name AS assigned_to_name
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
