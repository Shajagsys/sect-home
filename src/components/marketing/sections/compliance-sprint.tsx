import { Flag, Map, BadgeCheck } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';

const STEPS = [
  { icon: Flag, title: 'Baseline Gap Assessment', desc: 'We map your current posture against the target framework — ISO 27001, SOC 2 or PCI DSS.' },
  { icon: Map, title: 'Step-by-Step Remediation Roadmap', desc: 'A prioritised, milestone-driven plan your team can execute against, with no ambiguity on what happens next.' },
  { icon: BadgeCheck, title: 'Audit-Ready, On a Committed Timeline', desc: 'A time-boxed engagement architected to reach audit-readiness within a contractually agreed timeframe.' },
];

export default function ComplianceSprint() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-surface/30 py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Compliance Sprint</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A milestone-driven engagement model
          </h2>
          <p className="mt-4 text-muted">
            Architected to achieve audit-readiness for a designated certification within a committed,
            contractually agreed timeframe — not an open-ended retainer.
          </p>
        </Reveal>

        <RevealGroup className="relative mt-16 grid gap-10 lg:grid-cols-3 lg:gap-6" stagger={0.12}>
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <RevealItem key={title} className="relative">
              <div className="flex flex-col items-start lg:items-center lg:text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-background text-primary-light shadow-glow">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-[11px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted lg:max-w-xs">{desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
