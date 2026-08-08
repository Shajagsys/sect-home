'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/constants';

export interface ProjectRow {
  id: number;
  name: string;
  description: string | null;
  status: string;
  value: number;
  start_date: string | null;
  end_date: string | null;
  renewal_date: string | null;
  signer_name: string | null;
  signer_email: string | null;
  client_id: number;
  client_name: string;
  client_company: string | null;
  client_email: string;
}

export interface ContractRow {
  id: number;
  title: string;
  status: string;
  signer_name: string;
  signer_email: string;
  sign_token: string;
  sent_at: string | null;
  signed_at: string | null;
  signed_name: string | null;
}

const PROJECT_STATUSES = ['draft', 'contract_sent', 'signed', 'active', 'completed', 'renewed', 'closed'];

const DEFAULT_TERMS = (project: ProjectRow) => `SERVICE AGREEMENT

This agreement is made between SecureEdge Cyber Technologies LLP ("Provider") and ${
  project.client_company || project.client_name
} ("Client") for the project "${project.name}".

1. SCOPE OF WORK
${project.description || 'As per the accepted proposal and mutually agreed scope.'}

2. VALUE
Total project value: ${formatINR(project.value)} plus applicable GST.

3. PAYMENT TERMS
50% advance on signing; balance on delivery unless agreed otherwise in writing.

4. CONFIDENTIALITY
Both parties shall keep all business and technical information confidential.

5. TERM & TERMINATION
This agreement remains in force for the project duration. Either party may terminate
with 30 days written notice; work completed till date remains billable.

By signing below, the signatory confirms they are authorised to bind the Client.`;

