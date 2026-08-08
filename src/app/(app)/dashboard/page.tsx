import Link from 'next/link';
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

interface ActionCenter {
  overdue_invoices: number;
  renewals_due: number;
  new_requests: number;
  unread_client_msgs: number;
}

async function getActionCenter(): Promise<ActionCenter> {
  // Passive overdue detection: promote past-due open invoices on dashboard load.
  await query(
    `UPDATE invoices SET status = 'overdue'
     WHERE status IN ('sent', 'partial') AND due_date < CURRENT_DATE`
  );
  const result = await query<ActionCenter>(
    `SELECT
       (SELECT COUNT(*) FROM invoices WHERE status = 'overdue')::int AS overdue_invoices,
       (SELECT COUNT(*) FROM projects
        WHERE renewal_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 60
          AND status NOT IN ('closed'))::int AS renewals_due,
       (SELECT COUNT(*) FROM project_requests WHERE status = 'new')::int AS new_requests,
       (SELECT COUNT(*) FROM client_messages m
        WHERE m.sender = 'client'
          AND m.created_at > now() - interval '7 days')::int AS unread_client_msgs`
  );
  return result.rows[0];
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?next=/dashboard');
  }

  let leads: Lead[] = [];
  let team: TeamMember[] = [];
  let actions: ActionCenter | null = null;
  let loadError = false;
  try {
    [leads, team, actions] = await Promise.all([getLeads(), getTeam(), getActionCenter()]);
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

          {actions && (actions.overdue_invoices > 0 || actions.renewals_due > 0 ||
            actions.new_requests > 0 || actions.unread_client_msgs > 0) && (
            <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent)' }}>
              <h3>Action Center</h3>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 8, fontSize: 14 }}>
                {actions.overdue_invoices > 0 && (
                  <Link href="/dashboard/accounts/invoices">
                    ⚠️ <strong>{actions.overdue_invoices}</strong> overdue invoice{actions.overdue_invoices > 1 ? 's' : ''}
                  </Link>
                )}
                {actions.renewals_due > 0 && (
                  <Link href="/dashboard/projects">
                    🔄 <strong>{actions.renewals_due}</strong> renewal{actions.renewals_due > 1 ? 's' : ''} due in 60 days
                  </Link>
                )}
                {actions.new_requests > 0 && (
                  <Link href="/dashboard/clients">
                    📥 <strong>{actions.new_requests}</strong> new portal request{actions.new_requests > 1 ? 's' : ''}
                  </Link>
                )}
                {actions.unread_client_msgs > 0 && (
                  <Link href="/dashboard/clients">
                    💬 <strong>{actions.unread_client_msgs}</strong> client message{actions.unread_client_msgs > 1 ? 's' : ''} this week
                  </Link>
                )}
              </div>
            </div>
          )}

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
