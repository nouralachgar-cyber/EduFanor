import React from 'react';
import { Link } from 'react-router-dom';
import EduFanorWordmark from './EduFanorWordmark';

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`group flex cursor-pointer items-center ${className}`}>
      <EduFanorWordmark className="w-36 text-ink transition-transform duration-300 group-hover:scale-[1.015]" />
    </Link>
  );
}