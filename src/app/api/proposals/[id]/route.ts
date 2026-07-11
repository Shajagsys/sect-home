import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { PROPOSAL_STATUSES } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Protected: update a proposal's status (draft → sent → accepted/rejected). */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid proposal id' }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const status = String(body.status || '');
  if (!(PROPOSAL_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const result = await query<{ lead_id: number; title: string }>(
      'UPDATE proposals SET status = $1, updated_at = now() WHERE id = $2 RETURNING lead_id, title',
      [status, id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const { lead_id: leadId, title } = result.rows[0];
    const actorId = Number(session.sub);
    await logActivity(leadId, 'proposal', `Proposal #${id} ("${title}") marked ${status}`, actorId);

    // Accepted/rejected proposals advance the lead lifecycle automatically.
    if (status === 'accepted') {
      await query(`UPDATE leads SET status = 'won', updated_at = now() WHERE id = $1`, [leadId]);
      await logActivity(leadId, 'status_change', 'Stage changed to Won (proposal accepted)', actorId);
    } else if (status === 'sent') {
      await query(
        `UPDATE leads SET status = 'negotiation', updated_at = now()
         WHERE id = $1 AND status NOT IN ('won', 'lost')`,
        [leadId]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Proposal update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
