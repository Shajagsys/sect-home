import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { clientScore, scoreBand } from '@/lib/score';
import { formatINR } from '@/lib/constants';
import { stateName } from '@/lib/gst';
import DashHeader from '@/components/DashHeader';
import ChatThread, { ChatMessage } from '@/components/ChatThread';
import PortalAccessCard from './PortalAccessCard';
import RequestsCard, { RequestRow } from './RequestsCard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Client | SecureEdge CRM' };

export default async function ClientPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect(`/login?next=/dashboard/clients/${params.id}`);

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const clientResult = await query<{
    id: number; name: string; company: string | null; email: string; phone: string | null;
    gstin: string | null; address: string | null; state_code: string;
    credit_limit: number; portal_enabled: boolean; created_at: string;
  }>(
    `SELECT id, name, company, email, phone, gstin, address, state_code,
            credit_limit::float8 AS credit_limit, portal_enabled, created_at::text AS created_at
     FROM clients WHERE id = $1`,
    [id]
  );
  if (clientResult.rowCount === 0) notFound();
  const client = clientResult.rows[0];

  const [ledger, projects, invoices, messages, requests, scoreAgg] = await Promise.all([
    query<{ id: number; entry_date: string; type: string; description: string; debit: number; credit: number }>(
      `SELECT id, entry_date::text AS entry_date, type, description,
              debit::float8 AS debit, credit::float8 AS credit
       FROM ledger_entries WHERE client_id = $1 ORDER BY entry_date DESC, id DESC LIMIT 100`,
      [id]
    ),
    query<{ id: number; name: string; status: string; value: number; renewal_date: string | null }>(
      `SELECT id, name, status, value::float8 AS value, renewal_date::text AS renewal_date
       FROM projects WHERE client_id = $1 ORDER BY created_at DESC`,
      [id]
    ),
    query<{ id: number; number: string; issue_date: string; total: number; amount_paid: number; status: string }>(
      `SELECT id, number, issue_date::text AS issue_date, total::float8 AS total,
              amount_paid::float8 AS amount_paid, status
       FROM invoices WHERE client_id = $1 ORDER BY created_at DESC`,
      [id]
    ),
    query<ChatMessage>(
      `SELECT m.id, m.sender, m.body, m.created_at::text AS created_at, u.name AS author
       FROM client_messages m LEFT JOIN users u ON u.id = m.user_id
       WHERE m.client_id = $1 ORDER BY m.created_at ASC LIMIT 200`,
      [id]
    ),
    query<RequestRow>(
      `SELECT id, type, title, details, status, created_at::text AS created_at
       FROM project_requests WHERE client_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [id]
    ),
    query<{ invoiced: number; paid: number; overdue_count: number }>(
      `SELECT COALESCE(SUM(total),0)::float8 AS invoiced,
              COALESCE(SUM(amount_paid),0)::float8 AS paid,
              COUNT(*) FILTER (WHERE status NOT IN ('paid','cancelled')
                               AND due_date < CURRENT_DATE)::int AS overdue_count
       FROM invoices WHERE client_id = $1`,
      [id]
    ),
  ]);

  const balance = ledger.rows.reduce((sum, e) => sum + e.debit - e.credit, 0);
  const score = clientScore({
    invoicedTotal: scoreAgg.rows[0].invoiced,
    paidTotal: scoreAgg.rows[0].paid,
    overdueCount: scoreAgg.rows[0].overdue_count,
    lastActivityDays: 0,
  });
  const band = scoreBand(score);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <p style={{ marginBottom: 12 }}><Link href="/dashboard/clients">← All clients</Link></p>

          <div className="dash-header">
            <h1>{client.company || client.name}</h1>
            <span className={`status-pill ${band.cls}`} style={{ fontSize: 14 }}>
              Client Score: {score} · {band.label}
            </span>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total Invoiced</div>
              <div className="stat-value">{formatINR(scoreAgg.rows[0].invoiced)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">{balance >= 0 ? 'Outstanding' : 'Credit Balance'}</div>
              <div className="stat-value">{formatINR(Math.abs(balance))}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Credit Limit</div>
              <div className="stat-value">{formatINR(client.credit_limit)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Projects</div>
              <div className="stat-value">{projects.rows.length}</div>
            </div>
          </div>

          <div className="lead-layout">
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <h3>Details</h3>
                <dl className="lead-meta">
                  <div><dt>Contact</dt><dd>{client.name}</dd></div>
                  <div><dt>Email</dt><dd>{client.email}</dd></div>
                  <div><dt>Phone</dt><dd>{client.phone || '—'}</dd></div>
                  <div><dt>GSTIN</dt><dd>{client.gstin || '—'}</dd></div>
                  <div><dt>GST State</dt><dd>{stateName(client.state_code)} ({client.state_code})</dd></div>
                  <div><dt>Client since</dt><dd>{new Date(client.created_at).toLocaleDateString()}</dd></div>
                </dl>
                {client.address && <blockquote className="lead-message">{client.address}</blockquote>}
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <div className="dash-header" style={{ marginBottom: 10 }}>
                  <h3>Projects</h3>
                  <Link href={`/dashboard/projects?client=${client.id}`} className="btn btn-primary btn-sm">
                    + New Project
                  </Link>
                </div>
                {projects.rows.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>No projects yet.</p>
                ) : (
                  <ul className="proposal-list">
                    {projects.rows.map((p) => (
                      <li key={p.id}>
                        <Link href={`/dashboard/projects/${p.id}`}>{p.name}</Link>
                        <span>
                          {formatINR(p.value)} · <span className={`status-pill project-${p.status}`}>{p.status.replace('_', ' ')}</span>
                          {p.renewal_date && (
                            <span style={{ marginLeft: 6, color: 'var(--muted)', fontSize: 12 }}>
                              renews {new Date(p.renewal_date).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <h3>Invoices</h3>
                {invoices.rows.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>No invoices yet.</p>
                ) : (
                  <ul className="proposal-list">
                    {invoices.rows.map((inv) => (
                      <li key={inv.id}>
                        <Link href={`/dashboard/accounts/invoices/${inv.id}`}>{inv.number}</Link>
                        <span>
                          {formatINR(inv.total)} · <span className={`status-pill invoice-${inv.status}`}>{inv.status}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <h3>Client Ledger</h3>
                {ledger.rows.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>No ledger entries yet.</p>
                ) : (
                  <div className="table-wrap" style={{ border: 'none' }}>
                    <table className="leads" style={{ minWidth: 480 }}>
                      <thead>
                        <tr><th>Date</th><th>Description</th><th>Debit</th><th>Credit</th></tr>
                      </thead>
                      <tbody>
                        {ledger.rows.map((e) => (
                          <tr key={e.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>{new Date(e.entry_date).toLocaleDateString()}</td>
                            <td>{e.description}</td>
                            <td>{e.debit > 0 ? formatINR(e.debit) : '—'}</td>
                            <td>{e.credit > 0 ? formatINR(e.credit) : '—'}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ fontWeight: 800 }}>
                            {balance >= 0 ? 'Balance receivable' : 'Credit balance'}
                          </td>
                          <td colSpan={2} style={{ fontWeight: 800 }}>{formatINR(Math.abs(balance))}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <PortalAccessCard clientId={client.id} portalEnabled={client.portal_enabled} />
            </div>

            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <h3>Conversation</h3>
                <ChatThread
                  initialMessages={messages.rows}
                  viewer="team"
                  postUrl={`/api/clients/${client.id}/messages`}
                />
              </div>
              <RequestsCard requests={requests.rows} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
