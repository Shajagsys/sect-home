import { Landmark, HeartPulse, Cpu, ShoppingCart, Truck, GraduationCap, Building2 } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';

const SECTORS = [
  { icon: Landmark, label: 'BFSI' },
  { icon: HeartPulse, label: 'Healthcare & Life Sciences' },
  { icon: Cpu, label: 'SaaS & Enterprise Tech' },
  { icon: ShoppingCart, label: 'E-commerce & Retail' },
  { icon: Truck, label: 'Logistics & Supply Chain' },
  { icon: GraduationCap, label: 'EdTech' },
  { icon: Building2, label: 'Government & Critical Infra' },
];

export default function SectorsStrip() {
  return (
    <section className="relative border-y border-white/[0.06] bg-surface/30 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Sectors We Serve</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Calibrated to your regulatory reality
          </h2>
          <p className="mt-4 text-muted">
            Our testing methodology reflects the compliance landscape of your industry — not a generic checklist.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 flex flex-wrap justify-center gap-3" stagger={0.06}>
          {SECTORS.map(({ icon: Icon, label }) => (
            <RevealItem key={label}>
              <div className="glass flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium text-foreground/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary-light">
                <Icon className="h-4 w-4" />
                {label}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
