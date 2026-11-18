'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SERVICES } from '@/lib/services-data';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/testimonials', label: 'Testimonial' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

/** Exact match for "/", prefix match for everything else — so
 * "/services/vapt" still highlights the "Services" nav item. */
function isLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-500 ease-premium sm:mt-4 sm:px-6',
          scrolled
            ? 'border-white/10 bg-background/70 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        )}
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/logo-dark-640.webp"
            alt="SecureEdge Cyber Technologies"
            width={320}
            height={84}
            priority
            className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-85"
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(pathname, link.href);

            if (link.href === '/services') {
              return (
                <div key={link.href} className="group/menu relative">
                  <Link
                    href={link.href}
                    className={cn(
                      'group relative flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-200',
                      active ? 'text-foreground' : 'text-foreground/75 hover:text-foreground'
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover/menu:rotate-180" />
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gradient-to-r from-primary to-primary-light transition-transform duration-300 ease-premium',
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      )}
                    />
                  </Link>

                  {/* Mega-menu — hover or keyboard-focus reveal. Left-anchored (not centered)
                      so it can't overflow past the header's left edge on narrower xl widths. */}
                  <div className="invisible absolute left-0 top-full z-50 w-[26rem] pt-3 opacity-0 transition-all duration-200 ease-premium group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-background/95 p-3 shadow-[0_20px_60px_-16px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                      {SERVICES.map((s) => {
                        const SIcon = s.icon;
                        return (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-white/[0.06] hover:text-foreground"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
                              <SIcon className="h-4 w-4" strokeWidth={2} />
                            </span>
                            <span className="flex-1 font-medium">{s.navLabel}</span>
                            <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-primary-light opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-200',
                  active ? 'text-foreground' : 'text-foreground/75 hover:text-foreground'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gradient-to-r from-primary to-primary-light transition-transform duration-300 ease-premium',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            href="/portal"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
          >
            Client Portal
          </Link>
          <Button asChild size="sm" variant="primary">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mx-3 mt-2 max-h-[75vh] overflow-y-auto rounded-2xl border border-white/10 bg-background/95 p-4 backdrop-blur-xl xl:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(pathname, link.href);

                if (link.href === '/services') {
                  return (
                    <div key={link.href}>
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          className={cn(
                            'flex-1 rounded-xl px-4 py-3 text-[15px] font-medium hover:bg-white/5 hover:text-foreground',
                            active ? 'text-foreground' : 'text-foreground/80'
                          )}
                        >
                          {link.label}
                        </Link>
                        <button
                          aria-label="Toggle services list"
                          aria-expanded={mobileServicesOpen}
                          onClick={() => setMobileServicesOpen((v) => !v)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground/60"
                        >
                          <ChevronDown
                            className={cn('h-4 w-4 transition-transform duration-300', mobileServicesOpen && 'rotate-180')}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden pl-3"
                          >
                            {SERVICES.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                className="block rounded-xl px-4 py-2.5 text-sm text-foreground/70 hover:bg-white/5 hover:text-foreground"
                              >
                                {s.navLabel}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-xl px-4 py-3 text-[15px] font-medium hover:bg-white/5 hover:text-foreground',
                      active ? 'text-foreground' : 'text-foreground/80'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/portal"
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-foreground/80 hover:bg-white/5 hover:text-foreground"
              >
                Client Portal
              </Link>
              <div className="mt-2">
                <Button asChild variant="primary" className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
