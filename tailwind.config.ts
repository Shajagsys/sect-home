import type { Config } from 'tailwindcss';

// Scoped to the marketing site only (Home / About / Contact). The internal
// CRM (dashboard, login, portal, e-sign) keeps its original plain CSS in
// src/app/globals.css and never renders these files, so this config has no
// effect on it.
const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/(marketing)/**/*.{ts,tsx}',
    './src/components/marketing/**/*.{ts,tsx}',
    './src/components/ui/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        background: '#0F172A',
        surface: '#1E293B',
        'surface-hi': '#243349',
        border: 'rgba(148, 163, 184, 0.14)',
        'border-hi': 'rgba(148, 163, 184, 0.28)',
        primary: {
          DEFAULT: '#2F5FAE',
          light: '#4C7FDB',
          dark: '#1B3B73',
          foreground: '#F8FAFC',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          foreground: '#241703',
        },
        foreground: '#F8FAFC',
        muted: '#94A3B8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        wordmark: ['var(--font-wordmark)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(47, 95, 174, 0.15), 0 8px 40px -8px rgba(47, 95, 174, 0.35)',
        'glow-amber': '0 0 0 1px rgba(245, 158, 11, 0.18), 0 8px 40px -8px rgba(245, 158, 11, 0.4)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.55)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-24px) translateX(10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
        'gradient-move': 'gradient-move 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
