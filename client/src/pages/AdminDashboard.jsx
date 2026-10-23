import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, Trash2, BookOpen, Users, 
  CheckCircle2, ShieldCheck, Layers, HelpCircle, 
  LogOut, Globe, AlertCircle, Plus, Sun, Moon
} from 'lucide-react';

// 🤖 دالة الترجمة التلقائية الذكية للدروس والمصطلحات
const autoTranslateText = (text, targetLang) => {
  if (!text) return '';
  if (targetLang === 'ar') return text;

  // قاموس مصطلحات الإسعافات الأولية الشائعة لترجمتها فوراً
  const dictionary = {
    'إسعافات أولية': 'First Aid',
    'إنعاش قلبي': 'CPR',
    'طوارئ': 'Emergency',
    'أساسيات الإسعافات الأولية والإنعاش الرئوي (CPR)': 'Basic First Aid & CPR Fundamentals',
    'التعامل مع حالات الاختناق الحاد': 'Managing Severe Choking Cases',
    'إسعاف الجروح والكسور المفاجئة': 'Treating Sudden Wounds & Fractures',
    'حروق': 'Burns',
    'نزيف': 'Bleeding',
    'كسور': 'Fractures',
    'دقيقة': 'mins',
    'دقائق': 'mins',
    'ساعة': 'hour',
    'مبتدئ': 'Beginner',
    'متوسط': 'Intermediate',
    'متقدم': 'Advanced'
  };

  // استبدال الكلمات المعروفة أو إرجاع النص مع تنسيقه
  let translated = text;
  Object.keys(dictionary).forEach((key) => {
    if (translated.includes(key)) {
      translated = translated.replace(new RegExp(key, 'g'), dictionary[key]);
    }
  });

  return translated;
};

