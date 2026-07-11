'use client';

import { useState } from 'react';

export interface WebhookKeyRow {
  id: number;
  name: string;
  key: string;
  source_label: string;
  active: boolean;
  created_at: string;
}

export default function WebhooksClient({ initialKeys }: { initialKeys: WebhookKeyRow[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const endpoint =
    typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/leads` : '/api/webhooks/leads';

  async function createKey(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/webhook-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create key');
      setKeys((current) => [
        {
          id: body.id,
          name: String(data.name),
          key: body.key,
          source_label: String(data.source_label || 'webhook').toLowerCase() || 'webhook',
          active: true,
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create key');
    } finally {
      setCreating(false);
    }
  }

  async function toggleKey(id: number, active: boolean) {
    setError('');
    try {
      const res = await fetch(`/api/webhook-keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to update key');
      }
      setKeys((current) => current.map((k) => (k.id === id ? { ...k, active } : k)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update key');
    }
  }

  async function copyKey(id: number, key: string) {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.prompt('Copy the API key:', key);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        {error && <p className="form-msg error">{error}</p>}
        {keys.length === 0 ? (
          <div className="card">
            <h3>No webhook keys yet</h3>
            <p>Create one to start collecting leads from social media and other channels.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="leads" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Source Tag</th>
                  <th>API Key</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} style={{ opacity: k.active ? 1 : 0.55 }}>
                    <td>
                      <strong>{k.name}</strong>
                    </td>
                    <td>
                      <span className="source-chip">{k.source_label}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: 12 }}>{k.key.slice(0, 14)}…</code>
                    </td>
                    <td>
                      <span className={`status-pill ${k.active ? 'status-won' : 'status-lost'}`}>
                        {k.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => copyKey(k.id, k.key)}
                      >
                        {copiedId === k.id ? 'Copied!' : 'Copy key'}
                      </button>{' '}
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => toggleKey(k.id, !k.active)}
                      >
                        {k.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="card" style={{ marginTop: 20 }}>
          <h3>How to connect a channel</h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '8px 0' }}>
            Point your integration (Zapier, Make, n8n, or a custom script) at:
          </p>
          <pre className="code-block">{`POST ${endpoint}
Header: x-api-key: <your key>
Body (JSON):
{
  "name": "Lead name",
  "email": "lead@company.com",
  "phone": "+91 98765 43210",
  "company": "Company Ltd",
  "interest": "Mimecast (Email Security)",
  "message": "Please share pricing",
  "source": "facebook"        // optional, defaults to the key's source tag
}`}</pre>
        </div>
      </div>

      <form className="form-card" onSubmit={createKey}>
        <h3 style={{ color: 'var(--navy)', marginBottom: 14 }}>New webhook key</h3>
        <div className="form-field" style={{ marginBottom: 12 }}>
          <label htmlFor="w-name">Channel name *</label>
          <input
            id="w-name"
            name="name"
            type="text"
            required
            maxLength={120}
            placeholder="e.g. Facebook Lead Ads"
          />
        </div>
        <div className="form-field" style={{ marginBottom: 16 }}>
          <label htmlFor="w-source">Source tag</label>
          <input
            id="w-source"
            name="source_label"
            type="text"
            maxLength={60}
            placeholder="e.g. facebook, linkedin, google-ads"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={creating}>
          {creating ? 'Creating…' : 'Generate Key'}
        </button>
      </form>
    </div>
  );
}
