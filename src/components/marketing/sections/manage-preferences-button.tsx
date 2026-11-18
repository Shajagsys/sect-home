'use client';

import { useCookieConsent } from '@/lib/cookie-consent';

export function ManagePreferencesButton() {
  const { openPreferences } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="rounded-full bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
    >
      Manage Cookie Preferences
    </button>
  );
}
