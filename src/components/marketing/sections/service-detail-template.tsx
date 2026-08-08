'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { Button } from '@/components/ui/button';
import { ICON_PALETTE } from '@/components/marketing/icon-palette';
import {
  getServiceBySlug,
  METHODOLOGY_STEPS,
  WHO_NEEDS_THIS,
  WHY_CHOOSE_US,
} from '@/lib/services-data';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Takes only the slug (a plain string) rather than the full service record —
 * the record's `icon` field is a component reference, which can't cross the
 * Server → Client Component prop boundary. Looking it up here, inside the
 * client component, keeps the icon reference entirely on the client side. */
export function ServiceDetailTemplate({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);
  if (!service) return null;

  const Icon = service.icon;

  return (
    <>
      {/* 01 — Hero */}
      <section className="relative overflow-hidden pb-16 pt-40 sm:pt-48">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent_75%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/[0.14] blur-[110px]" />

        <div className="container relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
              <Icon className="h-7 w-7" strokeWidth={2} />
            </div>
            <span className="mt-5 block text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
              {service.tagline}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
              {service.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{service.heroLine}</p>
            <div className="mt-9 flex justify-center">
              <Button asChild size="lg" variant="primary" withArrow>
                <Link href="/contact">Request a Security Assessment</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 — Overview */}
      <section className="relative py-16 sm:py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl space-y-5">
            {service.overview.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 03 — What We Test */}
      <section className="relative border-y border-white/[0.06] bg-surface/30 py-24 sm:py-32">
        <div className="container">
          <Reveal className="mx-auto max-w-xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">{service.groupsLabel}</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The specifics we cover
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-2" stagger={0.08}>
            {service.groups.map((group, i) => {
              const palette = ICON_PALETTE[i % ICON_PALETTE.length];
              return (
                <RevealItem key={group.heading}>
                  <div className="h-full rounded-2xl border border-white/[0.08] bg-background p-7 shadow-card sm:p-8">
                    <div className="flex items-center gap-3">
                      <span className={cn('h-2 w-2 shrink-0 rounded-full', palette.dot)} />
                      <h3 className="font-display text-base font-semibold text-foreground">{group.heading}</h3>
                    </div>
                    {group.intro && <p className="mt-2.5 text-sm leading-relaxed text-muted">{group.intro}</p>}
                    {group.items.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[13px] leading-none text-foreground/80"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* 04 — Methodology */}
      <section className="relative py-24 sm:py-32">
        <div className="container">
          <Reveal className="mx-auto max-w-xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Our Methodology</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Scope to retest — the same disciplined process, every time
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4" stagger={0.06}>
            {METHODOLOGY_STEPS.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-background text-sm font-bold text-primary-light">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 05 — Deliverables */}
      <section className="relative border-y border-white/[0.06] bg-surface/30 py-24 sm:py-32">
        <div className="container">
          <Reveal className="mx-auto max-w-xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Deliverables</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What lands in your inbox
            </h2>
          </Reveal>

          <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2" stagger={0.05}>
            {service.deliverables.map((d) => (
              <RevealItem key={d}>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-background px-4 py-3.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-light" />
                  <span className="text-sm text-foreground/85">{d}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 06 — Who Needs This / 07 — Why Choose Us */}
      <section className="relative py-24 sm:py-32">
        <div className="container grid gap-16 lg:grid-cols-2">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Who Needs This</span>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for regulated, high-stakes environments
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {WHO_NEEDS_THIS.map((w) => (
                <span
                  key={w}
                  className="rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-medium text-primary-light"
                >
                  {w}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Why Choose Us</span>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Measurable, not marketing
            </h2>
            <ul className="mt-6 space-y-3">
              {WHY_CHOOSE_US.map((w) => (
                <li key={w} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" />
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 08 — CTA */}
      <section className="relative py-24 sm:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="border-gradient overflow-hidden rounded-[2rem] p-10 text-center sm:p-16"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Know your security posture before attackers do.
            </h2>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" variant="primary">
                <Link href="/contact">
                  Request a Security Assessment <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