export default function ProjectWorkflow({
  project,
  contracts,
  invoices,
}: {
  project: ProjectRow;
  contracts: ContractRow[];
  invoices: { id: number; number: string; total: number; status: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showContractForm, setShowContractForm] = useState(contracts.length === 0);
  const [signUrl, setSignUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const latestContract = contracts[0];
  const signed = latestContract?.status === 'signed';

  async function api(url: string, method: string, payload: Record<string, unknown>) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Request failed');
    return body;
  }

  async function createContract(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setBusy(true);
    setError('');
    try {
      const body = await api('/api/contracts', 'POST', { ...data, project_id: project.id });
      setSignUrl(`${window.location.origin}${body.sign_url}`);
      setMessage('Contract created. Share the signing link with the client signer.');
      setShowContractForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contract');
    } finally {
      setBusy(false);
    }
  }

  async function generateInvoice() {
    setBusy(true);
    setError('');
    try {
      const body = await api('/api/invoices', 'POST', { from_project_id: project.id });
      router.push(`/dashboard/accounts/invoices/${body.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invoice');
      setBusy(false);
    }
  }

  async function updateStatus(status: string) {
    setError('');
    try {
      await api(`/api/projects/${project.id}`, 'PATCH', { status });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  }

  return (
    <div className="lead-layout">
      <div>
        {/* Workflow steps */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Contract → Sign → Invoice Workflow</h3>
          <div className="stage-track" style={{ margin: '12px 0 4px' }}>
            <span className={`stage-dot ${contracts.length > 0 ? 'done' : ''}`}>1 · Contract created</span>
            <span className={`stage-dot ${latestContract && latestContract.status !== 'draft' ? 'done' : ''}`}>
              2 · Sent to signer
            </span>
            <span className={`stage-dot ${signed ? 'done' : ''}`}>3 · Signed</span>
            <span className={`stage-dot ${invoices.length > 0 ? 'done' : ''}`}>4 · Invoice generated</span>
          </div>

          {error && <p className="form-msg error">{error}</p>}
          {message && <p className="form-msg success">{message}</p>}
          {signUrl && (
            <div className="lead-message" style={{ marginTop: 12 }}>
              <strong>E-sign link:</strong>{' '}
              <a href={signUrl} target="_blank" rel="noopener noreferrer">{signUrl}</a>
              <br />
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                Send this link to {latestContract?.signer_name || 'the signer'} — they review the
                terms and sign by typing their name.
              </span>
            </div>
          )}

          {signed && invoices.length === 0 && (
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={generateInvoice} disabled={busy}>
                {busy ? 'Generating…' : '⚡ Generate Branded GST Invoice'}
              </button>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
                Creates a tax invoice from the project value with company branding, and posts it
                to the client ledger.
              </p>
            </div>
          )}
          {invoices.length > 0 && (
            <ul className="proposal-list" style={{ marginTop: 12 }}>
              {invoices.map((inv) => (
                <li key={inv.id}>
                  <Link href={`/dashboard/accounts/invoices/${inv.id}`}>{inv.number}</Link>
                  <span>{formatINR(inv.total)} · <span className={`status-pill invoice-${inv.status}`}>{inv.status}</span></span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contracts */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="dash-header" style={{ marginBottom: 10 }}>
            <h3>Contracts</h3>
            <button className="btn btn-outline-dark btn-sm" onClick={() => setShowContractForm((v) => !v)}>
              {showContractForm ? 'Hide form' : '+ New Contract'}
            </button>
          </div>

          {contracts.map((c) => (
            <div key={c.id} className="lead-message" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <strong>{c.title}</strong>
                <span className={`status-pill contract-${c.status}`}>{c.status}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Signer: {c.signer_name} ({c.signer_email})
                {c.signed_at && (
                  <> · Signed as &quot;{c.signed_name}&quot; on {new Date(c.signed_at).toLocaleString()}</>
                )}
              </p>
              {c.status === 'sent' && (
                <p style={{ fontSize: 13, marginTop: 4 }}>
                  Sign link: <a href={`/sign/${c.sign_token}`} target="_blank" rel="noopener noreferrer">
                    /sign/{c.sign_token.slice(0, 10)}…
                  </a>
                </p>
              )}
            </div>
          ))}

          {showContractForm && (
            <form onSubmit={createContract}>
              <div className="form-field" style={{ marginBottom: 12 }}>
                <label htmlFor="ct-title">Contract title *</label>
                <input id="ct-title" name="title" type="text" required maxLength={200}
                       defaultValue={`Service Agreement — ${project.name}`} />
              </div>
              <div className="form-grid" style={{ marginBottom: 12 }}>
                <div className="form-field">
                  <label htmlFor="ct-signer">Signer name *</label>
                  <input id="ct-signer" name="signer_name" type="text" required maxLength={120}
                         defaultValue={project.signer_name || project.client_name} />
                </div>
                <div className="form-field">
                  <label htmlFor="ct-email">Signer email *</label>
                  <input id="ct-email" name="signer_email" type="email" required maxLength={200}
                         defaultValue={project.signer_email || project.client_email} />
                </div>
              </div>
              <div className="form-field" style={{ marginBottom: 12 }}>
                <label htmlFor="ct-body">Contract terms *</label>
                <textarea id="ct-body" name="body" rows={12} required maxLength={20000}
                          defaultValue={DEFAULT_TERMS(project)}
                          style={{ fontFamily: 'monospace', fontSize: 13 }} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? 'Creating…' : 'Create & Get Sign Link'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div>
        <div className="card">
          <h3>Project Status</h3>
          <div className="form-field" style={{ margin: '12px 0' }}>
            <label htmlFor="pj-status">Stage</label>
            <select
              id="pj-status"
              className="status-select"
              value={project.status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <dl className="lead-meta">
            <div><dt>Signer</dt><dd>{project.signer_name || '—'}</dd></div>
            <div><dt>Signer email</dt><dd>{project.signer_email || '—'}</dd></div>
            <div><dt>Start</dt><dd>{project.start_date ? new Date(project.start_date).toLocaleDateString() : '—'}</dd></div>
            <div><dt>Renewal</dt><dd>{project.renewal_date ? new Date(project.renewal_date).toLocaleDateString() : '—'}</dd></div>
          </dl>
          {project.description && (
            <blockquote className="lead-message">{project.description}</blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
