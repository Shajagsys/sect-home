import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import WebhooksClient, { WebhookKeyRow } from './WebhooksClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Webhooks | SecureEdge CRM',
};

export default async function WebhooksPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/webhooks');
  if (session.role !== 'admin') redirect('/dashboard');

  const result = await query<WebhookKeyRow>(
    `SELECT id, name, key, source_label, active, created_at::text AS created_at
     FROM webhook_keys ORDER BY created_at DESC`
  );

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Lead Collection Webhooks</h1>
          </div>
          <p style={{ color: 'var(--muted)', maxWidth: 720, marginBottom: 24 }}>
            Create an API key per channel and plug it into Facebook/Instagram Lead Ads,
            LinkedIn Lead Gen Forms, Google Ads, landing pages or chatbots — directly or via
            Zapier / Make / n8n. Every lead posted to the webhook lands in this CRM instantly,
            tagged with its source.
          </p>
          <WebhooksClient initialKeys={result.rows} />
        </div>
      </main>
    </>
  );
}
