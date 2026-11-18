'use client';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQS } from '@/lib/faq-data';

export default function Faq() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="container max-w-3xl">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">FAQ</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <RevealGroup className="mt-12" stagger={0.06}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <RevealItem key={f.q}>
                <AccordionItem value={`item-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              </RevealItem>
            ))}
          </Accordion>
        </RevealGroup>
      </div>
    </section>
  );
}
