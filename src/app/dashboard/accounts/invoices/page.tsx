import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatINR } from '@/lib/constants';
import DashHeader from '@/components/DashHeader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Invoices | SecureEdge CRM' };

export default async function InvoicesPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/accounts/invoices');

  const invoices = await query<{
    id: number; number: string; issue_date: string; due_date: string | null;
    total: number; amount_paid: number; status: string;
    client_name: string; client_company: string | null; project_name: string | null;
  }>(
    `SELECT i.id, i.number, i.issue_date::text AS issue_date, i.due_date::text AS due_date,
            i.total::float8 AS total, i.amount_paid::float8 AS amount_paid, i.status,
            c.name AS client_name, c.company AS client_company, p.name AS project_name
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     ORDER BY i.created_at DESC LIMIT 500`
  );

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Sales Invoices</h1>
            <Link href="/dashboard/accounts/invoices/new" className="btn btn-primary btn-sm">
              + New Invoice
            </Link>
          </div>
          <p style={{ marginBottom: 16 }}>
            <Link href="/dashboard/accounts">← Accounts</Link>
          </p>
          <div className="table-wrap">
            <table className="leads" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.rows.length === 0 && (
                  <tr><td colSpan={7} style={{ color: 'var(--muted)' }}>No invoices yet.</td></tr>
                )}
                {invoices.rows.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <Link href={`/dashboard/accounts/invoices/${inv.id}`} className="lead-name-link">
                        {inv.number}
                      </Link>
                    </td>
                    <td>{inv.client_company || inv.client_name}</td>
                    <td>{inv.project_name || '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(inv.issue_date).toLocaleDateString()}</td>
                    <td>{formatINR(inv.total)}</td>
                    <td>{formatINR(inv.total - inv.amount_paid)}</td>
                    <td><span className={`status-pill invoice-${inv.status}`}>{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
