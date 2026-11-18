'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from '@/lib/cookie-consent';

const EASE = [0.16, 1, 0.3, 1] as const;

export function CookieConsentBanner() {
  const { acceptAll, rejectAll, openPreferences } = useCookieConsent();

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
      >
        <div className="liquid-glass container mx-auto max-w-4xl rounded-2xl border border-white/[0.08] bg-surface/90 p-6 shadow-card backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
                <Cookie className="h-4.5 w-4.5" strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display text-[15px] font-bold text-foreground">We use cookies</p>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                  SecureEdge uses strictly necessary cookies to run this site, and optional cookies
                  to understand usage and improve your experience. Choose what you&apos;re comfortable
                  with, or read our{' '}
                  <Link href="/cookie-policy" className="text-primary-light underline underline-offset-2 hover:text-primary">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:justify-end">
              <button
                type="button"
                onClick={openPreferences}
                className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-white/25 hover:text-foreground"
              >
                Manage
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="whitespace-nowrap rounded-full border border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-white/[0.06] hover:border-white/25"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
