import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import ServicesDetail from '@/components/marketing/sections/services-detail';
import Methodology from '@/components/marketing/sections/methodology';
import MaturityCta from '@/components/marketing/sections/maturity-cta';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Comprehensive service offerings — from offensive testing to regulatory certification to ongoing advisory, engineered to integrate seamlessly with how your organisation operates.',
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Services"
          title={
            <>
              Comprehensive service offerings, built for{' '}
              <span className="text-gradient-primary">measurable outcomes.</span>
            </>
          }
          description="From offensive testing to regulatory certification to ongoing advisory — engineered to integrate seamlessly with how your organisation operates."
        />
        <ServicesDetail />
        <Methodology />
        <MaturityCta />
      </main>
      <Footer />
    </>
  );
}
