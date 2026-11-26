import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

let server;
let model;

const createStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
};

const lesson = {
  title: { ar: 'الإسعافات الأولية للحروق', en: 'First aid for burns' },
  courseTitle: { ar: 'الإسعافات الأساسية', en: 'Basic first aid' },
  objectives: {
    ar: 'تحديد علامات الحروق\nتبريد الحرق بالماء الجاري',
    en: 'Identify burn signs\nCool the burn under running water',
  },
  safetyNotes: {
    ar: 'لا تستخدم الثلج مباشرة',
    en: 'Do not apply ice directly',
  },
  blocks: [
    {
      id: 'p1',
      type: 'paragraph',
      content: { ar: 'يُبرَّد الحرق بالماء الجاري لمدة عشرين دقيقة.', en: 'Cool the burn under running water for twenty minutes.' },
      data: {},
    },
    {
      id: 'l1',
      type: 'list',
      content: { ar: '', en: '' },
      data: {
        items: {
          ar: ['أزل الملابس الملاصقة للحرق', 'غطِّ الحرق بضمادة نظيفة'],
          en: ['Remove clothing stuck to the burn', 'Cover the burn with a clean dressing'],
        },
      },
    },
    {
      id: 'img1',
      type: 'image',
      content: { ar: '', en: '' },
      data: {
        url: '/uploads/burn-care.png',
        alt: { ar: 'تبريد الحرق', en: 'Cooling the burn' },
        caption: { ar: 'ماء جاري بدرجة حرارة معتدلة', en: 'Lukewarm running water' },
      },
    },
  ],
};

before(async () => {
  global.window = {
    location: { protocol: 'http:', hostname: 'localhost' },
    localStorage: createStorage(),
    sessionStorage: createStorage(),
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
  };
  server = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });
  model = await server.ssrLoadModule('/src/components/admin/lessonDocumentModel.js');
});

after(async () => {
  await server?.close();
  delete global.window;
});

test('AI lesson material includes bilingual title, content blocks, objectives and safety notes', () => {
  const material = model.buildLessonAiMaterial(lesson);

  assert.match(material, /Lesson title \(Arabic\):\nالإسعافات الأولية للحروق/);
  assert.match(material, /Lesson title \(English\):\nFirst aid for burns/);
  assert.match(material, /Course title:\nالإسعافات الأساسية \/ Basic first aid/);
  assert.match(material, /Cool the burn under running water for twenty minutes\./);
  assert.match(material, /Cover the burn with a clean dressing/);
  assert.match(material, /Lukewarm running water/);
  assert.match(material, /Lesson objectives \(Arabic\):\n- تحديد علامات الحروق\n- تبريد الحرق بالماء الجاري/);
  assert.match(material, /Safety notes \(English\):\nDo not apply ice directly/);
});

test('AI lesson material clips oversized lesson content without dropping section headers', () => {
  const longLesson = {
    ...lesson,
    blocks: [
      {
        id: 'p2',
        type: 'paragraph',
        content: { ar: 'م'.repeat(100), en: 'A'.repeat(100) },
        data: {},
      },
    ],
  };
  const material = model.buildLessonAiMaterial({ ...longLesson, maxChars: 24 });

  assert.match(material, /Lesson content \(English\):\n[\s\S]*\[content truncated\]/);
  assert.ok(!material.includes('A'.repeat(80)));
  assert.match(material, /Safety notes \(English\):\nDo not apply ice directly/);
});
