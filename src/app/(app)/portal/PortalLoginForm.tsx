'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalLoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Login failed');
      router.push('/portal/home');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-field">
        <label htmlFor="pl-email">Email</label>
        <input id="pl-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="form-field">
        <label htmlFor="pl-code">Access code</label>
        <input id="pl-code" name="code" type="password" required minLength={6} />
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign In'}
      </button>
      {error && <p className="form-msg error">{error}</p>}
    </form>
  );
}
