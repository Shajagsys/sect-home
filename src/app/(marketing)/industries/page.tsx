import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import IndustriesGrid from '@/components/marketing/sections/industries-grid';
import ClosingCta from '@/components/marketing/sections/closing-cta';

const industriesTitle = 'Industry-Specific Cybersecurity & Compliance Solutions';
const industriesDescription =
  'Regulation-calibrated security testing for BFSI, Healthcare, SaaS, E-commerce, Logistics, EdTech, and Government sectors.';

export const metadata: Metadata = {
  title: industriesTitle,
  description: industriesDescription,
  alternates: {
    canonical: '/industries',
  },
  openGraph: {
    title: `${industriesTitle} · SecureEdge Cyber Technologies`,
    description: industriesDescription,
    url: 'https://secureedgecyber.com/industries',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${industriesTitle} · SecureEdge Cyber Technologies`,
    description: industriesDescription,
  },
};

export default function IndustriesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Industries"
          title={
            <>
              Calibrated to your{' '}
              <span className="text-gradient-primary">regulatory reality.</span>
            </>
          }
          description="Seven sectors, seven distinct threat models. We test against the compliance framework and adversary behaviour that actually applies to your industry — not a generic checklist."
        />
        <IndustriesGrid />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
