import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import InvoiceForm from './InvoiceForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'New Invoice | SecureEdge CRM' };

export default async function NewInvoicePage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/accounts/invoices/new');

  const [clients, projects] = await Promise.all([
    query<{ id: number; name: string; company: string | null; state_code: string }>(
      'SELECT id, name, company, state_code FROM clients ORDER BY company NULLS LAST, name'
    ),
    query<{ id: number; name: string; client_id: number }>(
      'SELECT id, name, client_id FROM projects ORDER BY created_at DESC'
    ),
  ]);

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <p style={{ marginBottom: 12 }}>
            <Link href="/dashboard/accounts/invoices">← Invoices</Link>
          </p>
          <h1 style={{ fontSize: 24, color: 'var(--navy)', marginBottom: 4 }}>New Tax Invoice</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            GST is computed automatically: intra-state clients get CGST + SGST, inter-state get IGST,
            based on the client&apos;s GST state.
          </p>
          <InvoiceForm clients={clients.rows} projects={projects.rows} />
        </div>
      </main>
    </>
  );
}
