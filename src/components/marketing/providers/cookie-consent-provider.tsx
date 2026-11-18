'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CookieConsentContext,
  ConsentState,
  DEFAULT_CONSENT,
  getStoredConsent,
  storeConsent,
} from '@/lib/cookie-consent';
import { CookieConsentBanner } from '@/components/marketing/cookie-consent-banner';
import { CookiePreferencesModal } from '@/components/marketing/cookie-preferences-modal';

export default function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [hasDecided, setHasDecided] = useState(true); // starts true to avoid a banner flash before hydration check
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored.state);
      setHasDecided(true);
    } else {
      setConsent(DEFAULT_CONSENT);
      setHasDecided(false);
    }
  }, []);

  const openPreferences = useCallback(() => setIsOpen(true), []);
  const closePreferences = useCallback(() => setIsOpen(false), []);

  const acceptAll = useCallback(() => {
    const state: ConsentState = { necessary: true, functional: true, analytics: true, marketing: true };
    storeConsent(state);
    setConsent(state);
    setHasDecided(true);
    setIsOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const state: ConsentState = { ...DEFAULT_CONSENT };
    storeConsent(state);
    setConsent(state);
    setHasDecided(true);
    setIsOpen(false);
  }, []);

  const savePreferences = useCallback((state: ConsentState) => {
    const withNecessary = { ...state, necessary: true };
    storeConsent(withNecessary);
    setConsent(withNecessary);
    setHasDecided(true);
    setIsOpen(false);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{ consent, isOpen, openPreferences, closePreferences, acceptAll, rejectAll, savePreferences }}
    >
      {children}
      {!hasDecided && <CookieConsentBanner />}
      <CookiePreferencesModal />
    </CookieConsentContext.Provider>
  );
}
