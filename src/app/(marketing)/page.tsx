import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import Hero from '@/components/marketing/sections/hero';
import TrustedBy from '@/components/marketing/sections/trusted-by';
import AboutTeaser from '@/components/marketing/sections/about-teaser';
import ImpactStats from '@/components/marketing/sections/impact-stats';
import ServicesGrid from '@/components/marketing/sections/services-grid';
import Methodology from '@/components/marketing/sections/methodology';
import WhyChooseUs from '@/components/marketing/sections/why-choose-us';
import SectorsStrip from '@/components/marketing/sections/sectors-strip';
import ClosingCta from '@/components/marketing/sections/closing-cta';

export const metadata: Metadata = {
  title: 'SecureEdge Cyber Technologies — Fortifying Your Digital Assets',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section className="relative py-10 sm:py-12">
          <div className="container">
            <TrustedBy />
          </div>
        </section>
        <AboutTeaser />
        <ImpactStats />
        <ServicesGrid />
        <Methodology />
        <WhyChooseUs />
        <SectorsStrip />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
