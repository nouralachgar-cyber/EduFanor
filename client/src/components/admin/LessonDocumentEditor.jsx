import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
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
const MAX_FILE_BYTES = 7.5 * 1024 * 1024;
const IMAGE_TYPES = 'image/png,image/jpeg,image/webp,image/gif';
const VIDEO_TYPES = 'video/mp4,video/webm,video/ogg';

const textOf = (value) => (typeof value === 'string' ? value : '');

function elementForNode(node) {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
}

function offsetAtRange(element, range, point = 'start') {
  const measure = document.createRange();
  measure.selectNodeContents(element);
  if (point === 'start') {
    measure.setEnd(range.startContainer, range.startOffset);
  } else {
    measure.setEnd(range.endContainer, range.endOffset);
  }
  return measure.toString().length;
}

function EditableText({
  block,
  language,
  placeholder,
  className,
  tagName = 'div',
  onChange,
  onEnter,
  onFocus,
  onSelect,
}) {
  const ref = useRef(null);
  const value = textOf(block.content?.[language]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element && element.innerText.replace(/\r/g, '') !== value) {
      element.textContent = value;
    }
  }, [block.id, language, value]);

  return (
    <div className="relative">
      {React.createElement(tagName, {
        ref,
        contentEditable: true,
        suppressContentEditableWarning: true,
        role: 'textbox',
        'aria-multiline': true,
        'data-editable-content': 'true',
        'data-block-id': block.id,
        dir: language === 'ar' ? 'rtl' : 'ltr',
        className,
        onInput: (event) => {
          onChange(block.id, event.currentTarget.innerText.replace(/\r/g, ''));
          onSelect(event.currentTarget);
        },
        onKeyDown: (event) => onEnter(event, block, event.currentTarget),
        onFocus: (event) => onFocus(block.id, event.currentTarget),
        onMouseUp: (event) => onSelect(event.currentTarget),
        onKeyUp: (event) => onSelect(event.currentTarget),
        onPaste: (event) => {
          event.preventDefault();
          const text = event.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        },
      })}
      {!value && (
        <span className="pointer-events-none absolute inset-inline-0 top-0 select-none text-ink-muted/60">
          {placeholder}
        </span>
      )}
    </div>
  );
}

function EditableList({
  block,
  language,
  placeholder,
  onChange,
  onEnter,
  onFocus,
  onSelect,
}) {
  const ref = useRef(null);
  const values = block.data?.items?.[language];
  const displayValues = useMemo(
    () => (Array.isArray(values) && values.length ? values : ['']),
    [values]
  );

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const current = Array.from(element.children).map((item) => item.innerText.replace(/\r/g, ''));
    if (current.length !== displayValues.length || current.some((item, index) => item !== displayValues[index])) {
      element.innerHTML = displayValues
        .map((item) => `<li>${item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`)
        .join('');
    }
  }, [block.id, displayValues, language]);

  const Tag = block.type === 'numbered-list' ? 'ol' : 'ul';
  return React.createElement(Tag, {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    role: 'list',
    'data-editable-content': 'true',
    'data-block-id': block.id,
    dir: language === 'ar' ? 'rtl' : 'ltr',
    className: 'min-h-8 list-inside space-y-1 ps-8 text-base leading-8 text-ink outline-none marker:text-primary',
    onInput: (event) => {
      const items = Array.from(event.currentTarget.children).map((item) => item.innerText.replace(/\r/g, ''));
      onChange(block.id, items);
      onSelect(event.currentTarget);
    },
    onKeyDown: (event) => onEnter(event, block, event.currentTarget),
    onFocus: () => onFocus(block.id),
    onMouseUp: (event) => onSelect(event.currentTarget),
    onKeyUp: (event) => onSelect(event.currentTarget),
    onPaste: (event) => {
      event.preventDefault();
      document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
    },
    'aria-label': placeholder,
  });
}

function ToolbarButton({ icon: Icon, children, onClick, onMouseDown, title, disabled = false }) {
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
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-xs font-bold text-ink transition-colors hover:border-primary/50 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-primary dark:text-brand-ink" />}
      <span>{children}</span>
    </button>
  );
}

