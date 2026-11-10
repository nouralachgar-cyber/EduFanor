import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Loader2, Upload } from '../../components/icons';
import { adminApi } from '../../lib/admin';
import { Field, Modal, SectionLabel } from './ui';

const CATEGORIES = ['cpr', 'bleeding', 'choking', 'burns', 'general'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const MAX_FILE_BYTES = 7.5 * 1024 * 1024;

const emptyForm = () => ({
  slug: '',
  title: { ar: '', en: '' },
  description: { ar: '', en: '' },
  category: 'general',
  difficulty: 'beginner',
  estimatedMinutes: 15,
  image: '',
  published: false,
});

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

export default function CourseFormModal({ open, course, onClose, onSaved }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setError('');
    if (course?.data) {
      const source = course.data;
      setForm({
        slug: source.slug || '',
        title: { ar: source.title?.ar || '', en: source.title?.en || '' },
        description: { ar: source.description?.ar || '', en: source.description?.en || '' },
        category: source.category || 'general',
        difficulty: source.difficulty || 'beginner',
        estimatedMinutes: Number.isFinite(Number(source.estimatedMinutes)) ? Number(source.estimatedMinutes) : 15,
        image: source.image || '',
        published: Boolean(source.published),
      });
    } else {
      setForm(emptyForm());
    }
    return undefined;
  }, [open, course]);

  useEffect(() => {
    if (!open || !course) return undefined;
    let cancelled = false;
    setLoadingCourse(true);
    adminApi
      .course(course.id)
      .then((data) => {
        if (!cancelled && data?.course) {
          setForm({
            slug: data.course.slug || '',
            title: { ar: data.course.title?.ar || '', en: data.course.title?.en || '' },
            description: { ar: data.course.description?.ar || '', en: data.course.description?.en || '' },
            category: data.course.category || 'general',
            difficulty: data.course.difficulty || 'beginner',
            estimatedMinutes: Number.isFinite(Number(data.course.estimatedMinutes))
              ? Number(data.course.estimatedMinutes)
              : 15,
            image: data.course.image || '',
            published: Boolean(data.course.published),
          });
        }
      })
      .catch((err) => setError(err.message || t('admin.errors.loadCourse')))
      .finally(() => !cancelled && setLoadingCourse(false));
    return () => {
      cancelled = true;
    };
  }, [open, course, t]);

  const update = (patch) =>
    setForm((previous) => ({ ...previous, ...(typeof patch === 'function' ? patch(previous) : patch) }));

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError(t('admin.courseEditor.fileTooLarge'));
      return;
    }
    setImageBusy(true);
    setError('');
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error(t('admin.courseEditor.imageReadFailed')));
        reader.readAsDataURL(file);
      });
      const result = await adminApi.uploadAsset({ dataUrl, name: file.name });
      if (!result?.url) throw new Error(t('admin.courseEditor.imageUploadFailed'));
      update((previous) => ({ image: result.url }));
    } catch (err) {
      setError(err.message || t('admin.courseEditor.imageUploadFailed'));
    } finally {
      setImageBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.slug.trim() || !form.title.ar.trim() || !form.title.en.trim() || !form.description.ar.trim() || !form.description.en.trim()) {
      setError(t('admin.courseEditor.validationBilingual'));
      return;
    }
    if (!form.image.trim()) {
      setError(t('admin.courseEditor.validationImage'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        slug: slugify(form.slug) || form.slug.trim(),
        title: { ar: form.title.ar.trim(), en: form.title.en.trim() },
        description: { ar: form.description.ar.trim(), en: form.description.en.trim() },
        category: form.category,
        difficulty: form.difficulty,
        estimatedMinutes: Number(form.estimatedMinutes) || 15,
        image: form.image.trim(),
        published: Boolean(form.published),
      };
      const saved = course
        ? await adminApi.updateCourse(course.id, payload)
        : await adminApi.createCourse(payload);
      onSaved?.(saved?.course || null, Boolean(course));
    } catch (err) {
      setError(err.message || t('admin.courseEditor.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={course ? t('admin.courseEditor.editTitle') : t('admin.courseEditor.title')}
      subtitle={t('admin.courseEditor.subtitle')}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary h-9 px-4 text-xs">
            {t('admin.common.cancel')}
          </button>
          <button type="submit" form="course-form" disabled={saving || loadingCourse || imageBusy} className="btn-primary h-9 px-4 text-xs">
            {saving ? t('admin.common.saving') : course ? t('admin.common.save') : t('admin.courseEditor.create')}
          </button>
        </>
      }
    >
      {loadingCourse ? (
        <div className="flex items-center justify-center gap-2 py-10 text-xs font-bold text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> {t('admin.common.loading')}
        </div>
      ) : (
        <form id="course-form" onSubmit={submit} className="space-y-4">
          <SectionLabel>{t('admin.courseEditor.sectionBasic')}</SectionLabel>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={`${t('admin.courseEditor.titleAr')} (${t('admin.common.ar')})`} required>
              <input
                value={form.title.ar}
                onChange={(event) => update((previous) => ({ title: { ...previous.title, ar: event.target.value } }))}
                className="input"
                dir="rtl"
                placeholder={t('admin.courseEditor.titleArPlaceholder')}
              />
            </Field>
            <Field label={`${t('admin.courseEditor.titleEn')} (${t('admin.common.en')})`} required>
              <input
                value={form.title.en}
                onChange={(event) => {
                  const value = event.target.value;
                  update((previous) => ({
                    title: { ...previous.title, en: value },
                    slug: previous.slug ? previous.slug : slugify(value),
                  }));
                }}
                className="input"
                dir="ltr"
                placeholder={t('admin.courseEditor.titleEnPlaceholder')}
              />
            </Field>
          </div>

          <Field label={t('admin.courseEditor.slug')} required hint={t('admin.courseEditor.slugHint')}>
            <input
              value={form.slug}
              onChange={(event) => update((previous) => ({ slug: event.target.value }))}
              className="input"
              dir="ltr"
              placeholder="first-aid-basics"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={`${t('admin.courseEditor.descAr')}`} required>
              <textarea
                rows={3}
                value={form.description.ar}
                onChange={(event) => update((previous) => ({ description: { ...previous.description, ar: event.target.value } }))}
                className="input resize-none"
                dir="rtl"
              />
            </Field>
            <Field label={`${t('admin.courseEditor.descEn')}`} required>
              <textarea
                rows={3}
                value={form.description.en}
                onChange={(event) => update((previous) => ({ description: { ...previous.description, en: event.target.value } }))}
                className="input resize-none"
                dir="ltr"
              />
            </Field>
          </div>

          <SectionLabel>{t('admin.courseEditor.sectionMeta')}</SectionLabel>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label={t('admin.courseEditor.category')} required>
              <select value={form.category} onChange={(event) => update((previous) => ({ category: event.target.value }))} className="input">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {t(`admin.courses.categories.${category}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.courseEditor.difficulty')} required>
              <select value={form.difficulty} onChange={(event) => update((previous) => ({ difficulty: event.target.value }))} className="input">
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {t(`admin.courses.difficulties.${difficulty}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.courses.estimatedMinutes')}>
              <input
                type="number"
                min="1"
                value={form.estimatedMinutes}
                onChange={(event) => update((previous) => ({ estimatedMinutes: event.target.value }))}
                className="input"
              />
            </Field>
          </div>

          <SectionLabel>{t('admin.courseEditor.sectionImage')}</SectionLabel>

          <div className="rounded-xl border border-line bg-surface-muted/50 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-line bg-card">
                {form.image ? (
                  <img src={form.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-ink-muted">
                    <ImageIcon className="h-5 w-5" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  value={form.image}
                  onChange={(event) => update((previous) => ({ image: event.target.value }))}
                  className="input h-9 text-xs"
                  dir="ltr"
                  placeholder={t('admin.courseEditor.imagePlaceholder')}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="btn-secondary inline-flex h-8 cursor-pointer items-center gap-1.5 px-3 text-[10px]">
                    {imageBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {imageBusy ? t('admin.courseEditor.imageUploading') : t('admin.courseEditor.imageFromPc')}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(event) => handleFile(event.target.files?.[0])}
                    />
                  </label>
                  <span className="text-[10px] font-semibold text-ink-muted">{t('admin.courseEditor.imageHint')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-line bg-surface-muted/50 px-3.5 py-3">
            <div>
              <p className="text-xs font-extrabold text-ink">{t('admin.common.published')}</p>
              <p className="text-[10px] font-semibold text-ink-muted">{t('admin.courseEditor.publishedHint')}</p>
            </div>
            <button
              type="button"
              onClick={() => update((previous) => ({ published: !previous.published }))}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${form.published ? 'bg-success' : 'bg-line-strong'}`}
              aria-pressed={form.published}
              aria-label={t('admin.common.published')}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form.published ? 'left-[1.4rem]' : 'left-0.5'}`}
              />
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-[11px] font-bold text-danger">{error}</p>
          )}
        </form>
      )}
    </Modal>
  );
}
