import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide',
  {
    variants: {
      variant: {
        primary: 'border-primary/25 bg-primary/10 text-primary-light',
        accent: 'border-accent/25 bg-accent/10 text-accent-light',
        neutral: 'border-white/10 bg-white/[0.04] text-muted',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
