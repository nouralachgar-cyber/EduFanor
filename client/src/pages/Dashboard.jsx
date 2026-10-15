import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Settings as SettingsIcon, Award, Activity, LogOut, CheckCircle2 } from 'lucide-react';
import Settings from './Settings';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[88vh] bg-cream-light dark:bg-cream-dark flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-cream-darkCard border-e border-cream dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-8">
          
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-cream/50 dark:bg-gray-800/50">
            <div className="w-12 h-12 rounded-xl bg-burgundy text-white flex items-center justify-center font-bold text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
            </div>
            <div>
              <h3 className="font-bold text-burgundy dark:text-cream">{user?.name || 'طالبة أكاديمية'}</h3>
              <p className="text-xs text-gray-500">{user?.email || 'student@edufanor.com'}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-burgundy text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-800'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>{t('dashboard.overview', 'نظرة عامة')}</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'courses'
                  ? 'bg-burgundy text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-800'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>{t('dashboard.coursesTab', 'مساقاتي')}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-burgundy text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-800'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>{t('dashboard.settingsTab', 'إعدادات الحساب')}</span>
            </button>
          </nav>

        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-medicalRed font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('dashboard.logout', 'تسجيل الخروج')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-burgundy dark:text-cream">
                {t('dashboard.welcome')}، {user?.name || 'زائر'} 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('dashboard.subtitle')}
              </p>
            </div>

            {/* Stats Cards (صفرية إلى حين إضافة المحتوى) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-cream-darkCard p-6 rounded-2xl border border-cream dark:border-gray-800 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-medicalRed" />
                </div>
                <h4 className="text-gray-500 text-sm font-semibold">{t('dashboard.coursesEnrolled')}</h4>
                <p className="text-3xl font-extrabold text-burgundy dark:text-cream">0</p>
              </div>

              <div className="bg-white dark:bg-cream-darkCard p-6 rounded-2xl border border-cream dark:border-gray-800 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-medicalRed" />
                </div>
                <h4 className="text-gray-500 text-sm font-semibold">{t('dashboard.completedLessons')}</h4>
                <p className="text-3xl font-extrabold text-burgundy dark:text-cream">0</p>
              </div>

              <div className="bg-white dark:bg-cream-darkCard p-6 rounded-2xl border border-cream dark:border-gray-800 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                  <Award className="w-5 h-5 text-medicalRed" />
                </div>
                <h4 className="text-gray-500 text-sm font-semibold">{t('dashboard.quizAverage')}</h4>
                <p className="text-3xl font-extrabold text-burgundy dark:text-cream">-</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-extrabold text-burgundy dark:text-cream">{t('dashboard.myCoursesTitle')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('dashboard.myCoursesDesc')}</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fadeIn">
            <Settings />
          </div>
        )}

      </main>

    </div>
  );
}