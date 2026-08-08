import { Mail, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { AmbientBackground } from '@/components/marketing/ambient-background';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/lib/company';

export default function CareerOpportunities() {
  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent('Application — SecureEdge Cyber Technologies')}`;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/15 bg-gradient-to-br from-surface via-surface to-primary/[0.06] p-10 sm:p-16">
            <AmbientBackground variant="dense" />
            <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Current Opportunities
              </h2>
              <p className="mt-4 text-muted">
                We don&apos;t keep a list of generic openings — we hire deliberately, when we find
                someone exceptional. If that&apos;s you, tell us what you&apos;re great at and where
                you&apos;d add the most value.
              </p>
              <div className="mt-9">
                <Button asChild size="lg" variant="primary">
                  <a href={mailto}>
                    <Mail className="h-4 w-4" /> Send Us Your Resume
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
