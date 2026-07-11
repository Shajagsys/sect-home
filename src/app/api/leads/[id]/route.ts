import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { LEAD_STATUSES, STATUS_LABELS, LeadStatus } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Protected endpoint: update a lead from the CRM (status, assignment,
 * estimated value). Each change is recorded on the activity timeline.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
  }

  let body: { status?: string; assigned_to?: number | null; value?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const existing = await query<{ status: string; assigned_to: number | null; value: string }>(
      'SELECT status, assigned_to, value FROM leads WHERE id = $1',
      [id]
    );
    if (existing.rowCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    const current = existing.rows[0];
    const actorId = Number(session.sub);

    const sets: string[] = [];
    const values: unknown[] = [];
    const activities: { type: 'status_change' | 'assignment' | 'value_change'; detail: string }[] = [];

    if (body.status !== undefined) {
      const status = String(body.status);
      if (!LEAD_STATUSES.includes(status as LeadStatus)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      if (status !== current.status) {
        values.push(status);
        sets.push(`status = $${values.length}`);
        activities.push({
          type: 'status_change',
          detail: `Stage changed: ${STATUS_LABELS[current.status as LeadStatus] || current.status} → ${STATUS_LABELS[status as LeadStatus]}`,
        });
      }
    }

    if (body.assigned_to !== undefined) {
      const assignedTo = body.assigned_to === null ? null : Number(body.assigned_to);
      if (assignedTo !== null && (!Number.isInteger(assignedTo) || assignedTo <= 0)) {
        return NextResponse.json({ error: 'Invalid assignee' }, { status: 400 });
      }
      if (assignedTo !== current.assigned_to) {
        let assigneeName = 'Unassigned';
        if (assignedTo !== null) {
          const assignee = await query<{ name: string }>(
            'SELECT name FROM users WHERE id = $1 AND active',
            [assignedTo]
          );
          if (assignee.rowCount === 0) {
            return NextResponse.json({ error: 'Assignee not found' }, { status: 400 });
          }
          assigneeName = assignee.rows[0].name;
        }
        values.push(assignedTo);
        sets.push(`assigned_to = $${values.length}`);
        activities.push({
          type: 'assignment',
          detail: assignedTo === null ? 'Lead unassigned' : `Assigned to ${assigneeName}`,
        });
      }
    }

    if (body.value !== undefined) {
      const value = Number(body.value);
      if (!Number.isFinite(value) || value < 0 || value > 1e10) {
        return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
      }
      if (value !== Number(current.value)) {
        values.push(value);
        sets.push(`value = $${values.length}`);
        activities.push({
          type: 'value_change',
          detail: `Estimated deal value set to ₹${value.toLocaleString('en-IN')}`,
        });
      }
    }

    if (sets.length > 0) {
      values.push(id);
      await query(
        `UPDATE leads SET ${sets.join(', ')}, updated_at = now() WHERE id = $${values.length}`,
        values
      );
      for (const activity of activities) {
        await logActivity(id, activity.type, activity.detail, actorId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
