import React from 'react';

function renderInline(text) {
  const nodes = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|_[^_\n]+_)/g;
  let lastIndex = 0;
  let key = 0;
  let buffer = '';
  let match;

  const flush = () => {
    if (buffer) {
      nodes.push(<span key={`t${key++}`}>{buffer}</span>);
      buffer = '';
    }
  };

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) buffer += text.slice(lastIndex, match.index);
    const token = match[0];
    flush();
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={`b${key++}`} className="font-extrabold text-ink">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <code
          key={`c${key++}`}
          className="rounded-md bg-ink/[0.08] px-1.5 py-0.5 text-[0.92em] font-semibold dark:bg-white/[0.1]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(
        <em key={`i${key++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) buffer += text.slice(lastIndex);
  flush();
  return nodes;
}

function BulletLine({ text, numbered, index }) {
  return (
    <li className="flex items-start gap-2 text-xs leading-relaxed text-ink sm:text-[13px]">
      {numbered ? (
        <span className="mt-0.5 flex h-[18px] w-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-extrabold text-primary dark:bg-primary/15">
          {index + 1}
        </span>
      ) : (
        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
      )}
      <span>{renderInline(text)}</span>
    </li>
  );
}

function parseBlock(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
  if (heading) {
    return {
      type: 'heading',
      level: heading[1].length,
      content: renderInline(heading[2]),
    };
  }

  if (/^>\s?/.test(trimmed)) {
    return {
      type: 'quote',
      content: renderInline(trimmed.replace(/^>\s?/, '')),
    };
  }

  if (/^(-{3,}|\*{3,}|\_{{3,}})$/.test(trimmed)) {
    return { type: 'hr' };
  }

  const bullet = trimmed.match(/^[-*•]\s+(.*)$/);
  if (bullet) return { type: 'bullet', text: bullet[1] };

  const numbered = trimmed.match(/^(\d+)[.、)]\s+(.*)$/);
  if (numbered) return { type: 'numbered', text: numbered[2] };

  return { type: 'paragraph', content: renderInline(trimmed) };
}

const HEADING_CLASS = {
  1: 'mb-1.5 mt-3 first:mt-0 text-[15px] font-extrabold text-ink',
  2: 'mb-1 mt-3 first:mt-0 text-[13.5px] font-extrabold text-ink',
  3: 'mb-1 mt-2.5 first:mt-0 text-xs font-extrabold text-ink-muted',
  4: 'mb-0.5 mt-2 text-[11px] font-extrabold uppercase tracking-wider text-ink-muted',
};

export default function AiMarkdown({ content, className = '' }) {
  const normalized = String(content ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
  const lines = normalized.split('\n');

  const blocks = [];
  let listItems = [];

  const flushList = (listKey) => {
    if (!listItems.length) return;
    const numbered = listItems[0].type === 'numbered';
    const items = listItems;
    blocks.push(
      numbered ? (
        <ol key={listKey} className="space-y-1.5">
          {items.map((item, index) => (
            <BulletLine key={`ol-${listKey}-${index}`} text={item.text} numbered index={index} />
          ))}
        </ol>
      ) : (
        <ul key={listKey} className="space-y-1.5">
          {items.map((item, index) => (
            <BulletLine key={`ul-${listKey}-${index}`} text={item.text} />
          ))}
        </ul>
      )
    );
    listItems = [];
  };

  lines.forEach((line, lineIndex) => {
    const parsed = parseBlock(line);
    if (!parsed) {
      flushList(`l${lineIndex}`);
      if (blocks.length && String(blocks[blocks.length - 1]?.type ?? '') !== 'separator') {
        blocks.push({ type: 'gap' });
      }
      return;
    }
    if (['bullet', 'numbered'].includes(parsed.type)) {
      const listKey = `l${lineIndex}`;
      const previous = listItems[0];
      if (previous && previous.type !== parsed.type) flushList(`switch${lineIndex}`);
      listItems.push({ type: parsed.type, text: parsed.text });
      return;
    }
    flushList(`l${lineIndex}`);
    blocks.push({ type: parsed.type, parsed });
  });
  flushList('final');

  return (
    <div className={`space-y-1.5 [overflow-wrap:anywhere] ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'gap') {
          return <div key={`gap-${index}`} className="h-1.5" aria-hidden="true" />;
        }
        if (block.type === 'hr') {
          return <hr key={`hr-${index}`} className="my-2 border-line" />;
        }
        if (block.type === 'heading') {
          return (
            <div
              key={`h-${index}`}
              className={HEADING_CLASS[block.parsed.level] || HEADING_CLASS[3]}
            >
              {block.parsed.content}
            </div>
          );
        }
        if (block.type === 'quote') {
          return (
            <blockquote
              key={`q-${index}`}
              className="rounded-xl border-s-[3px] border-primary/50 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-ink sm:text-[13px]"
            >
              {block.parsed.content}
            </blockquote>
          );
        }
        if (block.type === 'paragraph') {
          return (
            <p key={`p-${index}`} className="text-xs leading-relaxed text-ink sm:text-[13px]">
              {block.parsed.content}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}
