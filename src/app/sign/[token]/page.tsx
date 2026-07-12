import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { COMPANY } from '@/lib/company';
import SignClient from './SignClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Sign Contract | SecureEdge Cyber Technologies LLP' };

export default async function SignPage({ params }: { params: { token: string } }) {
  const token = String(params.token || '').slice(0, 64);
  const result = await query<{
    id: number; title: string; body: string; status: string;
    signer_name: string; signed_at: string | null; signed_name: string | null;
    project_name: string; client_company: string | null; client_name: string;
  }>(
    `SELECT ct.id, ct.title, ct.body, ct.status, ct.signer_name,
            ct.signed_at::text AS signed_at, ct.signed_name,
            p.name AS project_name, c.company AS client_company, c.name AS client_name
     FROM contracts ct
     JOIN projects p ON p.id = ct.project_id
     JOIN clients c ON c.id = p.client_id
     WHERE ct.sign_token = $1`,
    [token]
  );
  if (result.rowCount === 0) notFound();
  const contract = result.rows[0];

  return (
    <main className="section" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="proposal-doc">
          <div className="proposal-head">
            <div>
              <h1>{COMPANY.name}</h1>
              <p>{COMPANY.tagline}</p>
            </div>
            <div className="proposal-id">
              <h2>CONTRACT</h2>
              <p>#{String(contract.id).padStart(5, '0')}</p>
            </div>
          </div>
          <div className="proposal-to">
            <h3>Between</h3>
            <p>
              <strong>{COMPANY.name}</strong> and{' '}
              <strong>{contract.client_company || contract.client_name}</strong>
            </p>
            <p>Project: {contract.project_name}</p>
          </div>
          <h3 className="proposal-title">{contract.title}</h3>
          <pre className="contract-body">{contract.body}</pre>

          <SignClient
            token={token}
            status={contract.status}
            signerName={contract.signer_name}
            signedName={contract.signed_name}
            signedAt={contract.signed_at}
          />
        </div>
      </div>
    </main>
  );
}
