import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  GripVertical,
  Heading,
  Heading2,
  Image as ImageIcon,
  ImagePlus,
  Images,
  Info,
  Lightbulb,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Loader2,
  Paperclip,
  Play,
  Plus,
  ShieldCheck,
  Table as TableIcon,
  Trash2,
  Type,
  Upload,
  Video,
  MonitorPlay,
} from 'lucide-react';
import { adminApi } from '../../lib/admin';
import { extractYouTubeId } from '../LessonBlocks';

export const BLOCK_TYPES = [
  { value: 'heading', labelKey: 'headingBlock', icon: Heading },
  { value: 'subheading', labelKey: 'subheadingBlock', icon: Heading2 },
  { value: 'paragraph', labelKey: 'paragraphBlock', icon: Type },
  { value: 'numbered-list', labelKey: 'numberedListBlock', icon: ListOrdered },
  { value: 'list', labelKey: 'listBlock', icon: List },
  { value: 'image', labelKey: 'imageBlock', icon: ImageIcon },
  { value: 'gallery', labelKey: 'galleryBlock', icon: Images },
  { value: 'figure', labelKey: 'figureBlock', icon: ImagePlus },
  { value: 'important', labelKey: 'importantBlock', icon: Info },
  { value: 'warning', labelKey: 'warningBlock', icon: AlertTriangle },
  { value: 'safety', labelKey: 'safetyBlock', icon: ShieldCheck },
  { value: 'tip', labelKey: 'tipBlock', icon: Lightbulb },
  { value: 'steps', labelKey: 'stepsBlock', icon: ListChecks },
  { value: 'table', labelKey: 'tableBlock', icon: TableIcon },
  { value: 'youtube', labelKey: 'youtubeBlock', icon: MonitorPlay },
  { value: 'video', labelKey: 'videoBlock', icon: Video },
  { value: 'attachment', labelKey: 'attachmentBlock', icon: Paperclip },
];

const TEXT_TYPES = new Set(['paragraph', 'text', 'rich-text', 'heading', 'subheading', 'important', 'warning', 'safety', 'tip', 'callout']);
const LIST_TYPES = new Set(['list', 'numbered-list']);
const MEDIA_TYPES = new Set(['image', 'figure', 'gallery', 'youtube', 'video', 'attachment']);
const CALLOUT_TYPES = new Set(['important', 'warning', 'safety', 'tip']);

