import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import LeadForm from '@/components/LeadForm';
import { SOCIAL_LINKS } from '@/lib/company';

const SERVICES = [
  {
    title: 'IT Infrastructure & Support',
    desc: 'End-to-end IT solutions — procurement, deployment, managed services and ongoing support for businesses of every size.',
  },
  {
    title: 'Cyber Security',
    desc: 'Security assessments, hardening, monitoring and incident readiness to protect your organisation from evolving threats.',
  },
  {
    title: 'Digital Information Security',
    desc: 'Data protection, compliance advisory and information security governance for your digital assets.',
  },
];

const PRODUCTS = [
  {
    name: 'Mimecast',
    tag: 'Email Security',
    desc: 'Advanced email security, archiving and continuity to stop phishing, impersonation and ransomware at the gateway.',
  },
  {
    name: 'Incydr',
    tag: 'Insider Risk',
    desc: 'Insider risk management and data loss detection that protects IP without blocking productivity.',
  },
  {
    name: 'SOCRadar',
    tag: 'Threat Intelligence',
    desc: 'Extended threat intelligence — attack surface management, brand protection and dark web monitoring, all products.',
  },
  {
    name: 'Druva inSync',
    tag: 'Data Protection',
    desc: 'Cloud-native backup, eDiscovery and compliance for endpoints and SaaS workloads.',
  },
  {
    name: 'Beam',
    tag: 'Security Awareness',
    desc: 'Security awareness and human risk management to turn your workforce into the first line of defence.',
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <h1>
              Securing Your Business with <span>IT &amp; Cyber Security</span> Expertise
            </h1>
            <p>
              SecureEdge Cyber Technologies LLP delivers IT, cyber security and digital
              information security services — and sales &amp; support for renowned security
              products like Mimecast, Incydr, SOCRadar, Druva inSync and Beam.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">
                Talk to Sales
              </a>
              <Link href="/login" className="btn btn-outline">
                CRM Login
              </Link>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="section" id="services">
          <div className="container">
            <h2>Our Services</h2>
            <p className="section-sub">
              Comprehensive technology and security services tailored for your organisation.
            </p>
            <div className="grid grid-3">
              {SERVICES.map((s) => (
                <div className="card" key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="section section-alt" id="products">
          <div className="container">
            <h2>Products We Sell &amp; Support</h2>
            <p className="section-sub">
              Authorised sales and services for world-renowned security software.
            </p>
            <div className="grid grid-3">
              {PRODUCTS.map((p) => (
                <div className="card" key={p.name}>
                  <span className="badge">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead generation form */}
        <section className="section" id="contact">
          <div className="container">
            <h2>Get a Quote / Request a Demo</h2>
            <p className="section-sub">
              Tell us what you need and our team will reach out. Every enquiry goes straight
              into our CRM so nothing gets missed.
            </p>
            <LeadForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div>
            © {new Date().getFullYear()} SecureEdge Cyber Technologies LLP. All rights reserved.
          </div>
          <div className="social-links" aria-label="Follow us on social media">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                aria-label={s.label}
              >
                {s.short}
              </a>
            ))}
          </div>
          <div>
            <Link href="/portal">Client Portal</Link>
            {' · '}
            <Link href="/login">Employee / CRM Login</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
