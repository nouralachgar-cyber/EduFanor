import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, FileText, CheckCircle2, Sparkles, Camera } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const avatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=Noura1',
    'https://api.dicebear.com/7.x/bottts/svg?seed=MedicGirl',
    'https://api.dicebear.com/7.x/bottts/svg?seed=DoctorCute',
    'https://api.dicebear.com/7.x/bottts/svg?seed=HeroLearner',
    'https://api.dicebear.com/7.x/bottts/svg?seed=EduFanorUser',
    'https://api.dicebear.com/7.x/bottts/svg?seed=SmartStudent'
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem('user_avatar') || avatars[0]
  );
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [bio, setBio] = useState(localStorage.getItem('user_bio') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('user_avatar', selectedAvatar);
    localStorage.setItem('user_bio', bio);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="chip bg-brand-soft text-brand-ink">
            <User className="h-3.5 w-3.5" />
            <span>{t('profilePage.title')}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            {t('profilePage.title')}
          </h1>
          <p className="text-xs text-ink-muted">
            {t('profilePage.subtitle')}
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="card p-6 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-surface-muted p-1.5 border-2 border-primary">
              <img src={selectedAvatar} alt="Selected Avatar" className="h-full w-full object-cover rounded-xl" />
            </div>
            <div className="absolute -bottom-1 -end-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-extrabold text-ink">{name || t('profilePage.studentFallback')}</p>
            <p className="text-xs text-ink-muted" dir="ltr">{email}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="card p-6 sm:p-8 space-y-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="label">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t('profilePage.chooseAvatar')}</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {avatars.map((avatarUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatarUrl)}
                  className={`p-2 rounded-xl border-2 transition-all flex justify-center items-center ${
                    selectedAvatar === avatarUrl
                      ? 'border-primary bg-surface-muted scale-105 shadow-md'
                      : 'border-transparent hover:border-line bg-surface-muted/50'
                  }`}
                >
                  <img src={avatarUrl} alt={`Avatar ${idx + 1}`} className="h-12 w-12 rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Success Alert */}
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-success-soft text-success-ink text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{t('profilePage.successMsg')}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="label">
                <User className="h-4 w-4 text-primary" />
                <span>{t('profilePage.fullName')}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label">
                <Mail className="h-4 w-4 text-primary" />
                <span>{t('profilePage.email')}</span>
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="input opacity-60 cursor-not-allowed"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label">
                <FileText className="h-4 w-4 text-primary" />
                <span>{t('profilePage.bio')}</span>
              </label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t('profilePage.bioPlaceholder')}
                className="input resize-none"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-sm">
              {t('profilePage.saveBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
