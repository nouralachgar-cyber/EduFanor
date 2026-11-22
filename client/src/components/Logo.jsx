import React from 'react';
import { Link } from 'react-router-dom';
import EduFanorWordmark from './EduFanorWordmark';

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`group flex cursor-pointer items-center ${className}`}>
      <EduFanorWordmark className="w-36 text-[#17313E] transition-transform duration-300 group-hover:scale-[1.015] dark:text-[#F6F5F2]" />
    </Link>
  );
}