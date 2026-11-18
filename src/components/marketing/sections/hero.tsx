'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Bug, ScanSearch, Building2, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGradientText } from '@/components/marketing/animated-gradient-text';
import { HeroBackgroundFX } from '@/components/marketing/hero-background-fx';
import { HeroScanVisual } from '@/components/marketing/hero-scan-visual';
import { useCountUp } from '@/hooks/use-count-up';

const EASE = [0.16, 1, 0.3, 1] as const;
const HERO_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const statItem = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

// Same figures published in the Impact Stats section further down the page —
// kept in sync with that real data rather than inventing separate hero numbers.
const STATS = [
  { icon: ShieldCheck, end: 120, suffix: '+', label: 'Enterprises secured' },
  { icon: Bug, end: 45, suffix: 'K+', label: 'Vulnerabilities identified' },
  { icon: ScanSearch, end: 300, suffix: '+', label: 'Systems assessed' },
  { icon: Building2, end: 7, suffix: '+', label: 'Regulated sectors' },
];

function HeroStat({
  icon: Icon,
  end,
  suffix,
  label,
}: {
  icon: LucideIcon;
  end: number;
  suffix: string;
  label: string;
}) {
  const { ref, value } = useCountUp(end, 1600);
  return (
    <motion.div variants={statItem} className="flex items-center gap-2.5 sm:gap-3 px-1 sm:px-2 lg:justify-center lg:px-6">
      <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
      </span>
      <div>
        <p
          ref={ref as React.RefObject<HTMLParagraphElement>}
          className="font-display text-xl font-bold text-foreground sm:text-3xl"
        >
          {value}
          {suffix}
        </p>
        <p className="text-[11px] text-white/55 sm:text-sm">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#08111F] pb-12 pt-24 sm:pb-16 sm:pt-36 lg:pb-20">
      {/* Full-screen looping video backdrop */}
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(4,10,20,.82), rgba(4,10,20,.94))' }}
        />
      </div>

      {/* Ambient moving background — grid drift, particles, scan beam */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 78% 38%, rgba(76,127,219,0.16), transparent 45%)' }}
      />
      <HeroBackgroundFX />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 sm:gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-8 xl:gap-12">
          {/* Left — content */}
          <motion.div initial="hidden" animate="visible" variants={container}>
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-primary-light/30 bg-primary/[0.08] px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-primary-light shadow-[0_0_20px_-6px_rgba(76,127,219,0.5)] backdrop-blur-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
              Cybersecurity Experts
            </motion.div>

            <h1 className="mt-4 sm:mt-6 font-display text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem] xl:text-[3.75rem]">
              <motion.span variants={item} className="block sm:inline lg:block">
                Fortifying Your{' '}
              </motion.span>
              <motion.span variants={item} className="block sm:inline lg:block">
                <AnimatedGradientText>Digital Assets.</AnimatedGradientText>{' '}
              </motion.span>
              <motion.span variants={item} className="block sm:inline lg:block">
                Securing Your{' '}
              </motion.span>
              <motion.span variants={item} className="block sm:inline lg:block">
                <AnimatedGradientText>Tomorrow.</AnimatedGradientText>
              </motion.span>
            </h1>

            <motion.p variants={item} className="mt-4 sm:mt-6 max-w-lg text-sm leading-relaxed text-white/60 sm:text-lg">
              Proactive cybersecurity solutions&mdash;from penetration testing to 24/7 threat monitoring&mdash;keeping
              your business secure and resilient.
            </motion.p>

            <motion.div variants={item} className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button asChild size="lg" variant="primary" withArrow className="w-full sm:w-auto justify-center text-center">
                <Link href="/contact">Schedule a Strategic Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto justify-center text-center">
                <a href="#services">Discover Our Solutions</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right — live cybersecurity scan visual */}
          <HeroScanVisual className="relative mx-auto w-full max-w-md lg:max-w-none" />
        </div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-10 sm:mt-20 grid grid-cols-2 gap-y-6 sm:gap-y-8 border-t border-white/10 pt-8 sm:pt-10 lg:grid-cols-4 lg:divide-x lg:divide-white/10"
        >
          {STATS.map((s) => (
            <HeroStat key={s.label} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
