'use client';

import { createContext, useContext } from 'react';

export type ConsentCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export type ConsentState = Record<ConsentCategory, boolean>;

export interface ConsentRecord {
  state: ConsentState;
  timestamp: string; // ISO string — GDPR requires being able to show when consent was given
  version: number; // bump when the category list/purpose changes to force re-prompt
}

export const CONSENT_STORAGE_KEY = 'secureedge_cookie_consent';
export const CONSENT_COOKIE_NAME = 'se_consent';
export const CONSENT_VERSION = 1;

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const CONSENT_CATEGORIES: {
  key: ConsentCategory;
  label: string;
  description: string;
  locked: boolean;
}[] = [
  {
    key: 'necessary',
    label: 'Strictly Necessary',
    description:
      'Required for the site to function — session handling, security, and load balancing. Cannot be disabled.',
    locked: true,
  },
  {
    key: 'functional',
    label: 'Functional',
    description:
      'Remembers your preferences (e.g. this consent choice) so you are not asked again on every visit.',
    locked: false,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description:
      'Helps us understand which pages and services get the most attention, so we can improve the site.',
    locked: false,
  },
  {
    key: 'marketing',
    label: 'Marketing',
    description:
      'Used for campaign attribution and retargeting. Not currently active on this site, reserved for future use.',
    locked: false,
  },
];

/** Read the stored consent record, or null if undecided (or the category list changed since). */
export function getStoredConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: ConsentRecord = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist consent to localStorage (source of truth) and mirror into a cookie for the server/middleware. */
export function storeConsent(state: ConsentState) {
  if (typeof window === 'undefined') return;
  const record: ConsentRecord = {
    state,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));

  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(state)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;

  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: state }));
}

/** Gate a script/effect on a category, e.g. `if (hasConsent('analytics')) loadGA()`. */
export function hasConsent(category: ConsentCategory): boolean {
  const stored = getStoredConsent();
  if (!stored) return category === 'necessary';
  return stored.state[category];
}

export const CookieConsentContext = createContext<{
  consent: ConsentState | null;
  isOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (state: ConsentState) => void;
} | null>(null);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within <CookieConsentProvider>');
  }
  return ctx;
}
