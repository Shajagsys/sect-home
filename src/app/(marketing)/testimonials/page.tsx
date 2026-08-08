import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import Faq from '@/components/marketing/sections/faq';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'What clients say about working with SecureEdge Cyber Technologies, plus answers to common questions.',
};

export default function TestimonialsPage() {
  return (
    <>
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