const uid = () => `block-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const MAX_FILE_BYTES = 7.5 * 1024 * 1024;

const isHttpUrl = (value) => /^https?:\/\/\S+/i.test(String(value || '').trim());

const ACCEPT_BY_KIND = {
  image: 'image/png,image/jpeg,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/ogg',
  file: 'image/png,image/jpeg,image/webp,image/gif,application/pdf',
};

export function blankBlock(type = 'paragraph') {
  const base = {
    id: uid(),
    type,
    content: { ar: '', en: '' },
    data: {},
  };
  if (type === 'image' || type === 'figure') {
    base.data = { url: '', alt: { ar: '', en: '' }, caption: { ar: '', en: '' } };
  } else if (type === 'gallery') {
    base.data = { images: [{ id: uid(), url: '', caption: { ar: '', en: '' } }] };
  } else if (type === 'youtube' || type === 'video') {
    base.data = { url: '', title: { ar: '', en: '' } };
  } else if (LIST_TYPES.has(type)) {
    base.data = { items: { ar: [], en: [] } };
  } else if (type === 'steps') {
    base.data = { steps: [{ id: uid(), title: { ar: '', en: '' }, content: { ar: '', en: '' }, image: '' }] };
  } else if (type === 'table') {
    base.data = { headers: { ar: [], en: [] }, rows: { ar: [], en: [] } };
  } else if (type === 'attachment') {
    base.data = { url: '', name: { ar: '', en: '' } };
  }
  return base;
}

const bilingual = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { ar: String(value.ar || ''), en: String(value.en || '') };
  }
  const text = typeof value === 'string' ? value : '';
  return { ar: text, en: text };
};

const lines = (value) => {
  if (Array.isArray(value)) return value.map((item) => (typeof item === 'string' ? item : '')).filter(Boolean);
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

const tableRows = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((row) => (Array.isArray(row) ? row.map((cell) => String(cell ?? '')) : []));
};

const galleryItemsOf = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list.map((item) => {
    if (typeof item === 'string') return { id: uid(), url: item, caption: { ar: '', en: '' } };
    return { id: item.id || uid(), url: String(item.url || ''), caption: bilingual(item.caption) };
  });
};

export function normalizeBlocks(blocks) {
  const arBlocks = Array.isArray(blocks?.ar) ? blocks.ar : Array.isArray(blocks) ? blocks : [];
  const enBlocks = Array.isArray(blocks?.en) ? blocks.en : arBlocks;
  const total = Math.max(arBlocks.length, enBlocks.length);
  return Array.from({ length: total }).map((_, index) => {
    const ar = arBlocks[index] || {};
    const en = enBlocks[index] || ar;
    const type = ar.type || en.type || 'paragraph';
    const draft = blankBlock(type);
    draft.content = {
      ar: typeof ar.content === 'string' ? ar.content : bilingual(ar.content).ar,
      en: typeof en.content === 'string' ? en.content : bilingual(en.content).en,
    };
    const arData = ar.data || {};
    const enData = en.data || {};

    if (type === 'image' || type === 'figure') {
      draft.data = {
        url: arData.url || arData.src || enData.url || enData.src || '',
        alt: { ar: arData.alt || '', en: enData.alt || '' },
        caption: {
          ar: typeof arData.caption === 'string' ? arData.caption : bilingual(arData.caption).ar,
          en: typeof enData.caption === 'string' ? enData.caption : bilingual(enData.caption).en,
        },
      };
    } else if (type === 'gallery') {
      const arItems = galleryItemsOf(arData.images ?? arData.urls);
      const enItems = galleryItemsOf(enData.images ?? enData.urls);
      draft.data = {
        images: Array.from({ length: Math.max(arItems.length, enItems.length) }).map((_, itemIndex) => ({
          id: arItems[itemIndex]?.id || enItems[itemIndex]?.id || uid(),
          url: arItems[itemIndex]?.url || enItems[itemIndex]?.url || '',
          caption: {
            ar: arItems[itemIndex]?.caption?.ar || arItems[itemIndex]?.caption || '',
            en: enItems[itemIndex]?.caption?.en || enItems[itemIndex]?.caption || '',
          },
        })),
      };
    } else if (type === 'youtube' || type === 'video') {
      draft.data = {
        url: arData.url || arData.src || enData.url || enData.src || '',
        title: {
          ar: typeof arData.title === 'string' ? arData.title : bilingual(arData.title).ar,
          en: typeof enData.title === 'string' ? enData.title : bilingual(enData.title).en,
        },
      };
    } else if (LIST_TYPES.has(type)) {
      draft.data = {
        items: {
          ar: lines(arData.items ?? ar.content),
          en: lines(enData.items ?? en.content),
        },
      };
    } else if (type === 'steps') {
      const arSteps = Array.isArray(arData.steps) ? arData.steps : [];
      const enSteps = Array.isArray(enData.steps) ? enData.steps : [];
      const stepCount = Math.max(arSteps.length, enSteps.length, 1);
      draft.data = {
        steps: Array.from({ length: stepCount }).map((_, stepIndex) => {
          const arStep = arSteps[stepIndex] || {};
          const enStep = enSteps[stepIndex] || arStep;
          return {
            id: uid(),
            title: {
              ar: typeof arStep.title === 'string' ? arStep.title : bilingual(arStep.title).ar,
              en: typeof enStep.title === 'string' ? enStep.title : bilingual(enStep.title).en,
            },
            content: {
              ar: typeof arStep.content === 'string' ? arStep.content : bilingual(arStep.content).ar,
              en: typeof enStep.content === 'string' ? enStep.content : bilingual(enStep.content).en,
            },
            image: arStep.image || enStep.image || '',
          };
        }),
      };
    } else if (type === 'table') {
      draft.data = {
        headers: {
          ar: lines(arData.headers ?? ar.content?.headers),
          en: lines(enData.headers ?? en.content?.headers),
        },
        rows: {
          ar: tableRows(arData.rows ?? ar.content?.rows),
          en: tableRows(enData.rows ?? en.content?.rows),
        },
      };
    } else if (type === 'attachment') {
      draft.data = {
        url: arData.url || arData.src || enData.url || enData.src || '',
        name: {
          ar: typeof arData.name === 'string' ? arData.name : bilingual(arData.name).ar,
          en: typeof enData.name === 'string' ? enData.name : bilingual(enData.name).en,
        },
      };
    }
    return draft;
  });
}

const localizedStep = (step, lang) => ({
  title: String(step.title?.[lang] || ''),
  content: String(step.content?.[lang] || ''),
  image: String(step.image || ''),
});

export function localizeBlock(block, lang) {
  const type = block.type;
  const content = String(block.content?.[lang] || '');
  if (type === 'image' || type === 'figure') {
    return {
      type,
      content,
      data: {
        url: block.data.url,
        alt: String(block.data.alt?.[lang] || ''),
        caption: String(block.data.caption?.[lang] || ''),
      },
    };
  }
  if (type === 'gallery') {
    return {
      type,
      content,
      data: {
        images: (block.data.images || [])
          .filter((item) => item.url)
          .map((item) => ({
            url: item.url,
            caption: String(item.caption?.[lang] || ''),
          })),
      },
    };
  }
  if (type === 'youtube' || type === 'video') {
    return {
      type,
      content,
      data: { url: block.data.url, title: String(block.data.title?.[lang] || '') },
    };
  }
  if (LIST_TYPES.has(type)) {
    return { type, content, data: { items: [...(block.data.items?.[lang] || [])] } };
  }
  if (type === 'steps') {
    return {
      type,
      content,
      data: { steps: (block.data.steps || []).map((step) => localizedStep(step, lang)) },
    };
  }
  if (type === 'table') {
    return {
      type,
      content,
      data: {
        headers: [...(block.data.headers?.[lang] || [])],
        rows: (block.data.rows?.[lang] || []).map((row) => [...row]),
      },
    };
  }
  if (type === 'attachment') {
    return { type, content, data: { url: block.data.url, name: String(block.data.name?.[lang] || '') } };
  }
  return { type, content };
}

export function serializeBlocks(blocks) {
  const drafts = Array.isArray(blocks) ? blocks : [];
  return {
    ar: drafts.map((block, index) => ({ ...localizeBlock(block, 'ar'), order: index })),
    en: drafts.map((block, index) => ({ ...localizeBlock(block, 'en'), order: index })),
  };
}

export function previewBlocks(blocks, lang) {
  const drafts = Array.isArray(blocks) ? blocks : [];
  return drafts
    .map((block) => localizeBlock(block, lang))
    .filter((localized) => {
      if (TEXT_TYPES.has(localized.type)) return Boolean(localized.content?.trim());
      if (localized.type === 'gallery') return Boolean(localized.data?.images?.length);
      if (MEDIA_TYPES.has(localized.type)) return Boolean(localized.data?.url);
      if (LIST_TYPES.has(localized.type)) return Boolean(localized.data?.items?.length);
      if (localized.type === 'steps') return Boolean(localized.data?.steps?.length);
      if (localized.type === 'table') return Boolean(localized.data?.headers?.length || localized.data?.rows?.length);
      return Boolean(localized.content?.trim());
    });
}

export const hasBlockContent = (blocks) =>
  Array.isArray(blocks) &&
  blocks.some((block) => {
    if (TEXT_TYPES.has(block.type)) return Boolean(block.content?.ar?.trim() || block.content?.en?.trim());
    if (block.type === 'gallery') {
      return Boolean((block.data?.images || []).some((item) => String(item.url || '').trim()));
    }
    if (block.type === 'image' || block.type === 'figure' || block.type === 'youtube' || block.type === 'video' || block.type === 'attachment') {
      return Boolean(block.data?.url?.trim());
    }
    if (LIST_TYPES.has(block.type)) {
      return Boolean(block.data?.items?.ar?.length || block.data?.items?.en?.length);
    }
    if (block.type === 'steps') {
      return Boolean(
        block.data?.steps?.some(
          (step) => step.title?.ar?.trim() || step.title?.en?.trim() || step.content?.ar?.trim() || step.content?.en?.trim()
        )
      );
    }
    if (block.type === 'table') {
      return Boolean(
        block.data?.headers?.ar?.length ||
          block.data?.headers?.en?.length ||
          block.data?.rows?.ar?.length ||
          block.data?.rows?.en?.length
      );
    }
    return false;
  });

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('read error'));
    reader.readAsDataURL(file);
  });

function AssetUploader({ kind = 'image', onUploaded }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    setError('');
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError(t('admin.courses.blocks.fileTooLarge'));
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const result = await adminApi.uploadAsset({ dataUrl, name: file.name });
      if (!result?.url) throw new Error(t('admin.courses.blocks.uploadFailed'));
      onUploaded(result.url);
    } catch (err) {
      setError(err.message || t('admin.courses.blocks.uploadFailed'));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const hints = {
    image: 'uploadHintImage',
    video: 'uploadHintVideo',
    file: 'uploadHintFile',
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-[10px] font-extrabold text-ink transition-colors hover:bg-surface-muted disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {busy ? t('admin.courses.blocks.uploading') : t('admin.courses.blocks.upload')}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_BY_KIND[kind] || ACCEPT_BY_KIND.image}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <span className="text-[10px] font-semibold text-ink-muted">{t(`admin.courses.blocks.${hints[kind] || hints.image}`)}</span>
      {error && <p className="text-[10px] font-bold text-danger">{error}</p>}
    </div>
  );
}

function UrlPreview({ url }) {
  const valid = isHttpUrl(url);
  if (!valid) {
    return (
      <div className="flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-danger/40 bg-danger-soft px-3 text-center text-[10px] font-bold text-danger">
        <Link2 className="h-4 w-4" />
        <span className="break-all">{url.slice(0, 80)}</span>
      </div>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-line bg-surface-muted">
      <img src={url} alt="" className="max-h-56 w-full object-contain" loading="lazy" />
      <div className="flex justify-center border-t border-line bg-card py-1">
        <ExternalLink className="h-3 w-3 text-ink-muted" />
      </div>
    </a>
  );
}

function MiniImageTab({ url }) {
  if (!url) {
    return (
      <div className="flex h-28 w-full items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface-muted text-line-strong">
        <ImageIcon className="h-6 w-6" />
      </div>
    );
  }
  return <UrlPreview url={url} />;
}

function BilingualRow({ label, value, onChange, multiline = true, rows = 3, placeholderAr, placeholderEn }) {
  const Input = multiline ? 'textarea' : 'input';
  return (
    <div>
      {label && <span className="label mb-1.5">{label}</span>}
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-[10px] font-extrabold text-ink-muted">AR</span>
          <Input
            value={value?.ar || ''}
            onChange={(event) => onChange('ar', event.target.value)}
            className={`input text-xs ${multiline ? 'resize-y py-2' : 'h-9'}`}
            style={multiline ? { minHeight: `${rows * 24 + 16}px` } : undefined}
            dir="rtl"
            placeholder={placeholderAr || (multiline ? 'النص بالعربية…' : 'عربي')}
          />
        </div>
        <div>
          <span className="mb-1 block text-[10px] font-extrabold text-ink-muted">EN</span>
          <Input
            value={value?.en || ''}
            onChange={(event) => onChange('en', event.target.value)}
            className={`input text-xs ${multiline ? 'resize-y py-2' : 'h-9'}`}
            style={multiline ? { minHeight: `${rows * 24 + 16}px` } : undefined}
            dir="ltr"
            placeholder={placeholderEn || (multiline ? 'English text…' : 'English')}
          />
        </div>
      </div>
    </div>
  );
}

function BlockTypeMenu({ insertAt, onPick }) {
  const { t } = useTranslation();
  return (
    <div className="admin-rise my-1 rounded-2xl border border-line bg-card p-3 shadow-lift">
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-muted">{t('admin.courses.blocks.pickType')}</p>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
        {BLOCK_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onPick(type.value, insertAt)}
              className="flex items-center gap-2 rounded-xl border border-line bg-surface-muted/50 px-2.5 py-2 text-start text-[10px] font-extrabold text-ink transition-colors hover:border-primary/50 hover:bg-brand-soft"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-primary dark:text-brand-ink" />
              <span className="truncate">{t(`admin.courses.blocks.${type.labelKey}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const rowsToText = (rows) => (rows || []).map((row) => row.join(' | ')).join('\n');

