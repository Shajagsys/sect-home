import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/marketing/providers/smooth-scroll-provider';

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

export const metadata: Metadata = {
  title: {
    default: 'SecureEdge Cyber Technologies — Fortifying Your Digital Assets',
    template: '%s · SecureEdge Cyber Technologies',
  },
  description:
    'SecureEdge Cyber Technologies empowers enterprises to preemptively identify and neutralise vulnerabilities before they can be exploited — VAPT, compliance certification and managed security.',
  metadataBase: new URL('https://secureedgecyber.com'),
};

// Independent root layout for the public marketing site (Home / About / Contact).
// Route-group isolated from the CRM's app/(app) layout, so it ships its own
// Tailwind design system without touching the dashboard/login/portal CSS.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${wordmark.variable}`}>
      <body className="relative min-h-screen bg-background font-sans text-foreground">
        <SmoothScrollProvider />
        {children}
      </body>
    </html>
  );
}
