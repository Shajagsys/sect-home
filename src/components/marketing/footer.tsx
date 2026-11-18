'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Facebook, Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import { COMPANY, SOCIAL_LINKS } from '@/lib/company';
import { Reveal } from '@/components/marketing/reveal';
import { SocialIcon, type SocialAnimation } from '@/components/marketing/social-icon';
import { XLogo } from '@/components/marketing/icons/x-logo';
import { useCookieConsent } from '@/lib/cookie-consent';

const SOCIAL_META: Record<string, { icon: React.ComponentType<{ className?: string }>; animation: SocialAnimation; color: string }> = {
  LinkedIn: { icon: Linkedin, animation: 'fill', color: '#0A66C2' },
  'X (Twitter)': { icon: XLogo, animation: 'expand', color: '#FFFFFF' },
  Facebook: { icon: Facebook, animation: 'slide', color: '#1877F2' },
  Instagram: { icon: Instagram, animation: 'spin', color: '#E4405F' },
  YouTube: { icon: Youtube, animation: 'fill', color: '#FF0000' },
};

const ACCREDITATIONS = ['CERT-In Empanelled', 'ISO 27001 Ready', 'SOC 2 Aligned', 'DPDP Act Aligned'];

function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Reuses the existing public lead-capture endpoint — no API changes.
        body: JSON.stringify({ name: email, email, interest: 'Newsletter Signup' }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className="text-sm font-medium text-primary-light">You&apos;re on the list — thank you.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-foreground placeholder:text-muted focus:border-primary/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        aria-label="Subscribe"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function Footer() {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative py-16 sm:py-20">
        <Reveal>
          <div className="grid gap-12 border-b border-white/[0.06] pb-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/logo-dark-640.webp"
                  alt="SecureEdge Cyber Technologies"
                  width={320}
                  height={84}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                Fortifying your digital assets, securing your tomorrow. Bespoke penetration testing,
                compliance audits and managed security for the enterprises that can&apos;t afford to guess.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {SOCIAL_LINKS.map((s) => {
                  const meta = SOCIAL_META[s.label];
                  if (!meta) return null;
                  return (
                    <SocialIcon
                      key={s.label}
                      href={s.href}
                      label={s.label}
                      icon={meta.icon}
                      animation={meta.animation}
                      color={meta.color}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Company</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/" className="text-foreground/75 transition-colors hover:text-primary-light">Home</Link></li>
                <li><Link href="/about" className="text-foreground/75 transition-colors hover:text-primary-light">About Us</Link></li>
                <li><Link href="/contact" className="text-foreground/75 transition-colors hover:text-primary-light">Contact</Link></li>
                <li><Link href="/portal" className="text-foreground/75 transition-colors hover:text-primary-light">Client Portal</Link></li>
                <li><Link href="/login" className="text-foreground/75 transition-colors hover:text-primary-light">Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Explore</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/services" className="text-foreground/75 transition-colors hover:text-primary-light">Services</Link></li>
                <li><Link href="/industries" className="text-foreground/75 transition-colors hover:text-primary-light">Industries</Link></li>
                <li><Link href="/compliance" className="text-foreground/75 transition-colors hover:text-primary-light">Compliance</Link></li>
                <li><Link href="/careers" className="text-foreground/75 transition-colors hover:text-primary-light">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Accreditations</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {ACCREDITATIONS.map((a) => (
                  <li key={a} className="text-foreground/75">{a}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Stay Informed</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                The SecureEdge Briefing — occasional vulnerability intelligence and compliance deadlines.
                Not a vendor solicitation.
              </p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/cookie-policy" className="transition-colors hover:text-primary-light">
              Cookie Policy
            </Link>
            <button type="button" onClick={openPreferences} className="transition-colors hover:text-primary-light">
              Cookie Settings
            </button>
            <p className="hidden text-muted/80 sm:block">Security is a discipline, continuously practised.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
