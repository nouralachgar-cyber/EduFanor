import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ClipboardCheck,
  Globe,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from '../icons';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initials } from '../../lib/admin';
import { navigationOnlyClick } from '../../lib/authNavigation';
import EduFanorWordmark from '../EduFanorWordmark';
import ThemeToggle from '../ui/ThemeToggle';
import '../../styles/admin.css';
import '../../styles/buttons.css';

const lightText = 'text-[#18122B]';
const lightBg = 'bg-[#F3F1F5]';
const lightBorder = 'border-[#D8C7EB]';
const lightIconBg = 'bg-[#E5DCF2]';
const lightIconColor = 'text-[#443C68]';
const lightSecondary = 'text-[#393053]';
const lightBadgeBg = 'bg-[#E8E0F3]';
const lightBadgeBorder = 'border-[#BFA2DB]';

const darkMode = 'dark:';

const logoLight = 'text-[#18122B]';
const logoDark = 'dark:text-white';

const footerBgLight = 'bg-[#EDE7F6]';
const footerBorderLight = 'border-[#BFA2DB]';
const footerAvatarBg = 'bg-[#635985]';
const footerBtnBgLight = 'bg-[#F1F5F9]';
const footerBtnBorderLight = 'border-[#64748B]';
const footerBtnTextLight = 'text-[#0f172a]';
const footerBtnHoverLight = 'hover:bg-[#CBD5E1]';
const footerBtnBgDark = 'bg-[#1e293b]';
const footerBtnBorderDark = 'border-[#475569]';
const footerBtnTextDark = 'text-[#f8fafc]';
const footerBtnHoverDark = 'hover:bg-[#334155]';

const navGroups = [
  {
    labelKey: 'admin.shell.workspace',
    items: [
      { to: '/admin', end: true, key: 'overview', icon: LayoutDashboard, label: 'admin.shell.overview' },
      { to: '/admin/students', key: 'students', icon: Users, label: 'admin.shell.students' },
      { to: '/admin/courses', key: 'courses', icon: BookOpen, label: 'admin.shell.courses' },
      { to: '/admin/lessons', key: 'lessons', icon: Layers, label: 'admin.shell.lessons' },
      { to: '/admin/quizzes', key: 'quizzes', icon: ClipboardCheck, label: 'admin.shell.quizzes' },
      { to: '/admin/analytics', key: 'analytics', icon: BarChart3, label: 'admin.shell.analytics' },
    ],
  },
  {
    labelKey: 'admin.shell.operations',
    items: [
      { to: '/admin/activity', key: 'activity', icon: Activity, label: 'admin.shell.activity' },
      { to: '/admin/audit', key: 'audit', icon: ScrollText, label: 'admin.shell.audit' },
    ],
  },
  {
    labelKey: 'admin.shell.system',
    items: [{ to: '/admin/settings', key: 'settings', icon: Settings, label: 'admin.shell.settings' }],
  },
];

