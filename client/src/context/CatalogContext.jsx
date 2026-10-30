import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../lib/api';

export const CatalogContext = createContext({
  courses: [],
  loading: true,
  source: 'local',
  refresh: () => {},
});

const levelLabels = {
  beginner: { ar: 'مبتدئ', en: 'Beginner' },
  intermediate: { ar: 'متوسط', en: 'Intermediate' },
  advanced: { ar: 'متقدم', en: 'Advanced' },
};

function mapCourse(course, isAr) {
  const lang = isAr ? 'ar' : 'en';
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  return {
    id: course.slug,
    databaseId: course._id,
    category: course.category,
    title: course.title?.[lang] || course.title?.en || course.slug,
    description: course.description?.[lang] || course.description?.en || '',
    duration: `${course.estimatedMinutes || 15} ${isAr ? 'دقيقة' : 'mins'}`,
    minutes: course.estimatedMinutes || 15,
    lessons: lessons.length || course.lessonCount || 0,
    level: levelLabels[course.difficulty]?.[lang] || course.difficulty || '',
    difficulty: course.difficulty,
    published: Boolean(course.published),
    image: course.image,
    steps: lessons
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((lesson) => ({
        id: lesson._id,
        title: lesson.title?.[lang] || lesson.title?.en || '',
        content: lesson.content?.[lang] || lesson.content?.en || '',
        warning: lesson.safetyNotes?.[lang] || lesson.safetyNotes?.en || '',
        objectives: lesson.objectives?.[lang] || [],
        sourceRefs: lesson.sourceRefs || [],
        reviewStatus: lesson.reviewStatus,
      })),
  };
}

export function CatalogProvider({ children }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [dbCourses, setDbCourses] = useState(null);
  const [loading, setLoading] = useState(true);

  const localCourses = useMemo(() => {
    const courses = t('coursesData', { returnObjects: true });
    return Array.isArray(courses) ? courses : [];
  }, [t, i18n.language]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/courses');
      const list = Array.isArray(data) ? data : [];
      setDbCourses(list.length ? list.map((course) => mapCourse(course, isAr)) : null);
    } catch {
      setDbCourses(null);
    } finally {
      setLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    load();
  }, [load]);

  const courses = dbCourses && dbCourses.length ? dbCourses : localCourses;

  return (
    <CatalogContext.Provider
      value={{
        courses,
        loading,
        source: dbCourses && dbCourses.length ? 'database' : 'local',
        refresh: load,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
