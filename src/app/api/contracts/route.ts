import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Create a contract for a project and mark it sent (returns the e-sign link). */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const projectId = Number(body.project_id);
  const title = String(body.title || '').trim().slice(0, 200);
  const contractBody = String(body.body || '').trim().slice(0, 20000);
  const signerName = String(body.signer_name || '').trim().slice(0, 120);
  const signerEmail = String(body.signer_email || '').trim().toLowerCase().slice(0, 200);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }
  if (!title || !contractBody) {
    return NextResponse.json({ error: 'Title and contract terms are required' }, { status: 400 });
  }
  if (!signerName || !signerEmail) {
    return NextResponse.json({ error: 'Signer name and email are required' }, { status: 400 });
  }

  try {
    const project = await query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (project.rowCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const token = randomBytes(24).toString('hex');
    const result = await query<{ id: number }>(
      `INSERT INTO contracts (project_id, title, body, status, signer_name, signer_email,
                              sign_token, sent_at, created_by)
       VALUES ($1, $2, $3, 'sent', $4, $5, $6, now(), $7) RETURNING id`,
      [projectId, title, contractBody, signerName, signerEmail, token, Number(session.sub)]
    );

    // Keep the project's signer + workflow stage in sync.
    await query(
      `UPDATE projects SET signer_name = $1, signer_email = $2,
              status = CASE WHEN status = 'draft' THEN 'contract_sent' ELSE status END
       WHERE id = $3`,
      [signerName, signerEmail, projectId]
    );

    return NextResponse.json(
      { ok: true, id: result.rows[0].id, sign_url: `/sign/${token}` },
      { status: 201 }
    );
  } catch (err) {
    console.error('Contract create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
