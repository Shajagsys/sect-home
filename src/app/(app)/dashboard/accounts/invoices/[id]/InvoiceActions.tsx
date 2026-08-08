'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/constants';

export default function InvoiceActions({
  invoiceId,
  status,
  balance,
}: {
  invoiceId: number;
  status: string;
  balance: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(balance > 0 ? String(balance) : '');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function recordPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), reference }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to record payment');
      setMessage(`Payment recorded — invoice is now ${body.status}.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!window.confirm('Cancel this invoice? A credit note entry will be added to the ledger.')) return;
    setError('');
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to cancel');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel');
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className={`status-pill invoice-${status}`}>{status}</span>
        <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>
          🖨 Print / Save PDF
        </button>
        {status !== 'cancelled' && status !== 'paid' && (
          <button type="button" className="btn btn-outline-dark btn-sm" onClick={cancel}>
            Cancel Invoice
          </button>
        )}
      </div>

      {status !== 'cancelled' && balance > 0 && (
        <form onSubmit={recordPayment}
              style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            Record payment (balance {formatINR(balance)}):
          </span>
          <input type="number" min="0.01" step="0.01" value={amount} required
                 onChange={(e) => setAmount(e.target.value)}
                 style={{ width: 140, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6 }} />
          <input type="text" placeholder="Reference (UTR/cheque no.)" value={reference} maxLength={120}
                 onChange={(e) => setReference(e.target.value)}
                 style={{ width: 220, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6 }} />
          <button className="btn btn-primary btn-sm" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Record Payment'}
          </button>
        </form>
      )}
      {message && <p className="form-msg success">{message}</p>}
      {error && <p className="form-msg error">{error}</p>}
    </div>
  );
}
