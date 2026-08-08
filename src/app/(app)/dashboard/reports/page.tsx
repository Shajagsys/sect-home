import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import { LEAD_STATUSES, STATUS_LABELS, LeadStatus, formatINR } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Reports | SecureEdge CRM',
};

interface StageRow {
  status: string;
  count: number;
  value: number;
}
interface SourceRow {
  source: string;
  count: number;
}
interface MonthRow {
  month: string;
  count: number;
}
interface InterestRow {
  interest: string;
  count: number;
}

/**
 * Horizontal bar list. Single series → one hue (sea green, validated ≥3:1 on
 * the card surface), values as direct text labels in ink, no legend needed.
 */
function BarList({
  rows,
  max,
}: {
  rows: { label: string; count: number; extra?: string }[];
  max: number;
}) {
  return (
    <div className="bar-list" role="img" aria-label="Bar chart">
      {rows.map((row) => (
        <div className="bar-row" key={row.label} title={`${row.label}: ${row.count}`}>
          <span className="bar-label">{row.label}</span>
          <span className="bar-track">
            <span
              className="bar-fill"
              style={{ width: `${max > 0 ? Math.max((row.count / max) * 100, row.count > 0 ? 2 : 0) : 0}%` }}
            />
          </span>
          <span className="bar-value">
            {row.count}
            {row.extra ? ` · ${row.extra}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function ReportsPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/reports');

  const [stages, sources, months, interests] = await Promise.all([
    query<StageRow>(
      `SELECT status, COUNT(*)::int AS count, COALESCE(SUM(value), 0)::float8 AS value
       FROM leads GROUP BY status`
    ),
    query<SourceRow>(
      `SELECT source, COUNT(*)::int AS count
       FROM leads GROUP BY source ORDER BY count DESC LIMIT 10`
    ),
    query<MonthRow>(
      `SELECT to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
              COUNT(*)::int AS count
       FROM leads
       WHERE created_at >= date_trunc('month', now()) - interval '5 months'
       GROUP BY date_trunc('month', created_at)
       ORDER BY date_trunc('month', created_at)`
    ),
    query<InterestRow>(
      `SELECT interest, COUNT(*)::int AS count
       FROM leads WHERE interest IS NOT NULL AND interest <> ''
       GROUP BY interest ORDER BY count DESC LIMIT 8`
    ),
  ]);

  const byStage = new Map(stages.rows.map((r) => [r.status, r]));
  const total = stages.rows.reduce((sum, r) => sum + r.count, 0);
  const won = byStage.get('won')?.count || 0;
  const lost = byStage.get('lost')?.count || 0;
  const closed = won + lost;
  const conversionRate = closed > 0 ? Math.round((won / closed) * 100) : 0;
  const openValue = stages.rows
    .filter((r) => !['won', 'lost'].includes(r.status))
    .reduce((sum, r) => sum + r.value, 0);
  const wonValue = byStage.get('won')?.value || 0;

  const funnelRows = LEAD_STATUSES.map((s) => ({
    label: STATUS_LABELS[s as LeadStatus],
    count: byStage.get(s)?.count || 0,
    extra: formatINR(byStage.get(s)?.value || 0),
  }));
  const funnelMax = Math.max(...funnelRows.map((r) => r.count), 1);
  const sourceMax = Math.max(...sources.rows.map((r) => r.count), 1);
  const monthMax = Math.max(...months.rows.map((r) => r.count), 1);
  const interestMax = Math.max(...interests.rows.map((r) => r.count), 1);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Reports &amp; Analytics</h1>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total Leads</div>
              <div className="stat-value">{total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Win Rate (closed)</div>
              <div className="stat-value">{conversionRate}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Open Pipeline Value</div>
              <div className="stat-value">{formatINR(openValue)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Won Value</div>
              <div className="stat-value">{formatINR(wonValue)}</div>
            </div>
          </div>

          <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
            <div className="card">
              <h3>Pipeline Funnel</h3>
              <p className="chart-sub">Leads and value at each lifecycle stage</p>
              <BarList rows={funnelRows} max={funnelMax} />
            </div>

            <div className="card">
              <h3>Leads by Source</h3>
              <p className="chart-sub">Website, social campaigns, webhooks and more</p>
              {sources.rows.length === 0 ? (
                <p className="chart-empty">No data yet.</p>
              ) : (
                <BarList
                  rows={sources.rows.map((r) => ({ label: r.source, count: r.count }))}
                  max={sourceMax}
                />
              )}
            </div>

            <div className="card">
              <h3>Leads per Month</h3>
              <p className="chart-sub">Last 6 months</p>
              {months.rows.length === 0 ? (
                <p className="chart-empty">No data yet.</p>
              ) : (
                <BarList
                  rows={months.rows.map((r) => ({ label: r.month, count: r.count }))}
                  max={monthMax}
                />
              )}
            </div>

            <div className="card">
              <h3>Top Interests</h3>
              <p className="chart-sub">What leads ask about most</p>
              {interests.rows.length === 0 ? (
                <p className="chart-empty">No data yet.</p>
              ) : (
                <BarList
                  rows={interests.rows.map((r) => ({ label: r.interest, count: r.count }))}
                  max={interestMax}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
