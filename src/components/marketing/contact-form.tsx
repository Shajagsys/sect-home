'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const INTERESTS = [
  'VAPT — Vulnerability Assessment & Penetration Testing',
  'Compliance & Regulatory Certification',
  'Managed Security & vCISO Advisory',
  'Advanced Offensive Security',
  'Cloud, Identity & Infrastructure Assurance',
  'Detection, Response & Digital Forensics',
  'Other',
];

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-foreground placeholder:text-muted/70 transition-colors focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none';

/** Public lead-capture form for /contact. Posts to the existing /api/leads endpoint — no backend changes. */
export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, unknown> = Object.fromEntries(new FormData(form).entries());

    const params = new URLSearchParams(window.location.search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const value = params.get(key);
      if (value) data[key] = value;
    }

    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
      setStatus('success');
      setMessage('Thank you — our strategic security team will reach out shortly.');
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="border-gradient rounded-3xl p-8 sm:p-10">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-foreground">Request received</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">{message}</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="lead-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                  Full name *
                </label>
                <input id="lead-name" name="name" type="text" required maxLength={120} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="lead-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                  Work email *
                </label>
                <input id="lead-email" name="email" type="email" required maxLength={200} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                  Phone
                </label>
                <input id="lead-phone" name="phone" type="tel" maxLength={30} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="lead-company" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                  Company
                </label>
                <input id="lead-company" name="company" type="text" maxLength={160} className={fieldClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="lead-interest" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                  I&apos;m interested in
                </label>
                <select id="lead-interest" name="interest" defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    Select a service
                  </option>
                  {INTERESTS.map((item) => (
                    <option key={item} value={item} className="bg-surface">
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="lead-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                  Message
                </label>
                <textarea id="lead-message" name="message" rows={4} maxLength={2000} className={fieldClass} />
              </div>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <Button type="submit" size="lg" variant="primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </span>
                ) : (
                  'Request a Callback'
                )}
              </Button>
              {status === 'error' && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400">
                  <AlertCircle className="h-4 w-4" /> {message}
                </span>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
