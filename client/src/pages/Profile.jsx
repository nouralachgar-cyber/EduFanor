import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { getStudentId } from '../lib/progress';
import {
  User,
  Mail,
  FileText,
  CheckCircle2,
  Sparkles,
  Camera,
  ShieldCheck,
} from 'lucide-react';

const AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Noura1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=MedicGirl',
  'https://api.dicebear.com/7.x/bottts/svg?seed=DoctorCute',
  'https://api.dicebear.com/7.x/bottts/svg?seed=HeroLearner',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EduFanorUser',
  'https://api.dicebear.com/7.x/bottts/svg?seed=SmartStudent',
];

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';

  const [selectedAvatar, setSelectedAvatar] = useState(
    () => localStorage.getItem('user_avatar') || AVATARS[0]
  );
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(() => localStorage.getItem('user_bio') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const email = user?.email || '';
  const studentId = getStudentId(email);

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem('user_avatar', selectedAvatar);
    localStorage.setItem('user_bio', bio);
    if (typeof updateUser === 'function' && name.trim()) {
      updateUser({ name: name.trim() });
    }
    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-content mx-auto max-w-5xl space-y-8">
        <header>
          <span className="chip bg-brand-soft text-brand-ink">
            <User className="h-3.5 w-3.5" />
            {t('profilePage.title')}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {isAr ? 'ملفك الشخصي' : 'Your profile'}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">{t('profilePage.subtitle')}</p>
        </header>

        <div className="grid gap-5 lg:grid-cols-12">
          <aside className="card p-6 lg:col-span-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-28 w-28 rounded-3xl border-2 border-primary bg-surface-muted p-1.5">
                  <img
                    src={selectedAvatar}
                    alt={isAr ? 'الصورة الرمزية المختارة' : 'Selected avatar'}
                    className="h-full w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="absolute -bottom-1 -end-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
                  <Camera className="h-4 w-4 text-amber-soft" />
                </span>
              </div>

              <p className="mt-4 text-base font-extrabold text-ink">
                {name || t('profilePage.studentFallback')}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted" dir="ltr">
                {email}
              </p>
              <span className="chip mt-3 bg-success-soft text-success-ink">
                <ShieldCheck className="h-3 w-3" />
                {t('studentCard.active')}
              </span>
              <p className="mt-3 font-mono text-[10px] font-bold text-ink-muted">
                {t('studentCard.idLabel')} {studentId}
              </p>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-line pt-5">
              <label className="label">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>{t('profilePage.chooseAvatar')}</span>
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((avatarUrl, index) => (
                  <button
                    key={avatarUrl}
                    type="button"
                    onClick={() => setSelectedAvatar(avatarUrl)}
                    aria-label={`${isAr ? 'صورة رمزية' : 'Avatar'} ${index + 1}`}
                    aria-pressed={selectedAvatar === avatarUrl}
                    className={`flex items-center justify-center rounded-xl border-2 p-1.5 transition-all ${
                      selectedAvatar === avatarUrl
                        ? 'border-primary bg-brand-soft'
                        : 'border-transparent bg-surface-muted hover:border-line-strong'
                    }`}
                  >
                    <img src={avatarUrl} alt="" className="h-9 w-9 rounded-lg" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {bio && (
              <div className="mt-5 rounded-xl border border-line bg-surface-muted p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">
                  {t('profilePage.bio')}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink">{bio}</p>
              </div>
            )}
          </aside>

          <section className="card p-6 sm:p-8 lg:col-span-7">
            {savedSuccess && (
              <div className="mb-5 flex animate-fade-in items-center gap-2 rounded-xl bg-success-soft p-3.5 text-xs font-bold text-success-ink">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{t('profilePage.successMsg')}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="profile-name" className="label">
                  <User className="h-4 w-4 text-brand-ink" />
                  <span>{t('profilePage.fullName')}</span>
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-email" className="label">
                  <Mail className="h-4 w-4 text-brand-ink" />
                  <span>{t('profilePage.email')}</span>
                </label>
                <input id="profile-email" type="email" value={email} disabled className="input opacity-60" dir="ltr" />
                <p className="text-[10px] text-ink-muted">
                  {isAr
                    ? 'البريد الإلكتروني مرتبط بحسابك ولا يمكن تعديله من هنا.'
                    : 'Your email is linked to your account and cannot be edited here.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-bio" className="label">
                  <FileText className="h-4 w-4 text-brand-ink" />
                  <span>{t('profilePage.bio')}</span>
                </label>
                <textarea
                  id="profile-bio"
                  rows="4"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder={t('profilePage.bioPlaceholder')}
                  className="input h-auto min-h-24 resize-none py-3"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                {t('profilePage.saveBtn')}
              </button>
            </form>

            <p className="mt-5 border-t border-line pt-4 text-[10px] leading-relaxed text-ink-muted">
              {isAr
                ? 'تُحفظ تفضيلات الملف الشخصي محلياً في هذا المتصفح.'
                : 'Profile preferences are stored locally in this browser.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
