import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import { ServiceDetailTemplate } from '@/components/marketing/sections/service-detail-template';
import { SERVICES, getServiceBySlug } from '@/lib/services-data';

import { JsonLd } from '@/components/marketing/json-ld';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  const fullTitle = `${service.tagline} Services`;
  const canonicalUrl = `/services/${service.slug}`;
  const description = `${service.tagline} — ${service.heroLine} ${service.overview[0] || ''}`.trim();

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${fullTitle} · SecureEdge Cyber Technologies`,
      description,
      url: `https://secureedgecyber.com${canonicalUrl}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullTitle} · SecureEdge Cyber Technologies`,
      description,
    },
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.tagline,
    serviceType: service.tagline,
    provider: {
      '@type': 'ProfessionalService',
      name: 'SecureEdge Cyber Technologies LLP',
      url: 'https://secureedgecyber.com',
    },
    areaServed: 'Worldwide',
    description: service.heroLine,
    url: `https://secureedgecyber.com/services/${service.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://secureedgecyber.com' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://secureedgecyber.com/services' },
      { '@type': 'ListItem', position: 3, name: service.navLabel, item: `https://secureedgecyber.com/services/${service.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={[serviceSchema, breadcrumbSchema]} />
      <Navbar />
      <main>
        <ServiceDetailTemplate slug={service.slug} />
      </main>
      <Footer />
    </>
  );
}
