import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  Globe,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Bot,
  Sun,
  Moon,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 8
  );
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  const dropdownRef = useRef(null);

  const isAr = i18n.language === 'ar';

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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
    if (!profileDropdownOpen) return;
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

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const toggleLanguage = () => {
    i18n.changeLanguage(isAr ? 'en' : 'ar');
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.myCourses'), path: '/courses', icon: BookOpen },
    { name: t('nav.aiTutor'), path: '/ai-tutor', icon: Bot },
  ];

  const isActive = (path) => location.pathname === path;

  const themeButton = (
    <button
      onClick={toggleDarkMode}
      aria-label={t('nav.toggleTheme', 'Toggle theme')}
      title={t('nav.toggleTheme', 'Toggle theme')}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink transition-all hover:border-line-strong hover:bg-surface-muted"
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-brand-ink" />
      )}
    </button>
  );

  const languageButton = (
    <button
      onClick={toggleLanguage}
      className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-ink transition-all hover:border-line-strong hover:bg-surface-muted"
    >
      <Globe className="h-4 w-4 text-brand-ink" />
      <span>{isAr ? 'EN' : 'ع'}</span>
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? 'shadow-pop' : ''
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? 'h-16' : 'h-18'
        }`}
      >
        <Link to="/dashboard" className="group flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            <ShieldAlert className="h-5 w-5 text-teal" />
          </div>
          <div className="leading-tight hidden sm:block">
            <span className="block text-lg font-extrabold tracking-tight text-ink">
              {t('nav.brand')}
            </span>
            <span className="block text-[10px] font-bold text-ink-muted">
              {t('nav.tagline')}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-line bg-surface-muted p-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink-muted hover:bg-surface hover:text-ink'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-teal' : ''}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {themeButton}
          {languageButton}

          <div className="mx-1 h-6 w-px bg-line" aria-hidden="true" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((open) => !open)}
                aria-expanded={profileDropdownOpen}
                className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface py-1.5 pe-2.5 ps-1.5 transition-all hover:border-line-strong hover:bg-surface-muted"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
                </span>
                <span className="max-w-[9rem] truncate text-xs font-bold text-ink">
                  {user?.name || t('dashboard.studentName')}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-ink-muted transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div className="animate-rise absolute end-0 top-full z-50 mt-2 w-52 rounded-2xl border border-line bg-surface p-2 shadow-pop">
                  <div className="border-b border-line px-3 pb-2 pt-1.5">
                    <p className="truncate text-xs font-extrabold text-ink">
                      {user?.name || t('dashboard.studentName')}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-ink-muted">{user?.email}</p>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-ink transition-colors hover:bg-surface-muted"
                    >
                      <User className="h-4 w-4 text-brand-ink" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-ink transition-colors hover:bg-surface-muted"
                    >
                      <Settings className="h-4 w-4 text-brand-ink" />
                      <span>{t('nav.settings')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
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
            onClick={toggleLanguage}
            className="flex h-10 items-center rounded-xl border border-line bg-surface px-3 text-xs font-bold text-ink transition-colors hover:bg-surface-muted"
          >
            {isAr ? 'EN' : 'ع'}
          </button>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={t('nav.toggleMenu', 'Toggle menu')}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-hover"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="animate-fade-in absolute inset-x-0 top-full border-t border-line bg-surface p-4 shadow-pop md:hidden">
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl border border-line bg-surface-muted p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-ink">
                  {user?.name || t('dashboard.studentName')}
                </p>
                <p className="truncate text-[11px] text-ink-muted">{user?.email}</p>
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
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    active
                      ? 'bg-primary text-white'
                      : 'text-ink hover:bg-surface-muted'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-teal' : 'text-brand-ink'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 space-y-1 border-t border-line pt-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-surface-muted"
                >
                  <User className="h-5 w-5 text-brand-ink" />
                  <span>{t('nav.profile')}</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-surface-muted"
                >
                  <Settings className="h-5 w-5 text-brand-ink" />
                  <span>{t('nav.settings')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
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
