'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from 'lucide-react';
import { XLogo } from '@/components/marketing/icons/x-logo';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.886-9.886 9.886m0-18C5.394 3.785.01 9.17.01 15.786c0 2.11.55 4.17 1.594 5.98L0 24l2.285-.598a11.94 11.94 0 005.698 1.448h.005c6.613 0 11.998-5.385 11.999-12.002 0-3.204-1.247-6.214-3.513-8.48A11.928 11.928 0 0012.051 3.785" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sercureedge_cyber_tech?utm_source=qr&igsh=ZHk3aTkxMnlnd3N6',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1BkdcRMeMA/',
    icon: Facebook,
  },
  {
    label: 'X',
    href: 'https://x.com/SercureEdg7wzu',
    icon: XLogo,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@sercureedgecybertech?si=7iWtI6SrF6FTIWL7',
    icon: Youtube,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919812451305',
    icon: WhatsAppIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sercureedge-cyber-tech-665039427',
    icon: Linkedin,
  },
];

export default function NotFound() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const opacityRef = useRef<number>(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fade animation controller using requestAnimationFrame
    const fadeTo = (targetOpacity: number, duration: number, onComplete?: () => void) => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      const startTime = performance.now();
      const startOpacity = opacityRef.current;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;

        opacityRef.current = currentOpacity;
        if (videoRef.current) {
          videoRef.current.style.opacity = String(currentOpacity);
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          animFrameRef.current = null;
          if (onComplete) {
            onComplete();
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    };

    // Initial fade in when component mounts / video starts playing
    fadeTo(1, 500);

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeRemaining = video.duration - video.currentTime;

      // Trigger fade out when ~0.55s remain before video ends
      if (timeRemaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      opacityRef.current = 0;
      if (videoRef.current) {
        videoRef.current.style.opacity = '0';
      }

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current
            .play()
            .then(() => {
              fadingOutRef.current = false;
              fadeTo(1, 500);
            })
            .catch(() => {
              fadingOutRef.current = false;
              fadeTo(1, 500);
            });
        }
      }, 100);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col justify-between select-none font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] pointer-events-none z-0 transition-none"
        style={{ opacity: 1 }}
      />

      {/* Dark Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-[1] pointer-events-none" />

      {/* Navigation */}
      <header className="relative z-20 px-6 py-6 w-full">
        <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto liquid-glass">
          {/* Secure Edge Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-background shadow-glow">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-bold tracking-tight text-white">
                SecureEdge
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/60">
                Cyber Technologies
              </span>
            </span>
          </Link>

          {/* Right Side Portal Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/portal"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Client Portal
            </Link>
            <Link
              href="/login"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Login Portal
            </Link>
          </div>
        </div>
      </header>

      {/* 404 Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%] my-auto">
        <div className="relative flex flex-col items-center justify-center">
          {/* Glowing ambient backdrop */}
          <div className="absolute w-72 md:w-[32rem] h-24 bg-white/5 blur-3xl rounded-full pointer-events-none" />

          {/* Main 404 Number */}
          <h1
            className="text-8xl md:text-[10rem] lg:text-[12rem] text-white leading-none tracking-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.2)] select-none relative z-10"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            404
          </h1>

          {/* Futuristic horizontal accent line */}
          <div className="w-48 md:w-64 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent -mt-2 mb-6" />
        </div>

        {/* Error Message */}
        <h2
          className="text-3xl md:text-4xl text-white mb-4 tracking-wide font-normal"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Lost in the void.
        </h2>

        {/* Subtitle */}
        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 font-light">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        {/* Primary Action */}
        <Link
          href="/"
          className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        {/* Secondary Action */}
        <Link
          href="/services"
          className="text-white/50 hover:text-white/80 text-xs transition-colors mt-4 block"
        >
          Explore Our Services
        </Link>
      </main>

      {/* Bottom Social / Utility Buttons */}
      <footer className="relative z-10 flex flex-wrap justify-center gap-4 pb-12 px-4">
        {SOCIAL_LINKS.map((social) => {
          const IconComponent = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
            >
              <IconComponent className="w-5 h-5" />
            </a>
          );
        })}
      </footer>
    </div>
  );
}
