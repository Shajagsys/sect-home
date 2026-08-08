import { Landmark, HeartPulse, Cpu, ShoppingCart, Truck, GraduationCap, Building2 } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { GlassCard } from '@/components/ui/glass-card';

const SECTORS = [
  { icon: Landmark, name: 'BFSI', focus: 'RBI/SEBI-aligned audits, core banking assurance, transaction integrity.' },
  { icon: HeartPulse, name: 'Healthcare & Life Sciences', focus: 'HIPAA compliance, patient data sanctity, medical device security.' },
  { icon: Cpu, name: 'SaaS & Enterprise Technology', focus: 'SOC 2 readiness, API assurance, multi-tenant isolation.' },
  { icon: ShoppingCart, name: 'E-commerce & Retail', focus: 'Payment gateway hardening, customer data protection.' },
  { icon: Truck, name: 'Logistics & Supply Chain', focus: 'OT/IoT security, extended third-party risk management.' },
  { icon: GraduationCap, name: 'EdTech', focus: 'Student data privacy, DPDP Act alignment.' },
  { icon: Building2, name: 'Government & Critical Infrastructure', focus: 'CERT-In empanelled assessments, national-grade infrastructure assurance.' },
];

export default function IndustriesGrid() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Sectors We Serve</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Domain expertise, not a generic checklist
          </h2>
          <p className="mt-4 text-muted">
            Our testing methodology is calibrated to the regulatory reality of your sector.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {SECTORS.map(({ icon: Icon, name, focus }) => (
            <RevealItem key={name}>
              <GlassCard className="h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{focus}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
