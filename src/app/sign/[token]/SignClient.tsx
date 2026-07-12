'use client';

import { useState } from 'react';

export default function SignClient({
  token,
  status: initialStatus,
  signerName,
  signedName,
  signedAt,
}: {
  token: string;
  status: string;
  signerName: string;
  signedName: string | null;
  signedAt: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function act(action: 'sign' | 'decline') {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'sign' ? { signed_name: name } : { action: 'decline' }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Something went wrong');
      setStatus(body.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  if (status === 'signed') {
    return (
      <div className="lead-message" style={{ marginTop: 24, borderLeftColor: 'var(--success)' }}>
        <strong>✅ Contract signed</strong>
        <p style={{ fontSize: 14, marginTop: 4 }}>
          Signed{signedName ? ` by ${signedName}` : name ? ` by ${name}` : ''}
          {signedAt ? ` on ${new Date(signedAt).toLocaleString()}` : ''}. Thank you — the
          SecureEdge team has been notified and will proceed with the project.
        </p>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className="lead-message" style={{ marginTop: 24, borderLeftColor: 'var(--danger)' }}>
        <strong>Contract declined.</strong>
        <p style={{ fontSize: 14, marginTop: 4 }}>
          Please contact the SecureEdge team if you would like to discuss the terms.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 28, borderTop: '2px solid var(--border)', paddingTop: 20 }}>
      <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>E-Signature</h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 14 }}>
        To sign this contract, type your full legal name exactly as authorised
        ({signerName}) and confirm agreement.
      </p>
      <div className="form-field" style={{ marginBottom: 12, maxWidth: 380 }}>
        <label htmlFor="sig-name">Full name</label>
        <input
          id="sig-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={signerName}
          maxLength={120}
          style={{ fontFamily: 'cursive', fontSize: 18 }}
        />
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          style={{ marginTop: 3 }}
        />
        <span>
          I confirm I am authorised to sign on behalf of the client, I have read and agree to
          the terms above, and I understand this constitutes a legally binding electronic
          signature.
        </span>
      </label>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          disabled={busy || !agree || name.trim().length < 3}
          onClick={() => act('sign')}
        >
          {busy ? 'Signing…' : '✍️ Sign Contract'}
        </button>
        <button className="btn btn-outline-dark" disabled={busy} onClick={() => act('decline')}>
          Decline
        </button>
      </div>
      {error && <p className="form-msg error">{error}</p>}
    </div>
  );
}
