import { extractYouTubeId } from '../LessonBlocks';
import { blankBlock, hasBlockContent, normalizeBlocks } from './LessonBlocksEditor';

export const TEXT_BLOCK_TYPES = new Set([
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
export const LIST_BLOCK_TYPES = new Set(['list', 'numbered-list']);
export const MEDIA_BLOCK_TYPES = new Set(['image', 'video', 'youtube']);

const mediaUrl = (value) => (typeof value === 'string' ? value : value?.url || value?.src || '');
const textOf = (value) => (typeof value === 'string' ? value : '');
const numberOr = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const emptyAnchor = () => ({ index: null, blockId: null, start: 0, end: 0 });

export function anchorFromEditable(element, blocks, fallback = emptyAnchor()) {
  const source = Array.isArray(blocks) ? blocks : [];
  const blockId = element?.dataset?.editableId;
  if (!blockId || !source.some((block) => block.id === blockId)) {
    return fallback ? { ...fallback } : emptyAnchor();
  }
  const start = Math.max(0, numberOr(element.selectionStart, 0));
  const end = Math.max(start, numberOr(element.selectionEnd, start));
  return { index: null, blockId, start, end };
}

export function insertLessonBlock(blocks, type, data, anchor, language = 'en', explicitIndex = null) {
  const current = Array.isArray(blocks) ? blocks : [];
  const sourceAnchor = anchor && typeof anchor === 'object' ? anchor : emptyAnchor();
  const hasExplicitIndex = Number.isInteger(explicitIndex);
  const anchorIndex = hasExplicitIndex
    ? explicitIndex
    : sourceAnchor.blockId
      ? current.findIndex((block) => block.id === sourceAnchor.blockId)
      : Number.isInteger(sourceAnchor.index)
        ? sourceAnchor.index
        : current.length;
  const inserted = blankBlock(type);
  inserted.data = { ...inserted.data, ...(data || {}) };
  const isMedia = MEDIA_BLOCK_TYPES.has(type);
  let next;
  let focusId = inserted.id;

  if (!hasExplicitIndex && anchorIndex >= 0 && sourceAnchor.blockId && current[anchorIndex]) {
    const original = current[anchorIndex];
    const isList = LIST_BLOCK_TYPES.has(original.type);
    if (TEXT_BLOCK_TYPES.has(original.type) || isList) {
      const source = isList
        ? (Array.isArray(original.data?.items?.[language]) ? original.data.items[language] : []).join('\n')
        : textOf(original.content?.[language]);
      const start = Math.min(Math.max(0, numberOr(sourceAnchor.start, 0)), source.length);
      const end = Math.min(Math.max(start, numberOr(sourceAnchor.end, start)), source.length);
      const before = source.slice(0, start);
      const after = source.slice(end);
      const items = { ...(original.data?.items || { ar: [], en: [] }) };
      const prefix = isList
        ? {
            ...original,
            data: {
              ...original.data,
              items: { ...items, [language]: before ? before.split('\n') : [] },
            },
          }
        : { ...original, content: { ...original.content, [language]: before } };

      if (isMedia) {
        const continuation = blankBlock('paragraph');
        continuation.content = { ...continuation.content, [language]: isList ? '' : after };
        const remainder = isList && after
          ? [
              {
                ...blankBlock(original.type),
                data: {
                  ...original.data,
                  items: { ...items, [language]: after.split('\n') },
                },
              },
            ]
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
    const index = Math.max(0, Math.min(hasExplicitIndex ? explicitIndex : anchorIndex, current.length));
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
  return { blocks: next, focusId, focusOffset: 0 };
}

function expandLegacyParagraphMedia(blocks) {
  const source = Array.isArray(blocks) ? blocks : [];
  return source.flatMap((block) => {
    if (!['paragraph', 'text', 'rich-text'].includes(block?.type)) return [block];
    const images = Array.isArray(block.data?.images) ? block.data.images : [];
    const videos = Array.isArray(block.data?.videos) ? block.data.videos : [];
    return [
      block,
      ...images
        .map(mediaUrl)
        .filter(Boolean)
        .map((url) => ({ type: 'image', content: '', data: { url } })),
      ...videos
        .map(mediaUrl)
        .filter(Boolean)
        .map((url) => ({
          type: extractYouTubeId(mediaUrl(url)) ? 'youtube' : 'video',
          content: '',
          data: { url: mediaUrl(url) },
        })),
    ];
  });
}

export function normalizeLessonDocument(blocks, legacyContent) {
  const arSource = Array.isArray(blocks?.ar) ? blocks.ar : Array.isArray(blocks) ? blocks : [];
  const enSource = Array.isArray(blocks?.en) ? blocks.en : arSource;
  const normalized = normalizeBlocks({
    ar: expandLegacyParagraphMedia(arSource),
    en: expandLegacyParagraphMedia(enSource),
  });
  if (normalized.length) return normalized;

  const paragraph = blankBlock('paragraph');
  paragraph.content = {
    ar: typeof legacyContent?.ar === 'string' ? legacyContent.ar : '',
    en: typeof legacyContent?.en === 'string' ? legacyContent.en : '',
  };
  return [paragraph];
}

export function lessonBlocksForSave(blocks) {
  return (Array.isArray(blocks) ? blocks : []).filter((block) => {
    if (block.type === 'divider') return true;
    return hasBlockContent([block]);
  });
}
