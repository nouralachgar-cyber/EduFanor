import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Clock, BookOpen, ArrowRight, ArrowLeft, HeartPulse, Wind, Flame, CheckCircle2, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryIcons = {
  cpr: HeartPulse,
  choking: Wind,
  burns: Flame,
};

const categoryColors = {
  cpr: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
  choking: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  burns: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
};

export default function Courses() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const isAr = i18n.language === 'ar';

  const courses = t('coursesData', { returnObjects: true }) || [];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons || 0), 0);

  return (
    <div className="page-container">
      <div className="page-content py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="chip bg-brand-soft text-brand-ink">
            <HeartPulse className="h-3.5 w-3.5" />
            <span>{t('coursesPage.badge')}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            {t('coursesPage.title')}
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed">
            {t('coursesPage.subtitle')}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-6 text-center">
          <div>
            <p className="text-2xl font-extrabold text-ink">{courses.length}</p>
            <p className="text-[11px] font-bold text-ink-muted">{t('coursesPage.statsCourses')}</p>
          </div>
          <div className="w-px bg-line" />
          <div>
            <p className="text-2xl font-extrabold text-ink">{totalLessons}</p>
            <p className="text-[11px] font-bold text-ink-muted">{t('coursesPage.statsLessons')}</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className={`h-4 w-4 absolute top-1/2 -translate-y-1/2 text-ink-muted ${isAr ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('coursesPage.searchPlaceholder')}
              className={`input ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const isCompleted = localStorage.getItem(`completed_${course.id}`) === 'true';
              const CategoryIcon = categoryIcons[course.category] || HeartPulse;
              const colorClass = categoryColors[course.category] || 'bg-brand-soft text-brand-ink';

              return (
                <div key={course.id} className="course-card">
                  <div className="flex items-start justify-between">
                    <div className={`icon-box h-11 w-11 ${colorClass}`}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="chip bg-brand-soft text-brand-ink">{course.level}</span>
                      {isCompleted && (
                        <span className="chip bg-success-soft text-success-ink">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('coursesPage.completed')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-ink">{course.title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-line flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted font-bold">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{course.lessons} {t('coursesPage.lessonsCount')}</span>
                    </div>

                    <Link
                      to={`/lesson?id=${course.id}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-success-soft text-success-ink'
                          : 'bg-primary text-white hover:bg-primary-hover'
                      }`}
                    >
                      <span>
                        {isCompleted ? t('coursesPage.continueCourse') : t('coursesPage.startCourse')}
                      </span>
                      {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="icon-box h-14 w-14 bg-surface-muted text-ink-muted">
              <SearchX className="h-7 w-7" />
            </div>
            <h3 className="text-base font-extrabold text-ink">
              {t('coursesPage.emptyTitle')}
            </h3>
            <p className="text-xs text-ink-muted max-w-xs">
              {t('coursesPage.emptyDesc')}
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-secondary px-4 py-2 text-xs mt-2"
            >
              {t('coursesPage.resetSearch')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
