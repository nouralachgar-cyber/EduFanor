import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { adminApi, formatNumber, localize } from '../../lib/admin';
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  Modal,
  PageHeader,
  Panel,
} from '../../components/admin/ui';
import Toast from '../../components/Toast';

const categories = ['cpr', 'bleeding', 'choking', 'burns', 'general'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

const emptyCourse = {
  slug: '',
  title: { ar: '', en: '' },
  description: { ar: '', en: '' },
  category: 'cpr',
  difficulty: 'beginner',
  image: '/courses/cpr.svg',
  estimatedMinutes: 15,
  order: 0,
  published: false,
};

export default function AdminCourses() {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCourse);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .courses({ search, status })
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 280);
    return () => window.clearTimeout(timer);
  }, [search, status]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCourse);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      slug: course.slug || '',
      title: { ar: course.title?.ar || '', en: course.title?.en || '' },
      description: { ar: course.description?.ar || '', en: course.description?.en || '' },
      category: course.category || 'cpr',
      difficulty: course.difficulty || 'beginner',
      image: course.image || '/courses/cpr.svg',
      estimatedMinutes: course.estimatedMinutes || 15,
      order: course.order || 0,
      published: Boolean(course.published),
    });
    setModalOpen(true);
  };

  const updateField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));
  const updateBilingual = (field, language, value) =>
    setForm((previous) => ({ ...previous, [field]: { ...previous[field], [language]: value } }));

  const save = async (event) => {
    event.preventDefault();
    if (!form.slug.trim() || !form.title.ar.trim() || !form.title.en.trim() || !form.description.ar.trim() || !form.description.en.trim()) {
      setToast({ type: 'error', message: t('admin.courses.fieldsRequired') });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateCourse(editing._id, form);
        setToast({ type: 'success', message: t('admin.courses.courseSaved') });
      } else {
        await adminApi.createCourse(form);
        setToast({ type: 'success', message: t('admin.courses.courseCreated') });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const removeCourse = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await adminApi.deleteCourse(deleting._id);
      setToast({ type: 'success', message: t('admin.courses.courseDeleted') });
      setDeleting(null);
      load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleteBusy(false);
    }
  };

  const publishedCount = courses.filter((course) => course.published).length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.courses.title')}
        subtitle={t('admin.courses.subtitle')}
        actions={
          <>
            <button
              type="button"
              onClick={load}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={openCreate} className="btn-primary h-9 px-3.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> {t('admin.courses.newCourse')}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="sage"><BookOpen className="h-3 w-3" /> {formatNumber(courses.length, i18n.language)} {t('admin.common.courses')}</Badge>
        <Badge tone="green">{t('admin.common.published')}: {formatNumber(publishedCount, i18n.language)}</Badge>
        <Badge tone="amber">{t('admin.common.draft')}: {formatNumber(courses.length - publishedCount, i18n.language)}</Badge>
      </div>

      <Panel noPadding>
        <div className="flex flex-col gap-2.5 border-b border-line p-3.5 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.courses.searchPlaceholder')}
              className="input h-9 ps-9 text-xs"
              aria-label={t('admin.common.search')}
            />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input h-9 text-xs sm:w-40" aria-label={t('admin.common.status')}>
            <option value="">{t('admin.courses.allStatuses')}</option>
            <option value="published">{t('admin.courses.onlyPublished')}</option>
            <option value="draft">{t('admin.courses.onlyDraft')}</option>
          </select>
        </div>

        {loading && courses.length === 0 ? (
          <LoadingState label={t('admin.common.loading')} />
        ) : error ? (
          <ErrorState title={t('admin.errors.loadCourses')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />
        ) : courses.length === 0 ? (
          <EmptyState
            title={t('admin.courses.noCourses')}
            icon={BookOpen}
            action={<button type="button" onClick={openCreate} className="btn-primary h-9 px-4 text-xs"><Plus className="h-3.5 w-3.5" />{t('admin.courses.newCourse')}</button>}
          />
        ) : (
          <div className="grid gap-3 p-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article key={course._id} className="admin-card group overflow-hidden">
                <div className="relative h-36 overflow-hidden bg-surface-muted">
                  {course.image ? (
                    <img src={course.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-muted"><ImageIcon className="h-8 w-8" /></div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f1712]/70 to-transparent" />
                  <div className="absolute start-2.5 top-2.5 flex gap-1.5">
                    <Badge tone={course.published ? 'green' : 'amber'}>
                      {course.published ? t('admin.common.published') : t('admin.common.draft')}
                    </Badge>
                  </div>
                  <div className="absolute end-2.5 top-2.5 flex gap-1">
                    <button type="button" onClick={() => openEdit(course)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-primary shadow-sm backdrop-blur transition-colors hover:bg-white" aria-label={t('admin.common.edit')} title={t('admin.common.edit')}>
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setDeleting(course)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-danger shadow-sm backdrop-blur transition-colors hover:bg-white" aria-label={t('admin.common.delete')} title={t('admin.common.delete')}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="absolute inset-x-3 bottom-2.5">
                    <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-white/70">
                      {t(`admin.courses.categories.${course.category}`, { defaultValue: course.category })}
                    </p>
                    <h3 className="truncate font-display text-base font-bold text-white">{localize(course.title, i18n.language)}</h3>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="line-clamp-2 min-h-[2.4rem] text-[11px] leading-relaxed text-ink-muted">
                    {localize(course.description, i18n.language)}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    <div className="rounded-lg bg-surface-muted px-1.5 py-1.5 text-center">
                      <p className="text-[9px] font-bold text-ink-muted">{t('admin.common.lessons')}</p>
                      <p className="text-xs font-extrabold text-ink">{formatNumber(course.lessonCount || 0, i18n.language)}</p>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-1.5 py-1.5 text-center">
                      <p className="text-[9px] font-bold text-ink-muted">{t('admin.common.quizzes')}</p>
                      <p className="text-xs font-extrabold text-ink">{formatNumber(course.quizCount || 0, i18n.language)}</p>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-1.5 py-1.5 text-center">
                      <p className="text-[9px] font-bold text-ink-muted">{t('admin.courses.estimatedMinutes')}</p>
                      <p className="text-xs font-extrabold text-ink">{formatNumber(course.estimatedMinutes, i18n.language)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-ink-muted">
                      {t(`admin.courses.difficulties.${course.difficulty}`, { defaultValue: course.difficulty })}
                    </span>
                    <Link to={`/admin/courses/${course._id}`} className="inline-flex items-center gap-1 text-[10px] font-extrabold text-primary hover:underline dark:text-brand-ink">
                      {t('admin.courses.openCourse')} <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('admin.courses.editCourse') : t('admin.courses.newCourse')}
        subtitle={t('admin.courses.bilingualHint')}
        size="lg"
        footer={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary h-9 px-4 text-xs">{t('admin.common.cancel')}</button>
            <button type="submit" form="course-form" disabled={saving} className="btn-primary h-9 px-4 text-xs">
              {saving ? t('admin.common.saving') : t('admin.common.save')}
            </button>
          </>
        }
      >
        <form id="course-form" onSubmit={save} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t('admin.courses.titleAr')} required>
              <input value={form.title.ar} onChange={(event) => updateBilingual('title', 'ar', event.target.value)} className="input" dir="rtl" />
            </Field>
            <Field label={t('admin.courses.titleEn')} required>
              <input value={form.title.en} onChange={(event) => updateBilingual('title', 'en', event.target.value)} className="input" dir="ltr" />
            </Field>
            <Field label={t('admin.courses.descriptionAr')} required>
              <textarea value={form.description.ar} onChange={(event) => updateBilingual('description', 'ar', event.target.value)} className="input h-24 resize-y py-2" dir="rtl" />
            </Field>
            <Field label={t('admin.courses.descriptionEn')} required>
              <textarea value={form.description.en} onChange={(event) => updateBilingual('description', 'en', event.target.value)} className="input h-24 resize-y py-2" dir="ltr" />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label={t('admin.courses.slug')} required>
              <input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} className="input" dir="ltr" placeholder="first-aid-basics" />
            </Field>
            <Field label={t('admin.courses.category')}>
              <select value={form.category} onChange={(event) => updateField('category', event.target.value)} className="input">
                {categories.map((category) => (
                  <option key={category} value={category}>{t(`admin.courses.categories.${category}`)}</option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.courses.difficulty')}>
              <select value={form.difficulty} onChange={(event) => updateField('difficulty', event.target.value)} className="input">
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>{t(`admin.courses.difficulties.${difficulty}`)}</option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.courses.estimatedMinutes')}>
              <input type="number" min="1" value={form.estimatedMinutes} onChange={(event) => updateField('estimatedMinutes', event.target.value)} className="input" />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
            <Field label={t('admin.courses.image')}>
              <input value={form.image} onChange={(event) => updateField('image', event.target.value)} className="input" dir="ltr" placeholder="/courses/cpr.svg" />
            </Field>
            <Field label={t('admin.courses.order')}>
              <input type="number" value={form.order} onChange={(event) => updateField('order', event.target.value)} className="input" />
            </Field>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-muted px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              {form.image && <img src={form.image} alt="" className="h-10 w-16 rounded-lg object-cover" />}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-ink"><CheckCircle2 className="h-3.5 w-3.5 text-success-ink" />{t('admin.courses.published')}</p>
                <p className="text-[10px] text-ink-muted">{t('admin.common.optional')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateField('published', !form.published)}
              className={`relative h-7 w-12 rounded-full transition-colors ${form.published ? 'bg-primary' : 'bg-line-strong'}`}
              role="switch"
              aria-checked={form.published}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${form.published ? 'start-6' : 'start-1'}`} />
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={removeCourse}
        title={t('admin.common.delete')}
        message={t('admin.courses.deleteConfirm')}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
        busy={deleteBusy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
