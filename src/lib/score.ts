/**
 * Client health score, 0–100.
 *
 *   50 baseline
 * + up to 25 for payment behaviour (share of invoiced amount actually paid)
 * − 10 per overdue invoice (max −20)
 * + up to 15 for lifetime revenue (₹1L → 5, ₹5L → 10, ₹10L+ → 15)
 * + 10 for activity in the last 60 days (message, invoice or project)
 */
export interface ScoreInputs {
  invoicedTotal: number;
  paidTotal: number;
  overdueCount: number;
  lastActivityDays: number | null;
}

export function clientScore(s: ScoreInputs): number {
  let score = 50;
  if (s.invoicedTotal > 0) {
    score += 25 * Math.min(s.paidTotal / s.invoicedTotal, 1);
  }
  score -= Math.min(s.overdueCount, 2) * 10;
  if (s.paidTotal >= 1000000) score += 15;
  else if (s.paidTotal >= 500000) score += 10;
  else if (s.paidTotal >= 100000) score += 5;
  if (s.lastActivityDays !== null && s.lastActivityDays <= 60) score += 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreBand(score: number): { label: string; cls: string } {
  if (score >= 75) return { label: 'Excellent', cls: 'status-won' };
  if (score >= 55) return { label: 'Good', cls: 'status-new' };
  if (score >= 35) return { label: 'At Risk', cls: 'status-contacted' };
  return { label: 'Critical', cls: 'status-lost' };
}
