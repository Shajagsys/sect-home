import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatINR } from '@/lib/constants';
import DashHeader from '@/components/DashHeader';
import NewProjectForm from './NewProjectForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Projects | SecureEdge CRM' };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { client?: string };
}) {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/projects');

  const [projects, clients] = await Promise.all([
    query<{
      id: number; name: string; status: string; value: number;
      renewal_date: string | null; client_name: string; client_company: string | null;
      contract_status: string | null;
    }>(
      `SELECT p.id, p.name, p.status, p.value::float8 AS value,
              p.renewal_date::text AS renewal_date,
              c.name AS client_name, c.company AS client_company,
              (SELECT status FROM contracts WHERE project_id = p.id
               ORDER BY created_at DESC LIMIT 1) AS contract_status
       FROM projects p JOIN clients c ON c.id = p.client_id
       ORDER BY p.created_at DESC`
    ),
    query<{ id: number; name: string; company: string | null }>(
      'SELECT id, name, company FROM clients ORDER BY company NULLS LAST, name'
    ),
  ]);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Projects</h1>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
            <div className="table-wrap">
              <table className="leads" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Value</th>
                    <th>Contract</th>
                    <th>Status</th>
                    <th>Renewal</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.rows.length === 0 && (
                    <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>No projects yet.</td></tr>
                  )}
                  {projects.rows.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/dashboard/projects/${p.id}`} className="lead-name-link">
                          {p.name}
                        </Link>
                      </td>
                      <td>{p.client_company || p.client_name}</td>
                      <td>{formatINR(p.value)}</td>
                      <td>
                        {p.contract_status ? (
                          <span className={`status-pill contract-${p.contract_status}`}>
                            {p.contract_status}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: 13 }}>—</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-pill project-${p.status}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {p.renewal_date ? new Date(p.renewal_date).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <NewProjectForm
              clients={clients.rows}
              defaultClientId={searchParams.client ? Number(searchParams.client) : undefined}
            />
          </div>
        </div>
      </main>
    </>
  );
}
