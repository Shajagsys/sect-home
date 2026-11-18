import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import Faq from '@/components/marketing/sections/faq';
import { FAQS } from '@/lib/faq-data';

import { JsonLd } from '@/components/marketing/json-ld';

const testimonialsTitle = 'Client Testimonials & Cybersecurity FAQ';
const testimonialsDescription =
  'Client testimonials and answers to frequently asked questions regarding VAPT, DPDP Act compliance, testing timelines, and security audits.';

export const metadata: Metadata = {
  title: testimonialsTitle,
  description: testimonialsDescription,
  alternates: {
    canonical: '/testimonials',
  },
  openGraph: {
    title: `${testimonialsTitle} · SecureEdge Cyber Technologies`,
    description: testimonialsDescription,
    url: 'https://secureedgecyber.com/testimonials',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${testimonialsTitle} · SecureEdge Cyber Technologies`,
    description: testimonialsDescription,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Testimonials"
          title={
            <>
              Trusted by teams who take{' '}
              <span className="text-gradient-primary">security seriously.</span>
            </>
          }
          description="Client testimonials are being compiled for this page. In the meantime, here are answers to the questions we hear most often."
        />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
