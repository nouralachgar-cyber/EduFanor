import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import adminResources from './adminResources';

const resources = {
  ar: {
    translation: {
      nav: {
        brand: "EduFanor",
        tagline: "منصة الإسعافات الأولية",
        dashboard: "لوحة التحكم",
        myCourses: "مساقاتي",
        aiTutor: "المساعد الذكي",
        login: "تسجيل الدخول",
        getStarted: "ابدأ الآن",
        profile: "الملف الشخصي",
        settings: "الإعدادات",
        logout: "تسجيل الخروج",
        progress: "التقدّم",
        quizzes: "الاختبارات",
        home: "الرئيسية",
        admin: "لوحة الإدارة",
        studentNavigation: "تنقل الطالب",
        toggleTheme: "تبديل المظهر",
        toggleLanguage: "تبديل اللغة",
        toggleMenu: "فتح أو إغلاق القائمة"
      },
      common: {
        lessons: "دروس",
        minutes: "دقائق",
        level: "المستوى",
        comingSoon: "قريباً",
        skipToContent: "انتقل إلى المحتوى الرئيسي"
      },
      error: {
        title: "حدث خطأ غير متوقع",
        desc: "وقع خلل غير متوقع. حاول إعادة المحاولة.",
        retry: "إعادة المحاولة"
      },
      notFound: {
        title: "الصفحة غير موجودة",
        desc: "الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.",
        backHome: "العودة إلى لوحة التحكم"
      },
      auth: {
        loginTitle: "تسجيل الدخول",
        loginSubtitle: "أدخل بياناتك لمتابعة مسارك التعليمي في الإسعافات الأولية",
        registerTitle: "إنشاء حساب جديد",
        registerSubtitle: "انضم إلى EduFanor وابدأ مسارك في تعلّم الإسعافات الأولية",
        name: "الاسم الكامل",
        namePlaceholder: "مثال: نورة لجار",
        email: "البريد الإلكتروني",
        emailPlaceholder: "name@example.com",
        password: "كلمة المرور",
        passwordPlaceholder: "••••••••",
        showPassword: "إظهار كلمة المرور",
        hidePassword: "إخفاء كلمة المرور",
        loginBtn: "دخول",
        registerBtn: "إنشاء الحساب",
        loggingIn: "جارٍ التحقق...",
        registering: "جارٍ إنشاء الحساب...",
        noAccount: "ليس لديك حساب؟",
        hasAccount: "لديك حساب بالفعل؟",
        signUp: "سجل الآن",
        signIn: "تسجيل الدخول",
        brandTagline: "تعلّم الإسعافات الأولية بثقة ووضوح",
        point1: "دروس تفاعلية بصياغة أكاديمية مبسطة",
        point2: "متابعة تقدّمك خطوة بخطوة",
        point3: "دليل طوارئ سريع في متناول يدك"
      },
      mission: {
        badge: "هدفنا الأسمى",
        title: "نعلمك كيف تتدخل في الوقت المناسب لإنقاذ حياة",
        desc: "هدفنا من منصة EduFanor ليس مجرد تقديم دروس نظرية، بل تمكين كل شخص عادي من اكتساب المهارات والثقة للتعامل مع الحالات الطارئة ومساعدة أي محتاج ريثما تصل فرق الإسعاف المختصة.",
        btn: "انضم إلينا وابدأ التعلم"
      },
      studentCard: {
        title: "بطاقة التعلّم",
        subtitle: "بطاقة تعريفك داخل مساحة تعلّم EduFanor",
        idLabel: "معرف الطالب:",
        statusLabel: "الحالة:",
        active: "نشط",
        guest: "زائر (غير مسجل)"
      },
      filter: {
        all: "جميع المساقات",
        cpr: "إنعاش قلبي (CPR)",
        choking: "حالات الاختناق",
        burns: "الحروق والإصابات",
        searchPlaceholder: "ابحث عن مساق أو مهارة إسعافية..."
      },
      challenge: {
        title: "تحدي الطوارئ اليومي",
        subtitle: "اختبر سرعتك وتصرفك الصحيح في المواقف الحرجة",
        question: "ما هي أول خطوة يجب اتخاذها عند العثور على شخص فاقد للوعي ولا يتنفس؟",
        opt1: "البدء فوراً بضغطات الصدر (CPR) والاتصال بالإسعاف.",
        opt2: "إعطاؤه جرعة ماء فورية.",
        opt3: "الانتظار لمدة 10 دقائق لرؤية ما إذا كان يستفيق.",
        correctMsg: "إجابة صحيحة! الاتصال بالإسعاف والبدء بـ CPR هو التصرف السليم لإنقاذ الحياة.",
        wrongMsg: "إجابة خاطئة! التصرف الصحيح هو طلب الإسعاف والبدء فوراً بالضغطات الصدرية."
      },
      certificateCard: {
        title: "شهادة الإنجاز الرقمية",
        desc: "أكمل جميع المساقات الأساسية للحصول على شهادة معتمدة موثقة باسمك.",
        status: "قيد التقدم (0/3 مساقات مكملة)"
      },
      badges: {
        title: "أوسمة الإنجاز والشرف",
        subtitle: "واصل التعلّم واكتسب الأوسمة الأكاديمية مع كل خطوة تُنجزها",
        b1Title: "منقذ مبتدئ",
        b1Desc: "عند التسجيل وبدء أول درس",
        b2Title: "خبير الإنعاش",
        b2Desc: "إكمال مساق الإنعاش القلبي الرئوي",
        b3Title: "استجابة سريعة",
        b3Desc: "الحصول على درجة كاملة في الاختبار"
      },
      quickGuide: {
        title: "دليل الإسعافات السريع",
        btnText: "دليل الطوارئ السريع",
        chokingTitle: "حالة الاختناق",
        chokingDesc: "تطبيق 5 ضربات على الظهر ثم 5 ضغطات على البطن (مناورة هيمليخ).",
        cprTitle: "توقف التنفس (CPR)",
        cprDesc: "الضغط المتواصل على منتصف الصدر بمعدل 100-120 ضغطة في الدقيقة.",
        burnsTitle: "الحروق البسيطة",
        burnsDesc: "تبريد مكان الحرق بالماء الجاري الفاتر لمدة 10 إلى 15 دقيقة."
      },
      profilePage: {
        title: "الملف الشخصي",
        subtitle: "قم بتحديث معلوماتك الشخصية واختيار الأفتار المفضل لديك",
        chooseAvatar: "اختر أفتار لطيف لملفك الشخصي",
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        bio: "نبذة عنك",
        bioPlaceholder: "اكتب نبذة قصيرة عن اهتماماتك في تعلم الإسعافات الأولية...",
        saveBtn: "حفظ التغيرات",
        successMsg: "تم تحديث بيانات الملف الشخصي بنجاح!",
        previewLabel: "معاينة البطاقة",
        studentFallback: "طالب أكاديمي"
      },
      settingsPage: {
        title: "الإعدادات",
        subtitle: "خصص تجربتك التعليمية في منصة EduFanor",
        languageTitle: "لغة الواجهة",
        languageDesc: "اختر اللغة المفضلة للواجهة (العربية / English)",
        verifiedTitle: "محتوى تعليمي",
        verifiedDesc: "محتوى المنصة مخصص للتعلّم والتوعية، ولا يُعد بديلاً عن التدريب المعتمد أو الاستشارة الطبية.",
        active: "للتعلم",
        aboutTitle: "عن المنصة",
        aboutDesc: "EduFanor — تعلّم اليوم، واستعد للغد.",
        version: "الإصدار 1.0"
      },
      aiTutorPage: {
        badge: "المساعد الذكي",
        statusChip: "قيد التطوير",
        title: "مساعدك الذكي للإسعافات الأولية",
        subtitle: "نعمل على تجهيز مساعد ذكي للإجابة عن أسئلتك وتوضيح خطوات الإسعافات الأولية كخطوة بخطوة.",
        previewLabel: "معاينة الواجهة القادمة",
        botGreeting: "مرحباً! قريباً سأجيب عن أسئلتك حول الإسعافات الأولية بالعربية والإنجليزية.",
        sampleQuestionsTitle: "أسئلة سأتمكن من مساعدتك بها:",
        q1: "كيف أتصرف عند اختناق طفل؟",
        q2: "ما معدل الضغطات الصدرية الصحيح؟",
        q3: "كيف أعالج حرقاً من الدرجة الثانية؟",
        inputPlaceholder: "اسأل عن أي مهارة إسعافية...",
        sendBtn: "إرسال",
        comingSoonToast: "المساعد الذكي قيد التطوير وسيتوفر قريباً",
        featuresTitle: "ماذا سيفعل المساعد الذكي؟",
        f1Title: "إجابات فورية عن أسئلتك",
        f1Desc: "شروحات مبسطة لخطوات الإسعافات الأولية في أي وقت.",
        f2Title: "مراجعة المفاهيم",
        f2Desc: "تلخيص ومراجعة للمهارات التي تعلمتها في المساقات.",
        f3Title: "تدرّب قبل المواقف الحقيقية",
        f3Desc: "سيناريوهات تدريبية وأسئلة قصيرة قبل اختبارك.",
        guideTitle: "وحتى ذلك الحين…",
        guideSubtitle: "يمكنك مراجعة دليل الطوارئ السريع أدناه",
        disclaimer: "المحتوى التعليمي لا يُغني عن الاتصال بخدمات الطوارئ أو التدريب المعتمد."
      },
      dashboard: {
        badge: "رحلتك التعليمية",
        welcomeBack: "مرحباً بعودتك،",
        studentName: "طالب أكاديمي",
        welcomeSubtitle: "واصل رحلة التعلّم واكتسب الثقة اللازمة للتصرف في حالات الطوارئ.",
        continueBtn: "واصل التعلّم",
        stats: {
          completedLessons: "الدروس المكتملة",
          learningProgress: "نسبة التقدّم",
          quizAverage: "متوسط النتائج",
          learningStreak: "أيام التعلّم المتتالية",
          days: "أيام",
          availableCourses: "المساقات المتاحة",
          nextLesson: "خطوتك التالية",
          allDone: "أكملت جميع المساقات"
        },
        courseMeta: {
          lessons: "{{count}} دروس"
        },
        learningPath: {
          title: "مسارك التعليمي",
          subtitle: "ثلاث خطوات أساسية لإتقان الإسعافات الأولية",
          statusCompleted: "مكتمل",
          statusPending: "لم يبدأ",
          start: "ابدأ",
          resume: "واصل"
        },
        continueLearningSection: {
          title: "واصل التعلّم",
          resumeBtn: "متابعة الدرس",
          emptyTitle: "لم تبدأ أي دورة بعد",
          emptyDesc: "استكشف الدروس المتاحة وابدأ رحلة التعلّم اليوم في الإسعافات الأولية.",
          exploreBtn: "استكشف المساقات"
        },
        exploreSection: {
          title: "استكشف المساقات",
          subtitle: "مساقات أكاديمية موثوقة مصممة خصيصاً لإكسابك مهارات إنقاذ الحياة.",
          viewCourse: "عرض الدورة",
          viewAll: "عرض جميع المساقات",
          emptyTitle: "لا توجد مساقات مطابقة",
          emptyDesc: "جرّب تعديل كلمات البحث أو الفئة المختارة.",
          resetBtn: "إعادة تعيين الفلاتر"
        },
        progressSection: {
          title: "تقدّمك في التعلّم",
          completed: "دروس مكتملة",
          inProgress: "دروس قيد التعلم",
          viewDetails: "عرض تفاصيل التقدّم"
        },
        quizSection: {
          title: "اختبر معلوماتك",
          desc: "تدرّب على ما تعلّمته من خلال اختبارات تفاعلية وتابع نتائجك بشكل مستمر.",
          startBtn: "ابدأ الاختبار"
        },
        aiSection: {
          title: "تعرّف على مساعدك الذكي",
          desc: "اطرح أسئلتك، وراجع المفاهيم، وتدرّب على ما تعلّمته بمساعدة المعلّم الذكي المعتمد.",
          askBtn: "اسأل المساعد الذكي"
        }
      },
      footer: {
        desc: "EduFanor — تعلّم اليوم، واستعد للغد.",
        courses: "المساقات",
        aiTutor: "المساعد الذكي",
        terms: "الشروط والأحكام",
        privacy: "سياسة الخصوصية",
        copyright: "جميع الحقوق محفوظة © EduFanor 2026",
        learn: "تعلّم",
        platform: "المنصة",
        about: "عن المنصة",
        notes: "ملاحظات",
        disclaimer: "المحتوى تعليمي فقط. في الطوارئ، اتصل بخدمات الإسعاف المحلية أولاً."
      },
      coursesPage: {
        badge: "مكتبة الإسعافات الأولية",
        title: "المساقات التعليمية",
        subtitle: "مساقات مصممة خطوة بخطوة لإكسابك مهارات إنقاذ الحياة، من الأساسيات إلى الحالات المتقدمة.",
        searchPlaceholder: "ابحث عن مساق أو مهارة إسعافية...",
        lessonsCount: "دروس",
        startCourse: "ابدأ المساق",
        continueCourse: "واصل المساق",
        completed: "مكتمل",
        statsCourses: "مساقات",
        statsLessons: "دروس إجمالية",
        emptyTitle: "لا توجد نتائج مطابقة",
        emptyDesc: "جرّب كلمات بحث مختلفة أو استعرض جميع المساقات المتاحة.",
        resetSearch: "عرض جميع المساقات"
      },
      lessonPage: {
        backToCourses: "العودة للمساقات",
        stepTitle: "الخطوة",
        safetyWarning: "تنبيه طبي",
        prevStep: "الخطوة السابقة",
        nextStep: "الخطوة التالية",
        startQuiz: "إكمال المساق والعودة",
        progressLabel: "تقدّم الدرس",
        completedToast: "تم تسجيل إكمال الدرس بنجاح! 🎉",
        finishHint: "أكملت جميع الخطوات — يمكنك إعادة المراجعة في أي وقت."
      },
      coursesData: [
        {
          id: "cpr",
          category: "cpr",
          title: "أساسيات الإنعاش القلبي الرئوي (CPR)",
          description: "تعلم خطوات الإنعاش القلبي الرئوي والتعامل مع حالات التوقف القلبي المفاجئ بثقة.",
          duration: "25 دقيقة",
          lessons: 4,
          level: "مبتدئ",
          progress: 0,
          steps: [
            {
              title: "تأكد من أمان المكان",
              content: "تأكد من أن المكان آمن لك وللمصاب قبل الاقتراب، ثم افحص استجابته بصوت عالٍ وهزّ كتفيه بلطف للتحقق من الوعي."
            },
            {
              title: "اطلب المساعدة فوراً",
              content: "اتصل برقم الإسعاف أو اطلب من شخص قريب الاتصال، واطلب جهاز الصدمات الكهربائية إن كان متوفراً بالقرب منك.",
              warning: "لا تتجاهل الاتصال بالإسعاف حتى لو بدا المصاب متحسناً."
            },
            {
              title: "ابدأ الضغطات الصدرية",
              content: "ضع يديك في منتصف الصدر وابدأ 30 ضغطة بعمق 5-6 سم وبمعدل 100-120 ضغطة في الدقيقة، مع السماح للصدر بالارتفاع بين الضغطات."
            },
            {
              title: "استمر حتى وصول المساعدة",
              content: "واصل دورات 30 ضغطة و2 نفس إن كنت مدرباً، ولا تتوقف إلا عند وصول الإسعاف أو استعادة المصاب للوعي.",
              warning: "لا توقف الإنعاش إلا لضرورة قصوى أو عند وصول فريق الإسعاف."
            }
          ]
        },
        {
          id: "choking",
          category: "choking",
          title: "الاستجابة لحالات الاختناق",
          description: "تطبيق مناورة هيمليخ وإزالة انسداد مجرى الهواء لدى الكبار والأطفال.",
          duration: "15 دقيقة",
          lessons: 3,
          level: "مبتدئ",
          progress: 0,
          steps: [
            {
              title: "شجعه على السعال",
              content: "إذا كان المصاب قادراً على السعال أو الكلام، شجعه على السعال بقوة ولا تتدخل؛ فالسعال القوي قد يطرد الجسم العالق وحده."
            },
            {
              title: "وجّه 5 ضربات على الظهر",
              content: "قف بجانب المصاب وأمِل جسمه للأمام، ثم وجّه 5 ضربات قوية بكعب يدك بين لوحي الكتف."
            },
            {
              title: "نفّذ مناورة هيمليخ",
              content: "طبّق 5 ضغطات بطنية فوق السرة وتحت القص باتجاه الأعلى حتى خروج الجسم، وتناوب بين 5 ضربات ظهر و5 ضغطات بطنية.",
              warning: "إذا فقد المصاب الوعي، ابدأ فوراً بالإنعاش القلبي الرئوي واطلب الإسعاف."
            }
          ]
        },
        {
          id: "burns",
          category: "burns",
          title: "العناية بالحروق والإصابات",
          description: "الإسعافات الأولية للحروق من الدرجة الأولى والثانية والتضميد المعقم الصحيح.",
          duration: "20 دقيقة",
          lessons: 3,
          level: "متقدم",
          progress: 0,
          steps: [
            {
              title: "أبعده عن مصدر الحرق",
              content: "أوقف التعرض لمصدر الحرارة فوراً، واخلع الملابس والمجوهرات غير الملتصقة بالحرق بحذر شديد."
            },
            {
              title: "برّد المنطقة المصابة",
              content: "ضع المنطقة المصابة تحت ماء جاري فاتر لمدة 10 إلى 15 دقيقة لتقليل الألم والضرر.",
              warning: "لا تستخدم الثلج أو المعجون أو الزيت على الحرق إطلاقاً."
            },
            {
              title: "غطِّ الحرق بضمادة معقمة",
              content: "غطِّ الحرق بضمادة معقمة غير لاصقة وتجنب لمس الفقاعات أو فقئها.",
              warning: "راجع الطبيب فوراً للحروق الكبيرة أو حروق الوجه واليدين والمفاصل."
            }
          ]
        }
      ]
    }
  },
  en: {
    translation: {
      nav: {
        brand: "EduFanor",
        tagline: "First Aid Academy",
        dashboard: "Dashboard",
        myCourses: "My Courses",
        aiTutor: "AI Tutor",
        login: "Login",
        getStarted: "Get Started",
        profile: "Profile",
        settings: "Settings",
        logout: "Logout",
        progress: "Progress",
        quizzes: "Quizzes",
        home: "Home",
        admin: "Admin panel",
        studentNavigation: "Student navigation",
        toggleTheme: "Toggle theme",
        toggleLanguage: "Switch language",
        toggleMenu: "Toggle menu"
      },
      common: {
        lessons: "Lessons",
        minutes: "mins",
        level: "Level",
        comingSoon: "Coming soon",
        skipToContent: "Skip to main content"
      },
      error: {
        title: "Something went wrong",
        desc: "An unexpected error occurred. Please try again.",
        retry: "Try Again"
      },
      notFound: {
        title: "Page not found",
        desc: "The page you are looking for does not exist or has been moved.",
        backHome: "Back to Dashboard"
      },
      auth: {
        loginTitle: "Welcome back",
        loginSubtitle: "Sign in to continue your first aid learning journey",
        registerTitle: "Create your account",
        registerSubtitle: "Join EduFanor and start learning life-saving first aid skills",
        name: "Full Name",
        namePlaceholder: "e.g. Noura Lajjar",
        email: "Email Address",
        emailPlaceholder: "name@example.com",
        password: "Password",
        passwordPlaceholder: "••••••••",
        showPassword: "Show password",
        hidePassword: "Hide password",
        loginBtn: "Sign in",
        registerBtn: "Create account",
        loggingIn: "Signing in...",
        registering: "Creating account...",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?",
        signUp: "Sign up",
        signIn: "Sign in",
        brandTagline: "Learn first aid with clarity and confidence",
        point1: "Interactive lessons in clear academic language",
        point2: "Track your progress step by step",
        point3: "A quick emergency guide always at hand"
      },
      mission: {
        badge: "Our Core Mission",
        title: "Empowering Everyone to Save Lives in Critical Moments",
        desc: "Our goal with EduFanor is not just academic theory, but empowering everyday individuals with the skills and confidence to assist anyone in need while waiting for professional help.",
        btn: "Join Us & Start Learning"
      },
      studentCard: {
        title: "Learning Badge",
        subtitle: "Your identity within the EduFanor learning space",
        idLabel: "Student ID:",
        statusLabel: "Status:",
        active: "Active",
        guest: "Guest (not signed in)"
      },
      filter: {
        all: "All Courses",
        cpr: "CPR Basics",
        choking: "Choking Relief",
        burns: "Burns & Wounds",
        searchPlaceholder: "Search courses or first aid skills..."
      },
      challenge: {
        title: "Daily Emergency Scenario",
        subtitle: "Test your quick response skills in critical situations",
        question: "What is the first step when you find an unconscious person who is not breathing?",
        opt1: "Call emergency services immediately & begin chest compressions (CPR).",
        opt2: "Give them water immediately.",
        opt3: "Wait 10 minutes to see if they wake up.",
        correctMsg: "Correct answer! Calling emergency services & starting CPR saves lives.",
        wrongMsg: "Incorrect! The proper response is to request emergency services & begin CPR."
      },
      certificateCard: {
        title: "Digital Certificate of Completion",
        desc: "Complete all core courses to earn a verified certificate under your name.",
        status: "In Progress (0/3 courses completed)"
      },
      badges: {
        title: "Achievement Badges",
        subtitle: "Keep learning and earn academic badges with every step you complete",
        b1Title: "Novice Rescuer",
        b1Desc: "Earned upon registration & starting first lesson",
        b2Title: "CPR Expert",
        b2Desc: "Complete the Cardiopulmonary Resuscitation course",
        b3Title: "Rapid Responder",
        b3Desc: "Achieve a 100% score in any interactive quiz"
      },
      quickGuide: {
        title: "Emergency Pocket Guide",
        btnText: "Quick Emergency Guide",
        chokingTitle: "Choking Emergency",
        chokingDesc: "Give 5 back blows followed by 5 abdominal thrusts (Heimlich maneuver).",
        cprTitle: "CPR Instructions",
        cprDesc: "Push hard and fast in the center of the chest at 100-120 compressions per minute.",
        burnsTitle: "Minor Burns",
        burnsDesc: "Cool the burn with cool running water for 10 to 15 minutes immediately."
      },
      profilePage: {
        title: "Student Profile",
        subtitle: "Update your personal information and select your favorite avatar",
        chooseAvatar: "Pick a cute avatar for your profile",
        fullName: "Full Name",
        email: "Email Address",
        bio: "About You",
        bioPlaceholder: "Write a short bio about your interests in learning first aid...",
        saveBtn: "Save Changes",
        successMsg: "Profile information updated successfully!",
        previewLabel: "Card Preview",
        studentFallback: "Academic Student"
      },
      settingsPage: {
        title: "Settings",
        subtitle: "Customize your EduFanor learning experience",
        languageTitle: "Interface Language",
        languageDesc: "Choose your preferred interface language (العربية / English)",
        verifiedTitle: "Educational content",
        verifiedDesc: "Platform content is for learning and awareness and does not replace certified training or medical advice.",
        active: "Learning",
        aboutTitle: "About",
        aboutDesc: "EduFanor — Learn today. Be ready tomorrow.",
        version: "Version 1.0"
      },
      aiTutorPage: {
        badge: "AI Tutor",
        statusChip: "In development",
        title: "Your first aid AI tutor",
        subtitle: "We are preparing an AI assistant that answers your questions and explains first aid steps clearly.",
        previewLabel: "Preview of the upcoming experience",
        botGreeting: "Hi! Soon I will answer your first aid questions in both Arabic and English.",
        sampleQuestionsTitle: "Questions I will help you with:",
        q1: "What should I do when a child is choking?",
        q2: "What is the correct chest compression rate?",
        q3: "How do I treat a second-degree burn?",
        inputPlaceholder: "Ask about any first aid skill...",
        sendBtn: "Send",
        comingSoonToast: "The AI tutor is under development and will be available soon",
        featuresTitle: "What will the AI tutor do?",
        f1Title: "Answer your questions instantly",
        f1Desc: "Clear explanations of first aid steps whenever you need them.",
        f2Title: "Review key concepts",
        f2Desc: "Summaries and reviews of the skills you learned in the courses.",
        f3Title: "Practice before real situations",
        f3Desc: "Training scenarios and short quizzes before your assessments.",
        guideTitle: "Until then…",
        guideSubtitle: "You can review the quick emergency guide below",
        disclaimer: "Educational content does not replace emergency services or certified training."
      },
      dashboard: {
        badge: "Your Learning Journey",
        welcomeBack: "Welcome back,",
        studentName: "Academic Student",
        welcomeSubtitle: "Continue your learning journey and build the confidence to respond to emergencies.",
        continueBtn: "Continue Learning",
        stats: {
          completedLessons: "Completed Lessons",
          learningProgress: "Learning Progress",
          quizAverage: "Quiz Average",
          learningStreak: "Learning Streak",
          days: "Days",
          availableCourses: "Available Courses",
          nextLesson: "Your Next Step",
          allDone: "All courses completed"
        },
        courseMeta: {
          lessons: "{{count}} lessons"
        },
        learningPath: {
          title: "Your Learning Path",
          subtitle: "Three essential steps to master first aid",
          statusCompleted: "Completed",
          statusPending: "Not started",
          start: "Start",
          resume: "Resume"
        },
        continueLearningSection: {
          title: "Continue Learning",
          resumeBtn: "Resume Lesson",
          emptyTitle: "You haven't started a course yet",
          emptyDesc: "Explore the available lessons and begin your learning journey in first aid today.",
          exploreBtn: "Explore Courses"
        },
        exploreSection: {
          title: "Explore Courses",
          subtitle: "Verified academic courses designed to equip you with life-saving skills.",
          viewCourse: "View Course",
          viewAll: "View All Courses",
          emptyTitle: "No matching results",
          emptyDesc: "Try adjusting your search terms or the selected category.",
          resetBtn: "Reset filters"
        },
        progressSection: {
          title: "Your Learning Progress",
          completed: "Completed Lessons",
          inProgress: "In-Progress Lessons",
          viewDetails: "View Detailed Progress"
        },
        quizSection: {
          title: "Test Your Knowledge",
          desc: "Practice what you've learned with interactive quizzes and track your results.",
          startBtn: "Start a Quiz"
        },
        aiSection: {
          title: "Meet Your AI Tutor",
          desc: "Ask questions, review concepts, and practise what you've learned with your AI learning assistant.",
          askBtn: "Ask AI Tutor"
        }
      },
      footer: {
        desc: "EduFanor — Learn today. Be ready tomorrow.",
        courses: "Courses",
        aiTutor: "AI Tutor",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        copyright: "All rights reserved © EduFanor 2026",
        learn: "Learn",
        platform: "Platform",
        about: "About",
        notes: "Notes",
        disclaimer: "Educational content only. In an emergency, contact local emergency services first."
      },
      coursesPage: {
        badge: "First Aid Library",
        title: "Learning Courses",
        subtitle: "Step-by-step courses that build life-saving first aid skills, from the basics to advanced cases.",
        searchPlaceholder: "Search courses or first aid skills...",
        lessonsCount: "lessons",
        startCourse: "Start Course",
        continueCourse: "Continue",
        completed: "Completed",
        statsCourses: "Courses",
        statsLessons: "Total lessons",
        emptyTitle: "No matching results",
        emptyDesc: "Try different search terms or browse all available courses.",
        resetSearch: "Show all courses"
      },
      lessonPage: {
        backToCourses: "Back to Courses",
        stepTitle: "Step",
        safetyWarning: "Medical Warning",
        prevStep: "Previous Step",
        nextStep: "Next Step",
        startQuiz: "Complete & Return",
        progressLabel: "Lesson progress",
        completedToast: "Lesson completed successfully! 🎉",
        finishHint: "You completed all steps — you can review them again anytime."
      },
      coursesData: [
        {
          id: "cpr",
          category: "cpr",
          title: "Cardiopulmonary Resuscitation (CPR) Basics",
          description: "Learn CPR steps and handle sudden cardiac arrest with confidence and speed.",
          duration: "25 mins",
          lessons: 4,
          level: "Beginner",
          progress: 0,
          steps: [
            {
              title: "Make sure the scene is safe",
              content: "Check that the area is safe for you and the casualty, then check responsiveness by speaking loudly and gently tapping their shoulders."
            },
            {
              title: "Call for help immediately",
              content: "Call the emergency number or ask someone nearby to call, and request an AED if one is available close by.",
              warning: "Never skip calling emergency services, even if the casualty seems to be improving."
            },
            {
              title: "Begin chest compressions",
              content: "Place your hands at the center of the chest and give 30 compressions 5-6 cm deep at a rate of 100-120 per minute, allowing full chest recoil between compressions."
            },
            {
              title: "Continue until help arrives",
              content: "Keep cycles of 30 compressions and 2 rescue breaths if trained, and do not stop unless the casualty recovers or emergency services take over.",
              warning: "Only pause CPR when absolutely necessary or when the ambulance team arrives."
            }
          ]
        },
        {
          id: "choking",
          category: "choking",
          title: "Emergency Response to Choking",
          description: "Apply the Heimlich maneuver to clear severe airway obstructions in adults and children.",
          duration: "15 mins",
          lessons: 3,
          level: "Beginner",
          progress: 0,
          steps: [
            {
              title: "Encourage forceful coughing",
              content: "If the casualty can cough or speak, encourage strong coughing and do not intervene; a forceful cough may clear the blockage on its own."
            },
            {
              title: "Give 5 back blows",
              content: "Stand beside the casualty, lean them forward, and deliver 5 firm blows with the heel of your hand between the shoulder blades."
            },
            {
              title: "Perform the Heimlich maneuver",
              content: "Give 5 abdominal thrusts above the navel and below the ribcage, alternating between 5 back blows and 5 abdominal thrusts until the object is expelled.",
              warning: "If the casualty becomes unconscious, start CPR immediately and call emergency services."
            }
          ]
        },
        {
          id: "burns",
          category: "burns",
          title: "Wound Care and Burn Management",
          description: "First aid procedures for first and second-degree burns and sterile bandaging techniques.",
          duration: "20 mins",
          lessons: 3,
          level: "Advanced",
          progress: 0,
          steps: [
            {
              title: "Remove from the heat source",
              content: "Stop exposure to the heat source immediately, and carefully remove clothing and jewelry that are not stuck to the burn."
            },
            {
              title: "Cool the affected area",
              content: "Hold the area under cool running water for 10 to 15 minutes to reduce pain and damage.",
              warning: "Never apply ice, toothpaste, or oil to a burn."
            },
            {
              title: "Cover the burn with a sterile dressing",
              content: "Cover the burn with a sterile, non-stick dressing and avoid touching or popping any blisters.",
              warning: "Seek medical care for large burns or burns on the face, hands, or joints."
            }
          ]
        }
      ]
    }
  }
};

resources.ar.translation.admin = adminResources.ar.admin;
resources.en.translation.admin = adminResources.en.admin;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('edu_lang') || 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

const updateDirection = (lang) => {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

updateDirection(i18n.language);

i18n.on('languageChanged', (lang) => {
  localStorage.setItem('edu_lang', lang);
  updateDirection(lang);
});

export default i18n;