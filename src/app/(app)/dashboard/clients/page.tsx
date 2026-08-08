import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { clientScore, scoreBand } from '@/lib/score';
import { formatINR } from '@/lib/constants';
import DashHeader from '@/components/DashHeader';
import NewClientForm from './NewClientForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Clients | SecureEdge CRM' };

interface ClientRow {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  portal_enabled: boolean;
  invoiced: number;
  paid: number;
  overdue_count: number;
  balance: number;
  last_activity_days: number | null;
  project_count: number;
}

export default async function ClientsPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/clients');

  const result = await query<ClientRow>(
    `SELECT c.id, c.name, c.company, c.email, c.phone, c.portal_enabled,
            COALESCE(inv.invoiced, 0)::float8 AS invoiced,
            COALESCE(inv.paid, 0)::float8 AS paid,
            COALESCE(inv.overdue_count, 0)::int AS overdue_count,
            COALESCE(led.balance, 0)::float8 AS balance,
            EXTRACT(DAY FROM now() - GREATEST(
              COALESCE(msg.last_msg, c.created_at),
              COALESCE(inv.last_invoice, c.created_at)
            ))::int AS last_activity_days,
            COALESCE(prj.n, 0)::int AS project_count
     FROM clients c
     LEFT JOIN (
       SELECT client_id, SUM(total) AS invoiced, SUM(amount_paid) AS paid,
              COUNT(*) FILTER (WHERE status NOT IN ('paid','cancelled')
                               AND due_date < CURRENT_DATE) AS overdue_count,
              MAX(created_at) AS last_invoice
       FROM invoices GROUP BY client_id
     ) inv ON inv.client_id = c.id
     LEFT JOIN (
       SELECT client_id, SUM(debit) - SUM(credit) AS balance FROM ledger_entries GROUP BY client_id
     ) led ON led.client_id = c.id
     LEFT JOIN (
       SELECT client_id, MAX(created_at) AS last_msg FROM client_messages GROUP BY client_id
     ) msg ON msg.client_id = c.id
     LEFT JOIN (
       SELECT client_id, COUNT(*) AS n FROM projects GROUP BY client_id
     ) prj ON prj.client_id = c.id
     ORDER BY c.created_at DESC`
  );

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Clients</h1>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
            <div className="table-wrap">
              <table className="leads" style={{ minWidth: 760 }}>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Score</th>
                    <th>Projects</th>
                    <th>Invoiced</th>
                    <th>Outstanding</th>
                    <th>Portal</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.length === 0 && (
                    <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>
                      No clients yet — add one here or convert a won lead.
                    </td></tr>
                  )}
                  {result.rows.map((c) => {
                    const score = clientScore({
                      invoicedTotal: c.invoiced,
                      paidTotal: c.paid,
                      overdueCount: c.overdue_count,
                      lastActivityDays: c.last_activity_days,
                    });
                    const band = scoreBand(score);
                    return (
                      <tr key={c.id}>
                        <td>
                          <Link href={`/dashboard/clients/${c.id}`} className="lead-name-link">
                            {c.company || c.name}
                          </Link>
                          <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{c.email}</div>
                        </td>
                        <td>
                          <span className={`status-pill ${band.cls}`}>{score} · {band.label}</span>
                        </td>
                        <td>{c.project_count}</td>
                        <td>{formatINR(c.invoiced)}</td>
                        <td style={{ fontWeight: 600, color: c.balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {formatINR(Math.abs(c.balance))}{c.balance < 0 ? ' CR' : ''}
                        </td>
                        <td>
                          <span className={`status-pill ${c.portal_enabled ? 'status-won' : 'status-lost'}`}>
                            {c.portal_enabled ? 'Enabled' : 'Off'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <NewClientForm />
          </div>
        </div>
      </main>
    </>
  );
}
