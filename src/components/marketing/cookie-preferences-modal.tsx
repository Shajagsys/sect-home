'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  CONSENT_CATEGORIES,
  ConsentState,
  DEFAULT_CONSENT,
  getStoredConsent,
  useCookieConsent,
} from '@/lib/cookie-consent';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

export function CookiePreferencesModal() {
  const { isOpen, closePreferences, savePreferences, acceptAll, rejectAll } = useCookieConsent();
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);

  // Re-sync the draft from storage every time the modal opens, so re-opening
  // after a previous save shows the actual saved state, not stale defaults.
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredConsent();
      setDraft(stored?.state ?? DEFAULT_CONSENT);
    }
  }, [isOpen]);

  function toggle(key: keyof ConsentState, locked: boolean) {
    if (locked) return;
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closePreferences}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-surface p-7 shadow-card sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-foreground">Cookie Preferences</h2>
              <button
                type="button"
                onClick={closePreferences}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Choose which categories of cookies SecureEdge can use. Strictly necessary cookies are
              always active. You can change these settings anytime from the footer.
            </p>

            <div className="mt-6 space-y-3">
              {CONSENT_CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{cat.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draft[cat.key]}
                    aria-label={`Toggle ${cat.label} cookies`}
                    disabled={cat.locked}
                    onClick={() => toggle(cat.key, cat.locked)}
                    className={cn(
                      'relative mt-0.5 h-6 w-[42px] shrink-0 rounded-full transition-colors',
                      draft[cat.key] ? 'bg-primary' : 'bg-white/10',
                      cat.locked && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        draft[cat.key] && 'translate-x-[18px]'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                onClick={rejectAll}
                className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-white/25 hover:text-foreground"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="whitespace-nowrap rounded-full border border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-white/[0.06]"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => savePreferences(draft)}
                className="whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
