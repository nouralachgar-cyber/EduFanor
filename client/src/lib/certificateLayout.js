export function certificateLines(value, maxCharacters = 34, maxLines = 2) {
  const words = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return ['—'];

  const lines = [];
  let current = '';
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters) {
      current = candidate;
      return;
    }
    if (current) lines.push(current);
    current = word;
  });
  if (current) lines.push(current);

  if (lines.length <= maxLines) return lines;

  const visible = lines.slice(0, maxLines);
  const remainder = lines.slice(maxLines).join(' ');
  const lastIndex = maxLines - 1;
  const truncated = `${visible[lastIndex]} ${remainder}`.trim();
  visible[lastIndex] =
    truncated.length > maxCharacters
      ? `${truncated.slice(0, Math.max(1, maxCharacters - 1)).trimEnd()}…`
      : truncated;
  return visible;
}

export function formatCertificateDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

export function certificateFileName(certificate) {
  const key = String(certificate?.courseKey || 'course')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = String(certificate?.certificateId || 'certificate').replace(/[^A-Za-z0-9-]/g, '');
  return `EduFanor-${key || 'course'}-${id}.pdf`;
}
