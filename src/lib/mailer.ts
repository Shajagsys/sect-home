import nodemailer from 'nodemailer';

export interface NewLeadInfo {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  interest?: string | null;
  message?: string | null;
  source: string;
}

/**
 * Sends a "new lead" notification email to the addresses in NOTIFY_EMAILS
 * (comma-separated). Silently does nothing when SMTP is not configured, so
 * lead capture never depends on email availability.
 */
export async function sendNewLeadNotification(lead: NewLeadInfo): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAILS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !NOTIFY_EMAILS) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone || '—'],
    ['Company', lead.company || '—'],
    ['Interest', lead.interest || '—'],
    ['Source', lead.source],
    ['Message', lead.message || '—'],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:bold;color:#0d3b2e">${k}</td><td style="padding:6px 12px">${v}</td></tr>`
    )
    .join('');

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER || 'crm@secureedge.local',
    to: NOTIFY_EMAILS,
    subject: `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ''} — ${lead.source}`,
    html: `
      <h2 style="color:#0d3b2e">New lead received</h2>
      <table style="border-collapse:collapse;background:#f3f8f5;border-radius:8px">${rows}</table>
      <p><a href="${appUrl}/dashboard/leads/${lead.id}"
            style="background:#ff9933;color:#3b2305;padding:10px 20px;border-radius:6px;
                   text-decoration:none;font-weight:bold">Open in CRM</a></p>`,
  });
}

/** Fire-and-forget wrapper so API routes never block or fail on email. */
export function notifyNewLead(lead: NewLeadInfo): void {
  sendNewLeadNotification(lead).catch((err) =>
    console.error('Lead notification email failed:', err)
  );
}
