import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatINR } from '@/lib/constants';
import DashHeader from '@/components/DashHeader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Finance Analytics | SecureEdge CRM' };

type Period = 'week' | 'month' | 'quarter' | 'custom';

function rangeFor(period: Period, from?: string, to?: string): { from: string; to: string; bucket: string } {
  const now = new Date();
  const toStr = now.toISOString().slice(0, 10);
  if (period === 'custom' && from && to) return { from, to, bucket: 'month' };
  if (period === 'week') {
    const start = new Date(now.getTime() - 12 * 7 * 86400000); // last 12 weeks
    return { from: start.toISOString().slice(0, 10), to: toStr, bucket: 'week' };
  }
  if (period === 'quarter') {
    const start = new Date(now.getFullYear() - 2, now.getMonth(), 1); // last ~8 quarters
    return { from: start.toISOString().slice(0, 10), to: toStr, bucket: 'quarter' };
  }
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1); // last 12 months
  return { from: start.toISOString().slice(0, 10), to: toStr, bucket: 'month' };
}

const BUCKET_LABEL: Record<string, string> = {
  week: 'IW "W" YYYY', // ISO week
  month: 'Mon YYYY',
  quarter: '"Q"Q YYYY',
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { period?: string; from?: string; to?: string };
}) {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/accounts/analytics');

  const period = (['week', 'month', 'quarter', 'custom'].includes(String(searchParams.period))
    ? searchParams.period
    : 'month') as Period;
  const { from, to, bucket } = rangeFor(period, searchParams.from, searchParams.to);
  const label = BUCKET_LABEL[bucket];

  const [summary, buckets, byProject] = await Promise.all([
    query<{ revenue: number; collected: number; expenses: number; gst_out: number; gst_in: number }>(
      `SELECT
         (SELECT COALESCE(SUM(taxable),0) FROM invoices
          WHERE status <> 'cancelled' AND issue_date BETWEEN $1 AND $2)::float8 AS revenue,
         (SELECT COALESCE(SUM(p.amount),0) FROM invoice_payments p
          WHERE p.paid_on BETWEEN $1 AND $2)::float8 AS collected,
         (SELECT COALESCE(SUM(taxable),0) FROM purchase_invoices
          WHERE status <> 'cancelled' AND bill_date BETWEEN $1 AND $2)::float8 AS expenses,
         (SELECT COALESCE(SUM(cgst+sgst+igst),0) FROM invoices
          WHERE status <> 'cancelled' AND issue_date BETWEEN $1 AND $2)::float8 AS gst_out,
         (SELECT COALESCE(SUM(cgst+sgst+igst),0) FROM purchase_invoices
          WHERE status <> 'cancelled' AND bill_date BETWEEN $1 AND $2)::float8 AS gst_in`,
      [from, to]
    ),
    query<{ bucket: string; revenue: number; expenses: number }>(
      `WITH rev AS (
         SELECT date_trunc('${bucket}', issue_date::timestamp) AS b, SUM(taxable) AS revenue
         FROM invoices WHERE status <> 'cancelled' AND issue_date BETWEEN $1 AND $2 GROUP BY 1
       ), exp AS (
         SELECT date_trunc('${bucket}', bill_date::timestamp) AS b, SUM(taxable) AS expenses
         FROM purchase_invoices WHERE status <> 'cancelled' AND bill_date BETWEEN $1 AND $2 GROUP BY 1
       )
       SELECT to_char(COALESCE(rev.b, exp.b), '${label}') AS bucket,
              COALESCE(rev.revenue, 0)::float8 AS revenue,
              COALESCE(exp.expenses, 0)::float8 AS expenses
       FROM rev FULL OUTER JOIN exp ON rev.b = exp.b
       ORDER BY COALESCE(rev.b, exp.b)`,
      [from, to]
    ),
    query<{ project: string; lead_source: string | null; revenue: number; expenses: number }>(
      `SELECT p.name AS project, l.source AS lead_source,
              COALESCE(rev.revenue, 0)::float8 AS revenue,
              COALESCE(exp.expenses, 0)::float8 AS expenses
       FROM projects p
       LEFT JOIN leads l ON l.id = p.lead_id
       LEFT JOIN (
         SELECT project_id, SUM(taxable) AS revenue FROM invoices
         WHERE status <> 'cancelled' AND issue_date BETWEEN $1 AND $2 GROUP BY project_id
       ) rev ON rev.project_id = p.id
       LEFT JOIN (
         SELECT project_id, SUM(taxable) AS expenses FROM purchase_invoices
         WHERE status <> 'cancelled' AND bill_date BETWEEN $1 AND $2 GROUP BY project_id
       ) exp ON exp.project_id = p.id
       ORDER BY COALESCE(rev.revenue, 0) DESC`,
      [from, to]
    ),
  ]);

  const s = summary.rows[0];
  const profit = s.revenue - s.expenses;
  const margin = s.revenue > 0 ? Math.round((profit / s.revenue) * 100) : 0;
  const maxBucket = Math.max(...buckets.rows.map((b) => Math.max(b.revenue, b.expenses)), 1);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Finance Analytics</h1>
          </div>
          <p style={{ marginBottom: 16 }}>
            <Link href="/dashboard/accounts">← Accounts</Link>
          </p>

          <form method="get" className="filter-bar">
            {(['week', 'month', 'quarter'] as const).map((p) => (
              <Link
                key={p}
                href={`/dashboard/accounts/analytics?period=${p}`}
                className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-outline-dark'}`}
              >
                {p === 'week' ? 'Weekly' : p === 'month' ? 'Monthly' : 'Quarterly'}
              </Link>
            ))}
            <input type="hidden" name="period" value="custom" />
            <label style={{ fontSize: 14 }}>From <input type="date" name="from" defaultValue={from}
              style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, marginLeft: 4 }} /></label>
            <label style={{ fontSize: 14 }}>To <input type="date" name="to" defaultValue={to}
              style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, marginLeft: 4 }} /></label>
            <button className="btn btn-primary btn-sm" type="submit">Custom Range</button>
          </form>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Revenue (ex-GST)</div>
              <div className="stat-value">{formatINR(s.revenue)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Expenses (ex-GST)</div>
              <div className="stat-value">{formatINR(s.expenses)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">{profit >= 0 ? 'Profit' : 'Loss'}</div>
              <div className="stat-value" style={{ color: profit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatINR(Math.abs(profit))}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Margin</div>
              <div className="stat-value">{margin}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cash Collected</div>
              <div className="stat-value">{formatINR(s.collected)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Net GST Payable</div>
              <div className="stat-value">{formatINR(Math.max(s.gst_out - s.gst_in, 0))}</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Profit &amp; Loss by {bucket}</h3>
            <p className="chart-sub">
              {new Date(from).toLocaleDateString()} → {new Date(to).toLocaleDateString()} ·
              revenue vs expenses (taxable values, excluding GST)
            </p>
            {buckets.rows.length === 0 ? (
              <p className="chart-empty">No transactions in this period.</p>
            ) : (
              <div className="bar-list">
                {buckets.rows.map((b) => (
                  <div key={b.bucket}>
                    <div className="bar-row" title={`Revenue: ${formatINR(b.revenue)}`}>
                      <span className="bar-label">{b.bucket}</span>
                      <span className="bar-track">
                        <span className="bar-fill" style={{ width: `${(b.revenue / maxBucket) * 100}%` }} />
                      </span>
                      <span className="bar-value">{formatINR(b.revenue)}</span>
                    </div>
                    <div className="bar-row" title={`Expenses: ${formatINR(b.expenses)}`}>
                      <span className="bar-label" style={{ color: 'var(--muted)', fontSize: 12 }}>expenses</span>
                      <span className="bar-track">
                        <span className="bar-fill expense" style={{ width: `${(b.expenses / maxBucket) * 100}%` }} />
                      </span>
                      <span className="bar-value" style={{ color: 'var(--muted)' }}>
                        {formatINR(b.expenses)} · P/L {formatINR(b.revenue - b.expenses)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3>P&amp;L by Project / Lead</h3>
            <p className="chart-sub">Revenue and directly attributed purchase costs per project</p>
            <div className="table-wrap" style={{ border: 'none' }}>
              <table className="leads" style={{ minWidth: 640 }}>
                <thead>
                  <tr><th>Project</th><th>Lead Source</th><th>Revenue</th><th>Expenses</th><th>Profit</th><th>Margin</th></tr>
                </thead>
                <tbody>
                  {byProject.rows.length === 0 && (
                    <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>No projects yet.</td></tr>
                  )}
                  {byProject.rows.map((p) => {
                    const pr = p.revenue - p.expenses;
                    return (
                      <tr key={p.project}>
                        <td><strong>{p.project}</strong></td>
                        <td>{p.lead_source ? <span className="source-chip">{p.lead_source}</span> : '—'}</td>
                        <td>{formatINR(p.revenue)}</td>
                        <td>{formatINR(p.expenses)}</td>
                        <td style={{ fontWeight: 700, color: pr >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {formatINR(pr)}
                        </td>
                        <td>{p.revenue > 0 ? `${Math.round((pr / p.revenue) * 100)}%` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
