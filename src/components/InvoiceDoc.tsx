import { COMPANY } from '@/lib/company';
import { GstItem, amountInWordsINR, stateName } from '@/lib/gst';
import { formatINR } from '@/lib/constants';

export interface InvoiceData {
  id: number;
  number: string;
  issue_date: string;
  due_date: string | null;
  items: GstItem[];
  discount_percent: number;
  place_of_supply: string;
  inter_state: boolean;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  amount_paid: number;
  status: string;
  notes: string | null;
  client_name: string;
  client_company: string | null;
  client_email: string;
  client_gstin: string | null;
  client_address: string | null;
  project_name: string | null;
}

/** Company-branded GST tax invoice, shared by the dashboard and client portal. */
export default function InvoiceDoc({ invoice }: { invoice: InvoiceData }) {
  const balance = invoice.total - invoice.amount_paid;
  return (
    <div className="proposal-doc invoice-doc">
      <div className="proposal-head">
        <div className="invoice-brand">
          <span className="brand-mark" aria-hidden="true">SE</span>
          <div>
            <h1>{COMPANY.name}</h1>
            <p>{COMPANY.tagline}</p>
            <p>{COMPANY.address}</p>
            <p>
              {COMPANY.gstin && <>GSTIN: {COMPANY.gstin} · </>}
              State: {stateName(COMPANY.stateCode)} ({COMPANY.stateCode}) · {COMPANY.email}
            </p>
          </div>
        </div>
        <div className="proposal-id">
          <h2>TAX INVOICE</h2>
          <p><strong>{invoice.number}</strong></p>
          <p>Date: {new Date(invoice.issue_date).toLocaleDateString('en-IN')}</p>
          {invoice.due_date && (
            <p>Due: {new Date(invoice.due_date).toLocaleDateString('en-IN')}</p>
          )}
          <p>
            <span className={`status-pill invoice-${invoice.status}`}>{invoice.status}</span>
          </p>
        </div>
      </div>

      <div className="invoice-parties">
        <div className="proposal-to">
          <h3>Bill To</h3>
          <p><strong>{invoice.client_company || invoice.client_name}</strong></p>
          {invoice.client_company && <p>Attn: {invoice.client_name}</p>}
          {invoice.client_address && <p>{invoice.client_address}</p>}
          <p>{invoice.client_email}</p>
          {invoice.client_gstin && <p>GSTIN: {invoice.client_gstin}</p>}
        </div>
        <div className="proposal-to">
          <h3>Supply Details</h3>
          <p>Place of supply: {stateName(invoice.place_of_supply)} ({invoice.place_of_supply})</p>
          <p>Tax type: {invoice.inter_state ? 'IGST (inter-state)' : 'CGST + SGST (intra-state)'}</p>
          {invoice.project_name && <p>Project: {invoice.project_name}</p>}
        </div>
      </div>

      <table className="items-table doc">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ width: '40%' }}>Description</th>
            <th>HSN/SAC</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>GST %</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.description}</td>
              <td>{item.hsn_sac || '—'}</td>
              <td>{item.qty}</td>
              <td>{formatINR(item.unit_price)}</td>
              <td>{item.gst_rate}%</td>
              <td>{formatINR(item.qty * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals-box doc">
        <div><span>Taxable Value</span><span>{formatINR(invoice.taxable)}</span></div>
        {invoice.discount_percent > 0 && (
          <div><span>Discount applied</span><span>{invoice.discount_percent}%</span></div>
        )}
        {invoice.inter_state ? (
          <div><span>IGST</span><span>{formatINR(invoice.igst)}</span></div>
        ) : (
          <>
            <div><span>CGST</span><span>{formatINR(invoice.cgst)}</span></div>
            <div><span>SGST</span><span>{formatINR(invoice.sgst)}</span></div>
          </>
        )}
        <div className="grand"><span>Invoice Total</span><span>{formatINR(invoice.total)}</span></div>
        {invoice.amount_paid > 0 && (
          <>
            <div><span>Paid</span><span>{formatINR(invoice.amount_paid)}</span></div>
            <div className="grand"><span>Balance Due</span><span>{formatINR(balance)}</span></div>
          </>
        )}
      </div>

      <p className="invoice-words">
        <strong>Amount in words:</strong> {amountInWordsINR(invoice.total)}
      </p>

      <div className="proposal-notes">
        <h3>Payment &amp; Terms</h3>
        <p>{COMPANY.bankDetails}</p>
        {invoice.notes && <p>{invoice.notes}</p>}
      </div>

      <div className="invoice-sign">
        <p>For {COMPANY.name}</p>
        <p className="invoice-sign-line">Authorised Signatory</p>
      </div>

      <p className="proposal-footer">
        This is a computer-generated tax invoice. {COMPANY.gstin ? `GSTIN: ${COMPANY.gstin}` : ''}
      </p>
    </div>
  );
}
