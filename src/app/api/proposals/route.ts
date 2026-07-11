import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { ProposalItem, computeTotals } from '@/lib/proposals';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Protected: create a proposal for a lead. */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const leadId = Number(body.lead_id);
  const title = String(body.title || '').trim().slice(0, 200);
  const notes = String(body.notes || '').trim().slice(0, 4000) || null;
  const validUntil = body.valid_until ? String(body.valid_until).slice(0, 10) : null;
  const taxPercent = Number(body.tax_percent ?? 18);
  const discountPercent = Number(body.discount_percent ?? 0);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (!Number.isFinite(taxPercent) || taxPercent < 0 || taxPercent > 100) {
    return NextResponse.json({ error: 'Invalid tax percent' }, { status: 400 });
  }
  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    return NextResponse.json({ error: 'Invalid discount percent' }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items: ProposalItem[] = [];
  for (const raw of rawItems.slice(0, 50)) {
    const item = raw as Record<string, unknown>;
    const description = String(item.description || '').trim().slice(0, 300);
    const qty = Number(item.qty);
    const unitPrice = Number(item.unit_price);
    if (!description) continue;
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      return NextResponse.json({ error: `Invalid quantity or price for "${description}"` }, { status: 400 });
    }
    items.push({ description, qty, unit_price: unitPrice });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: 'At least one line item is required' }, { status: 400 });
  }

  try {
    const lead = await query<{ name: string; status: string }>(
      'SELECT name, status FROM leads WHERE id = $1',
      [leadId]
    );
    if (lead.rowCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const { total } = computeTotals(items, taxPercent, discountPercent);
    const actorId = Number(session.sub);
    const result = await query<{ id: number }>(
      `INSERT INTO proposals (lead_id, created_by, title, items, tax_percent,
                              discount_percent, total, notes, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [leadId, actorId, title, JSON.stringify(items), taxPercent, discountPercent, total, notes, validUntil]
    );
    const proposalId = result.rows[0].id;

    await logActivity(leadId, 'proposal', `Proposal #${proposalId} created: "${title}"`, actorId);

    // Creating a proposal moves an early-stage lead forward in the pipeline.
    if (['new', 'contacted', 'qualified'].includes(lead.rows[0].status)) {
      await query(`UPDATE leads SET status = 'proposal', updated_at = now() WHERE id = $1`, [leadId]);
      await logActivity(leadId, 'status_change', 'Stage changed to Proposal Sent (proposal created)', actorId);
    }

    return NextResponse.json({ ok: true, id: proposalId }, { status: 201 });
  } catch (err) {
    console.error('Proposal create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
