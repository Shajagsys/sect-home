'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

const STUDIES = [
  {
    tag: 'BFSI · PCI DSS',
    title: 'Fortifying Payment Infrastructure Ahead of a Critical PCI DSS Audit',
    challenge: 'A regulated enterprise faced a hard PCI DSS certification deadline with unverified payment-gateway exposure across its transaction stack.',
    approach: 'Full-scope VAPT spanning the payment gateway, supporting APIs and cardholder data environment, followed by a prioritised, engineer-ready remediation roadmap and hands-on retesting.',
    outcome: 'PCI DSS certification achieved on schedule, with zero critical findings recorded at final audit.',
  },
  {
    tag: 'SaaS · SOC 2 Type II',
    title: 'Achieving First-Time SOC 2 Type II Certification',
    challenge: 'A growth-stage SaaS platform needed a clean SOC 2 Type II attestation to unblock several stalled enterprise deals in procurement.',
    approach: 'Baseline gap assessment against the Trust Services Criteria, control implementation support, and a milestone-driven Compliance Sprint through observation-period readiness.',
    outcome: 'Clean SOC 2 Type II attestation secured — enterprise sales pipeline unblocked within the committed timeline.',
  },
];

export default function CaseStudiesFull() {
  return (
    <section id="case-studies" className="relative scroll-mt-28 py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Client Success Narratives</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The full stories
          </h2>
        </Reveal>

        <RevealGroup className="mx-auto mt-14 max-w-4xl space-y-6" stagger={0.15}>
          {STUDIES.map((s) => (
            <RevealItem key={s.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="border-gradient rounded-3xl p-8 sm:p-10 transition-shadow duration-300 hover:shadow-glow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary-light">{s.tag}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified engagement
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">{s.title}</h3>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Challenge</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{s.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Approach</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{s.approach}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary/[0.07] p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
                  <p className="text-sm font-medium leading-relaxed text-foreground">{s.outcome}</p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
