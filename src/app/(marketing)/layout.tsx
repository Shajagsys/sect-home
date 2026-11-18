import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/marketing/providers/smooth-scroll-provider';
import CookieConsentProvider from '@/components/marketing/providers/cookie-consent-provider';
import { GA4Tracker } from '@/components/marketing/analytics/ga4-tracker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const wordmark = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-wordmark',
  display: 'swap',
});

import { JsonLd } from '@/components/marketing/json-ld';
import { COMPANY, SOCIAL_LINKS } from '@/lib/company';

const defaultTitle = 'SecureEdge Cyber Technologies — Fortifying Your Digital Assets';
const defaultDescription =
  'SecureEdge Cyber Technologies empowers enterprises to preemptively identify and neutralise vulnerabilities before they can be exploited — VAPT, compliance certification and managed security.';
const siteUrl =
  process.env.APP_URL && !process.env.APP_URL.includes('localhost')
    ? process.env.APP_URL
    : 'https://secureedgecyber.com';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: '%s · SecureEdge Cyber Technologies',
  },
  description: defaultDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: './',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icon-180.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: 'SecureEdge Cyber Technologies',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SecureEdge Cyber Technologies — Fortifying Your Digital Assets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: COMPANY.name,
  description: defaultDescription,
  url: siteUrl,
  email: COMPANY.email,
  telephone: COMPANY.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No.28, Sohna Road, Central Market',
    addressLocality: 'Dharuhera, Rewari',
    addressRegion: 'Haryana',
    postalCode: '123106',
    addressCountry: 'IN',
  },
  sameAs: SOCIAL_LINKS.map((s) => s.href),
  priceRange: '$$$',
};

// Independent root layout for the public marketing site (Home / About / Contact).
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${wordmark.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="relative min-h-screen bg-background font-sans text-foreground">
        <SmoothScrollProvider />
        <GA4Tracker />
        <CookieConsentProvider>{children}</CookieConsentProvider>
      </body>
    </html>
  );
}
