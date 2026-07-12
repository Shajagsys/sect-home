'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GST_STATES } from '@/lib/gst';

export default function NewClientForm() {
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
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create client');
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h3 style={{ color: 'var(--navy)', marginBottom: 14 }}>Add client</h3>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="c-name">Contact name *</label>
        <input id="c-name" name="name" type="text" required maxLength={120} />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" type="text" maxLength={160} />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="c-email">Email *</label>
        <input id="c-email" name="email" type="email" required maxLength={200} />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="c-phone">Phone</label>
        <input id="c-phone" name="phone" type="tel" maxLength={30} />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="c-gstin">GSTIN</label>
        <input id="c-gstin" name="gstin" type="text" maxLength={15} placeholder="e.g. 29ABCDE1234F1Z5" />
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="c-state">GST State (place of supply)</label>
        <select id="c-state" name="state_code" defaultValue="29">
          {GST_STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
          ))}
        </select>
      </div>
      <div className="form-field" style={{ marginBottom: 12 }}>
        <label htmlFor="c-address">Billing address</label>
        <textarea id="c-address" name="address" rows={2} maxLength={500} />
      </div>
      <div className="form-field" style={{ marginBottom: 16 }}>
        <label htmlFor="c-credit">Credit limit (₹)</label>
        <input id="c-credit" name="credit_limit" type="number" min="0" step="0.01" defaultValue="0" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={saving}>
        {saving ? 'Adding…' : 'Add Client'}
      </button>
      {error && <p className="form-msg error">{error}</p>}
    </form>
  );
}
