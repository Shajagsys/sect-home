import Link from 'next/link';
import { Gauge } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { Button } from '@/components/ui/button';
import { AmbientBackground } from '@/components/marketing/ambient-background';

export default function MaturityCta() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/15 bg-gradient-to-br from-surface via-surface to-primary/[0.06] p-10 sm:p-16">
            <AmbientBackground variant="dense" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
                <Gauge className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Is Your Enterprise Truly Secure?
              </h2>
              <p className="mt-4 text-muted">
                Speak with our strategic security team for a complimentary, no-obligation maturity
                snapshot and a prioritised roadmap for your next steps — typically a 2-minute conversation.
              </p>
              <div className="mt-9">
                <Button asChild size="lg" variant="accent" withArrow>
                  <Link href="/contact">Start the Assessment</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
