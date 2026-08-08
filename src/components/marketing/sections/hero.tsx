'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGradientText } from '@/components/marketing/animated-gradient-text';
import { HeroBackgroundFX } from '@/components/marketing/hero-background-fx';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

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

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative h-[100svh] min-h-[720px] overflow-hidden bg-[#08111F]">
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
          style={{ background: 'linear-gradient(180deg, rgba(4,10,20,.78), rgba(4,10,20,.90))' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, rgba(47,95,174,.16), transparent 65%)' }}
        />
      </div>

      <HeroBackgroundFX />

      <div className="relative z-10 flex h-full flex-col">
        <div className="container flex flex-1 flex-col items-center justify-center pt-28 text-center sm:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="mx-auto flex max-w-6xl flex-col items-center"
          >
            <motion.h1
              variants={item}
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[3.75rem]"
            >
              <span className="block">Fortifying Your <AnimatedGradientText>Digital Assets.</AnimatedGradientText></span>
              <span className="block">Securing Your Tomorrow.</span>
            </motion.h1>

            <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Proactive cybersecurity solutions&mdash;from penetration testing to 24/7 threat monitoring&mdash;keeping
              your business secure and resilient. Identify vulnerabilities, strengthen defenses, and stay compliant
              with end-to-end cybersecurity solutions.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" variant="primary" withArrow>
                <Link href="/contact">Schedule a Strategic Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#services">Discover Our Solutions</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="hidden shrink-0 items-center justify-center gap-2 pb-8 text-white/50 sm:flex"
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <Mouse className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Scroll to Explore</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
