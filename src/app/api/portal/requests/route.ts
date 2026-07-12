import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getPortalSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TYPES = ['new_project', 'renewal', 'support', 'other'];

/** Client raises a project / renewal / support request from the portal. */
export async function POST(request: NextRequest) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const type = TYPES.includes(String(body.type)) ? String(body.type) : 'new_project';
  const title = String(body.title || '').trim().slice(0, 200);
  const details = String(body.details || '').trim().slice(0, 4000) || null;
  const projectId = body.project_id ? Number(body.project_id) : null;
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  try {
    const result = await query<{ id: number }>(
      `INSERT INTO project_requests (client_id, project_id, type, title, details)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [session.clientId, projectId, type, title, details]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    console.error('Portal request error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
