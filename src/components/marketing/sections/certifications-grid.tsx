import { ShieldCheck, FileCheck2, CreditCard, Scale, HeartPulse } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { GlassCard } from '@/components/ui/glass-card';

const CERTIFICATIONS = [
  { icon: ShieldCheck, name: 'ISO 27001', desc: 'ISMS implementation and pre-audit readiness — the international benchmark for information security management.' },
  { icon: FileCheck2, name: 'SOC 2 (Type I & II)', desc: 'Framework alignment across the Trust Services Criteria, from control design through the observation period.' },
  { icon: CreditCard, name: 'PCI DSS', desc: 'Compliance for payment gateways and FinTech handling cardholder data.' },
  { icon: Scale, name: 'DPDP Act & GDPR', desc: 'India DPDP Act and GDPR privacy consulting — consent management, data localisation and encryption.' },
  { icon: HeartPulse, name: 'HIPAA', desc: 'Compliance and third-party risk management for healthcare and life sciences.' },
];

export default function CertificationsGrid() {
  return (
    <section id="certifications" className="relative py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Certifications We Help You Achieve</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            End-to-end regulatory certification support
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {CERTIFICATIONS.map(({ icon: Icon, name, desc }) => (
            <RevealItem key={name}>
              <GlassCard className="h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
