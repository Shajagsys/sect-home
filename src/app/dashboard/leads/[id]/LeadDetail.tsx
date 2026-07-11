'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LEAD_STATUSES,
  STATUS_LABELS,
  LeadStatus,
  phoneDigits,
  formatINR,
} from '@/lib/constants';
import type { TeamMember } from '../../LeadsTable';

export interface LeadFull {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string | null;
  message: string | null;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string;
  value: number;
  assigned_to: number | null;
  assigned_to_name: string | null;
  created_at: string;
}

export interface Activity {
  id: number;
  type: string;
  detail: string;
  actor_name: string | null;
  created_at: string;
}

export interface ProposalSummary {
  id: number;
  title: string;
  total: number;
  status: string;
  created_at: string;
}

const ACTIVITY_ICONS: Record<string, string> = {
  created: '✨',
  note: '📝',
  status_change: '🔁',
  assignment: '👤',
  proposal: '📄',
  value_change: '💰',
};

export default function LeadDetail({
  lead: initialLead,
  initialActivities,
  proposals,
  team,
}: {
  lead: LeadFull;
  initialActivities: Activity[];
  proposals: ProposalSummary[];
  team: TeamMember[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [activities, setActivities] = useState(initialActivities);
  const [note, setNote] = useState('');
  const [valueInput, setValueInput] = useState(String(initialLead.value || ''));
  const [error, setError] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  async function patchLead(patch: Record<string, unknown>) {
    setError('');
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to update lead');
      }
      setLead((current) => {
        const next = { ...current, ...patch } as LeadFull;
        if ('assigned_to' in patch) {
          next.assigned_to_name =
            patch.assigned_to === null
              ? null
              : team.find((m) => m.id === Number(patch.assigned_to))?.name || null;
        }
        return next;
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    }
  }

  async function addNote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!note.trim()) return;
    setSavingNote(true);
    setError('');
    try {
      const res = await fetch(`/api/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to add note');
      setActivities((current) => [body.activity, ...current]);
      setNote('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setSavingNote(false);
    }
  }

  const waText = encodeURIComponent(
    `Hello ${lead.name}, this is SecureEdge Cyber Technologies regarding your enquiry` +
      (lead.interest ? ` about ${lead.interest}.` : '.')
  );

  return (
    <div className="lead-layout">
      {/* Left column: lead info + lifecycle controls */}
      <div>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="dash-header" style={{ marginBottom: 12 }}>
            <h1 style={{ fontSize: 22, color: 'var(--navy)' }}>{lead.name}</h1>
            <span className={`status-pill status-${lead.status}`}>
              {STATUS_LABELS[lead.status as LeadStatus] || lead.status}
            </span>
          </div>
          {lead.company && <p style={{ fontWeight: 600 }}>{lead.company}</p>}
          <p style={{ marginTop: 8 }}>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
            {lead.phone && <> · {lead.phone}</>}
          </p>

          <div className="contact-actions" style={{ marginTop: 14 }}>
            {lead.phone && (
              <>
                <a href={`tel:${lead.phone}`} className="action-chip">
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${phoneDigits(lead.phone)}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-chip whatsapp"
                >
                  💬 WhatsApp
                </a>
              </>
            )}
            <a href={`mailto:${lead.email}`} className="action-chip">
              ✉️ Email
            </a>
            <Link href={`/dashboard/leads/${lead.id}/proposals/new`} className="action-chip proposal">
              📄 Create Proposal
            </Link>
          </div>

          <dl className="lead-meta">
            <div>
              <dt>Interested in</dt>
              <dd>{lead.interest || '—'}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                <span className="source-chip">{lead.source}</span>
                {lead.utm_campaign && (
                  <span style={{ marginLeft: 6, color: 'var(--muted)', fontSize: 12.5 }}>
                    campaign: {lead.utm_campaign}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt>Received</dt>
              <dd>{new Date(lead.created_at).toLocaleString()}</dd>
            </div>
          </dl>
          {lead.message && (
            <blockquote className="lead-message">{lead.message}</blockquote>
          )}
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Lifecycle</h3>
          <div className="stage-track" aria-hidden="true">
            {LEAD_STATUSES.filter((s) => s !== 'lost').map((s, i) => {
              const currentIndex = LEAD_STATUSES.indexOf(lead.status as LeadStatus);
              const done = i <= currentIndex && lead.status !== 'lost';
              return (
                <span key={s} className={`stage-dot ${done ? 'done' : ''}`} title={STATUS_LABELS[s]}>
                  {STATUS_LABELS[s]}
                </span>
              );
            })}
          </div>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="form-field">
              <label htmlFor="lead-stage">Stage</label>
              <select
                id="lead-stage"
                className="status-select"
                value={lead.status}
                onChange={(e) => patchLead({ status: e.target.value })}
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="lead-assignee">Assigned to</label>
              <select
                id="lead-assignee"
                className="status-select"
                value={lead.assigned_to ?? ''}
                onChange={(e) =>
                  patchLead({
                    assigned_to: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              >
                <option value="">Unassigned</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field full">
              <label htmlFor="lead-value">Estimated deal value (₹)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="lead-value"
                  type="number"
                  min={0}
                  step="0.01"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => patchLead({ value: Number(valueInput) || 0 })}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          {error && <p className="form-msg error">{error}</p>}
        </div>

        <div className="card">
          <div className="dash-header" style={{ marginBottom: 10 }}>
            <h3>Proposals</h3>
            <Link href={`/dashboard/leads/${lead.id}/proposals/new`} className="btn btn-primary btn-sm">
              + New Proposal
            </Link>
          </div>
          {proposals.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No proposals yet.</p>
          ) : (
            <ul className="proposal-list">
              {proposals.map((p) => (
                <li key={p.id}>
                  <Link href={`/dashboard/proposals/${p.id}`}>
                    #{p.id} — {p.title}
                  </Link>
                  <span>
                    {formatINR(p.total)} ·{' '}
                    <span className={`status-pill proposal-${p.status}`}>{p.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right column: notes + activity timeline */}
      <div>
        <div className="card">
          <h3>Notes &amp; Activity</h3>
          <form onSubmit={addNote} style={{ margin: '12px 0 20px' }}>
            <textarea
              rows={3}
              placeholder="Add a note — call summary, follow-up plan…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontFamily: 'inherit',
                fontSize: 14.5,
              }}
            />
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={savingNote || !note.trim()}
              style={{ marginTop: 8 }}
            >
              {savingNote ? 'Saving…' : 'Add Note'}
            </button>
          </form>

          <ol className="timeline">
            {activities.map((activity) => (
              <li key={activity.id} className="timeline-item">
                <span className="timeline-icon" aria-hidden="true">
                  {ACTIVITY_ICONS[activity.type] || '•'}
                </span>
                <div>
                  <p className="timeline-detail">{activity.detail}</p>
                  <p className="timeline-meta">
                    {activity.actor_name ? `${activity.actor_name} · ` : ''}
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
