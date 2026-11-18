import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import { AmbientBackground } from '@/components/marketing/ambient-background';
import ContactInfo from '@/components/marketing/sections/contact-info';
import ContactForm from '@/components/marketing/contact-form';

import { JsonLd } from '@/components/marketing/json-ld';
import { COMPANY } from '@/lib/company';

const contactTitle = 'Contact Strategic Security Team';
const contactDescription =
  'Arrange a complimentary consultation with the SecureEdge strategic security team — VAPT, compliance certification, and managed security.';

export const metadata: Metadata = {
  title: contactTitle,
  description: contactDescription,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `${contactTitle} · SecureEdge Cyber Technologies`,
    description: contactDescription,
    url: 'https://secureedgecyber.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${contactTitle} · SecureEdge Cyber Technologies`,
    description: contactDescription,
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact SecureEdge Cyber Technologies',
  description: contactDescription,
  url: 'https://secureedgecyber.com/contact',
  mainEntity: {
    '@type': 'ProfessionalService',
    name: COMPANY.name,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No.28, Sohna Road, Central Market',
      addressLocality: 'Dharuhera, Rewari',
      addressRegion: 'Haryana',
      postalCode: '123106',
      addressCountry: 'IN',
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      <Navbar />
      <main>
        <h1 className="sr-only">Contact SecureEdge Cyber Technologies Strategic Security Team</h1>
        <section className="relative overflow-hidden pb-28 pt-40 sm:pt-48">
          <AmbientBackground />
          <div className="container relative grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <ContactInfo />
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
