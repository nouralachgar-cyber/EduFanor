import React from 'react';

export function Text3DFlip({
  children,
  className = "",
  textClassName = "",
  flipTextClassName = "",
}) {
  const text = typeof children === 'string' ? children : '';

  return (
    <span className={`relative inline-block overflow-hidden group cursor-pointer leading-tight align-bottom ${className}`}>
      {/* النص العادي الأصلي */}
      <span className={`block transition-transform duration-500 ease-in-out transform group-hover:-translate-y-full ${textClassName}`}>
        {text}
      </span>

      {/* النص المقلوب اللي كيطرّع فاش كتدوزي الماوس */}
      <span className={`absolute top-0 left-0 w-full h-full block transition-transform duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0 ${flipTextClassName}`}>
        {text}
      </span>
    </span>
  );
}