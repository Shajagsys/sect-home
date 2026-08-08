'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/constants';
import { GST_RATES } from '@/lib/gst';

export interface PoRow {
  id: number;
  number: string;
  vendor_name: string;
  total: number;
  status: string;
  created_at: string;
  project_name: string | null;
}

export interface BillRow {
  id: number;
  bill_number: string;
  vendor_name: string;
  bill_date: string;
  taxable: number;
  gst: number;
  total: number;
  status: string;
  project_name: string | null;
}

const PO_NEXT: Record<string, string[]> = {
  requested: ['approved', 'cancelled'],
  approved: ['ordered', 'cancelled'],
  ordered: ['received', 'cancelled'],
  received: ['billed'],
  billed: [],
  cancelled: [],
};

export default function PurchasesClient({
  pos,
  bills,
  projects,
  isAdmin,
}: {
  pos: PoRow[];
  bills: BillRow[];
  projects: { id: number; name: string }[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function patch(url: string, payload: Record<string, unknown>) {
    setError('');
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Update failed');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function createPo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_name: data.vendor_name,
          vendor_gstin: data.vendor_gstin,
          project_id: data.project_id || null,
          inter_state: data.inter_state === 'on',
          notes: data.notes,
          items: [{
            description: data.item_description,
            hsn_sac: data.item_hsn,
            qty: Number(data.item_qty),
            unit_price: Number(data.item_price),
            gst_rate: Number(data.item_gst),
          }],
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to raise purchase request');
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to raise purchase request');
    } finally {
      setBusy(false);
    }
  }

  async function createBill(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/purchase-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bill_number: data.bill_number,
          vendor_name: data.vendor_name,
          vendor_gstin: data.vendor_gstin,
          project_id: data.project_id || null,
          bill_date: data.bill_date || null,
          taxable: Number(data.taxable),
          cgst: Number(data.cgst) || 0,
          sgst: Number(data.sgst) || 0,
          igst: Number(data.igst) || 0,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to record bill');
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record bill');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {error && <p className="form-msg error">{error}</p>}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Purchase Requests &amp; Orders</h3>
            {pos.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>
                No purchase orders yet — raise a request on the right.
              </p>
            ) : (
              <div className="table-wrap" style={{ border: 'none', marginTop: 10 }}>
                <table className="leads" style={{ minWidth: 560 }}>
                  <thead>
                    <tr><th>PO</th><th>Vendor</th><th>Project</th><th>Total</th><th>Status</th><th>Advance</th></tr>
                  </thead>
                  <tbody>
                    {pos.map((po) => (
                      <tr key={po.id}>
                        <td><strong>{po.number}</strong></td>
                        <td>{po.vendor_name}</td>
                        <td>{po.project_name || '—'}</td>
                        <td>{formatINR(po.total)}</td>
                        <td><span className={`status-pill po-${po.status}`}>{po.status}</span></td>
                        <td>
                          {(PO_NEXT[po.status] || [])
                            .filter((s) => s !== 'approved' || isAdmin)
                            .map((s) => (
                              <button key={s} type="button" className="btn btn-outline-dark btn-sm"
                                      style={{ marginRight: 6, marginBottom: 4 }}
                                      onClick={() => patch(`/api/purchase-orders/${po.id}`, { status: s })}>
                                {s}
                              </button>
                            ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Purchase Invoices (GST Inward / ITC)</h3>
            {bills.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>No vendor bills yet.</p>
            ) : (
              <div className="table-wrap" style={{ border: 'none', marginTop: 10 }}>
                <table className="leads" style={{ minWidth: 560 }}>
                  <thead>
                    <tr><th>Bill</th><th>Vendor</th><th>Date</th><th>Taxable</th><th>GST</th><th>Total</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {bills.map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.bill_number}</strong></td>
                        <td>{b.vendor_name}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(b.bill_date).toLocaleDateString()}</td>
                        <td>{formatINR(b.taxable)}</td>
                        <td>{formatINR(b.gst)}</td>
                        <td>{formatINR(b.total)}</td>
                        <td>
                          <select className="status-select" value={b.status}
                                  onChange={(e) => patch(`/api/purchase-invoices/${b.id}`, { status: e.target.value })}>
                            <option value="unpaid">unpaid</option>
                            <option value="paid">paid</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <form className="form-card" style={{ marginBottom: 20 }} onSubmit={createPo}>
            <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Raise purchase request</h3>
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Vendor name *</label>
              <input name="vendor_name" type="text" required maxLength={200} />
            </div>
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Vendor GSTIN</label>
              <input name="vendor_gstin" type="text" maxLength={15} />
            </div>
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Project (cost attribution)</label>
              <select name="project_id" defaultValue="">
                <option value="">No project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Item description *</label>
              <input name="item_description" type="text" required maxLength={300} />
            </div>
            <div className="form-grid" style={{ marginBottom: 10 }}>
              <div className="form-field">
                <label>HSN/SAC</label>
                <input name="item_hsn" type="text" maxLength={10} />
              </div>
              <div className="form-field">
                <label>Qty *</label>
                <input name="item_qty" type="number" min="0.01" step="0.01" defaultValue="1" required />
              </div>
              <div className="form-field">
                <label>Unit price (₹) *</label>
                <input name="item_price" type="number" min="0" step="0.01" required />
              </div>
              <div className="form-field">
                <label>GST rate</label>
                <select name="item_gst" defaultValue="18">
                  {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', gap: 8, fontSize: 13.5, marginBottom: 12 }}>
              <input type="checkbox" name="inter_state" /> Inter-state vendor (IGST)
            </label>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Raise Request'}
            </button>
          </form>

          <form className="form-card" onSubmit={createBill}>
            <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Record vendor bill</h3>
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Vendor bill number *</label>
              <input name="bill_number" type="text" required maxLength={60} />
            </div>
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Vendor name *</label>
              <input name="vendor_name" type="text" required maxLength={200} />
            </div>
            <div className="form-grid" style={{ marginBottom: 10 }}>
              <div className="form-field">
                <label>Vendor GSTIN</label>
                <input name="vendor_gstin" type="text" maxLength={15} />
              </div>
              <div className="form-field">
                <label>Bill date</label>
                <input name="bill_date" type="date" />
              </div>
              <div className="form-field">
                <label>Taxable (₹) *</label>
                <input name="taxable" type="number" min="0" step="0.01" required />
              </div>
              <div className="form-field">
                <label>Project</label>
                <select name="project_id" defaultValue="">
                  <option value="">No project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>CGST (₹)</label>
                <input name="cgst" type="number" min="0" step="0.01" defaultValue="0" />
              </div>
              <div className="form-field">
                <label>SGST (₹)</label>
                <input name="sgst" type="number" min="0" step="0.01" defaultValue="0" />
              </div>
              <div className="form-field">
                <label>IGST (₹)</label>
                <input name="igst" type="number" min="0" step="0.01" defaultValue="0" />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Record Bill'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
