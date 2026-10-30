import React from 'react';
import { formatNumber } from '../../lib/admin';

const palette = ['#24483f', '#e88736', '#789b83', '#9c4a3c'];

export function LineChart({
  data = [],
  series = [{ key: 'count', label: '', color: palette[0] }],
  language = 'en',
  height = 220,
}) {
  const width = 640;
  const padding = { top: 16, right: 16, bottom: 30, left: 34 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const max = Math.max(
    1,
    ...data.flatMap((point) => series.map((item) => Number(point[item.key]) || 0))
  );
  const step = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;
  const xFor = (index) => padding.left + index * step;
  const yFor = (value) => padding.top + innerHeight - (Number(value) || 0) / max * innerHeight;
  const ticks = [0, 0.5, 1];

  const pointsFor = (key) =>
    data.map((point, index) => `${xFor(index)},${yFor(point[key])}`).join(' ');

  const labelIndexes = data.length
    ? [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])]
    : [];

  const shortDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-line text-xs font-semibold text-ink-muted">
        —
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
        {ticks.map((tick) => {
          const y = padding.top + innerHeight - tick * innerHeight;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-line"
                strokeDasharray={tick === 0 ? '0' : '4 6'}
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-ink-muted"
                fontSize="10"
                fontWeight="600"
              >
                {formatNumber(Math.round(max * tick), language)}
              </text>
            </g>
          );
        })}

        {series.length === 1 && (
          <polygon
            points={`${padding.left},${padding.top + innerHeight} ${pointsFor(series[0].key)} ${
              width - padding.right
            },${padding.top + innerHeight}`}
            fill={series[0].color}
            opacity="0.1"
          />
        )}

        {series.map((item) => (
          <polyline
            key={item.key}
            points={pointsFor(item.key)}
            fill="none"
            stroke={item.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {series.map((item) =>
          data.map((point, index) => (
            <circle
              key={`${item.key}-${point.date || index}`}
              cx={xFor(index)}
              cy={yFor(point[item.key])}
              r={data.length > 20 ? 1.5 : 2.5}
              fill={item.color}
            />
          ))
        )}

        {labelIndexes.map((index) => (
          <text
            key={`label-${index}`}
            x={xFor(index)}
            y={height - 8}
            textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}
            className="fill-ink-muted"
            fontSize="10"
            fontWeight="600"
          >
            {shortDate(data[index]?.date)}
          </text>
        ))}
      </svg>

      {series.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {series.map((item) => (
            <span key={item.key} className="inline-flex items-center gap-2 text-[11px] font-bold text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ActivityBars({ data = [], language = 'en', height = 150 }) {
  const series = [
    { key: 'courseStarts', color: palette[0] },
    { key: 'courseCompletions', color: palette[1] },
    { key: 'quizAttempts', color: palette[2] },
  ];
  const max = Math.max(
    1,
    ...data.map((point) => series.reduce((sum, item) => sum + (Number(point[item.key]) || 0), 0))
  );
  const visible = data.length > 45 ? data.filter((_, index) => index % 2 === 0) : data;

  return (
    <div className="flex items-end gap-[3px] overflow-hidden" style={{ height }}>
      {visible.map((point, index) => {
        const total = series.reduce((sum, item) => sum + (Number(point[item.key]) || 0), 0);
        const totalHeight = Math.max(total ? 6 : 2, (total / max) * height);
        return (
          <div
            key={point.date || index}
            className="group relative flex flex-1 flex-col justify-end"
            style={{ height }}
            title={`${point.date}: ${formatNumber(total, language)}`}
          >
            <div
              className="flex w-full flex-col overflow-hidden rounded-t-[3px] bg-surface-muted"
              style={{ height: totalHeight }}
            >
              {series.map((item) => {
                const value = Number(point[item.key]) || 0;
                if (!value) return null;
                return (
                  <span
                    key={item.key}
                    style={{
                      height: `${(value / total) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DistributionBars({ data = [], language = 'en' }) {
  const max = Math.max(1, ...data.map((item) => item.count || 0));
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-[11px] font-bold text-ink-muted">{item.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(item.count ? 4 : 0, ((item.count || 0) / max) * 100)}%`,
                backgroundColor: palette[index % palette.length],
              }}
            />
          </div>
          <span className="w-8 shrink-0 text-end text-xs font-extrabold text-ink">
            {formatNumber(item.count, language)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ value, label, sublabel, tone = '#24483f' }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className="relative flex h-32 w-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${tone} ${safe * 3.6}deg, var(--color-surface-muted) 0deg)`,
      }}
    >
      <div className="flex h-[6.4rem] w-[6.4rem] flex-col items-center justify-center rounded-full bg-card text-center">
        <span className="font-display text-2xl font-bold text-ink">{label}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">{sublabel}</span>
      </div>
    </div>
  );
}
