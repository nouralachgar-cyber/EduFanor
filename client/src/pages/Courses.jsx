import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, Clock, BookOpen, ArrowRight, ArrowLeft, ShieldCheck, SearchX, CheckCircle2 } from 'lucide-react';
import CourseArt from '../components/CourseArt';
import { isCourseCompleted } from '../lib/progress';
import { useCatalog } from '../context/CatalogContext';

export default function Courses() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { courses } = useCatalog();
  const courseList = Array.isArray(courses) ? courses : [];
  const completedCount = courseList.filter((course) => isCourseCompleted(course.id)).length;

  const filteredCourses = courseList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <div className="page-content space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-pop sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 90% 8%, rgba(245,158,66,0.13), transparent 44%), radial-gradient(circle at 4% 100%, rgba(120,155,131,0.18), transparent 52%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="chip bg-brand-soft text-brand-ink">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t('coursesPage.badge')}
              </span>
              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {t('coursesPage.title')}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
                {t('coursesPage.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-line bg-surface/80 px-5 py-4 text-center backdrop-blur-sm">
                <p className="font-display text-2xl font-semibold text-ink">{courseList.length}</p>
                <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-muted">
                  {t('coursesPage.statsCourses')}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface/80 px-5 py-4 text-center backdrop-blur-sm">
                <p className="font-display text-2xl font-semibold text-accent">{completedCount}</p>
                <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-muted">
                  {t('coursesPage.completed')}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted ${
                isAr ? 'right-4' : 'left-4'
              }`}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('coursesPage.searchPlaceholder')}
              className={`input ${isAr ? 'pr-11' : 'pl-11'}`}
            />
          </div>

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['all', 'cpr', 'choking', 'burns'].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-muted text-ink-muted hover:text-ink'
                }`}
              >
                {t(`filter.${category}`)}
              </button>
            ))}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => {
              const completed = isCourseCompleted(course.id);
              return (
                <article
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-pop"
                >
                  <CourseArt category={course.category} completed={completed} />

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="chip bg-brand-soft text-brand-ink">{course.level}</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-muted">
                        <Clock className="h-3.5 w-3.5 text-accent" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                        {course.title}
                      </h2>
                      <p className="line-clamp-2 text-xs leading-relaxed text-ink-muted">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-muted">
                        <BookOpen className="h-4 w-4 text-teal-deep" />
                        <span>
                          {course.lessons} {t('coursesPage.lessonsCount')}
                        </span>
                      </div>

                      <Link
                        to={`/lesson?id=${course.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                          completed
                            ? 'bg-success-soft text-success-ink hover:opacity-90'
                            : 'bg-primary text-white hover:bg-primary-hover'
                        }`}
                      >
                        {completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                        <span>
                          {completed ? t('coursesPage.continueCourse') : t('coursesPage.startCourse')}
                        </span>
                        {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="icon-box h-14 w-14 bg-surface-muted text-ink-muted">
              <SearchX className="h-7 w-7" />
            </div>
            <h2 className="text-base font-extrabold text-ink">{t('coursesPage.emptyTitle')}</h2>
            <p className="max-w-sm text-xs leading-relaxed text-ink-muted">{t('coursesPage.emptyDesc')}</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-secondary mt-2 px-4 text-xs"
            >
              {t('coursesPage.resetSearch')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
