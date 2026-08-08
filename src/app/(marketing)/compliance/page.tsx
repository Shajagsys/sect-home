import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import CertificationsGrid from '@/components/marketing/sections/certifications-grid';
import ComplianceSprint from '@/components/marketing/sections/compliance-sprint';
import AccreditationsBlock from '@/components/marketing/sections/accreditations-block';
import ClosingCta from '@/components/marketing/sections/closing-cta';

export const metadata: Metadata = {
  title: 'Compliance & Certifications',
  description:
    'ISO 27001, SOC 2, PCI DSS, DPDP Act, GDPR and HIPAA certification support from SecureEdge Cyber Technologies.',
};

export default function CompliancePage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Compliance & Certifications"
          title={
            <>
              Audit-ready, on a{' '}
              <span className="text-gradient-primary">committed timeline.</span>
            </>
          }
          description="End-to-end support for the certifications your regulators, customers and procurement teams actually ask for."
        />
        <CertificationsGrid />
        <ComplianceSprint />
        <AccreditationsBlock />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
