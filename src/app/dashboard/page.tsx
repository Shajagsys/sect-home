import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import LeadsTable, { Lead, TeamMember } from './LeadsTable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CRM Dashboard | SecureEdge Cyber Technologies LLP',
};

async function getLeads(): Promise<Lead[]> {
  const result = await query<Lead>(
    `SELECT l.id, l.name, l.email, l.phone, l.company, l.interest,
            l.source, l.status, l.value::float8 AS value, l.assigned_to,
            l.created_at::text AS created_at, u.name AS assigned_to_name
     FROM leads l
     LEFT JOIN users u ON u.id = l.assigned_to
     ORDER BY l.created_at DESC
     LIMIT 500`
  );
  return result.rows;
}

async function getTeam(): Promise<TeamMember[]> {
  const result = await query<TeamMember>(
    'SELECT id, name FROM users WHERE active ORDER BY name'
  );
  return result.rows;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?next=/dashboard');
  }

  let leads: Lead[] = [];
  let team: TeamMember[] = [];
  let loadError = false;
  try {
    [leads, team] = await Promise.all([getLeads(), getTeam()]);
  } catch (err) {
    console.error('Dashboard load error:', err);
    loadError = true;
  }

  const counts = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});
  const openPipelineValue = leads
    .filter((l) => !['won', 'lost'].includes(l.status))
    .reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <>
      <DashHeader session={session} />

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
              <div className="stat-label">In Progress</div>
              <div className="stat-value">
                {(counts['contacted'] || 0) +
                  (counts['qualified'] || 0) +
                  (counts['proposal'] || 0) +
                  (counts['negotiation'] || 0)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Won</div>
              <div className="stat-value">{counts['won'] || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Open Pipeline</div>
              <div className="stat-value">
                ₹{openPipelineValue.toLocaleString('en-IN')}
              </div>
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
            <LeadsTable initialLeads={leads} team={team} />
          )}
        </div>
      </main>
    </>
  );
}
