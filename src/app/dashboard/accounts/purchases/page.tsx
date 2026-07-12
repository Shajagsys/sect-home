import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import PurchasesClient, { PoRow, BillRow } from './PurchasesClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Purchases | SecureEdge CRM' };

export default async function PurchasesPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/accounts/purchases');

  const [pos, bills, projects] = await Promise.all([
    query<PoRow>(
      `SELECT po.id, po.number, po.vendor_name, po.total::float8 AS total, po.status,
              po.created_at::text AS created_at, p.name AS project_name
       FROM purchase_orders po LEFT JOIN projects p ON p.id = po.project_id
       ORDER BY po.created_at DESC LIMIT 200`
    ),
    query<BillRow>(
      `SELECT b.id, b.bill_number, b.vendor_name, b.bill_date::text AS bill_date,
              b.taxable::float8 AS taxable, (b.cgst + b.sgst + b.igst)::float8 AS gst,
              b.total::float8 AS total, b.status, p.name AS project_name
       FROM purchase_invoices b LEFT JOIN projects p ON p.id = b.project_id
       ORDER BY b.created_at DESC LIMIT 200`
    ),
    query<{ id: number; name: string }>('SELECT id, name FROM projects ORDER BY created_at DESC'),
  ]);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Purchases</h1>
          </div>
          <p style={{ marginBottom: 16 }}>
            <Link href="/dashboard/accounts">← Accounts</Link>
          </p>
          <PurchasesClient
            pos={pos.rows}
            bills={bills.rows}
            projects={projects.rows}
            isAdmin={session.role === 'admin'}
          />
        </div>
      </main>
    </>
  );
}
