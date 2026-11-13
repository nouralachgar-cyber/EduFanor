import React from 'react';
import {
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  FileDown,
  Info,
  Image as ImageIcon,
  Lightbulb,
  ShieldCheck,
  Play,
} from './icons';
import { resolveAssetUrl } from '../lib/api';

export function extractYouTubeId(url) {
  if (!url) return null;
  const value = String(url).trim();
  const directMatch = value.match(/^([A-Za-z0-9_-]{11})$/);
  if (directMatch) return directMatch[1];
  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com' || host === 'music.youtube.com') {
      if (parsed.pathname.startsWith('/watch')) return parsed.searchParams.get('v');
      if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/embed/')[1]?.split(/[/?]/)[0];
      if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/shorts/')[1]?.split(/[/?]/)[0];
      if (parsed.pathname.startsWith('/live/')) return parsed.pathname.split('/live/')[1]?.split(/[/?]/)[0];
    }
    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split(/[/?]/)[0];
    }
  } catch {
    /* Fall through to the loose pattern matcher below. */
  }
  const match = value.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
  return match ? match[1] : null;
}

export const localizeBlockValue = (value, isAr) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object' && !Array.isArray(value)) {
    const text = value[isAr ? 'ar' : 'en'] ?? value.en ?? value.ar ?? '';
    return typeof text === 'string' ? text : '';
  }
  return typeof value === 'string' ? value : '';
};

const textOf = (value, isAr) => {
  const result = localizeBlockValue(value, isAr);
  return typeof result === 'string' ? result : '';
};

