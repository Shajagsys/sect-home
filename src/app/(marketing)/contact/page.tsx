import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import { AmbientBackground } from '@/components/marketing/ambient-background';
import ContactInfo from '@/components/marketing/sections/contact-info';
import ContactForm from '@/components/marketing/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Arrange a complimentary consultation with the SecureEdge strategic security team — VAPT, compliance certification and managed security.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
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
