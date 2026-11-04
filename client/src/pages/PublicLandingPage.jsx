import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  HeartPulse,
  Languages,
  Mail,
  Menu,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
    color: '#8FB09A',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 51.5074,
    endLng: -0.1278,
    color: '#CFEFD8',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 25.2048,
    endLng: 55.2708,
    color: '#8FB09A',
  },
  {
    startLat: 33.5731,
    startLng: -7.5898,
    endLat: 35.6762,
    endLng: 139.6503,
    color: '#9FE9C2',
  },
];

function SectionLabel({ index, children, tone = 'light' }) {
  const textTone =
    tone === 'dark'
      ? 'text-[#FAF8F2]/45'
      : 'text-[#5F6E68] dark:text-[#A8B6AB]';
  const numberTone =
    tone === 'dark'
      ? 'text-[#F59E42]'
      : 'text-[#B45309] dark:text-[#F59E42]';

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

function InteractiveGlobe({ isAr, reduceMotion }) {
  const globeEl = useRef();
  const wrapRef = useRef();
  const [size, setSize] = useState(520);

  const lights = useMemo(() => {
    const ambient = new THREE.AmbientLight('#dcffe9', 2.5);
    const key = new THREE.DirectionalLight('#ffffff', 1.7);
    key.position.set(1, 0.9, 1.1);
    const fill = new THREE.DirectionalLight('#9fe9c2', 1.0);
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
        className="pointer-events-none absolute inset-[2%] rounded-full bg-[radial-gradient(circle_at_50%_42%,rgba(120,155,131,0.24),rgba(10,36,27,0.72)_55%,rgba(5,19,14,0.96)_78%)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[7%] rounded-full border border-[#8FB09A]/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[1%] rounded-full border border-white/[0.06]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[13%] animate-spin rounded-full border border-dashed border-[#8FB09A]/15 motion-reduce:animate-none [animation-duration:70s]"
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Globe
          ref={globeEl}
          width={size}
          height={size}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereColor="#9FE9C2"
          atmosphereAltitude={0.22}
          pointsData={GLOBE_POINTS}
          pointColor={() => '#A9C6B0'}
          pointAltitude={0.045}
          pointRadius="size"
          pointResolution={12}
          pointsMerge={false}
          labelsData={GLOBE_POINTS}
          labelText="label"
          labelSize={0.42}
          labelDotRadius={0.14}
          labelColor={() => '#E4F9EA'}
          labelAltitude={0.012}
          labelResolution={2}
          ringsData={ringsData}
          ringColor={() => (t) => `rgba(120,155,131,${(1 - t) * 0.62})`}
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

      <span className="absolute bottom-0 start-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#8FB09A]/25 bg-[#17231F]/75 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#E8EFE7]/80 backdrop-blur-md rtl:translate-x-1/2">
        {/* Caption tied to the learning cycle, not invented data. */}
        {isAr ? 'تعلّم · تدرّب · استجب' : 'Learn · Practice · Respond'}
      </span>
    </div>
  );
}

function OrbitVisual({ isAr }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden="true">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(120,155,131,0.2),transparent_66%)] blur-2xl" />
      <div className="absolute inset-[2%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[11%] rounded-full border border-[#8FB09A]/15" />
      <div className="absolute inset-[20%] animate-spin rounded-full border border-dashed border-white/15 motion-reduce:animate-none [animation-duration:58s]">
        <span className="absolute start-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E42] shadow-[0_0_22px_7px_rgba(245,158,66,0.45)] rtl:translate-x-1/2" />
      </div>
      <div className="absolute inset-[31%] rounded-full border border-[#8FB09A]/25" />
      <div className="absolute inset-[14%] animate-spin rounded-full border border-transparent motion-reduce:animate-none [animation-direction:reverse] [animation-duration:44s]">
        <span className="absolute bottom-0 start-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#C2541E] shadow-[0_0_18px_5px_rgba(194,84,30,0.4)] rtl:translate-x-1/2" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-[#8FB09A]/30 bg-[#1D2B25]/80 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md sm:h-36 sm:w-36">
          <HeartPulse className="h-7 w-7 text-[#F59E42] drop-shadow-[0_0_10px_rgba(245,158,66,0.55)]" />
          <p className="mt-2 max-w-[7rem] text-[9px] font-extrabold uppercase leading-relaxed tracking-[0.2em] text-[#FAF8F2]/65">
            {isAr ? 'درس واحد' : 'One lesson'}
            <br />
            {isAr ? 'استجابة أهدأ' : 'A calmer response'}
          </p>
        </div>
      </div>

      <span className="absolute left-1/2 top-[6%] -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.28em] text-[#F59E42]/55">
        {isAr ? 'تعلّم' : 'Learn'}
      </span>
      <span className="absolute bottom-[13%] start-[6%] text-[9px] font-bold uppercase tracking-[0.28em] text-[#FAF8F2]/35">
        {isAr ? 'استعد' : 'Prepare'}
      </span>
      <span className="absolute bottom-[13%] end-[6%] text-[9px] font-bold uppercase tracking-[0.28em] text-[#FAF8F2]/35">
        {isAr ? 'استجب' : 'Respond'}
      </span>
    </div>
  );
}