const renderInlineText = (text) => {
  const source = String(text || '');
  const parts = source.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a key={index} href={match[2]} target="_blank" rel="noreferrer" className="font-semibold text-primary underline underline-offset-2">
          {match[1]}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const blockMedia = (block) => {
  const content = block?.content;
  const data = block?.data || {};
  const url =
    data.url ||
    data.src ||
    (typeof content === 'string' ? content : content?.url || content?.src) ||
    '';
  return typeof url === 'string' ? resolveAssetUrl(url) : '';
};

const galleryItems = (block, isAr) => {
  const data = block?.data || {};
  if (Array.isArray(data.images) && data.images.length) {
    return data.images
      .map((item) => {
        if (typeof item === 'string') return { url: item, caption: '', alt: '' };
        return {
          url: resolveAssetUrl(typeof item.url === 'string' ? item.url : typeof item === 'object' ? item.src || '' : ''),
          caption: textOf(item.caption, isAr),
          alt: textOf(item.alt, isAr),
        };
      })
      .filter((item) => item.url);
  }
  const urls = Array.isArray(data.urls) ? data.urls : Array.isArray(data.images) ? data.images : [];
  return urls.map((url) => ({ url: resolveAssetUrl(url), caption: textOf(data.captions, isAr), alt: '' }));
};

function YouTubeEmbed({ src, title, fallbackMessage }) {
  const videoId = extractYouTubeId(src);
  if (!videoId) {
    return (
      <div className="my-6 flex items-start gap-3 rounded-2xl border border-dashed border-line bg-surface-muted p-5 text-sm text-ink-muted">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
        <span>{fallbackMessage}</span>
      </div>
    );
  }
  return (
    <div className="my-6 space-y-2">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black"
        style={{ aspectRatio: '16 / 9' }}
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`}
          title={title}
          frameBorder="0"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-ink transition-colors hover:text-accent"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Watch on YouTube
      </a>
    </div>
  );
}

export function LessonBlockRenderer({ block, isAr }) {
  if (!block) return null;
  const type = block.type || 'text';
  const content = block.content;
  const data = block.data || {};

  if (type === 'divider') {
    return <hr className="my-6 border-0 border-t border-line-strong" />;
  }

  if (type === 'heading') {
    return (
      <h2 className="mt-8 mb-4 font-display text-2xl font-bold text-ink sm:text-3xl">{renderInlineText(textOf(content, isAr))}</h2>
    );
  }
  if (type === 'subheading') {
    return <h3 className="mt-6 mb-3 text-xl font-extrabold text-ink sm:text-2xl">{renderInlineText(textOf(content, isAr))}</h3>;
  }
  if (type === 'paragraph' || type === 'text' || type === 'rich-text') {
    const images = Array.isArray(data.images) ? data.images.filter(Boolean).map(resolveAssetUrl) : [];
    const videos = Array.isArray(data.videos) ? data.videos.filter(Boolean).map(resolveAssetUrl) : [];
    return (
      <div className="mb-4 space-y-3">
        <p className="text-sm leading-relaxed text-ink sm:text-base whitespace-pre-wrap">{renderInlineText(textOf(content, isAr))}</p>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((url, index) => (
              <img key={index} src={url} alt="" className="h-auto max-w-full rounded-2xl border border-line" loading="lazy" />
            ))}
          </div>
        )}
        {videos.length > 0 && (
          <div className="space-y-3">
            {videos.map((url, index) => {
              const videoId = extractYouTubeId(url);
              if (videoId) {
                return (
                  <div key={index} className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black" style={{ aspectRatio: '16 / 9' }}>
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`}
                      title="Video"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                );
              }
              return <video key={index} src={url} controls className="h-auto w-full rounded-2xl border border-line" preload="metadata" />;
            })}
          </div>
        )}
      </div>
    );
  }
  if (type === 'image' || type === 'figure') {
    const src = blockMedia(block);
    const alt = textOf(data.alt, isAr) || '';
    const caption = textOf(data.caption, isAr);
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-line bg-card">
        {src ? (
          <img src={src} alt={alt} className="h-auto w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-48 items-center justify-center bg-surface-muted text-ink-muted">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        {caption ? (
          <figcaption className="border-t border-line px-4 py-2.5 text-center text-xs text-ink-muted">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }
  if (type === 'gallery') {
    const items = galleryItems(block, isAr);
    if (!items.length) return null;
    return (
      <div className="my-6 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <figure
            key={`${item.url}-${index}`}
            className={`overflow-hidden rounded-2xl border border-line bg-card ${index === 0 && items.length > 1 ? 'sm:col-span-2' : ''}`}
          >
            <img src={item.url} alt={item.alt || item.caption || ''} className="h-52 w-full object-cover sm:h-60" loading="lazy" />
            {item.caption && (
              <figcaption className="border-t border-line px-3 py-2 text-center text-[11px] text-ink-muted">{item.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  }
  if (type === 'video' || type === 'youtube') {
    const src = blockMedia(block);
    const title = textOf(data.title, isAr) || (isAr ? 'فيديو الدرس' : 'Lesson video');
    const invalidMessage = isAr
      ? 'رابط الفيديو غير صالح. تم تعطيل التضمين لهذا الفيديو أو الرابط غير صحيح.'
      : 'This video link is not valid or embedding is disabled for it.';
    if (type === 'youtube') {
      return <YouTubeEmbed src={src} title={title} fallbackMessage={invalidMessage} />;
    }
    if (src) {
      const youtubeId = extractYouTubeId(src);
      if (youtubeId) return <YouTubeEmbed src={src} title={title} fallbackMessage={invalidMessage} />;
      return (
        <div className="my-6 overflow-hidden rounded-2xl border border-line bg-card">
          <video src={src} controls className="h-auto w-full" preload="metadata">
            {isAr ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support embedded video.'}
          </video>
        </div>
      );
    }
    return (
      <div className="my-6 flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface-muted text-ink-muted">
        <Play className="h-8 w-8" />
        <span className="text-xs font-bold">{isAr ? 'لا يوجد فيديو بعد' : 'No video yet'}</span>
      </div>
    );
  }
  if (type === 'important' || type === 'callout') {
    const text = textOf(content, isAr);
    if (!text) return null;
    return (
      <div className="my-6 flex items-start gap-3 rounded-2xl border border-accent/30 bg-amber-soft/20 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="mb-1 text-xs font-extrabold text-accent">{isAr ? 'معلومات مهمة' : 'Important'}</p>
          <p className="text-sm leading-relaxed text-ink">{renderInlineText(text)}</p>
        </div>
      </div>
    );
  }
  if (type === 'warning') {
    const text = textOf(content, isAr);
    if (!text) return null;
    return (
      <div className="my-6 flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
        <div>
          <p className="mb-1 text-xs font-extrabold text-danger">{isAr ? 'تحذير' : 'Warning'}</p>
          <p className="text-sm leading-relaxed text-ink">{renderInlineText(text)}</p>
        </div>
      </div>
    );
  }
  if (type === 'note') {
    const text = textOf(content, isAr);
    if (!text) return null;
    return (
      <div className="my-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-brand-soft/40 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-brand-ink" />
        <div>
          <p className="mb-1 text-xs font-extrabold text-primary dark:text-brand-ink">{isAr ? 'ملاحظة' : 'Note'}</p>
          <p className="text-sm leading-relaxed text-ink">{renderInlineText(text)}</p>
        </div>
      </div>
    );
  }
  if (type === 'safety') {
    const text = textOf(content, isAr);
    if (!text) return null;
    return (
      <div className="my-6 flex items-start gap-3 rounded-2xl border border-elegantPink/40 bg-brand-soft p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-brand-ink" />
        <div>
          <p className="mb-1 text-xs font-extrabold text-ink">{isAr ? 'معلومات السلامة' : 'Safety information'}</p>
          <p className="text-sm leading-relaxed text-ink">{renderInlineText(text)}</p>
        </div>
      </div>
    );
  }
  if (type === 'tip') {
    const text = textOf(content, isAr);
    if (!text) return null;
    return (
      <div className="my-6 flex items-start gap-3 rounded-2xl border border-elegantPink/30 bg-brand-soft/70 p-4">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-elegantPink" />
        <div>
          <p className="mb-1 text-xs font-extrabold text-elegantPink">{isAr ? 'نصيحة' : 'Tip'}</p>
          <p className="text-sm leading-relaxed text-ink">{renderInlineText(text)}</p>
        </div>
      </div>
    );
  }
  if (type === 'list' || type === 'bullet') {
    const items = Array.isArray(data.items) ? data.items : Array.isArray(content) ? content : [];
    return (
      <ul className="my-4 space-y-2 list-disc ps-6">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-relaxed text-ink sm:text-base">
            {renderInlineText(textOf(item, isAr))}
          </li>
        ))}
      </ul>
    );
  }
  if (type === 'numbered-list' || type === 'ordered') {
    const items = Array.isArray(data.items) ? data.items : Array.isArray(content) ? content : [];
    return (
      <ol className="my-4 space-y-2 list-decimal ps-6">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-relaxed text-ink sm:text-base">
            {renderInlineText(textOf(item, isAr))}
          </li>
        ))}
      </ol>
    );
  }
  if (type === 'steps') {
    const steps = Array.isArray(data.steps) ? data.steps : [];
    return (
      <div className="my-6 space-y-4">
        {steps.map((step, index) => {
          const title = textOf(step.title, isAr);
          const body = textOf(step.content ?? step.text, isAr);
          const image = resolveAssetUrl(step.image || step.src || '');
          return (
            <div key={index} className="relative flex gap-4 rounded-2xl border border-line bg-card p-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-extrabold text-on-primary">
                  {index + 1}
                </div>
                {index < steps.length - 1 && <div className="hidden w-px flex-1 bg-line sm:block" />}
              </div>
              <div className="min-w-0 flex-1">
                {title && <h4 className="mb-2 font-extrabold text-ink">{title}</h4>}
                {body && <p className="text-sm leading-relaxed text-ink-muted">{body}</p>}
                {image && (
                  <img
                    src={image}
                    alt={title || ''}
                    className="mt-3 h-auto max-h-64 w-auto max-w-full rounded-xl border border-line"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  if (type === 'table') {
    const headers = Array.isArray(data.headers)
      ? data.headers
      : Array.isArray(content?.headers)
      ? content.headers
      : [];
    const rows = Array.isArray(data.rows) ? data.rows : Array.isArray(content?.rows) ? content.rows : [];
    if (!headers.length && !rows.length) return null;
    const columns = Math.max(headers.length, ...rows.map((row) => (Array.isArray(row) ? row.length : 0)));
    return (
      <div className="my-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full border-collapse text-start text-sm">
          {headers.length > 0 && (
            <thead className="bg-surface-muted">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="border-b border-line px-4 py-3 text-start text-xs font-extrabold text-ink">
                    {textOf(headers[index], isAr)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => {
              const cells = Array.isArray(row) ? row : Object.values(row || {});
              return (
                <tr key={rowIndex} className="border-b border-line last:border-0">
                  {Array.from({ length: columns }).map((_, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 align-top leading-relaxed text-ink-muted">
                      {textOf(cells[cellIndex], isAr)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  if (type === 'attachment') {
    const url = blockMedia(block);
    const name =
      textOf(data.name, isAr) ||
      textOf(data.title, isAr) ||
      (isAr ? 'ملف مرفق' : 'Attachment');
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="my-4 flex items-center gap-3 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-primary/40 hover:bg-surface-muted"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
          <FileDown className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-extrabold text-ink">{name}</span>
          <span className="mt-0.5 block text-[11px] font-semibold text-ink-muted">
            {isAr ? 'اضغط لتحميل الملف' : 'Open the file'}
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted rtl:rotate-180" />
      </a>
    );
  }

  const fallback = textOf(content, isAr);
  if (!fallback) return null;
  return <div className="mb-4 whitespace-pre-wrap text-sm text-ink">{fallback}</div>;
}

export default function LessonBlocks({ blocks, isAr, className = '' }) {
  const list = Array.isArray(blocks) ? blocks : [];
  if (!list.length) return null;
  return (
    <div className={className}>
      {list.map((block, index) => (
        <LessonBlockRenderer key={index} block={block} isAr={isAr} />
      ))}
    </div>
  );
}
