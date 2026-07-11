import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Protected endpoint: add a note to a lead's activity timeline. */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
  }

  let body: { note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const note = String(body.note || '').trim().slice(0, 4000);
  if (!note) {
    return NextResponse.json({ error: 'Note cannot be empty' }, { status: 400 });
  }

  try {
    const lead = await query('SELECT id FROM leads WHERE id = $1', [id]);
    if (lead.rowCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    const result = await query<{ id: number; created_at: string }>(
      `INSERT INTO lead_activities (lead_id, actor_id, type, detail)
       VALUES ($1, $2, 'note', $3)
       RETURNING id, created_at::text AS created_at`,
      [id, Number(session.sub), note]
    );
    return NextResponse.json(
      {
        ok: true,
        activity: {
          id: result.rows[0].id,
          type: 'note',
          detail: note,
          actor_name: session.name,
          created_at: result.rows[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Note insert error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
