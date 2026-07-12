import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public e-sign endpoint. The signer opens /sign/<token>, reviews the
 * contract, and submits their typed full name as the signature.
 */
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const token = String(params.token || '').slice(0, 64);

  let body: { signed_name?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const contract = await query<{ id: number; project_id: number; status: string; signer_name: string }>(
      'SELECT id, project_id, status, signer_name FROM contracts WHERE sign_token = $1',
      [token]
    );
    if (contract.rowCount === 0) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }
    const c = contract.rows[0];
    if (c.status === 'signed') {
      return NextResponse.json({ error: 'This contract is already signed' }, { status: 409 });
    }
    if (c.status === 'declined') {
      return NextResponse.json({ error: 'This contract was declined' }, { status: 409 });
    }

    if (body.action === 'decline') {
      await query(`UPDATE contracts SET status = 'declined' WHERE id = $1`, [c.id]);
      return NextResponse.json({ ok: true, status: 'declined' });
    }

    const signedName = String(body.signed_name || '').trim().slice(0, 120);
    if (signedName.length < 3) {
      return NextResponse.json({ error: 'Please type your full name to sign' }, { status: 400 });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    await query(
      `UPDATE contracts SET status = 'signed', signed_at = now(), signed_name = $1, signed_ip = $2
       WHERE id = $3`,
      [signedName, ip, c.id]
    );
    await query(
      `UPDATE projects SET status = 'signed' WHERE id = $1 AND status IN ('draft', 'contract_sent')`,
      [c.project_id]
    );

    return NextResponse.json({ ok: true, status: 'signed' });
  } catch (err) {
    console.error('Sign error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
