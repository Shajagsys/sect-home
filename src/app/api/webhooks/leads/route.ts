import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/activity';
import { notifyNewLead } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Inbound lead-collection webhook.
 *
 * Connect Facebook/Instagram Lead Ads, LinkedIn Lead Gen Forms, Google Ads,
 * landing pages or chatbots (directly or via Zapier/Make/n8n) by POSTing JSON:
 *
 *   POST /api/webhooks/leads
 *   Header: x-api-key: <key from Dashboard → Webhooks>
 *   Body:   { "name": "...", "email": "...", "phone": "...", "company": "...",
 *             "interest": "...", "message": "...", "source": "facebook" }
 *
 * `source` is optional — it defaults to the key's configured source label.
 */
export async function POST(request: NextRequest) {
  const apiKey =
    request.headers.get('x-api-key') || request.nextUrl.searchParams.get('key') || '';
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }

  let keyRow: { id: number; name: string; source_label: string };
  try {
    const result = await query<{ id: number; name: string; source_label: string }>(
      'SELECT id, name, source_label FROM webhook_keys WHERE key = $1 AND active',
      [apiKey]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    keyRow = result.rows[0];
  } catch (err) {
    console.error('Webhook key lookup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = String(body.name || body.full_name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone || body.phone_number || '').trim().slice(0, 30) || null;
  const company = String(body.company || body.company_name || '').trim().slice(0, 160) || null;
  const interest = String(body.interest || body.product || '').trim().slice(0, 200) || null;
  const message = String(body.message || body.notes || '').trim().slice(0, 2000) || null;
  const source = (String(body.source || '').trim().slice(0, 60) || keyRow.source_label).toLowerCase();

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'a valid email is required' }, { status: 400 });
  }

  try {
    const result = await query<{ id: number }>(
      `INSERT INTO leads (name, email, phone, company, interest, message, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, email, phone, company, interest, message, source]
    );
    const id = result.rows[0].id;
    await logActivity(id, 'created', `Lead received via webhook "${keyRow.name}" (source: ${source})`);
    notifyNewLead({ id, name, email, phone, company, interest, message, source });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error('Webhook lead insert error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
