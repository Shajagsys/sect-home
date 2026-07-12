import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const clientId = Number(body.client_id);
  const name = String(body.name || '').trim().slice(0, 200);
  const description = String(body.description || '').trim().slice(0, 4000) || null;
  const value = Number(body.value) || 0;
  const signerName = String(body.signer_name || '').trim().slice(0, 120) || null;
  const signerEmail = String(body.signer_email || '').trim().toLowerCase().slice(0, 200) || null;
  const startDate = body.start_date ? String(body.start_date).slice(0, 10) : null;
  const renewalDate = body.renewal_date ? String(body.renewal_date).slice(0, 10) : null;
  const leadId = body.lead_id ? Number(body.lead_id) : null;

  if (!Number.isInteger(clientId) || clientId <= 0) {
    return NextResponse.json({ error: 'Client is required' }, { status: 400 });
  }
  if (!name) return NextResponse.json({ error: 'Project name is required' }, { status: 400 });

  try {
    const client = await query('SELECT id FROM clients WHERE id = $1', [clientId]);
    if (client.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    const result = await query<{ id: number }>(
      `INSERT INTO projects (client_id, lead_id, name, description, value, start_date,
                             renewal_date, signer_name, signer_email, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [clientId, leadId, name, description, value, startDate, renewalDate, signerName, signerEmail, Number(session.sub)]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    console.error('Project create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
