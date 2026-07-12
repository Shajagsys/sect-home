import { NextResponse } from 'next/server';
import { PORTAL_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/portal', request.url), { status: 303 });
  response.cookies.set(PORTAL_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
