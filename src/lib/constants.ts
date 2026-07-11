/** Full lead lifecycle, in pipeline order. */
export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal Sent',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

export const PROPOSAL_STATUSES = ['draft', 'sent', 'accepted', 'rejected'] as const;

/** Strip a phone number down to digits for tel:/wa.me links. */
export function phoneDigits(phone: string): string {
  return phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}
