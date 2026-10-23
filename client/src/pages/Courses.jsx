import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { BookOpen, Search, Clock, Award, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Courses() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: "cpr",
      title: isAr ? "أساسيات الإنعاش القلبي الرئوي (CPR)" : "First Aid & CPR Basics",
      description: isAr ? "تعلم الخطوات التطبيقية للتعامل مع السكتات القلبية المفاجئة والتنفس الاصطناعي." : "Essential hands-on steps for handling cardiac arrest and emergency resuscitation.",
      lessons: 6,
      category: "cpr",
      duration: "1h 45m",
      level: isAr ? "مبتدئ" : "Beginner",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "choking",
      title: isAr ? "إسعاف حالات الاختناق" : "Choking Relief & Heimlich",
      description: isAr ? "التقنيات الصحيحة لإسعاف الغصص والاختناق للكبار والأطفال." : "Proper techniques for choking emergencies using back blows and abdominal thrusts.",
      lessons: 5,
      category: "choking",
      duration: "2h 10m",
      level: isAr ? "متوسط" : "Intermediate",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "burns",
      title: isAr ? "العناية بالحروق والجروح" : "Wound Care & Burn Management",
      description: isAr ? "كيفية تنظيف وتطهير الجروح والتعامل مع درجات الحروق المختلفة." : "Cleaning, dressing wounds, and responding to various burn degrees.",
      lessons: 4,
      category: "burns",
      duration: "1h 15m",
      level: isAr ? "مبتدئ" : "Beginner",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8F4FC] dark:bg-[#150D18] text-[#2C1B33] dark:text-[#F8F4FC]">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1400px]">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#3B2042] dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#8A6BBE]" />
            <span>{isAr ? 'المساقات التعليمية' : 'All Courses'}</span>
          </h1>
          <p className="text-xs text-[#796882] dark:text-gray-300">
            {isAr ? 'استكشف مساقات الإسعافات الأولية وتدرب على المهارات المنقذة للحياة.' : 'Explore first-aid courses and build practical life-saving skills.'}
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} text-gray-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن مساق...' : 'Search courses...'}
              className={`w-full py-2.5 ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'} bg-white dark:bg-[#211526] border border-[#EFE8F4] dark:border-[#35213D] rounded-full text-xs font-bold outline-none focus:ring-2 focus:ring-[#8A6BBE]`}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['all', 'cpr', 'choking', 'burns'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#3B2042] text-white'
                    : 'bg-white dark:bg-[#211526] text-[#796882] border border-[#EFE8F4] dark:border-[#35213D]'
                }`}
              >
                {cat === 'all' ? (isAr ? 'الكل' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isCompleted = localStorage.getItem(`completed_${course.id}`) === 'true';

            return (
              <div key={course.id} className="bg-white dark:bg-[#211526] rounded-3xl border border-[#EFE8F4] dark:border-[#35213D] overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-40 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                      {course.level}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-sm text-[#3B2042] dark:text-white flex justify-between items-center">
                      <span>{course.title}</span>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <p className="text-xs text-[#796882] dark:text-gray-300 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#EFE8F4] dark:border-[#35213D] flex justify-between items-center mt-4">
                  <span className="text-xs font-bold text-[#796882] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}
                  </span>
                  <Link
                    to={`/lesson?id=${course.id}`}
                    className="px-4 py-2 rounded-full bg-[#3B2042] hover:bg-[#2A1630] text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>{isCompleted ? (isAr ? 'مكتمل ✓' : 'Completed') : (isAr ? 'بدء الدرس' : 'Start Lesson')}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}