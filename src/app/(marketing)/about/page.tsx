import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import AboutIntroVisual from '@/components/marketing/sections/about-intro-visual';
import WhoWeAre from '@/components/marketing/sections/who-we-are';
import AdvantageGrid from '@/components/marketing/sections/advantage-grid';
import EthosSection from '@/components/marketing/sections/ethos-section';
import DistinctionGrid from '@/components/marketing/sections/distinction-grid';
import CaseStudiesFull from '@/components/marketing/sections/case-studies-full';
import AccreditationsBlock from '@/components/marketing/sections/accreditations-block';
import ClosingCta from '@/components/marketing/sections/closing-cta';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'SecureEdge Cyber Technologies is a premier cybersecurity consultancy — our ethos, advantage, distinction and accreditations.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="About SecureEdge"
          title={
            <>
              Clarity over complexity.{' '}
              <span className="text-gradient-primary">Evidence over assumption.</span>
            </>
          }
          description="The full story behind the consultancy enterprises trust to find what automated scanners miss — and to prove, not assert, that it's fixed."
        />
        <AboutIntroVisual />
        <WhoWeAre />
        <AdvantageGrid />
        <EthosSection />
        <DistinctionGrid />
        <CaseStudiesFull />
        <AccreditationsBlock />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
