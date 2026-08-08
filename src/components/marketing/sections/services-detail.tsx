'use client';

import { motion } from 'framer-motion';
import { Search, FileCheck2, UserCog, Swords, Cloud, Radar } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { ICON_PALETTE } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORIES = [
  {
    icon: Search,
    letter: 'A',
    title: 'Vulnerability Assessment & Penetration Testing (VAPT)',
    items: [
      'Web and mobile application security assessments (iOS & Android)',
      'Internal and external network penetration testing',
      'Cloud infrastructure audits (AWS, Azure, GCP)',
      'Robust API and secure code reviews',
      'IoT and embedded device security',
    ],
  },
  {
    icon: FileCheck2,
    letter: 'B',
    title: 'Compliance & Regulatory Certification Support',
    items: [
      'ISO 27001 (ISMS) implementation and pre-audit readiness',
      'SOC 2 (Type I & II) framework alignment',
      'PCI DSS compliance for payment gateways and FinTech',
      'India DPDP Act & GDPR privacy consulting',
      'HIPAA compliance and third-party risk management',
    ],
  },
  {
    icon: UserCog,
    letter: 'C',
    title: 'Managed Security & Strategic Advisory',
    items: [
      'Virtual CISO (vCISO): fractional, high-level strategic security leadership for scaling enterprises',
      'Governance, Risk, and Compliance (GRC): end-to-end framework advisory',
      'Incident response planning: bespoke tabletop exercises and Business Continuity (BCP/DR) documentation',
    ],
  },
  {
    icon: Swords,
    letter: 'D',
    title: 'Advanced Offensive Security Operations',
    items: [
      'Red Teaming & Purple Teaming: simulating sophisticated, real-world cyberattacks while collaboratively training your internal SOC teams',
      'Breach & Attack Simulation (BAS): automated, continuous testing of your perimeter defences',
      'Social engineering: advanced phishing simulations and physical security audits',
    ],
  },
  {
    icon: Cloud,
    letter: 'E',
    title: 'Cloud, Identity & Infrastructure Assurance',
    items: [
      'Cloud security posture review: configuration audits benchmarked against CIS standards across AWS, Azure and GCP',
      'Container & Kubernetes security: image scanning, orchestration hardening, runtime review',
      'DevSecOps integration: security scanning embedded into CI/CD pipelines',
      'IAM review: least-privilege audits and access-sprawl remediation',
    ],
  },
  {
    icon: Radar,
    letter: 'F',
    title: 'Detection, Response & Digital Forensics',
    items: [
      'Managed Detection & Response (MDR): continuous, human-reviewed monitoring',
      'Incident response retainer: on-call response team for immediate action',
      'Digital forensics: post-incident investigation and root-cause analysis',
    ],
  },
];

export default function ServicesDetail() {
  return (
    <section id="catalogue" className="relative scroll-mt-28 py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">The Full Catalogue</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Six pillars, engineered to integrate with how you operate
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-2" stagger={0.1}>
          {CATEGORIES.map(({ icon: Icon, letter, title, items }, i) => {
            const palette = ICON_PALETTE[i % ICON_PALETTE.length];
            return (
              <RevealItem key={title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 shadow-card backdrop-blur-sm transition-colors duration-300 hover:border-primary/25 hover:bg-white/[0.05] sm:p-8"
                >
                  <span className="pointer-events-none absolute right-6 top-5 font-display text-4xl font-extrabold text-white/[0.04] transition-colors duration-300 group-hover:text-primary/15">
                    {letter}
                  </span>

                  <div className="relative flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110',
                        palette.bg,
                        palette.text,
                        palette.hoverBg,
                        palette.glow
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground">
                      {title}
                    </h3>
                  </div>
                  <ul className="relative mt-5 space-y-2.5 border-t border-white/[0.06] pt-5">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
