import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import InvoiceDoc, { InvoiceData } from '@/components/InvoiceDoc';
import InvoiceActions from './InvoiceActions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Invoice | SecureEdge CRM' };

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect(`/login?next=/dashboard/accounts/invoices/${params.id}`);

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const result = await query<InvoiceData>(
    `SELECT i.id, i.number, i.issue_date::text AS issue_date, i.due_date::text AS due_date,
            i.items, i.discount_percent::float8 AS discount_percent, i.place_of_supply,
            i.inter_state, i.taxable::float8 AS taxable, i.cgst::float8 AS cgst,
            i.sgst::float8 AS sgst, i.igst::float8 AS igst, i.total::float8 AS total,
            i.amount_paid::float8 AS amount_paid, i.status, i.notes,
            c.name AS client_name, c.company AS client_company, c.email AS client_email,
            c.gstin AS client_gstin, c.address AS client_address,
            p.name AS project_name
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.id = $1`,
    [id]
  );
  if (result.rowCount === 0) notFound();
  const invoice = result.rows[0];

  return (
    <>
      <div className="no-print">
        <DashHeader session={session} />
      </div>
      <main className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="no-print" style={{ marginBottom: 16 }}>
            <p style={{ marginBottom: 12 }}>
              <Link href="/dashboard/accounts/invoices">← Invoices</Link>
            </p>
            <InvoiceActions
              invoiceId={invoice.id}
              status={invoice.status}
              balance={invoice.total - invoice.amount_paid}
            />
          </div>
          <InvoiceDoc invoice={invoice} />
        </div>
      </main>
    </>
  );
}
