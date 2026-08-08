'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectForm({
  clients,
  defaultClientId,
}: {
  clients: { id: number; name: string; company: string | null }[];
  defaultClientId?: number;
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create project');
      router.push(`/dashboard/projects/${body.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h3 style={{ color: 'var(--navy)', marginBottom: 14 }}>New project</h3>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="p-client">Client *</label>
        <select id="p-client" name="client_id" required defaultValue={defaultClientId ?? ''}>
          <option value="" disabled>Select client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.company || c.name}</option>
          ))}
        </select>
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="p-name">Project name *</label>
        <input id="p-name" name="name" type="text" required maxLength={200}
               placeholder="e.g. Mimecast rollout — 200 users" />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="p-value">Value (₹)</label>
        <input id="p-value" name="value" type="number" min="0" step="0.01" defaultValue="0" />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="p-signer-name">Signer name (client authorised signatory)</label>
        <input id="p-signer-name" name="signer_name" type="text" maxLength={120} />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="p-signer-email">Signer email</label>
        <input id="p-signer-email" name="signer_email" type="email" maxLength={200} />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="p-start">Start date</label>
        <input id="p-start" name="start_date" type="date" />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="p-renewal">Renewal date</label>
        <input id="p-renewal" name="renewal_date" type="date" />
      </div>
      <div className="form-field" style={{ marginBottom: 16 }}>
        <label htmlFor="p-desc">Description</label>
        <textarea id="p-desc" name="description" rows={3} maxLength={4000} />
      </div>
      <button className="btn btn-primary" type="submit" disabled={saving}>
        {saving ? 'Creating…' : 'Create Project'}
      </button>
      {error && <p className="form-msg error">{error}</p>}
    </form>
  );
}
