import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Heading,
  Heading2,
  Image as ImageIcon,
  Info,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Plus,
  Trash2,
  Type,
  Upload,
  Video,
} from '../icons';
import { extractYouTubeId } from '../LessonBlocks';
import { adminApi } from '../../lib/admin';
import { resolveAssetUrl } from '../../lib/api';
import { blankBlock } from './LessonBlocksEditor';

const TEXT_BLOCK_TYPES = new Set([
  'paragraph',
  'text',
  'rich-text',
  'heading',
  'subheading',
  'note',
  'tip',
  'warning',
  'important',
  'callout',
  'safety',
]);
const LIST_BLOCK_TYPES = new Set(['list', 'numbered-list']);
const MEDIA_BLOCK_TYPES = new Set(['image', 'video', 'youtube']);
const MAX_FILE_BYTES = 7.5 * 1024 * 1024;
const IMAGE_TYPES = 'image/png,image/jpeg,image/webp,image/gif';
const VIDEO_TYPES = 'video/mp4,video/webm,video/ogg';

const textOf = (value) => (typeof value === 'string' ? value : '');

function EditorButton({ icon: Icon, children, onClick, onMouseDown, title, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title || children}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.();
      }}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-primary/50 hover:bg-highlight disabled:cursor-not-allowed disabled:opacity-50 xl:min-h-9 ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-lavender" />}
      <span>{children}</span>
    </button>
  );
}

