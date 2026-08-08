import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatINR } from '@/lib/constants';
import DashHeader from '@/components/DashHeader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'GST Reports | SecureEdge CRM' };

function defaultRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from: from.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
}

export default async function GstPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/accounts/gst');

  const range = defaultRange();
  const from = searchParams.from || range.from;
  const to = searchParams.to || range.to;

  const [outward, inward] = await Promise.all([
    query<{ n: string; taxable: number; cgst: number; sgst: number; igst: number; total: number }>(
      `SELECT COUNT(*) AS n, COALESCE(SUM(taxable),0)::float8 AS taxable,
              COALESCE(SUM(cgst),0)::float8 AS cgst, COALESCE(SUM(sgst),0)::float8 AS sgst,
              COALESCE(SUM(igst),0)::float8 AS igst, COALESCE(SUM(total),0)::float8 AS total
       FROM invoices WHERE status <> 'cancelled' AND issue_date BETWEEN $1 AND $2`,
      [from, to]
    ),
    query<{ n: string; taxable: number; cgst: number; sgst: number; igst: number; total: number }>(
      `SELECT COUNT(*) AS n, COALESCE(SUM(taxable),0)::float8 AS taxable,
              COALESCE(SUM(cgst),0)::float8 AS cgst, COALESCE(SUM(sgst),0)::float8 AS sgst,
              COALESCE(SUM(igst),0)::float8 AS igst, COALESCE(SUM(total),0)::float8 AS total
       FROM purchase_invoices WHERE status <> 'cancelled' AND bill_date BETWEEN $1 AND $2`,
      [from, to]
    ),
  ]);

  const [outwardDocs, inwardDocs] = await Promise.all([
    query<{ number: string; issue_date: string; client: string; gstin: string | null;
            taxable: number; cgst: number; sgst: number; igst: number; total: number }>(
      `SELECT i.number, i.issue_date::text AS issue_date,
              COALESCE(c.company, c.name) AS client, c.gstin,
              i.taxable::float8 AS taxable, i.cgst::float8 AS cgst, i.sgst::float8 AS sgst,
              i.igst::float8 AS igst, i.total::float8 AS total
       FROM invoices i JOIN clients c ON c.id = i.client_id
       WHERE i.status <> 'cancelled' AND i.issue_date BETWEEN $1 AND $2
       ORDER BY i.issue_date`,
      [from, to]
    ),
    query<{ bill_number: string; bill_date: string; vendor_name: string; vendor_gstin: string | null;
            taxable: number; cgst: number; sgst: number; igst: number; total: number }>(
      `SELECT bill_number, bill_date::text AS bill_date, vendor_name, vendor_gstin,
              taxable::float8 AS taxable, cgst::float8 AS cgst, sgst::float8 AS sgst,
              igst::float8 AS igst, total::float8 AS total
       FROM purchase_invoices
       WHERE status <> 'cancelled' AND bill_date BETWEEN $1 AND $2
       ORDER BY bill_date`,
      [from, to]
    ),
  ]);

  const out = outward.rows[0];
  const inn = inward.rows[0];
  const gstOut = out.cgst + out.sgst + out.igst;
  const gstIn = inn.cgst + inn.sgst + inn.igst;

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>GST Reports</h1>
          </div>
          <p style={{ marginBottom: 16 }}>
            <Link href="/dashboard/accounts">← Accounts</Link>
          </p>

          <form method="get" className="filter-bar">
            <label style={{ fontSize: 14 }}>From <input type="date" name="from" defaultValue={from}
              style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, marginLeft: 6 }} /></label>
            <label style={{ fontSize: 14 }}>To <input type="date" name="to" defaultValue={to}
              style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, marginLeft: 6 }} /></label>
            <button className="btn btn-primary btn-sm" type="submit">Apply</button>
            <a className="btn btn-outline-dark btn-sm"
               href={`/api/gst-export?direction=outward&from=${from}&to=${to}`}>
              ⬇ Export Outward CSV
            </a>
            <a className="btn btn-outline-dark btn-sm"
               href={`/api/gst-export?direction=inward&from=${from}&to=${to}`}>
              ⬇ Export Inward CSV
            </a>
          </form>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">GST Outward (collected)</div>
              <div className="stat-value">{formatINR(gstOut)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">GST Inward (ITC)</div>
              <div className="stat-value">{formatINR(gstIn)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Net GST Payable</div>
              <div className="stat-value">{formatINR(Math.max(gstOut - gstIn, 0))}</div>
            </div>
            {gstIn > gstOut && (
              <div className="stat-card">
                <div className="stat-label">ITC Carry Forward</div>
                <div className="stat-value">{formatINR(gstIn - gstOut)}</div>
              </div>
            )}
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Outward Supplies (Sales) — {out.n} invoices</h3>
            <div className="table-wrap" style={{ border: 'none', marginTop: 10 }}>
              <table className="leads" style={{ minWidth: 700 }}>
                <thead>
                  <tr><th>Invoice</th><th>Date</th><th>Client</th><th>GSTIN</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {outwardDocs.rows.map((d) => (
                    <tr key={d.number}>
                      <td>{d.number}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(d.issue_date).toLocaleDateString()}</td>
                      <td>{d.client}</td>
                      <td>{d.gstin || 'Unregistered'}</td>
                      <td>{formatINR(d.taxable)}</td>
                      <td>{formatINR(d.cgst)}</td>
                      <td>{formatINR(d.sgst)}</td>
                      <td>{formatINR(d.igst)}</td>
                      <td>{formatINR(d.total)}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 800 }}>
                    <td colSpan={4}>Total</td>
                    <td>{formatINR(out.taxable)}</td>
                    <td>{formatINR(out.cgst)}</td>
                    <td>{formatINR(out.sgst)}</td>
                    <td>{formatINR(out.igst)}</td>
                    <td>{formatINR(out.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Inward Supplies (Purchases) — {inn.n} bills</h3>
            <div className="table-wrap" style={{ border: 'none', marginTop: 10 }}>
              <table className="leads" style={{ minWidth: 700 }}>
                <thead>
                  <tr><th>Bill</th><th>Date</th><th>Vendor</th><th>GSTIN</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {inwardDocs.rows.map((d, i) => (
                    <tr key={i}>
                      <td>{d.bill_number}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(d.bill_date).toLocaleDateString()}</td>
                      <td>{d.vendor_name}</td>
                      <td>{d.vendor_gstin || 'Unregistered'}</td>
                      <td>{formatINR(d.taxable)}</td>
                      <td>{formatINR(d.cgst)}</td>
                      <td>{formatINR(d.sgst)}</td>
                      <td>{formatINR(d.igst)}</td>
                      <td>{formatINR(d.total)}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 800 }}>
                    <td colSpan={4}>Total</td>
                    <td>{formatINR(inn.taxable)}</td>
                    <td>{formatINR(inn.cgst)}</td>
                    <td>{formatINR(inn.sgst)}</td>
                    <td>{formatINR(inn.igst)}</td>
                    <td>{formatINR(inn.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
