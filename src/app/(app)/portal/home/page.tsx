import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPortalSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatINR } from '@/lib/constants';
import ChatThread, { ChatMessage } from '@/components/ChatThread';
import PortalRequestForm from './PortalRequestForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'My Account | SecureEdge Client Portal' };

export default async function PortalHome() {
  const session = await getPortalSession();
  if (!session) redirect('/portal');

  const clientId = session.clientId;
  const [client, invoices, projects, ledger, messages, requests] = await Promise.all([
    query<{ name: string; company: string | null; credit_limit: number }>(
      'SELECT name, company, credit_limit::float8 AS credit_limit FROM clients WHERE id = $1',
      [clientId]
    ),
    query<{ id: number; number: string; issue_date: string; due_date: string | null; total: number; amount_paid: number; status: string }>(
      `SELECT id, number, issue_date::text AS issue_date, due_date::text AS due_date,
              total::float8 AS total, amount_paid::float8 AS amount_paid, status
       FROM invoices WHERE client_id = $1 AND status <> 'draft'
       ORDER BY created_at DESC`,
      [clientId]
    ),
    query<{ id: number; name: string; status: string; renewal_date: string | null }>(
      `SELECT id, name, status, renewal_date::text AS renewal_date
       FROM projects WHERE client_id = $1 ORDER BY created_at DESC`,
      [clientId]
    ),
    query<{ balance: number }>(
      `SELECT COALESCE(SUM(debit) - SUM(credit), 0)::float8 AS balance
       FROM ledger_entries WHERE client_id = $1`,
      [clientId]
    ),
    query<ChatMessage>(
      `SELECT m.id, m.sender, m.body, m.created_at::text AS created_at, u.name AS author
       FROM client_messages m LEFT JOIN users u ON u.id = m.user_id
       WHERE m.client_id = $1 ORDER BY m.created_at ASC LIMIT 200`,
      [clientId]
    ),
    query<{ id: number; type: string; title: string; status: string; created_at: string }>(
      `SELECT id, type, title, status, created_at::text AS created_at
       FROM project_requests WHERE client_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [clientId]
    ),
  ]);

  const c = client.rows[0];
  const balance = ledger.rows[0].balance;
  const dueInvoices = invoices.rows.filter((i) => !['paid', 'cancelled'].includes(i.status));
  const upcomingRenewals = projects.rows.filter(
    (p) => p.renewal_date && new Date(p.renewal_date) > new Date()
  );

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/portal/home" className="brand">
            <span className="brand-mark">SE</span>
            <span className="brand-name">
              SecureEdge Client Portal
              <small>{c.company || c.name}</small>
            </span>
          </Link>
          <nav className="main-nav">
            <form action="/api/portal/logout" method="post" style={{ display: 'inline' }}>
              <button className="login-link" type="submit" style={{ border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Welcome, {session.name}</h1>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">{balance >= 0 ? 'Amount Due' : 'Credit Balance'}</div>
              <div className="stat-value" style={{ color: balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                {formatINR(Math.abs(balance))}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Credit Limit</div>
              <div className="stat-value">{formatINR(c.credit_limit)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Open Invoices</div>
              <div className="stat-value">{dueInvoices.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Projects</div>
              <div className="stat-value">{projects.rows.length}</div>
            </div>
          </div>

          <div className="lead-layout">
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <h3>My Invoices</h3>
                {invoices.rows.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>No invoices yet.</p>
                ) : (
                  <div className="table-wrap" style={{ border: 'none', marginTop: 10 }}>
                    <table className="leads" style={{ minWidth: 520 }}>
                      <thead>
                        <tr><th>Invoice</th><th>Date</th><th>Total</th><th>Balance</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {invoices.rows.map((inv) => (
                          <tr key={inv.id}>
                            <td>
                              <Link href={`/portal/invoices/${inv.id}`} className="lead-name-link">
                                {inv.number}
                              </Link>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{new Date(inv.issue_date).toLocaleDateString()}</td>
                            <td>{formatINR(inv.total)}</td>
                            <td>{formatINR(inv.total - inv.amount_paid)}</td>
                            <td><span className={`status-pill invoice-${inv.status}`}>{inv.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <h3>My Projects &amp; Renewals</h3>
                {projects.rows.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>No projects yet.</p>
                ) : (
                  <ul className="proposal-list">
                    {projects.rows.map((p) => (
                      <li key={p.id}>
                        <span><strong>{p.name}</strong></span>
                        <span>
                          <span className={`status-pill project-${p.status}`}>{p.status.replace('_', ' ')}</span>
                          {p.renewal_date && (
                            <span style={{ marginLeft: 8, color: 'var(--muted)', fontSize: 12.5 }}>
                              renews {new Date(p.renewal_date).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {upcomingRenewals.length > 0 && (
                  <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 10 }}>
                    💡 Use the request form to ask for a renewal quote before the renewal date.
                  </p>
                )}
              </div>

              <PortalRequestForm projects={projects.rows} pastRequests={requests.rows} />
            </div>

            <div>
              <div className="card">
                <h3>Conversation with SecureEdge</h3>
                <ChatThread
                  initialMessages={messages.rows}
                  viewer="client"
                  postUrl="/api/portal/messages"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
