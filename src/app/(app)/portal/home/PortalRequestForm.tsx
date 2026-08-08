'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PastRequest {
  id: number;
  type: string;
  title: string;
  status: string;
  created_at: string;
}

export default function PortalRequestForm({
  projects,
  pastRequests,
}: {
  projects: { id: number; name: string }[];
  pastRequests: PastRequest[];
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/portal/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to submit request');
      form.reset();
      setMessage('Request submitted — our team will get back to you shortly.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>Raise a Request</h3>
      <form onSubmit={submit} style={{ marginTop: 12 }}>
        <div className="form-grid" style={{ marginBottom: 12 }}>
          <div className="form-field">
            <label htmlFor="rq-type">Type</label>
            <select id="rq-type" name="type" defaultValue="new_project">
              <option value="new_project">New project</option>
              <option value="renewal">Renewal</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="rq-project">Related project (optional)</label>
            <select id="rq-project" name="project_id" defaultValue="">
              <option value="">None</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-field full">
            <label htmlFor="rq-title">Title *</label>
            <input id="rq-title" name="title" type="text" required maxLength={200}
                   placeholder="e.g. Renew Mimecast licenses for FY 2027" />
          </div>
          <div className="form-field full">
            <label htmlFor="rq-details">Details</label>
            <textarea id="rq-details" name="details" rows={3} maxLength={4000} />
          </div>
        </div>
        <button className="btn btn-primary btn-sm" type="submit" disabled={busy}>
          {busy ? 'Submitting…' : 'Submit Request'}
        </button>
        {message && <p className="form-msg success">{message}</p>}
        {error && <p className="form-msg error">{error}</p>}
      </form>

      {pastRequests.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>My Requests</h3>
          <ul className="proposal-list">
            {pastRequests.map((r) => (
              <li key={r.id}>
                <span>
                  <span className="source-chip">{r.type.replace('_', ' ')}</span> {r.title}
                </span>
                <span className={`status-pill request-${r.status}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
