import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Video,
  Save,
  X,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { adminApi, formatNumber, localize } from '../../lib/admin';
import { Badge, EmptyState, ErrorState, LoadingState, PageHeader, Panel } from '../../components/admin/ui';

export default function AdminCourses() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal & Form States for Creating/Editing Courses & Lessons
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  
  // Form fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('2 hours');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const loadCourses = () => {
    setLoading(true);
    setError('');
    adminApi
      .courses() // Assuming adminApi has a courses endpoint
      .then((res) => {
        setCourses(res.courses || res || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenCreate = () => {
    setCurrentCourse(null);
    setTitleAr('');
    setTitleEn('');
    setDescAr('');
    setDescEn('');
    setLevel('Beginner');
    setDuration('2 hours');
    setImageFile(null);
    setImagePreview('');
    setYoutubeUrl('');
    setIsEditing(true);
  };

  const handleOpenEdit = (course) => {
    setCurrentCourse(course);
    setTitleAr(course.title?.ar || course.title || '');
    setTitleEn(course.title?.en || '');
    setDescAr(course.description?.ar || course.description || '');
    setDescEn(course.description?.en || '');
    setLevel(course.level || 'Beginner');
    setDuration(course.duration || '2 hours');
    setImagePreview(course.image || '');
    setYoutubeUrl(course.youtubeUrl || '');
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Payload preparation
    const formData = new FormData();
    formData.append('titleAr', titleAr);
    formData.append('titleEn', titleEn);
    formData.append('descriptionAr', descAr);
    formData.append('descriptionEn', descEn);
    formData.append('level', level);
    formData.append('duration', duration);
    formData.append('youtubeUrl', youtubeUrl);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Call API to save/update course
    const apiCall = currentCourse 
      ? adminApi.updateCourse(currentCourse._id, formData) 
      : adminApi.createCourse(formData);

    apiCall
      .then(() => {
        setIsEditing(false);
        loadCourses();
      })
      .catch((err) => alert(err.message || 'Error saving course'));
  };

  const handleDelete = (id) => {
    if (window.confirm(isAr ? '┘ç┘ ╪ث┘╪ز ┘à╪ز╪ث┘â╪» ┘à┘ ╪ص╪░┘ ┘ç╪░┘ç ╪د┘╪»┘ê╪▒╪ر╪ا' : 'Are you sure you want to delete this course?')) {
      adminApi.deleteCourse(id)
        .then(() => loadCourses())
        .catch((err) => alert(err.message));
    }
  };

  if (loading && courses.length === 0) return <LoadingState label={t('admin.common.loading')} />;
  if (error && courses.length === 0) {
    return <ErrorState title={t('admin.errors.loadCourses')} message={error} onRetry={loadCourses} retryLabel={t('admin.common.retry')} />;
  }

  return (
    <div className="space-y-6 bg-canvas min-h-screen p-6 text-ink">
      <PageHeader
        eyebrow={isAr ? '╪ح╪»╪د╪▒╪ر ┘à╪ص╪ز┘ê┘ë ╪د┘┘à┘╪╡╪ر' : 'Content Management'}
        title={isAr ? '╪ح╪»╪د╪▒╪ر ╪د┘╪»┘ê╪▒╪د╪ز ┘ê╪د┘╪»╪▒┘ê╪│' : 'Courses & Lessons Management'}
        subtitle={isAr ? '╪ث╪╢┘ ┘ê╪╣╪»┘ّ┘ ╪د┘╪»┘ê╪▒╪د╪ز╪î ╪د╪▒┘╪╣ ╪د┘╪╡┘ê╪▒ ┘à┘ ╪ص╪د╪│┘ê╪ذ┘â ┘ê╪ث╪╢┘ ╪▒┘ê╪د╪ذ╪╖ ╪د┘┘è┘ê╪ز┘è┘ê╪ذ ╪ذ┘â┘ ╪│┘ç┘ê┘╪ر.' : 'Create and manage courses, upload images from your PC and link YouTube videos easily.'}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadCourses}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:bg-highlight"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-on-primary shadow-md transition-all hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4 text-lavender" />
              {isAr ? '╪»┘ê╪▒╪ر ╪ش╪»┘è╪»╪ر' : 'New Course'}
            </button>
          </div>
        }
      />

      {/* Edit / Create Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-surface-2 border-2 border-line p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
              <h2 className="text-lg font-extrabold text-ink">
                {currentCourse ? (isAr ? '╪ز╪╣╪»┘è┘ ╪د┘╪»┘ê╪▒╪ر' : 'Edit Course') : (isAr ? '╪ح╪╢╪د┘╪ر ╪»┘ê╪▒╪ر ╪ش╪»┘è╪»╪ر' : 'Add New Course')}
              </h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-2 text-ink hover:bg-surface-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    {isAr ? '╪د┘╪╣┘┘ê╪د┘ ╪ذ╪د┘╪╣╪▒╪ذ┘è╪ر' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="┘à╪س╪د┘: ╪ث╪│╪د╪│┘è╪د╪ز ╪د┘╪ح╪│╪╣╪د┘╪د╪ز ╪د┘╪ث┘ê┘┘è╪ر"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    {isAr ? '╪د┘╪╣┘┘ê╪د┘ ╪ذ╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. First Aid Basics"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    {isAr ? '╪د┘┘ê╪╡┘ ╪ذ╪د┘╪╣╪▒╪ذ┘è╪ر' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    rows={3}
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="╪ز┘╪د╪╡┘è┘ ╪د┘╪»┘ê╪▒╪ر ╪ذ╪د┘╪╣╪▒╪ذ┘è╪ر..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    {isAr ? '╪د┘┘ê╪╡┘ ╪ذ╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={3}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Course details in English..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    {isAr ? '╪د┘┘à╪│╪ز┘ê┘ë' : 'Level'}
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Beginner">{isAr ? '┘à╪ذ╪ز╪»╪خ' : 'Beginner'}</option>
                    <option value="Intermediate">{isAr ? '┘à╪ز┘ê╪│╪╖' : 'Intermediate'}</option>
                    <option value="Advanced">{isAr ? '┘à╪ز┘é╪»┘à' : 'Advanced'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    {isAr ? '╪د┘┘à╪»╪ر ╪د┘╪▓┘à┘┘è╪ر' : 'Duration'}
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 2 hours"
                  />
                </div>
              </div>

              {/* YouTube Video URL */}
              <div>
                <label className="block text-xs font-bold text-ink mb-1 flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-lavender" />
                  {isAr ? '╪▒╪د╪ذ╪╖ ┘┘è╪»┘è┘ê ┘è┘ê╪ز┘è┘ê╪ذ (YouTube URL)' : 'YouTube Video URL'}
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Image Upload from PC */}
              <div>
                <label className="block text-xs font-bold text-ink mb-1 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-lavender" />
                  {isAr ? '╪╡┘ê╪▒╪ر ╪د┘╪»┘ê╪▒╪ر (╪د╪«╪ز╪▒ ┘à┘ ┘à┘┘╪د╪ز ╪ص╪د╪│┘ê╪ذ┘â)' : 'Course Image (Upload from PC)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-line bg-surface p-2 text-xs text-ink file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface-2 file:text-ink hover:file:bg-highlight"
                />
                {imagePreview && (
                  <div className="mt-3 relative w-32 h-20 rounded-xl overflow-hidden border border-line">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl bg-surface-2 px-5 py-2.5 text-xs font-bold text-ink hover:bg-highlight"
                >
                  {isAr ? '╪ح┘╪║╪د╪ة' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-extrabold text-on-primary hover:bg-primary-hover shadow-md"
                >
                  <Save className="h-4 w-4 text-lavender" />
                  {isAr ? '╪ص┘╪╕ ╪د┘╪»┘ê╪▒╪ر' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List Panel */}
      <Panel className="bg-surface border border-line shadow-sm rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <h2 className="text-sm font-extrabold text-ink flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-lavender" />
            {isAr ? '┘é╪د╪خ┘à╪ر ╪د┘╪»┘ê╪▒╪د╪ز ╪د┘╪ص╪د┘┘è╪ر' : 'Current Courses List'}
          </h2>
          <Badge tone="outline" className="bg-surface-2 text-ink border-line">
            {formatNumber(courses.length, i18n.language)}
          </Badge>
        </div>

        {courses.length === 0 ? (
          <EmptyState title={isAr ? '┘╪د ╪ز┘ê╪ش╪» ╪»┘ê╪▒╪د╪ز ╪ص╪د┘┘è╪د┘ï' : 'No courses found'} icon={BookOpen} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id || course.id} className="rounded-2xl border border-line bg-surface-2 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  {course.image && (
                    <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border border-line">
                      <img src={course.image} alt="Course" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-surface-2 border border-line px-3 py-1 text-[10px] font-bold text-ink">
                      {course.level}
                    </span>
                    <span className="text-[10px] text-ink-soft font-semibold">{course.duration}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-ink mb-1">
                    {localize(course.title, i18n.language)}
                  </h3>
                  <p className="text-xs text-ink-soft line-clamp-2">
                    {localize(course.description, i18n.language)}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-line">
                  <span className="text-[10px] font-bold text-lavender">
                    {course.youtubeUrl ? (isAr ? '┘┘è╪»┘è┘ê ┘à╪ز┘ê┘╪▒ ≡اح' : 'Video attached ≡اح') : (isAr ? '╪ذ╪»┘ê┘ ┘┘è╪»┘è┘ê' : 'No video')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink hover:bg-highlight"
                      title={isAr ? '╪ز╪╣╪»┘è┘' : 'Edit'}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id || course.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-negative-soft text-negative-ink hover:bg-highlight"
                      title={isAr ? '╪ص╪░┘' : 'Delete'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
