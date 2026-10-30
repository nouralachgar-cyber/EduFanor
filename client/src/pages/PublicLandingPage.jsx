import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Globe from 'react-globe.gl';
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  Compass,
  Droplets,
  Globe as GlobeIcon,
  HeartPulse,
  Menu,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CURRENT_YEAR = new Date().getFullYear();

const CATEGORY_ICONS = {
  cpr: HeartPulse,
  choking: Wind,
  burns: Droplets,
};

function EmergencyNetworkDiagram({ isDark }) {
  const mainColor = isDark ? '#A4C2AE' : '#24483F';
  const accentColor = '#F59E42';
  const borderColor = isDark ? '#3C4C41' : '#E7DFD1';

  return (
    <svg viewBox="0 0 200 120" className="h-auto w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <circle cx="100" cy="60" r="50" fill="none" stroke={borderColor} strokeWidth="1" />
      <circle cx="100" cy="60" r="38" fill="none" stroke={borderColor} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="100" cy="60" r="24" fill="none" stroke={borderColor} strokeWidth="1" />
      <circle cx="100" cy="60" r="6" fill={accentColor} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const x1 = 100 + 12 * Math.cos((angle * Math.PI) / 180);
        const y1 = 60 + 12 * Math.sin((angle * Math.PI) / 180);
        const x2 = 100 + 46 * Math.cos((angle * Math.PI) / 180);
        const y2 = 60 + 46 * Math.sin((angle * Math.PI) / 180);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={borderColor} strokeWidth="0.8" />;
      })}
      {[
        { x: 70, y: 35 },
        { x: 130, y: 40 },
        { x: 80, y: 80 },
        { x: 120, y: 78 },
      ].map((pos) => (
        <circle key={`${pos.x}-${pos.y}`} cx={pos.x} cy={pos.y} r="3.5" fill={mainColor} />
      ))}
    </svg>
  );
}

function SecurityDiagram({ isDark }) {
  const strokeColor = isDark ? '#FCFAF6' : '#24483F';
  const checkColor = '#F59E42';
  const circleColor = isDark ? '#3C4C41' : '#E7DFD1';

  return (
    <svg viewBox="0 0 200 150" className="h-auto w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <circle cx="100" cy="75" r="58" fill="none" stroke={circleColor} strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="100" cy="75" r="42" fill="none" stroke={circleColor} strokeWidth="1" />
      <g transform="translate(82, 55)">
        <path
          d="M18,2 L2,8 V18 C2,28 18,38 18,38 C18,38 34,28 34,18 V8 L18,2 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
        />
        <path
          d="M12,20 L16,24 L24,16"
          fill="none"
          stroke={checkColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g transform="translate(136, 96)">
        <rect x="0" y="0" width="47" height="26" rx="6" fill={isDark ? '#1F2A23' : '#FCFAF6'} stroke={circleColor} strokeWidth="1" />
        <text x="23.5" y="11" textAnchor="middle" fontSize="6" fontWeight="bold" fill={checkColor}>
          EDUFANOR
        </text>
        <text x="23.5" y="20" textAnchor="middle" fontSize="5.5" fill={strokeColor}>
          GUIDED LEARNING
        </text>
      </g>
    </svg>
  );
}

function RealInteractiveGlobe() {
  const globeEl = useRef();
  const wrapRef = useRef();
  const [size, setSize] = useState(480);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setSize(Math.max(260, Math.min(Math.round(width), 560)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.1;
      controls.enableZoom = false;
      controls.enablePan = false;
    }
    globeEl.current.pointOfView({ alt: 1.85 }, 0);
  }, [size]);

  const pointsData = [
    { lat: 33.5731, lng: -7.5898, size: 0.35, color: '#F59E42' },
    { lat: 40.7128, lng: -74.006, size: 0.24, color: '#F59E42' },
    { lat: 48.8566, lng: 2.3522, size: 0.24, color: '#F59E42' },
    { lat: 25.2048, lng: 55.2708, size: 0.24, color: '#F59E42' },
  ];

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="pointer-events-none absolute inset-[4%] rounded-full bg-[radial-gradient(circle_at_38%_32%,rgba(245,158,66,0.34),rgba(23,61,53,0.5)_45%,transparent_72%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-[10%] rounded-full border border-amber/20" />
      <div className="pointer-events-none absolute inset-[2%] rounded-full border border-white/5" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <Globe
          ref={globeEl}
          width={size}
          height={size}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereColor="#F59E42"
          atmosphereAltitude={0.18}
          pointsData={pointsData}
          pointColor="color"
          pointAltitude={0.06}
          pointRadius="size"
          pointsMerge={false}
        />
      </div>
      <span className="absolute bottom-2 start-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-[#0B1A15]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FCFAF6]/70 backdrop-blur-md rtl:translate-x-1/2">
        learn · practice · respond
      </span>
    </div>
  );
}

