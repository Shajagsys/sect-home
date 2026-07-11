'use client';

import { useState } from 'react';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string | null;
  source: string;
  status: string;
  created_at: string;
}

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [error, setError] = useState('');

  async function updateStatus(id: number, status: string) {
    const previous = leads;
    setLeads((current) => current.map((l) => (l.id === id ? { ...l, status } : l)));
    setError('');
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to update lead');
      }
    } catch (err) {
      setLeads(previous);
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    }
  }

  if (leads.length === 0) {
    return (
      <div className="card">
        <h3>No leads yet</h3>
        <p>
          Leads submitted through the website&apos;s &quot;Get a Quote&quot; form will appear
          here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      {error && <p className="form-msg error">{error}</p>}
      <div className="table-wrap">
        <table className="leads">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Contact</th>
              <th>Company</th>
              <th>Interest</th>
              <th>Received</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong>{lead.name}</strong>
                </td>
                <td>
                  {lead.email}
                  {lead.phone && (
                    <>
                      <br />
                      {lead.phone}
                    </>
                  )}
                </td>
                <td>{lead.company || '—'}</td>
                <td>{lead.interest || '—'}</td>
                <td>{new Date(lead.created_at).toLocaleString()}</td>
                <td>
                  <span className={`status-pill status-${lead.status}`}>{lead.status}</span>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    aria-label={`Update status for ${lead.name}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
