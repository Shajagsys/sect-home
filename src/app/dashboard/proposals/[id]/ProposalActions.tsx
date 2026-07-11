'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NEXT_ACTIONS: Record<string, { status: string; label: string }[]> = {
  draft: [{ status: 'sent', label: 'Mark as Sent' }],
  sent: [
    { status: 'accepted', label: 'Mark Accepted (wins the lead)' },
    { status: 'rejected', label: 'Mark Rejected' },
  ],
  accepted: [],
  rejected: [{ status: 'sent', label: 'Re-send' }],
};

export default function ProposalActions({
  proposalId,
  status: initialStatus,
}: {
  proposalId: number;
  status: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState('');

  async function updateStatus(next: string) {
    setError('');
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to update proposal');
      }
      setStatus(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update proposal');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className={`status-pill proposal-${status}`}>{status}</span>
        {(NEXT_ACTIONS[status] || []).map((action) => (
          <button
            key={action.status}
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => updateStatus(action.status)}
          >
            {action.label}
          </button>
        ))}
        <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>
          🖨 Print / Save PDF
        </button>
      </div>
      {error && <p className="form-msg error">{error}</p>}
    </div>
  );
}