export default function LessonDocumentEditor({
  blocks,
  onChange,
  language,
  onLanguageChange,
}) {
  const isAr = language === 'ar';
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const blocksRef = useRef(blocks);
  const activeBlockRef = useRef(null);
  const selectionRef = useRef(null);
  const focusAfterRenderRef = useRef(null);
  const replaceMediaRef = useRef(null);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [videoPanelOpen, setVideoPanelOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [editingMediaId, setEditingMediaId] = useState(null);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

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

  const changeList = (blockId, values) => {
    changeBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              data: {
                ...block.data,
                items: { ...(block.data?.items || { ar: [], en: [] }), [language]: values },
              },
            }
          : block
      )
    );
  };

  const changeMediaUrl = (blockId, url) => {
    changeBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, data: { ...block.data, url } } : block
      )
    );
  };

  const getSelection = (body) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    if (!body.contains(range.startContainer) || !body.contains(range.endContainer)) return null;
    const blockId = body.dataset.blockId;
    let start = offsetAtRange(body, range, 'start');
    let end = offsetAtRange(body, range, 'end');
    let listIndex = null;
    if (LIST_BLOCK_TYPES.has(blocksRef.current.find((block) => block.id === blockId)?.type)) {
      const startElement = elementForNode(range.startContainer);
      const listItem = startElement?.closest('li');
      if (listItem && body.contains(listItem)) {
        const items = Array.from(body.children);
        listIndex = items.indexOf(listItem);
        start = offsetAtRange(listItem, range, 'start');
        end = offsetAtRange(listItem, range, 'end');
      }
    }
    return { blockId, start, end, listIndex };
  };

  const saveSelection = (body) => {
    if (!body) return;
    activeBlockRef.current = body.dataset.blockId;
    const saved = getSelection(body);
    if (saved) selectionRef.current = saved;
  };

  const saveSelectionFromWindow = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !editorRef.current) return;
    let element = elementForNode(selection.getRangeAt(0).startContainer);
    while (element && editorRef.current.contains(element) && !element.hasAttribute('data-editable-content')) {
      element = element.parentElement;
    }
    if (element?.hasAttribute('data-editable-content')) saveSelection(element);
  };

  const selectionOffsetsForBlock = (block, anchor) => {
    if (!anchor || anchor.blockId !== block.id) return null;
    const start = Math.max(0, anchor.start || 0);
    const end = Math.max(start, anchor.end || start);
    return { start, end };
  };

  const insertAtPosition = (type, data = {}) => {
    const current = blocksRef.current;
    const anchor = selectionRef.current;
    const activeId = activeBlockRef.current;
    const anchorMatchesActive = anchor && anchor.blockId === activeId;
    const insertionAnchor = anchorMatchesActive ? anchor : null;
    const anchorIndex = current.findIndex((block) => block.id === (insertionAnchor?.blockId || activeId));
    const inserted = blankBlock(type);
    inserted.data = { ...inserted.data, ...data };
    let next;
    let focusId = inserted.id;
    let focusOffset = 0;

    if (anchorIndex >= 0 && insertionAnchor && LIST_BLOCK_TYPES.has(current[anchorIndex].type)) {
      const original = current[anchorIndex];
      const items = Array.isArray(original.data?.items?.[language]) ? original.data.items[language] : [];
      const listIndex = Math.max(0, Math.min(insertionAnchor.listIndex ?? items.length - 1, items.length - 1));
      const flatText = items.join('\n');
      const start = items.slice(0, listIndex).reduce((total, item) => total + item.length + 1, 0) + Math.max(0, insertionAnchor.start || 0);
      const end = items.slice(0, listIndex).reduce((total, item) => total + item.length + 1, 0) + Math.max(insertionAnchor.start || 0, insertionAnchor.end || 0);
      const before = flatText.slice(0, Math.min(start, flatText.length));
      const after = flatText.slice(Math.min(end, flatText.length));
      const prefix = {
        ...original,
        data: {
          ...original.data,
          items: { ...(original.data?.items || { ar: [], en: [] }), [language]: before ? before.split('\n') : [] },
        },
      };
      const continuation = blankBlock(original.type);
      continuation.data.items[language] = after ? after.split('\n') : [];
      const tail = after ? [continuation] : !TEXT_BLOCK_TYPES.has(type) ? [blankBlock('paragraph')] : [];
      focusId = TEXT_BLOCK_TYPES.has(type) || LIST_BLOCK_TYPES.has(type) ? inserted.id : tail[0]?.id || inserted.id;
      next = [
        ...current.slice(0, anchorIndex),
        prefix,
        inserted,
        ...tail,
        ...current.slice(anchorIndex + 1),
      ];
    } else if (anchorIndex >= 0 && insertionAnchor && TEXT_BLOCK_TYPES.has(current[anchorIndex].type)) {
      const original = current[anchorIndex];
      const originalText = textOf(original.content?.[language]);
      const { start, end } = selectionOffsetsForBlock(original, insertionAnchor);
      const before = originalText.slice(0, Math.min(start, originalText.length));
      const after = originalText.slice(Math.min(end, originalText.length));
      const atStart = !before;
      const updatedOriginal = {
        ...original,
        content: { ...original.content, [language]: before },
      };
      const prefix = atStart ? [] : [updatedOriginal];
      const continuation = blankBlock('paragraph');
      continuation.content = { ...continuation.content, [language]: after };
      const wantsContinuation = Boolean(after) || !TEXT_BLOCK_TYPES.has(type);
      const tail = wantsContinuation ? [continuation] : [];
      focusId = TEXT_BLOCK_TYPES.has(type) || LIST_BLOCK_TYPES.has(type) ? inserted.id : (tail[0]?.id || inserted.id);
      next = [
        ...current.slice(0, anchorIndex),
        ...prefix,
        inserted,
        ...tail,
        ...current.slice(anchorIndex + 1),
      ];
    } else {
      const index = anchorIndex >= 0 ? anchorIndex + 1 : current.length;
      const continuation = blankBlock('paragraph');
      const needsContinuation = !TEXT_BLOCK_TYPES.has(type);
      next = [
        ...current.slice(0, index),
        inserted,
        ...(needsContinuation ? [continuation] : []),
        ...current.slice(index),
      ];
      if (needsContinuation) focusId = continuation.id;
    }

    if (!next.length) {
      const paragraph = blankBlock('paragraph');
      next = [paragraph];
      focusId = paragraph.id;
    }
    focusAfterRenderRef.current = { blockId: focusId, offset: focusOffset };
    activeBlockRef.current = focusId;
    selectionRef.current = null;
    changeBlocks(next);
  };

  const updateTextAndInsertParagraph = (block, body) => {
    const saved = getSelection(body);
    const text = body.innerText.replace(/\r/g, '');
    const start = Math.min(saved?.start ?? text.length, text.length);
    const end = Math.min(saved?.end ?? start, text.length);
    const before = text.slice(0, start);
    const after = text.slice(end);
    const nextParagraph = blankBlock('paragraph');
    nextParagraph.content = { ...nextParagraph.content, [language]: after };
    const current = blocksRef.current;
    const index = current.findIndex((item) => item.id === block.id);
    if (index < 0) return;
    const next = [...current];
    next[index] = { ...block, content: { ...block.content, [language]: before } };
    next.splice(index + 1, 0, nextParagraph);
    focusAfterRenderRef.current = { blockId: nextParagraph.id, offset: 0 };
    activeBlockRef.current = nextParagraph.id;
    selectionRef.current = null;
    changeBlocks(next);
  };

  const splitListAtCaret = (event, block, body) => {
    const saved = getSelection(body);
    const items = Array.from(body.children).map((item) => item.innerText.replace(/\r/g, ''));
    const listIndex = Math.max(0, Math.min(saved?.listIndex ?? items.length - 1, items.length - 1));
    const item = items[listIndex] || '';
    const start = Math.min(saved?.start ?? item.length, item.length);
    const end = Math.min(saved?.end ?? start, item.length);
    const before = item.slice(0, start);
    const after = item.slice(end);
    const nextItems = [...items];
    nextItems.splice(listIndex, 1, before, after);
    event.preventDefault();
    changeBlocks((current) =>
      current.map((draft) =>
        draft.id === block.id
          ? {
              ...draft,
              data: {
                ...draft.data,
                items: { ...(draft.data?.items || { ar: [], en: [] }), [language]: nextItems },
              },
            }
          : draft
      )
    );
    focusAfterRenderRef.current = { blockId: block.id, listIndex: listIndex + 1, offset: 0 };
  };

  const handleEditableKeyDown = (event, block, body) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (LIST_BLOCK_TYPES.has(block.type)) {
      splitListAtCaret(event, block, body);
      return;
    }
    event.preventDefault();
    updateTextAndInsertParagraph(block, body);
  };

  const focusDocumentPosition = (position) => {
    const wrapper = Array.from(editorRef.current?.querySelectorAll('[data-block-id]') || []).find(
      (element) => element.dataset.blockId === position.blockId
    );
    const body = wrapper?.querySelector('[data-editable-content]');
    if (!body) return;
    body.focus();
    let target = body;
    if (Number.isInteger(position.listIndex)) {
      target = body.children[position.listIndex] || body.children[body.children.length - 1] || body;
    }
    if (!target.firstChild) target.appendChild(document.createTextNode(''));
    const range = document.createRange();
    const textNode = target.firstChild;
    const offset = Math.min(position.offset || 0, textNode.textContent?.length || 0);
    range.setStart(textNode, offset);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    saveSelection(body);
  };

  useLayoutEffect(() => {
    const position = focusAfterRenderRef.current;
    if (!position || !editorRef.current) return;
    focusAfterRenderRef.current = null;
    window.requestAnimationFrame(() => focusDocumentPosition(position));
  }, [blocks]);

  const insertToolbarBlock = (type) => {
    saveSelectionFromWindow();
    insertAtPosition(type);
  };

  const handleUpload = async (file, kind) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError(t('admin.courses.blocks.fileTooLarge'));
      return;
    }
    setUploading(kind);
    setError('');
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error(t('admin.courses.blocks.uploadFailed')));
        reader.readAsDataURL(file);
      });
      const result = await adminApi.uploadAsset({ dataUrl, name: file.name });
      if (!result?.url) throw new Error(t('admin.courses.blocks.uploadFailed'));
      const replaceId = replaceMediaRef.current;
      if (replaceId) {
        changeMediaUrl(replaceId, result.url);
        replaceMediaRef.current = null;
      } else {
        insertAtPosition(kind === 'image' ? 'image' : 'video', { url: result.url });
      }
    } catch (uploadError) {
      setError(uploadError.message || t('admin.courses.blocks.uploadFailed'));
    } finally {
      setUploading('');
      if (kind === 'image' && imageInputRef.current) imageInputRef.current.value = '';
      if (kind === 'video' && videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const addYouTube = () => {
    const url = videoUrl.trim();
    if (!extractYouTubeId(url)) {
      setError(isAr ? 'أدخل رابط يوتيوب صالحاً.' : 'Enter a valid YouTube URL.');
      return;
    }
    insertAtPosition('youtube', { url });
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
    const current = blocksRef.current;
    const next = current.filter((block) => block.id !== blockId);
    if (!next.length) next.push(blankBlock('paragraph'));
    activeBlockRef.current = null;
    selectionRef.current = null;
    changeBlocks(next);
  };

  const editSource = (block) => {
    if (block.type === 'image') {
      setEditingMediaId((current) => (current === block.id ? null : block.id));
      return;
    }
    setEditingMediaId((current) => (current === block.id ? null : block.id));
  };

  const startReplaceMedia = (blockId, kind) => {
    replaceMediaRef.current = blockId;
    if (kind === 'image') imageInputRef.current?.click();
    else videoInputRef.current?.click();
  };

  const toolbarMouseDown = () => saveSelectionFromWindow();
  const toolbarLabel = (english, arabic) => (isAr ? arabic : english);
  const toolbarButtonClass = 'inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-2 text-xs font-bold text-ink transition-colors hover:border-primary/50 hover:bg-brand-soft';

  const renderActions = (block, index) => (
    <div
      className="absolute end-1 top-1 z-10 flex items-center gap-0.5 rounded-lg border border-line bg-card/95 p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      contentEditable={false}
    >
      {block.type === 'image' && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => startReplaceMedia(block.id, 'image')}
          className="rounded-md p-1 text-ink-muted hover:bg-surface-muted hover:text-ink"
          title={toolbarLabel('Replace image', 'استبدال الصورة')}
        >
          <Upload className="h-3.5 w-3.5" />
        </button>
      )}
      {['video', 'youtube'].includes(block.type) && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editSource(block)}
          className="rounded-md p-1 text-ink-muted hover:bg-surface-muted hover:text-ink"
          title={toolbarLabel('Edit video URL', 'تعديل رابط الفيديو')}
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
      )}
      {block.type === 'video' && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => startReplaceMedia(block.id, 'video')}
          className="rounded-md p-1 text-ink-muted hover:bg-surface-muted hover:text-ink"
          title={toolbarLabel('Replace video', 'استبدال الفيديو')}
        >
          <Upload className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => moveBlock(block.id, -1)}
        disabled={index === 0}
        className="rounded-md p-1 text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-30"
        title={toolbarLabel('Move up', 'تحريك لأعلى')}
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => moveBlock(block.id, 1)}
        disabled={index === blocks.length - 1}
        className="rounded-md p-1 text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-30"
        title={toolbarLabel('Move down', 'تحريك لأسفل')}
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => removeBlock(block.id)}
        className="rounded-md p-1 text-danger hover:bg-danger-soft"
        title={toolbarLabel('Delete block', 'حذف الكتلة')}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  const renderBlockBody = (block) => {
    if (TEXT_BLOCK_TYPES.has(block.type)) {
      const classNames = {
        heading: 'min-h-10 ps-8 pe-16 text-2xl font-extrabold leading-tight text-ink outline-none',
        subheading: 'min-h-9 ps-8 pe-16 text-xl font-bold leading-tight text-ink outline-none',
        warning: 'min-h-8 ps-8 pe-12 text-sm font-semibold leading-7 text-ink outline-none',
        note: 'min-h-8 ps-8 pe-12 text-sm leading-7 text-ink outline-none',
        tip: 'min-h-8 ps-8 pe-12 text-sm leading-7 text-ink outline-none',
        paragraph: 'min-h-8 ps-8 pe-16 text-base leading-8 text-ink outline-none',
        'rich-text': 'min-h-8 ps-8 pe-16 text-base leading-8 text-ink outline-none',
        text: 'min-h-8 ps-8 pe-16 text-base leading-8 text-ink outline-none',
        important: 'min-h-8 ps-8 pe-12 text-sm leading-7 text-ink outline-none',
        callout: 'min-h-8 ps-8 pe-12 text-sm leading-7 text-ink outline-none',
        safety: 'min-h-8 ps-8 pe-12 text-sm leading-7 text-ink outline-none',
      };
      const tagName = block.type === 'heading' ? 'h2' : block.type === 'subheading' ? 'h3' : 'div';
      const editable = (
        <EditableText
          block={block}
          language={language}
          tagName={tagName}
          placeholder={
            block.type === 'heading'
              ? toolbarLabel('Heading', 'عنوان')
              : block.type === 'subheading'
                ? toolbarLabel('Subheading', 'عنوان فرعي')
                : block.type === 'warning'
                  ? toolbarLabel('Write a warning or emergency alert…', 'اكتب تحذيراً أو تنبيهاً طارئاً…')
                  : block.type === 'note' || block.type === 'tip'
                    ? toolbarLabel('Write a note…', 'اكتب ملاحظة…')
                    : toolbarLabel('Start writing…', 'ابدأ الكتابة…')
          }
          className={`${classNames[block.type] || classNames.paragraph} whitespace-pre-wrap`}
          onChange={changeText}
          onEnter={handleEditableKeyDown}
          onFocus={(id, body) => {
            activeBlockRef.current = id;
            setActiveBlockId(id);
            setFocusedBlockId(id);
            saveSelection(body);
          }}
          onSelect={saveSelection}
        />
      );
      if (block.type === 'warning') {
        return <div className="rounded-xl border border-danger/30 bg-danger-soft p-4">{editable}</div>;
      }
      if (block.type === 'note' || block.type === 'important' || block.type === 'callout') {
        return <div className="rounded-xl border border-primary/25 bg-brand-soft/50 p-4">{editable}</div>;
      }
      if (block.type === 'tip') {
        return <div className="rounded-xl border border-accent/30 bg-amber-soft/20 p-4">{editable}</div>;
      }
      return editable;
    }

    if (LIST_BLOCK_TYPES.has(block.type)) {
      return (
        <EditableList
          block={block}
          language={language}
          placeholder={toolbarLabel('List item', 'عنصر القائمة')}
          onChange={changeList}
          onEnter={handleEditableKeyDown}
          onFocus={(id) => {
            activeBlockRef.current = id;
            setActiveBlockId(id);
            setFocusedBlockId(id);
          }}
          onSelect={saveSelection}
        />
      );
    }

    if (block.type === 'divider') {
      return <hr className="my-4 border-0 border-t border-line-strong" />;
    }

    if (block.type === 'image') {
      const src = resolveAssetUrl(block.data?.url || '');
      return (
        <figure className="my-2 space-y-2">
          {src ? (
            <img src={src} alt={block.data?.alt?.[language] || ''} className="max-h-[34rem] w-auto max-w-full rounded-xl object-contain" />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface-muted text-sm text-ink-muted">
              {toolbarLabel('Choose an image from your computer', 'اختر صورة من جهازك')}
            </div>
          )}
          {block.data?.caption?.[language] && (
            <figcaption className="text-center text-xs text-ink-muted">{block.data.caption[language]}</figcaption>
          )}
        </figure>
      );
    }

    if (block.type === 'video' || block.type === 'youtube') {
      const url = block.data?.url || '';
      const videoId = extractYouTubeId(url);
      return (
        <div className="my-2 w-full overflow-hidden rounded-xl border border-line bg-black">
          {videoId ? (
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`}
                title={toolbarLabel('Lesson video', 'فيديو الدرس')}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : url ? (
            <video src={resolveAssetUrl(url)} controls className="h-auto w-full" preload="metadata" />
          ) : (
            <div className="flex h-44 items-center justify-center text-sm text-white/70">
              {toolbarLabel('Select or upload a video', 'اختر فيديو أو ارفعه')}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-line bg-surface-muted p-3 text-xs text-ink-muted">
        {block.type}
      </div>
    );
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-ink">{toolbarLabel('Lesson content', 'محتوى الدرس')}</h2>
          <p className="mt-1 text-xs text-ink-muted">
            {toolbarLabel('Write naturally, then insert media or blocks where you need them.', 'اكتب بشكل طبيعي، ثم أدرج الوسائط أو الكتل في موضعها.')}
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-line bg-surface-muted p-1" role="group" aria-label={toolbarLabel('Editing language', 'لغة التحرير')}>
          {['ar', 'en'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                selectionRef.current = null;
                activeBlockRef.current = null;
                setActiveBlockId(null);
                setFocusedBlockId(null);
                onLanguageChange(lang);
              }}
              aria-pressed={language === lang}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors ${
                language === lang ? 'bg-primary text-on-primary' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {lang === 'ar' ? 'العربية' : 'English'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface-muted/40 p-2 sm:p-3">
        <div className="flex flex-wrap gap-1.5 border-b border-line p-2" role="toolbar" aria-label={toolbarLabel('Insert lesson content', 'إدراج محتوى الدرس')}>
          <ToolbarButton icon={Type} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('paragraph')}>
            {toolbarLabel('Text', 'نص')}
          </ToolbarButton>
          <ToolbarButton icon={Heading} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('heading')}>
            {toolbarLabel('Heading', 'عنوان')}
          </ToolbarButton>
          <ToolbarButton icon={Heading2} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('subheading')}>
            {toolbarLabel('Subheading', 'عنوان فرعي')}
          </ToolbarButton>
          <ToolbarButton
            icon={ImageIcon}
            onMouseDown={toolbarMouseDown}
            onClick={() => imageInputRef.current?.click()}
            disabled={Boolean(uploading)}
          >
            {toolbarLabel('Image', 'صورة')}
          </ToolbarButton>
          <ToolbarButton
            icon={Video}
            onMouseDown={toolbarMouseDown}
            onClick={() => setVideoPanelOpen((open) => !open)}
            disabled={Boolean(uploading)}
          >
            {toolbarLabel('Video', 'فيديو')}
          </ToolbarButton>
          <ToolbarButton
            icon={Link2}
            onMouseDown={toolbarMouseDown}
            onClick={() => {
              setVideoPanelOpen(true);
              setError('');
            }}
          >
            {toolbarLabel('YouTube link', 'رابط يوتيوب')}
          </ToolbarButton>
          <ToolbarButton icon={List} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('list')}>
            {toolbarLabel('List', 'قائمة')}
          </ToolbarButton>
          <ToolbarButton icon={ListOrdered} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('numbered-list')}>
            {toolbarLabel('Numbered list', 'قائمة مرقمة')}
          </ToolbarButton>
          <ToolbarButton icon={Info} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('note')}>
            {toolbarLabel('Note', 'ملاحظة')}
          </ToolbarButton>
          <ToolbarButton icon={Lightbulb} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('tip')}>
            {toolbarLabel('Tip', 'نصيحة')}
          </ToolbarButton>
          <ToolbarButton icon={AlertTriangle} onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('warning')}>
            {toolbarLabel('Warning', 'تحذير')}
          </ToolbarButton>
          <ToolbarButton onMouseDown={toolbarMouseDown} onClick={() => insertToolbarBlock('divider')}>
            {toolbarLabel('Divider', 'فاصل')}
          </ToolbarButton>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept={IMAGE_TYPES}
          className="hidden"
          onChange={(event) => handleUpload(event.target.files?.[0], 'image')}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept={VIDEO_TYPES}
          className="hidden"
          onChange={(event) => handleUpload(event.target.files?.[0], 'video')}
        />

        {videoPanelOpen && (
          <div className="flex flex-col gap-2 border-b border-line bg-card p-3 sm:flex-row sm:items-center">
            <button
              type="button"
              disabled={Boolean(uploading)}
              onMouseDown={(event) => {
                event.preventDefault();
                toolbarMouseDown();
              }}
              onClick={() => videoInputRef.current?.click()}
              className={toolbarButtonClass}
            >
              {uploading === 'video' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {toolbarLabel('Upload video', 'رفع فيديو')}
            </button>
            <div className="flex min-w-0 flex-1 gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && addYouTube()}
                dir="ltr"
                placeholder="https://youtube.com/watch?v=…"
                className="input h-9 min-w-0 flex-1 text-xs"
                aria-label={toolbarLabel('YouTube video URL', 'رابط فيديو يوتيوب')}
              />
              <button type="button" onMouseDown={(event) => { event.preventDefault(); toolbarMouseDown(); }} onClick={addYouTube} className={toolbarButtonClass}>
                <Link2 className="h-4 w-4" /> {toolbarLabel('Insert YouTube', 'إدراج يوتيوب')}
              </button>
            </div>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setVideoPanelOpen(false);
                setVideoUrl('');
              }}
              className="text-xs font-bold text-ink-muted hover:text-ink"
            >
              {toolbarLabel('Close', 'إغلاق')}
            </button>
          </div>
        )}

        {uploading && (
          <p className="flex items-center gap-2 px-3 pt-3 text-xs font-semibold text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            {toolbarLabel('Uploading media…', 'جارٍ رفع الوسائط…')}
          </p>
        )}
        {error && (
          <p role="alert" className="mx-3 mt-3 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-xs font-bold text-danger">
            {error}
          </p>
        )}

        <div
          ref={editorRef}
          dir={isAr ? 'rtl' : 'ltr'}
          className="min-h-[28rem] space-y-3 bg-card px-3 py-5 sm:px-6 sm:py-7"
          onMouseUp={saveSelectionFromWindow}
          onKeyUp={saveSelectionFromWindow}
          onClick={(event) => {
            const wrapper = event.target.closest('[data-block-id]');
            if (wrapper && editorRef.current.contains(wrapper)) {
              activeBlockRef.current = wrapper.dataset.blockId;
              setActiveBlockId(wrapper.dataset.blockId);
            }
          }}
        >
          {blocks.map((block, index) => (
            <div
              key={block.id}
              data-block-id={block.id}
              data-block-type={block.type}
              onFocusCapture={() => {
                activeBlockRef.current = block.id;
                setActiveBlockId(block.id);
              }}
              className={`group relative rounded-lg px-2 py-1 transition-colors ${
                activeBlockId === block.id || focusedBlockId === block.id ? 'bg-surface-muted/40' : 'hover:bg-surface-muted/30'
              }`}
            >
              {renderActions(block, index)}
              {LIST_BLOCK_TYPES.has(block.type) && <div className="absolute top-2 start-2 text-primary">{block.type === 'numbered-list' ? <ListOrdered className="h-4 w-4" /> : <List className="h-4 w-4" />}</div>}
              {TEXT_BLOCK_TYPES.has(block.type) && (
                <span className="absolute start-2 top-1 text-primary">
                  {block.type === 'heading' ? <Heading className="h-4 w-4" /> : block.type === 'subheading' ? <Heading2 className="h-4 w-4" /> : block.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> : null}
                </span>
              )}
              {LIST_BLOCK_TYPES.has(block.type) ? (
                <EditableList
                  block={block}
                  language={language}
                  placeholder={toolbarLabel('List item', 'عنصر القائمة')}
                  onChange={changeList}
                  onEnter={handleEditableKeyDown}
                  onFocus={(id) => {
                    activeBlockRef.current = id;
                    setActiveBlockId(id);
                    setFocusedBlockId(id);
                  }}
                  onSelect={saveSelection}
                />
              ) : TEXT_BLOCK_TYPES.has(block.type) ? (
                renderBlockBody(block)
              ) : (
                <div
                  className="min-h-8 pe-10"
                  onClick={() => {
                    activeBlockRef.current = block.id;
                    setActiveBlockId(block.id);
                  }}
                >
                  {renderBlockBody(block)}
                </div>
              )}
              {editingMediaId === block.id && ['image', 'video', 'youtube'].includes(block.type) && (
                <div className="mt-2 flex gap-2" contentEditable={false}>
                  <input
                    type="url"
                    value={block.data?.url || ''}
                    onChange={(event) => changeMediaUrl(block.id, event.target.value)}
                    dir="ltr"
                    className="input h-8 flex-1 text-xs"
                    placeholder={toolbarLabel('Media URL', 'رابط الوسائط')}
                  />
                  <button type="button" onClick={() => setEditingMediaId(null)} className="rounded-lg border border-line px-2 text-xs font-bold text-ink-muted">
                    {toolbarLabel('Done', 'تم')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-ink-muted">
        {toolbarLabel('Enter starts a new paragraph. Use the toolbar to insert content at the caret.', 'اضغط Enter لبدء فقرة جديدة، واستخدم شريط الأدوات لإدراج المحتوى عند المؤشر.')}
      </p>
      {blocks.length === 0 && (
        <button type="button" onClick={() => insertToolbarBlock('paragraph')} className="inline-flex items-center gap-1 text-xs font-bold text-primary">
          <Plus className="h-3.5 w-3.5" /> {toolbarLabel('Start writing', 'ابدأ الكتابة')}
        </button>
      )}
    </section>
  );
}
