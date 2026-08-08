'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ETHOS = [
  { title: 'Uncompromising Integrity', desc: 'We deliver transparent, unvarnished truths about your security posture. A consultancy that only delivers good news is a liability.' },
  { title: 'Actionable Clarity', desc: 'Cybersecurity is inherently complex; our mandate is to demystify it.' },
  { title: 'Constant Vigilance', desc: 'The threat landscape is perpetually evolving, and our methodologies evolve in tandem.' },
  { title: 'Absolute Confidentiality', desc: 'Your proprietary data and system architectures are safeguarded under strict NDAs and rigid access controls.' },
  { title: 'Strategic Partnership', desc: 'We evaluate our success not by the volume of reports generated, but by the tangible enhancement of your long-term security maturity.' },
];

export default function EthosSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !timelineRef.current || !fillRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(fillRef.current, { scaleY: 0, transformOrigin: 'top' });
      gsap.to(fillRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 65%',
          end: 'bottom 80%',
          scrub: 0.6,
        },
      });
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Our Core Ethos</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The principles that govern every engagement
          </h2>
        </Reveal>

        <div ref={timelineRef} className="relative mx-auto mt-16 max-w-3xl pl-8 sm:pl-10">
          {/* Base (dim) line + GSAP scroll-scrubbed fill line drawing over it */}
          <div className="absolute inset-y-0 left-0 w-px bg-primary/10" />
          <div ref={fillRef} className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-primary-light to-primary" />

          <RevealGroup stagger={0.1}>
            {ETHOS.map((e, i) => (
              <RevealItem key={e.title} className={cn('relative pb-12 last:pb-0', i % 2 === 1 && 'sm:pl-8')}>
                <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary-light shadow-glow sm:-left-[calc(2.5rem+5px)]" />
                <span className="font-display text-sm font-bold text-primary-light">0{i + 1}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">{e.title}</h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{e.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
