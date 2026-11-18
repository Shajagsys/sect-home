import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import ServicesDetail from '@/components/marketing/sections/services-detail';
import Methodology from '@/components/marketing/sections/methodology';
import MaturityCta from '@/components/marketing/sections/maturity-cta';

import { JsonLd } from '@/components/marketing/json-ld';
import { SERVICES } from '@/lib/services-data';

const servicesTitle = 'Cybersecurity & VAPT Service Offerings';
const servicesDescription =
  'Comprehensive cybersecurity service offerings — VAPT, Web & API security, mobile app testing, cloud security, DevSecOps, and compliance audits.';

export const metadata: Metadata = {
  title: servicesTitle,
  description: servicesDescription,
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: `${servicesTitle} · SecureEdge Cyber Technologies`,
    description: servicesDescription,
    url: 'https://secureedgecyber.com/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${servicesTitle} · SecureEdge Cyber Technologies`,
    description: servicesDescription,
  },
};

const serviceCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Cybersecurity Services',
  itemListElement: SERVICES.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: service.tagline,
    url: `https://secureedgecyber.com/services/${service.slug}`,
    description: service.heroLine,
  })),
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={serviceCatalogSchema} />
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
