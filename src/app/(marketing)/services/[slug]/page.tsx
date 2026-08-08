import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import { ServiceDetailTemplate } from '@/components/marketing/sections/service-detail-template';
import { SERVICES, getServiceBySlug } from '@/lib/services-data';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};
  return {
    title: service.navLabel,
    description: service.heroLine,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <>
      <Navbar />
      <main>
        <ServiceDetailTemplate slug={service.slug} />
      </main>
      <Footer />
    </>
  );
}
