import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import CareerWhy from '@/components/marketing/sections/career-why';
import CareerOffer from '@/components/marketing/sections/career-offer';
import CareerOpportunities from '@/components/marketing/sections/career-opportunities';

const careersTitle = 'Cybersecurity Careers & Opportunities';
const careersDescription =
  'Explore career opportunities at SecureEdge Cyber Technologies — VAPT specialists, security assessors, and strategic advisory consultants.';

export const metadata: Metadata = {
  title: careersTitle,
  description: careersDescription,
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    title: `${careersTitle} · SecureEdge Cyber Technologies`,
    description: careersDescription,
    url: 'https://secureedgecyber.com/careers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${careersTitle} · SecureEdge Cyber Technologies`,
    description: careersDescription,
  },
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Careers at SecureEdge"
          title={
            <>
              Find what everyone else{' '}
              <span className="text-gradient-primary">missed.</span>
            </>
          }
          description="We hire specialists who get genuine satisfaction from understanding precisely how a system fails."
        />
        <CareerWhy />
        <CareerOffer />
        <CareerOpportunities />
      </main>
      <Footer />
    </>
  );
}
