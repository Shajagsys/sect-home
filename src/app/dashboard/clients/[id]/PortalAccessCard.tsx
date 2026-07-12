'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalAccessCard({
  clientId,
  portalEnabled,
}: {
  clientId: number;
  portalEnabled: boolean;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(portalEnabled);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function patch(payload: Record<string, unknown>, successMsg: string) {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Update failed');
      setMessage(successMsg);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  return (
    <div className="card">
      <h3>Client Portal Access</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: '6px 0 12px' }}>
        The client signs in at <code>/portal</code> with their email and this access code to
        see invoices, projects, renewals, credit balance and raise requests.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Set access code (min 6 chars)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          minLength={6}
          style={{
            flex: 1, minWidth: 200, padding: '9px 12px',
            border: '1px solid var(--border)', borderRadius: 6, fontSize: 14,
          }}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={code.length < 6}
          onClick={() => {
            patch({ portal_code: code }, 'Access code set and portal enabled.');
            setEnabled(true);
            setCode('');
          }}
        >
          Set Code &amp; Enable
        </button>
        {enabled && (
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={() => {
              patch({ portal_enabled: false }, 'Portal disabled.');
              setEnabled(false);
            }}
          >
            Disable Portal
          </button>
        )}
      </div>
      {message && <p className="form-msg success">{message}</p>}
      {error && <p className="form-msg error">{error}</p>}
    </div>
  );
}
