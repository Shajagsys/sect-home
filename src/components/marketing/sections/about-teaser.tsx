'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { Eye, ShieldCheck, Users2 } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { Button } from '@/components/ui/button';
import { ICON_TONES_LIGHT } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const slideIn: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

const PILLARS = [
  { icon: Eye, title: 'Uncover Hidden Vulnerabilities', desc: 'Manual, adversary-grade testing that automated scanners miss.' },
  { icon: ShieldCheck, title: 'Achieve Regulatory Compliance', desc: 'ISO 27001, SOC 2, PCI DSS, HIPAA and DPDP Act readiness.' },
  { icon: Users2, title: 'Cultivate Security Culture', desc: 'Frameworks and training that empower your workforce long-term.' },
];

export default function AboutTeaser() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <ShieldCheck
        className="motion-safe:animate-spin-slow pointer-events-none absolute -left-16 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 text-primary/[0.03] lg:block"
        strokeWidth={0.6}
      />

      <div className="container relative grid gap-16 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Who We Are</span>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            A premier cybersecurity consultancy&mdash;built on clarity over complexity.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            We eschew fear-mongering and convoluted reporting. Instead, we provide actionable
            intelligence and practical remediation strategies that accelerate business growth
            without compromising on safety. Every engagement is governed by one principle:
            evidence over assumption.
          </p>
          <div className="mt-8">
            <Button asChild variant="outline" withArrow>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </Reveal>

        <RevealGroup className="grid gap-4" stagger={0.3}>
          {PILLARS.map(({ icon: Icon, title, desc }, i) => (
            <RevealItem key={title} variants={slideIn}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_20px_50px_-20px_rgba(15,23,42,0.18)] transition-colors duration-300 hover:border-primary/30 hover:bg-slate-50 hover:shadow-glow"
              >
                {/* Sheen sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.03] to-transparent transition-transform duration-700 ease-premium group-hover:translate-x-full" />

                <span className="pointer-events-none absolute right-5 top-4 font-display text-4xl font-extrabold text-black/[0.05] transition-all duration-300 group-hover:scale-110 group-hover:text-primary/20">
                  0{i + 1}
                </span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: 0.35 + i * 0.3, type: 'spring', stiffness: 220, damping: 16 }}
                  className={cn(
                    'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110',
                    ICON_TONES_LIGHT[i].bg,
                    ICON_TONES_LIGHT[i].text,
                    ICON_TONES_LIGHT[i].ring,
                    ICON_TONES_LIGHT[i].glow
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </motion.div>
                <div className="relative">
                  <h3 className="font-display text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-primary">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
