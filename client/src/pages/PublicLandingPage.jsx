import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Footprints,
  HeartPulse,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from '../components/icons';
import { useTheme } from '../context/ThemeContext';
import { Hero10 } from '../components/Hero10';
import EduFanorWordmark from '../components/EduFanorWordmark';

const CURRENT_YEAR = new Date().getFullYear();

const GLOBE_POINTS = [
  { lat: 33.5731, lng: -7.5898, size: 0.36, label: 'Casablanca' },
  { lat: 40.7128, lng: -74.006, size: 0.3, label: 'New York' },
  { lat: 51.5074, lng: -0.1278, size: 0.28, label: 'London' },
  { lat: 25.2048, lng: 55.2708, size: 0.3, label: 'Dubai' },
  { lat: 35.6762, lng: 139.6503, size: 0.28, label: 'Tokyo' },
];

const GLOBE_ARCS = [
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 40.7128,
    endLng: -74.006,
    color: '#C5B0CD',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 51.5074,
    endLng: -0.1278,
    color: '#F6F5F2',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 25.2048,
    endLng: 55.2708,
    color: '#F6F5F2',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 35.6762,
    endLng: 139.6503,
    color: '#C5B0CD',
  },
];

function SectionLabel({ index, children, tone = 'light' }) {
  const textTone =
    tone === 'dark'
      ? 'text-[#C5B0CD]/90'
      : 'text-ink-muted dark:text-[#C5B0CD]/80';
  const numberTone =
    tone === 'dark'
      ? 'text-[#C5B0CD]'
      : 'text-[#C5B0CD] dark:text-[#C5B0CD]';

  return (
    <div
      className={`flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.26em] ${textTone}`}
    >
      <span className={`font-display text-[13px] font-semibold tracking-normal ${numberTone}`}>
        {index}
      </span>
      <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

const PREMIUM_ICON_SIZES = {
  badge: { box: 'h-7 w-7 rounded-[0.6rem]', glyph: 'h-3.5 w-3.5' },
  xs: { box: 'h-9 w-9 rounded-[0.8rem]', glyph: 'h-4 w-4' },
  sm: { box: 'h-11 w-11 rounded-xl', glyph: 'h-[1.05rem] w-[1.05rem]' },
  md: { box: 'h-12 w-12 rounded-2xl', glyph: 'h-5 w-5' },
  lg: { box: 'h-16 w-16 rounded-[1.3rem]', glyph: 'h-7 w-7' },
};

/*
 * Tones — Pastel Medical family on glassy icon tiles.
 *  amber → "bloom" rose-pink tile      (highlights)
 *  green → "growth" mint tile          (support / success)
 *  duo   → pink × sky blend tile       (interactive features)
 *  brand → solid rose/pink logo tile
 */
const PREMIUM_ICON_TONES = {
  amber: {
    dark: 'border-[#C5B0CD]/35 bg-[linear-gradient(145deg,rgba(197, 176, 205,0.22),rgba(23, 49, 62,0.4)_55%,rgba(197, 176, 205,0.14))] shadow-[0_0_34px_-10px_rgba(181,139,131,0.35),inset_0_1px_0_rgba(255,255,255,0.22)] hover:border-[#C5B0CD]/70 hover:shadow-[0_0_42px_-8px_rgba(181,139,131,0.5),inset_0_1px_0_rgba(255,255,255,0.28)] group-hover:shadow-[0_0_40px_-8px_rgba(181,139,131,0.48),inset_0_1px_0_rgba(255,255,255,0.26)]',
    glyph: 'text-[#C5B0CD] drop-shadow-[0_0_12px_rgba(181,139,131,0.55)]',
  },
  amberLight:
    'border-[#C5B0CD]/45 bg-[linear-gradient(145deg,rgba(197, 176, 205,0.55),rgba(197, 176, 205,0.24)_55%,rgba(246, 245, 242,0.85))] shadow-[0_0_28px_-12px_rgba(181,139,131,0.8),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#C5B0CD]/65 dark:border-[#C5B0CD]/30 dark:bg-[linear-gradient(145deg,rgba(197, 176, 205,0.16),rgba(23, 49, 62,0.55)_55%,rgba(197, 176, 205,0.1))] dark:shadow-[0_0_34px_-10px_rgba(181,139,131,0.3),inset_0_1px_0_rgba(255,255,255,0.14)] dark:hover:border-[#C5B0CD]/65 group-hover:border-[#C5B0CD]/55 group-hover:shadow-[0_0_30px_-10px_rgba(181,139,131,0.85)] dark:group-hover:shadow-[0_0_38px_-8px_rgba(181,139,131,0.4)]',
  amberGlyphLight:
    'text-[#C5B0CD] dark:text-[#C5B0CD] dark:drop-shadow-[0_0_12px_rgba(181,139,131,0.5)]',
  green: {
    dark: 'border-[#C5B0CD]/35 bg-[linear-gradient(145deg,rgba(65, 94, 114,0.2),rgba(23, 49, 62,0.5)_55%,rgba(65, 94, 114,0.12))] shadow-[0_0_34px_-10px_rgba(127,205,159,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[#C5B0CD]/70 hover:shadow-[0_0_42px_-8px_rgba(127,205,159,0.45),inset_0_1px_0_rgba(255,255,255,0.26)] group-hover:shadow-[0_0_40px_-8px_rgba(127,205,159,0.42),inset_0_1px_0_rgba(255,255,255,0.24)]',
    glyph: 'text-[#C5B0CD] drop-shadow-[0_0_12px_rgba(127,205,159,0.5)]',
  },
  greenLight:
    'border-[#C5B0CD]/60 bg-[linear-gradient(145deg,rgba(246, 245, 242,0.9),rgba(246, 245, 242,0.4)_55%,rgba(246, 245, 242,0.9))] shadow-[0_0_28px_-12px_rgba(127,205,159,0.55),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#415E72] dark:border-[#C5B0CD]/30 dark:bg-[linear-gradient(145deg,rgba(65, 94, 114,0.14),rgba(23, 49, 62,0.55)_55%,rgba(65, 94, 114,0.08))] dark:shadow-[0_0_34px_-10px_rgba(127,205,159,0.28),inset_0_1px_0_rgba(255,255,255,0.13)] dark:hover:border-[#C5B0CD]/65 group-hover:border-[#415E72] group-hover:shadow-[0_0_30px_-10px_rgba(127,205,159,0.6)] dark:group-hover:shadow-[0_0_38px_-8px_rgba(127,205,159,0.35)]',
  greenGlyphLight:
    'text-[#415E72] dark:text-[#C5B0CD]',
  duo: {
    dark: 'border-[#F6F5F2]/30 bg-[linear-gradient(140deg,rgba(197, 176, 205,0.24)_0%,rgba(197, 176, 205,0.18)_52%,rgba(197, 176, 205,0.12)_100%)] shadow-[0_0_36px_-10px_rgba(181,139,131,0.32),inset_0_1px_0_rgba(255,255,255,0.24)] hover:border-[#C5B0CD]/65 hover:shadow-[0_0_44px_-8px_rgba(181,139,131,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_42px_-8px_rgba(181,139,131,0.42),inset_0_1px_0_rgba(255,255,255,0.28)]',
    glyph: 'text-[#C5B0CD] drop-shadow-[0_0_14px_rgba(181,139,131,0.5)]',
  },
  duoLight:
    'border-[#C5B0CD]/50 bg-[linear-gradient(140deg,rgba(197, 176, 205,0.45)_0%,rgba(197, 176, 205,0.6)_100%)] shadow-[0_0_28px_-12px_rgba(181,139,131,0.7),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-[#C5B0CD]/60 dark:border-[#F6F5F2]/30 dark:bg-[linear-gradient(140deg,rgba(197, 176, 205,0.2)_0%,rgba(197, 176, 205,0.14)_100%)] dark:shadow-[0_0_36px_-10px_rgba(203,174,177,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] dark:hover:border-[#C5B0CD]/65 group-hover:border-[#C5B0CD]/55 dark:group-hover:shadow-[0_0_40px_-8px_rgba(181,139,131,0.4)]',
  duoGlyphLight:
    'text-[#415E72] dark:text-[#C5B0CD]',
  brand: {
    dark: 'border-white/20 bg-[linear-gradient(150deg,rgba(197, 176, 205,0.92),rgba(197, 176, 205,0.85))] shadow-[0_0_32px_-12px_rgba(181,139,131,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:border-[#C5B0CD]/55 group-hover:-translate-y-0.5',
    glyph: 'text-[#17313E] drop-shadow-none',
  },
  brandLight:
    'border-[#415E72]/25 bg-[linear-gradient(150deg,#415E72,#C5B0CD)] shadow-[0_0_30px_-14px_rgba(32, 53, 98,0.65),inset_0_1px_0_rgba(255,255,255,0.3)] hover:border-[#415E72]/50 dark:border-white/20 dark:bg-[linear-gradient(150deg,#C5B0CD,#F6F5F2)] dark:shadow-[0_0_32px_-12px_rgba(181,139,131,0.4),inset_0_1px_0_rgba(255,255,255,0.28)] group-hover:-translate-y-0.5',
  brandGlyphLight:
    'text-white dark:text-[#17313E]',
};

function PremiumIcon({
  icon: Icon,
  tone = 'amber',
  size = 'md',
  surface = 'dark',
  className = '',
  iconClassName = '',
}) {
  const dims = PREMIUM_ICON_SIZES[size] || PREMIUM_ICON_SIZES.md;
  let boxClasses = PREMIUM_ICON_TONES.amber.dark;
  let glyphClasses = PREMIUM_ICON_TONES.amber.glyph;

  if (tone === 'amber' && surface === 'light') {
    boxClasses = PREMIUM_ICON_TONES.amberLight;
    glyphClasses = PREMIUM_ICON_TONES.amberGlyphLight;
  } else if (tone === 'green') {
    boxClasses =
      surface === 'light' ? PREMIUM_ICON_TONES.greenLight : PREMIUM_ICON_TONES.green.dark;
    glyphClasses =
      surface === 'light' ? PREMIUM_ICON_TONES.greenGlyphLight : PREMIUM_ICON_TONES.green.glyph;
  } else if (tone === 'duo') {
    boxClasses = surface === 'light' ? PREMIUM_ICON_TONES.duoLight : PREMIUM_ICON_TONES.duo.dark;
    glyphClasses =
      surface === 'light' ? PREMIUM_ICON_TONES.duoGlyphLight : PREMIUM_ICON_TONES.duo.glyph;
  } else if (tone === 'brand') {
    boxClasses =
      surface === 'light' ? PREMIUM_ICON_TONES.brandLight : PREMIUM_ICON_TONES.brand.dark;
    glyphClasses =
      surface === 'light' ? PREMIUM_ICON_TONES.brandGlyphLight : PREMIUM_ICON_TONES.brand.glyph;
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center border backdrop-blur-sm transition-all duration-300 ${dims.box} ${boxClasses} ${className}`}
    >
      <Icon
        strokeWidth={1.8}
        className={`${dims.glyph} ${glyphClasses} ${iconClassName}`}
      />
    </span>
  );
}

function InteractiveGlobe({ isAr, reduceMotion }) {
  const globeEl = useRef();
  const wrapRef = useRef();
  const [size, setSize] = useState(520);

  const lights = useMemo(() => {
    const ambient = new THREE.AmbientLight('#C5B0CD', 2.2);
    const key = new THREE.DirectionalLight('#F6F5F2', 1.7);
    key.position.set(1, 0.9, 1.1);
    const fill = new THREE.DirectionalLight('#F6F5F2', 1.1);
    fill.position.set(-1, 0.4, -0.4);
    return [ambient, key, fill];
  }, []);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setSize(Math.max(260, Math.min(Math.round(width), 600)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const globe = globeEl.current;
    if (!globe) return;
    if (typeof globe.lights === 'function') globe.lights(lights);
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = !reduceMotion;
      controls.autoRotateSpeed = 0.55;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
    }
    globe.pointOfView({ lat: 18, lng: 6, altitude: 2.15 }, 0);
  }, [size, lights, reduceMotion]);

  const ringsData = useMemo(
    () =>
      GLOBE_POINTS.map((point) => ({
        ...point,
        maxR: 3.6,
        propagationSpeed: 2.1,
        repeatPeriod: 2100,
      })),
    []
  );

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[600px]">
      <div
        className="pointer-events-none absolute inset-[2%] rounded-full bg-[radial-gradient(circle_at_50%_42%,rgba(197, 176, 205,0.28),rgba(197, 176, 205,0.4)_55%,rgba(197, 176, 205,0.55)_78%)] opacity-60 blur-2xl dark:opacity-45"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[7%] rounded-full border border-[#C5B0CD]/30 dark:border-[#C5B0CD]/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[1%] rounded-full border border-ink/[0.07] dark:border-white/[0.06]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[13%] animate-spin rounded-full border border-dashed border-[#C5B0CD]/30 dark:border-[#C5B0CD]/15 motion-reduce:animate-none [animation-duration:70s]"
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Globe
          ref={globeEl}
          width={size}
          height={size}
          backgroundColor="rgba(23, 49, 62,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereColor="#C5B0CD"
          atmosphereAltitude={0.22}
          pointsData={GLOBE_POINTS}
          pointColor={() => '#C5B0CD'}
          pointAltitude={0.045}
          pointRadius="size"
          pointResolution={12}
          pointsMerge={false}
          labelsData={GLOBE_POINTS}
          labelText="label"
          labelSize={0.42}
          labelDotRadius={0.14}
          labelColor={() => '#C5B0CD'}
          labelAltitude={0.012}
          labelResolution={2}
          ringsData={ringsData}
          ringColor={() => (t) => `rgba(197, 176, 205,${(1 - t) * 0.62})`}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          arcsData={GLOBE_ARCS}
          arcColor="color"
          arcStroke={0.32}
          arcDashLength={0.34}
          arcDashGap={0.66}
          arcDashAnimateTime={4200}
          arcsTransitionDuration={0}
        />
      </div>

      <span className="absolute bottom-0 start-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#C5B0CD]/30 bg-[#17313E]/75 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#C5B0CD]/90 backdrop-blur-md rtl:translate-x-1/2">
        {/* Caption tied to the learning cycle, not invented data. */}
        {isAr ? 'تعلّم · تدرّب · استجب' : 'Learn · Practice · Respond'}
      </span>
    </div>
  );
}

function LandingFooter() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#17313E] text-[#F6F5F2]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(197, 176, 205,0.07),transparent_45%),radial-gradient(circle_at_88%_100%,rgba(197, 176, 205,0.05),transparent_45%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-5">
          <Link to="/" className="group inline-flex items-center">
            <EduFanorWordmark className="w-36 text-[#FCFAFF] transition-transform duration-300 group-hover:scale-[1.015]" />
          </Link>

          <p className="mt-6 max-w-sm text-[13.5px] leading-relaxed text-[#F6F5F2]/80">
            {t('footer.desc')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#F6F5F2]/85">
              <span className="text-[#C5B0CD]">عربي</span>
              <span className="text-[#F6F5F2]/40">/</span>
              <span>English</span>
            </span>
            <a
              href="mailto:support@edufanor.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#F6F5F2]/85 transition-colors hover:border-[#C5B0CD]/50 hover:text-[#C5B0CD]"
              dir="ltr"
            >
              <PremiumIcon icon={Mail} tone="amber" size="badge" surface="dark" />
              support@edufanor.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5B0CD]/70">
              {isAr ? 'اكتشف' : 'Explore'}
            </p>
            <nav className="mt-4 flex flex-col gap-2.5 text-[13px] font-semibold text-[#F6F5F2]/85">
              <a href="#our-impact" className="transition-colors hover:text-[#C5B0CD]">
                {isAr ? 'أثرنا' : 'Our impact'}
              </a>
              <a href="#platform" className="transition-colors hover:text-[#C5B0CD]">
                {isAr ? 'المنصة' : 'Platform'}
              </a>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5B0CD]/70">
              {isAr ? 'المنصة' : 'Platform'}
            </p>
            <nav className="mt-4 flex flex-col gap-2.5 text-[13px] font-semibold text-[#F6F5F2]/85">
              <Link to="/about" className="transition-colors hover:text-[#C5B0CD]">
                {isAr ? 'عن المنصة' : 'About'}
              </Link>
              <Link to="/login" className="transition-colors hover:text-[#C5B0CD]">
                {isAr ? 'تسجيل الدخول' : 'Sign in'}
              </Link>
              <Link to="/register" className="transition-colors hover:text-[#C5B0CD]">
                {isAr ? 'حساب جديد' : 'Create account'}
              </Link>
            </nav>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5B0CD]/70">
              {isAr ? 'ملاحظة مسؤولة' : 'A responsible note'}
            </p>
            <p className="mt-4 text-[11.5px] leading-relaxed text-[#F6F5F2]/75">
              {t('footer.disclaimer')}
            </p>
            <a
              href="#home"
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C5B0CD] transition-colors hover:text-[#F6F5F2]"
            >
              {isAr ? 'إلى الأعلى' : 'Back to top'}
              <ArrowRight className="h-3.5 w-3.5 -rotate-90 rtl:rotate-90" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-center text-[11px] text-[#F6F5F2]/65 sm:flex-row sm:text-start sm:px-8 lg:px-12">
          <p>
            © {CURRENT_YEAR} EduFanor. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p>{t('footer.desc')}</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLandingPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { isDark, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');


  useEffect(() => {
    const sectionIds = ['home', 'our-impact', 'platform', 'our-mission', 'courses', 'about'];
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 140) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: isAr ? 'الرئيسية' : 'Home', href: '#home' },
    { label: isAr ? 'أثرنا' : 'Impact', href: '#our-impact' },
    { label: isAr ? 'المنصة' : 'Platform', href: '#platform' },
    { label: isAr ? 'رسالتنا' : 'Mission', href: '#our-mission' },
    { label: isAr ? 'عن المنصة' : 'About', href: '#about' },
  ];

  const reveal = (delay = 0, amount = 0.2) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount },
          transition: { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] },
        };

  const onHero = !scrolled || mobileMenuOpen;

  const wordmarkTone = onHero
    ? 'text-[#FCFAFF]'
    : 'text-[#34233F] dark:text-[#FCFAFF]';
  const navIdle = onHero
    ? 'text-[#F6F5F2]/85 hover:bg-white/[0.08] hover:text-[#F6F5F2]'
    : 'text-ink/75 hover:bg-ink/[0.05] hover:text-ink dark:text-[#F6F5F2]/80 dark:hover:bg-white/[0.06] dark:hover:text-[#F6F5F2]';
  const navActive = onHero
    ? 'bg-white/[0.1] text-[#F6F5F2] ring-1 ring-[#C5B0CD]/40'
    : 'bg-[#F6F5F2] text-[#17313E] ring-1 ring-[#415E72]/25 dark:bg-[#C5B0CD] dark:text-[#17313E] dark:ring-[#C5B0CD]/40';
  const controlTone = onHero
    ? 'border-white/15 bg-white/[0.06] text-[#F6F5F2] shadow-[0_0_28px_-14px_rgba(181,139,131,0.55)] ring-1 ring-white/10 hover:border-white/30 hover:bg-white/[0.12] hover:ring-[#C5B0CD]/45 hover:shadow-[0_0_32px_-12px_rgba(181,139,131,0.6)]'
    : 'border-ink/10 bg-white/70 text-ink shadow-[0_0_26px_-16px_rgba(32, 53, 98,0.7)] ring-1 ring-ink/10 hover:border-ink/25 hover:bg-white hover:ring-[#C5B0CD]/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-[#F6F5F2] dark:shadow-[0_0_30px_-14px_rgba(181,139,131,0.35)] dark:hover:bg-white/[0.1]';
  const loginTone = onHero
    ? 'text-[#F6F5F2]/85 hover:bg-white/[0.07] hover:text-[#F6F5F2]'
    : 'text-ink/75 hover:bg-ink/[0.05] hover:text-ink dark:text-[#F6F5F2]/80 dark:hover:bg-white/[0.06] dark:hover:text-[#F6F5F2]';
  const ctaTone = onHero
    ? 'bg-[#F6F5F2] text-[#17313E] shadow-[0_16px_44px_-18px_rgba(181,139,131,0.55)] hover:bg-[#F6F5F2]'
    : 'bg-primary text-white shadow-[0_16px_44px_-20px_rgba(32, 53, 98,0.55)] hover:bg-[#C5B0CD] dark:bg-[#C5B0CD] dark:text-[#17313E] dark:hover:bg-[#F6F5F2]';
  const segWrapTone = onHero
    ? 'border-white/15 bg-white/[0.06]'
    : 'border-ink/10 bg-white/60 dark:border-white/15 dark:bg-white/[0.05]';
  const segActiveTone = onHero
    ? 'bg-[#F6F5F2] text-[#17313E]'
    : 'bg-primary text-white dark:bg-[#C5B0CD] dark:text-[#17313E]';
  const segIdleTone = onHero
    ? 'text-white/70 hover:text-white'
    : 'text-ink/60 hover:text-ink dark:text-[#F6F5F2]/70 dark:hover:text-white';

  const headerTone = mobileMenuOpen
    ? 'border-b border-white/10 bg-[#17313E]/95 backdrop-blur-xl'
    : scrolled
      ? 'border-b border-ink/[0.08] bg-[#F6F5F2]/90 shadow-[0_24px_60px_-44px_rgba(32, 53, 98,0.6)] backdrop-blur-xl dark:border-white/10 dark:bg-[#17313E]/88'
      : 'border-b border-transparent bg-[linear-gradient(180deg,rgba(23, 49, 62,0.6)_0%,rgba(23, 49, 62,0.2)_62%,rgba(23, 49, 62,0)_100%)]';

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-ink transition-colors duration-500">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#F6F5F2] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[#17313E]"
      >
        {isAr ? 'انتقل إلى المحتوى' : 'Skip to content'}
      </a>

      <header className={`fixed inset-x-0 top-0 z-50 font-copy transition-all duration-500 ${headerTone}`}>
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-4 transition-all duration-500 sm:gap-4 sm:px-8 lg:px-12 ${
            scrolled && !mobileMenuOpen ? 'h-[4.25rem]' : 'h-[5rem]'
          }`}
        >
          <Link
            to="/"
            className="group flex shrink-0 items-center"
            dir="ltr"
            style={{ unicodeBidi: 'isolate' }}
          >
            <EduFanorWordmark
              className={`w-[clamp(9.5rem,48vw,11.75rem)] transition-transform duration-300 group-hover:scale-[1.015] sm:w-[12rem] xl:w-[12.5rem] ${wordmarkTone}`}
            />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navItems.map((item) => {
              const active = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'true' : undefined}
                  className={`rounded-full px-3.5 py-2.5 text-[15px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5B0CD]/50 ${
                    active ? navActive : navIdle
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <div
              className={`hidden items-center gap-0.5 rounded-full border p-1 md:flex ${segWrapTone}`}
              role="group"
              aria-label={isAr ? 'اختيار اللغة' : 'Language selector'}
            >
              <button
                type="button"
                onClick={() => i18n.changeLanguage('ar')}
                aria-pressed={isAr}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.08em] transition-colors ${
                  isAr ? segActiveTone : segIdleTone
                }`}
              >
                ع
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                aria-pressed={!isAr}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.08em] transition-colors ${
                  !isAr ? segActiveTone : segIdleTone
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isAr ? 'تبديل المظهر' : 'Toggle theme'}
              title={isAr ? 'تبديل المظهر' : 'Toggle theme'}
              className={`group flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5B0CD]/50 ${controlTone}`}
            >
              {isDark ? (
                <Sun className="h-[1.125rem] w-[1.125rem] text-[#C5B0CD] drop-shadow-[0_0_9px_rgba(181,139,131,0.6)] transition-transform duration-500 group-hover:rotate-45" />
              ) : (
                <Moon className="h-[1.125rem] w-[1.125rem] text-[#C5B0CD] transition-transform duration-500 group-hover:-rotate-12 dark:text-[#C5B0CD]" />
              )}
            </button>

            <Link
              to="/login"
              className={`hidden min-h-11 items-center rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5B0CD]/50 xl:inline-flex ${loginTone}`}
            >
              {isAr ? 'تسجيل الدخول' : 'Log in'}
            </Link>

            <Link
              to="/register"
              className={`group hidden min-h-11 items-center gap-2.5 rounded-full px-5.5 py-3 text-[15px] font-extrabold tracking-[0.02em] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5B0CD]/50 xl:inline-flex ${ctaTone}`}
            >
              {isAr ? 'إنشاء حساب' : 'Sign up'}
              {isAr ? (
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={isAr ? 'القائمة' : 'Menu'}
              aria-expanded={mobileMenuOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5B0CD]/50 xl:hidden ${controlTone}`}
            >
              {mobileMenuOpen ? <X className="h-[1.375rem] w-[1.375rem]" /> : <Menu className="h-[1.375rem] w-[1.375rem]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/10 bg-[#17313E]/97 backdrop-blur-xl lg:hidden"
            >
              <nav
                className="mx-auto flex max-w-[1440px] flex-col gap-0.5 px-5 py-5 sm:px-8"
                aria-label={isAr ? 'قائمة الجوال' : 'Mobile navigation'}
              >
                {navItems.map((item) => {
                  const active = activeSection === item.href.replace('#', '');
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? 'true' : undefined}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors ${
                        active
                          ? 'bg-white/[0.08] text-[#F6F5F2]'
                          : 'text-[#F6F5F2]/80 hover:bg-white/[0.05] hover:text-[#F6F5F2]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isAr ? (
                        <ArrowLeft className="h-4 w-4 opacity-40" />
                      ) : (
                        <ArrowRight className="h-4 w-4 opacity-40" />
                      )}
                    </a>
                  );
                })}

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F6F5F2]/70">
                    {isAr ? 'اللغة' : 'Language'}
                  </span>
                  <div
                    className="flex items-center gap-0.5 rounded-full bg-black/30 p-[3px]"
                    role="group"
                    aria-label={isAr ? 'اختيار اللغة' : 'Language selector'}
                  >
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage('ar')}
                      aria-pressed={isAr}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-colors ${
                        isAr ? 'bg-[#F6F5F2] text-[#17313E]' : 'text-[#F6F5F2]/60'
                      }`}
                    >
                      عربي
                    </button>
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage('en')}
                      aria-pressed={!isAr}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-colors ${
                        !isAr ? 'bg-[#F6F5F2] text-[#17313E]' : 'text-[#F6F5F2]/60'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-11 rounded-full border border-white/20 py-3 text-center text-sm font-semibold text-[#F6F5F2] transition-colors hover:bg-white/[0.08]"
                  >
                    {isAr ? 'تسجيل الدخول' : 'Log in'}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-11 rounded-full bg-[#F6F5F2] py-3 text-center text-sm font-extrabold text-[#17313E] transition-colors hover:bg-[#F6F5F2]"
                  >
                    {isAr ? 'إنشاء حساب' : 'Sign up'}
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero — full-bleed photographic background. */}
        <section
          id="home"
          className="relative isolate flex min-h-[calc(100svh_-_5rem)] items-center overflow-hidden bg-[#17313E] px-5 py-16 text-white transition-colors duration-500 sm:px-8 lg:px-12 xl:min-h-[110svh] 2xl:min-h-[120svh]"
        >
          {/* Full-bleed photographic plate */}
          <div
            className="absolute inset-0 -z-30 bg-cover bg-[position:75%_40%] bg-no-repeat bg-[url('/heroa.jpg')] sm:bg-[position:62%_40%] lg:bg-[center_40%]"
            aria-hidden="true"
          />

          {/* Midnight-to-plum color grading — layered cinematic overlays */}
          <div
            className={`absolute inset-0 -z-20 ${isAr ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#17313E]/78 via-[#17313E]/42 to-transparent`}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-20 bg-[#415E72]/8 mix-blend-multiply" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 -z-10 shadow-[inset_0_0_80px_20px_rgba(24,59,86,0.05)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-[#F6F5F2]/40 to-transparent dark:from-[#17313E]/40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(rgba(197, 176, 205,0.6) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-24 -start-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,#91C8E4_0%,transparent_70%)] opacity-25 blur-2xl" />
            <div className="absolute bottom-[-6rem] -end-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,#4682A9_0%,transparent_70%)] opacity-20 blur-3xl" />
            <div className="absolute top-[12%] start-[4%] h-20 w-20 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(197, 176, 205,0.8) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
            <span className="absolute top-[32%] end-[20%] h-1.5 w-1.5 rounded-full bg-[#C5B0CD] shadow-[0_0_12px_3px_rgba(145,200,228,0.6)]" />
            <span className="absolute bottom-[36%] start-[24%] h-1 w-1 rounded-full bg-white/70 shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]" />
            <span className="absolute top-[56%] end-[32%] h-1.5 w-1.5 rounded-full bg-[#415E72] shadow-[0_0_12px_3px_rgba(92,166,209,0.6)]" />
            <div className="absolute top-0 start-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl"
            >
              <div
                className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(ellipse_at_30%_45%,rgba(23, 49, 62,0.12),rgba(23, 49, 62,0.08)_48%,transparent_78%)] blur-2xl"
                aria-hidden="true"
              />
              <motion.h1
                className={`[text-shadow:0_24px_66px_rgba(32,53,98,0.15),0_4px_18px_rgba(32,53,98,0.12)] ${
                  isAr
                    ? 'font-arabic text-[clamp(2.35rem,6.5vw,5rem)] font-extrabold leading-[1.2] tracking-normal'
                    : 'font-editorial text-[clamp(1.7rem,7.5vw,5.75rem)] font-normal leading-[1.02] tracking-[-0.035em]'
                }`}
              >
                {isAr ? (
                  <>
                    <span className="block text-white">معرفة صغيرة.</span>
                    <span className="mt-[0.12em] block text-[#C5B0CD] drop-shadow-[0_4px_18px_rgba(24,59,86,0.4)]">
                      وثقة تُحدث فرقًا.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-white">A little knowledge.</span>
                    <span className="mt-[0.12em] block text-[#C5B0CD] italic drop-shadow-[0_4px_18px_rgba(24,59,86,0.4)]">
                      The confidence to act.
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.p
                className={`mt-6 max-w-[37rem] text-balance text-[clamp(0.98rem,1.3vw,1.1rem)] text-white/90 [text-shadow:0_2px_22px_rgba(32,53,98,0.15)] ${
                  isAr ? 'font-arabic leading-[2.05]' : 'font-copy leading-[1.8] tracking-[0.01em]'
                }`}
              >
                {isAr
                  ? 'تعلّم الخطوات الأساسية بوضوح، وتدرّب على الاستجابة بهدوء وثقة.'
                  : 'Learn the essentials clearly, practice calmly, and respond with confidence.'}
              </motion.p>

              <motion.div
                className="relative mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <motion.svg
                  viewBox="0 0 320 56"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                  className={`pointer-events-none absolute z-10 -top-6 h-6 w-28 sm:-top-7 sm:h-7 sm:w-44 xl:top-1/2 xl:-translate-y-1/2 xl:h-12 ${
                    isAr
                      ? 'right-0 xl:right-[calc(36rem_-_50vw)] xl:w-[calc(50vw_-_36rem_-_0.75rem)]'
                      : 'left-0 xl:left-[calc(36rem_-_50vw_+_0.3125rem)] xl:w-[calc(50vw_-_36rem_-_0.75rem)]'
                  }`}
                >
                  <motion.path
                    d="M0 28H84C94 28 101 27 107 17C114 5 119 4 124 22L131 43C134 54 140 54 144 42L156 12C161 0 166 0 171 13C176 26 180 28 190 28H320"
                    stroke="#C5B0CD"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0.65 }}
                    animate={{ pathLength: 1, opacity: 0.9 }}
                    transition={{ duration: 1.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.svg>
                <Link
                  to="/register"
                  className={`group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[13px] font-bold tracking-[0.015em] text-[#17313E] shadow-[0_24px_60px_-22px_rgba(181,139,131,0.5),inset_0_1px_0_rgba(255,255,255,0.55)] ring-1 ring-[#C5B0CD]/50 transition-all duration-300 hover:-translate-y-1 hover:bg-[#C5B0CD] hover:shadow-[0_30px_70px_-22px_rgba(181,139,131,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5B0CD]/70 sm:w-auto ${
                    isAr ? 'font-arabic' : 'font-copy'
                  }`}
                >
                  {isAr ? 'ابدأ التعلّم الآن' : 'Start learning now'}
                  {isAr ? (
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </Link>
                <a
                  href="#our-impact"
                  className={`group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border border-[#C5B0CD]/40 bg-white/15 px-6 py-3.5 text-[13px] font-semibold tracking-[0.015em] text-white shadow-[0_0_44px_-18px_rgba(181,139,131,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-auto ${
                    isAr ? 'font-arabic' : 'font-copy'
                  }`}
                >
                  {isAr ? 'اكتشف أثرنا' : 'Explore our impact'}
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Impact — the real rotating 3D globe, tied to honest outcomes. */}
        <section
          id="our-impact"
          className="relative overflow-hidden bg-surface py-20 transition-colors duration-500 md:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_18%,rgba(197, 176, 205,0.16),transparent_52%),radial-gradient(circle_at_4%_90%,rgba(246, 245, 242,0.4),transparent_46%)] dark:bg-[radial-gradient(circle_at_86%_18%,rgba(197, 176, 205,0.08),transparent_52%),radial-gradient(circle_at_4%_90%,rgba(65, 94, 114,0.05),transparent_46%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <div className="lg:col-span-6">
              <motion.div {...reveal(0)}>
                <SectionLabel index="01">{isAr ? 'أثرنا' : 'Our impact'}</SectionLabel>
              </motion.div>
              <motion.h2
                {...reveal(0.06)}
                className={`mt-6 max-w-2xl font-display font-bold tracking-[-0.025em] text-ink ${
                  isAr
                    ? 'text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.25]'
                    : 'text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02]'
                }`}
              >
                {isAr ? (
                  <>
                    الطوارئ قد تحدث في كل مكان،
                    <br />
                    <span className="text-ink">ومعارفك تُحدث فرقًا.</span>
                  </>
                ) : (
                  <>
                    Emergencies happen everywhere.
                    <br />
                    <span className="italic text-ink">Your knowledge can make a difference.</span>
                  </>
                )}
              </motion.h2>
              <motion.p
                {...reveal(0.12)}
                className={`mt-6 max-w-2xl text-[15px] text-ink-muted dark:text-[#F6F5F2]/85 ${
                  isAr ? 'font-arabic leading-[2]' : 'leading-[1.85] tracking-[0.005em]'
                }`}
              >
                {isAr
                  ? 'قد تساعد المعرفة بالإسعافات الأولية على التصرف بثقة أكبر في حالات الطوارئ. تجعل EduFanor التعلّم الأساسي متاحاً عبر دروس واضحة وتجارب تفاعلية، لمساعدة الناس على فهم كيفية تقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                  : 'First-aid knowledge can help people respond more confidently in an emergency. EduFanor makes essential learning accessible through clear lessons and interactive experiences, helping people provide appropriate initial assistance while waiting for emergency responders.'}
              </motion.p>

              <div className="mt-8 h-px w-full bg-ink/[0.08] dark:bg-white/10" />
            </div>

            <motion.div {...reveal(0.1)} className="lg:col-span-6">
              <InteractiveGlobe isAr={isAr} reduceMotion={reduceMotion} />
            </motion.div>
          </div>
        </section>

        {/* The Platform — premium editorial cards */}
        <section
          id="platform"
          className="relative overflow-hidden bg-[#F6F5F2] py-20 transition-colors duration-500 dark:bg-[#17313E] md:py-28 lg:py-32"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(rgba(65, 94, 114,0.18) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-24 start-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(197, 176, 205,0.35),transparent_70%)] blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 end-[8%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(65, 94, 114,0.2),transparent_70%)] blur-3xl"
            aria-hidden="true"
          />
          <svg
            className="pointer-events-none absolute bottom-[18%] start-[6%] h-16 w-48 opacity-30"
            viewBox="0 0 200 60"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 30 L35 30 L50 12 L65 48 L80 22 L95 32 L115 32 L135 14 L155 46 L175 30 L200 30"
              stroke="#C5B0CD"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div {...reveal(0)} className="max-w-3xl">
              <SectionLabel index="02">{isAr ? 'المنصة' : 'The platform'}</SectionLabel>
              <h2
                className={`mt-6 font-display font-bold tracking-[-0.02em] text-[#17313E] dark:text-white ${
                  isAr
                    ? 'text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.25]'
                    : 'text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05]'
                }`}
              >
                {isAr ? 'معًا نحو مجتمع أكثر وعيًا واستعدادًا.' : 'Together toward a more aware, prepared community.'}
              </h2>
              <p
                className={`mt-5 max-w-2xl text-[15px] text-[#415E72] dark:text-[#C5B0CD]/80 ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                }`}
              >
                {isAr
                  ? 'EduFanor منصة تعليمية رقمية تهدف إلى نشر الوعي بالإسعافات الأولية، وتزويد المتعلمين بالمعرفة والخطوات الأساسية للتصرف بثقة ومساعدة الآخرين في حالات الطوارئ إلى حين وصول فرق الإسعاف والإنقاذ.'
                  : 'EduFanor is a digital learning platform that spreads first-aid awareness and equips learners with essential knowledge and steps to act confidently and help others in emergencies until professional responders arrive.'}
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 lg:grid-cols-12">
              <motion.article
                {...reveal(0.08)}
                className="group relative overflow-hidden rounded-3xl border border-[#C5B0CD]/30 bg-[#C5B0CD] p-8 shadow-[0_30px_80px_-40px_rgba(24,59,86,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_40px_90px_-40px_rgba(24,59,86,0.35)] lg:col-span-7"
              >
                <div className="pointer-events-none absolute -end-12 -top-12 h-40 w-40 rounded-full bg-[#415E72]/10 blur-2xl" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#415E72]">
                  {isAr ? 'المنصة' : 'The platform'}
                </p>
                <h3
                  className={`mt-4 font-display font-bold text-[#17313E] ${
                    isAr ? 'text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.3]' : 'text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.1]'
                  }`}
                >
                  {isAr ? 'تعلّم بوضوح. تدرّب بثقة. استجب بمسؤولية.' : 'Learn clearly. Practice confidently. Respond responsibly.'}
                </h3>
                <p
                  className={`mt-4 max-w-2xl text-[15px] text-[#17313E]/80 ${
                    isAr ? 'font-arabic leading-[1.9]' : 'leading-[1.75]'
                  }`}
                >
                  {isAr
                    ? 'تجربة تعلّم نظيفة ومنظمة، تركّز على الفهم، والخطوات، والثقة، دون تشتيت.'
                    : 'A clean, structured learning experience focused on understanding, steps, and confidence without distraction.'}
                </p>
              </motion.article>

              <div className="flex flex-col gap-6 lg:col-span-5">
                <motion.article
                  {...reveal(0.12)}
                  className="group relative overflow-hidden rounded-3xl border border-[#C5B0CD] bg-[#C5B0CD] p-7 shadow-[0_24px_60px_-40px_rgba(24,59,86,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-40px_rgba(24,59,86,0.3)]"
                >
                  <div className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 rounded-full bg-[#C5B0CD]/30 blur-2xl" />
                  <h3
                    className={`font-display font-bold text-[#17313E] ${
                      isAr ? 'text-xl leading-[1.4]' : 'text-2xl leading-[1.1]'
                    }`}
                  >
                    {isAr ? 'تعلّم بخطوات واضحة' : 'Learn in clear steps'}
                  </h3>
                  <p
                    className={`mt-3 text-[14px] text-[#415E72] ${
                      isAr ? 'font-arabic leading-[1.85]' : 'leading-[1.7]'
                    }`}
                  >
                    {isAr
                      ? 'اكتشف دروسًا تعليمية منظمة تساعدك على فهم أساسيات الإسعافات الأولية والتعامل مع المواقف الطارئة بطريقة واضحة وتدريجية.'
                      : 'Discover structured lessons that help you understand first-aid basics and handle emergency situations clearly and progressively.'}
                  </p>
                </motion.article>

                <motion.article
                  {...reveal(0.16)}
                  className="group relative overflow-hidden rounded-3xl border border-[#415E72] bg-[#415E72] p-7 text-white shadow-[0_24px_60px_-40px_rgba(24,59,86,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-40px_rgba(24,59,86,0.45)]"
                >
                  <div className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                  <h3
                    className={`font-display font-bold text-white ${
                      isAr ? 'text-xl leading-[1.4]' : 'text-2xl leading-[1.1]'
                    }`}
                  >
                    {isAr ? 'اختبر معرفتك وطوّر مهاراتك' : 'Test your knowledge and grow'}
                  </h3>
                  <p
                    className={`mt-3 text-[14px] text-white/85 ${
                      isAr ? 'font-arabic leading-[1.85]' : 'leading-[1.7]'
                    }`}
                  >
                    {isAr
                      ? 'عزّز ما تعلمته من خلال الاختبارات التفاعلية، وتابع تقدمك التعليمي واكتشف مدى تطور معرفتك.'
                      : 'Strengthen what you learn through interactive quizzes, track your progress, and see how your knowledge evolves.'}
                  </p>
                </motion.article>
              </div>
            </div>
          </div>
        </section>
        {/* Mission — immersive midnight editorial moment with pastel glows. */}
        <section
          id="our-mission"
          className="relative overflow-hidden bg-[#17313E] py-24 text-[#F6F5F2] transition-colors duration-500 md:py-32"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(197, 176, 205,0.1),transparent_44%),radial-gradient(circle_at_84%_86%,rgba(197, 176, 205,0.07),transparent_46%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(rgba(246, 245, 242, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <div className="lg:col-span-7">
              <motion.div {...reveal(0)}>
                <SectionLabel index="03" tone="dark">
                  {isAr ? 'رسالتنا' : 'Our mission'}
                </SectionLabel>
              </motion.div>

              <motion.h2
                {...reveal(0.06)}
                className={`mt-7 max-w-3xl font-display font-semibold tracking-[-0.02em] text-[#F6F5F2] ${
                  isAr
                    ? 'font-arabic text-[clamp(2rem,5vw,4.1rem)] leading-[1.32]'
                    : 'text-[clamp(1.85rem,5.2vw,4.4rem)] leading-[1.04]'
                }`}
              >
                {isAr ? (
                  <>
                    الدقائق الأولى
                    <br />
                    ليست للأبطال.
                    <br />
                    بل لأشخاص
                    <br />
                    <span className="text-[#C5B0CD]">تعلّموا ماذا يفعلون.</span>
                  </>
                ) : (
                  <>
                    The first minutes
                    <br />
                    are not for heroes.
                    <br />
                    They are for people
                    <br />
                    <span className="italic text-[#C5B0CD]">who learned what to do.</span>
                  </>
                )}
              </motion.h2>

              <motion.p
                {...reveal(0.12)}
                className={`mt-7 max-w-2xl text-[14.5px] text-[#F6F5F2]/85 ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                }`}
              >
                {isAr
                  ? 'نسعى في EduFanor إلى جعل المعرفة الأساسية بالإسعافات الأولية متاحة للجميع. من خلال دروس واضحة وتعلّم تفاعلي وإرشاد مسؤول، نساعد الناس على اكتساب المعرفة والثقة لتقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                  : 'Our mission is to make first-aid knowledge accessible to everyone. Through clear lessons, interactive learning, and responsible guidance, we help people build the confidence to provide appropriate initial assistance while waiting for emergency responders.'}
              </motion.p>

            </div>

            <motion.div
              {...reveal(0.14)}
              className="group relative flex justify-center lg:col-span-5"
            >
              <div className="relative w-full max-w-[520px] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#17313E] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
                <div
                  className="pointer-events-none absolute -end-10 -top-12 z-10 h-40 w-40 rounded-full bg-[#F6F5F2]/20 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src="/cpr.jpg"
                    alt={
                      isAr
                        ? 'شخص يمارس خطوات الإسعافات الأولية اليدوية'
                        : 'A learner practicing hands-on first aid'
                    }
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(23, 49, 62,0.78)_100%)]"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-4 start-4 z-10 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#17313E]/70 py-1.5 pe-4 ps-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#C5B0CD] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
                    <PremiumIcon icon={HeartPulse} tone="amber" size="badge" surface="dark" />
                    {isAr ? 'وضوح · ثقة · استعداد' : 'Clarity · Confidence · Readiness'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About / Hero10 integration */}
        <Hero10 id="about" isAr={isAr} />

        {/* Final CTA — midnight ink with pastel glow. */}
        <section className="relative overflow-hidden bg-[#17313E] px-5 py-20 text-[#F6F5F2] transition-colors duration-500 sm:px-8 md:py-28 lg:px-12">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_22%,rgba(197, 176, 205,0.14),transparent_52%),radial-gradient(circle_at_10%_90%,rgba(197, 176, 205,0.08),transparent_46%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-12 start-0 select-none font-display text-[26vw] font-semibold leading-none text-white/[0.03]"
            aria-hidden="true"
          >
            EduFanor
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.div {...reveal(0)} className="flex items-center gap-3">
                <PremiumIcon icon={Footprints} tone="amber" size="badge" surface="dark" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#C5B0CD]">
                  {isAr ? 'ابدأ بخطوة واحدة' : 'Start with one step'}
                </p>
              </motion.div>
              <motion.h2
                {...reveal(0.06)}
                className={`mt-5 max-w-2xl font-display font-semibold tracking-[-0.02em] ${
                  isAr
                    ? 'font-arabic text-[clamp(1.95rem,4.6vw,3.6rem)] leading-[1.32]'
                    : 'text-[clamp(1.9rem,4.8vw,3.8rem)] leading-[1.04]'
                }`}
              >
                {isAr ? (
                  <>
                    درس واحد اليوم.
                    <br />
                    <span className="text-[#C5B0CD]">واستجابة أهدأ غدًا.</span>
                  </>
                ) : (
                  <>
                    One lesson today.
                    <br />
                    <span className="italic text-[#C5B0CD]">A calmer response tomorrow.</span>
                  </>
                )}
              </motion.h2>
            </div>
            <motion.div {...reveal(0.14)} className="shrink-0">
              <Link
                to="/register"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#F6F5F2] px-7 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-[#17313E] shadow-[0_26px_66px_-26px_rgba(181,139,131,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] ring-1 ring-[#C5B0CD]/60 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F6F5F2] hover:ring-[#C5B0CD]/90"
              >
                {isAr ? 'ابدأ التعلّم الآن' : 'Start learning now'}
                {isAr ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
