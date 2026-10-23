import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, Clock, BookOpen, ArrowRight, ArrowLeft, ShieldCheck, SearchX } from 'lucide-react';

export default function Courses() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // جلب المساقات من الترجمة
  const courses = t('coursesData', { returnObjects: true }) || [];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FCFAFF] dark:bg-[#17121D] text-[#1F142E] dark:text-[#F8F4FC] p-6 lg:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E9E0F5] text-[#49305D] dark:bg-[#2B2037] dark:text-[#E9E0F5]">
            <ShieldCheck className="w-4 h-4 text-[#8A6BBE]" />
            {t('coursesPage.badge')}
          </span>
          <h1 className="text-3xl lg:text-5xl font-black text-[#49305D] dark:text-white tracking-tight">
            {t('coursesPage.title')}
          </h1>
          <p className="text-xs lg:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">
            {t('coursesPage.subtitle')}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#21192B] p-4 rounded-3xl border border-[#EDE6F5] dark:border-[#3B2B4C] shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className={`absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} w-4 h-4 text-[#6B5E7C] dark:text-[#C9BED5]`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('coursesPage.searchPlaceholder')}
              className={`w-full py-3 ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'} rounded-2xl border border-[#EDE6F5] dark:border-[#3B2B4C] bg-[#FCFAFF] dark:bg-[#17121D] text-xs font-bold text-[#1F142E] dark:text-[#F8F4FC] outline-none focus:border-[#8A6BBE] transition-colors`}
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['all', 'cpr', 'choking', 'burns'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#49305D] text-white shadow-md'
                    : 'bg-[#F4EFFB] dark:bg-[#2B2037] text-[#6B5E7C] dark:text-[#C9BED5] hover:bg-[#E9E0F5]'
                }`}
              >
                {t(`filter.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                className="rounded-3xl bg-white dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] p-6 space-y-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#E9E0F5] text-[#49305D] dark:bg-[#2B2037] dark:text-[#E9E0F5]">
                      {course.level}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#6B5E7C] dark:text-[#C9BED5] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#8A6BBE]" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#49305D] dark:text-white leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDE6F5] dark:border-[#3B2B4C] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8A6BBE]">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} {t('coursesPage.lessonsCount')}</span>
                  </div>

                  <Link
                    to={`/lesson?id=${course.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#49305D] hover:bg-[#39244A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>{t('coursesPage.startCourse')}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#F4EFFB] dark:bg-[#2B2037] flex items-center justify-center text-[#8A6BBE]">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#49305D] dark:text-white">
              {t('coursesPage.emptyTitle')}
            </h3>
            <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5] max-w-sm mx-auto">
              {t('coursesPage.emptyDesc')}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-6 py-2.5 rounded-full bg-[#49305D] text-white text-xs font-bold transition-all cursor-pointer"
            >
              {t('coursesPage.resetSearch')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}