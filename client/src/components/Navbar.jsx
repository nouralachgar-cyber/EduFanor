import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Globe,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Bot,
  Award,
  HelpCircle,
  Sun,
  Moon,
  Settings,
  ChevronDown,
  Home,
} from './icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import EduFanorWordmark from './EduFanorWordmark';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 8
  );

  const dropdownRef = useRef(null);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!profileDropdownOpen) return undefined;
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setProfileDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.myCourses'), path: '/courses', icon: BookOpen },
    { name: t('nav.progress', 'Progress'), path: '/progress', icon: Award },
    { name: t('nav.quizzes', 'Quizzes'), path: '/quizzes', icon: HelpCircle },
    { name: t('nav.aiTutor'), path: '/ai-tutor', icon: Bot },
  ];

  const isActive = (path) => location.pathname === path;

  const themeButton = (
    <button
      onClick={toggleTheme}
      aria-label={t('nav.toggleTheme', 'Toggle theme')}
      title={t('nav.toggleTheme', 'Toggle theme')}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-plumdeep text-plumdeep transition-all hover:border-plumLight hover:bg-plumLight dark:border-lavender dark:text-lavender dark:hover:bg-[var(--color-softlavender)]"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-softLavender" />
      ) : (
        <Moon className="h-4 w-4 text-lavender" />
      )}
    </button>
  );

  const languageButton = (
    <button
      onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
      aria-label={t('nav.toggleLanguage', 'Switch language')}
      className="flex h-10 items-center gap-2 rounded-full border border-lavender bg-softLavender px-3 text-sm font-bold text-lavender transition-all hover:border-lavender hover:bg-[var(--color-softlavender)] dark:border-lavender dark:text-lavender dark:hover:bg-[var(--color-softlavender)]"
    >
      <Globe className="h-4 w-4 text-lavender dark:text-softLavenderLight" />
      <span>{isAr ? 'EN' : 'ع'}</span>
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b border-plumLight/30 bg-mainBackground/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? 'shadow-card' : ''
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? 'h-14' : 'h-[4.5rem]'
        }`}
      >
        <Link
          to="/dashboard"
          className="group flex shrink-0 items-center"
          dir="ltr"
          style={{ unicodeBidi: 'isolate' }}
        >
          <EduFanorWordmark
            className={`w-[clamp(9.5rem,48vw,11.75rem)] transition-transform duration-300 group-hover:scale-[1.015] sm:w-[12rem] xl:w-[12.5rem] text-plumdeep transition-colors`}
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-plumLight/30 bg-softLavender p-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'bg-plumdeep text-on-plumdeep shadow-sm'
                    : 'text-plumdeepMuted hover:bg-softLavender hover:text-plumdeep'}
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-on-plumdeep' : ''}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {themeButton}
          {languageButton}

          <span className="mx-1 h-6 w-px bg-plumLight" aria-hidden="true" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((open) => !open)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2.5 rounded-full border border-plumLight/30 bg-softLavender py-1.5 pe-2.5 ps-1.5 transition-all hover:border-plumLight/50 hover:bg-plumLight/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-plumLight text-xs font-bold text-plumdeep">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
                </span>
                <span className="max-w-[9rem] truncate text-xs font-bold text-plumdeep">
                  {user?.name || t('dashboard.studentName')}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-plumLightMuted transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div
                  role="menu"
                  className="animate-rise absolute end-0 top-full z-50 mt-2 w-56 rounded-full border border-plumLight/30 bg-softLavender p-2 shadow-card"
                >
                  <div className="border-b border-plumLight/30 px-3 pb-2.5 pt-1.5">
                    <p className="truncate text-xs font-extrabold text-plumdeep">
                      {user?.name || t('dashboard.studentName')}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-plumLightMuted" dir="ltr">
                      {user?.email}
                    </p>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 rounded-full border border-plumLight/30 bg-softLavender px-3 py-2 text-xs font-bold text-plumdeep transition-colors hover:bg-plumLight/10"
                    >
                      <User className="h-4 w-4 text-plumdeep dark:text-lavender" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 rounded-full border border-plumLight/30 bg-softLavender px-3 py-2 text-xs font-bold text-plumdeep transition-colors hover:bg-plumLight/10"
                    >
                      <Settings className="h-4 w-4 text-plumdeep dark:text-lavender" />
                      <span>{t('nav.settings')}</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center gap-2.5 rounded-full border border-plumLight/30 bg-softLavender px-3 py-2 text-xs font-bold text-plumdeep transition-colors hover:bg-plumLight/10"
                    >
                      <Home className="h-4 w-4 text-plumdeep dark:text-lavender" />
                      <span>{t('nav.home', 'Home')}</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 rounded-full border border-plumLight/30 bg-softLavender px-3 py-2 text-xs font-bold text-plumdeep transition-colors hover:bg-plumLight/10"
                      >
                        <ShieldCheck className="h-4 w-4 text-plumdeep" />
                        <span>{t('nav.admin', 'Admin panel')}</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-full border border-plumLight/30 bg-softLavender px-3 py-2 text-xs font-bold text-plumdeepMuted transition-colors hover:bg-plumLight/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary px-5 py-2.5 text-xs">
              {t('nav.login')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {themeButton}
          <button
            onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
            aria-label={t('nav.toggleLanguage', 'Switch language')}
            className="flex h-10 items-center rounded-full border border-lavender bg-softLavender px-3 text-xs font-bold text-lavender transition-all hover:border-lavender hover:bg-[var(--color-softlavender)] dark:border-lavender dark:text-lavender dark:hover:bg-[var(--color-softlavender)]"
          >
            {isAr ? 'EN' : 'ع'}
          </button>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={t('nav.toggleMenu', 'Toggle menu')}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-plumLight text-plumdeep transition-colors hover:bg-plumLight/10"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="animate-fade-in absolute inset-x-0 top-full border-t border-plumLight/30 bg-softLavender p-4 shadow-card md:hidden">
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-full border border-plumLight/30 bg-softLavender p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-plumLight text-xs font-bold text-plumdeep">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-plumdeep">
                  {user?.name || t('dashboard.studentName')}
                </p>
                <p className="truncate text-[11px] text-plumLightMuted">{user?.email}</p>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex items-center justify-between rounded-full px-4 py-3 text-sm font-bold transition-colors ${
                    active ? 'bg-plumdeep text-on-plumdeep' : 'text-plumdeepMuted hover:bg-softLavender'}
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-on-plumdeep' : 'text-plumdeep'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 space-y-1 border-t border-plumLight/30 pt-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-full border border-plumLight/30 bg-softLavender px-4 py-3 text-sm font-bold text-plumdeep transition-colors hover:bg-plumLight/10"
                >
                  <User className="h-5 w-5 text-plumdeep dark:text-lavender" />
                  <span>{t('nav.profile')}</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 rounded-full border border-plumLight/30 bg-softLavender px-4 py-3 text-sm font-bold text-plumdeep transition-colors hover:bg-plumLight/10"
                >
                  <Settings className="h-5 w-4 text-plumdeep dark:text-lavender" />
                  <span>{t('nav.settings')}</span>
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-3 rounded-full border border-plumLight/30 bg-softLavender px-4 py-3 text-sm font-bold text-plumdeep transition-colors hover:bg-plumLight/10"
                >
                  <Home className="h-5 w-5 text-plumdeep dark:text-lavender" />
                  <span>{t('nav.home', 'Home')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-full border border-plumLight/30 bg-softLavender px-4 py-3 text-xs font-bold text-plumdeepMuted transition-colors hover:bg-plumLight/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary w-full py-3">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}