export default function LessonDocumentEditor({ blocks, onChange, language, onLanguageChange }) {
  const isAr = language === 'ar';
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const blocksRef = useRef(blocks);
  const insertionRef = useRef({ index: null, blockId: null, start: 0, end: 0 });
  const focusAfterRenderRef = useRef(null);
  const replaceMediaRef = useRef(null);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [insertMenuAt, setInsertMenuAt] = useState(null);
  const [videoPanelOpen, setVideoPanelOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const label = (english, arabic) => (isAr ? arabic : english);

  const changeBlocks = (nextOrUpdater) => {
    const current = blocksRef.current;
    const next = typeof nextOrUpdater === 'function' ? nextOrUpdater(current) : nextOrUpdater;
    blocksRef.current = next;
    onChange(next);
  };

  const changeText = (blockId, value) => {
    changeBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, content: { ...block.content, [language]: value } } : block
      )
    );
  };

  const changeList = (blockId, value) => {
    const items = value.split('\n');
    changeBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              data: {
                ...block.data,
                items: { ...(block.data?.items || { ar: [], en: [] }), [language]: items },
              },
            }
          : block
      )
    );
  };

  const changeMedia = (blockId, patch) => {
    changeBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, data: { ...block.data, ...patch } } : block
      )
    );
  };

  const rememberCaret = (block, element) => {
    if (!element) return;
    setActiveBlockId(block.id);
    insertionRef.current = {
      index: null,
      blockId: block.id,
      start: element.selectionStart ?? 0,
      end: element.selectionEnd ?? element.selectionStart ?? 0,
    };
  };

  const focusBlock = (blockId, offset = 0) => {
    const field = Array.from(editorRef.current?.querySelectorAll('[data-editable-id]') || []).find(
      (element) => element.dataset.editableId === blockId
    );
    if (!field) return;
    field.focus();
    const caret = Math.min(offset, field.value.length);
    field.setSelectionRange(caret, caret);
    const block = blocksRef.current.find((item) => item.id === blockId);
    if (block) rememberCaret(block, field);
  };

  useLayoutEffect(() => {
    const position = focusAfterRenderRef.current;
    if (!position || !editorRef.current) return;
    focusAfterRenderRef.current = null;
    window.requestAnimationFrame(() => focusBlock(position.blockId, position.offset));
  }, [blocks]);

  const insertBlock = (type, data = {}, explicitIndex = null) => {
    const current = blocksRef.current;
    const anchor = insertionRef.current;
    const anchorIndex =
      explicitIndex !== null
        ? explicitIndex
        : anchor.blockId
          ? current.findIndex((block) => block.id === anchor.blockId)
          : Number.isInteger(anchor.index)
            ? anchor.index
            : current.length;
    const inserted = blankBlock(type);
    inserted.data = { ...inserted.data, ...data };
    const isMedia = MEDIA_BLOCK_TYPES.has(type);
    let next;
    let focusId = inserted.id;
    let focusOffset = 0;

    if (explicitIndex === null && anchorIndex >= 0 && anchor.blockId) {
      const original = current[anchorIndex];
      const isList = LIST_BLOCK_TYPES.has(original.type);
      if (TEXT_BLOCK_TYPES.has(original.type) || isList) {
        const source = isList
          ? (Array.isArray(original.data?.items?.[language]) ? original.data.items[language] : []).join('\n')
          : textOf(original.content?.[language]);
        const start = Math.min(Math.max(0, anchor.start), source.length);
        const end = Math.min(Math.max(start, anchor.end), source.length);
        const before = source.slice(0, start);
        const after = source.slice(end);
        const prefix = isList
          ? {
              ...original,
              data: {
                ...original.data,
                items: {
                  ...(original.data?.items || { ar: [], en: [] }),
                  [language]: before ? before.split('\n') : [],
                },
              },
            }
          : { ...original, content: { ...original.content, [language]: before } };

        if (isMedia) {
          const continuation = blankBlock('paragraph');
          continuation.content = { ...continuation.content, [language]: isList ? '' : after };
          const remainder = isList && after
            ? [{
                ...blankBlock(original.type),
                data: {
                  ...original.data,
                  items: {
                    ...(original.data?.items || { ar: [], en: [] }),
                    [language]: after.split('\n'),
                  },
                },
              }]
            : [];
          next = [
            ...current.slice(0, anchorIndex),
            prefix,
            inserted,
            continuation,
            ...remainder,
            ...current.slice(anchorIndex + 1),
          ];
          focusId = continuation.id;
        } else {
          const continuation = blankBlock(isList ? original.type : 'paragraph');
          if (isList) {
            continuation.data.items[language] = after ? after.split('\n') : [];
          } else {
            continuation.content = { ...continuation.content, [language]: after };
          }
          next = [
            ...current.slice(0, anchorIndex),
            prefix,
            inserted,
            ...(after ? [continuation] : []),
            ...current.slice(anchorIndex + 1),
          ];
          if (after) focusId = continuation.id;
        }
      } else {
        const index = anchorIndex + 1;
        const continuation = isMedia ? blankBlock('paragraph') : null;
        next = [
          ...current.slice(0, index),
          inserted,
          ...(continuation ? [continuation] : []),
          ...current.slice(index),
        ];
        if (continuation) focusId = continuation.id;
      }
    } else {
      const index = Math.max(0, Math.min(explicitIndex ?? anchorIndex, current.length));
      const continuation = isMedia ? blankBlock('paragraph') : null;
      next = [
        ...current.slice(0, index),
        inserted,
        ...(continuation ? [continuation] : []),
        ...current.slice(index),
      ];
      if (continuation) focusId = continuation.id;
    }

    if (!next.length) next = [blankBlock('paragraph')];
    insertionRef.current = { index: null, blockId: focusId, start: focusOffset, end: focusOffset };
    focusAfterRenderRef.current = { blockId: focusId, offset: focusOffset };
    setActiveBlockId(focusId);
    setInsertMenuAt(null);
    changeBlocks(next);
  };

  const setInsertionPoint = (index) => {
    insertionRef.current = { index, blockId: null, start: 0, end: 0 };
    setInsertMenuAt((current) => (current === index ? null : index));
  };

  const switchLanguage = (nextLanguage) => {
    const activeIndex = blocksRef.current.findIndex((block) => block.id === activeBlockId);
    insertionRef.current = {
      index: activeIndex >= 0 ? activeIndex + 1 : null,
      blockId: null,
      start: 0,
      end: 0,
    };
    setActiveBlockId(null);
    onLanguageChange(nextLanguage);
  };

  const openImagePicker = (index = null, replaceId = null) => {
    replaceMediaRef.current = replaceId;
    if (Number.isInteger(index)) insertionRef.current = { index, blockId: null, start: 0, end: 0 };
    imageInputRef.current?.click();
  };

  const openVideoPanel = (index = null, replaceId = null) => {
    replaceMediaRef.current = replaceId;
    if (Number.isInteger(index)) insertionRef.current = { index, blockId: null, start: 0, end: 0 };
    setVideoPanelOpen(true);
    setInsertMenuAt(null);
    setError('');
  };

  const handleUpload = async (file, kind) => {
    if (!file) return;
    const allowedTypes = kind === 'image' ? IMAGE_TYPES : VIDEO_TYPES;
    if (!allowedTypes.split(',').includes(file.type)) {
      setError(label('Choose a supported image or video file.', 'اختر ملف صورة أو فيديو مدعوماً.'));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(label('Media must be 7.5 MB or smaller.', 'يجب ألا يتجاوز حجم الوسائط 7.5 ميغابايت.'));
      return;
    }

    setUploading(kind);
    setError('');
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error(label('The selected file could not be read.', 'تعذرت قراءة الملف المحدد.')));
        reader.readAsDataURL(file);
      });
      const result = await adminApi.uploadAsset({ dataUrl, name: file.name });
      if (!result?.url) throw new Error(label('The media upload did not return a URL.', 'لم يُرجع رفع الوسائط رابطاً.'));

      const replaceId = replaceMediaRef.current;
      if (replaceId) {
        changeMedia(replaceId, { url: result.url });
        replaceMediaRef.current = null;
      } else {
        insertBlock(kind === 'image' ? 'image' : 'video', { url: result.url });
      }
    } catch (uploadError) {
      setError(uploadError.message || label('Media upload failed.', 'تعذر رفع الوسائط.'));
    } finally {
      setUploading('');
      if (kind === 'image' && imageInputRef.current) imageInputRef.current.value = '';
      if (kind === 'video' && videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const addYouTube = () => {
    const url = videoUrl.trim();
    if (!extractYouTubeId(url)) {
      setError(label('Enter a valid YouTube URL.', 'أدخل رابط يوتيوب صالحاً.'));
      return;
    }
    insertBlock('youtube', { url });
    setVideoUrl('');
    setVideoPanelOpen(false);
    setError('');
  };

  const moveBlock = (blockId, direction) => {
    changeBlocks((current) => {
      const index = current.findIndex((block) => block.id === blockId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeBlock = (blockId) => {
    const next = blocksRef.current.filter((block) => block.id !== blockId);
    if (!next.length) next.push(blankBlock('paragraph'));
    insertionRef.current = { index: null, blockId: null, start: 0, end: 0 };
    setActiveBlockId(null);
    changeBlocks(next);
  };

  const insertMenu = (index) => (
    <div
      className="my-2 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-highlight/60 p-2"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <EditorButton icon={Type} onClick={() => insertBlock('paragraph', {}, index)}>{label('Text', 'نص')}</EditorButton>
      <EditorButton icon={Heading} onClick={() => insertBlock('heading', {}, index)}>{label('Heading', 'عنوان')}</EditorButton>
      <EditorButton icon={Heading2} onClick={() => insertBlock('subheading', {}, index)}>{label('Subheading', 'عنوان فرعي')}</EditorButton>
      <EditorButton icon={List} onClick={() => insertBlock('list', {}, index)}>{label('List', 'قائمة')}</EditorButton>
      <EditorButton icon={Info} onClick={() => insertBlock('note', {}, index)}>{label('Note', 'ملاحظة')}</EditorButton>
      <EditorButton icon={Lightbulb} onClick={() => insertBlock('tip', {}, index)}>{label('Tip', 'نصيحة')}</EditorButton>
      <EditorButton icon={AlertTriangle} onClick={() => insertBlock('warning', {}, index)}>{label('Warning', 'تحذير')}</EditorButton>
      <EditorButton icon={ImageIcon} onClick={() => openImagePicker(index)}>{label('Image', 'صورة')}</EditorButton>
      <EditorButton icon={Video} onClick={() => openVideoPanel(index)}>{label('Video', 'فيديو')}</EditorButton>
    </div>
  );

  const renderTextBlock = (block) => {
    const value = textOf(block.content?.[language]);
    const heading = block.type === 'heading' || block.type === 'subheading';
    const callout = ['note', 'tip', 'warning', 'important', 'callout', 'safety'].includes(block.type);
    const placeholder =
      block.type === 'heading'
        ? label('Lesson heading', 'عنوان الدرس')
        : block.type === 'subheading'
          ? label('Section heading', 'عنوان القسم')
          : block.type === 'warning'
            ? label('Write a warning or important safety message…', 'اكتب تحذيراً أو رسالة سلامة مهمة…')
            : block.type === 'note' || block.type === 'tip'
              ? label('Write a note…', 'اكتب ملاحظة…')
              : label('Write your lesson here. Press Enter to start another paragraph.', 'اكتب محتوى الدرس هنا. اضغط Enter لبدء فقرة جديدة.');
    const className =
      block.type === 'heading'
        ? 'min-h-12 text-2xl font-extrabold leading-tight'
        : block.type === 'subheading'
          ? 'min-h-10 text-xl font-bold leading-tight'
          : 'min-h-[5rem] text-base leading-8';
    return (
      <div className={callout ? `rounded-xl border p-4 ${block.type === 'warning' || block.type === 'safety' ? 'border-negative/30 bg-negative-soft/60' : block.type === 'tip' ? 'border-accent/30 bg-caution-soft/25' : 'border-primary/25 bg-highlight/40'}` : ''}>
        <textarea
          data-editable-id={block.id}
          aria-label={placeholder}
          dir={isAr ? 'rtl' : 'ltr'}
          value={value}
          rows={heading ? 1 : Math.max(2, value.split('\n').length + 1)}
          placeholder={placeholder}
          onFocus={(event) => rememberCaret(block, event.currentTarget)}
          onClick={(event) => rememberCaret(block, event.currentTarget)}
          onKeyUp={(event) => rememberCaret(block, event.currentTarget)}
          onSelect={(event) => rememberCaret(block, event.currentTarget)}
          onChange={(event) => {
            rememberCaret(block, event.currentTarget);
            changeText(block.id, event.target.value);
          }}
          className={`block w-full resize-y border-0 bg-transparent px-1 py-1 text-ink outline-none placeholder:text-ink-muted/55 focus:ring-0 ${className}`}
        />
      </div>
    );
  };

  const renderListBlock = (block) => {
    const values = Array.isArray(block.data?.items?.[language]) ? block.data.items[language] : [];
    const value = values.join('\n');
    const placeholder = label('Enter one list item per line…', 'أدخل كل عنصر في سطر…');
    return (
      <div className="relative">
        <span className="pointer-events-none absolute start-1 top-2 text-primary">
          {block.type === 'numbered-list' ? <ListOrdered className="h-4 w-4" /> : <List className="h-4 w-4" />}
        </span>
        <textarea
          data-editable-id={block.id}
          aria-label={placeholder}
          dir={isAr ? 'rtl' : 'ltr'}
          value={value}
          rows={Math.max(2, values.length + 1)}
          placeholder={placeholder}
          onFocus={(event) => rememberCaret(block, event.currentTarget)}
          onClick={(event) => rememberCaret(block, event.currentTarget)}
          onKeyUp={(event) => rememberCaret(block, event.currentTarget)}
          onSelect={(event) => rememberCaret(block, event.currentTarget)}
          onChange={(event) => {
            rememberCaret(block, event.currentTarget);
            changeList(block.id, event.target.value);
          }}
          className="block min-h-16 w-full resize-y border-0 bg-transparent py-1 ps-8 pe-2 text-base leading-8 text-ink outline-none placeholder:text-ink-muted/55 focus:ring-0"
        />
      </div>
    );
  };

  const renderMediaBlock = (block) => {
    const url = block.data?.url || '';
    const youtubeId = extractYouTubeId(url);
    if (block.type === 'image') {
      const caption = block.data?.caption?.[language] || '';
      return (
        <figure className="space-y-3 rounded-xl border border-line bg-surface-muted/40 p-3 sm:p-4">
          {url ? (
            <img src={resolveAssetUrl(url)} alt={block.data?.alt?.[language] || ''} className="mx-auto max-h-[34rem] w-auto max-w-full rounded-lg object-contain" />
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-line-strong bg-card text-sm text-ink-muted">
              {label('Choose an image from your computer', 'اختر صورة من جهازك')}
            </div>
          )}
          <figcaption className="space-y-2">
            <textarea
              value={caption}
              onChange={(event) => changeMedia(block.id, { caption: { ...(block.data?.caption || { ar: '', en: '' }), [language]: event.target.value } })}
              rows={1}
              dir={isAr ? 'rtl' : 'ltr'}
              placeholder={label('Add an image caption (optional)', 'أضف وصفاً للصورة (اختياري)')}
              className="block w-full resize-y rounded-lg border border-line bg-card px-3 py-2 text-center text-xs text-ink outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <input value={url} onChange={(event) => changeMedia(block.id, { url: event.target.value })} dir="ltr" aria-label={label('Image URL', 'رابط الصورة')} placeholder="https://…" className="input h-9 min-w-0 flex-1 text-xs" />
              <EditorButton icon={Upload} onClick={() => openImagePicker(null, block.id)}>{label('Replace', 'استبدال')}</EditorButton>
            </div>
          </figcaption>
        </figure>
      );
    }

    return (
      <div className="space-y-2 rounded-xl border border-line bg-surface-muted/40 p-3 sm:p-4">
        <div className="overflow-hidden rounded-lg border border-line bg-canvas">
          {block.type === 'youtube' && youtubeId ? (
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&playsinline=1`}
                title={label('Lesson video', 'فيديو الدرس')}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : block.type === 'video' && url ? (
            <video src={resolveAssetUrl(url)} controls className="h-auto max-h-[34rem] w-full" preload="metadata" />
          ) : (
            <div className="flex h-44 items-center justify-center text-sm text-ink-muted">
              {label('Enter a YouTube URL or upload a video', 'أدخل رابط يوتيوب أو ارفع فيديو')}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={url} onChange={(event) => changeMedia(block.id, { url: event.target.value })} dir="ltr" aria-label={label('Video URL', 'رابط الفيديو')} placeholder="https://…" className="input h-9 min-w-0 flex-1 text-xs" />
          {block.type === 'video' && (
            <EditorButton icon={Upload} onClick={() => openVideoPanel(null, block.id)}>{label('Replace video', 'استبدال الفيديو')}</EditorButton>
          )}
        </div>
      </div>
    );
  };

  const renderBlock = (block, index) => {
    const title = block.type.replace('-', ' ');
    return (
      <article
        key={block.id}
        data-block-id={block.id}
        onFocusCapture={() => setActiveBlockId(block.id)}
        className={`group relative rounded-2xl border p-3 transition-colors sm:p-5 ${
          activeBlockId === block.id ? 'border-primary/35 bg-primary/[0.025]' : 'border-transparent hover:border-line hover:bg-surface-muted/20'
        }`}
      >
        <div className="mb-2 flex min-h-7 items-center justify-between gap-3">
          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-muted">
            {label(title, ({ paragraph: 'فقرة', text: 'فقرة', 'rich text': 'نص', heading: 'عنوان', subheading: 'عنوان فرعي', list: 'قائمة', 'numbered list': 'قائمة مرقمة', note: 'ملاحظة', tip: 'نصيحة', warning: 'تحذير', image: 'صورة', video: 'فيديو', youtube: 'يوتيوب', divider: 'فاصل' })[title] || title)}
          </span>
          <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-60 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button type="button" onClick={() => moveBlock(block.id, -1)} disabled={index === 0} title={label('Move up', 'تحريك لأعلى')} aria-label={label('Move up', 'تحريك لأعلى')} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-ink-muted hover:bg-card hover:text-ink disabled:opacity-30 xl:min-h-0 xl:min-w-0">
              <ChevronUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => moveBlock(block.id, 1)} disabled={index === blocks.length - 1} title={label('Move down', 'تحريك لأسفل')} aria-label={label('Move down', 'تحريك لأسفل')} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-ink-muted hover:bg-card hover:text-ink disabled:opacity-30 xl:min-h-0 xl:min-w-0">
              <ChevronDown className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => removeBlock(block.id)} title={label('Delete block', 'حذف الكتلة')} aria-label={label('Delete block', 'حذف الكتلة')} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-negative-ink hover:bg-negative-soft xl:min-h-0 xl:min-w-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {TEXT_BLOCK_TYPES.has(block.type)
          ? renderTextBlock(block)
          : LIST_BLOCK_TYPES.has(block.type)
            ? renderListBlock(block)
            : MEDIA_BLOCK_TYPES.has(block.type)
              ? renderMediaBlock(block)
              : block.type === 'divider'
                ? <hr className="my-4 border-0 border-t border-line-strong" />
                : <div className="rounded-lg border border-line bg-surface-muted p-3 text-xs text-ink-muted">{title}</div>}
      </article>
    );
  };

  const insertPoint = (index) => (
    <div key={`insert-${index}`} className="relative flex min-h-8 items-center justify-center py-1">
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setInsertionPoint(index)}
        aria-label={label(`Insert a block at position ${index + 1}`, `إدراج كتلة في الموضع ${index + 1}`)}
        className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[11px] font-bold text-ink-muted shadow-sm transition-colors hover:border-primary/50 hover:bg-highlight hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" />
        {label('Add block here', 'أضف كتلة هنا')}
      </button>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-ink">{label('Lesson document', 'مستند الدرس')}</h2>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-bold text-ink-muted">
              {blocks.length} {label('blocks', 'كتل')}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {label('Write the lesson from top to bottom. Add a block between any two sections to place media exactly where it belongs.', 'اكتب الدرس من الأعلى إلى الأسفل. أضف كتلة بين أي قسمين لوضع الوسائط في موضعها.')}
          </p>
        </div>
        <div className="inline-flex w-fit rounded-xl border border-line bg-surface-muted p-1" role="group" aria-label={label('Editing language', 'لغة التحرير')}>
          {['ar', 'en'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => switchLanguage(lang)}
              aria-pressed={language === lang}
              className={`rounded-lg px-3.5 py-2 text-xs font-extrabold transition-colors ${
                language === lang ? 'bg-primary text-on-primary shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {lang === 'ar' ? 'العربية' : 'English'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface-muted/50">
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-card p-3" role="toolbar" aria-label={label('Lesson document tools', 'أدوات مستند الدرس')}>
          <EditorButton icon={Type} onClick={() => insertBlock('paragraph')}>{label('Text', 'نص')}</EditorButton>
          <EditorButton icon={Heading} onClick={() => insertBlock('heading')}>{label('Heading', 'عنوان')}</EditorButton>
          <EditorButton icon={Heading2} onClick={() => insertBlock('subheading')}>{label('Subheading', 'عنوان فرعي')}</EditorButton>
          <span className="mx-1 hidden h-6 border-s border-line sm:block" />
          <EditorButton icon={List} onClick={() => insertBlock('list')}>{label('Bulleted list', 'قائمة نقطية')}</EditorButton>
          <EditorButton icon={ListOrdered} onClick={() => insertBlock('numbered-list')}>{label('Numbered list', 'قائمة مرقمة')}</EditorButton>
          <EditorButton icon={Info} onClick={() => insertBlock('note')}>{label('Note', 'ملاحظة')}</EditorButton>
          <EditorButton icon={Lightbulb} onClick={() => insertBlock('tip')}>{label('Tip', 'نصيحة')}</EditorButton>
          <EditorButton icon={AlertTriangle} onClick={() => insertBlock('warning')}>{label('Warning', 'تحذير')}</EditorButton>
          <span className="mx-1 hidden h-6 border-s border-line sm:block" />
          <EditorButton icon={ImageIcon} onClick={() => openImagePicker()} disabled={Boolean(uploading)}>{label('Image', 'صورة')}</EditorButton>
          <EditorButton icon={Video} onClick={() => openVideoPanel()} disabled={Boolean(uploading)}>{label('Video', 'فيديو')}</EditorButton>
        </div>

        <input ref={imageInputRef} type="file" accept={IMAGE_TYPES} className="hidden" onChange={(event) => handleUpload(event.target.files?.[0], 'image')} />
        <input ref={videoInputRef} type="file" accept={VIDEO_TYPES} className="hidden" onChange={(event) => handleUpload(event.target.files?.[0], 'video')} />

        {videoPanelOpen && (
          <div className="flex flex-col gap-3 border-b border-line bg-card p-3 sm:flex-row sm:items-center" dir={isAr ? 'rtl' : 'ltr'}>
            <EditorButton icon={uploading === 'video' ? Loader2 : Upload} onClick={() => videoInputRef.current?.click()} disabled={Boolean(uploading)}>
              {uploading === 'video' ? label('Uploading…', 'جارٍ الرفع…') : label('Upload video', 'رفع فيديو')}
            </EditorButton>
            <div className="flex min-w-0 flex-1 gap-2">
              <input type="url" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addYouTube()} dir="ltr" placeholder="https://youtube.com/watch?v=…" aria-label={label('YouTube video URL', 'رابط فيديو يوتيوب')} className="input h-9 min-w-0 flex-1 text-xs" />
              <EditorButton icon={Link2} onClick={addYouTube}>{label('Insert YouTube', 'إدراج يوتيوب')}</EditorButton>
            </div>
            <button type="button" onClick={() => { setVideoPanelOpen(false); setVideoUrl(''); replaceMediaRef.current = null; }} className="px-2 py-1 text-xs font-bold text-ink-muted hover:text-ink">{label('Close', 'إغلاق')}</button>
          </div>
        )}

        {uploading && (
          <p className="flex items-center gap-2 border-b border-line px-4 py-2 text-xs font-semibold text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            {label('Uploading media…', 'جارٍ رفع الوسائط…')}
          </p>
        )}
        {error && (
          <p role="alert" className="mx-3 mt-3 rounded-lg border border-negative/30 bg-negative-soft px-3 py-2 text-xs font-bold text-negative-ink">
            {error}
          </p>
        )}

        <div ref={editorRef} dir={isAr ? 'rtl' : 'ltr'} className="mx-auto min-h-[30rem] max-w-4xl bg-card px-3 py-5 sm:px-8 sm:py-8">
          {blocks.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line p-8 text-center">
              <Type className="mb-3 h-8 w-8 text-primary/70" />
              <p className="font-bold text-ink">{label('Start your lesson document', 'ابدأ مستند الدرس')}</p>
              <p className="mt-1 max-w-md text-xs leading-6 text-ink-muted">{label('Write your first paragraph, then add headings, lists, notes, warnings, images, or videos wherever needed.', 'اكتب فقرتك الأولى، ثم أضف العناوين والقوائم والملاحظات والتحذيرات والصور أو الفيديو عند الحاجة.')}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <EditorButton icon={Type} onClick={() => insertBlock('paragraph')}>{label('Add first paragraph', 'أضف الفقرة الأولى')}</EditorButton>
                <EditorButton icon={Heading} onClick={() => insertBlock('heading')}>{label('Add heading', 'أضف عنواناً')}</EditorButton>
              </div>
            </div>
          ) : (
            <>
              {insertPoint(0)}
              {blocks.map((block, index) => (
                <React.Fragment key={block.id}>
                  {renderBlock(block, index)}
                  {insertPoint(index + 1)}
                  {insertMenuAt === index + 1 && insertMenu(index + 1)}
                </React.Fragment>
              ))}
              {insertMenuAt === 0 && insertMenu(0)}
            </>
          )}
        </div>
      </div>
      <p className="text-[11px] leading-5 text-ink-muted">
        {label('Enter creates a new line in a text block. Use “Add block here” to place a new section or media precisely between existing content.', 'ينشئ Enter سطراً جديداً داخل كتلة النص. استخدم «أضف كتلة هنا» لوضع قسم أو وسيط بين المحتوى الحالي بدقة.')}
      </p>
    </section>
  );
}
