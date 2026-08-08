'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { computeTotals, ProposalItem } from '@/lib/proposals';
import { formatINR } from '@/lib/constants';

interface RowInput {
  description: string;
  qty: string;
  unit_price: string;
}

const EMPTY_ROW: RowInput = { description: '', qty: '1', unit_price: '' };

export default function ProposalForm({
  leadId,
  defaultTitle,
}: {
  leadId: number;
  defaultTitle: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultTitle ? `Proposal — ${defaultTitle}` : '');
  const [rows, setRows] = useState<RowInput[]>([{ ...EMPTY_ROW }]);
  const [taxPercent, setTaxPercent] = useState('18');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const items: ProposalItem[] = rows
    .filter((r) => r.description.trim())
    .map((r) => ({
      description: r.description.trim(),
      qty: Number(r.qty) || 0,
      unit_price: Number(r.unit_price) || 0,
    }));
  const totals = computeTotals(items, Number(taxPercent) || 0, Number(discountPercent) || 0);

  function updateRow(index: number, patch: Partial<RowInput>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          title,
          items,
          tax_percent: Number(taxPercent) || 0,
          discount_percent: Number(discountPercent) || 0,
          valid_until: validUntil || null,
          notes,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create proposal');
      router.push(`/dashboard/proposals/${body.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create proposal');
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" style={{ maxWidth: 860 }} onSubmit={handleSubmit}>
      <div className="form-field full" style={{ marginBottom: 16 }}>
        <label htmlFor="p-title">Proposal title *</label>
        <input
          id="p-title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Mimecast Email Security — 200 users, 1 year"
        />
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Description</th>
            <th>Qty</th>
            <th>Unit Price (₹)</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  type="text"
                  value={row.description}
                  maxLength={300}
                  placeholder="Product / service / license"
                  onChange={(e) => updateRow(i, { description: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={row.qty}
                  onChange={(e) => updateRow(i, { qty: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.unit_price}
                  onChange={(e) => updateRow(i, { unit_price: e.target.value })}
                />
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>
                {formatINR((Number(row.qty) || 0) * (Number(row.unit_price) || 0))}
              </td>
              <td>
                {rows.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label="Remove line"
                    onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
                  >
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="btn btn-outline-dark btn-sm"
        onClick={() => setRows((r) => [...r, { ...EMPTY_ROW }])}
        style={{ margin: '10px 0 20px' }}
      >
        + Add line item
      </button>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="p-tax">Tax / GST %</label>
          <input
            id="p-tax"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="p-discount">Discount %</label>
          <input
            id="p-discount"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="p-valid">Valid until</label>
          <input
            id="p-valid"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
        <div className="form-field full">
          <label htmlFor="p-notes">Terms / notes</label>
          <textarea
            id="p-notes"
            rows={3}
            maxLength={4000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, delivery timeline, scope notes…"
          />
        </div>
      </div>

      <div className="totals-box">
        <div>
          <span>Subtotal</span>
          <span>{formatINR(totals.subtotal)}</span>
        </div>
        <div>
          <span>Discount</span>
          <span>− {formatINR(totals.discount)}</span>
        </div>
        <div>
          <span>Tax</span>
          <span>{formatINR(totals.tax)}</span>
        </div>
        <div className="grand">
          <span>Total</span>
          <span>{formatINR(totals.total)}</span>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-primary" type="submit" disabled={submitting || items.length === 0}>
          {submitting ? 'Creating…' : 'Create Proposal'}
        </button>
      </div>
      {error && <p className="form-msg error">{error}</p>}
    </form>
  );
}