function CinematicOrbit({ isDark }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="relative flex h-[300px] w-[300px] items-center justify-center md:h-[430px] md:w-[430px]"
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,158,66,0.4) 0%, transparent 72%)' }}
      />
      <motion.div
        animate={reduceMotion ? undefined : { rotateZ: [0, 360], rotateX: [56, 68, 56] }}
        transition={
          reduceMotion
            ? undefined
            : {
                rotateZ: { duration: 38, repeat: Infinity, ease: 'linear' },
                rotateX: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        className="absolute inset-5 rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 26%, #F59E42 34%, #FFD09A 41%, #24483F 63%, transparent 71%)'
            : 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 26%, #E88736 34%, #FFD09A 42%, #173D35 64%, transparent 72%)',
          boxShadow: '0 45px 95px rgba(245, 158, 66, 0.25)',
        }}
      />
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-amber/30 bg-[#0B1A15]/60 text-center backdrop-blur-md md:h-40 md:w-40">
        <div>
          <ShieldCheck className="mx-auto h-7 w-7 text-amber" />
          <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FCFAF6]/70">one action</p>
        </div>
      </div>
    </motion.div>
  );
}

function LandingFooter() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldCheck className="h-5 w-5 text-amber-soft" />
            </span>
            <span className="font-display text-xl font-semibold text-ink">EduFanor</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            {isAr
              ? 'منصة تعليمية تجعل المعرفة الأساسية بالإسعافات الأولية واضحة، عملية، ومتاحة للجميع.'
              : 'A learning platform that makes essential first-aid knowledge clear, practical, and accessible to everyone.'}
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface-muted px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            <Sparkles className="h-3 w-3 text-amber" />
            {isAr ? 'عربي · English' : 'Arabic · English'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
              {isAr ? 'اكتشف' : 'Explore'}
            </p>
            <nav className="mt-3 flex flex-col gap-2.5 text-sm font-semibold text-ink">
              <a href="#our-impact" className="transition-colors hover:text-brand-ink">
                {isAr ? 'أثرنا' : 'Our impact'}
              </a>
              <a href="#why-choose-us" className="transition-colors hover:text-brand-ink">
                {isAr ? 'لماذا إدوفانور' : 'Why EduFanor'}
              </a>
              <a href="#courses" className="transition-colors hover:text-brand-ink">
                {isAr ? 'المساقات' : 'Courses'}
              </a>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
              {isAr ? 'المنصة' : 'Platform'}
            </p>
            <nav className="mt-3 flex flex-col gap-2.5 text-sm font-semibold text-ink">
              <Link to="/about" className="transition-colors hover:text-brand-ink">
                {isAr ? 'عن المنصة' : 'About'}
              </Link>
              <Link to="/login" className="transition-colors hover:text-brand-ink">
                {isAr ? 'تسجيل الدخول' : 'Sign in'}
              </Link>
              <Link to="/register" className="transition-colors hover:text-brand-ink">
                {isAr ? 'حساب جديد' : 'Create account'}
              </Link>
            </nav>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
              {isAr ? 'تواصل' : 'Contact'}
            </p>
            <a
              href="mailto:support@edufanor.com"
              className="mt-3 block text-sm font-semibold text-ink transition-colors hover:text-brand-ink"
              dir="ltr"
            >
              support@edufanor.com
            </a>
            <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
              {isAr
                ? 'المحتوى تعليمي فقط. في الطوارئ، اتصل بخدمات الإسعاف المحلية أولاً.'
                : 'Educational content only. In an emergency, contact local emergency services first.'}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-[11px] text-ink-muted sm:flex-row sm:text-start lg:px-12">
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

  const courses = t('coursesData', { returnObjects: true });
  const courseList = Array.isArray(courses) ? courses : [];

  const [activeSection, setActiveSection] = useState('home');

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
    { label: isAr ? 'المساقات' : 'Courses', href: '#courses' },
    { label: isAr ? 'عن المنصة' : 'About', href: '#about' },
  ];

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] },
        };

  const heroReveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
        };

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-ink">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-[#08140F]/90 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl'
            : 'border-b border-transparent bg-[linear-gradient(180deg,rgba(5,14,11,0.55)_0%,rgba(5,14,11,0)_100%)]'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[0.85rem] bg-[#F59E42] text-[#08140F] shadow-[0_14px_34px_-16px_rgba(245,158,66,0.95)] transition-transform duration-500 group-hover:-translate-y-0.5">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[1.3rem] font-semibold tracking-tight text-[#FCFAF6]">
                EduFanor
              </span>
              <span className="mt-1.5 hidden text-[9px] font-bold uppercase leading-tight tracking-[0.3em] text-[#FCFAF6]/40 sm:block">
                {isAr ? 'تعلّم · استعد · أنقذ' : 'Learn · Prepare · Respond'}
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
          >
            {navItems.map((item) => {
              const active = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'true' : undefined}
                  className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD09A]/50 ${
                    active
                      ? 'bg-white/10 text-[#FFD09A]'
                      : 'text-[#FCFAF6]/70 hover:bg-white/[0.07] hover:text-[#FCFAF6]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div
              className="hidden items-center gap-0.5 rounded-full border border-white/15 bg-white/[0.06] p-[3px] md:flex"
              role="group"
              aria-label={isAr ? 'اختيار اللغة' : 'Language selector'}
            >
              <button
                type="button"
                onClick={() => i18n.changeLanguage('ar')}
                aria-pressed={isAr}
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-wide transition-colors ${
                  isAr ? 'bg-[#FFD09A] text-[#08140F]' : 'text-[#FCFAF6]/60 hover:text-[#FCFAF6]'
                }`}
              >
                ع
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                aria-pressed={!isAr}
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-wide transition-colors ${
                  !isAr ? 'bg-[#FFD09A] text-[#08140F]' : 'text-[#FCFAF6]/60 hover:text-[#FCFAF6]'
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
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[#FCFAF6] backdrop-blur-md transition-all duration-300 hover:border-[#FFD09A]/45 hover:bg-white/[0.12] hover:text-[#FFD09A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD09A]/50"
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-12" />
              )}
            </button>

            <span className="mx-0.5 hidden h-6 w-px bg-white/15 lg:block" aria-hidden="true" />

            <Link
              to="/login"
              className="hidden rounded-full border border-transparent px-4 py-2 text-[13px] font-semibold text-[#FCFAF6]/85 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-[#FCFAF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD09A]/40 lg:inline-flex"
            >
              {isAr ? 'تسجيل الدخول' : 'Log in'}
            </Link>

            <Link
              to="/register"
              className="group hidden items-center gap-2 rounded-full bg-[#F59E42] px-5 py-2.5 text-[13px] font-extrabold text-[#08140F] shadow-[0_16px_40px_-20px_rgba(245,158,66,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFD09A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD09A]/60 lg:inline-flex"
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[#FCFAF6] backdrop-blur-md transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD09A]/50 lg:hidden"
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
              className="overflow-hidden border-t border-white/10 bg-[#07120E]/95 backdrop-blur-2xl lg:hidden"
            >
              <nav
                className="mx-auto flex max-w-7xl flex-col gap-0.5 px-5 py-5 sm:px-8"
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
                          ? 'bg-white/[0.08] text-[#FFD09A]'
                          : 'text-[#FCFAF6]/75 hover:bg-white/[0.05] hover:text-[#FCFAF6]'
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
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FCFAF6]/50">
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
                        isAr ? 'bg-[#FFD09A] text-[#08140F]' : 'text-[#FCFAF6]/60'
                      }`}
                    >
                      ع
                    </button>
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage('en')}
                      aria-pressed={!isAr}
                      className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold transition-colors ${
                        !isAr ? 'bg-[#FFD09A] text-[#08140F]' : 'text-[#FCFAF6]/60'
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
                    className="rounded-full border border-white/20 py-3 text-center text-[13px] font-semibold text-[#FCFAF6] transition-colors hover:bg-white/[0.08]"
                  >
                    {isAr ? 'تسجيل الدخول' : 'Log in'}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full bg-[#F59E42] py-3 text-center text-[13px] font-extrabold text-[#08140F] transition-colors hover:bg-[#FFD09A]"
                  >
                    {isAr ? 'إنشاء حساب' : 'Sign up'}
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero — one cinematic full-bleed image; all text sits directly over it. */}
      <section
        id="home"
        className="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-[#06110C] px-5 pb-14 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20"
      >
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/heroa.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(6,17,12,0.88)_0%,rgba(6,17,12,0.45)_32%,rgba(6,17,12,0.74)_70%,rgba(6,17,12,0.95)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_78%_18%,rgba(245,158,66,0.18),transparent_58%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-t from-[#06110C] via-[#06110C]/70 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-7xl">
          <motion.div {...heroReveal(0)} className="flex">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#FFD09A]/25 bg-[#08140F]/50 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#FFD09A] backdrop-blur-md sm:text-[10px] sm:tracking-[0.22em]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E42] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F59E42]" />
              </span>
              {isAr ? 'إدوفانور · منصة الإسعافات الأولية الرقمية' : 'EduFanor · A digital first-aid academy'}
            </span>
          </motion.div>

          <motion.h1
            {...heroReveal(0.08)}
            className={`mt-7 max-w-4xl font-display font-semibold tracking-[-0.03em] text-[#FCFAF6] [text-shadow:0_24px_60px_rgba(0,0,0,0.55)] ${
              isAr
                ? 'text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.22]'
                : 'text-[clamp(2.7rem,6.8vw,5.2rem)] leading-[0.96]'
            }`}
          >
            {isAr ? (
              <>
                <span className="block">معرفة صغيرة.</span>
                <span className="block text-[#FFD09A]">وثقة تُحدث فرقاً.</span>
              </>
            ) : (
              <>
                <span className="block">A little knowledge.</span>
                <span className="block italic text-[#FFD09A]">The confidence to act.</span>
              </>
            )}
          </motion.h1>

          <motion.p
            {...heroReveal(0.16)}
            className={`mt-6 max-w-xl text-[#FCFAF6]/75 text-[13.5px] sm:text-[15px] ${
              isAr ? 'leading-[1.95]' : 'leading-[1.8]'
            }`}
          >
            {isAr
              ? 'تعلّم الخطوات الإسعافية الأساسية عبر دروس واضحة وتجارب تفاعلية، واكتسب الاستعداد للتصرف بثقة عند وقوع الطوارئ.'
              : 'Learn essential first-aid steps through clear lessons and interactive practice, and build the readiness to respond calmly when it matters.'}
          </motion.p>

          <motion.div
            {...heroReveal(0.24)}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F59E42] px-7 py-3.5 text-[13px] font-extrabold tracking-wide text-[#08140F] shadow-[0_22px_60px_-24px_rgba(245,158,66,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFD09A] hover:shadow-[0_26px_70px_-22px_rgba(255,208,154,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD09A]/60 sm:w-auto"
            >
              <span>{isAr ? 'ابدأ الآن مجاناً' : 'Get started free'}</span>
              {isAr ? (
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </Link>
            <a
              href="#our-impact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-[#FCFAF6]/25 bg-white/[0.06] px-7 py-3.5 text-[13px] font-bold text-[#FCFAF6] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FFD09A]/60 hover:bg-white/[0.12] hover:text-[#FFD09A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD09A]/40 sm:w-auto"
            >
              <span>{isAr ? 'اكتشف أثرنا' : 'Explore our impact'}</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>

          <motion.ul
            {...heroReveal(0.34)}
            className="mt-10 flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5"
          >
            {[
              {
                icon: BookOpen,
                title: isAr ? 'دروس واضحة' : 'Clear lessons',
                text: isAr ? 'خطوات عملية مبسطة' : 'Practical, structured steps',
              },
              {
                icon: GlobeIcon,
                title: isAr ? 'عربي وإنجليزي' : 'Arabic & English',
                text: isAr ? 'تعلم بلغتك بسلاسة' : 'Learn in your language',
              },
              {
                icon: Compass,
                title: isAr ? 'تقدمك محفوظ' : 'Tracked progress',
                text: isAr ? 'تابع كل خطوة تنجزها' : 'Follow every milestone',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-[#FFD09A]" />
                  <span className="text-[11px] font-semibold tracking-wide text-[#FCFAF6]/70">
                    {item.title}
                    <span className="hidden text-[#FCFAF6]/30 sm:inline"> · </span>
                    <span className="hidden text-[#FCFAF6]/45 sm:inline">{item.text}</span>
                  </span>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </section>

      {/* Impact — real rotating 3D globe preserved and refined. */}
      <section id="our-impact" className="relative overflow-hidden bg-beige py-20 transition-colors duration-500 dark:bg-[#101A15] md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 82% 38%, rgba(245,158,66,0.16) 0%, transparent 55%), radial-gradient(circle at 8% 85%, rgba(36,72,63,0.22) 0%, transparent 62%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <div className="lg:col-span-6">
            <motion.div {...reveal(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
              <span className="text-amber">01</span>
              <span className="h-3 w-px bg-line" aria-hidden="true" />
              {isAr ? 'أثرنا الإنساني' : 'Our human impact'}
            </motion.div>

            <motion.h2 {...reveal(0.06)} className="section-title max-w-2xl !text-[clamp(2rem,4.4vw,3.5rem)]">
              {isAr ? (
                <>
                  الطوارئ قد تحدث في كل مكان،
                  <br />
                  <span className="text-accent">ومعرفتك قد تُحدث فرقاً.</span>
                </>
              ) : (
                <>
                  Emergencies happen everywhere.
                  <br />
                  <span className="text-accent">Your knowledge can make a difference.</span>
                </>
              )}
            </motion.h2>

            <motion.p {...reveal(0.12)} className="mt-6 max-w-xl text-sm leading-relaxed text-ink-muted md:text-base">
              {isAr
                ? 'قد تساعد المعرفة بالإسعافات الأولية على التصرف بثقة أكبر في حالات الطوارئ. تجعل EduFanor التعلم الأساسي متاحاً عبر دروس واضحة وتجارب تعليمية تفاعلية، لمساعدة الناس على فهم كيفية تقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                : 'First-aid knowledge can help people respond more confidently in an emergency. EduFanor makes essential learning accessible through clear lessons and interactive educational experiences, helping people understand appropriate initial assistance while waiting for emergency responders.'}
            </motion.p>

            <motion.div {...reveal(0.18)} className="mt-8 space-y-4">
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
                  title: isAr ? 'تابع تقدمك' : 'See your progress',
                  text: isAr
                    ? 'لوحة تعلّم تعرض الدروس المكتملة والخطوة التالية.'
                    : 'Your dashboard surfaces completed lessons and your next step.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 border-t border-line pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-ink">{item.title}</h3>
                      <p className="mt-1 max-w-md text-xs leading-relaxed text-ink-muted">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div {...reveal(0.1)} className="lg:col-span-6">
            <RealInteractiveGlobe />
          </motion.div>
        </div>
      </section>

      {/* Why EduFanor — editorial rows instead of a repetitive card grid. */}
      <section id="why-choose-us" className="relative border-y border-line bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <motion.div {...reveal(0)} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-muted px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                <span className="text-amber">02</span>
                <span className="h-3 w-px bg-line" aria-hidden="true" />
                {isAr ? 'لماذا إدوفانور' : 'Why EduFanor'}
              </motion.div>

              <motion.h2 {...reveal(0.06)} className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-5xl">
                {isAr ? (
                  <>
                    تعلّم هادئ.
                    <br />
                    <span className="italic text-accent">تطبيق واعٍ.</span>
                  </>
                ) : (
                  <>
                    Calm learning.
                    <br />
                    <span className="italic text-accent">Considered action.</span>
                  </>
                )}
              </motion.h2>

              <motion.p {...reveal(0.12)} className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
                {isAr
                  ? 'صُممت كل تفصيلة لتُبقي التركيز على ما يهم: الفهم الواضح، والاستعداد المسؤول، والثقة خطوة بخطوة.'
                  : 'Every detail is designed to keep the focus on what matters: clear understanding, responsible readiness, and confidence built step by step.'}
              </motion.p>

              <div className="mt-8 hidden max-w-xs lg:block">
                <SecurityDiagram isDark={isDark} />
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="border-t border-line">
                {[
                  {
                    number: '01',
                    icon: BookOpen,
                    title: isAr ? 'دروس عملية ومركزة' : 'Focused, practical lessons',
                    text: isAr
                      ? 'محتوى مقسّم إلى خطوات قصيرة يسهل قراءته على الهاتف والحاسوب، دون تشتيت.'
                      : 'Content broken into short steps that stay readable on phones and desktops, without distraction.',
                  },
                  {
                    number: '02',
                    icon: GlobeIcon,
                    title: isAr ? 'تجربة ثنائية اللغة بالكامل' : 'A fully bilingual experience',
                    text: isAr
                      ? 'عربية بخط واضح واتجاه صحيح، وإنجليزية طبيعية — مع تبديل فوري في كل الصفحات.'
                      : 'Natural Arabic with correct direction and clean English — switched instantly across every page.',
                  },
                  {
                    number: '03',
                    icon: Brain,
                    title: isAr ? 'تعلّم يعتمد على التذكر' : 'Learning designed for recall',
                    text: isAr
                      ? 'اختبارات قصيرة، ملاحظات سلامة، وخطوات قابلة للمراجعة قبل المواقف الحقيقية.'
                      : 'Short quizzes, safety notes, and reviewable steps that prepare you before real situations.',
                  },
                  {
                    number: '04',
                    icon: ShieldAlert,
                    title: isAr ? 'إرشاد مسؤول وواضح' : 'Responsible, honest guidance',
                    text: isAr
                      ? 'المحتوى تعليمي ولا يغني عن الاتصال بخدمات الطوارئ أو التدريب المعتمد.'
                      : 'Educational content that never replaces emergency services or certified training.',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.number}
                      {...reveal(index * 0.04)}
                      className="group grid gap-4 border-b border-line py-7 transition-colors hover:bg-surface-muted/60 sm:grid-cols-12 sm:items-start sm:gap-6 sm:px-4"
                    >
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <span className="font-display text-sm font-semibold text-ink-muted">{item.number}</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink transition-transform duration-300 group-hover:-rotate-6">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-ink sm:col-span-4">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-ink-muted sm:col-span-6">{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div {...reveal(0.1)} className="mt-8 grid gap-6 rounded-2xl border border-line bg-surface-muted p-6 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                    {isAr ? 'شبكة التعلم' : 'The learning network'}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    {isAr
                      ? 'كل خطوة مرتبطة بالتالية: درس، مراجعة، ثم اختبار قصير.'
                      : 'Each step connects to the next: lesson, review, then a short quiz.'}
                  </p>
                  <div className="mt-3 max-w-[220px]">
                    <EmergencyNetworkDiagram isDark={isDark} />
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  {[
                    isAr ? 'واجهة عربية أصلية (RTL)' : 'Native Arabic interface (RTL)',
                    isAr ? 'الوضع الفاتح والداكن' : 'Light and dark modes',
                    isAr ? 'حركة هادئة وتحترم تقليل الحركة' : 'Calm motion that respects reduced motion',
                  ].map((line) => (
                    <p key={line} className="flex items-center gap-2 text-xs font-bold text-ink">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-deep dark:text-teal" />
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        id="our-mission"
        className="relative overflow-hidden bg-[#173D35] py-24 text-[#FCFAF6] md:py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(245,158,66,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(120,155,131,0.18),transparent_52%)]" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <div className="lg:col-span-7">
            <motion.div {...reveal(0)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FFD09A]">
              <span className="text-amber">03</span>
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              {isAr ? 'رسالتنا' : 'Our mission'}
            </motion.div>

            <motion.h2 {...reveal(0.06)} className="mt-6 text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
              {isAr ? (
                <>
                  لحظة واحدة.
                  <br />
                  خطوة واعية.
                  <br />
                  <span className="font-display italic text-[#F59E42]">فرق قد ينقذ حياة.</span>
                </>
              ) : (
                <>
                  One moment.
                  <br />
                  One action.
                  <br />
                  <span className="font-display italic text-[#F59E42]">A difference that matters.</span>
                </>
              )}
            </motion.h2>

            <motion.p {...reveal(0.12)} className="mt-7 max-w-2xl text-sm leading-relaxed text-[#FCFAF6]/75 md:text-base">
              {isAr
                ? 'نسعى في EduFanor إلى جعل المعرفة الأساسية بالإسعافات الأولية متاحة للجميع. من خلال دروس واضحة وتعلم تفاعلي وإرشادات مسؤولة، نساعد الناس على اكتساب المعرفة والثقة لتقديم المساعدة الأولية المناسبة إلى حين وصول فرق الإنقاذ المختصة.'
                : 'Our mission is to make first-aid knowledge accessible to everyone. Through clear lessons, interactive learning, and responsible guidance, we help people build the confidence to provide appropriate initial assistance while waiting for emergency responders.'}
            </motion.p>

            <motion.div {...reveal(0.18)} className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-[#F59E42] px-6 py-3 text-xs font-extrabold text-[#0A1712] transition-all hover:-translate-y-0.5 hover:bg-[#FFD09A]"
              >
                {isAr ? 'اقرأ عن المنصة' : 'Read our story'}
                {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs font-bold text-[#FCFAF6] transition-colors hover:border-[#FFD09A]/60 hover:text-[#FFD09A]"
              >
                {isAr ? 'استعرض المساقات' : 'Browse courses'}
              </a>
            </motion.div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <CinematicOrbit isDark={isDark} />
          </div>
        </div>
      </section>

      {/* Course preview — real course data only. */}
      <section id="courses" className="border-b border-line bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.div {...reveal(0)} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-muted px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                <span className="text-amber">04</span>
                <span className="h-3 w-px bg-line" aria-hidden="true" />
                {isAr ? 'المسار التعليمي' : 'The learning path'}
              </motion.div>
              <motion.h2 {...reveal(0.06)} className="section-title mt-5 max-w-2xl !text-[clamp(2rem,4vw,3.25rem)]">
                {isAr ? 'ثلاث مهارات أساسية. بداية واعية.' : 'Three essential skills. One considered start.'}
              </motion.h2>
            </div>
            <motion.div {...reveal(0.1)}>
              <Link to="/register" className="btn-secondary px-5 text-xs">
                {isAr ? 'ابدأ التعلّم' : 'Start learning'}
                {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
            </motion.div>
          </div>

          <div className="mt-10 border-t border-line">
            {courseList.map((course, index) => {
              const Icon = CATEGORY_ICONS[course.category] || BookOpen;
              return (
                <motion.article
                  key={course.id}
                  {...reveal(index * 0.05)}
                  className="group grid gap-5 border-b border-line py-7 transition-colors hover:bg-surface-muted/50 md:grid-cols-12 md:items-center md:gap-6 md:px-3"
                >
                  <div className="flex items-center gap-4 md:col-span-2">
                    <span className="font-display text-sm font-semibold text-ink-muted">0{index + 1}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-brand-ink transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="md:col-span-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="chip bg-brand-soft text-brand-ink">{course.level}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                        {course.lessons} {isAr ? 'دروس' : 'lessons'} · {course.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                      {course.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-muted md:col-span-4">{course.description}</p>

                  <div className="flex md:col-span-1 md:justify-end">
                    <Link
                      to="/register"
                      aria-label={isAr ? `سجّل لفتح ${course.title}` : `Sign up to open ${course.title}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                    >
                      {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / closing editorial */}
      <section id="about" className="bg-beige py-20 dark:bg-[#101A15] md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <motion.div {...reveal(0)} className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
              <span className="text-amber">05</span>
              <span className="h-3 w-px bg-line" aria-hidden="true" />
              {isAr ? 'عن المنصة' : 'About EduFanor'}
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
              {isAr ? (
                <>
                  «قليل من المعرفة
                  <br />
                  <span className="italic text-accent">يمكن أن يصنع فارقاً كبيراً.»</span>
                </>
              ) : (
                <>
                  “A little knowledge
                  <br />
                  <span className="italic text-accent">can make a difference.”</span>
                </>
              )}
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
              {isAr
                ? 'EduFanor مشروع تعليمي يهدف إلى تقريب المعرفة الأساسية بالإسعافات الأولية من الجميع، بلغة واضحة وتجربة تعليمية منظمة تحترم وقت المتعلم وحدود المسؤولية الصحية.'
                : 'EduFanor is an educational project that brings essential first-aid knowledge closer to everyone, with clear language and a structured learning experience that respects the learner’s time and the boundaries of responsible care.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn-primary px-5 text-xs">
                {isAr ? 'تعرّف على القصة كاملة' : 'Read the full story'}
              </Link>
              <Link to="/register" className="btn-secondary px-5 text-xs">
                {isAr ? 'أنشئ حسابك' : 'Create your account'}
              </Link>
            </div>
          </motion.div>

          <motion.aside {...reveal(0.1)} className="lg:col-span-5">
            <div className="rounded-3xl border border-line bg-surface p-7 shadow-pop">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                {isAr ? 'ملاحظة مسؤولة' : 'A responsible note'}
              </p>
              <p className="mt-4 font-display text-2xl font-semibold leading-snug text-ink">
                {isAr ? 'تعلّم لتساعد. واعرف حدودك.' : 'Learn to help. Know your limits.'}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {isAr
                  ? 'المحتوى تعليمي ولا يُعد بديلاً عن التدريب المعتمد أو الاستشارة الطبية. في أي طارئ، الأولوية لسلامة المكان والاتصال بخدمات الطوارئ المحلية.'
                  : 'This content is educational and does not replace certified training or medical advice. In any emergency, prioritize scene safety and contact local emergency services.'}
              </p>
              <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold leading-relaxed text-ink-muted">
                  {isAr ? 'وضوح، احترام، واستعداد.' : 'Clarity, respect, readiness.'}
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-[#173D35] px-6 py-20 text-[#FCFAF6] md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(245,158,66,0.22),transparent_52%)]" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFD09A]">
              {isAr ? 'ابدأ بخطوة واحدة' : 'Start with one step'}
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {isAr ? (
                <>
                  درس واحد اليوم
                  <br />
                  <span className="italic text-[#F59E42]">قد يغيّر ما تفعله غداً.</span>
                </>
              ) : (
                <>
                  One lesson today
                  <br />
                  <span className="italic text-[#F59E42]">can change what you do tomorrow.</span>
                </>
              )}
            </h2>
          </div>
          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#F59E42] px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0A1712] transition-all hover:-translate-y-0.5 hover:bg-[#FFD09A]"
          >
            {isAr ? 'ابدأ التعلّم الآن' : 'Start learning now'}
            {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
