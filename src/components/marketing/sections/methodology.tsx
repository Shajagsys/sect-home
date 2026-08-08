'use client';

import { motion } from 'framer-motion';
import { Compass, ScanSearch, Target, FileText, RefreshCw } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { ICON_PALETTE } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { icon: Compass, title: 'Strategic Discovery', desc: 'Exhaustive mapping of your digital footprint and business logic before any testing begins.' },
  { icon: ScanSearch, title: 'Rigorous Assessment', desc: 'Hybrid testing combining automated scanning with deep manual exploitation.' },
  { icon: Target, title: 'Contextual Risk Scoring', desc: 'Findings triaged by real-world exploitability and business impact, not CVSS score alone.' },
  { icon: FileText, title: 'Comprehensive Reporting', desc: 'Technical detail for engineers, an executive summary for leadership.' },
  { icon: RefreshCw, title: 'Remediation & Retesting', desc: 'Collaborative fixes, followed by rigorous re-verification to confirm closure.' },
];

export default function Methodology() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-surface/30 py-28 sm:py-36">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">How We Work</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A structured engagement, not an ad-hoc scan
          </h2>
        </Reveal>

        <RevealGroup className="relative mt-20 grid gap-10 lg:grid-cols-5 lg:gap-6" stagger={0.12}>
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />
          {STEPS.map(({ icon: Icon, title, desc }, i) => {
            const palette = ICON_PALETTE[i % ICON_PALETTE.length];
            return (
              <RevealItem key={title} className="relative">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="group flex flex-col items-start lg:items-center lg:text-center"
                >
                  <div
                    className={cn(
                      'relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border bg-background transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3',
                      palette.text,
                      palette.glow,
                      'border-white/10 group-hover:border-transparent'
                    )}
                  >
                    <Icon className="h-7 w-7" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-[11px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted lg:max-w-[13rem]">{desc}</p>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
