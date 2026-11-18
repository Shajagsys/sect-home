import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'SecureEdge Cyber Technologies LLP — CRM',
  description: 'SecureEdge Cyber Technologies LLP internal CRM, client portal and document workflows.',
  robots: {
    index: false,
    follow: false,
  },
};

// Root layout for the internal app (login, dashboard, client portal, e-sign).
// Kept byte-for-byte equivalent to the original app/layout.tsx — the CRM's
// look, markup and CSS classes (globals.css) are untouched by the marketing
// site redesign.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
