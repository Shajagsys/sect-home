import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { createPortalToken, PORTAL_COOKIE, sessionCookieOptions } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Client portal login: email + access code issued by the SecureEdge team. */
export async function POST(request: NextRequest) {
  let body: { email?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const code = String(body.code || '');
  if (!email || !code) {
    return NextResponse.json({ error: 'Email and access code are required' }, { status: 400 });
  }

  try {
    const result = await query<{ id: number; name: string; email: string; portal_code_hash: string | null }>(
      'SELECT id, name, email, portal_code_hash FROM clients WHERE email = $1 AND portal_enabled',
      [email]
    );
    const client = result.rows[0];
    const valid = client?.portal_code_hash
      ? await bcrypt.compare(code, client.portal_code_hash)
      : false;
    if (!client || !valid) {
      return NextResponse.json({ error: 'Invalid email or access code' }, { status: 401 });
    }

    const token = await createPortalToken({
      clientId: client.id,
      name: client.name,
      email: client.email,
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(PORTAL_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (err) {
    console.error('Portal login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
