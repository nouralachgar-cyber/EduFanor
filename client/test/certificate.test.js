import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');

let server;
let CertificateDocument;
let certificateLayout;
let certificateApi;

const createStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
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
  CertificateDocument = (
    await server.ssrLoadModule('/src/components/certificate/CertificateDocument.jsx')
  ).default;
  certificateLayout = await server.ssrLoadModule('/src/lib/certificateLayout.js');
  certificateApi = await server.ssrLoadModule('/src/lib/certificates.js');
});

after(async () => {
  await server?.close();
  delete global.window;
});

test('certificate lines wrap and truncate without losing the final idea', () => {
  assert.deepEqual(certificateLayout.certificateLines('Ada Lovelace', 18, 2), ['Ada Lovelace']);
  assert.deepEqual(
    certificateLayout.certificateLines('Cardiopulmonary Resuscitation Basics For Adults', 18, 2),
    ['Cardiopulmonary', 'Resuscitation Bas…']
  );
});

test('certificate dates are always formatted in English', () => {
  assert.equal(
    certificateLayout.formatCertificateDate('2026-11-26T00:00:00.000Z'),
    '26 November 2026'
  );
});

test('certificate file names are safe and include the issued id', () => {
  assert.equal(
    certificateLayout.certificateFileName({
      courseKey: 'CPR Basics!',
      certificateId: 'EDU-2026-ABCDEF123456',
    }),
    'EduFanor-cpr-basics-EDU-2026-ABCDEF123456.pdf'
  );
});

test('generated PDF is a landscape A4 document with an embedded JPEG image', async () => {
  const blob = certificateApi.buildPdf(new Uint8Array([255, 216, 255, 217]), 3508, 2480);
  const pdf = await blob.text();

  assert.match(pdf, /^%PDF-1\.4/);
  assert.match(pdf, /\/MediaBox \[0 0 842 595\]/);
  assert.match(pdf, /\/Subtype \/Image/);
  assert.match(pdf, /\/Filter \/DCTDecode/);
  assert.match(pdf, /startxref\n\d+\n%%EOF$/);
});

test('rendered certificate is English-only and uses server-issued values', () => {
  const html = renderToStaticMarkup(
    React.createElement(CertificateDocument, {
      certificate: {
        studentName: 'Ada Lovelace',
        courseTitle: 'Cardiopulmonary Resuscitation Basics',
        completedAt: '2026-11-26T00:00:00.000Z',
        certificateId: 'EDU-2026-ABCDEF123456',
        instructor: null,
      },
    })
  );

  assert.match(html, /EDUFANOR/);
  assert.match(html, /CERTIFICATE OF COMPLETION/);
  assert.match(html, /Ada Lovelace/);
  assert.match(html, /Cardiopulmonary Resuscitation Basics/);
  assert.match(html, /26 November 2026/);
  assert.match(html, /EDU-2026-ABCDEF123456/);
  assert.match(html, /AUTHORIZED SIGNATURE/);
  assert.doesNotMatch(html, /[\u0600-\u06FF]/);
});

test('certificate page never relies on local completion or translated certificate labels', () => {
  const source = readSource('src/pages/Certificate.jsx');
  assert.match(source, /getCourseCertificate\(courseId\)/);
  assert.doesNotMatch(source, /isCourseCompleted|markCourseCompleted|localStorage|buildCertificateId/);
  assert.doesNotMatch(source, /t\(['"]certificate\./);
});
