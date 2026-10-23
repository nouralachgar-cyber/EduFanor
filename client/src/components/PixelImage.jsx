import React, { useState } from 'react';

export function PixelImage({ src, customGrid = { rows: 4, cols: 6 }, grayscaleAnimation = true }) {
  const [isHovered, setIsHovered] = useState(false);
  const total = customGrid.rows * customGrid.cols;

  return (
    <div 
      className="relative overflow-hidden rounded-3xl cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt="Pixel"
        className={`w-full h-auto object-cover transition-all duration-500 ${
          grayscaleAnimation && !isHovered ? 'grayscale' : 'grayscale-0 scale-105'
        }`}
      />
      <div 
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${customGrid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${customGrid.rows}, 1fr)`
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`border border-white/20 transition-all duration-300 ${
              isHovered ? 'opacity-0 scale-90' : 'bg-[#49305D]/20 opacity-100'
            }`}
            style={{ transitionDelay: `${i * 30}ms` }}
          />
        ))}
      </div>
    </div>
  );
}