function LandingFooter() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#17231F] text-[#FAF8F2]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(120,155,131,0.12),transparent_45%),radial-gradient(circle_at_88%_100%,rgba(230,154,85,0.08),transparent_45%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-5">
          <Link to="/" className="group inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-white/15 bg-white/[0.06] shadow-[0_0_30px_-10px_rgba(245,158,66,0.6)] transition-transform duration-500 group-hover:-translate-y-0.5">
              <ShieldCheck className="h-5 w-5 text-[#F59E42]" strokeWidth={2.1} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-tight text-[#FAF8F2]">
                EduFanor
              </span>
              <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-[#FAF8F2]/40">
                {isAr ? 'تعلّم · استعد · استجب' : 'Learn · Prepare · Respond'}
              </span>
            </span>
          </Link>

          <p className="mt-6 max-w-sm text-[13.5px] leading-relaxed text-[#FAF8F2]/55">
            {t('footer.desc')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#FAF8F2]/55">
              <span className="text-[#F59E42]">عربي</span>
              <span className="text-[#FAF8F2]/20">/</span>
              <span>English</span>
            </span>
            <a
              href="mailto:support@edufanor.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-[#FAF8F2]/70 transition-colors hover:border-[#F59E42]/40 hover:text-[#F59E42]"
              dir="ltr"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E42]/10 text-[#FDBA74] ring-1 ring-[#F59E42]/35">
                <Mail className="h-3 w-3" />
              </span>
              support@edufanor.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FAF8F2]/35">
              {isAr ? 'اكتشف' : 'Explore'}
            </p>
            <nav className="mt-4 flex flex-col gap-2.5 text-[13px] font-semibold text-[#FAF8F2]/75">
              <a href="#our-impact" className="transition-colors hover:text-[#F59E42]">
                {isAr ? 'أثرنا' : 'Our impact'}
              </a>
              <a href="#why-choose-us" className="transition-colors hover:text-[#F59E42]">
                {isAr ? 'لماذا إدوفانور' : 'Why EduFanor'}
              </a>
              <a href="#courses" className="transition-colors hover:text-[#F59E42]">
                {isAr ? 'المسارات' : 'Learning path'}
              </a>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FAF8F2]/35">
              {isAr ? 'المنصة' : 'Platform'}
            </p>
            <nav className="mt-4 flex flex-col gap-2.5 text-[13px] font-semibold text-[#FAF8F2]/75">
              <Link to="/about" className="transition-colors hover:text-[#F59E42]">
                {isAr ? 'عن المنصة' : 'About'}
              </Link>
              <Link to="/login" className="transition-colors hover:text-[#F59E42]">
                {isAr ? 'تسجيل الدخول' : 'Sign in'}
              </Link>
              <Link to="/register" className="transition-colors hover:text-[#F59E42]">
                {isAr ? 'حساب جديد' : 'Create account'}
              </Link>
            </nav>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FAF8F2]/35">
              {isAr ? 'ملاحظة مسؤولة' : 'A responsible note'}
            </p>
            <p className="mt-4 text-[11.5px] leading-relaxed text-[#FAF8F2]/45">
              {t('footer.disclaimer')}
            </p>
            <a
              href="#home"
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F59E42]/80 transition-colors hover:text-[#F59E42]"
            >
              {isAr ? 'إلى الأعلى' : 'Back to top'}
              <ArrowRight className="h-3.5 w-3.5 -rotate-90 rtl:rotate-90" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-center text-[11px] text-[#FAF8F2]/35 sm:flex-row sm:text-start sm:px-8 lg:px-12">
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
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { isDark, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.12]);

  const courses = t('coursesData', { returnObjects: true });
  const courseList = Array.isArray(courses) ? courses : [];

  useEffect(() => {
    const sectionIds = ['home', 'our-impact', 'why-choose-us', 'our-mission', 'courses', 'about'];
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
    { label: isAr ? 'لماذا إدوفانور' : 'Why EduFanor', href: '#why-choose-us' },
    { label: isAr ? 'رسالتنا' : 'Mission', href: '#our-mission' },
    { label: isAr ? 'المسارات' : 'Learning path', href: '#courses' },
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

  const heroLine = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
        };

  const onHero = !scrolled || mobileMenuOpen;

  const wordmarkTone = onHero ? 'text-[#FAF8F2]' : 'text-[#26332F] dark:text-[#FAF8F2]';
  const subwordTone = onHero ? 'text-[#FAF8F2]/45' : 'text-[#5F6E68] dark:text-[#A8B6AB]';
  const navIdle = onHero
    ? 'text-[#FAF8F2]/70 hover:bg-white/[0.08] hover:text-[#FAF8F2]'
    : 'text-[#5F6E68] hover:bg-[#26332F]/[0.05] hover:text-[#26332F] dark:text-[#C3D1C6] dark:hover:bg-white/[0.06] dark:hover:text-[#FAF8F2]';
  const navActive = onHero
    ? 'bg-white/[0.09] text-[#F59E42]'
    : 'bg-[#26332F]/[0.06] text-[#26332F] dark:bg-white/[0.07] dark:text-[#F59E42]';
  const controlTone = onHero
    ? 'border-white/15 bg-white/[0.06] text-[#FAF8F2] hover:border-white/30 hover:bg-white/[0.12]'
    : 'border-[#26332F]/15 bg-white/60 text-[#26332F] hover:border-[#26332F]/30 hover:bg-white dark:border-white/15 dark:bg-white/[0.05] dark:text-[#FAF8F2] dark:hover:bg-white/[0.1]';
  const loginTone = onHero
    ? 'text-[#FAF8F2]/85 hover:bg-white/[0.07] hover:text-[#FAF8F2]'
    : 'text-[#5F6E68] hover:bg-[#26332F]/[0.05] hover:text-[#26332F] dark:text-[#C3D1C6] dark:hover:bg-white/[0.06] dark:hover:text-white';
  const ctaTone = onHero
    ? 'bg-[#F59E42] text-[#17231F] hover:bg-[#F2C49B]'
    : 'bg-[#F59E42] text-[#17231F] hover:bg-[#F2C49B]';
  const segWrapTone = onHero
    ? 'border-white/15 bg-white/[0.06]'
    : 'border-[#26332F]/15 bg-[#26332F]/[0.04] dark:border-white/15 dark:bg-white/[0.05]';
  const segActiveTone = onHero
    ? 'bg-[#F59E42] text-[#17231F]'
    : 'bg-[#B45309] text-[#FAF8F2] dark:bg-[#F59E42] dark:text-[#17231F]';
  const segIdleTone = onHero
    ? 'text-white/60 hover:text-white'
    : 'text-[#5F6E68] hover:text-[#26332F] dark:text-[#A8B6AB] dark:hover:text-white';

  const headerTone = mobileMenuOpen
    ? 'border-b border-white/10 bg-[#17231F]/95 backdrop-blur-xl'
    : scrolled
      ? 'border-b border-[#26332F]/10 bg-[#FAF8F2]/85 shadow-[0_24px_60px_-44px_rgba(10,30,22,0.8)] backdrop-blur-xl dark:border-white/10 dark:bg-[#17231F]/88'
      : 'border-b border-transparent bg-[linear-gradient(180deg,rgba(4,13,9,0.62)_0%,rgba(4,13,9,0.18)_62%,rgba(4,13,9,0)_100%)]';

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#26332F] transition-colors duration-500 dark:bg-[#17231F] dark:text-white">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#F59E42] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[#17231F]"
      >
        {isAr ? 'انتقل إلى المحتوى' : 'Skip to content'}
      </a>

      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${headerTone}`}>
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 transition-all duration-500 sm:px-8 lg:px-12 ${
            scrolled && !mobileMenuOpen ? 'h-[4.25rem]' : 'h-[5rem]'
          }`}
        >
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-[0.85rem] border shadow-[0_0_30px_-10px_rgba(245,158,66,0.6)] transition-[transform,background-color,border-color] duration-500 group-hover:-translate-y-0.5 ${
                onHero
                  ? 'border-white/15 bg-white/[0.06]'
                  : 'border-[#26332F]/10 bg-[#24483F] dark:border-white/15 dark:bg-[#24483F]'
              }`}
            >
              <ShieldCheck className="h-5 w-5 text-[#F59E42]" strokeWidth={2.1} />
            </span>
            <span className="flex flex-col leading-none">
              <span className={`font-display text-[1.28rem] font-semibold tracking-tight ${wordmarkTone}`}>
                EduFanor
              </span>
              <span
                className={`mt-1.5 hidden text-[9px] font-bold uppercase leading-tight tracking-[0.3em] sm:block ${subwordTone}`}
              >
                {isAr ? 'تعلّم · استعد · استجب' : 'Learn · Prepare · Respond'}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navItems.map((item) => {
              const active = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'true' : undefined}
                  className={`rounded-full px-3 py-2 text-[12.5px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/50 ${
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
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-[0.08em] transition-colors ${
                  isAr ? segActiveTone : segIdleTone
                }`}
              >
                ع
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                aria-pressed={!isAr}
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-[0.08em] transition-colors ${
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
              className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/50 ${controlTone}`}
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-12" />
              )}
            </button>

            <Link
              to="/login"
              className={`hidden rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/50 lg:inline-flex ${loginTone}`}
            >
              {isAr ? 'تسجيل الدخول' : 'Log in'}
            </Link>

            <Link
              to="/register"
              className={`group hidden items-center gap-2 rounded-full px-5 py-2.5 text-[12.5px] font-extrabold tracking-[0.02em] shadow-[0_16px_40px_-22px_rgba(245,158,66,0.65)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/50 lg:inline-flex ${ctaTone}`}
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
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/50 lg:hidden ${controlTone}`}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="overflow-hidden border-t border-white/10 bg-[#17231F]/95 backdrop-blur-xl lg:hidden"
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
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-white/[0.08] text-[#F59E42]'
                          : 'text-[#FAF8F2]/75 hover:bg-white/[0.05] hover:text-[#FAF8F2]'
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
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FAF8F2]/50">
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
                      className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold transition-colors ${
                        isAr ? 'bg-[#F59E42] text-[#17231F]' : 'text-[#FAF8F2]/60'
                      }`}
                    >
                      عربي
                    </button>
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage('en')}
                      aria-pressed={!isAr}
                      className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold transition-colors ${
                        !isAr ? 'bg-[#F59E42] text-[#17231F]' : 'text-[#FAF8F2]/60'
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
                    className="rounded-full border border-white/20 py-3 text-center text-[13px] font-semibold text-[#FAF8F2] transition-colors hover:bg-white/[0.08]"
                  >
                    {isAr ? 'تسجيل الدخول' : 'Log in'}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full bg-[#F59E42] py-3 text-center text-[13px] font-extrabold text-[#17231F] transition-colors hover:bg-[#F2C49B]"
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
        {/* Hero — cinematic full-bleed image; the copy parallaxes over the scene. */}
        <section
          id="home"
          ref={heroRef}
          className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#0B2A21] px-5 pb-24 pt-36 text-[#FAF8F2] sm:px-8 lg:px-12"
        >
          {/* Parallaxed photographic plate */}
          <motion.div
            className="absolute inset-0 -z-30"
            style={{ scale: heroScale, y: heroY }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/heroa.png')]" />
          </motion.div>

          {/* Cinematic gradient overlays */}
          <div
            className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(6,17,12,0.88)_0%,rgba(6,17,12,0.52)_30%,rgba(6,17,12,0.4)_52%,rgba(6,17,12,0.86)_80%,rgba(7,23,17,0.97)_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,rgba(6,17,12,0.82)_0%,rgba(6,17,12,0.38)_46%,rgba(6,17,12,0)_72%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_16%_18%,rgba(245,158,66,0.16),transparent_55%),radial-gradient(ellipse_at_86%_88%,rgba(230,154,85,0.12),transparent_52%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[#0B2A21] via-[#0B2A21]/60 to-transparent"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-7xl">
            <motion.div style={{ y: copyY, opacity: copyOpacity }} className="max-w-4xl">
              <motion.div {...heroLine(0)} className="flex">
                <span className="inline-flex items-center gap-3 rounded-full border border-[#F59E42]/25 bg-[#17231F]/55 py-2 pe-5 ps-2.5 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#FDBA74] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md sm:text-[10px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F59E42]/15 ring-1 ring-[#F59E42]/40">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  {isAr
                    ? 'إدوفانور · أكاديمية الإسعافات الأولية الرقمية'
                    : 'EduFanor · A digital first-aid academy'}
                </span>
              </motion.div>

              <motion.h1
                {...heroLine(0.08)}
                className={`mt-8 font-display font-semibold tracking-[-0.035em] [text-shadow:0_28px_70px_rgba(4,16,11,0.8)] ${
                  isAr
                    ? 'text-[clamp(2.5rem,6.4vw,4.8rem)] leading-[1.18]'
                    : 'text-[clamp(2.9rem,7vw,5.6rem)] leading-[0.98]'
                }`}
              >
                {isAr ? (
                  <>
                    <span className="block text-[#FAF8F2]">معرفة صغيرة.</span>
                    <span className="mt-1 block bg-[linear-gradient(96deg,#FDBA74_0%,#F59E42_48%,#F2C49B_100%)] bg-clip-text text-transparent [text-shadow:none] drop-shadow-[0_6px_28px_rgba(245,158,66,0.35)]">
                      وثقة تُحدث فرقًا.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-[#FAF8F2]">A little knowledge.</span>
                    <span className="mt-1 block bg-[linear-gradient(96deg,#FDBA74_0%,#F59E42_48%,#F2C49B_100%)] bg-clip-text text-transparent [text-shadow:none] drop-shadow-[0_6px_28px_rgba(245,158,66,0.35)]">
                      The confidence to act.
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.p
                {...heroLine(0.16)}
                className={`mt-7 max-w-[36rem] text-balance text-[15px] text-[#FAF8F2]/80 sm:text-[17px] ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                }`}
              >
                {isAr
                  ? 'تعلّم الخطوات الإسعافية الأساسية عبر دروس واضحة وتجارب تفاعلية، واكتسب الاستعداد للتصرف بثقة عند وقوع الطوارئ.'
                  : 'Learn essential first-aid steps through clear lessons and interactive practice, and build the readiness to respond calmly when it matters.'}
              </motion.p>

              <motion.div
                {...heroLine(0.24)}
                className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F59E42] px-7 py-3.5 text-[13px] font-extrabold text-[#17231F] shadow-[0_22px_60px_-24px_rgba(245,158,66,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C49B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/60 sm:w-auto"
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
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-[#FAF8F2]/25 bg-[#FAF8F2]/[0.06] px-7 py-3.5 text-[13px] font-bold text-[#FAF8F2] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F59E42]/60 hover:text-[#FDBA74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/40 sm:w-auto"
                >
                  {isAr ? 'اكتشف أثرنا' : 'Explore our impact'}
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </motion.div>

              <motion.ul
                {...heroLine(0.34)}
                className="mt-12 flex max-w-3xl flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-6"
              >
                {[
                  {
                    icon: BookOpen,
                    title: isAr ? 'دروس واضحة' : 'Clear lessons',
                    text: isAr ? 'خطوات عملية مبسطة' : 'Practical, structured steps',
                  },
                  {
                    icon: Languages,
                    title: isAr ? 'عربي وإنجليزي' : 'Arabic & English',
                    text: isAr ? 'تعلّم بلغتك بسلاسة' : 'Learn in your language',
                  },
                  {
                    icon: Brain,
                    title: isAr ? 'تقدّمك محفوظ' : 'Tracked progress',
                    text: isAr ? 'تابع كل خطوة تنجزها' : 'Follow every milestone',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[#F59E42]/10 ring-1 ring-[#F59E42]/30 shadow-[0_0_28px_-8px_rgba(245,158,66,0.65)] backdrop-blur-sm">
                      <item.icon className="h-5 w-5 text-[#FDBA74]" />
                    </span>
                    <span className="text-[11.5px] leading-tight sm:text-[12.5px]">
                      <span className="block font-bold text-[#FAF8F2]">{item.title}</span>
                      <span className="block text-[#FAF8F2]/55">{item.text}</span>
                    </span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* Impact — the real rotating 3D globe, tied to honest outcomes. */}
        <section
          id="our-impact"
          className="relative overflow-hidden bg-white py-20 transition-colors duration-500 dark:bg-[#131D19] md:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_18%,rgba(245,158,66,0.08),transparent_52%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <div className="lg:col-span-6">
              <motion.div {...reveal(0)}>
                <SectionLabel index="01">{isAr ? 'أثرنا' : 'Our impact'}</SectionLabel>
              </motion.div>
              <motion.h2
                {...reveal(0.06)}
                className={`mt-6 max-w-2xl font-display font-semibold tracking-[-0.02em] text-[#26332F] dark:text-[#FAF8F2] ${
                  isAr
                    ? 'text-[clamp(1.95rem,4.2vw,3.4rem)] leading-[1.3]'
                    : 'text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.04]'
                }`}
              >
                {isAr ? (
                  <>
                    الطوارئ قد تحدث في كل مكان،
                    <br />
                    <span className="text-[#B45309] dark:text-[#F59E42]">
                      ومعرفتك قد تُحدث فرقًا.
                    </span>
                  </>
                ) : (
                  <>
                    Emergencies happen everywhere.
                    <br />
                    <span className="italic text-[#B45309] dark:text-[#F59E42]">
                      Your knowledge can make a difference.
                    </span>
                  </>
                )}
              </motion.h2>
              <motion.p
                {...reveal(0.12)}
                className={`mt-6 max-w-xl text-[14.5px] text-[#5F6E68] dark:text-[#A8B6AB] ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                }`}
              >
                {isAr
                  ? 'قد تساعد المعرفة بالإسعافات الأولية على التصرف بثقة أكبر في حالات الطوارئ. تجعل EduFanor التعلّم الأساسي متاحاً عبر دروس واضحة وتجارب تفاعلية، لمساعدة الناس على فهم كيفية تقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                  : 'First-aid knowledge can help people respond more confidently in an emergency. EduFanor makes essential learning accessible through clear lessons and interactive experiences, helping people provide appropriate initial assistance while waiting for emergency responders.'}
              </motion.p>

              <div className="mt-10 border-t border-[#26332F]/10 dark:border-white/10">
                {[
                  {
                    icon: BookOpen,
                    title: isAr ? 'تعلّم بخطوات واضحة' : 'Learn in clear steps',
                    text: isAr
                      ? 'دروس منظمة تقودك من الأساسيات إلى الاستجابة الواعية.'
                      : 'Structured lessons guide you from the basics to considered response.',
                  },
                  {
                    icon: Brain,
                    title: isAr ? 'اختبر فهمك' : 'Practice what you learn',
                    text: isAr
                      ? 'اختبارات قصيرة وتغذية راجعة فورية لتثبيت المعرفة.'
                      : 'Short quizzes and instant feedback help knowledge stick.',
                  },
                  {
                    icon: CheckCircle2,
                    title: isAr ? 'تابع تقدّمك' : 'See your progress',
                    text: isAr
                      ? 'لوحة تعلّم تعرض الدروس المكتملة والخطوة التالية.'
                      : 'Your dashboard surfaces completed lessons and your next step.',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      {...reveal(index * 0.05)}
                      className="group flex items-start gap-4 border-b border-[#26332F]/10 py-5 dark:border-white/10"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[#B45309]/[0.07] text-[#B45309] ring-1 ring-[#B45309]/20 shadow-[0_0_24px_-10px_rgba(194,84,30,0.55)] transition-all duration-300 group-hover:ring-[#F59E42]/50 group-hover:shadow-[0_0_30px_-8px_rgba(245,158,66,0.6)] dark:bg-[#F59E42]/[0.1] dark:text-[#FDBA74] dark:ring-[#F59E42]/25 dark:shadow-[0_0_28px_-10px_rgba(245,158,66,0.6)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-display text-sm font-semibold text-[#B45309] dark:text-[#F59E42]">
                            0{index + 1}
                          </span>
                          <h3
                            className={`font-display font-semibold text-[#26332F] dark:text-[#FAF8F2] ${
                              isAr ? 'text-base leading-[1.6]' : 'text-[15px]'
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <p
                          className={`mt-1.5 max-w-md text-[13px] text-[#5F6E68] dark:text-[#A8B6AB] ${
                            isAr ? 'font-arabic leading-[1.9]' : 'leading-relaxed'
                          }`}
                        >
                          {item.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div {...reveal(0.1)} className="lg:col-span-6">
              <InteractiveGlobe isAr={isAr} reduceMotion={reduceMotion} />
            </motion.div>
          </div>
        </section>

          {/* Why Choose Us — editorial grid, warm, lucid, breathing room. */}
        <section
          id="why-choose-us"
          className="relative overflow-hidden bg-white py-20 transition-colors duration-500 dark:bg-[#131D19] md:py-28 lg:py-32"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(245,158,66,0.07),transparent_50%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <motion.div {...reveal(0)}>
                  <SectionLabel index="02">{isAr ? 'لماذا إدوفانور' : 'Why EduFanor'}</SectionLabel>
                </motion.div>
                <motion.h2
                  {...reveal(0.06)}
                  className={`mt-6 font-display font-semibold tracking-[-0.02em] text-[#26332F] dark:text-[#FAF8F2] ${
                    isAr
                      ? 'text-[clamp(1.95rem,4.2vw,3.4rem)] leading-[1.3]'
                      : 'text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.04]'
                  }`}
                >
                  {isAr ? (
                    <>
                      مصممة خصيصاً
                      <br />
                      لكي تفهم، لا لكي تحفظ.
                    </>
                  ) : (
                    <>
                      Built to make sense,
                      <br />
                      <span className="italic text-[#B45309] dark:text-[#F59E42]">
                        not just to be read.
                      </span>
                    </>
                  )}
                </motion.h2>
              </div>

              <motion.p
                {...reveal(0.12)}
                className={`max-w-md text-[14.5px] text-[#5F6E68] dark:text-[#A8B6AB] ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                }`}
              >
                {isAr
                  ? 'اخترنا أن نقدم المعلومات الطارئة بطريقة هادئة، مرتبة، وثنائية اللغة، لتكون قريبة منك أينما كنت.'
                  : 'We designed every lesson to be calm, sequential, and bilingual so you can absorb it when it matters most.'}
              </motion.p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <motion.div
                {...reveal(0.16)}
                className="group relative overflow-hidden rounded-3xl border border-[#26332F]/10 bg-[#FAF8F2] p-8 transition-all duration-300 hover:border-[#F59E42]/40 dark:border-white/10 dark:bg-[#192520] lg:col-span-7 lg:p-12"
              >
                <div
                  className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-[#F59E42]/10 blur-3xl transition-transform duration-500 group-hover:scale-125"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <span className="font-display text-xs font-semibold tracking-[0.22em] text-[#B45309] dark:text-[#F59E42]">
                      01 / 03
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-[#26332F] dark:text-[#FAF8F2]">
                      {isAr ? 'ثنائية اللغة بالكامل' : 'Bilingual from the ground up'}
                    </h3>
                    <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-[#5F6E68] dark:text-[#A8B6AB]">
                      {isAr
                        ? 'تصفح المنصة باللغة العربية أو الإنجليزية بسلاسة تامة، مع مصطلحات دقيقة وموحدة.'
                        : 'Switch between Arabic and English instantly with consistent, professionally reviewed medical terminology in both languages.'}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center gap-3 pt-6 border-t border-[#26332F]/10 dark:border-white/10">
                    <span className="rounded-full bg-[#B45309]/10 px-3 py-1 text-[11px] font-bold text-[#B45309] dark:bg-[#F59E42]/15 dark:text-[#F59E42]">
                      عربي
                    </span>
                    <span className="text-[#5F6E68]/40 dark:text-white/25">/</span>
                    <span className="rounded-full bg-[#B45309]/10 px-3 py-1 text-[11px] font-bold text-[#B45309] dark:bg-[#F59E42]/15 dark:text-[#F59E42]">
                      English
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...reveal(0.22)}
                className="group relative overflow-hidden rounded-3xl border border-[#26332F]/10 bg-[#FAF8F2] p-8 transition-all duration-300 hover:border-[#F59E42]/40 dark:border-white/10 dark:bg-[#192520] lg:col-span-5 lg:p-10"
              >
                <div
                  className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-[#F59E42]/10 blur-3xl transition-transform duration-500 group-hover:scale-125"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <span className="font-display text-xs font-semibold tracking-[0.22em] text-[#B45309]">
                      02 / 03
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-[#26332F] dark:text-[#FAF8F2]">
                      {isAr ? 'مسار تعلم منطقي' : 'Structured progression'}
                    </h3>
                    <p className="mt-4 text-[14px] leading-relaxed text-[#5F6E68] dark:text-[#A8B6AB]">
                      {isAr
                        ? 'كل درس يبني على ما قبله لضمان تثبيت المعونة الصحيحة دون تشتت.'
                        : 'Lessons flow logically from safety basics to specific interventions, preventing overwhelm.'}
                    </p>
                  </div>

                  <div className="mt-12 pt-6 border-t border-[#26332F]/10 dark:border-white/10">
                    <OrbitVisual isAr={isAr} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

       {/* Why EduFanor — editorial platform rows. */}
        <section
          id="platform"
          className="relative border-y border-[#26332F]/10 bg-[#EFE7D8] py-20 transition-colors duration-500 dark:border-white/10 dark:bg-[#101C15] md:py-28 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
                <motion.div {...reveal(0)}>
                  <SectionLabel index="02">{isAr ? 'المنصة' : 'The platform'}</SectionLabel>
                </motion.div>

                <motion.h2
                  {...reveal(0.06)}
                  className={`mt-6 font-display font-semibold tracking-[-0.02em] text-[#26332F] dark:text-[#FAF8F2] ${
                    isAr
                      ? 'text-[clamp(1.95rem,3.6vw,2.9rem)] leading-[1.32]'
                      : 'text-[clamp(1.95rem,3.8vw,3.1rem)] leading-[1.04]'
                  }`}
                >
                  {isAr ? (
                    <>
                      طريقة أهدأ
                      <br />
                      لتعلّم أمر جاد.
                    </>
                  ) : (
                    <>
                      A calmer way
                      <br />
                      <span className="italic text-[#B45309] dark:text-[#F59E42]">
                        to learn something serious.
                      </span>
                    </>
                  )}
                </motion.h2>

                <motion.p
                  {...reveal(0.12)}
                  className={`mt-5 max-w-sm text-[13.5px] text-[#5F6E68] dark:text-[#A8B6AB] ${
                    isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                  }`}
                >
                  {isAr
                    ? 'صُممت كل تفصيلة لتُبقي التركيز على ما يهم: فهم واضح، واستعداد مسؤول، وثقة تُبنى خطوة بخطوة.'
                    : 'Every detail is designed to keep the focus on what matters: clear understanding, responsible readiness, and confidence built step by step.'}
                </motion.p>

                <motion.div
                  {...reveal(0.18)}
                  className="mt-8 hidden border-t border-[#26332F]/10 pt-6 dark:border-white/10 lg:block"
                >
                  <p className="font-display text-lg italic leading-relaxed text-[#B45309] dark:text-[#F59E42]">
                    {isAr ? '«الوضوح أولًا. الثقة تتبعه.»' : '“Clarity first. Confidence follows.”'}
                  </p>
                </motion.div>
              </div>

              <div className="lg:col-span-8">
                <div className="border-t border-[#26332F]/10 dark:border-white/10">
                  {[
                    {
                      number: '01',
                      title: isAr ? 'دروس تحترم وقتك' : 'Lessons that respect your time',
                      text: isAr
                        ? 'محتوى مقسّم إلى خطوات قصيرة يسهل قراءته على الهاتف والحاسوب، دون تشتيت.'
                        : 'Content broken into short steps that stay readable on phones and desktops, without distraction.',
                    },
                    {
                      number: '02',
                      title: isAr ? 'مساحة تعلّم خاصة بك' : 'Your own learning space',
                      text: isAr
                        ? 'أنشئ حسابك واحتفظ بمساراتك وتقدّمك في مكان واحد، جاهزًا للمتابعة في أي وقت.'
                        : 'Create your account and keep your courses and progress in one place, ready to continue anytime.',
                    },
                    {
                      number: '03',
                      title: isAr ? 'تقدّم تراه بوضوح' : 'Progress you can see',
                      text: isAr
                        ? 'تعرض لوحة التعلّم الدروس المكتملة والخطوة التالية، لتعرف دائمًا من أين تبدأ.'
                        : 'Your learning dashboard surfaces completed lessons and your next step, so you always know where to begin.',
                    },
                    {
                      number: '04',
                      title: isAr ? 'تدرّب قبل أن يهم الأمر' : 'Practice before it matters',
                      text: isAr
                        ? 'اختبارات قصيرة وتغذية راجعة فورية لتثبيت الفهم. ومساعد ذكي مخصص قيد التطوير.'
                        : 'Short quizzes and instant feedback help understanding stick. A dedicated AI tutor is in development.',
                    },
                  ].map((item, index) => (
                    <motion.article
                      key={item.number}
                      {...reveal(index * 0.04)}
                      className="group grid gap-3 border-b border-[#26332F]/10 py-7 transition-colors hover:bg-[#FAF8F2]/60 dark:border-white/10 dark:hover:bg-white/[0.02] sm:grid-cols-12 sm:items-start sm:gap-6 sm:px-3"
                    >
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <span className="font-display text-sm font-semibold text-[#26332F]/45 dark:text-[#FAF8F2]/40">
                          {item.number}
                        </span>
                        <span
                          className="h-px w-6 bg-[#26332F]/20 transition-all duration-300 group-hover:w-10 group-hover:bg-[#B45309] dark:bg-white/20 dark:group-hover:bg-[#F59E42]"
                          aria-hidden="true"
                        />
                      </div>
                      <h3
                        className={`font-display font-semibold leading-snug text-[#26332F] dark:text-[#FAF8F2] sm:col-span-4 ${
                          isAr ? 'text-lg leading-[1.5]' : 'text-xl'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-[13px] text-[#5F6E68] dark:text-[#A8B6AB] sm:col-span-6 ${
                          isAr ? 'font-arabic leading-[1.9]' : 'leading-relaxed'
                        }`}
                      >
                        {item.text}
                      </p>
                    </motion.article>
                  ))}
                </div>

                <motion.div
                  {...reveal(0.1)}
                  className="mt-8 flex gap-4 border-s-2 border-[#B45309] bg-[#B45309]/[0.06] px-5 py-4 dark:border-[#F59E42] dark:bg-[#F59E42]/[0.05]"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B45309]/10 text-[#B45309] ring-1 ring-[#B45309]/25 shadow-[0_0_22px_-10px_rgba(194,84,30,0.6)] dark:bg-[#F59E42]/[0.12] dark:text-[#FDBA74] dark:ring-[#F59E42]/30">
                    <ShieldAlert className="h-4 w-4" />
                  </span>
                  <p className="text-[12px] leading-relaxed text-[#5F6E68] dark:text-[#A8B6AB]">
                    {isAr
                      ? 'المحتوى تعليمي ولا يغني عن الاتصال بخدمات الطوارئ أو التدريب المعتمد. الأولوية دائمًا لسلامة المكان وطلب المساعدة المختصة.'
                      : 'Educational content never replaces emergency services or certified training. Scene safety and professional help always come first.'}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission — immersive forest-green editorial moment. */}
        <section
          id="our-mission"
          className="relative overflow-hidden bg-[#0B2A21] py-24 text-[#FAF8F2] transition-colors duration-500 dark:bg-[#071711] md:py-32"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(245,158,66,0.14),transparent_44%),radial-gradient(circle_at_84%_86%,rgba(230,154,85,0.1),transparent_46%)]"
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
                className={`mt-7 max-w-3xl font-display font-semibold tracking-[-0.02em] text-[#FAF8F2] ${
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
                    <span className="text-[#F59E42]">تعلّموا ماذا يفعلون.</span>
                  </>
                ) : (
                  <>
                    The first minutes
                    <br />
                    are not for heroes.
                    <br />
                    They are for people
                    <br />
                    <span className="italic text-[#F59E42]">who learned what to do.</span>
                  </>
                )}
              </motion.h2>

              <motion.p
                {...reveal(0.12)}
                className={`mt-7 max-w-2xl text-[14.5px] text-[#FAF8F2]/70 ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                }`}
              >
                {isAr
                  ? 'نسعى في EduFanor إلى جعل المعرفة الأساسية بالإسعافات الأولية متاحة للجميع. من خلال دروس واضحة وتعلّم تفاعلي وإرشاد مسؤول، نساعد الناس على اكتساب المعرفة والثقة لتقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                  : 'Our mission is to make first-aid knowledge accessible to everyone. Through clear lessons, interactive learning, and responsible guidance, we help people build the confidence to provide appropriate initial assistance while waiting for emergency responders.'}
              </motion.p>

              <motion.div {...reveal(0.18)} className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#F59E42] px-6 text-[12.5px] font-extrabold text-[#17231F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C49B]"
                >
                  {isAr ? 'اقرأ قصتنا' : 'Read our story'}
                  {isAr ? (
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </Link>
                <a
                  href="#courses"
                  className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-[12.5px] font-bold text-[#FAF8F2] transition-colors hover:border-[#F59E42]/60 hover:text-[#F59E42]"
                >
                  {isAr ? 'استعرض المسارات' : 'Browse the learning path'}
                </a>
              </motion.div>
            </div>

            <motion.div
              {...reveal(0.14)}
              className="group relative flex justify-center lg:col-span-5"
            >
              <div className="relative w-full max-w-[520px] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#17231F] shadow-[0_40px_90px_-40px_rgba(3,15,10,0.9)]">
                <div
                  className="pointer-events-none absolute -end-10 -top-12 z-10 h-40 w-40 rounded-full bg-[#F59E42]/20 blur-3xl"
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
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(7,23,17,0.75)_100%)]"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-4 start-4 z-10 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0B2A21]/70 py-1.5 pe-4 ps-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#FDBA74] backdrop-blur-md">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F59E42]/15 ring-1 ring-[#F59E42]/45 shadow-[0_0_16px_-4px_rgba(245,158,66,0.7)]">
                      <HeartPulse className="h-3 w-3" />
                    </span>
                    {isAr ? 'وضوح · ثقة · استعداد' : 'Clarity · Confidence · Readiness'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Learning path — real course data only. */}
        <section
          id="courses"
          className="relative bg-[#FAF8F2] py-20 transition-colors duration-500 dark:bg-[#17231F] md:py-28 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <motion.div {...reveal(0)}>
                  <SectionLabel index="04">{isAr ? 'المسار التعليمي' : 'The learning path'}</SectionLabel>
                </motion.div>
                <motion.h2
                  {...reveal(0.06)}
                  className={`mt-6 max-w-3xl font-display font-semibold tracking-[-0.02em] text-[#26332F] dark:text-[#FAF8F2] ${
                    isAr
                      ? 'text-[clamp(1.95rem,4.2vw,3.4rem)] leading-[1.3]'
                      : 'text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.04]'
                  }`}
                >
                  {isAr ? (
                    <>
                      ثلاث مهارات أساسية.
                      <br />
                      <span className="text-[#B45309] dark:text-[#F59E42]">بداية واعية واحدة.</span>
                    </>
                  ) : (
                    <>
                      Three essential skills.
                      <br />
                      <span className="italic text-[#B45309] dark:text-[#F59E42]">
                        One considered start.
                      </span>
                    </>
                  )}
                </motion.h2>
                <motion.p
                  {...reveal(0.12)}
                  className={`mt-5 max-w-2xl text-[13.5px] text-[#5F6E68] dark:text-[#A8B6AB] ${
                    isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                  }`}
                >
                  {isAr
                    ? 'كل مسار يقسّم مهارة إلى خطوات قصيرة وسهلة القراءة، ثم ينتهي باختبار معرفي قصير. يُحفظ تقدّمك في حسابك لتعود من حيث توقفت.'
                    : 'Each course breaks a skill into short, readable steps, then ends with a short knowledge check. Your progress is saved to your account, so you can pick up where you left off.'}
                </motion.p>
              </div>

              <motion.div {...reveal(0.14)} className="lg:col-span-4 lg:justify-self-end">
                <Link
                  to="/register"
                  className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-[#26332F]/20 px-5 text-[12.5px] font-bold text-[#26332F] transition-all duration-300 hover:border-[#F59E42] hover:bg-[#F59E42] hover:text-[#17231F] dark:border-white/20 dark:text-[#FAF8F2] dark:hover:border-[#F59E42] dark:hover:bg-[#F59E42] dark:hover:text-[#17231F]"
                >
                  {isAr ? 'أنشئ حسابًا مجانيًا' : 'Create a free account'}
                  {isAr ? (
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </Link>
              </motion.div>
            </div>

            <motion.div
              {...reveal(0.1)}
              className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#26332F]/10 bg-[#26332F]/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-3"
            >
              {[
                {
                  number: '01',
                  title: isAr ? 'تعلّم' : 'Learn',
                  text: isAr ? 'دروس قصيرة ومنظمة خطوة بخطوة.' : 'Short, structured lessons, step by step.',
                },
                {
                  number: '02',
                  title: isAr ? 'تدرّب' : 'Practice',
                  text: isAr ? 'اختبارات معرفية بتغذية راجعة فورية.' : 'Knowledge checks with instant feedback.',
                },
                {
                  number: '03',
                  title: isAr ? 'تابع' : 'Track',
                  text: isAr ? 'تقدّمك محفوظ في حسابك.' : 'Your progress saved to your account.',
                },
              ].map((step) => (
                <div key={step.number} className="bg-[#FAF8F2] p-5 dark:bg-[#17231F] sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-semibold text-[#B45309] dark:text-[#F59E42]">
                      {step.number}
                    </span>
                    <span className="h-px w-5 bg-[#26332F]/15 dark:bg-white/15" aria-hidden="true" />
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#26332F]/60 dark:text-[#FAF8F2]/50">
                      {step.title}
                    </p>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#5F6E68] dark:text-[#A8B6AB]">
                    {step.text}
                  </p>
                </div>
              ))}
            </motion.div>

            <div className="mt-12 border-t border-[#26332F]/10 dark:border-white/10">
              {courseList.map((course, index) => (
                <motion.article
                  key={course.id}
                  {...reveal(index * 0.05)}
                  className="group grid gap-4 border-b border-[#26332F]/10 py-8 transition-colors hover:bg-[#EFE7D8]/60 dark:border-white/10 dark:hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:gap-6 md:px-3"
                >
                  <div className="flex items-center gap-3 md:col-span-1">
                    <span className="font-display text-2xl font-semibold text-[#26332F]/25 transition-colors group-hover:text-[#B45309] dark:text-[#FAF8F2]/25 dark:group-hover:text-[#F59E42]">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="md:col-span-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded-full border border-[#26332F]/15 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#5F6E68] dark:border-white/15 dark:text-[#C3D1C6]">
                        {course.level}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5F6E68] dark:text-[#A8B6AB]">
                        {course.lessons} {isAr ? 'دروس' : 'lessons'} · {course.duration}
                      </span>
                    </div>
                    <h3
                      className={`mt-2.5 font-display font-semibold leading-snug text-[#26332F] transition-colors group-hover:text-[#B45309] dark:text-[#FAF8F2] dark:group-hover:text-[#F59E42] ${
                        isAr ? 'text-xl leading-[1.5]' : 'text-2xl'
                      }`}
                    >
                      {course.title}
                    </h3>
                  </div>

                  <p
                    className={`text-[13px] text-[#5F6E68] dark:text-[#A8B6AB] md:col-span-5 ${
                      isAr ? 'font-arabic leading-[1.9]' : 'leading-relaxed'
                    }`}
                  >
                    {course.description}
                  </p>

                  <div className="md:col-span-1 md:justify-self-end">
                    <Link
                      to="/register"
                      aria-label={
                        isAr ? `سجّل لفتح ${course.title}` : `Sign up to open ${course.title}`
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#26332F]/15 text-[#26332F] transition-all duration-300 group-hover:border-[#B45309] group-hover:bg-[#B45309] group-hover:text-[#FAF8F2] dark:border-white/15 dark:text-[#FAF8F2] dark:group-hover:border-[#F59E42] dark:group-hover:bg-[#F59E42] dark:group-hover:text-[#17231F]"
                    >
                      {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* About / responsible editorial */}
        <section
          id="about"
          className="bg-[#EFE7D8] py-20 transition-colors duration-500 dark:bg-[#101C15] md:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <motion.div {...reveal(0)} className="lg:col-span-7">
              <SectionLabel index="05">{isAr ? 'عن المنصة' : 'About EduFanor'}</SectionLabel>
              <h2
                className={`mt-6 max-w-2xl font-display font-semibold tracking-[-0.02em] text-[#26332F] dark:text-[#FAF8F2] ${
                  isAr
                    ? 'text-[clamp(1.95rem,4vw,3.2rem)] leading-[1.32]'
                    : 'text-[clamp(1.95rem,4.2vw,3.4rem)] leading-[1.04]'
                }`}
              >
                {isAr ? (
                  <>
                    «قليل من المعرفة
                    <br />
                    <span className="text-[#B45309] dark:text-[#F59E42]">
                      يمكن أن يصنع فارقًا كبيرًا.»
                    </span>
                  </>
                ) : (
                  <>
                    “A little knowledge
                    <br />
                    <span className="italic text-[#B45309] dark:text-[#F59E42]">
                      can make a difference.”
                    </span>
                  </>
                )}
              </h2>
              <p
                className={`mt-6 max-w-2xl text-[14px] text-[#5F6E68] dark:text-[#A8B6AB] ${
                  isAr ? 'font-arabic leading-[1.95]' : 'leading-[1.8]'
                }`}
              >
                {isAr
                  ? 'EduFanor مشروع تعليمي يهدف إلى تقريب المعرفة الأساسية بالإسعافات الأولية من الجميع، بلغة واضحة وتجربة تعليمية منظمة تحترم وقت المتعلم وحدود المسؤولية الصحية.'
                  : 'EduFanor is an educational project that brings essential first-aid knowledge closer to everyone, with clear language and a structured learning experience that respects the learner’s time and the boundaries of responsible care.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#F59E42] px-5 text-[12.5px] font-extrabold text-[#17231F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C49B] dark:bg-[#F59E42] dark:text-[#17231F] dark:hover:bg-[#F2C49B]"
                >
                  {isAr ? 'تعرّف على القصة كاملة' : 'Read the full story'}
                  {isAr ? (
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-11 items-center rounded-full border border-[#26332F]/20 px-5 text-[12.5px] font-bold text-[#26332F] transition-colors hover:border-[#B45309] hover:text-[#B45309] dark:border-white/20 dark:text-[#FAF8F2] dark:hover:border-[#F59E42] dark:hover:text-[#F59E42]"
                >
                  {isAr ? 'أنشئ حسابك' : 'Create your account'}
                </Link>
              </div>
            </motion.div>

            <motion.aside {...reveal(0.1)} className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[#26332F]/10 bg-[#FAF8F2] p-7 shadow-[0_30px_80px_-50px_rgba(10,35,25,0.55)] dark:border-white/10 dark:bg-[#17231F]">
                <div
                  className="pointer-events-none absolute -end-10 -top-12 h-36 w-36 rounded-full bg-[#F59E42]/25 blur-3xl dark:bg-[#F59E42]/15"
                  aria-hidden="true"
                />
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B45309] text-[#FFF7ED] shadow-[0_0_32px_-10px_rgba(245,158,66,0.65)] dark:bg-[#F59E42] dark:text-[#17231F]">
                    <ShieldAlert className="h-5 w-5" />
                  </span>
                  <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5F6E68] dark:text-[#A8B6AB]">
                    {isAr ? 'ملاحظة مسؤولة' : 'A responsible note'}
                  </p>
                  <p
                    className={`mt-4 font-display font-semibold leading-snug text-[#26332F] dark:text-[#FAF8F2] ${
                      isAr ? 'text-2xl leading-[1.5]' : 'text-2xl'
                    }`}
                  >
                    {isAr ? 'تعلّم لتساعد. واعرف حدودك.' : 'Learn to help. Know your limits.'}
                  </p>
                  <p
                    className={`mt-4 text-[13px] text-[#5F6E68] dark:text-[#A8B6AB] ${
                      isAr ? 'font-arabic leading-[1.9]' : 'leading-relaxed'
                    }`}
                  >
                    {isAr
                      ? 'المحتوى تعليمي ولا يُعد بديلًا عن التدريب المعتمد أو الاستشارة الطبية. في أي طارئ، الأولوية لسلامة المكان والاتصال بخدمات الطوارئ المحلية.'
                      : 'This content is educational and does not replace certified training or medical advice. In any emergency, prioritize scene safety and contact local emergency services.'}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#26332F]/10 pt-5 dark:border-white/10">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B45309]/[0.08] text-[#B45309] dark:bg-[#F59E42]/[0.12] dark:text-[#F59E42]">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5F6E68] dark:text-[#A8B6AB]">
                      {isAr ? 'وضوح · احترام · استعداد' : 'Clarity · Respect · Readiness'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

       {/* Final CTA */}
        <section className="relative overflow-hidden bg-[#0B2A21] px-5 py-20 text-[#FAF8F2] transition-colors duration-500 dark:bg-[#071711] sm:px-8 md:py-28 lg:px-12">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_22%,rgba(245,158,66,0.15),transparent_52%),radial-gradient(circle_at_10%_90%,rgba(230,154,85,0.08),transparent_46%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-12 start-0 select-none font-display text-[26vw] font-semibold leading-none text-white/[0.025]"
            aria-hidden="true"
          >
            EduFanor
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.p
                {...reveal(0)}
                className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#F59E42]/80"
              >
                {isAr ? 'ابدأ بخطوة واحدة' : 'Start with one step'}
              </motion.p>
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
                    <span className="text-[#F59E42]">واستجابة أهدأ غدًا.</span>
                  </>
                ) : (
                  <>
                    One lesson today.
                    <br />
                    <span className="italic text-[#F59E42]">A calmer response tomorrow.</span>
                  </>
                )}
              </motion.h2>
            </div>
            <motion.div {...reveal(0.14)} className="shrink-0">
              <Link
                to="/register"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#F59E42] px-7 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-[#17231F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C49B]"
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