function SidebarContent({ onNavigate }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="admin-sidebar-header flex flex-col items-start gap-2 px-5 pt-6 pb-5">
        <EduFanorWordmark className={`${logoLight} ${logoDark}`} />
        <p className="admin-sidebar-subtitle text-[10px] font-bold uppercase tracking-[0.16em]">
          {t('admin.shell.subtitle')}
        </p>
      </div>

      <div className="admin-sidebar-secure mx-3 mb-4 rounded-xl border lightBorder px-3 py-2">
        <span className="admin-sidebar-secure-label flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full lightIconBg opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full lightIconBg" />
          </span>
          {t('admin.shell.secureArea')}
        </span>
      </div>

      <nav className="admin-scroll flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.labelKey} className={groupIndex ? 'mt-5' : ''}>
            <p className="admin-sidebar-group-label mb-1.5 px-2.5 text-[9px] font-extrabold uppercase tracking-[0.2em]">
              {t(group.labelKey)}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    title={t(item.label)}
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                            isActive ? 'bg-on-primary/15' : 'lightIconBg'
                          }`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${lightIconColor}`} />
                        </span>
                        <span className="admin-sidebar-nav-label flex-1">{t(item.label)}</span>
                        {isActive && <span className="admin-sidebar-active-dot h-1.5 w-1.5 rounded-full bg-current" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer border-t footerBorderLight p-3 shrink-0">
        <div className="admin-sidebar-profile mb-2 flex items-center gap-2.5 rounded-xl footerBgLight px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold lightText">
            {initials(user?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="admin-sidebar-profile-name truncate text-xs font-semibold">{user?.name || t('admin.shell.adminAccount')}</p>
            <p className="admin-sidebar-profile-email truncate text-[10px]" dir="ltr">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="admin-sidebar-footer-actions flex items-center gap-1.5">
          <Link
            to="/"
            onClick={(event) => navigationOnlyClick(event, [onNavigate])}
            className={`back-to-site-link flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border footerBorderLight px-2 py-2 text-[10px] font-bold transition-colors ${footerBtnHoverLight} ${footerBtnBgLight} ${footerBtnBorderLight}`}
            title={t('admin.shell.backToSite')}
          >
            <ChevronLeft className={`h-3 w-3 ${isAr ? 'rotate-180' : ''}`} />
            <span className="admin-sidebar-footer-label">{t('admin.shell.backToSite')}</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`logout-button flex h-11 w-11 items-center justify-center rounded-full footerBorderLight ${footerBtnTextLight} transition-colors ${footerBtnHoverLight} xl:h-8 xl:w-8`}
            aria-label={t('admin.shell.logout')}
            title={t('admin.shell.logout')}
          >
            <LogOut className="logout-icon h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  const [search, setSearch] = useState('');
  const isAr = i18n.language === 'ar';

  const menuOpen = isDesktop ? !desktopCollapsed : mobileOpen;

  const toggleSidebar = () => {
    if (isDesktop) {
      setDesktopCollapsed((value) => !value);
    } else {
      setMobileOpen((value) => !value);
    }
  };

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event) => {
      setIsDesktop(event.matches);
      setMobileOpen(false);
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const currentTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/admin') return t('admin.overview.title');
    if (path.startsWith('/admin/students')) return t('admin.students.title');
    if (path.startsWith('/admin/courses')) return t('admin.courses.title');
    if (path.startsWith('/admin/lessons')) return t('admin.lessonsPage.title');
    if (path.startsWith('/admin/quizzes')) return t('admin.quizzesPage.title');
    if (path.startsWith('/admin/analytics')) return t('admin.analytics.title');
    if (path.startsWith('/admin/activity')) return t('admin.activity.title');
    if (path.startsWith('/admin/audit')) return t('admin.audit.title');
    if (path.startsWith('/admin/settings')) return t('admin.settings.title');
    return t('admin.shell.title');
  }, [location.pathname, t]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = search.trim();
    navigate(value ? `/admin/students?search=${encodeURIComponent(value)}` : '/admin/students');
    setSearch('');
  };

  return (
    <div className="admin-shell">
      <aside
        id="admin-desktop-sidebar"
        className={`admin-sidebar fixed inset-y-0 start-0 z-40 hidden w-64 transition-[width] duration-300 ease-in-out lg:block ${
          desktopCollapsed ? 'admin-sidebar-collapsed lg:w-[4.75rem]' : 'lg:w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="admin-sidebar-overlay fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label={t('admin.shell.closeMenu')}
          />
          <aside id="admin-mobile-sidebar" className="admin-sidebar admin-rise absolute inset-y-0 start-0 w-[17.5rem] shadow-lift">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute end-3 top-4 flex h-11 w-11 items-center justify-center rounded-full lightBorder hover:bg-[#F3F1F5]/10"
              aria-label={t('admin.shell.closeMenu')}
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className={`admin-content transition-[padding] duration-300 ease-in-out ${desktopCollapsed ? 'lg:ps-[4.75rem]' : 'lg:ps-64'}`}>
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-2 px-3 sm:px-5 lg:px-8">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border lightBorder transition-colors hover:bg-[#F3F1F5]/10"
              aria-label={t(menuOpen ? 'admin.shell.closeMenu' : 'admin.shell.openMenu')}
              aria-expanded={menuOpen}
              aria-controls={isDesktop ? 'admin-desktop-sidebar' : 'admin-mobile-sidebar'}
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold lightSecondary">
                <ShieldCheck className="h-3 w-3 lightText" />
                <span className="hidden sm:inline lightText">{t('admin.shell.secureArea')}</span>
                <span className="hidden text-line-strong sm:inline">/</span>
                <span className="truncate lightText">{currentTitle}</span>
              </div>
              <h2 className="truncate text-sm font-extrabold lightText sm:hidden">{currentTitle}</h2>
            </div>

            <form onSubmit={handleSearch} className="relative hidden w-64 md:block xl:w-80">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('admin.shell.searchPlaceholder')}
                className="input h-9 ps-9 text-xs"
                aria-label={t('admin.common.search')}
              />
            </form>

            <ThemeToggle
              checked={isDark}
              onChange={toggleTheme}
              className="scale-[0.68] origin-center"
              ariaLabel="Toggle dark mode"
            />

            <button
              type="button"
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="flex h-11 items-center gap-1.5 rounded-xl border lightBorder px-2.5 text-[10px] font-extrabold lightText transition-colors hover:bg-lightBg xl:h-9"
              aria-label={t('admin.shell.language')}
              title={t('admin.shell.language')}
            >
              <Globe className="h-3.5 w-3.5 lightText" />
              {isAr ? 'EN' : 'ع'}
            </button>

            <Link
              to="/admin/settings"
              className="ms-1 hidden items-center gap-2 rounded-xl border lightBorder px-2.5 py-1.5 transition-colors hover:bg-lightBg sm:flex"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-lightText">
                {initials(user?.name)}
              </span>
              <span className="max-w-[7rem] truncate text-[11px] font-extrabold lightText">{user?.name}</span>
            </Link>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
