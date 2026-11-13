import { extractYouTubeId } from '../LessonBlocks';
import { blankBlock, hasBlockContent, normalizeBlocks } from './LessonBlocksEditor';

const mediaUrl = (value) => (typeof value === 'string' ? value : value?.url || value?.src || '');

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
