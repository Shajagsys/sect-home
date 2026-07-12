import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Team side of the client conversation thread. */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid client id' }, { status: 400 });
  }

  let body: { body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const text = String(body.body || '').trim().slice(0, 4000);
  if (!text) return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });

  try {
    const result = await query<{ id: number; created_at: string }>(
      `INSERT INTO client_messages (client_id, sender, user_id, body)
       VALUES ($1, 'team', $2, $3) RETURNING id, created_at::text AS created_at`,
      [id, Number(session.sub), text]
    );
    return NextResponse.json(
      {
        ok: true,
        message: {
          id: result.rows[0].id,
          sender: 'team',
          author: session.name,
          body: text,
          created_at: result.rows[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Message error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
