import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import LeadDetail, { LeadFull, Activity, ProposalSummary } from './LeadDetail';
import type { TeamMember } from '../../LeadsTable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Lead | SecureEdge CRM',
};

export default async function LeadPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=/dashboard/leads/${params.id}`);
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const leadResult = await query<LeadFull>(
    `SELECT l.id, l.name, l.email, l.phone, l.company, l.interest, l.message,
            l.source, l.utm_source, l.utm_medium, l.utm_campaign,
            l.status, l.value::float8 AS value, l.assigned_to,
            l.created_at::text AS created_at, u.name AS assigned_to_name
     FROM leads l
     LEFT JOIN users u ON u.id = l.assigned_to
     WHERE l.id = $1`,
    [id]
  );
  if (leadResult.rowCount === 0) notFound();
  const lead = leadResult.rows[0];

  const [activities, proposals, team] = await Promise.all([
    query<Activity>(
      `SELECT a.id, a.type, a.detail, a.created_at::text AS created_at,
              u.name AS actor_name
       FROM lead_activities a
       LEFT JOIN users u ON u.id = a.actor_id
       WHERE a.lead_id = $1
       ORDER BY a.created_at DESC, a.id DESC
       LIMIT 200`,
      [id]
    ),
    query<ProposalSummary>(
      `SELECT id, title, total::float8 AS total, status, created_at::text AS created_at
       FROM proposals WHERE lead_id = $1 ORDER BY created_at DESC`,
      [id]
    ),
    query<TeamMember>('SELECT id, name FROM users WHERE active ORDER BY name'),
  ]);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <p style={{ marginBottom: 12 }}>
            <Link href="/dashboard">← Back to leads</Link>
          </p>
          <LeadDetail
            lead={lead}
            initialActivities={activities.rows}
            proposals={proposals.rows}
            team={team.rows}
          />
        </div>
      </main>
    </>
  );
}
