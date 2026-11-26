import React, { useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Mail,
  Menu,
  X,
} from '../components/icons';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Hero10 } from '../components/Hero10';
import EduFanorWordmark from '../components/EduFanorWordmark';
import ThemeToggle from '../components/ui/ThemeToggle';
import LandingAuthActions from '../components/LandingAuthActions';
import {
  landingDashboardLabel,
  landingDashboardPath,
  landingProfileLabel,
} from '../lib/authNavigation';

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
    color: '#BFA2DB',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 51.5074,
    endLng: -0.1278,
    color: '#F3F1F5',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 25.2048,
    endLng: 55.2708,
    color: '#F3F1F5',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 35.6762,
    endLng: 139.6503,
    color: '#BFA2DB',
  },
];

function SectionLabel({ index, children, tone = 'light', isAr = false }) {
  const textTone =
    tone === 'dark'
      ? 'text-lavender'
      : 'text-ink-soft dark:text-lavender';

  return (
    <div
      className={`flex items-center gap-3 font-extrabold uppercase tracking-[0.18em] ${textTone}`}
    >
      <span className={`font-arabic-display font-bold ${isAr ? 'text-lavender' : 'text-ink-soft dark:text-lavender'}`}>
        {index}
      </span>
      <span className="h-px w-8 bg-current" aria-hidden="true" />
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
 *  lavender → "bloom" lilac tile         (highlights)
 *  mint     → "growth" mint tile         (support / success)
 *  duo      → lilac × lavender blend     (interactive features)
 *  brand    → solid lilac logo tile
 */
const PREMIUM_ICON_TONES = {
  lavender: {
    dark: 'border-primary/35 bg-[linear-gradient(145deg,#BFA2DB,#18122B_55%,#BFA2DB)] shadow-pop hover:border-primary/70 hover:shadow-pop group-hover:shadow-pop',
    glyph: 'text-lavender drop-shadow-[0_4px_18px_var(--color-primary)]',
  },
  lavenderLight:
    'border-primary/45 bg-[linear-gradient(145deg,#BFA2DB,#BFA2DB_55%,#F3F1F5)] shadow-pop hover:border-primary/65 dark:border-primary/30 dark:bg-[linear-gradient(145deg,#BFA2DB,#18122B_55%,#BFA2DB)] dark:shadow-pop dark:hover:border-primary/65 group-hover:border-primary/55 group-hover:shadow-pop dark:group-hover:shadow-pop',
  lavenderGlyphLight:
    'text-lavender dark:text-lavender dark:drop-shadow-[0_4px_18px_var(--color-primary)]',
  green: {
    dark: 'border-primary/35 bg-[linear-gradient(145deg,#635985,#18122B_55%,#635985)] shadow-pop hover:border-primary/70 hover:shadow-pop group-hover:shadow-pop',
    glyph: 'text-lavender drop-shadow-[0_4px_18px_var(--color-primary)]',
  },
  greenLight:
    'border-primary/60 bg-[linear-gradient(145deg,#F3F1F5,#F3F1F5_55%,#F3F1F5)] shadow-pop hover:border-primary dark:border-primary/30 dark:bg-[linear-gradient(145deg,#635985,#18122B_55%,#635985)] dark:shadow-pop dark:hover:border-primary/65 group-hover:border-primary group-hover:shadow-pop dark:group-hover:shadow-pop',
  greenGlyphLight:
    'text-ink-soft dark:text-lavender',
  duo: {
    dark: 'border-on-dark/30 bg-[linear-gradient(140deg,#BFA2DB_0%,#BFA2DB_52%,#BFA2DB_100%)] shadow-pop hover:border-primary/65 hover:shadow-pop group-hover:shadow-pop',
    glyph: 'text-lavender drop-shadow-[0_4px_18px_var(--color-primary)]',
  },
  duoLight:
    'border-primary/50 bg-[linear-gradient(140deg,#BFA2DB_0%,#BFA2DB_100%)] shadow-pop hover:border-primary/60 dark:border-on-dark/30 dark:bg-[linear-gradient(140deg,#BFA2DB_0%,#BFA2DB_100%)] dark:shadow-pop dark:hover:border-primary/65 group-hover:border-primary/55 dark:group-hover:shadow-pop',
  duoGlyphLight:
    'text-ink-soft dark:text-lavender',
  brand: {
    dark: 'border-on-dark/20 bg-primary shadow-pop hover:border-primary/55 group-hover:-translate-y-0.5',
    glyph: 'text-on-primary drop-shadow-none',
  },
  brandLight:
    'border-primary/25 bg-gradient-to-br from-primary to-lavender shadow-pop hover:border-primary/50 dark:border-on-dark/20 dark:bg-gradient-to-br dark:from-primary dark:to-scrim dark:shadow-pop group-hover:-translate-y-0.5',
  brandGlyphLight:
    'text-on-primary dark:text-on-dark',
};

function PremiumIcon({
  icon: Icon,
  tone = 'lavender',
  size = 'md',
  surface = 'dark',
  className = '',
  iconClassName = '',
}) {
  const dims = PREMIUM_ICON_SIZES[size] || PREMIUM_ICON_SIZES.md;
  let boxClasses = PREMIUM_ICON_TONES.lavender.dark;
  let glyphClasses = PREMIUM_ICON_TONES.lavender.glyph;

  if (tone === 'lavender' && surface === 'light') {
    boxClasses = PREMIUM_ICON_TONES.lavenderLight;
    glyphClasses = PREMIUM_ICON_TONES.lavenderGlyphLight;
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

function InteractiveGlobe({ isDark, reduceMotion }) {
  const globeEl = useRef();
  const wrapRef = useRef();
  const [size, setSize] = useState(520);
  const [domDark, setDomDark] = useState(() => {
    if (typeof document === 'undefined') return Boolean(isDark);
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const root = document.documentElement;
    const syncTheme = () => setDomDark(root.classList.contains('dark'));
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  const resolvedDark = typeof document !== 'undefined' ? domDark : Boolean(isDark);

  const palette = useMemo(
    () =>
      resolvedDark
        ? {
            glow: '#BFA3DC',
            innerRing: 'rgba(240,217,255,0.36)',
            outerRing: 'rgba(191,162,219,0.34)',
            dashRing: 'rgba(240,217,255,0.46)',
            atmosphere: '#BFA3DC',
            ambient: '#D8C8EE',
            ambientIntensity: 1.25,
            key: '#FFFFFF',
            keyIntensity: 1.35,
            fill: '#F0D9FF',
            fillIntensity: 0.7,
            point: '#FFFFFF',
            arcPrimary: '#F0D9FF',
            arcSecondary: '#FFFFFF',
            ringRgb: '240,217,255',
            globeImage: '//unpkg.com/three-globe/example/img/earth-day.jpg',
            tint: '#8C78B8',
            emissive: '#2B2048',
            emissiveIntensity: 0.2,
            shininess: 0.28,
          }
        : {
            glow: '#DFD1F0',
            innerRing: 'rgba(68,60,104,0.3)',
            outerRing: 'rgba(99,89,133,0.34)',
            dashRing: 'rgba(68,60,104,0.45)',
            atmosphere: '#BFA2DB',
            ambient: '#F3F1F5',
            ambientIntensity: 1.15,
            key: '#FFFFFF',
            keyIntensity: 1.05,
            fill: '#BFA2DB',
            fillIntensity: 0.55,
            point: '#635985',
            arcPrimary: '#635985',
            arcSecondary: '#443C68',
            ringRgb: '99,89,133',
            globeImage: '//unpkg.com/three-globe/example/img/earth-day.jpg',
            tint: '#C8B9DC',
            emissive: '#393053',
            emissiveIntensity: 0.12,
            shininess: 0.3,
          },
    [resolvedDark]
  );

  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: new THREE.Color(palette.tint),
        emissive: new THREE.Color(palette.emissive),
        emissiveIntensity: palette.emissiveIntensity,
        shininess: palette.shininess,
      }),
    [palette.emissive, palette.emissiveIntensity, palette.shininess, palette.tint]
  );

  const lights = useMemo(() => {
    const ambient = new THREE.AmbientLight(palette.ambient, palette.ambientIntensity);
    const key = new THREE.DirectionalLight(palette.key, palette.keyIntensity);
    key.position.set(1, 0.9, 1.1);
    const fill = new THREE.DirectionalLight(palette.fill, palette.fillIntensity);
    fill.position.set(-1, 0.4, -0.4);
    return [ambient, key, fill];
  }, [palette]);

  const rendererConfig = useMemo(() => ({ alpha: true, antialias: true, preserveDrawingBuffer: true }), []);

  const setupGlobe = useCallback(() => {
    const globe = globeEl.current;
    if (!globe) return;
    if (typeof globe.lights === 'function') globe.lights(lights);
    if (typeof globe.globeMaterial === 'function') globe.globeMaterial(globeMaterial);
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
  }, [globeMaterial, lights, reduceMotion]);

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
    setupGlobe();
  }, [setupGlobe, size]);

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

  const arcsData = useMemo(
    () =>
      GLOBE_ARCS.map((arc, index) => ({
        ...arc,
        color: index % 2 === 0 ? palette.arcPrimary : palette.arcSecondary,
      })),
    [palette]
  );

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[600px]">
      <div
        className="pointer-events-none absolute inset-[2%] rounded-full opacity-60 blur-2xl dark:opacity-45"
        style={{ background: `radial-gradient(circle at 50% 42%, ${palette.glow}, ${palette.glow} 55%, ${palette.glow} 78%)` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[7%] rounded-full border"
        style={{ borderColor: palette.innerRing }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[1%] rounded-full border"
        style={{ borderColor: palette.outerRing }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[13%] animate-spin rounded-full border border-dashed motion-reduce:animate-none [animation-duration:70s]"
        style={{ borderColor: palette.dashRing }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Globe
          key={resolvedDark ? 'impact-globe-dark' : 'impact-globe-light'}
          ref={globeEl}
          width={size}
          height={size}
          backgroundColor="rgba(0,0,0,0)"
          rendererConfig={rendererConfig}
          onGlobeReady={setupGlobe}
          globeImageUrl={palette.globeImage}
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={palette.atmosphere}
          atmosphereAltitude={0.2}
          pointsData={GLOBE_POINTS}
          pointColor={() => palette.point}
          pointAltitude={0.045}
          pointRadius="size"
          pointResolution={12}
          pointsMerge={false}
          labelsData={GLOBE_POINTS}
          labelText="label"
          labelSize={0.42}
          labelDotRadius={0.14}
          labelColor={() => palette.point}
          labelAltitude={0.012}
          labelResolution={2}
          ringsData={ringsData}
          ringColor={() => (t) => `rgba(${palette.ringRgb},${(1 - t) * 0.72})`}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          arcsData={arcsData}
          arcColor="color"
          arcStroke={0.32}
          arcDashLength={0.34}
          arcDashGap={0.66}
          arcDashAnimateTime={4200}
          arcsTransitionDuration={0}
        />
      </div>
    </div>
  );
}

function LandingFooter() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';
  const dashboardPath = landingDashboardPath(user?.role);
  const dashboardLabel = landingDashboardLabel(user?.role, isAr);
  const profileLabel = landingProfileLabel(isAr);

  return (
    <footer className="relative overflow-hidden border-t border-[#BFA2DB]/60 bg-[#F3F1F5] text-[#18122B] dark:border-[#635985] dark:bg-[#18122B] dark:text-[#F3F1F5]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(191,162,219,0.28),transparent_45%),radial-gradient(circle_at_88%_100%,rgba(191,162,219,0.2),transparent_45%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-5">
          <Link to="/" className="group inline-flex items-center">
            <EduFanorWordmark className="w-36 text-[#18122B] transition-transform duration-300 group-hover:scale-[1.015] dark:text-[#F3F1F5]" />
          </Link>

          <p className="mt-6 max-w-sm text-[13.5px] leading-relaxed text-[#443C68] dark:text-[#BFA2DB]">
            {t('footer.desc')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#BFA2DB]/60 bg-[#F0D9FF] px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#18122B] dark:border-[#635985] dark:bg-[#393053] dark:text-[#F3F1F5]">
              <span className="text-[#443C68] dark:text-[#F0D9FF]">عربي</span>
              <span className="text-[#7F7C82] dark:text-[#635985]">/</span>
              <span>English</span>
            </span>
            <a
              href="mailto:support@edufanor.com"
              className="inline-flex items-center gap-2 rounded-full border border-[#BFA2DB]/60 bg-[#F0D9FF] px-3 py-1.5 text-[11px] font-semibold text-[#18122B] transition-colors hover:border-[#443C68] hover:text-[#443C68] dark:border-[#635985] dark:bg-[#393053] dark:text-[#F3F1F5] dark:hover:border-[#F0D9FF] dark:hover:text-[#F0D9FF]"
              dir="ltr"
            >
              <PremiumIcon icon={Mail} tone="amber" size="badge" surface="dark" />
              support@edufanor.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          <div>
              <p className={`text-base font-bold tracking-normal text-[#18122B] dark:text-[#F0D9FF] ${isAr ? 'text-lg' : 'text-[13px]'}`}>
                {isAr ? 'اكتشف' : 'Explore'}
            </p>
            <nav className={`mt-3 flex flex-col gap-2.5 font-semibold text-[#443C68] dark:text-[#F3F1F5] ${isAr ? 'text-lg' : 'text-[13px]'}`}>
              <a href="#our-impact" className="transition-colors hover:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
                {isAr ? 'أثرنا' : 'Our impact'}
              </a>
              <a href="#platform" className="transition-colors hover:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
                {isAr ? 'المنصة' : 'Platform'}
              </a>
            </nav>
          </div>

          <div>
            <p className={`text-base font-bold tracking-normal text-[#18122B] dark:text-[#F0D9FF] ${isAr ? 'text-lg' : 'text-[13px]'}`}>
              {isAr ? 'المنصة' : 'Platform'}
            </p>
            <nav className={`mt-3 flex flex-col gap-2.5 font-semibold text-[#443C68] dark:text-[#F3F1F5] ${isAr ? 'text-lg' : 'text-[13px]'}`}>
              <Link to="/about" className="transition-colors hover:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
                {isAr ? 'عن المنصة' : 'About'}
              </Link>
              {user ? (
                <>
                  <Link to={dashboardPath} className="transition-colors hover:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
                    {dashboardLabel}
                  </Link>
                  <Link to="/profile" className="transition-colors hover:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
                    {profileLabel}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="transition-colors hover:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
                    {isAr ? 'تسجيل الدخول' : 'Sign in'}
                  </Link>
                  <Link to="/register" className="transition-colors hover:text-[#BFA2DB] dark:hover:text-[#F0D9FF]">
                    {isAr ? 'حساب جديد' : 'Create account'}
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className={`text-base font-bold tracking-normal text-[#18122B] dark:text-[#F0D9FF] ${isAr ? 'text-lg' : 'text-[13px]'}`}>
              {isAr ? 'ملاحظة مسؤولة' : 'A responsible note'}
            </p>
            <p className={`mt-3 text-[#443C68] dark:text-[#BFA2DB] ${isAr ? 'text-sm leading-[1.9]' : 'text-[11.5px] leading-relaxed'}`}>
              {t('footer.disclaimer')}
            </p>
            <a
              href="#home"
              className={`mt-4 inline-flex items-center gap-2 ${isAr ? 'font-arabic-display text-sm uppercase tracking-[0.18em]' : 'font-extrabold uppercase tracking-[0.18em] text-[11px] text-[#443C68] transition-colors hover:text-[#18122B] dark:text-[#F0D9FF] dark:hover:text-[#F3F1F5]'}`}
            >
              {isAr ? 'إلى الأعلى' : 'Back to top'}
              <ArrowRight className="h-3.5 w-3.5 -rotate-90 rtl:rotate-90" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[#BFA2DB]/60 dark:border-[#635985]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-center text-[11px] text-[#443C68] dark:text-[#BFA2DB] sm:flex-row sm:text-start sm:px-8 lg:px-12">
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
  const { user } = useContext(AuthContext);
  const reduceMotion = useReducedMotion();
  const dashboardPath = landingDashboardPath(user?.role);
  const dashboardLabel = landingDashboardLabel(user?.role, isAr);

  const missionRef = useRef(null);
  const { scrollYProgress: missionProgress } = useScroll({
    target: missionRef,
    offset: ['start end', 'end start'],
  });
  const missionImageY = useTransform(missionProgress, [0, 1], [26, -26]);
  const missionImageParallax = useSpring(missionImageY, {
    stiffness: 90,
    damping: 22,
    mass: 0.45,
  });

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

  const missionEnter = (order) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.72, delay: order * 0.08, ease: [0.16, 1, 0.3, 1] },
        };

  const onHero = !scrolled || mobileMenuOpen;

  const wordmarkTone = onHero
    ? 'text-[#18122B]'
    : 'text-ink dark:text-on-dark';
  const navIdle = onHero
    ? 'text-[#18122B]/85 hover:bg-[#BFA2DB]/20 hover:text-[#18122B]'
    : 'text-ink/75 hover:bg-ink/[0.05] hover:text-ink dark:text-on-dark/80 dark:hover:bg-surface/[0.06] dark:hover:text-on-dark';
  const navActive = onHero
    ? 'bg-[#635985] text-[#F3F1F5] ring-1 ring-[#BFA2DB]/50'
    : 'bg-on-dark text-ink ring-1 ring-primary/25 dark:bg-primary dark:text-on-primary dark:ring-primary/40';
  const controlTone = onHero
    ? 'border-[#7F7C82]/25 bg-[#F3F1F5]/70 text-[#18122B] ring-1 ring-[#BFA2DB]/40 hover:border-[#635985]/50 hover:bg-[#F0D9FF]'
    : 'border-ink/10 bg-surface/70 text-ink shadow-pop ring-1 ring-ink/10 hover:border-ink/25 hover:bg-surface hover:ring-primary/40 dark:border-on-dark/15 dark:bg-surface/[0.05] dark:text-on-dark dark:shadow-pop dark:hover:bg-surface/[0.1]';
  const loginTone = onHero
    ? 'text-[#18122B]/85 hover:bg-[#BFA2DB]/20 hover:text-[#18122B]'
    : 'text-ink/75 hover:bg-ink/[0.05] hover:text-ink dark:text-on-dark/80 dark:hover:bg-surface/[0.06] dark:hover:text-on-dark';
  const ctaTone = onHero
    ? 'bg-[#F0D9FF] text-[#18122B] hover:bg-white'
    : 'bg-primary text-on-primary shadow-pop hover:bg-primary-hover dark:bg-primary dark:text-on-primary dark:hover:bg-primary-hover';
  const segWrapTone = onHero
    ? 'border-[#7F7C82]/25 bg-[#F3F1F5]/70'
    : 'border-ink/10 bg-surface/60 dark:border-on-dark/15 dark:bg-surface/[0.05]';
  const segActiveTone = onHero
    ? 'bg-[#635985] text-[#F3F1F5]'
    : 'bg-primary text-on-primary dark:bg-primary dark:text-on-primary';
  const segIdleTone = onHero
    ? 'text-[#18122B]/60 hover:text-[#18122B]'
    : 'text-ink/60 hover:text-ink dark:text-on-dark/70 dark:hover:text-on-dark';

  const headerTone = mobileMenuOpen
    ? 'border-b border-[#7F7C82]/20 bg-[#F3F1F5]/85 text-[#18122B] backdrop-blur-md'
    : scrolled
      ? 'border-b border-ink/[0.08] bg-on-dark/90 shadow-pop backdrop-blur-xl dark:border-on-dark/10 dark:bg-scrim/88'
      : 'border-b border-[#7F7C82]/20 bg-[#F3F1F5]/85 text-[#18122B] backdrop-blur-md';

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-ink transition-colors duration-500">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-on-dark focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-ink"
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
                  className={`rounded-full px-3.5 py-2.5 text-[15px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
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

            <ThemeToggle
              checked={isDark}
              onChange={toggleTheme}
              className="scale-[0.72] origin-center"
              ariaLabel="Toggle dark mode"
            />

            <LandingAuthActions isAr={isAr} loginTone={loginTone} ctaTone={ctaTone} />

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={isAr ? 'القائمة' : 'Menu'}
              aria-expanded={mobileMenuOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 xl:hidden ${controlTone}`}
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
              className="overflow-hidden border-t border-[#7F7C82]/20 bg-[#F3F1F5]/95 backdrop-blur-md lg:hidden"
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
                          ? 'bg-[#635985] text-[#F3F1F5]'
                          : 'text-[#18122B]/80 hover:bg-[#BFA2DB]/20 hover:text-[#18122B]'
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

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#7F7C82]/20 bg-[#F3F1F5]/70 px-4 py-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#18122B]/70">
                    {isAr ? 'اللغة' : 'Language'}
                  </span>
                  <div
                      className="flex items-center gap-0.5 rounded-full bg-[#F3F1F5]/70 p-[3px]"
                    role="group"
                    aria-label={isAr ? 'اختيار اللغة' : 'Language selector'}
                  >
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage('ar')}
                      aria-pressed={isAr}
                        className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-colors ${
                          isAr ? 'bg-[#635985] text-[#F3F1F5]' : 'text-[#18122B]/60'
                        }`}
                    >
                      عربي
                    </button>
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage('en')}
                      aria-pressed={!isAr}
                        className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-colors ${
                          !isAr ? 'bg-[#635985] text-[#F3F1F5]' : 'text-[#18122B]/60'
                        }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <LandingAuthActions
                  isAr={isAr}
                  loginTone={loginTone}
                  ctaTone={ctaTone}
                  variant="mobile"
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero — full-bleed photographic background. */}
        <section
          id="home"
          className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-[url('/heroa.jpg')] bg-cover bg-center/80 px-6 text-left sm:px-10 lg:px-14"
        >
          {/* Full-bleed photographic plate */}
          <div
            className="absolute inset-0 -z-30 bg-cover bg-[position:75%_40%] bg-no-repeat bg-[url('/heroa.jpg')] sm:bg-[position:62%_40%] lg:bg-[center_40%]"
            aria-hidden="true"
          />

          {/* Subtle left-side atmospheric gradient behind text area only */}
          <div
            className="absolute inset-0 -z-20 bg-gradient-to-r from-[#18122B]/45 via-[#18122B]/15 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-on-dark/40 to-transparent dark:from-scrim/40"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-7xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-w-2xl flex-col text-left"
              dir="ltr"
            >
              <motion.h1
                style={!isAr ? { fontFamily: "'Viga', sans-serif" } : undefined}
                className={`text-white drop-shadow-sm ${
                  isAr
                    ? 'font-arabic text-5xl font-extrabold leading-[1.12] tracking-normal sm:text-6xl lg:text-[4.25rem]'
                    : 'text-5xl leading-[1.12] tracking-normal sm:text-6xl lg:text-[4.25rem]'
                }`}
              >
                {isAr ? (
                  <>
                    <span className="block whitespace-nowrap">معرفة صغيرة.</span>
                    <span className="mt-[0.12em] block whitespace-nowrap text-[#BFA2DB] drop-shadow-[0_4px_18px_var(--color-primary)]">
                      وثقة تُحدث فرقًا.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block whitespace-nowrap text-white">A little knowledge.</span>
                    <span className="mt-[0.12em] block whitespace-nowrap text-[#F0D9FF] [text-shadow:0_2px_14px_rgba(240,217,255,0.35),0_4px_18px_rgba(24,18,43,0.35)]">The confidence to act.</span>
                  </>
                )}
              </motion.h1>

              <motion.p
                className={`mt-5 max-w-lg text-lg leading-relaxed text-white/95 sm:text-xl ${
                  isAr ? 'font-arabic' : 'font-copy'
                }`}
              >
                {isAr
                  ? 'تعلّم الخطوات الأساسية بوضوح، وتدرّب على الاستجابة بهدوء وثقة.'
                  : 'Learn the essentials clearly, practice calmly, and respond with confidence.'}
              </motion.p>

              <motion.div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={user ? dashboardPath : '/register'}
                  className={`group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#18122B] shadow-lg transition-all hover:bg-[#F0D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                    isAr ? 'font-arabic' : 'font-copy'
                  }`}
                >
                  {user
                    ? isAr
                      ? 'العودة إلى لوحة التحكم'
                      : 'Back to dashboard'
                    : isAr
                      ? 'ابدأ التعلّم الآن'
                      : 'Start learning now'}
                  {isAr ? (
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </Link>
                <a
                  href="#our-impact"
                  className={`group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/50 bg-[#18122B]/35 px-7 py-3.5 text-base font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark/60 ${
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
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_18%,#BFA2DB,transparent_52%),radial-gradient(circle_at_4%_90%,#F3F1F5,transparent_46%)] dark:bg-[radial-gradient(circle_at_86%_18%,#BFA2DB,transparent_52%),radial-gradient(circle_at_4%_90%,#635985,transparent_46%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <div className="lg:col-span-6">
              <motion.div {...reveal(0)}>
                <SectionLabel index="01">{isAr ? 'أثرنا' : 'Our impact'}</SectionLabel>
              </motion.div>
              <motion.h2
                {...reveal(0.06)}
                className={`mt-6 max-w-2xl font-display font-bold tracking-[-0.025em] text-ink dark:text-on-dark ${
                  isAr
                    ? 'text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.25]'
                    : 'text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02]'
                }`}
              >
                {isAr ? (
                  <>
                    الطوارئ قد تحدث في كل مكان،
                    <br />
                    <span className="text-ink dark:text-on-dark">ومعارفك تُحدث فرقًا.</span>
                  </>
                ) : (
                  <>
                    Emergencies happen everywhere.
                    <br />
                    <span className="font-semibold text-ink dark:text-on-dark">Your knowledge can make a difference.</span>
                  </>
                )}
              </motion.h2>
              <motion.p
                {...reveal(0.12)}
                className={`mt-6 max-w-2xl text-[15px] text-ink-soft dark:text-on-dark/85 ${
                  isAr ? 'font-arabic leading-[2]' : 'leading-[1.85] tracking-[0.005em]'
                }`}
              >
                {isAr
                  ? 'قد تساعد المعرفة بالإسعافات الأولية على التصرف بثقة أكبر في حالات الطوارئ. تجعل EduFanor التعلّم الأساسي متاحاً عبر دروس واضحة وتجارب تفاعلية، لمساعدة الناس على فهم كيفية تقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                  : 'First-aid knowledge can help people respond more confidently in an emergency. EduFanor makes essential learning accessible through clear lessons and interactive experiences, helping people provide appropriate initial assistance while waiting for emergency responders.'}
              </motion.p>

              <div className="mt-8 h-px w-full bg-ink/[0.08] dark:bg-surface/10" />
            </div>

            <motion.div {...reveal(0.1)} className="lg:col-span-6">
              <InteractiveGlobe isDark={isDark} reduceMotion={reduceMotion} />
            </motion.div>
          </div>
        </section>

        {/* The Platform — premium editorial cards */}
        <section
          id="platform"
          className="relative overflow-hidden bg-on-dark py-20 transition-colors duration-500 dark:bg-scrim md:py-28 lg:py-32"
        >
          <div
            className="pointer-events-none absolute -top-24 start-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,#BFA2DB,transparent_70%)] blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 end-[8%] h-80 w-80 rounded-full bg-[radial-gradient(circle,#635985,transparent_70%)] blur-3xl"
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
              stroke="#BFA2DB"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div {...reveal(0)} className="max-w-3xl">
              <SectionLabel index="02">{isAr ? 'المنصة' : 'The platform'}</SectionLabel>
              <h2
                className={`mt-6 font-display font-bold tracking-[-0.02em] text-ink dark:text-on-dark ${
                  isAr
                    ? 'text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.25]'
                    : 'text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05]'
                }`}
              >
                {isAr ? 'معًا نحو مجتمع أكثر وعيًا واستعدادًا.' : 'Together toward a more aware, prepared community.'}
              </h2>
              <p
                className={`mt-5 max-w-2xl text-[15px] text-ink-soft dark:text-lavender/80 ${
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
                className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-primary p-8 shadow-pop transition-all duration-300 hover:-translate-y-1 hover:shadow-pop lg:col-span-7"
              >
                <div className="pointer-events-none absolute -end-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-on-primary/80">
                  {isAr ? 'المنصة' : 'The platform'}
                </p>
                <h3
                  className={`mt-4 font-display font-bold text-on-primary ${
                    isAr ? 'text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.3]' : 'text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.1]'
                  }`}
                >
                  {isAr ? 'تعلّم بوضوح. تدرّب بثقة. استجب بمسؤولية.' : 'Learn clearly. Practice confidently. Respond responsibly.'}
                </h3>
                <p
                  className={`mt-4 max-w-2xl text-[15px] text-on-primary/80 ${
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
                  className="group relative overflow-hidden rounded-3xl border border-primary bg-primary p-7 shadow-pop transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
                >
                  <div className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 rounded-full bg-primary-hover/30 blur-2xl" />
                  <h3
                    className={`font-display font-bold text-on-primary ${
                      isAr ? 'text-xl leading-[1.4]' : 'text-2xl leading-[1.1]'
                    }`}
                  >
                    {isAr ? 'تعلّم بخطوات واضحة' : 'Learn in clear steps'}
                  </h3>
                  <p
                    className={`mt-3 text-[14px] text-on-primary/80 ${
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
                  className="group relative overflow-hidden rounded-3xl border border-primary bg-primary p-7 text-on-primary shadow-pop transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
                >
                  <div className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 rounded-full bg-surface/10 blur-2xl" />
                  <h3
                    className={`font-display font-bold text-on-primary ${
                      isAr ? 'text-xl leading-[1.4]' : 'text-2xl leading-[1.1]'
                    }`}
                  >
                    {isAr ? 'اختبر معرفتك وطوّر مهاراتك' : 'Test your knowledge and grow'}
                  </h3>
                  <p
                    className={`mt-3 text-[14px] text-on-primary/85 ${
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
        {/* Mission — refined dark-plum editorial feature. */}
        <section
          ref={missionRef}
          id="our-mission"
          className="relative isolate overflow-hidden bg-[#49305D] py-20 text-[#FCFAFF] transition-colors duration-500 md:py-24 lg:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(118deg,#49305D_0%,#3D2852_52%,#49305D_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(100deg,rgba(61,40,82,0.25)_0%,transparent_42%,rgba(138,107,190,0.20)_100%)]"
            aria-hidden="true"
          />
          <motion.svg
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full text-[#8A6BBE] opacity-[0.08] sm:opacity-[0.13]"
            style={{
              maskImage: 'linear-gradient(125deg, #000 0%, rgba(0,0,0,0.50) 38%, rgba(0,0,0,0.12) 72%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(125deg, #000 0%, rgba(0,0,0,0.50) 38%, rgba(0,0,0,0.12) 72%, transparent 100%)',
            }}
            animate={reduceMotion ? undefined : { x: [0, -24, 0], y: [0, -14, 0] }}
            transition={reduceMotion ? undefined : { duration: 38, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          >
            <defs>
              <pattern id="mission-hexagons" width="112" height="96" patternUnits="userSpaceOnUse">
                <path d="M28 0H84L112 48L84 96H28L0 48Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M-28 0H28L56 48L28 96H-28L-56 48Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
                <path d="M84 0H140L168 48L140 96H84L56 48Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
              </pattern>
            </defs>
            <rect x="-120" y="-80" width="1440" height="960" fill="url(#mission-hexagons)" />
          </motion.svg>
          <motion.div
            className="pointer-events-none absolute -end-24 top-[10%] -z-10 h-[22rem] w-[22rem] rounded-full bg-[#8A6BBE]/15 blur-[120px] sm:h-[32rem] sm:w-[32rem]"
            animate={reduceMotion ? undefined : { x: [0, 26, 0], y: [0, -18, 0], opacity: [0.1, 0.18, 0.1] }}
            transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#3D2852]/70 to-transparent"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid w-full max-w-none grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:w-[92%] lg:max-w-[1800px] lg:grid-cols-[minmax(0,48fr)_minmax(0,45fr)] lg:gap-[5%] lg:px-0 2xl:w-[90%]">
            <div className="min-w-0">
              <motion.div {...missionEnter(0)} className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E9E0F5]/25 text-[11px] font-extrabold tracking-[0.08em] text-[#E9B9C8]">
                  03
                </span>
                <span className="h-px w-14 bg-gradient-to-r from-[#8A6BBE] to-transparent" aria-hidden="true" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#E9E0F5]/70">
                  {isAr ? 'رسالتنا' : 'Our mission'}
                </span>
              </motion.div>

              <h2
                className={`mt-7 max-w-2xl font-copy font-bold tracking-[-0.035em] text-[#FCFAFF] ${
                  isAr
                    ? 'text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.3]'
                    : 'text-[clamp(2.1rem,4.8vw,3.6rem)] leading-[1.08]'
                }`}
              >
                {isAr ? (
                  <>
                    <motion.span {...missionEnter(1)} className="block">الدقائق الأولى</motion.span>
                    <motion.span {...missionEnter(2)} className="block font-arabic italic text-[#E9E0F5]">
                      مهمة.
                    </motion.span>
                    <motion.span {...missionEnter(3)} className="mt-5 block sm:mt-6">كن مستعدًا لإحداث</motion.span>
                    <motion.span {...missionEnter(4)} className="block text-[#E9E0F5]">فرق.</motion.span>
                  </>
                ) : (
                  <>
                    <motion.span {...missionEnter(1)} className="block">The first minutes</motion.span>
                    <motion.span {...missionEnter(2)} className="block italic text-[#E9E0F5]">matter.</motion.span>
                    <motion.span {...missionEnter(3)} className="mt-5 block sm:mt-6">Be ready to</motion.span>
                    <motion.span {...missionEnter(4)} className="block text-[#E9E0F5]">make a difference.</motion.span>
                  </>
                )}
              </h2>

              <motion.p
                {...missionEnter(5)}
                className={`mt-6 max-w-[36rem] text-[15px] text-[#E9E0F5]/80 md:text-base ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.85]'
                }`}
              >
                {isAr
                  ? 'نسعى في EduFanor إلى جعل المعرفة الأساسية بالإسعافات الأولية متاحة للجميع. من خلال دروس واضحة وتعلّم تفاعلي وإرشاد مسؤول، نساعد الناس على اكتساب المعرفة والثقة لتقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                  : 'Our mission is to make first-aid knowledge accessible to everyone. Through clear lessons, interactive learning, and responsible guidance, we help people build the confidence to provide appropriate initial assistance while waiting for emergency responders.'}
              </motion.p>
            </div>

            <motion.figure
              {...missionEnter(4)}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              className="group relative isolate min-w-0 lg:mt-6"
            >
              <motion.div style={{ y: reduceMotion ? 0 : missionImageParallax }} className="relative">
                <div
                  className="absolute -inset-5 -z-20 rounded-[3rem] bg-[#8A6BBE]/10 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-[#FCFAFF]/15 bg-[#3D2852] shadow-[0_32px_80px_-32px_rgba(18,10,30,0.8)] transition-shadow duration-700 group-hover:shadow-[0_40px_92px_-30px_rgba(18,10,30,0.88)]">
                  <div className="relative aspect-[9/10] w-full overflow-hidden sm:aspect-[20/21]">
                    <motion.img
                      src="/cpr.jpg"
                      alt={
                        isAr
                          ? 'شخص يمارس خطوات الإسعافات الأولية اليدوية'
                          : 'A learner practicing hands-on first aid'
                      }
                      loading="lazy"
                      initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(8% 0 0 0)' }}
                      animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
                      transition={{ duration: 0.95, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-cover object-[center_45%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(233,224,245,0.06)_0%,transparent_38%,rgba(18,10,30,0.18)_100%)]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.figure>
          </div>
        </section>

        {/* About / Hero10 integration */}
        <Hero10 id="about" isAr={isAr} />

        {/* Final CTA — midnight ink with pastel glow. */}
        <section className="relative overflow-hidden bg-[#F3F1F5] px-5 py-20 text-[#18122B] transition-colors duration-500 sm:px-8 md:py-28 lg:px-12 dark:bg-[#18122B] dark:text-[#F3F1F5]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_22%,rgba(191,162,219,0.3),transparent_52%),radial-gradient(circle_at_10%_90%,rgba(191,162,219,0.2),transparent_46%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -bottom-12 start-0 w-full" aria-hidden="true">
            <svg
              viewBox="0 0 1000 175"
              className="w-full h-auto select-none pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <text
                x="500"
                y="145"
                textAnchor="middle"
                textLength="990"
                lengthAdjust="spacingAndGlyphs"
                fontSize="170"
                fill="currentColor"
                className="font-display font-semibold text-[#BFA2DB]/[0.35] dark:text-[#635985]/50"
              >
                EduFanor
              </text>
            </svg>
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.h2
                {...reveal(0.06)}
                className={`mt-5 max-w-2xl font-display font-semibold tracking-[-0.02em] text-[#18122B] dark:text-[#F3F1F5] ${
                  isAr
                    ? 'font-arabic text-[clamp(1.95rem,4.6vw,3.6rem)] leading-[1.32]'
                    : 'text-[clamp(1.9rem,4.8vw,3.8rem)] leading-[1.04]'
                }`}
              >
                {isAr ? (
                  <>
                    درس واحد اليوم.
                    <br />
                    <span className="text-[#443C68] dark:text-[#F0D9FF]">واستجابة أهدأ غدًا.</span>
                  </>
                ) : (
                  <>
                    One lesson today.
                    <br />
                    <span className="italic text-[#443C68] dark:text-[#F0D9FF]">A calmer response tomorrow.</span>
                  </>
                )}
              </motion.h2>
            </div>
            <motion.div {...reveal(0.14)} className="shrink-0">
              <Link
                to={user ? dashboardPath : '/register'}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#F0D9FF] px-7 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-[#18122B] shadow-[0_26px_66px_-26px_rgba(99,89,133,0.5),inset_0_1px_0_rgba(243,241,245,0.5)] ring-1 ring-[#BFA2DB] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F0D9FF] hover:ring-[#443C68] dark:bg-[#F0D9FF] dark:text-[#18122B] dark:ring-[#635985] dark:hover:ring-[#F0D9FF]"
              >
                {user ? dashboardLabel : isAr ? 'ابدأ التعلّم الآن' : 'Start learning now'}
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
