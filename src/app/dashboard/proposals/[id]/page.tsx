import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { computeTotals, ProposalItem } from '@/lib/proposals';
import { formatINR } from '@/lib/constants';
import { COMPANY } from '@/lib/company';
import ProposalActions from './ProposalActions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Proposal | SecureEdge CRM',
};

interface ProposalRow {
  id: number;
  lead_id: number;
  title: string;
  items: ProposalItem[];
  tax_percent: number;
  discount_percent: number;
  notes: string | null;
  valid_until: string | null;
  status: string;
  created_at: string;
  created_by_name: string | null;
  lead_name: string;
  lead_email: string;
  lead_phone: string | null;
  lead_company: string | null;
}

export default async function ProposalPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=/dashboard/proposals/${params.id}`);
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const result = await query<ProposalRow>(
    `SELECT p.id, p.lead_id, p.title, p.items, p.tax_percent::float8 AS tax_percent,
            p.discount_percent::float8 AS discount_percent, p.notes,
            p.valid_until::text AS valid_until, p.status, p.created_at::text AS created_at,
            u.name AS created_by_name,
            l.name AS lead_name, l.email AS lead_email, l.phone AS lead_phone,
            l.company AS lead_company
     FROM proposals p
     JOIN leads l ON l.id = p.lead_id
     LEFT JOIN users u ON u.id = p.created_by
     WHERE p.id = $1`,
    [id]
  );
  if (result.rowCount === 0) notFound();
  const proposal = result.rows[0];
  const totals = computeTotals(proposal.items, proposal.tax_percent, proposal.discount_percent);

  return (
    <>
      <div className="no-print">
        <header className="site-header">
          <div className="container">
            <Link href="/dashboard" className="brand">
              <span className="brand-mark">SE</span>
              <span className="brand-name">
                SecureEdge CRM
                <small>Proposal #{proposal.id}</small>
              </span>
            </Link>
            <nav className="main-nav">
              <Link href={`/dashboard/leads/${proposal.lead_id}`}>← Back to lead</Link>
            </nav>
          </div>
        </header>
      </div>

      <main className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="no-print" style={{ marginBottom: 20 }}>
            <ProposalActions proposalId={proposal.id} status={proposal.status} />
          </div>

          <div className="proposal-doc">
            <div className="proposal-head">
              <div>
                <h1>{COMPANY.name}</h1>
                <p>{COMPANY.tagline}</p>
                <p>{COMPANY.email}</p>
              </div>
              <div className="proposal-id">
                <h2>PROPOSAL</h2>
                <p>#{String(proposal.id).padStart(5, '0')}</p>
                <p>{new Date(proposal.created_at).toLocaleDateString()}</p>
                {proposal.valid_until && (
                  <p>Valid until: {new Date(proposal.valid_until).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div className="proposal-to">
              <h3>Prepared for</h3>
              <p>
                <strong>{proposal.lead_name}</strong>
                {proposal.lead_company && <> · {proposal.lead_company}</>}
              </p>
              <p>
                {proposal.lead_email}
                {proposal.lead_phone && <> · {proposal.lead_phone}</>}
              </p>
            </div>

            <h3 className="proposal-title">{proposal.title}</h3>

            <table className="items-table doc">
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ width: '55%' }}>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {proposal.items.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.qty}</td>
                    <td>{formatINR(item.unit_price)}</td>
                    <td>{formatINR(item.qty * item.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals-box doc">
              <div>
                <span>Subtotal</span>
                <span>{formatINR(totals.subtotal)}</span>
              </div>
              {proposal.discount_percent > 0 && (
                <div>
                  <span>Discount ({proposal.discount_percent}%)</span>
                  <span>− {formatINR(totals.discount)}</span>
                </div>
              )}
              <div>
                <span>Tax / GST ({proposal.tax_percent}%)</span>
                <span>{formatINR(totals.tax)}</span>
              </div>
              <div className="grand">
                <span>Total</span>
                <span>{formatINR(totals.total)}</span>
              </div>
            </div>

            {proposal.notes && (
              <div className="proposal-notes">
                <h3>Terms &amp; Notes</h3>
                <p>{proposal.notes}</p>
              </div>
            )}

            <p className="proposal-footer">
              Prepared by {proposal.created_by_name || COMPANY.name} · {COMPANY.name}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
