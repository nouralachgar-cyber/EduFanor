import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, CheckCircle2, ClipboardCheck, Download } from '../icons';

async function createPng(svgElement) {
  if (!svgElement) throw new Error('Achievement preview is not available.');
  if (document.fonts?.ready) await document.fonts.ready;

  const clone = svgElement.cloneNode(true);
  const computed = getComputedStyle(svgElement);
  const resolved = new Map();
  const resolveVariables = (value) =>
    value.replace(/var\(--palette-([a-z0-9-]+)\)/g, (match, token) => {
      if (!resolved.has(token)) {
        resolved.set(token, computed.getPropertyValue(`--palette-${token}`).trim() || match);
      }
      return resolved.get(token);
    });
  [clone, ...clone.querySelectorAll('*')].forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.value.includes('var(--palette-')) {
        element.setAttribute(attribute.name, resolveVariables(attribute.value));
      }
    });
  });

  const svgBlob = new Blob([new XMLSerializer().serializeToString(clone)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const svgUrl = URL.createObjectURL(svgBlob);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('Unable to render the achievement graphic.'));
      image.src = svgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 3600;
    canvas.height = 2400;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('PNG rendering is not available in this browser.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Unable to export the achievement as a PNG.'));
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function safeFileName(name) {
  const cleanName = Array.from(String(name || '').normalize('NFKC'))
    .map((character) =>
      /[<>:"/\\|?*]/.test(character) || character.charCodeAt(0) < 32
        ? '-'
        : character
    )
    .join('')
    .trim()
    .replace(/\s+/g, '-');
  return `${cleanName || 'edufanor'}-learning-achievement.png`;
}

export default function AchievementActions({
  svgRef,
  studentName,
  compact = false,
}) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const platformUrl = typeof window === 'undefined' ? '' : window.location.origin;
  const shareMessage = t('achievement.shareMessage', {
    name: studentName,
    url: platformUrl,
  });

  const handleDownload = async () => {
    setStatus('');
    try {
      const png = await createPng(svgRef.current);
      const url = URL.createObjectURL(png);
      const link = document.createElement('a');
      link.href = url;
      link.download = safeFileName(studentName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(t('achievement.downloadReady'));
    } catch {
      setStatus(t('achievement.downloadError'));
    }
  };

  const handleLinkedInShare = () => {
    const shareUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
    shareUrl.searchParams.set('url', platformUrl);
    window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
    setStatus(t('achievement.linkedinOpened'));
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setStatus(t('achievement.messageCopied'));
    } catch {
      setStatus(t('achievement.copyError'));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={handleDownload} className="btn-primary justify-center px-4 text-xs">
          <Download className="h-4 w-4" />
          {t('achievement.downloadButton')}
        </button>
        <button type="button" onClick={handleLinkedInShare} className="btn-secondary justify-center px-4 text-xs">
          <ArrowUpRight className="h-4 w-4" />
          {t('achievement.linkedinButton')}
        </button>
      </div>
      {!compact && (
        <div className="space-y-2">
          <label htmlFor="achievement-share-message" className="text-xs font-bold text-ink">
            {t('achievement.shareMessageLabel')}
          </label>
          <textarea
            id="achievement-share-message"
            className="input h-20 resize-none py-2 text-xs"
            readOnly
            value={shareMessage}
            dir="auto"
          />
          <button type="button" onClick={handleCopyMessage} className="btn-secondary px-3 text-xs">
            <ClipboardCheck className="h-4 w-4" />
            {t('achievement.copyMessage')}
          </button>
          <p className="text-[11px] leading-relaxed text-ink-muted">
            {t('achievement.linkedinImageNote')}
          </p>
        </div>
      )}
      {status && (
        <p role="status" className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          {status === t('achievement.messageCopied') && <CheckCircle2 className="h-4 w-4" />}
          {status}
        </p>
      )}
    </div>
  );
}
