import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { Globe3D } from './ui/3d-globe';

const markers = [
  { lat: 33.5731, lng: -7.5898, label: 'Casablanca' },
  { lat: 40.7128, lng: -74.006, label: 'New York' },
  { lat: 51.5074, lng: -0.1278, label: 'London' },
  { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  { lat: 48.8566, lng: 2.3522, label: 'Paris' },
  { lat: 25.2048, lng: 55.2708, label: 'Dubai' },
];

export default function GlobalEmergencySection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative grid min-h-[460px] grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl border border-line bg-beige p-6 shadow-pop dark:bg-[#101A15] md:p-12 lg:grid-cols-12">
        <div className="z-10 space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-amber/15 px-3.5 py-1.5 text-xs font-bold text-ink">
            <ShieldAlert className="h-4 w-4 text-accent" />
            <span>
              {isAr
                ? 'الوعي بالإسعافات الأولية مسؤولية مشتركة'
                : 'First-aid awareness is a shared responsibility'}
            </span>
          </div>

          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl lg:text-5xl">
            {isAr ? (
              <>
                الحوادث تقع في أي مكان..
                <br />
                <span className="italic text-accent">واستعدادك يصنع فارقاً.</span>
              </>
            ) : (
              <>
                Emergencies happen anywhere..
                <br />
                <span className="italic text-accent">Your preparation matters.</span>
              </>
            )}
          </h2>

          <p className="max-w-xl text-xs leading-relaxed text-ink-muted md:text-sm">
            {isAr
              ? 'تعلّم أساسيات التعامل مع الاختناق والنزيف والحالات الطارئة عبر دروس منظمة واختبارات قصيرة. المعرفة لا تغني عن التدريب المعتمد أو خدمات الطوارئ، لكنها تساعدك على التصرف بوعي أكبر.'
              : 'Learn the basics of responding to choking, bleeding, and emergency situations through structured lessons and short quizzes. Knowledge does not replace certified training or emergency services, but it helps you act more consciously.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/register" className="btn-primary px-6">
              <HeartPulse className="h-4 w-4" />
              <span>{isAr ? 'ابدأ التعلّم الآن' : 'Start learning now'}</span>
            </Link>

            <Link to="/about" className="btn-secondary px-5">
              <span>{isAr ? 'اكتشف مهمتنا' : 'Learn more'}</span>
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        </div>

        <div className="relative flex h-[380px] w-full items-center justify-center lg:col-span-5">
          <Globe3D
            markers={markers}
            config={{
              atmosphereColor: '#F59E42',
              autoRotateSpeed: 0.4,
            }}
          />
        </div>
      </div>
    </section>
  );
}
