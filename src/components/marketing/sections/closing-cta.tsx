import Link from 'next/link';
import { Reveal } from '@/components/marketing/reveal';
import { Button } from '@/components/ui/button';

export default function ClosingCta() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-32">
      <div
        className="motion-safe:animate-gradient-move pointer-events-none absolute inset-0 bg-[length:200%_200%] opacity-70"
        style={{ backgroundImage: 'linear-gradient(120deg, #2F5FAE, #5B9BF0, #1B3B73, #2F5FAE)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-background/75" />

      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Uncertain of your current risk exposure?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted">
            Arrange a complimentary consultation with our strategic security team. We&apos;ll help you
            understand your present risk posture and the most consequential next step — delivered
            without pressure or unnecessary technical obfuscation.
          </p>
          <div className="mt-9 flex justify-center">
            <Button asChild size="lg" variant="primary" withArrow>
              <Link href="/contact">Schedule a Strategic Consultation</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
