import type { ReactNode } from 'react';
import { Reveal } from '@/components/marketing/reveal';
import { AmbientBackground } from '@/components/marketing/ambient-background';
import { Badge } from '@/components/ui/badge';

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 sm:pt-48">
      <AmbientBackground />
      <div className="container relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Badge variant="primary">{eyebrow}</Badge>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
