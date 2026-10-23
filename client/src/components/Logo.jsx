import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* عرض اللوجو الحقيقي من مجلد public مباشرة */}
      <img
        src="/edufanor.png"
        alt="EduFanor Logo"
        className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}