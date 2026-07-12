import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  verifyPortalToken,
  SESSION_COOKIE,
  PORTAL_COOKIE,
} from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/dashboard')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', path);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Client portal: /portal is the login page, everything under it needs a
  // client session.
  if (path.startsWith('/portal/')) {
    const token = request.cookies.get(PORTAL_COOKIE)?.value;
    const session = token ? await verifyPortalToken(token) : null;
    if (!session) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*'],
};
