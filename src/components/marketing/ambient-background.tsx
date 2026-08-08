/** Layered grid + glow backdrop shared by dark sections. Purely decorative. */
export function AmbientBackground({ variant = 'default' }: { variant?: 'default' | 'dense' }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent_75%)]" />
      <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/[0.14] blur-[110px]" />
      <div className="absolute right-[-10%] top-[30%] h-[26rem] w-[26rem] rounded-full bg-accent/[0.08] blur-[100px]" />
      {variant === 'dense' && (
        <div className="absolute bottom-[-10%] left-[-10%] h-[24rem] w-[24rem] rounded-full bg-primary-light/[0.08] blur-[100px]" />
      )}
    </div>
  );
}
