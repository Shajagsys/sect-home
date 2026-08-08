'use client';

import { motion } from 'framer-motion';
import { Fingerprint, Presentation, Timer, KeyRound, Handshake } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { ICON_TONES_LIGHT } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const REASONS = [
  { icon: Fingerprint, title: 'Genuine Expertise, Not Automated Scanning', desc: 'Automated tooling flags anomalies; our engineers manually validate and exploit them exactly as a determined adversary would.' },
  { icon: Presentation, title: 'Boardroom-Ready Deliverables', desc: 'Every deliverable is engineered for dual audiences — a report your board can absorb and your engineers can execute against.' },
  { icon: Timer, title: 'Disciplined Turnaround', desc: 'Disciplined project governance ensures engagements conclude on schedule, without scope creep.' },
  { icon: KeyRound, title: 'Confidentiality by Design', desc: 'Every mandate is executed under strict NDA, with data handling governed by rigorous, auditable controls.' },
  { icon: Handshake, title: 'Enduring Partnership', desc: 'Our relationship does not conclude at report delivery; retesting, advisory and continuous monitoring extend the partnership.' },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="container">
        <Reveal className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Why Choose Us</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The SecureEdge distinction
          </h2>
        </Reveal>

        <div className="mt-16 space-y-4">
          {REASONS.map(({ icon: Icon, title, desc }, i) => {
            const tone = ICON_TONES_LIGHT[i % ICON_TONES_LIGHT.length];
            return (
              <Reveal key={title} delay={i * 0.06}>
                <div
                  className={cn(
                    'group relative grid gap-6 overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-6 py-7 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_20px_50px_-20px_rgba(15,23,42,0.15)] transition-colors duration-300 hover:border-primary/30 hover:bg-slate-50 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 sm:px-8'
                  )}
                >
                  <span className="font-display text-5xl font-extrabold text-black/[0.05] transition-colors duration-300 group-hover:text-primary/20 sm:text-6xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">{title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">{desc}</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.15, type: 'spring', stiffness: 220, damping: 16 }}
                    className={cn(
                      'hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110 sm:flex',
                      tone.bg,
                      tone.text,
                      tone.ring,
                      tone.glow
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
