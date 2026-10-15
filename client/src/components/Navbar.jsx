import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Globe, Menu, X, ShieldAlert, User, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('edu_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edu_theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edu_theme', 'dark');
      setDarkMode(true);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream-light dark:bg-cream-dark border-b border-cream dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-burgundy flex items-center justify-center text-white shadow-md">
              <ShieldAlert className="w-6 h-6 text-medicalRed" />
            </div>
            <span className="text-2xl font-extrabold text-burgundy dark:text-cream tracking-tight">
              Edu<span className="text-medicalRed">Fanor</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-700 dark:text-gray-200">
            <Link to="/" className="hover:text-burgundy dark:hover:text-medicalRed transition-colors">
              {t('nav.home', 'الرئيسية')}
            </Link>
            <Link to="/courses" className="hover:text-burgundy dark:hover:text-medicalRed transition-colors">
              {t('nav.courses', 'الدورات')}
            </Link>
            <Link to="/ai-tutor" className="hover:text-burgundy dark:hover:text-medicalRed transition-colors">
              {t('nav.aiTutor', 'المساعد الذكي')}
            </Link>
          </div>

          {/* Controls & User State */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-cream dark:bg-gray-800 text-burgundy dark:text-yellow-400 hover:scale-105 transition-all shadow-sm"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cream dark:bg-gray-800 text-burgundy dark:text-cream text-sm font-bold shadow-sm"
            >
              <Globe className="w-4 h-4 text-medicalRed" />
              <span>{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Ila kan user msajjel, ghadi يبان Dashboard & Profil */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-hover text-white font-bold shadow-md transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav.dashboard', 'لوحة التحكم')}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-medicalRed hover:bg-red-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Ila ma-kansher msajjel, ghadi يبان Login wa Register */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4.5 py-2 rounded-xl text-burgundy dark:text-cream font-semibold hover:bg-burgundy/10 transition-colors"
                >
                  {t('nav.login', 'تسجيل الدخول')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-hover text-white font-bold shadow-md transition-all"
                >
                  {t('nav.getStarted', 'ابدأ الآن')}
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}