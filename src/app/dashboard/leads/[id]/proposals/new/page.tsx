import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import ProposalForm from './ProposalForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Proposal | SecureEdge CRM',
};

export default async function NewProposalPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=/dashboard/leads/${params.id}/proposals/new`);
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const lead = await query<{ id: number; name: string; company: string | null; interest: string | null }>(
    'SELECT id, name, company, interest FROM leads WHERE id = $1',
    [id]
  );
  if (lead.rowCount === 0) notFound();

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <p style={{ marginBottom: 12 }}>
            <Link href={`/dashboard/leads/${id}`}>← Back to lead</Link>
          </p>
          <h1 style={{ fontSize: 24, color: 'var(--navy)', marginBottom: 4 }}>
            New Proposal for {lead.rows[0].name}
            {lead.rows[0].company ? ` (${lead.rows[0].company})` : ''}
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Build a line-item quotation. Creating a proposal automatically moves the lead to
            the &quot;Proposal Sent&quot; stage.
          </p>
          <ProposalForm leadId={id} defaultTitle={lead.rows[0].interest || ''} />
        </div>
      </main>
    </>
  );
}
