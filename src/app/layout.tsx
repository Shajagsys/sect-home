import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SecureEdge Cyber Technologies LLP',
  description:
    'IT, Cyber Security & Digital Information Security. Sales and services for Mimecast, Incydr, SOCRadar, Druva inSync, Beam and more. CRM & Lead Generation platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
