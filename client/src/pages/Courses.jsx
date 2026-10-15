import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Heart, ShieldAlert, BookOpen, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Courses() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy/10 text-burgundy dark:text-cream text-xs font-bold">
          <Heart className="w-4 h-4 text-medicalRed fill-medicalRed" />
          <span>{t('coursesPage.badge')}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-burgundy dark:text-cream">
          {t('coursesPage.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm">
          {t('coursesPage.subtitle')}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-cream-darkCard p-4 rounded-3xl border border-cream dark:border-gray-800 shadow-sm">
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-burgundy text-white shadow-md'
                : 'bg-cream/50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('coursesPage.categories.all')}
          </button>
          <button
            onClick={() => setSelectedCategory('cpr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'cpr'
                ? 'bg-burgundy text-white shadow-md'
                : 'bg-cream/50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('coursesPage.categories.cpr')}
          </button>
          <button
            onClick={() => setSelectedCategory('bleeding')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'bleeding'
                ? 'bg-burgundy text-white shadow-md'
                : 'bg-cream/50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('coursesPage.categories.bleeding')}
          </button>
          <button
            onClick={() => setSelectedCategory('burns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'burns'
                ? 'bg-burgundy text-white shadow-md'
                : 'bg-cream/50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('coursesPage.categories.burns')}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder={t('coursesPage.searchPlaceholder')}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-burgundy"
          />
        </div>

      </div>

    </div>
  );
}