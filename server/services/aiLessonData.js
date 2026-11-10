const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { requireString, optionalString, isValidObjectIdLike } = require('./aiValidation');
const { AiServiceError } = require('./grokService');

function blockContentText(content, language) {
  if (content === null || content === undefined) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          return (
            item.text?.[language] ||
            item.text ||
            item.title?.[language] ||
            item.title ||
            item.label?.[language] ||
            item.label ||
            ''
          );
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }
  if (typeof content === 'object') {
    return content[language] || content.en || content.ar || content.text || '';
  }
  return '';
}

function extractLessonText(source, language) {
  const parts = [];
  const c = source.content?.[language] || source.content?.en || source.content?.ar;
  if (c) parts.push(c);
  const blocks = source.blocks?.[language] || source.blocks?.en || source.blocks?.ar || [];
  blocks.forEach((block) => {
    const text = blockContentText(block.content, language);
    if (text) {
      if (['heading', 'subheading'].includes(block.type)) parts.push(`## ${text}`);
      else if (block.type === 'list' || block.type === 'numbered-list') parts.push(text);
      else if (block.type === 'steps') parts.push(text);
      else parts.push(text);
    }
  });
  const objectives = source.objectives?.[language] || source.objectives?.en || [];
  if (Array.isArray(objectives) && objectives.length) {
    parts.push(`\n${language === 'ar' ? 'أهداف الدرس' : 'Lesson objectives'}:\n- ${objectives.join('\n- ')}`);
  }
  const safety =
    source.safetyNotes?.[language] || source.safetyNotes?.en || source.safetyNotes;
  if (safety) parts.push(`${language === 'ar' ? 'ملاحظات السلامة' : 'Safety notes'}: ${safety}`);
  return parts.join('\n\n').slice(0, 6000);
}

async function loadLessonContext({ lessonId, inline, language }) {
  if (lessonId && isValidObjectIdLike(lessonId)) {
    if (!inline || (!inline.title && !inline.content)) {
      const lesson = await Lesson.findById(lessonId).lean();
      if (lesson) {
        const courseId = String(lesson.course || '');
        let course = null;
        if (/^[a-f\d]{24}$/i.test(courseId)) {
          try {
            course = await Course.findById(courseId).lean();
          } catch {
            course = null;
          }
        }
        const text = extractLessonText(lesson, language);
        if (text) {
          return {
            isDatabase: true,
            lessonTitle: lesson.title?.[language] || lesson.title?.en || lesson.title?.ar || '',
            courseTitle:
              course?.title?.[language] || course?.title?.en || course?.title?.ar || '',
            lessonId: String(lesson._id),
            text,
          };
        }
      }
      if (lesson && (!inline || Object.keys(inline).length === 0)) {
        throw new AiServiceError(
          'This lesson has no content to work with yet.',
          'AI_LESSON_EMPTY',
          400
        );
      }
    }
  }

  if (!inline || typeof inline !== 'object') {
    throw new AiServiceError(
      'A lesson reference or lesson content is required.',
      'VALIDATION_ERROR',
      400
    );
  }

  const title = requireString(inline.title || 'Lesson', 'inline.title', { min: 2, max: 200 });
  const content = requireString(inline.content, 'inline.content', { min: 20, max: 6000 });
  const safety = optionalString(inline.safetyNotes, { max: 1500 });

  return {
    isDatabase: false,
    lessonTitle: title,
    courseTitle: optionalString(inline.courseTitle, { max: 200 }) || '',
    lessonId: null,
    text: [content, safety ? `${language === 'ar' ? 'ملاحظات السلامة' : 'Safety notes'}: ${safety}` : '']
      .filter(Boolean)
      .join('\n\n'),
  };
}

module.exports = { loadLessonContext, extractLessonText, blockContentText };
