import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatINR } from '@/lib/constants';
import DashHeader from '@/components/DashHeader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Accounts | SecureEdge CRM' };

export default async function AccountsPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/accounts');

  const [sales, purchases, receivables] = await Promise.all([
    query<{ total: number; gst: number; n: string }>(
      `SELECT COALESCE(SUM(total),0)::float8 AS total,
              COALESCE(SUM(cgst+sgst+igst),0)::float8 AS gst, COUNT(*) AS n
       FROM invoices WHERE status <> 'cancelled'`
    ),
    query<{ total: number; gst: number; n: string }>(
      `SELECT COALESCE(SUM(total),0)::float8 AS total,
              COALESCE(SUM(cgst+sgst+igst),0)::float8 AS gst, COUNT(*) AS n
       FROM purchase_invoices WHERE status <> 'cancelled'`
    ),
    query<{ due: number }>(
      `SELECT COALESCE(SUM(total - amount_paid),0)::float8 AS due
       FROM invoices WHERE status NOT IN ('paid','cancelled')`
    ),
  ]);

  const gstOut = sales.rows[0].gst;
  const gstIn = purchases.rows[0].gst;

  const sections = [
    {
      href: '/dashboard/accounts/invoices',
      title: 'Sales Invoices',
      desc: `${sales.rows[0].n} tax invoices · ${formatINR(sales.rows[0].total)} billed. GST-compliant invoicing with CGST/SGST/IGST, payments and receivables.`,
    },
    {
      href: '/dashboard/accounts/purchases',
      title: 'Purchases',
      desc: `${purchases.rows[0].n} vendor bills · ${formatINR(purchases.rows[0].total)}. Purchase requests, purchase orders and purchase invoices (input tax credit).`,
    },
    {
      href: '/dashboard/accounts/gst',
      title: 'GST Reports',
      desc: 'GST outward (sales) and inward (purchases) rate-wise summaries with net GST payable for any period.',
    },
    {
      href: '/dashboard/accounts/analytics',
      title: 'Finance Analytics',
      desc: 'P&L by week / month / quarter / custom dates, and profitability per project and lead.',
    },
  ];

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Accounts</h1>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Revenue Billed</div>
              <div className="stat-value">{formatINR(sales.rows[0].total)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Receivables Due</div>
              <div className="stat-value">{formatINR(receivables.rows[0].due)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">GST Collected (Outward)</div>
              <div className="stat-value">{formatINR(gstOut)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Input Tax Credit (Inward)</div>
              <div className="stat-value">{formatINR(gstIn)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Net GST Payable</div>
              <div className="stat-value">{formatINR(Math.max(gstOut - gstIn, 0))}</div>
            </div>
          </div>

          <div className="grid grid-3">
            {sections.map((s) => (
              <Link key={s.href} href={s.href} className="card" style={{ display: 'block' }}>
                <h3>{s.title} →</h3>
                <p>{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
