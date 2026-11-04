import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, ArrowLeft, Image as ImageIcon, Video, 
  Plus, Trash2, Save, FileText, CheckCircle2, Lock 
} from 'lucide-react';

export default function AdminLessonEditor() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Bayanat ad-dars al-asasiya (Bilingual: Arabic & English)
  const [courseData, setCourseData] = useState({
    title: { ar: '', en: '' },
    category: 'cpr',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    youtubeUrl: '', 
    isLockedByDefault: true,
  });

  // 2. Mohtawa ad-dars al-morin (Faqrat w taswir dakh-l dars - Bilingual)
  const [contentBlocks, setContentBlocks] = useState([
    { id: 1, type: 'paragraph', value: { ar: '', en: '' } }
  ]);

  // 3. As'ilat al-ikhtibar (Quiz - Bilingual)
  const [quizData, setQuizData] = useState({
    question: { ar: '', en: '' },
    options: [
      { ar: '', en: '' },
      { ar: '', en: '' },
      { ar: '', en: '' }
    ],
    correctIndex: 0,
  });

  const addBlock = (type) => {
    setContentBlocks([
      ...contentBlocks, 
      { id: Date.now(), type, value: type === 'paragraph' ? { ar: '', en: '' } : '' }
    ]);
  };

  const updateBlockValue = (id, lang, val) => {
    setContentBlocks(contentBlocks.map(block => {
      if (block.id === id) {
        if (block.type === 'paragraph') {
          return { ...block, value: { ...block.value, [lang]: val } };
        } else {
          return { ...block, value: val }; // Image URL
        }
      }
      return block;
    }));
  };

  const removeBlock = (id) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
  };

  const getEmbedYouTubeUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const finalPayload = {
      ...courseData,
      contentBlocks,
      quiz: quizData,
      createdAt: new Date().toISOString()
    };

    console.log("Saving Lesson Payload:", finalPayload);

    setTimeout(() => {
      setLoading(false);
      alert("Tam hifd w nashr ad-dars bi naja7 b l-lughatayn! 🚀");
      navigate('/admin/courses');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] dark:bg-[#191F1B] text-[#24483F] dark:text-[#E7DFD1] p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E7DFD1] dark:border-[#343C33]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F59E42] text-white shadow-lg">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F59E42]">EduFanor Studio</span>
              <h1 className="text-2xl font-black tracking-tight">استوديو كتابة الدروس (Bilingual Lesson Studio)</h1>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-all hover:bg-[#F5F0E7] dark:hover:bg-[#242D26] border-[#24483F] dark:border-[#789B83]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>رجوع</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* 1. Ma3lomat Asasiya (Arabic & English Titles) */}
          <div className="bg-white dark:bg-[#242D26] p-6 md:p-8 rounded-3xl border border-[#E7DFD1] dark:border-[#343C33] shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-[#F59E42] font-bold text-sm">
              <FileText className="w-5 h-5" />
              <span>1. المعلومات العامة بالعربية والإنجليزية</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">عنوان الدرس (العربية)</label>
                <input
                  type="text"
                  required
                  value={courseData.title.ar}
                  onChange={(e) => setCourseData({ ...courseData, title: { ...courseData.title, ar: e.target.value } })}
                  placeholder="مثال: الإسعافات الأولية للحروق"
                  className="w-full px-4 py-3.5 rounded-2xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Lesson Title (English)</label>
                <input
                  type="text"
                  required
                  value={courseData.title.en}
                  onChange={(e) => setCourseData({ ...courseData, title: { ...courseData.title, en: e.target.value } })}
                  placeholder="e.g. First Aid for Burns"
                  className="w-full px-4 py-3.5 rounded-2xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">المستوى (Difficulty)</label>
                <select
                  value={courseData.difficulty}
                  onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                >
                  <option value="beginner">مبتدئ (Beginner)</option>
                  <option value="intermediate">متوسط (Intermediate)</option>
                  <option value="advanced">متقدم (Advanced)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">المدة (Estimated Minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={courseData.estimatedMinutes}
                  onChange={(e) => setCourseData({ ...courseData, estimatedMinutes: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                />
              </div>
            </div>

            {/* YouTube Link */}
            <div className="pt-3 border-t border-[#E7DFD1] dark:border-[#343C33]">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Video className="w-4 h-4 text-[#F59E42]" />
                <span>رابط فيديو اليوتيوب (YouTube Video URL)</span>
              </label>
              <input
                type="url"
                value={courseData.youtubeUrl}
                onChange={(e) => setCourseData({ ...courseData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=xxxxx"
                className="w-full px-4 py-3.5 rounded-2xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                dir="ltr"
              />
              {getEmbedYouTubeUrl(courseData.youtubeUrl) && (
                <div className="mt-4 aspect-video w-full max-w-lg mx-auto rounded-2xl overflow-hidden border">
                  <iframe src={getEmbedYouTubeUrl(courseData.youtubeUrl)} title="Preview" className="w-full h-full" allowFullScreen />
                </div>
              )}
            </div>
          </div>

          {/* 2. Content Blocks (Paragraphs & Images inside the lesson) */}
          <div className="bg-white dark:bg-[#242D26] p-6 md:p-8 rounded-3xl border border-[#E7DFD1] dark:border-[#343C33] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#F59E42]">2. محتوى الدرس المرن (فقرات بالعربية والإنجليزية + صور)</h2>
                <p className="text-xs text-gray-400">أضف النصوص بالعربية والإنجليزية والصور في أي مكان داخل الدرس.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addBlock('paragraph')}
                  className="px-3.5 py-2 rounded-xl bg-[#24483F] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> إضافة فقرة نصية
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('image')}
                  className="px-3.5 py-2 rounded-xl bg-[#789B83] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> إضافة صورة
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {contentBlocks.map((block, index) => (
                <div key={block.id} className="relative p-5 rounded-2xl border border-[#E7DFD1] dark:border-[#343C33] bg-[#FCFAF6] dark:bg-[#191F1B] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase bg-[#F59E42] text-white px-2.5 py-0.5 rounded-full">
                      عنصر رقم {index + 1} ({block.type === 'paragraph' ? 'فقرة نصية (عربي/إنجليزي)' : 'رابط صورة'})
                    </span>
                    <button type="button" onClick={() => removeBlock(block.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {block.type === 'paragraph' ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <textarea
                        rows="3"
                        value={block.value.ar}
                        onChange={(e) => updateBlockValue(block.id, 'ar', e.target.value)}
                        placeholder="اكتب الشرح هنا بالعربية..."
                        className="w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                        dir="rtl"
                      />
                      <textarea
                        rows="3"
                        value={block.value.en}
                        onChange={(e) => updateBlockValue(block.id, 'en', e.target.value)}
                        placeholder="Write explanation here in English..."
                        className="w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                        dir="ltr"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={block.value}
                        onChange={(e) => updateBlockValue(block.id, null, e.target.value)}
                        placeholder="أدخل رابط الصورة (Image URL) هنا..."
                        className="w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                        dir="ltr"
                      />
                      {block.value && (
                        <div className="h-36 w-full max-w-xs rounded-xl overflow-hidden border">
                          <img src={block.value} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Quiz & Sequential Lock */}
          <div className="bg-white dark:bg-[#242D26] p-6 md:p-8 rounded-3xl border border-[#E7DFD1] dark:border-[#343C33] shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-[#F59E42] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>3. اختبار التقييم (Quiz - Arabic & English)</span>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">السؤال (العربية)</label>
                <input
                  type="text"
                  value={quizData.question.ar}
                  onChange={(e) => setQuizData({ ...quizData, question: { ...quizData.question, ar: e.target.value } })}
                  placeholder="سؤال الاختبار بالعربية..."
                  className="w-full px-4 py-3.5 rounded-2xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Question (English)</label>
                <input
                  type="text"
                  value={quizData.question.en}
                  onChange={(e) => setQuizData({ ...quizData, question: { ...quizData.question, en: e.target.value } })}
                  placeholder="Quiz question in English..."
                  className="w-full px-4 py-3.5 rounded-2xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider">الاختيارات (حدد الإجابة الصحيحة)</label>
              {quizData.options.map((opt, optIdx) => (
                <div key={optIdx} className="grid gap-3 sm:grid-cols-[auto_1fr_1fr] items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={quizData.correctIndex === optIdx}
                      onChange={() => setQuizData({ ...quizData, correctIndex: optIdx })}
                      className="w-4 h-4 accent-[#F59E42]"
                    />
                    <span className="text-xs font-bold">صحيح {optIdx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={opt.ar}
                    onChange={(e) => {
                      const newOpts = [...quizData.options];
                      newOpts[optIdx].ar = e.target.value;
                      setQuizData({ ...quizData, options: newOpts });
                    }}
                    placeholder={`الاختيار ${optIdx + 1} بالعربية`}
                    className="px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                    dir="rtl"
                  />
                  <input
                    type="text"
                    value={opt.en}
                    onChange={(e) => {
                      const newOpts = [...quizData.options];
                      newOpts[optIdx].en = e.target.value;
                      setQuizData({ ...quizData, options: newOpts });
                    }}
                    placeholder={`Option ${optIdx + 1} in English`}
                    className="px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none border-[#E7DFD1] dark:border-[#343C33]"
                    dir="ltr"
                  />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E7DFD1] dark:border-[#343C33] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#F59E42]" />
                <span className="text-xs font-bold">قفل الدرس الموالي (Sequential Lock)</span>
              </div>
              <input
                type="checkbox"
                checked={courseData.isLockedByDefault}
                onChange={(e) => setCourseData({ ...courseData, isLockedByDefault: e.target.checked })}
                className="w-5 h-5 accent-[#F59E42]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 rounded-full bg-[#F59E42] text-[#191F1B] font-extrabold text-xs uppercase tracking-wider shadow-2xl transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'جاري النشر...' : 'حفظ ونشر الدرس (Publish Lesson)'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}