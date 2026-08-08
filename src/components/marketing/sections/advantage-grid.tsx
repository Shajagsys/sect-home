import { Presentation, Wrench, Infinity as InfinityIcon, Compass } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { GlassCard } from '@/components/ui/glass-card';
import { ICON_PALETTE } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const ADVANTAGES = [
  { icon: Presentation, title: 'Business-Centric Reporting', desc: 'We translate complex technical risks into clear, boardroom-ready insights, ensuring both leadership and engineering teams are perfectly aligned.' },
  { icon: Wrench, title: 'Remediation-First Philosophy', desc: 'Beyond merely identifying gaps, we prioritise vulnerabilities based on real-world threat metrics and actively collaborate with your team to implement robust fixes.' },
  { icon: InfinityIcon, title: 'End-to-End Lifecycle Support', desc: 'Our engagement spans from the initial gap assessment to final certification readiness and continuous post-audit monitoring.' },
  { icon: Compass, title: 'Domain-Specific Methodologies', desc: 'Our testing frameworks are custom-calibrated for your industry, whether navigating RBI guidelines for BFSI, HIPAA for healthcare, or SOC 2 for SaaS platforms.' },
];

export default function AdvantageGrid() {
  return (
    <section className="relative border-y border-white/[0.06] bg-surface/30 py-24">
      <div className="container">
        <Reveal className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">The SecureEdge Advantage</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What working with us actually looks like
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2" stagger={0.1}>
          {ADVANTAGES.map(({ icon: Icon, title, desc }, i) => {
            const palette = ICON_PALETTE[i % ICON_PALETTE.length];
            return (
              <RevealItem key={title}>
                <GlassCard className="h-full">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110',
                      palette.bg,
                      palette.text,
                      palette.hoverBg,
                      palette.glow
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
                </GlassCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
