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
  Award,
  Bot,
  HelpCircle,
  Settings,
  ChevronDown,
  Home,
} from './icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import EduFanorWordmark from './EduFanorWordmark';
import ThemeToggle from './ui/ThemeToggle';

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

  const iconButtonClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-highlight hover:text-ink active:scale-[0.98] dark:border-line dark:bg-surface-2 dark:text-on-dark dark:hover:bg-primary dark:hover:text-on-primary';

  const themeButton = (
    <ThemeToggle
      checked={isDark}
      onChange={toggleTheme}
      className="scale-[0.72] origin-center"
      ariaLabel="Toggle dark mode"
    />
  );

  const languageButton = (
    <button
      onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
      aria-label={t('nav.toggleLanguage', 'Switch language')}
      className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-highlight hover:text-ink active:scale-[0.98] dark:border-line dark:bg-surface-2 dark:text-on-dark dark:hover:bg-primary dark:hover:text-on-primary"
    >
      <Globe className="h-4 w-4 text-ink-soft dark:text-lavender" />
      <span>{isAr ? 'EN' : 'ع'}</span>
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-xl transition-shadow duration-300 dark:border-line dark:bg-scrim/95 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
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
            className={`w-[clamp(9.5rem,48vw,11.75rem)] text-ink transition-all duration-300 group-hover:scale-[1.015] group-hover:text-lavender dark:text-on-dark sm:w-[12rem] xl:w-[12.5rem]`}
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-line bg-surface-2 p-1 shadow-sm dark:border-line dark:bg-surface-2 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                  active
                    ? 'bg-primary text-on-primary shadow-sm after:absolute after:bottom-1 after:start-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-on-primary dark:bg-accent dark:text-on-primary dark:after:bg-on-primary'
                    : 'text-ink hover:bg-highlight hover:text-ink dark:text-lavender dark:hover:bg-surface-2 dark:hover:text-lavender'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-on-primary' : 'text-ink-soft dark:text-lavender'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {themeButton}
          {languageButton}

          <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((open) => !open)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pe-2.5 ps-1.5 shadow-sm transition-all duration-200 hover:border-line-strong hover:bg-highlight active:scale-[0.98] dark:border-line dark:bg-surface-2 dark:hover:bg-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-highlight text-xs font-bold text-ink dark:border-line-strong dark:bg-primary dark:text-on-primary">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
                </span>
                <span className="max-w-[9rem] truncate text-xs font-bold text-ink dark:text-on-dark">
                  {user?.name || t('dashboard.studentName')}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted transition-transform duration-200 dark:text-lavender ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div
                  role="menu"
                  className="animate-fade-up absolute end-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-lg dark:border-line dark:bg-surface-2"
                >
                  <div className="border-b border-line px-3 pb-2.5 pt-1.5">
                    <p className="truncate text-xs font-bold text-ink dark:text-on-dark">
                      {user?.name || t('dashboard.studentName')}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-ink-soft dark:text-muted" dir="ltr">
                      {user?.email}
                    </p>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    {[
                      { to: '/profile', icon: User, label: t('nav.profile') },
                      { to: '/settings', icon: Settings, label: t('nav.settings') },
                      { to: '/', icon: Home, label: t('nav.home', 'Home') },
                      ...(user?.role === 'admin'
                        ? [{ to: '/admin', icon: ShieldCheck, label: t('nav.admin', 'Admin panel') }]
                        : []),
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          role="menuitem"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-ink transition-colors hover:bg-highlight hover:text-ink dark:text-lavender dark:hover:bg-surface-2 dark:hover:text-lavender"
                        >
                          <Icon className="h-4 w-4 text-ink-soft dark:text-lavender" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-negative transition-colors hover:bg-negative-soft dark:text-negative-ink dark:hover:bg-negative-soft"
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
          {languageButton}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={t('nav.toggleMenu', 'Toggle menu')}
            aria-expanded={mobileMenuOpen}
            className={iconButtonClass}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="animate-fade-up absolute inset-x-0 top-full border-b border-line bg-surface/95 p-4 shadow-lg backdrop-blur-xl dark:border-line dark:bg-scrim/95 md:hidden">
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3 dark:border-line dark:bg-surface-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-highlight text-xs font-bold text-ink dark:border-line-strong dark:bg-primary dark:text-on-primary">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-ink dark:text-on-dark">
                  {user?.name || t('dashboard.studentName')}
                </p>
                <p className="truncate text-[11px] text-ink-soft dark:text-muted">{user?.email}</p>
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
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm after:absolute after:bottom-0 after:start-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-on-primary dark:bg-accent dark:text-on-primary dark:after:bg-on-primary'
                      : 'text-ink hover:bg-highlight hover:text-ink dark:text-lavender dark:hover:bg-surface-2 dark:hover:text-lavender'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-on-primary' : 'text-ink-soft dark:text-lavender'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 space-y-1 border-t border-line pt-3 dark:border-line">
            {user ? (
              <>
                {[
                  { to: '/profile', icon: User, label: t('nav.profile') },
                  { to: '/settings', icon: Settings, label: t('nav.settings') },
                  { to: '/', icon: Home, label: t('nav.home', 'Home') },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-highlight hover:text-ink dark:text-lavender dark:hover:bg-surface-2 dark:hover:text-lavender"
                    >
                      <Icon className="h-5 w-5 text-ink-soft dark:text-lavender" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-negative transition-colors hover:bg-negative-soft dark:text-negative-ink dark:hover:bg-negative-soft"
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
