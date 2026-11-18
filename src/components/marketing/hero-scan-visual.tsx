'use client';

import { motion } from 'framer-motion';
import {
  Terminal,
  Search,
  Settings,
  Grid3x3,
  MapPin,
  Hexagon,
  FileText,
  CheckCircle2,
  Loader2,
  Clock,
  AlertTriangle,
  Globe,
  Lock,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTypewriterCount } from '@/hooks/use-typewriter';
import { useSequentialReveal } from '@/hooks/use-sequential-reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

const panel = 'glass-hi shadow-card rounded-2xl p-3.5 sm:p-5';
const panelHeader = 'flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70';

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
};
const iconPopVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: EASE, delay: 0.2 } },
};

function PulseDot({ color = 'bg-emerald-400' }: { color?: string }) {
  return (
    <span className="relative ml-auto flex h-2 w-2">
      <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', color)} />
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', color)} />
    </span>
  );
}

/** Static fill-to-percent bar (Terminal panel) vs. a continuously sweeping
 * indeterminate bar (Searching Target panel) for an always-scanning feel. */
function ProgressBar({ percent, loop = false }: { percent: number; loop?: boolean }) {
  const reduceMotion = useReducedMotion();

  if (loop) {
    return (
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute top-0 h-full w-1/3 rounded-full bg-gradient-to-r from-primary to-primary-light"
          animate={reduceMotion ? undefined : { left: ['-34%', '100%'] }}
          initial={{ left: '-34%' }}
          transition={reduceMotion ? undefined : { duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
          initial={{ width: '0%' }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
        />
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium text-white/50">{percent}%</span>
    </div>
  );
}

const TERMINAL_LINES: { n: string; text: string; tone: 'comment' | 'code' }[] = [
  { n: '01', text: '// Initializing scan....', tone: 'comment' },
  { n: '02', text: 'target = secureedge.app', tone: 'code' },
  { n: '03', text: 'ports = [21, 22, 80, 443, 8443]', tone: 'code' },
  { n: '04', text: 'scan_type = "full"', tone: 'code' },
  { n: '05', text: 'modules = ["vuln", "config", "osint"]', tone: 'code' },
  { n: '06', text: '', tone: 'comment' },
  { n: '07', text: '// Scanning target', tone: 'comment' },
  { n: '08', text: 'for port in ports:', tone: 'code' },
  { n: '09', text: '  result = scan(port)', tone: 'code' },
  { n: '10', text: '  if result.status == "open":', tone: 'code' },
  { n: '11', text: '    detect_vuln(result)', tone: 'code' },
  { n: '12', text: '// Scan in progress...', tone: 'comment' },
];
const TERMINAL_LINE_LENGTHS = TERMINAL_LINES.map((l) => Math.max(l.text.length, 1));
const TERMINAL_TOTAL_CHARS = TERMINAL_LINE_LENGTHS.reduce((a, b) => a + b, 0);

function TerminalPanel() {
  const typed = useTypewriterCount(TERMINAL_TOTAL_CHARS, 16, 2400);

  let consumed = 0;

  return (
    <div className={panel}>
      <div className={panelHeader}>
        <Terminal className="h-3.5 w-3.5 text-primary-light" strokeWidth={2.4} />
        System Scan In Progress
        <PulseDot />
      </div>
      <div className="mt-3 space-y-[3px] overflow-x-auto rounded-lg bg-black/30 p-2.5 sm:p-3 font-mono text-[10px] sm:text-[11px] leading-[1.6]">
        {TERMINAL_LINES.map((line, i) => {
          const lineLen = TERMINAL_LINE_LENGTHS[i];
          const revealedInLine = Math.min(Math.max(typed - consumed, 0), lineLen);
          const isTypingHere = revealedInLine > 0 && revealedInLine < lineLen;
          consumed += lineLen;
          return (
            <div key={i} className="flex gap-2 whitespace-nowrap">
              <span className="w-4 shrink-0 select-none text-white/25">{line.n}</span>
              <span className={line.tone === 'comment' ? 'text-white/35' : 'text-emerald-300/80'}>
                {line.text.slice(0, revealedInLine) || ' '}
                {isTypingHere && <span className="animate-pulse text-primary-light">&#9608;</span>}
              </span>
            </div>
          );
        })}
      </div>
      <ProgressBar percent={75} />
    </div>
  );
}

const TARGET_ICONS = [
  { icon: Settings, label: 'Network' },
  { icon: Grid3x3, label: 'Services' },
  { icon: MapPin, label: 'Endpoints' },
  { icon: Hexagon, label: 'Tech' },
];

function SearchingTargetPanel() {
  return (
    <div className={panel}>
      <div className={panelHeader}>
        <Search className="h-3.5 w-3.5 text-primary-light" strokeWidth={2.4} />
        Searching Target
        <PulseDot color="bg-primary-light" />
      </div>
      <p className="mt-3 font-mono text-sm text-foreground">secureedge.app</p>
      <ProgressBar percent={75} loop />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {TARGET_ICONS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <span className="text-[9px] font-medium text-white/45">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCAN_RESULTS: { label: string; status: 'done' | 'progress' | 'pending' }[] = [
  { label: 'Target Identification', status: 'done' },
  { label: 'Port Scanning', status: 'done' },
  { label: 'Service Enumeration', status: 'done' },
  { label: 'Vulnerability Detection', status: 'progress' },
  { label: 'Risk Analysis', status: 'pending' },
  { label: 'Report Generation', status: 'pending' },
];

function ScanResultsPanel() {
  const revealed = useSequentialReveal(SCAN_RESULTS.length, 480, 2600);

  return (
    <div className={panel}>
      <div className={panelHeader}>
        <FileText className="h-3.5 w-3.5 text-primary-light" strokeWidth={2.4} />
        Scan Results
      </div>
      <ul className="mt-3 space-y-2.5">
        {SCAN_RESULTS.map((r, i) => {
          const visible = i < revealed;
          return (
            <motion.li
              key={r.label}
              initial="hidden"
              animate={visible ? 'visible' : 'hidden'}
              variants={rowVariants}
              className="flex items-center gap-2.5 text-[12px]"
            >
              <motion.span initial="hidden" animate={visible ? 'visible' : 'hidden'} variants={iconPopVariants}>
                {r.status === 'done' && (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" strokeWidth={2} />
                )}
                {r.status === 'progress' && (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary-light" strokeWidth={2.4} />
                )}
                {r.status === 'pending' && <Clock className="h-3.5 w-3.5 shrink-0 text-white/30" strokeWidth={2} />}
              </motion.span>
              <span className="flex-1 text-white/75">{r.label}</span>
              {r.status === 'done' && <span className="text-emerald-400/80">Completed</span>}
              {r.status === 'progress' && <span className="text-primary-light">In Progress</span>}
              {r.status === 'pending' && <span className="text-white/35">Pending</span>}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

const VULNERABILITIES: { label: string; severity: 'Critical' | 'High' | 'Medium' }[] = [
  { label: 'SQL Injection', severity: 'Critical' },
  { label: 'Cross-Site Scripting (XSS)', severity: 'High' },
  { label: 'Security Misconfiguration', severity: 'Medium' },
  { label: 'Sensitive Data Exposure', severity: 'Medium' },
];

const SEVERITY_TONE: Record<string, string> = {
  Critical: 'text-red-400',
  High: 'text-orange-400',
  Medium: 'text-amber-400',
};

function VulnerabilityPanel() {
  const revealed = useSequentialReveal(VULNERABILITIES.length, 550, 2600);

  return (
    <div className={panel}>
      <div className="flex items-center gap-2">
        <span className={panelHeader}>
          <AlertTriangle className="h-3.5 w-3.5 text-red-400" strokeWidth={2.4} />
          Vulnerability Found
        </span>
        <span className="ml-auto rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-red-400">
          High Risk
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {VULNERABILITIES.map((v, i) => (
          <motion.li
            key={v.label}
            initial="hidden"
            animate={i < revealed ? 'visible' : 'hidden'}
            variants={rowVariants}
            className="flex items-center justify-between text-[12px]"
          >
            <span className="text-white/75">{v.label}</span>
            <span className={cn('font-semibold', SEVERITY_TONE[v.severity])}>{v.severity}</span>
          </motion.li>
        ))}
      </ul>
      <a
        href="/services/vapt"
        className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-primary-light transition-colors hover:text-primary"
      >
        View Full Report
        <ArrowUpRight className="h-3 w-3" />
      </a>
    </div>
  );
}

// Simplified world silhouette as a union of ellipses per landmass — no
// mapping library or map asset is available in this project, so continents
// are approximated in lon/lat space rather than traced accurately.
const WORLD_LAND_ELLIPSES = [
  { cx: -100, cy: 45, rx: 34, ry: 19 }, // North America
  { cx: -95, cy: 62, rx: 22, ry: 13 }, // Canada north
  { cx: -95, cy: 19, rx: 9, ry: 7 }, // Mexico / Central America
  { cx: -60, cy: -14, rx: 17, ry: 28 }, // South America
  { cx: 14, cy: 50, rx: 19, ry: 11 }, // Europe
  { cx: 20, cy: 4, rx: 19, ry: 33 }, // Africa
  { cx: 60, cy: 52, rx: 19, ry: 14 }, // Russia west / central Asia
  { cx: 95, cy: 46, rx: 42, ry: 17 }, // Asia
  { cx: 105, cy: 24, rx: 22, ry: 13 }, // South / Southeast Asia
  { cx: 135, cy: -25, rx: 14, ry: 9 }, // Australia
];

const MAP_VIEW_W = 100;
const MAP_VIEW_H = 43;

function project(lon: number, lat: number) {
  return { x: ((lon + 180) / 360) * MAP_VIEW_W, y: ((78 - lat) / 156) * MAP_VIEW_H };
}

function isLand(lon: number, lat: number) {
  return WORLD_LAND_ELLIPSES.some((e) => ((lon - e.cx) / e.rx) ** 2 + ((lat - e.cy) / e.ry) ** 2 <= 1);
}

const WORLD_DOTS = (() => {
  const dots: { x: number; y: number }[] = [];
  const cols = 46;
  const rows = 20;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lon = -180 + (col + 0.5) * (360 / cols);
      const lat = 78 - (row + 0.5) * (156 / rows);
      if (isLand(lon, lat)) dots.push(project(lon, lat));
    }
  }
  return dots;
})();

// A handful of real cities used purely as plausible marker positions.
const THREAT_CITIES = {
  newYork: project(-74, 41),
  london: project(0, 51),
  moscow: project(37, 56),
  mumbai: project(73, 19),
  singapore: project(104, 1),
  sydney: project(151, -33),
};
const THREAT_MARKERS = Object.values(THREAT_CITIES);
const THREAT_LINKS: [{ x: number; y: number }, { x: number; y: number }][] = [
  [THREAT_CITIES.newYork, THREAT_CITIES.london],
  [THREAT_CITIES.london, THREAT_CITIES.moscow],
  [THREAT_CITIES.moscow, THREAT_CITIES.mumbai],
  [THREAT_CITIES.mumbai, THREAT_CITIES.singapore],
  [THREAT_CITIES.singapore, THREAT_CITIES.sydney],
  [THREAT_CITIES.newYork, THREAT_CITIES.mumbai],
];

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = Math.min(a.y, b.y) - Math.max(3, Math.abs(b.x - a.x) * 0.12);
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function WorldThreatMap() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative h-20 w-full overflow-hidden rounded-lg bg-white/[0.03] sm:h-24">
      <svg viewBox={`0 0 ${MAP_VIEW_W} ${MAP_VIEW_H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {WORLD_DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="0.55" fill="rgba(148,197,255,0.35)" />
        ))}
        {THREAT_LINKS.map(([a, b], i) => (
          <path
            key={i}
            d={arcPath(a, b)}
            fill="none"
            stroke="rgba(248,113,113,0.55)"
            strokeWidth="0.35"
            strokeDasharray="1.4 1.4"
          >
            {!reduceMotion && (
              <animate attributeName="stroke-dashoffset" from="0" to="-5.6" dur="1.4s" repeatCount="indefinite" />
            )}
          </path>
        ))}
        {THREAT_MARKERS.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r="1" fill="#f87171">
            {!reduceMotion && (
              <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
            )}
          </circle>
        ))}
      </svg>
    </div>
  );
}

function ThreatMapPanel() {
  return (
    <div className={panel}>
      <div className="flex items-center gap-2">
        <span className={panelHeader}>
          <Globe className="h-3.5 w-3.5 text-primary-light" strokeWidth={2.4} />
          Global Threat Map
        </span>
        <span className="ml-auto flex items-center gap-3 text-right">
          <span>
            <span className="block text-[9px] uppercase tracking-wide text-white/40">Live</span>
            <span className="font-display text-sm font-bold text-red-400">24</span>
          </span>
          <span>
            <span className="block text-[9px] uppercase tracking-wide text-white/40">Countries</span>
            <span className="font-display text-sm font-bold text-primary-light">12</span>
          </span>
        </span>
      </div>
      <div className="mt-3">
        <WorldThreatMap />
      </div>
    </div>
  );
}

function ShieldCenterpiece() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:flex">
      {[9, 7, 5].map((rem, i) => (
        <motion.div
          key={rem}
          className="absolute rounded-full border border-primary-light/20"
          style={{ width: `${rem}rem`, height: `${rem}rem`, left: `-${rem / 2}rem`, top: `-${rem / 2}rem` }}
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={reduceMotion ? undefined : { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
      <div className="absolute -inset-6 rounded-full bg-primary-light/25 blur-[50px]" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-[0_0_40px_-4px_rgba(76,127,219,0.8)] sm:h-20 sm:w-20">
        <ShieldCheck className="h-9 w-9 text-white/90 sm:h-11 sm:w-11" strokeWidth={1.6} />
        <Lock className="absolute h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={2.4} />
      </div>
    </div>
  );
}

/**
 * Recreates the hero.png reference's floating scan-dashboard cluster in real
 * markup (terminal, target search, scan results, vulnerability findings,
 * threat map, shield centerpiece) — a bento grid rather than absolute
 * pixel-matched panels so it stays responsive, with the shield overlaid on
 * the seam between columns like the reference composition. Each panel
 * self-plays a looping "live scan" sequence rather than a one-shot entrance.
 */
export function HeroScanVisual({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.35 }}
      className={cn('relative md:[perspective:1800px]', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 scale-110 rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(76,127,219,0.3), transparent 70%)' }}
      />
      {/* Tilted on md+ screens, flat on mobile to prevent overflow & distortion */}
      <div
        className="relative drop-shadow-[0_40px_70px_-20px_rgba(4,10,20,0.75)] md:[transform:rotateY(-12deg)_rotateX(5deg)_rotateZ(1deg)] md:[transform-style:preserve-3d]"
      >
        <ShieldCenterpiece />
        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <TerminalPanel />
            <ScanResultsPanel />
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <SearchingTargetPanel />
            <VulnerabilityPanel />
            <ThreatMapPanel />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
