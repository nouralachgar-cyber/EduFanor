import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  BarChart3,
  BookOpen,
  ChevronLeft,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Users,
  X,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initials } from '../../lib/admin';
import '../../styles/admin.css';

const navGroups = [
  {
    labelKey: 'admin.shell.workspace',
    items: [
      { to: '/admin', end: true, key: 'overview', icon: LayoutDashboard, label: 'admin.shell.overview' },
      { to: '/admin/students', key: 'students', icon: Users, label: 'admin.shell.students' },
      { to: '/admin/courses', key: 'courses', icon: BookOpen, label: 'admin.shell.courses' },
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
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber text-primary shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-semibold leading-tight tracking-tight text-white">
            {t('admin.shell.brand')}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
            {t('admin.shell.subtitle')}
          </p>
        </div>
      </div>

      <div className="mx-3 mb-4 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2">
        <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/60">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </span>
          {t('admin.shell.secureArea')}
        </span>
      </div>

      <nav className="admin-scroll flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.labelKey} className={groupIndex ? 'mt-5' : ''}>
            <p className="mb-1.5 px-2.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/35">
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
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                            isActive ? 'bg-primary/10' : 'bg-white/[0.06]'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex-1">{t(item.label)}</span>
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-amber" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber text-xs font-extrabold text-primary">
            {initials(user?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-extrabold text-white">{user?.name || t('admin.shell.adminAccount')}</p>
            <p className="truncate text-[10px] text-white/50" dir="ltr">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-2 py-2 text-[10px] font-bold text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <ChevronLeft className={`h-3 w-3 ${isAr ? 'rotate-180' : ''}`} />
            {t('admin.shell.backToSite')}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/65 transition-colors hover:bg-danger/20 hover:text-white"
            aria-label={t('admin.shell.logout')}
            title={t('admin.shell.logout')}
          >
            <LogOut className="h-3.5 w-3.5" />
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
  const [search, setSearch] = useState('');
  const isAr = i18n.language === 'ar';

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
      <aside className="admin-sidebar fixed inset-y-0 start-0 z-40 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0f1712]/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label={t('admin.shell.closeMenu')}
          />
          <aside className="admin-sidebar admin-rise absolute inset-y-0 start-0 w-[17.5rem] shadow-lift">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute end-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
              aria-label={t('admin.shell.closeMenu')}
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:ps-64">
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-2 px-3 sm:px-5 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-ink lg:hidden"
              aria-label={t('admin.shell.openMenu')}
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-muted">
                <ShieldCheck className="h-3 w-3 text-amber" />
                <span className="hidden sm:inline">{t('admin.shell.secureArea')}</span>
                <span className="hidden text-line-strong sm:inline">/</span>
                <span className="truncate">{currentTitle}</span>
              </div>
              <h2 className="truncate text-sm font-extrabold text-ink sm:hidden">{currentTitle}</h2>
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

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('admin.shell.theme')}
              title={t('admin.shell.theme')}
            >
              {isDark ? <Sun className="h-4 w-4 text-amber" /> : <Moon className="h-4 w-4 text-primary" />}
            </button>

            <button
              type="button"
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-line bg-card px-2.5 text-[10px] font-extrabold text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('admin.shell.language')}
              title={t('admin.shell.language')}
            >
              <Globe className="h-3.5 w-3.5 text-primary dark:text-brand-ink" />
              {isAr ? 'EN' : 'ع'}
            </button>

            <Link
              to="/admin/settings"
              className="ms-1 hidden items-center gap-2 rounded-xl border border-line bg-card px-2.5 py-1.5 transition-colors hover:bg-surface-muted sm:flex"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-[10px] font-extrabold text-white">
                {initials(user?.name)}
              </span>
              <span className="max-w-[7rem] truncate text-[11px] font-extrabold text-ink">{user?.name}</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-3 py-5 sm:px-5 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
