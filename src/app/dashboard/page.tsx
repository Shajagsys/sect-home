import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import LeadsTable, { Lead } from './LeadsTable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CRM Dashboard | SecureEdge Cyber Technologies LLP',
};

async function getLeads(): Promise<Lead[]> {
  const result = await query<Lead>(
    `SELECT l.id, l.name, l.email, l.phone, l.company, l.interest,
            l.source, l.status, l.created_at::text AS created_at
     FROM leads l
     ORDER BY l.created_at DESC
     LIMIT 500`
  );
  return result.rows;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?next=/dashboard');
  }

  let leads: Lead[] = [];
  let loadError = false;
  try {
    leads = await getLeads();
  } catch (err) {
    console.error('Dashboard load error:', err);
    loadError = true;
  }

  const counts = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">
            <span className="brand-mark">SE</span>
            <span className="brand-name">
              SecureEdge CRM
              <small>Leads &amp; Pipeline</small>
            </span>
          </Link>
          <nav className="main-nav">
            <a href="/">Website</a>
            <form action="/api/auth/logout" method="post" style={{ display: 'inline' }}>
              <button className="login-link" type="submit" style={{ border: 'none' }}>
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Leads Dashboard</h1>
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>
              Signed in as <strong>{session.name}</strong> ({session.role})
            </span>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total Leads</div>
              <div className="stat-value">{leads.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">New</div>
              <div className="stat-value">{counts['new'] || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Contacted</div>
              <div className="stat-value">{counts['contacted'] || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Qualified</div>
              <div className="stat-value">{counts['qualified'] || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Won</div>
              <div className="stat-value">{counts['won'] || 0}</div>
            </div>
          </div>

          {loadError ? (
            <div className="card">
              <h3>Could not load leads</h3>
              <p>
                Check that PostgreSQL is running and DATABASE_URL is configured, then run{' '}
                <code>npm run db:init</code>.
              </p>
            </div>
          ) : (
            <LeadsTable initialLeads={leads} />
          )}
        </div>
      </main>
    </>
  );
}
