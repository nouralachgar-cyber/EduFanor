import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { HeartPulse, ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";
import { Globe3D } from "./ui/3d-globe";

const sampleMarkers = [
  { lat: 33.5731, lng: -7.5898, src: "https://assets.aceternity.com/avatars/1.webp", label: "Casablanca" },
  { lat: 40.7128, lng: -74.006, src: "https://assets.aceternity.com/avatars/2.webp", label: "New York" },
  { lat: 51.5074, lng: -0.1278, src: "https://assets.aceternity.com/avatars/3.webp", label: "London" },
  { lat: 35.6762, lng: 139.6503, src: "https://assets.aceternity.com/avatars/4.webp", label: "Tokyo" },
  { lat: 48.8566, lng: 2.3522, src: "https://assets.aceternity.com/avatars/5.webp", label: "Paris" },
  { lat: 25.2048, lng: 55.2708, src: "https://assets.aceternity.com/avatars/6.webp", label: "Dubai" },
];

export default function GlobalEmergencySection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="relative mx-auto min-h-[460px] w-full overflow-hidden rounded-3xl bg-[#FCFAFF] dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] shadow-lg transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 items-center p-6 md:p-12 gap-8">
        
        {/* اليسار: النص والتوعية */}
        <div className="lg:col-span-7 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E0F5] dark:bg-[#3B2B4C] border border-[#8A6BBE]/30 text-[#49305D] dark:text-[#E9E0F5] text-xs font-bold shadow-sm">
            <ShieldAlert className="w-4 h-4 text-[#8A6BBE] animate-pulse" />
            <span>
              {isAr
                ? "في كل ثانية.. هناك شخص يحتاج إسعافاً أولياً حول العالم"
                : "Every second, someone around the world needs emergency first aid"}
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#49305D] dark:text-white leading-tight">
            {isAr ? (
              <>
                الحوادث تقع في أي مكان.. <br />
                <span className="text-[#8A6BBE]">معرفتك قد تنقذ حياة!</span>
              </>
            ) : (
              <>
                Emergencies happen everywhere.. <br />
                <span className="text-[#8A6BBE]">Your response can save a life!</span>
              </>
            )}
          </h2>

          <p className="text-xs md:text-sm text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed max-w-xl">
            {isAr
              ? "آلاف حالات الاختناق، النزيف، والسكتات القلبية المفاجئة تقع يومياً. تعلم مهارات الإسعافات الأولية عبر منصة EduFanor لتكون الشخص المستعد لتقديم المساعدة في الوقت المناسب."
              : "Thousands of choking, bleeding, and cardiac arrest emergencies happen every single day. Master first aid skills with EduFanor and be prepared to save lives."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/courses"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#49305D] hover:bg-[#39244A] px-6 py-3 font-extrabold text-xs text-white shadow-md transition-all duration-200 active:scale-95"
            >
              <HeartPulse className="w-4 h-4 text-[#E9B9C8]" />
              <span>{isAr ? "ابدأ التعلم الآن مجاناً" : "Start Learning Now"}</span>
            </Link>

            <Link
              to="/about"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F4EFFB] dark:bg-[#17121D] hover:bg-[#E9E0F5] dark:hover:bg-[#2B2037] px-5 py-3 font-bold text-xs text-[#49305D] dark:text-white border border-[#EDE6F5] dark:border-[#3B2B4C] transition-all duration-200 active:scale-95"
            >
              <span>{isAr ? "اكتشف مهمتنا" : "Learn More"}</span>
              {isAr ? <ArrowLeft className="w-4 h-4 text-[#8A6BBE]" /> : <ArrowRight className="w-4 h-4 text-[#8A6BBE]" />}
            </Link>
          </div>
        </div>

        {/* اليمين: الكورة الأرضية 3D الحقيقية كتدور والماركرز فوق منها */}
        <div className="lg:col-span-5 relative w-full h-[380px] flex items-center justify-center">
          <Globe3D
            markers={sampleMarkers}
            config={{
              atmosphereColor: "#8A6BBE",
              autoRotateSpeed: 0.4,
            }}
          />
        </div>

      </div>
    </section>
  );
}