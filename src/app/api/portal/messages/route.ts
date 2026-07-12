import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getPortalSession } from '@/lib/auth';
import { notifyTeam } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Client side of the conversation thread. */
export async function POST(request: NextRequest) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
      `INSERT INTO client_messages (client_id, sender, body)
       VALUES ($1, 'client', $2) RETURNING id, created_at::text AS created_at`,
      [session.clientId, text]
    );
    notifyTeam(
      `Portal message from ${session.name}`,
      `<p><strong>${session.name}</strong> (${session.email}) wrote:</p><blockquote>${text}</blockquote>
       <p><a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard/clients/${session.clientId}">Reply in CRM</a></p>`
    );
    return NextResponse.json(
      {
        ok: true,
        message: {
          id: result.rows[0].id,
          sender: 'client',
          author: session.name,
          body: text,
          created_at: result.rows[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Portal message error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
