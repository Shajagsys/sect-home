import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Infinite horizontal marquee. Renders `children` twice back-to-back and
 * animates a translateX(-50%) loop, so the seam is invisible as long as both
 * copies are identical width.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  speed = 'normal',
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: 'normal' | 'slow';
}) {
  return (
    <div className={cn('group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center gap-10 pr-10',
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee',
          reverse && '[animation-direction:reverse]',
          'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'flex shrink-0 items-center gap-10 pr-10',
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee',
          reverse && '[animation-direction:reverse]',
          'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
    </div>
  );
}