const textToRows = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split('|').map((cell) => cell.trim()));

function BlockEditBody({ block, index, helpers }) {
  const { t } = useTranslation();
  const { update, updateContent, updateData, updateDataLang, gallery, steps: stepHelpers } = helpers;
  const type = block.type;

  if (TEXT_TYPES.has(type)) {
    const isShort = type === 'heading' || type === 'subheading';
    return (
      <div className="space-y-2">
        <BilingualRow
          label={t('admin.courses.blocks.text')}
          value={block.content}
          onChange={(lang, value) => updateContent(index, lang, value)}
          multiline={!isShort}
          rows={type === 'paragraph' ? 4 : 2}
          placeholderAr={isShort ? 'عنوان…' : undefined}
          placeholderEn={isShort ? 'Heading…' : undefined}
        />
        {CALLOUT_TYPES.has(type) && <p className="text-[10px] font-semibold text-ink-muted">{t(`admin.courses.blocks.${type}Hint`)}</p>}
      </div>
    );
  }

  if (type === 'image' || type === 'figure') {
    return (
      <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
        <MiniImageTab url={block.data?.url} />
        <div className="space-y-2.5">
          <div>
            <span className="label mb-1.5">{t('admin.courses.blocks.imageUrl')}</span>
            <input
              value={block.data.url || ''}
              onChange={(event) => updateData(index, 'url', event.target.value)}
              className={`input h-9 text-xs ${block.data.url && !isHttpUrl(block.data.url) ? 'border-danger' : ''}`}
              dir="ltr"
              placeholder="https://…"
            />
            {block.data.url && !isHttpUrl(block.data.url) && (
              <p className="mt-1 text-[10px] font-bold text-danger">{t('admin.courses.blocks.invalidUrl')}</p>
            )}
          </div>
          <AssetUploader kind="image" onUploaded={(uploadedUrl) => updateData(index, 'url', uploadedUrl)} />
          <BilingualRow label={t('admin.courses.blocks.alt')} value={block.data.alt || { ar: '', en: '' }} onChange={(lang, value) => updateDataLang(index, 'alt', lang, value)} multiline={false} />
          {type === 'figure' && (
            <BilingualRow label={t('admin.courses.blocks.caption')} value={block.data.caption || { ar: '', en: '' }} onChange={(lang, value) => updateDataLang(index, 'caption', lang, value)} multiline={false} />
          )}
        </div>
      </div>
    );
  }

  if (type === 'gallery') {
    const images = block.data?.images || [];
    return (
      <div className="space-y-2.5">
        {images.length === 0 && (
          <p className="text-[10px] font-semibold text-ink-muted">{t('admin.courses.blocks.galleryEmpty')}</p>
        )}
        {images.map((image, imageIndex) => (
          <div key={image.id || imageIndex} className="rounded-xl border border-line bg-card p-2.5">
            <div className="grid gap-2.5 sm:grid-cols-[160px_1fr]">
              <MiniImageTab url={image.url} />
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold text-ink-muted">{imageIndex + 1}</span>
                  <div className="flex items-center gap-0.5">
                    <button type="button" onClick={() => gallery.move(index, imageIndex, -1)} disabled={imageIndex === 0} className="rounded-md p-0.5 text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-30" title={t('admin.courses.blocks.moveUp')}>
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button type="button" onClick={() => gallery.move(index, imageIndex, 1)} disabled={imageIndex === images.length - 1} className="rounded-md p-0.5 text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-30" title={t('admin.courses.blocks.moveDown')}>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <input
                  value={image.url || ''}
                  onChange={(event) => gallery.updateImage(index, image.id, { url: event.target.value })}
                  className={`input h-9 text-xs ${image.url && !isHttpUrl(image.url) ? 'border-danger' : ''}`}
                  dir="ltr"
                  placeholder="https://…"
                />
                <AssetUploader kind="image" onUploaded={(uploadedUrl) => gallery.updateImage(index, image.id, { url: uploadedUrl })} />
                <BilingualRow label={t('admin.courses.blocks.caption')} value={image.caption || { ar: '', en: '' }} onChange={(lang, value) => gallery.updateImage(index, image.id, { caption: { ...(image.caption || { ar: '', en: '' }), [lang]: value } })} multiline={false} />
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => gallery.add(index)}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline dark:text-brand-ink"
          >
            <Plus className="h-3 w-3" /> {t('admin.courses.blocks.addImage')}
          </button>
          {images.some((image) => image.url) && (
            <button type="button" onClick={() => gallery.clear(index)} className="inline-flex items-center gap-1 text-[10px] font-bold text-danger hover:underline">
              <Trash2 className="h-3 w-3" /> {t('admin.courses.blocks.removeImage')}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'youtube') {
    const url = block.data?.url || '';
    const videoId = url ? extractYouTubeId(url) : null;
    return (
      <div className="space-y-2.5">
        <div>
          <span className="label mb-1.5">{t('admin.courses.blocks.videoUrl')}</span>
          <input
            value={url}
            onChange={(event) => updateData(index, 'url', event.target.value)}
            className={`input h-9 text-xs ${url && !videoId ? 'border-danger' : ''}`}
            dir="ltr"
            placeholder="https://www.youtube.com/watch?v=…"
          />
          {url && !videoId && (
            <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-danger">
              <AlertTriangle className="h-3 w-3" /> {t('admin.courses.blocks.youtubeInvalid')}
            </p>
          )}
          {!url && <p className="mt-1 text-[10px] font-semibold text-ink-muted">{t('admin.courses.blocks.youtubeHint')}</p>}
        </div>

        {videoId && (
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
              <Play className="h-3 w-3 text-primary dark:text-brand-ink" /> {t('admin.courses.blocks.embedPreview')}
            </p>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`}
                title="YouTube preview"
                frameBorder="0"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="flex items-center gap-1 text-[10px] font-semibold text-ink-muted" dir="ltr">
              <ExternalLink className="h-3 w-3" /> ID: {videoId}
            </p>
          </div>
        )}

        <BilingualRow label={t('admin.courses.blocks.mediaTitle')} value={block.data?.title || { ar: '', en: '' }} onChange={(lang, value) => updateDataLang(index, 'title', lang, value)} multiline={false} />
      </div>
    );
  }

  if (type === 'video') {
    const url = block.data?.url || '';
    const videoId = extractYouTubeId(url);
    const directVideo = !!url && !videoId && /\.(mp4|webm|ogg|mov)(\?\S*)?$/i.test(url);
    return (
      <div className="space-y-2.5">
        <div>
          <span className="label mb-1.5">{t('admin.courses.blocks.videoUrl')}</span>
          <input
            value={url}
            onChange={(event) => updateData(index, 'url', event.target.value)}
            className={`input h-9 text-xs ${url && !videoId && !directVideo ? 'border-danger' : ''}`}
            dir="ltr"
            placeholder="https://…/video.mp4"
          />
          {url && !videoId && !directVideo && (
            <p className="mt-1 text-[10px] font-bold text-danger">{t('admin.courses.blocks.invalidUrl')}</p>
          )}
        </div>
        <AssetUploader kind="video" onUploaded={(uploadedUrl) => updateData(index, 'url', uploadedUrl)} />
        {url && (
          <div className="overflow-hidden rounded-xl border border-line bg-black">
            {videoId ? (
              <div className="relative aspect-video w-full" style={{ aspectRatio: '16 / 9' }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                  title="Video preview"
                  frameBorder="0"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : directVideo ? (
              <video src={url} controls className="h-auto w-full" preload="metadata" />
            ) : null}
          </div>
        )}
        <BilingualRow label={t('admin.courses.blocks.mediaTitle')} value={block.data?.title || { ar: '', en: '' }} onChange={(lang, value) => updateDataLang(index, 'title', lang, value)} multiline={false} />
      </div>
    );
  }

  if (type === 'attachment') {
    const url = block.data?.url || '';
    return (
      <div className="space-y-2.5">
        <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
          <MiniImageTab url={url} />
          <div className="space-y-2">
            <div>
              <span className="label mb-1.5">{t('admin.courses.blocks.attachmentUrl')}</span>
              <input
                value={url}
                onChange={(event) => updateData(index, 'url', event.target.value)}
                className={`input h-9 text-xs ${url && !isHttpUrl(url) ? 'border-danger' : ''}`}
                dir="ltr"
                placeholder="https://…"
              />
              {url && !isHttpUrl(url) && (
                <p className="mt-1 text-[10px] font-bold text-danger">{t('admin.courses.blocks.invalidUrl')}</p>
              )}
            </div>
            <AssetUploader kind="file" onUploaded={(uploadedUrl) => updateData(index, 'url', uploadedUrl)} />
            <BilingualRow label={t('admin.courses.blocks.attachmentName')} value={block.data?.name || { ar: '', en: '' }} onChange={(lang, value) => updateDataLang(index, 'name', lang, value)} multiline={false} />
          </div>
        </div>
      </div>
    );
  }

  if (LIST_TYPES.has(type)) {
    return (
      <div>
        <BilingualRow
          label={t('admin.courses.blocks.items')}
          value={{ ar: (block.data?.items?.ar || []).join('\n'), en: (block.data?.items?.en || []).join('\n') }}
          onChange={(lang, value) => updateDataLang(index, 'items', lang, lines(value))}
        />
      </div>
    );
  }

  if (type === 'steps') {
    const steps = block.data?.steps || [];
    return (
      <div className="space-y-2">
        {steps.map((step, stepIndex) => (
          <div key={step.id || stepIndex} className="rounded-xl border border-freshGreen/30 bg-brand-soft/40 p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[9px] text-white">{stepIndex + 1}</span>
                {t('admin.courses.blocks.step')}
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => stepHelpers.move(index, stepIndex, -1)} disabled={stepIndex === 0} className="rounded-md p-0.5 text-ink-muted hover:bg-card hover:text-ink disabled:opacity-30" title={t('admin.courses.blocks.moveUp')}>
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button type="button" onClick={() => stepHelpers.move(index, stepIndex, 1)} disabled={stepIndex === steps.length - 1} className="rounded-md p-0.5 text-ink-muted hover:bg-card hover:text-ink disabled:opacity-30" title={t('admin.courses.blocks.moveDown')}>
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button type="button" onClick={() => stepHelpers.remove(index, stepIndex)} className="rounded-md p-0.5 text-ink-muted hover:bg-danger-soft hover:text-danger" title={t('admin.courses.blocks.removeStep')}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <BilingualRow label={t('admin.courses.blocks.stepTitle')} value={step.title || { ar: '', en: '' }} onChange={(lang, value) => stepHelpers.update(index, stepIndex, (current) => ({ ...current, title: { ...(current.title || { ar: '', en: '' }), [lang]: value } }))} multiline={false} />
              <BilingualRow label={t('admin.courses.blocks.stepContent')} value={step.content || { ar: '', en: '' }} onChange={(lang, value) => stepHelpers.update(index, stepIndex, (current) => ({ ...current, content: { ...(current.content || { ar: '', en: '' }), [lang]: value } }))} rows={2} />
              <div>
                <span className="label mb-1.5">{t('admin.courses.blocks.stepImage')}</span>
                <input
                  value={step.image || ''}
                  onChange={(event) => stepHelpers.update(index, stepIndex, (current) => ({ ...current, image: event.target.value }))}
                  className="input h-9 text-xs"
                  dir="ltr"
                  placeholder="https://…"
                />
              </div>
              <AssetUploader kind="image" onUploaded={(uploadedUrl) => stepHelpers.update(index, stepIndex, (current) => ({ ...current, image: uploadedUrl }))} />
              {step.image && (
                <MiniImageTab url={step.image} />
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => stepHelpers.add(index)} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline dark:text-brand-ink">
          <Plus className="h-3 w-3" /> {t('admin.courses.blocks.addStep')}
        </button>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-2.5">
        <div>
          <span className="label mb-1.5">{t('admin.courses.blocks.tableHeaders')}</span>
          <BilingualRow
            value={{ ar: (block.data?.headers?.ar || []).join(' | '), en: (block.data?.headers?.en || []).join(' | ') }}
            onChange={(lang, value) => updateDataLang(index, 'headers', lang, value.split('|').map((cell) => cell.trim()).filter(Boolean))}
            multiline={false}
          />
        </div>
        <div>
          <span className="label mb-1.5">{t('admin.courses.blocks.tableRows')}</span>
          <BilingualRow
            value={{ ar: rowsToText(block.data?.rows?.ar), en: rowsToText(block.data?.rows?.en) }}
            onChange={(lang, value) => {
              const sourceEn = subLangSafeRows(block.data?.rows?.en);
              const sourceAr = subLangSafeRows(block.data?.rows?.ar);
              const edited = textToRows(value);
              const other = lang === 'ar' ? sourceEn : sourceAr;
              const count = Math.max(edited.length, other.length);
              const mergedAr = lang === 'ar' ? edited : other;
              const mergedEn = lang === 'en' ? edited : other;
              updateData(index, 'rows', {
                ar: Array.from({ length: count }).map((_, rowIndex) => mergedAr[rowIndex] || []),
                en: Array.from({ length: count }).map((_, rowIndex) => mergedEn[rowIndex] || []),
              });
            }}
          />
          <p className="mt-1 text-[10px] font-semibold text-ink-muted">{t('admin.courses.blocks.tableHint')}</p>
        </div>
      </div>
    );
  }

  return (
    <BilingualRow label={t('admin.courses.blocks.text')} value={block.content} onChange={(lang, value) => updateContent(index, lang, value)} rows={2} />
  );
}

const subLangSafeRows = (rows) => (Array.isArray(rows) ? rows : []);

export default function LessonBlocksEditor({ blocks = [], onChange }) {
  const { t } = useTranslation();
  const [menuAt, setMenuAt] = useState(null);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const update = (next) => onChange(next);
  const updateBlock = (index, updater) => update(blocks.map((block, blockIndex) => (blockIndex === index ? updater(block) : block)));

  const updateContent = (index, lang, value) =>
    updateBlock(index, (block) => ({ ...block, content: { ...block.content, [lang]: value } }));

  const updateData = (index, field, value) =>
    updateBlock(index, (block) => ({ ...block, data: { ...block.data, [field]: value } }));

  const updateDataLang = (index, field, lang, value) =>
    updateBlock(index, (block) => ({
      ...block,
      data: { ...block.data, [field]: { ...(block.data?.[field] || { ar: '', en: '' }), [lang]: value } },
    }));

  const addBlock = (type, at = 'end') => {
    const block = blankBlock(type);
    const next = [...blocks];
    if (at === 'end' || at > blocks.length) next.push(block);
    else next.splice(at, 0, block);
    update(next);
    setMenuAt(null);
  };

  const removeBlock = (index) => update(blocks.filter((_, blockIndex) => blockIndex !== index));

  const duplicateBlock = (index) =>
    update([
      ...blocks.slice(0, index + 1),
      { ...blocks[index], id: uid(), data: JSON.parse(JSON.stringify(blocks[index].data || {})) },
      ...blocks.slice(index + 1),
    ]);

  const moveBlock = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const moveDraggedBlock = (from, to) => {
    if (from === null || to === null || from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    update(next);
  };

  const galleryHelpers = {
    add: (index) =>
      updateBlock(index, (block) => ({
        ...block,
        data: {
          ...block.data,
          images: [...(block.data?.images || []), { id: uid(), url: '', caption: { ar: '', en: '' } }],
        },
      })),
    remove: (index, imageId) =>
      updateBlock(index, (block) => ({
        ...block,
        data: { ...block.data, images: (block.data?.images || []).filter((image) => image.id !== imageId) },
      })),
    update: (index, imageId, patch) =>
      updateBlock(index, (block) => ({
        ...block,
        data: {
          ...block.data,
          images: (block.data?.images || []).map((image) => (image.id === imageId ? { ...image, ...patch } : image)),
        },
      })),
    move: (index, imageIndex, direction) =>
      updateBlock(index, (block) => {
        const images = [...(block.data?.images || [])];
        const target = imageIndex + direction;
        if (target < 0 || target >= images.length) return block;
        [images[imageIndex], images[target]] = [images[target], images[imageIndex]];
        return { ...block, data: { ...block.data, images } };
      }),
    clear: (index) =>
      updateBlock(index, (block) => ({ ...block, data: { ...block.data, images: [] } })),
  };

  const stepsHelpers = {
    add: (index) =>
      updateBlock(index, (block) => ({
        ...block,
        data: {
          ...block.data,
          steps: [...(block.data?.steps || []), { id: uid(), title: { ar: '', en: '' }, content: { ar: '', en: '' }, image: '' }],
        },
      })),
    remove: (index, stepIndex) =>
      updateBlock(index, (block) => ({
        ...block,
        data: { ...block.data, steps: (block.data?.steps || []).filter((_, itemIndex) => itemIndex !== stepIndex) },
      })),
    move: (index, stepIndex, direction) =>
      updateBlock(index, (block) => {
        const steps = [...(block.data?.steps || [])];
        const target = stepIndex + direction;
        if (target < 0 || target >= steps.length) return block;
        [steps[stepIndex], steps[target]] = [steps[target], steps[stepIndex]];
        return { ...block, data: { ...block.data, steps } };
      }),
    update: (index, stepIndex, updater) =>
      updateBlock(index, (block) => ({
        ...block,
        data: {
          ...block.data,
          steps: (block.data?.steps || []).map((step, itemIndex) => (itemIndex === stepIndex ? updater(step) : step)),
        },
      })),
  };

  const helpers = { update, updateContent, updateData, updateDataLang, gallery: galleryHelpers, steps: stepsHelpers };

  const toggleCollapse = (blockId) =>
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });

  const InsertChip = ({ positionKey, at }) => (
    <div className="relative flex items-center justify-center py-0.5">
      <button
        type="button"
        onClick={() => setMenuAt(menuAt === positionKey ? null : positionKey)}
        className="z-10 flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-line-strong bg-card text-ink-muted transition-all hover:scale-110 hover:border-primary hover:text-primary dark:hover:text-brand-ink"
        title={t('admin.courses.blocks.insertHere')}
        aria-label={t('admin.courses.blocks.insertHere')}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <div className={`h-px flex-1 bg-line ${menuAt === positionKey ? 'opacity-0' : ''} ${at === 'end' ? 'ms-6' : 'inset-x-6'}`} />
      {menuAt === positionKey && <BlockTypeMenu insertAt={at === 'end' ? 'end' : Number(positionKey)} onPick={addBlock} />}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="icon-box h-8 w-8 bg-brand-soft text-success-ink">
            <Images className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink">{t('admin.courses.blocks.title')}</p>
            <p className="text-[10px] font-semibold text-ink-muted">{t('admin.courses.blocks.hint')}</p>
          </div>
        </div>
        <button type="button" onClick={() => setMenuAt(menuAt === 'end' ? null : 'end')} className="btn-primary h-8 px-3 text-[10px]">
          <Plus className="h-3 w-3" /> {t('admin.courses.blocks.add')}
        </button>
      </div>

      {blocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong px-4 py-8 text-center">
          <Images className="mx-auto mb-2 h-6 w-6 text-line-strong" />
          <p className="text-[11px] font-semibold text-ink-muted">{t('admin.courses.blocks.empty')}</p>
        </div>
      ) : (
        blocks.map((block, index) => {
          const meta = BLOCK_TYPES.find((type) => type.value === block.type) || BLOCK_TYPES[0];
          const Icon = meta.icon;
          const isCollapsed = collapsed.has(block.id);
          return (
            <div key={block.id}>
              <InsertChip positionKey={String(index)} at={index} />
              <div
                className={`rounded-2xl border bg-surface-muted/40 p-3 transition-colors ${
                  dragOverIndex === index ? 'border-solid border-primary' : 'border-line'
                }`}
                draggable
                onDragStart={(event) => {
                  dragIndexRef.current = index;
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverIndex(index);
                }}
                onDragLeave={() => setDragOverIndex((current) => (current === index ? null : current))}
                onDrop={(event) => {
                  event.preventDefault();
                  moveDraggedBlock(dragIndexRef.current, index);
                  dragIndexRef.current = null;
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  dragIndexRef.current = null;
                  setDragOverIndex(null);
                }}
              >
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex min-w-0 items-center gap-1">
                    <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-line-strong" />
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-card px-1 text-[10px] font-extrabold text-ink-muted">
                      {index + 1}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-card px-2 py-1 text-[10px] font-extrabold text-ink">
                      <Icon className="h-3.5 w-3.5 text-primary dark:text-brand-ink" />
                      {t(`admin.courses.blocks.${meta.labelKey}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="rounded-md p-1 text-ink-muted hover:bg-card hover:text-ink disabled:opacity-30" aria-label={t('admin.courses.blocks.moveUp')} title={t('admin.courses.blocks.moveUp')}>
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="rounded-md p-1 text-ink-muted hover:bg-card hover:text-ink disabled:opacity-30" aria-label={t('admin.courses.blocks.moveDown')} title={t('admin.courses.blocks.moveDown')}>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => toggleCollapse(block.id)} className="rounded-md p-1 text-ink-muted hover:bg-card hover:text-ink" aria-label={isCollapsed ? t('admin.courses.blocks.expand') : t('admin.courses.blocks.collapse')} title={isCollapsed ? t('admin.courses.blocks.expand') : t('admin.courses.blocks.collapse')}>
                      {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                    </button>
                    <button type="button" onClick={() => duplicateBlock(index)} className="rounded-md p-1 text-ink-muted hover:bg-card hover:text-ink" aria-label={t('admin.courses.blocks.duplicate')} title={t('admin.courses.blocks.duplicate')}>
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => removeBlock(index)} className="rounded-md p-1 text-ink-muted hover:bg-danger-soft hover:text-danger" aria-label={t('admin.courses.blocks.remove')} title={t('admin.courses.blocks.remove')}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {!isCollapsed && <BlockEditBody block={block} index={index} helpers={helpers} />}
              </div>
            </div>
          );
        })
      )}

      {blocks.length > 0 && <InsertChip positionKey="end" at="end" />}
      {blocks.length > 0 && menuAt === 'end' && <BlockTypeMenu insertAt="end" onPick={addBlock} />}
      {blocks.length === 0 && menuAt === 'end' && <BlockTypeMenu insertAt="end" onPick={addBlock} />}
    </div>
  );
}
