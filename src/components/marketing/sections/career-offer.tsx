import { Layers, Award, Lightbulb, Target } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';

const OFFERS = [
  { icon: Layers, title: 'Cross-Functional Exposure', desc: 'Spanning VAPT, regulatory compliance and strategic advisory work, rather than confinement to a single discipline.' },
  { icon: Award, title: 'Sponsored Certification Pathways', desc: 'OSCP, CEH, CISSP and equivalent industry credentials, fully sponsored.' },
  { icon: Lightbulb, title: 'Curiosity as an Asset', desc: 'A culture that treats intellectual curiosity as an asset, not a liability.' },
  { icon: Target, title: 'Outcome-Oriented Structure', desc: 'Engagement structures that reward the calibre of findings, not hours logged.' },
];

export default function CareerOffer() {
  return (
    <section className="relative border-y border-white/[0.06] bg-surface/30 py-24 sm:py-32">
      <div className="container">
        <Reveal className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">What We Offer</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for people who like finding what others miss
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2" stagger={0.1}>
          {OFFERS.map(({ icon: Icon, title, desc }) => (
            <RevealItem key={title}>
              <div className="border-gradient flex items-start gap-5 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
