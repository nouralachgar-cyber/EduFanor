import React, { useId, useEffect, useState } from "react";

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  numSquares = 30,
  maxOpacity = 0.1,
  duration = 3,
  className = "",
}) {
  const id = useId();
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    // توليد مربعات عشوائية تظهر وتختفي بتأثير متناسق
    const generateSquares = () => {
      return Array.from({ length: numSquares }, (_, i) => ({
        id: i,
        x: Math.floor(Math.random() * 20) - 10,
        y: Math.floor(Math.random() * 20) - 10,
        delay: Math.random() * duration,
      }));
    };
    setSquares(generateSquares());
  }, [numSquares, duration]);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-[#8A6BBE]/20 stroke-[#8A6BBE]/15 ${className}`}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x="-1"
          y="-1"
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray="4 2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x="50%" y="0" className="overflow-visible">
        {squares.map((sq) => (
          <rect
            key={sq.id}
            width={width - 1}
            height={height - 1}
            x={sq.x * width + 1}
            y={sq.y * height + 1}
            className="animate-pulse transition-opacity duration-1000"
            style={{
              animationDelay: `${sq.delay}s`,
              animationDuration: `${duration}s`,
              opacity: maxOpacity,
            }}
          />
        ))}
      </svg>
    </svg>
  );
}