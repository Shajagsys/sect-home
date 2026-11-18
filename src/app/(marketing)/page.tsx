import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import Hero from '@/components/marketing/sections/hero';
import TrustedBy from '@/components/marketing/sections/trusted-by';
import AboutTeaser from '@/components/marketing/sections/about-teaser';
import ServicesGrid from '@/components/marketing/sections/services-grid';
import Methodology from '@/components/marketing/sections/methodology';
import WhyChooseUs from '@/components/marketing/sections/why-choose-us';
import SectorsStrip from '@/components/marketing/sections/sectors-strip';
import ClosingCta from '@/components/marketing/sections/closing-cta';

import { JsonLd } from '@/components/marketing/json-ld';

const homeTitle = 'SecureEdge Cyber Technologies — Fortifying Your Digital Assets';
const homeDescription =
  'Bespoke VAPT, web & mobile penetration testing, compliance certification (ISO 27001, SOC 2, DPDP Act), and strategic cybersecurity advisory for modern enterprises.';

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: 'https://secureedgecyber.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeDescription,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SecureEdge Cyber Technologies',
  url: 'https://secureedgecyber.com',
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <Navbar />
      <main>
        <Hero />
        <section className="relative py-10 sm:py-12">
          <div className="container">
            <TrustedBy />
          </div>
        </section>
        <AboutTeaser />
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
