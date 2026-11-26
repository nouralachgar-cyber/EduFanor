import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, ArrowRight } from './icons';
import {
  landingDashboardLabel,
  landingDashboardPath,
  landingProfileLabel,
} from '../lib/authNavigation';

export default function LandingAuthActions({
  isAr,
  loginTone,
  ctaTone,
  variant = 'desktop',
  onNavigate,
}) {
  const { user } = useContext(AuthContext);
  const dashboardPath = landingDashboardPath(user?.role);
  const dashboardLabel = landingDashboardLabel(user?.role, isAr);
  const profileLabel = landingProfileLabel(isAr);
  const closeMenu = () => onNavigate?.();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const arrowMotion = isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1';

  if (variant === 'mobile') {
    return user ? (
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          to={dashboardPath}
          onClick={closeMenu}
          className="min-h-11 rounded-full border border-[#7F7C82]/25 py-3 text-center text-sm font-semibold text-[#18122B] transition-colors hover:bg-[#BFA2DB]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F7C82]/60 dark:border-[#635985] dark:text-[#F3F1F5] dark:hover:bg-[#635985]/30"
        >
          {dashboardLabel}
        </Link>
        <Link
          to="/profile"
          onClick={closeMenu}
          className="min-h-11 rounded-full bg-[#F0D9FF] py-3 text-center text-sm font-extrabold text-[#18122B] shadow-[0_10px_30px_-14px_rgba(99,89,133,0.65)] transition-all hover:bg-white"
        >
          {profileLabel}
        </Link>
      </div>
    ) : (
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          to="/login"
          onClick={closeMenu}
          className="min-h-11 rounded-full border border-[#7F7C82]/25 py-3 text-center text-sm font-semibold text-[#18122B] transition-colors hover:bg-[#BFA2DB]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F7C82]/60 dark:border-[#635985] dark:text-[#F3F1F5] dark:hover:bg-[#635985]/30"
        >
          {isAr ? 'تسجيل الدخول' : 'Log in'}
        </Link>
        <Link
          to="/register"
          onClick={closeMenu}
          className="min-h-11 rounded-full bg-[#F0D9FF] py-3 text-center text-sm font-extrabold text-[#18122B] shadow-[0_10px_30px_-14px_rgba(99,89,133,0.65)] transition-all hover:bg-white"
        >
          {isAr ? 'إنشاء حساب' : 'Sign up'}
        </Link>
      </div>
    );
  }

  return user ? (
    <>
      <Link
        to={dashboardPath}
        className={`hidden min-h-11 items-center rounded-full px-4 py-2.5 text-[15px] font-medium text-[#18122B] transition-colors hover:bg-[#635985]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F7C82]/60 dark:text-[#F3F1F5] dark:hover:bg-white/10 xl:inline-flex ${loginTone}`}
      >
        {dashboardLabel}
      </Link>
      <Link
        to="/profile"
        className={`group hidden min-h-11 items-center gap-2.5 rounded-full px-5.5 py-3 text-[15px] font-extrabold text-[#18122B] shadow-[0_18px_45px_-20px_rgba(99,89,133,0.8)] transition-all duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA2DB]/70 xl:inline-flex ${ctaTone}`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18122B] text-[11px] font-bold text-white">
          {String(user?.name || 'U').charAt(0).toUpperCase()}
        </span>
        <span>{profileLabel}</span>
        <Arrow className={`h-4 w-4 transition-transform duration-300 ${arrowMotion}`} />
      </Link>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className={`hidden min-h-11 items-center rounded-full px-4 py-2.5 text-[15px] font-medium text-[#18122B] transition-colors hover:bg-[#635985]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F7C82]/60 dark:text-[#F3F1F5] dark:hover:bg-white/10 xl:inline-flex ${loginTone}`}
      >
        {isAr ? 'تسجيل الدخول' : 'Log in'}
      </Link>
      <Link
        to="/register"
        className={`group hidden min-h-11 items-center gap-2.5 rounded-full px-5.5 py-3 text-[15px] font-extrabold text-[#18122B] shadow-[0_18px_45px_-20px_rgba(99,89,133,0.8)] transition-all duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA2DB]/70 xl:inline-flex ${ctaTone}`}
      >
        {isAr ? 'إنشاء حساب' : 'Sign up'}
        <Arrow className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1`} />
      </Link>
    </>
  );
}
