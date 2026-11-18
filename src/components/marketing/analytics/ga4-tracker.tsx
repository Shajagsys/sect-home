'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { hasConsent, type ConsentState } from '@/lib/cookie-consent';
import { GA_MEASUREMENT_ID, trackGAPageview } from '@/lib/ga4';

/**
 * Loads gtag.js only once the visitor has granted analytics consent — the
 * <script> tags are not rendered beforehand, this isn't just a post-hoc
 * event gate. Re-checks on 'cookie-consent-updated' so accepting mid-session
 * (via the banner or footer "Cookie Settings") loads GA4 immediately without
 * a page reload.
 *
 * Uses the standard two-script pattern from Next.js's own docs (external
 * gtag.js loader + a synchronous inline `dataLayer`/`gtag` bootstrap),
 * rather than defining `gtag` inside the loader script's `onLoad` callback.
 * next/script's `onLoad` is not guaranteed to re-fire on every mount (it can
 * be skipped if the same script URL was already loaded elsewhere in the
 * page's lifetime — e.g. after React Strict Mode's double-render in dev),
 * so relying on it left a window where `window.gtag` was never defined and
 * every tracking call silently no-op'd. The inline snippet has no such
 * dependency: it defines `dataLayer`/`gtag` and calls `config` synchronously
 * the moment it renders.
 */
export function GA4Tracker() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  // Tracks the pathname gtag's own `config` call already reported as an
  // automatic pageview, so we don't double-send it on the very first render.
  const [initializedPath, setInitializedPath] = useState<string | null>(null);

  useEffect(() => {
    setAllowed(hasConsent('analytics'));
    function onConsentUpdated(e: Event) {
      const state = (e as CustomEvent<ConsentState>).detail;
      setAllowed(!!state?.analytics);
    }
    window.addEventListener('cookie-consent-updated', onConsentUpdated);
    return () => window.removeEventListener('cookie-consent-updated', onConsentUpdated);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    if (initializedPath === null) {
      // First render after consent: gtag's own `config` call (in the inline
      // script below) already sends this pageview automatically — just
      // record it so future route changes are detected as new.
      setInitializedPath(pathname);
      return;
    }
    if (initializedPath !== pathname) {
      trackGAPageview(pathname);
      setInitializedPath(pathname);
    }
  }, [pathname, allowed, initializedPath]);

  if (!GA_MEASUREMENT_ID || !allowed) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}