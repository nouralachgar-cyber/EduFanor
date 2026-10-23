import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import CourseArt from './CourseArt';

export default function CourseCard({ course, completed = false }) {
  const { t } = useTranslation();

  return (
    <article className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <CourseArt category={course.category} completed={completed} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="chip bg-brand-soft text-brand-ink">{course.level}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
        </div>

        <h3 className="text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-brand-ink">
          {course.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">{course.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted">
            <BookOpen className="h-4 w-4 text-brand-ink" />
            {t('dashboard.courseMeta.lessons', { count: course.lessons })}
          </span>

          {completed ? (
            <span className="chip bg-success-soft px-3.5 py-2 text-success-ink">
              <CheckCircle2 className="h-4 w-4" />
              {t('coursesPage.completed')}
            </span>
          ) : (
            <Link
              to={`/lesson?id=${course.id}`}
              className="btn-primary px-4 py-2 text-xs"
            >
              {t('dashboard.exploreSection.viewCourse')}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
