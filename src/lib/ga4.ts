'use client';

import { hasConsent } from '@/lib/cookie-consent';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Records a pageview. Called on mount and on every route change by <GA4Tracker>. */
export function trackGAPageview(path: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;
  if (!hasConsent('analytics')) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Records a custom or GA4-standard event, e.g. trackGAEvent('generate_lead', { form_name: 'contact' }). */
export function trackGAEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;
  if (!hasConsent('analytics')) return;
  window.gtag('event', eventName, params);
}
