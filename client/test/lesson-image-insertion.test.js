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

const paragraph = (id, en = '') => ({
  id,
  type: 'paragraph',
  content: { ar: '', en },
  data: {},
});

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

test('editable caret is snapshotted before the file picker opens', () => {
  const blocks = [paragraph('p1', 'Hello world')];
  const anchor = model.anchorFromEditable(
    { dataset: { editableId: 'p1' }, selectionStart: 5, selectionEnd: 5 },
    blocks
  );

  assert.deepEqual(anchor, { index: null, blockId: 'p1', start: 5, end: 5 });
});

test('uploaded image is inserted at the saved caret without losing text', () => {
  const blocks = [paragraph('p1', 'Hello world')];
  const result = model.insertLessonBlock(
    blocks,
    'image',
    { url: '/uploads/sample.png' },
    { index: null, blockId: 'p1', start: 5, end: 5 },
    'en'
  );

  assert.deepEqual(result.blocks.map((block) => block.type), ['paragraph', 'image', 'paragraph']);
  assert.equal(result.blocks[0].content.en, 'Hello');
  assert.equal(result.blocks[1].data.url, '/uploads/sample.png');
  assert.equal(result.blocks[2].content.en, ' world');
  assert.equal(result.focusId, result.blocks[2].id);
});

test('explicit insert-menu position takes priority over a stale caret', () => {
  const blocks = [paragraph('p1', 'First'), paragraph('p2', 'Second')];
  const result = model.insertLessonBlock(
    blocks,
    'image',
    { url: '/uploads/between.png' },
    { index: null, blockId: 'p1', start: 99, end: 99 },
    'en',
    1
  );

  assert.equal(result.blocks[1].type, 'image');
  assert.equal(result.blocks[1].data.url, '/uploads/between.png');
  assert.equal(result.blocks[0].content.en, 'First');
  assert.equal(result.blocks[3].content.en, 'Second');
});

test('media inserted without an active caret is appended to the document', () => {
  const blocks = [paragraph('p1', 'Only text')];
  const result = model.insertLessonBlock(
    blocks,
    'image',
    { url: '/uploads/end.png' },
    { index: null, blockId: null, start: 0, end: 0 },
    'en'
  );

  assert.deepEqual(result.blocks.map((block) => block.type), ['paragraph', 'image', 'paragraph']);
  assert.equal(result.blocks[1].data.url, '/uploads/end.png');
});
