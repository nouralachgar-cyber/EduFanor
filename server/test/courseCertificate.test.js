const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildCertificateId,
  serializeCertificate
} = require('../services/courseCertificateService');

test('certificate identifiers are unique and carry the UTC issue year', () => {
  const issuedAt = new Date('2026-11-26T23:30:00.000Z');
  const first = buildCertificateId(issuedAt);
  const second = buildCertificateId(issuedAt);

  assert.match(first, /^EDU-2026-[0-9A-F]{12}$/);
  assert.notEqual(first, second);
});

test('certificate serialization exposes only display-safe fields', () => {
  const result = serializeCertificate({
    _id: 'cert-1',
    user: 'student-1',
    course: 'course-1',
    courseKey: 'cpr',
    certificateId: 'EDU-2026-ABCDEF123456',
    studentName: 'Ada Lovelace',
    courseTitle: 'CPR Basics',
    instructor: null,
    completedAt: new Date('2026-11-26T00:00:00.000Z'),
    issuedAt: new Date('2026-11-26T00:00:00.000Z'),
    password: 'should-not-leak'
  });

  assert.equal(result.courseKey, 'cpr');
  assert.equal(result.studentName, 'Ada Lovelace');
  assert.equal(result.courseTitle, 'CPR Basics');
  assert.equal(result.password, undefined);
});

test('certificate modules load without connecting to a database', () => {
  assert.doesNotThrow(() => {
    require('../controllers/certificateController');
    require('../routes/certificateRoutes');
    require('../controllers/progressController');
    require('../controllers/quizController');
  });
});
