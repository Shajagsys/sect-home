/** Rotating set of brand-adjacent accent colors for icon badges — used
 * wherever a list of icons should read as distinct and colorful rather than
 * a single flat monochrome tint (services, methodology, why-choose-us). Kept
 * to three restrained, on-brand hues rather than a full rainbow. */
export const ICON_PALETTE = [
  {
    bg: 'bg-primary/10',
    text: 'text-primary-light',
    dot: 'bg-primary-light',
    hoverBg: 'group-hover:bg-primary/15',
    hoverRing: 'group-hover:ring-primary/40',
    glow: 'group-hover:shadow-[0_0_20px_rgba(47,95,174,0.45)]',
  },
  {
    bg: 'bg-[#5B9BF0]/10',
    text: 'text-[#5B9BF0]',
    dot: 'bg-[#5B9BF0]',
    hoverBg: 'group-hover:bg-[#5B9BF0]/15',
    hoverRing: 'group-hover:ring-[#5B9BF0]/40',
    glow: 'group-hover:shadow-[0_0_20px_rgba(91,155,240,0.45)]',
  },
  {
    bg: 'bg-accent/10',
    text: 'text-accent-light',
    dot: 'bg-accent-light',
    hoverBg: 'group-hover:bg-accent/15',
    hoverRing: 'group-hover:ring-accent/40',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.45)]',
  },
] as const;

/** Same rotation, retuned for white/light card backgrounds — darker icon
 * glyph colors so contrast holds against white instead of the near-black
 * cards the default palette above assumes. */
export const ICON_TONES_LIGHT = [
  {
    bg: 'bg-primary/10',
    text: 'text-primary',
    ring: 'ring-primary/20 group-hover:ring-primary/50',
    glow: 'group-hover:shadow-[0_0_20px_rgba(47,95,174,0.4)]',
  },
  {
    bg: 'bg-[#5B9BF0]/15',
    text: 'text-[#2F6FB8]',
    ring: 'ring-[#5B9BF0]/25 group-hover:ring-[#5B9BF0]/60',
    glow: 'group-hover:shadow-[0_0_20px_rgba(91,155,240,0.4)]',
  },
  {
    bg: 'bg-accent/10',
    text: 'text-accent',
    ring: 'ring-accent/20 group-hover:ring-accent/50',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
  },
] as const;
