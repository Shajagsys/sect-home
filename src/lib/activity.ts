import { query } from '@/lib/db';

export type ActivityType =
  | 'created'
  | 'note'
  | 'status_change'
  | 'assignment'
  | 'proposal'
  | 'value_change';

/** Append an entry to a lead's activity timeline. Never throws. */
export async function logActivity(
  leadId: number,
  type: ActivityType,
  detail: string,
  actorId?: number | null
): Promise<void> {
  try {
    await query(
      'INSERT INTO lead_activities (lead_id, actor_id, type, detail) VALUES ($1, $2, $3, $4)',
      [leadId, actorId ?? null, type, detail]
    );
  } catch (err) {
    console.error('Activity log error:', err);
  }
}
