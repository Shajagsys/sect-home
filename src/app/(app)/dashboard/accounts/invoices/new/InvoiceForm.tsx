'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { computeGst, GST_RATES, GstItem } from '@/lib/gst';
import { formatINR } from '@/lib/constants';
import { COMPANY } from '@/lib/company';

interface RowInput {
  description: string;
  hsn_sac: string;
  qty: string;
  unit_price: string;
  gst_rate: string;
}

const EMPTY_ROW: RowInput = { description: '', hsn_sac: '998313', qty: '1', unit_price: '', gst_rate: '18' };

export default function InvoiceForm({
  clients,
  projects,
}: {
  clients: { id: number; name: string; company: string | null; state_code: string }[];
  projects: { id: number; name: string; client_id: number }[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [rows, setRows] = useState<RowInput[]>([{ ...EMPTY_ROW }]);
  const [discount, setDiscount] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const client = clients.find((c) => c.id === Number(clientId));
  const interState = client ? client.state_code !== COMPANY.stateCode : false;
  const clientProjects = useMemo(
    () => projects.filter((p) => p.client_id === Number(clientId)),
    [projects, clientId]
  );

  const items: GstItem[] = rows
    .filter((r) => r.description.trim())
    .map((r) => ({
      description: r.description.trim(),
      hsn_sac: r.hsn_sac.trim(),
      qty: Number(r.qty) || 0,
      unit_price: Number(r.unit_price) || 0,
      gst_rate: Number(r.gst_rate) || 0,
    }));
  const totals = computeGst(items, Number(discount) || 0, interState);

  function updateRow(index: number, patch: Partial<RowInput>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: Number(clientId),
          project_id: projectId ? Number(projectId) : null,
          items,
          discount_percent: Number(discount) || 0,
          due_date: dueDate || null,
          notes,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create invoice');
      router.push(`/dashboard/accounts/invoices/${body.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
      setBusy(false);
    }
  }

  return (
    <form className="form-card" style={{ maxWidth: 920 }} onSubmit={submit}>
      <div className="form-grid" style={{ marginBottom: 14 }}>
        <div className="form-field">
          <label htmlFor="i-client">Client *</label>
          <select id="i-client" required value={clientId} onChange={(e) => { setClientId(e.target.value); setProjectId(''); }}>
            <option value="" disabled>Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.company || c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="i-project">Project (optional)</label>
          <select id="i-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">No project</option>
            {clientProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      {client && (
        <p className="form-msg" style={{ color: 'var(--seagreen)', marginBottom: 12 }}>
          Tax type: {interState ? 'IGST (inter-state supply)' : 'CGST + SGST (intra-state supply)'}
        </p>
      )}

      <table className="items-table">
        <thead>
          <tr>
            <th style={{ width: '36%' }}>Description</th>
            <th>HSN/SAC</th>
            <th>Qty</th>
            <th>Rate (₹)</th>
            <th>GST %</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td><input type="text" value={row.description} maxLength={300}
                         onChange={(e) => updateRow(i, { description: e.target.value })} /></td>
              <td><input type="text" value={row.hsn_sac} maxLength={10}
                         onChange={(e) => updateRow(i, { hsn_sac: e.target.value })} /></td>
              <td><input type="number" min="0.01" step="0.01" value={row.qty}
                         onChange={(e) => updateRow(i, { qty: e.target.value })} /></td>
              <td><input type="number" min="0" step="0.01" value={row.unit_price}
                         onChange={(e) => updateRow(i, { unit_price: e.target.value })} /></td>
              <td>
                <select value={row.gst_rate} onChange={(e) => updateRow(i, { gst_rate: e.target.value })}
                        className="status-select">
                  {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                </select>
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>
                {formatINR((Number(row.qty) || 0) * (Number(row.unit_price) || 0))}
              </td>
              <td>
                {rows.length > 1 && (
                  <button type="button" className="btn-icon" aria-label="Remove line"
                          onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}>✕</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-outline-dark btn-sm" style={{ margin: '10px 0 18px' }}
              onClick={() => setRows((r) => [...r, { ...EMPTY_ROW }])}>
        + Add line item
      </button>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="i-discount">Discount %</label>
          <input id="i-discount" type="number" min="0" max="100" step="0.01"
                 value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="i-due">Due date</label>
          <input id="i-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="form-field full">
          <label htmlFor="i-notes">Notes / terms</label>
          <textarea id="i-notes" rows={2} maxLength={4000} value={notes}
                    onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <div className="totals-box">
        <div><span>Taxable</span><span>{formatINR(totals.taxable)}</span></div>
        {interState ? (
          <div><span>IGST</span><span>{formatINR(totals.igst)}</span></div>
        ) : (
          <>
            <div><span>CGST</span><span>{formatINR(totals.cgst)}</span></div>
            <div><span>SGST</span><span>{formatINR(totals.sgst)}</span></div>
          </>
        )}
        <div className="grand"><span>Total</span><span>{formatINR(totals.total)}</span></div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-primary" type="submit" disabled={busy || !clientId || items.length === 0}>
          {busy ? 'Creating…' : 'Create Tax Invoice'}
        </button>
      </div>
      {error && <p className="form-msg error">{error}</p>}
    </form>
  );
}
