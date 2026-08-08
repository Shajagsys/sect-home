import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import IndustriesGrid from '@/components/marketing/sections/industries-grid';
import ClosingCta from '@/components/marketing/sections/closing-cta';

export const metadata: Metadata = {
  title: 'Industries',
  description:
    'SecureEdge serves BFSI, Healthcare, SaaS, E-commerce, Logistics, EdTech and Government sectors with regulation-calibrated security testing.',
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
