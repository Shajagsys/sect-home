'use client';

import { useState } from 'react';

const INTERESTS = [
  'Mimecast (Email Security)',
  'Incydr (Insider Risk / Data Loss)',
  'SOCRadar (Threat Intelligence)',
  'Druva inSync (Data Protection & Backup)',
  'Beam (Security Awareness)',
  'IT Services & Support',
  'Cyber Security Consulting',
  'Other',
];

export default function LeadForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      setMessage('Thank you! Our team will contact you shortly.');
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="lead-name">Full name *</label>
          <input id="lead-name" name="name" type="text" required maxLength={120} />
        </div>
        <div className="form-field">
          <label htmlFor="lead-email">Work email *</label>
          <input id="lead-email" name="email" type="email" required maxLength={200} />
        </div>
        <div className="form-field">
          <label htmlFor="lead-phone">Phone</label>
          <input id="lead-phone" name="phone" type="tel" maxLength={30} />
        </div>
        <div className="form-field">
          <label htmlFor="lead-company">Company</label>
          <input id="lead-company" name="company" type="text" maxLength={160} />
        </div>
        <div className="form-field full">
          <label htmlFor="lead-interest">I&apos;m interested in</label>
          <select id="lead-interest" name="interest" defaultValue="">
            <option value="" disabled>
              Select a product or service
            </option>
            {INTERESTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field full">
          <label htmlFor="lead-message">Message</label>
          <textarea id="lead-message" name="message" rows={4} maxLength={2000} />
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <button className="btn btn-primary" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Request a Callback'}
        </button>
      </div>
      {message && (
        <p className={`form-msg ${status === 'error' ? 'error' : 'success'}`}>{message}</p>
      )}
    </form>
  );
}
