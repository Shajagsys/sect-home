'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LEAD_STATUSES, STATUS_LABELS, LeadStatus, phoneDigits } from '@/lib/constants';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string | null;
  source: string;
  status: string;
  value: number;
  assigned_to: number | null;
  assigned_to_name: string | null;
  created_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
}

export default function LeadsTable({
  initialLeads,
  team,
}: {
  initialLeads: Lead[];
  team: TeamMember[];
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  const sources = useMemo(
    () => Array.from(new Set(initialLeads.map((l) => l.source))).sort(),
    [initialLeads]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
      if (assigneeFilter === 'unassigned' && lead.assigned_to !== null) return false;
      if (
        assigneeFilter !== 'all' &&
        assigneeFilter !== 'unassigned' &&
        lead.assigned_to !== Number(assigneeFilter)
      )
        return false;
      if (!q) return true;
      return [lead.name, lead.email, lead.phone, lead.company, lead.interest]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [leads, search, statusFilter, sourceFilter, assigneeFilter]);

  async function patchLead(id: number, patch: Record<string, unknown>) {
    const previous = leads;
    setLeads((current) =>
      current.map((l) => {
        if (l.id !== id) return l;
        const next = { ...l, ...patch } as Lead;
        if ('assigned_to' in patch) {
          next.assigned_to_name =
            patch.assigned_to === null
              ? null
              : team.find((m) => m.id === Number(patch.assigned_to))?.name || null;
        }
        return next;
      })
    );
    setError('');
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
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

  return (
    <>
      <div className="filter-bar">
        <input
          type="search"
          className="filter-search"
          placeholder="Search name, email, phone, company, interest…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search leads"
        />
        <select
          className="status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by stage"
        >
          <option value="all">All stages</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          className="status-select"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          aria-label="Filter by source"
        >
          <option value="all">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="status-select"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          aria-label="Filter by assignee"
        >
          <option value="all">Everyone</option>
          <option value="unassigned">Unassigned</option>
          {team.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <span className="filter-count">
          {filtered.length} of {leads.length} leads
        </span>
      </div>

      {error && <p className="form-msg error">{error}</p>}

      {filtered.length === 0 ? (
        <div className="card">
          <h3>No leads match</h3>
          <p>
            {leads.length === 0
              ? 'Leads from the website form, social campaigns and webhooks will appear here automatically.'
              : 'Try clearing the search or filters.'}
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="leads">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contact</th>
                <th>Interest</th>
                <th>Source</th>
                <th>Stage</th>
                <th>Assigned To</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link href={`/dashboard/leads/${lead.id}`} className="lead-name-link">
                      {lead.name}
                    </Link>
                    {lead.company && (
                      <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{lead.company}</div>
                    )}
                  </td>
                  <td>
                    <div>{lead.email}</div>
                    {lead.phone && (
                      <div className="contact-actions">
                        <a href={`tel:${lead.phone}`} className="action-chip" title="Call">
                          📞 Call
                        </a>
                        <a
                          href={`https://wa.me/${phoneDigits(lead.phone)}?text=${encodeURIComponent(
                            `Hello ${lead.name}, this is SecureEdge Cyber Technologies regarding your enquiry.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-chip whatsapp"
                          title="WhatsApp"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    )}
                  </td>
                  <td>{lead.interest || '—'}</td>
                  <td>
                    <span className="source-chip">{lead.source}</span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={lead.status}
                      onChange={(e) => patchLead(lead.id, { status: e.target.value })}
                      aria-label={`Stage for ${lead.name}`}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s as LeadStatus]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={lead.assigned_to ?? ''}
                      onChange={(e) =>
                        patchLead(lead.id, {
                          assigned_to: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      aria-label={`Assignee for ${lead.name}`}
                    >
                      <option value="">Unassigned</option>
                      {team.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
