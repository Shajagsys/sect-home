'use client';

import { useState } from 'react';

export interface RequestRow {
  id: number;
  type: string;
  title: string;
  details: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ['new', 'reviewing', 'approved', 'rejected'];

export default function RequestsCard({ requests: initial }: { requests: RequestRow[] }) {
  const [requests, setRequests] = useState(initial);
  const [error, setError] = useState('');

  async function updateStatus(id: number, status: string) {
    setError('');
    const previous = requests;
    setRequests((current) => current.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const res = await fetch(`/api/project-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to update');
      }
    } catch (err) {
      setRequests(previous);
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  }

  return (
    <div className="card">
      <h3>Portal Requests</h3>
      {error && <p className="form-msg error">{error}</p>}
      {requests.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>
          No requests from this client yet.
        </p>
      ) : (
        <ul className="proposal-list">
          {requests.map((r) => (
            <li key={r.id} style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <span>
                  <span className="source-chip">{r.type.replace('_', ' ')}</span>{' '}
                  <strong>{r.title}</strong>
                </span>
                <select
                  className="status-select"
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {r.details && (
                <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{r.details}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