export default function AdminDashboard() {
  const { i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  // حالة الوضع المظلم Dark Mode
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('theme') === 'dark';
  });

  // التبويب النشط
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'students', 'quizzes'

  // حماية الصفحة: توجيه أي مستخدم عادي لـ Dashboard الطالب
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // تبديل الوضع المظلم
  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // تبديل اللغة
  const toggleLanguage = () => {
    const nextLang = isAr ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  // تسجيل الخروج
  const handleLogout = () => {
    if (logout) logout();
    navigate('/', { replace: true });
  };

  // 1. قائمة المساقات والدروس
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('edu_admin_courses');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        title: 'أساسيات الإسعافات الأولية والإنعاش الرئوي (CPR)', 
        category: 'إنعاش قلبي',
        duration: '45 دقيقة',
        level: 'مبتدئ'
      },
      { 
        id: 2, 
        title: 'التعامل مع حالات الاختناق الحاد', 
        category: 'طوارئ',
        duration: '30 دقيقة',
        level: 'متوسط'
      },
    ];
  });

  // 2. جلب الطلاب الحقيقيين المسجلين فقط
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadRealStudents = () => {
      const registeredUsers = [];
      const storedUser = localStorage.getItem('edu_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.role !== 'admin') {
            registeredUsers.push({
              id: parsed.email || '1',
              name: parsed.name || (isAr ? 'طالب جديد' : 'New Student'),
              email: parsed.email,
              date: new Date().toISOString().split('T')[0],
              status: 'Active'
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStudents(registeredUsers);
    };

    loadRealStudents();
  }, [isAr]);

  // 3. إدارة الاختبارات
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('edu_admin_quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  // نموذج إضافة مساق
  const [courseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState('إسعافات أولية');
  const [duration, setDuration] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // نموذج إضافة اختبار
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  useEffect(() => {
    localStorage.setItem('edu_admin_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edu_admin_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  // دالة إضافة مساق
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const newCourse = {
      id: Date.now(),
      title: courseTitle,
      category,
      duration: duration ? `${duration} دقيقة` : '30 دقيقة',
      level: 'مبتدئ'
    };

    setCourses([newCourse, ...courses]);
    setCourseTitle('');
    setDuration('');
    
    setSuccessMsg(isAr ? 'تم إضافة المساق بنجاح وتفعيل الترجمة التلقائية له!' : 'Course added successfully with auto-translation!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // حذف مساق
  const handleDeleteCourse = (id) => {
    if (window.confirm(isAr ? 'هل أنت متأكدة من حذف هذا المساق؟' : 'Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  // إضافة سؤال للاختبار
  const handleAddQuestionField = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const handleQuestionTextChange = (index, val) => {
    const updated = [...questions];
    updated[index].questionText = val;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, val) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = val;
    setQuestions(updated);
  };

  const handleCorrectAnswerSelect = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optIndex;
    setQuestions(updated);
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    const newQuiz = {
      id: Date.now(),
      title: quizTitle,
      courseId: selectedCourseId || (courses[0]?.id || 1),
      questions
    };

    setQuizzes([newQuiz, ...quizzes]);
    setQuizTitle('');
    setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    setSuccessMsg(isAr ? 'تم نشر الاختبار بنجاح!' : 'Quiz published successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FCFAFF] dark:bg-[#17121D] text-[#1F142E] dark:text-white transition-colors duration-300">
      
      {/* 🧭 Admin Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#21192B]/90 backdrop-blur-md border-b border-[#EDE6F5] dark:border-[#3B2B4C] px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-3 decoration-none">
            <img src="/edufanor.png" alt="EduFanor" className="h-8 object-contain" />
            <div className="hidden sm:block">
              <span className="text-sm font-black text-[#49305D] dark:text-white block leading-none">EduFanor</span>
              <span className="text-[10px] text-[#8A6BBE] font-bold">{isAr ? 'لوحة التحكم الإدارية' : 'Admin Control Panel'}</span>
            </div>
          </Link>

          {/* Controls: Theme + Language + Admin Badge + Logout */}
          <div className="flex items-center gap-2.5">
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-[#F4EFFB] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] text-[#49305D] dark:text-[#E9E0F5] hover:bg-[#E9E0F5] dark:hover:bg-[#2B2037] transition-all cursor-pointer"
              title={isDark ? (isAr ? 'الوضع الفاتح' : 'Light Mode') : (isAr ? 'الوضع المظلم' : 'Dark Mode')}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#49305D]" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4EFFB] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs font-bold text-[#49305D] dark:text-[#E9E0F5] hover:bg-[#E9E0F5] dark:hover:bg-[#2B2037] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#8A6BBE]" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#49305D] text-white text-xs font-extrabold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Noura (Admin)</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* 👑 Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#49305D] via-[#6A4585] to-[#8A6BBE] text-white p-8 rounded-3xl shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white shadow-sm border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{isAr ? 'لوحة تحكم نورة' : 'Noura Admin Dashboard'}</span>
            </div>
            <h1 className="text-3xl font-black">
              {isAr ? 'أهلاً بكِ نورة 👑' : 'Welcome back, Noura 👑'}
            </h1>
            <p className="text-xs text-[#E9E0F5] max-w-xl leading-relaxed">
              {isAr 
                ? 'إدارة الدروس مع دعم الترجمة التلقائية، متابعة التسجيلات الحقيقية للطلاب، وإنشاء الاختبارات.'
                : 'Manage courses with auto-translation support, monitor real student signups, and build quizzes.'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-[#E9E0F5] font-medium">{isAr ? 'المساقات' : 'Courses'}</p>
                <p className="text-xl font-black">{courses.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-[#E9E0F5] font-medium">{isAr ? 'الطلاب الحقيقيون' : 'Real Students'}</p>
                <p className="text-xl font-black">{students.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🧭 Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EDE6F5] dark:border-[#3B2B4C] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#49305D] text-white shadow-md'
                : 'text-[#6B5E7C] dark:text-[#C9BED5] hover:bg-[#F4EFFB] dark:hover:bg-[#21192B]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'إدارة المساقات' : 'Courses Management'}</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-[#49305D] text-white shadow-md'
                : 'text-[#6B5E7C] dark:text-[#C9BED5] hover:bg-[#F4EFFB] dark:hover:bg-[#21192B]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isAr ? 'الطلاب الحقيقيون' : 'Real Students'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-[#49305D] text-white shadow-md'
                : 'text-[#6B5E7C] dark:text-[#C9BED5] hover:bg-[#F4EFFB] dark:hover:bg-[#21192B]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isAr ? 'كتابة وإنشاء الاختبارات' : 'Create Quizzes'}</span>
          </button>
        </div>

        {/* 1️⃣ Tab: Courses */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white dark:bg-[#21192B] p-6 rounded-3xl border border-[#EDE6F5] dark:border-[#3B2B4C] shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-[#EDE6F5] dark:border-[#3B2B4C] pb-4">
                <PlusCircle className="w-5 h-5 text-[#8A6BBE]" />
                <h2 className="text-base font-black text-[#49305D] dark:text-white">
                  {isAr ? 'إضافة مساق جديد' : 'Add New Course'}
                </h2>
              </div>

              {successMsg && (
                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs p-3 rounded-2xl font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#49305D] dark:text-[#E9E0F5] block">
                    {isAr ? 'عنوان المساق (بالعربية)' : 'Course Title'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder={isAr ? 'مثال: التعامل مع الجروح والكسور' : 'Course title...'}
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full bg-[#FCFAFF] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs h-10 px-3.5 rounded-xl outline-none focus:border-[#8A6BBE] text-[#2C1B33] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#49305D] dark:text-[#E9E0F5] block">
                      {isAr ? 'التصنيف' : 'Category'}
                    </label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#FCFAFF] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs h-10 px-3 rounded-xl outline-none focus:border-[#8A6BBE] text-[#2C1B33] dark:text-white"
                    >
                      <option value="إسعافات أولية">{isAr ? 'إسعافات أولية' : 'First Aid'}</option>
                      <option value="إنعاش قلبي">{isAr ? 'إنعاش قلبي (CPR)' : 'CPR'}</option>
                      <option value="طوارئ">{isAr ? 'طوارئ' : 'Emergency'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#49305D] dark:text-[#E9E0F5] block">
                      {isAr ? 'المدة (بالدقائق)' : 'Duration (mins)'}
                    </label>
                    <input 
                      type="text" 
                      placeholder="30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#FCFAFF] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs h-10 px-3.5 rounded-xl outline-none focus:border-[#8A6BBE] text-[#2C1B33] dark:text-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full rounded-xl bg-[#49305D] hover:bg-[#39244A] text-white font-extrabold text-xs h-11 transition-all shadow-md cursor-pointer"
                >
                  {isAr ? 'نشر المساق' : 'Publish Course'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-[#21192B] p-6 rounded-3xl border border-[#EDE6F5] dark:border-[#3B2B4C] shadow-sm space-y-4">
              <h2 className="text-base font-black text-[#49305D] dark:text-white border-b border-[#EDE6F5] dark:border-[#3B2B4C] pb-3">
                {isAr ? 'المساقات المتاحة (تترجم تلقائياً عند تغيير اللغة)' : 'Available Courses (Auto-Translated)'}
              </h2>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#FCFAFF] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C]">
                    <div>
                      <h3 className="text-xs font-black text-[#49305D] dark:text-white">
                        {autoTranslateText(course.title, isAr ? 'ar' : 'en')}
                      </h3>
                      <span className="text-[10px] text-[#6B5E7C] dark:text-[#C9BED5]">
                        {autoTranslateText(course.category, isAr ? 'ar' : 'en')} • {autoTranslateText(course.duration, isAr ? 'ar' : 'en')}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ Tab: Real Students */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-[#21192B] p-6 rounded-3xl border border-[#EDE6F5] dark:border-[#3B2B4C] shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE6F5] dark:border-[#3B2B4C] pb-4">
              <div>
                <h2 className="text-base font-black text-[#49305D] dark:text-white">
                  {isAr ? 'سجل التسجيلات الحقيقية فـ المنصة' : 'Real Registered Students'}
                </h2>
                <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5]">
                  {isAr ? 'يعرض فقط الطلاب الحقيقيين الذين قاموا بإنشاء حساب فـ المنصة.' : 'Only displays real registered student accounts.'}
                </p>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-[#6B5E7C] dark:text-[#C9BED5] text-xs space-y-2">
                <AlertCircle className="w-8 h-8 text-[#8A6BBE] mx-auto opacity-50" />
                <p>{isAr ? 'لا يوجد طلاب مسجلون حالياً. عند تسجيل أي شخص حساباً جديداً سيظهر هنا فوراً!' : 'No real registered students yet. New signups will appear here instantly.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full text-xs ${isAr ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="border-b border-[#EDE6F5] dark:border-[#3B2B4C] text-[#6B5E7C] dark:text-[#C9BED5]">
                      <th className="pb-3 px-2">{isAr ? 'الاسم' : 'Name'}</th>
                      <th className="pb-3 px-2">{isAr ? 'البريد' : 'Email'}</th>
                      <th className="pb-3 px-2">{isAr ? 'تاريخ الانضمام' : 'Join Date'}</th>
                      <th className="pb-3 px-2">{isAr ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE6F5] dark:divide-[#3B2B4C]">
                    {filteredStudents.map((st) => (
                      <tr key={st.id}>
                        <td className="py-3 px-2 font-black">{st.name}</td>
                        <td className="py-3 px-2 text-[#6B5E7C] dark:text-[#C9BED5]">{st.email}</td>
                        <td className="py-3 px-2">{st.date}</td>
                        <td className="py-3 px-2 text-emerald-600 font-bold">{isAr ? 'نشط' : 'Active'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3️⃣ Tab: Fast Quiz Creator Engine */}
        {activeTab === 'quizzes' && (
          <div className="bg-white dark:bg-[#21192B] p-6 rounded-3xl border border-[#EDE6F5] dark:border-[#3B2B4C] shadow-sm space-y-6">
            <div className="border-b border-[#EDE6F5] dark:border-[#3B2B4C] pb-4">
              <h2 className="text-base font-black text-[#49305D] dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#8A6BBE]" />
                <span>{isAr ? 'كتابة وبناء اختبار جديد' : 'Create & Write New Quiz'}</span>
              </h2>
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs p-3 rounded-2xl font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveQuiz} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#49305D] dark:text-[#E9E0F5] block">
                    {isAr ? 'عنوان الاختبار' : 'Quiz Title'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder={isAr ? 'مثال: اختبار الإنعاش الرئوي السريع' : 'e.g. CPR Fast Quiz'}
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full bg-[#FCFAFF] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs h-11 px-3.5 rounded-xl outline-none focus:border-[#8A6BBE] text-[#2C1B33] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#49305D] dark:text-[#E9E0F5] block">
                    {isAr ? 'المساق المرفق' : 'Associated Course'}
                  </label>
                  <select 
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-[#FCFAFF] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs h-11 px-3 rounded-xl outline-none focus:border-[#8A6BBE] text-[#2C1B33] dark:text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {autoTranslateText(c.title, isAr ? 'ar' : 'en')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions List Builder */}
              <div className="space-y-6 pt-4 border-t border-[#EDE6F5] dark:border-[#3B2B4C]">
                <h3 className="text-xs font-black text-[#8A6BBE]">
                  {isAr ? 'أسئلة الاختبار والإجابات:' : 'Quiz Questions & Answer Options:'}
                </h3>

                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 rounded-2xl bg-[#FCFAFF] dark:bg-[#17121D] border border-[#EDE6F5] dark:border-[#3B2B4C] space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#49305D] dark:text-white block">
                        {isAr ? `السؤال رقم ${qIdx + 1}` : `Question #${qIdx + 1}`}
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder={isAr ? 'اكتبي نص السؤال هنا...' : 'Write question text here...'}
                        value={q.questionText}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        className="w-full bg-white dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs h-10 px-3.5 rounded-xl outline-none focus:border-[#8A6BBE] text-[#2C1B33] dark:text-white"
                      />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`correct_${qIdx}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => handleCorrectAnswerSelect(qIdx, optIdx)}
                            className="accent-[#8A6BBE] cursor-pointer"
                          />
                          <input 
                            type="text" 
                            required
                            placeholder={isAr ? `الخيار ${optIdx + 1}` : `Option ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            className="w-full bg-white dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] text-xs h-9 px-3 rounded-xl outline-none focus:border-[#8A6BBE] text-[#2C1B33] dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <button 
                    type="button"
                    onClick={handleAddQuestionField}
                    className="flex items-center gap-2 text-xs font-bold text-[#8A6BBE] hover:underline cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة سؤال آخر' : 'Add Another Question'}</span>
                  </button>

                  <button 
                    type="submit"
                    className="rounded-xl bg-[#49305D] hover:bg-[#39244A] text-white font-extrabold text-xs px-6 h-11 transition-all shadow-md cursor-pointer"
                  >
                    {isAr ? 'نشر الاختبار كاملاً' : 'Publish Complete Quiz'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </main>

    </div>
  );
}