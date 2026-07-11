import Link from 'next/link';
import type { SessionPayload } from '@/lib/auth';

export default function DashHeader({ session }: { session: SessionPayload }) {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/dashboard" className="brand">
          <span className="brand-mark">SE</span>
          <span className="brand-name">
            SecureEdge CRM
            <small>Leads &amp; Pipeline</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Dashboard navigation">
          <Link href="/dashboard">Leads</Link>
          <Link href="/dashboard/reports">Reports</Link>
          {session.role === 'admin' && <Link href="/dashboard/users">Team</Link>}
          {session.role === 'admin' && <Link href="/dashboard/webhooks">Webhooks</Link>}
          <Link href="/">Website</Link>
          <form action="/api/auth/logout" method="post" style={{ display: 'inline' }}>
            <button className="login-link" type="submit" style={{ border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
