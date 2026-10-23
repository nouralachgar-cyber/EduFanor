import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Mail, Phone, ShieldCheck, 
  Github, Linkedin, Twitter, Send 
} from 'lucide-react';

export default function Footer() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="bg-[#17121D] text-[#F8F4FC] border-t border-[#2B2037] pt-16 pb-8 px-6 lg:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-[#2B2037]">
        
        {/* 1. Brand Section */}
        <div className="lg:col-span-4 space-y-5">
          <Link to="/" className="flex items-center gap-3 decoration-none group">
            <img
              src="/edufanor.png"
              alt="EduFanor Logo"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-black text-white tracking-wide">
              EduFanor
            </span>
          </Link>

          <p className="text-xs text-[#C9BED5] leading-relaxed max-w-sm font-medium">
            {isAr
              ? 'المنصة الرقمية المتخصصة في التدريب والتوعية بالإسعافات الأولية والاستجابة الآمنة للطوارئ.'
              : 'The leading interactive digital platform for first aid training and emergency response awareness.'}
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#21192B] border border-[#3B2B4C] text-xs font-bold text-[#8A6BBE]">
            <ShieldCheck className="w-4 h-4 text-[#8A6BBE]" />
            <span>{isAr ? 'منصة توعوية وتعليمية معتمدة' : 'Verified Educational Platform'}</span>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-wider text-[#8A6BBE]">
            {isAr ? 'روابط سريعة' : 'Quick Links'}
          </h4>
          <ul className="space-y-3 text-xs font-semibold text-[#C9BED5]">
            <li>
              <a href="#home" className="hover:text-white transition-colors flex items-center gap-1">
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-white transition-colors flex items-center gap-1">
                <span>{isAr ? 'المميزات' : 'Features'}</span>
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition-colors flex items-center gap-1">
                <span>{isAr ? 'عن المنصة' : 'About Us'}</span>
              </a>
            </li>
            <li>
              <Link to="/courses" className="hover:text-white transition-colors flex items-center gap-1">
                <span>{isAr ? 'المساقات' : 'Courses'}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. Contact Us & Social Media */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-wider text-[#8A6BBE]">
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h4>
          
          <ul className="space-y-3 text-xs text-[#C9BED5]">
            <li className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#8A6BBE]">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-semibold">support@edufanor.com</span>
            </li>

            <li className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#8A6BBE]">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-semibold" dir="ltr">+212 600 000 000</span>
            </li>
          </ul>

          {/* Social Media Icons */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-bold text-[#8C7B9E]">
              {isAr ? 'تابعنا على منصات التواصل' : 'Follow Us'}
            </span>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-[#21192B] border border-[#3B2B4C] text-[#C9BED5] hover:text-white hover:bg-[#8A6BBE] hover:border-[#8A6BBE] transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C7B9E] font-medium">
        <p>
          © {new Date().getFullYear()} EduFanor Platform. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>

        <div className="flex items-center gap-6">
          <Link to="/login" className="hover:text-white transition-colors">
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
          <Link to="/register" className="hover:text-white transition-colors">
            {isAr ? 'حساب جديد' : 'Sign Up'}
          </Link>
        </div>
      </div>
    </footer>
  );
}