import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatINR } from '@/lib/constants';
import DashHeader from '@/components/DashHeader';
import ProjectWorkflow, { ContractRow, ProjectRow } from './ProjectWorkflow';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Project | SecureEdge CRM' };

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect(`/login?next=/dashboard/projects/${params.id}`);

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const projectResult = await query<ProjectRow>(
    `SELECT p.id, p.name, p.description, p.status, p.value::float8 AS value,
            p.start_date::text AS start_date, p.end_date::text AS end_date,
            p.renewal_date::text AS renewal_date, p.signer_name, p.signer_email,
            p.client_id, c.name AS client_name, c.company AS client_company, c.email AS client_email
     FROM projects p JOIN clients c ON c.id = p.client_id
     WHERE p.id = $1`,
    [id]
  );
  if (projectResult.rowCount === 0) notFound();
  const project = projectResult.rows[0];

  const [contracts, invoices] = await Promise.all([
    query<ContractRow>(
      `SELECT id, title, status, signer_name, signer_email, sign_token,
              sent_at::text AS sent_at, signed_at::text AS signed_at, signed_name
       FROM contracts WHERE project_id = $1 ORDER BY created_at DESC`,
      [id]
    ),
    query<{ id: number; number: string; total: number; status: string }>(
      `SELECT id, number, total::float8 AS total, status
       FROM invoices WHERE project_id = $1 ORDER BY created_at DESC`,
      [id]
    ),
  ]);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <p style={{ marginBottom: 12 }}><Link href="/dashboard/projects">← All projects</Link></p>
          <div className="dash-header">
            <h1>{project.name}</h1>
            <span className={`status-pill project-${project.status}`} style={{ fontSize: 14 }}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
            Client:{' '}
            <Link href={`/dashboard/clients/${project.client_id}`}>
              {project.client_company || project.client_name}
            </Link>{' '}
            · Value: {formatINR(project.value)}
            {project.renewal_date && <> · Renews {new Date(project.renewal_date).toLocaleDateString()}</>}
          </p>

          <ProjectWorkflow project={project} contracts={contracts.rows} invoices={invoices.rows} />
        </div>
      </main>
    </>
  );
}
