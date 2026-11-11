import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardCheck,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from '../../components/icons';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: t('admin.nav.overview', 'Overview') },
    { to: '/admin/courses', icon: BookOpen, label: t('admin.nav.courses', 'Courses') },
    { to: '/admin/lessons', icon: FileText, label: t('admin.nav.lessons', 'Lessons') },
    { to: '/admin/quizzes', icon: ClipboardCheck, label: t('admin.nav.quizzes', 'Quizzes') },
    { to: '/admin/students', icon: Users, label: t('admin.nav.students', 'Students') },
    { to: '/admin/settings', icon: Settings, label: t('admin.nav.settings', 'Settings') },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#642D3D] flex font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#642D3D]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 z-50 flex w-72 flex-col border-e border-[#CBAEB1]/40 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : isAr ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-20 items-center justify-between border-b border-[#CBAEB1]/30 px-6 bg-[#E9D8D9]/50">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#642D3D] text-[#E9D8D9] shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#CBAEB1]" />
            </span>
            <div>
              <p className="font-display text-sm font-extrabold text-[#642D3D]">EduFanor Admin</p>
              <p className="text-[10px] font-bold text-[#642D3D]/60">Management Console</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setSidebarOpen(false)} 
            className="rounded-xl p-2 text-[#642D3D]/70 hover:bg-[#CBAEB1]/20 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#642D3D]/50">
            {t('admin.shell.navigation', 'Navigation')}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-extrabold transition-all ${
                  active 
                    ? 'bg-[#642D3D] text-[#E9D8D9] shadow-md shadow-[#642D3D]/15' 
                    : 'text-[#642D3D]/80 hover:bg-[#E9D8D9] hover:text-[#642D3D]'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-[#CBAEB1]' : 'text-[#642D3D]/60'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-[#CBAEB1]/30 p-4 bg-[#E9D8D9]/30">
          <div className="flex items-center gap-3 rounded-2xl border border-[#CBAEB1]/40 bg-white p-3.5 shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#642D3D] text-xs font-extrabold text-[#E9D8D9]">
              {user?.name?.[0] || 'A'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-extrabold text-[#642D3D]">{user?.name || 'Administrator'}</p>
              <p className="truncate text-[10px] text-[#642D3D]/60" dir="ltr">{user?.email || 'admin@edufanor.com'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition-colors"
              title={t('admin.settings.signOut', 'Sign Out')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#CBAEB1]/40 bg-white/95 px-6 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBAEB1] bg-[#E9D8D9] text-[#642D3D] lg:hidden shadow-sm"
            >
              <Menu className="h-5 w-5 text-[#CBAEB1]" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CBAEB1]/50 bg-[#E9D8D9] px-3 py-1 text-xs font-extrabold text-[#642D3D]">
                <Sparkles className="h-3.5 w-3.5 text-[#CBAEB1]" />
                EduFanor Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="rounded-xl border border-[#CBAEB1] bg-[#E9D8D9] px-3.5 py-2 text-xs font-extrabold text-[#642D3D] hover:bg-[#CBAEB1]/30 transition-colors shadow-sm"
            >
              {isAr ? 'English' : 'العربية'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}