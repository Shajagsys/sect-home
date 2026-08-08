import { cn } from '@/lib/utils';

export type SocialAnimation = 'fill' | 'slide' | 'expand' | 'spin';

/** Full literal class names, one per variant — Tailwind's content scanner
 * only keeps `@layer components` selectors it can find as exact strings in
 * source. Building the class via `social-icon--${animation}` at runtime
 * hid all four selectors from that scan and got them purged from the
 * compiled CSS, which is why the ::before fill (only ever hidden by the
 * purged rules) rendered as a permanently-visible circle instead of a
 * hover-only reveal. */
const ANIMATION_CLASS: Record<SocialAnimation, string> = {
  fill: 'social-icon--fill',
  slide: 'social-icon--slide',
  expand: 'social-icon--expand',
  spin: 'social-icon--spin',
};

/**
 * Animated social icon button — pseudo-element (`::before`) fill reveal on
 * hover/focus, styled per platform via `.social-icon--<variant>` in
 * globals.css. Pure CSS (no JS), so it costs nothing on the client and
 * respects `prefers-reduced-motion` globally.
 */
export function SocialIcon({
  href,
  label,
  icon: Icon,
  animation,
  color,
  className,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  animation: SocialAnimation;
  /** Brand color used for the hover fill / focus ring — any valid CSS color. */
  color: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ '--social-color': color } as React.CSSProperties}
      className={cn('social-icon', ANIMATION_CLASS[animation], className)}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
