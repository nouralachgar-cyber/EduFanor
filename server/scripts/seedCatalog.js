const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const logFile = path.join(__dirname, '..', '__seed_log.txt');
const log = (...args) => fs.appendFileSync(logFile, args.map(String).join(' ') + '\n');
log('seed start');
const mongoose = require('mongoose');
const catalog = require('../data/catalogSeed.json');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const quizSeed = {
  title: {
    ar: 'اختبار الإسعافات الأولية',
    en: 'First Aid Knowledge Quiz',
  },
  passingScore: 70,
  published: true,
  questions: [
    {
      question: {
        ar: 'ما هو المعدل الصحيح للضغطات الصدرية أثناء الإنعاش القلبي الرئوي (CPR)؟',
        en: 'What is the correct rate for chest compressions during CPR?',
      },
      options: {
        ar: ['60 - 80 ضغطة في الدقيقة', '100 - 120 ضغطة في الدقيقة', '140 - 160 ضغطة في الدقيقة'],
        en: ['60 - 80 compressions per minute', '100 - 120 compressions per minute', '140 - 160 compressions per minute'],
      },
      correctAnswer: 1,
      explanation: {
        ar: 'المعدل الموصى به هو 100-120 ضغطة في الدقيقة.',
        en: 'The recommended rate is 100-120 compressions per minute.',
      },
    },
    {
      question: {
        ar: 'ما هو الإجراء الأول الصحيح عند التعامل مع شخص يغص ويتعذر عليه التنفس؟',
        en: 'What is the first step when aiding a conscious choking adult?',
      },
      options: {
        ar: ['إعطاؤه الماء فوراً', 'تطبيق 5 ضربات على الظهر و5 ضغطات على البطن', 'جعله يستلقي على ظهره'],
        en: ['Give them water immediately', 'Perform 5 back blows and 5 abdominal thrusts', 'Lay them flat on their back'],
      },
      correctAnswer: 1,
      explanation: {
        ar: 'تُطبق ضربات الظهر والضغطات البطنية بالتناوب حتى خروج الجسم العالق.',
        en: 'Alternate back blows and abdominal thrusts until the object is expelled.',
      },
    },
    {
      question: {
        ar: 'كيف يجب التعامل مع الحروق البسيطة من الدرجة الأولى؟',
        en: 'How should you treat a minor first-degree burn?',
      },
      options: {
        ar: ['وضع الثلج المباشر على الحرق', 'تبريد مكان الحرق بالماء الفاتر المنساب لمدة 10-15 دقيقة', 'دهن مكان الحرق بالمعجون'],
        en: ['Apply ice directly to the burn', 'Cool under cool running water for 10-15 minutes', 'Apply toothpaste to the burn'],
      },
      correctAnswer: 1,
      explanation: {
        ar: 'التبريد بالماء الجاري الفاتر هو الإجراء الصحيح، ولا يُستخدم الثلج أو المعجون.',
        en: 'Cool running water is the correct action; never use ice or toothpaste.',
      },
    },
  ],
};

async function seed() {
  log('connecting');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });
  log('connected');

  let createdCourses = 0;
  let createdLessons = 0;
  let createdQuizzes = 0;

  for (const entry of catalog) {
    let course = await Course.findOne({ slug: entry.slug });

    if (!course) {
      course = await Course.create({
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        difficulty: entry.difficulty,
        image: entry.image,
        estimatedMinutes: entry.estimatedMinutes,
        order: entry.order,
        published: entry.published,
      });
      createdCourses += 1;
      log(`Created course: ${entry.slug}`);
      console.log(`Created course: ${entry.slug}`);
    } else {
      log(`Skipped existing course: ${entry.slug}`);
      console.log(`Skipped existing course: ${entry.slug}`);
    }

    const existingLessonCount = await Lesson.countDocuments({ course: course._id });
    if (existingLessonCount === 0) {
      for (const [index, step] of entry.steps.entries()) {
        await Lesson.create({
          course: course._id,
          title: step.title,
          content: step.content,
          objectives: { ar: [], en: [] },
          safetyNotes: step.warning || { ar: '', en: '' },
          images: [],
          sourceRefs: [],
          reviewStatus: 'unreviewed',
          published: true,
          order: index + 1,
        });
        createdLessons += 1;
      }
      log(`Created ${entry.steps.length} lessons for ${entry.slug}`);
      console.log(`Created ${entry.steps.length} lessons for ${entry.slug}`);
    }
  }

  const cprCourse = await Course.findOne({ slug: 'cpr' });
  if (cprCourse) {
    const firstLesson = await Lesson.findOne({ course: cprCourse._id }).sort('order');
    if (firstLesson) {
      const existingQuiz = await Quiz.findOne({ lesson: firstLesson._id });
      if (!existingQuiz) {
        await Quiz.create({ ...quizSeed, lesson: firstLesson._id });
        createdQuizzes += 1;
        console.log('Created starter quiz for the first CPR lesson');
      }
    }
  }

  log(`Seed complete. Courses: ${createdCourses}, lessons: ${createdLessons}, quizzes: ${createdQuizzes}.`);
  console.log(
    `Seed complete. Courses: ${createdCourses}, lessons: ${createdLessons}, quizzes: ${createdQuizzes}.`
  );
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
