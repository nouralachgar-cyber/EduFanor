import React, { useState, useEffect } from 'react';
import { Sun, Moon, Globe, User, Lock, Save, Bell } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('ar');
  const [name, setName] = useState('نورا لجار');
  const [email, setEmail] = useState('nlachgar12@gmail.com');
  const [notifications, setNotifications] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  // تحميل الإعدادات المحفوظة
  useEffect(() => {
    const savedTheme = localStorage.getItem('edu_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  const handleThemeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edu_theme', 'light');
    }
  };

  const handleLanguageChange = (selectedLang) => {
    setLang(selectedLang);
    document.documentElement.setAttribute('dir', selectedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', selectedLang);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-burgundy dark:text-cream">
          {lang === 'ar' ? 'إعدادات المنصة والحساب' : 'Platform & Account Settings'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {lang === 'ar' ? 'قم بتخصيص تجربتك التعليمية في أكاديمية EduFanor.' : 'Customize your learning experience on EduFanor academy.'}
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-xl bg-green-100 border border-green-300 text-green-700 font-medium">
          {lang === 'ar' ? '✓ تم حفظ التغييرات بنجاح!' : '✓ Changes saved successfully!'}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Appearance & Theme Settings */}
        <div className="bg-white dark:bg-cream-darkCard border border-cream dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-burgundy dark:text-cream flex items-center gap-2">
            <Sun className="w-5 h-5 text-medicalRed" />
            {lang === 'ar' ? 'المظهر والوضع الليلي' : 'Appearance & Dark Mode'}
          </h2>
          <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {lang === 'ar' ? 'الوضع الليلي (Dark Mode)' : 'Dark Mode'}
              </p>
              <p className="text-sm text-gray-500">
                {lang === 'ar' ? 'تخفيف الإضاءة لحماية العين أثناء الدراسة ليلاً' : 'Reduce eye strain during night study sessions'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleThemeToggle}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                darkMode ? 'bg-burgundy' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  darkMode ? (lang === 'ar' ? '-translate-x-8' : 'translate-x-8') : (lang === 'ar' ? '-translate-x-1' : 'translate-x-1')
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-cream-darkCard border border-cream dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-burgundy dark:text-cream flex items-center gap-2">
            <Globe className="w-5 h-5 text-medicalRed" />
            {lang === 'ar' ? 'لغة المنصة' : 'Platform Language'}
          </h2>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleLanguageChange('ar')}
              className={`p-4 rounded-xl border-2 font-bold transition-all ${
                lang === 'ar'
                  ? 'border-burgundy bg-burgundy/10 text-burgundy dark:text-cream'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              العربية (الافتراضية)
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`p-4 rounded-xl border-2 font-bold transition-all ${
                lang === 'en'
                  ? 'border-burgundy bg-burgundy/10 text-burgundy dark:text-cream'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white dark:bg-cream-darkCard border border-cream dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-burgundy dark:text-cream flex items-center gap-2">
            <User className="w-5 h-5 text-medicalRed" />
            {lang === 'ar' ? 'معلومات الحساب الشخصي' : 'Personal Account Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-burgundy outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-burgundy outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-hover text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-5 h-5" />
            {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}