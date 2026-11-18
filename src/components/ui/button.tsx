'use client';

import { forwardRef } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/hooks/use-magnetic';

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-glow hover:shadow-[0_0_0_1px_rgba(47,95,174,0.3),0_12px_50px_-10px_rgba(47,95,174,0.55)] hover:-translate-y-0.5',
        accent:
          'bg-gradient-to-r from-accent to-accent-light text-accent-foreground shadow-glow-amber hover:-translate-y-0.5',
        outline:
          'border border-white/15 text-foreground bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/25',
        ghost: 'text-foreground/80 hover:text-foreground hover:bg-white/5',
      },
      size: {
        default: 'h-12 px-7 text-[15px]',
        lg: 'h-14 px-9 text-base',
        sm: 'h-10 px-5 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Show a trailing arrow that shifts on hover — used for premium CTAs. */
  withArrow?: boolean;
  magnetic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, withArrow = false, magnetic = true, children, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot : 'button';
    const { ref: magneticRef, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLDivElement>(0.25);

    return (
      <motion.div
        ref={magneticRef}
        style={magnetic ? { x, y } : undefined}
        onMouseMove={magnetic ? onMouseMove : undefined}
        onMouseLeave={magnetic ? onMouseLeave : undefined}
        className={cn('inline-block', className?.includes('w-full') && 'w-full sm:w-auto')}
      >
        <Comp ref={forwardedRef} className={cn(buttonVariants({ variant, size, className }))} {...props}>
          {/* Sheen sweep on hover */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-premium group-hover:translate-x-full" />
          <Slottable>
            <span className="relative z-10 inline-flex items-center gap-2">
              {children}
              {withArrow && (
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </span>
          </Slottable>
        </Comp>
      </motion.div>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
