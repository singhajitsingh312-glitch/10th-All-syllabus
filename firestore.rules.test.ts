/**
 * Security Rule Verification Harness for Smart Class 10
 * Verifies the "Dirty Dozen" adversarial payloads against firestore.rules.
 * Intended to run with @firebase/rules-unit-testing against the Firestore Emulator.
 */

export const DIRTY_DOZEN_CASES = [
  {
    name: '1. Unauthenticated student profile create',
    auth: null,
    path: 'students/attacker_1',
    operation: 'create',
    payload: { uid: 'attacker_1', displayName: 'Attacker', board: 'CBSE', language: 'en', academicYear: '2026-27', isPremium: false, streakDays: 0, completedChapters: [], weakTopics: [] },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '2. Privilege escalation on register (isPremium: true)',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'students/student_1',
    operation: 'create',
    payload: { uid: 'student_1', displayName: 'Student', board: 'CBSE', language: 'en', academicYear: '2026-27', isPremium: true, streakDays: 0, completedChapters: [], weakTopics: [] },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '3. Self-upgrade premium update',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'students/student_1',
    operation: 'update',
    payload: { isPremium: true },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '4. Shadow field injection (role: admin)',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'students/student_1',
    operation: 'update',
    payload: { role: 'admin', displayName: 'Student' },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '5. Cross-user PII read',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'students/student_2/private/info',
    operation: 'get',
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '6. Blanket list scraping of students by non-admin',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'students',
    operation: 'list',
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '7. Forged test attempt userId',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'testAttempts/attempt_99',
    operation: 'create',
    payload: { id: 'attempt_99', userId: 'student_2', testId: 't1', testTitle: 'Math', board: 'CBSE', score: 10, totalQuestions: 10, durationSeconds: 60, weakTopics: [] },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '8. Score tampering update on submitted attempt',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'testAttempts/attempt_1',
    operation: 'update',
    payload: { score: 10 },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '9. Unauthorized chapter creation by student',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'chapters/fake_ch',
    operation: 'create',
    payload: { id: 'fake_ch', board: 'CBSE', subject: 'MATH', chapterNumber: 1, titleEn: 'Fake', titleHi: 'Fake', summaryEn: 'x', summaryHi: 'x', isPremium: false },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '10. ID poisoning (>128 chars)',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: `students/${'a'.repeat(300)}`,
    operation: 'get',
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '11. Unverified email admin spoof',
    auth: { uid: 'spoof_uid', email: 'singhajitsingh312@gmail.com', email_verified: false },
    path: 'notifications/n1',
    operation: 'create',
    payload: { id: 'n1', titleEn: 'Spoof', titleHi: 'Spoof', bodyEn: 'x', bodyHi: 'x', board: 'ALL' },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '12. Client timestamp forgery on testAttempt',
    auth: { uid: 'student_1', email: 'student1@example.com', email_verified: true },
    path: 'testAttempts/attempt_2',
    operation: 'create',
    payload: { id: 'attempt_2', userId: 'student_1', testId: 't1', testTitle: 'Math', board: 'CBSE', score: 8, totalQuestions: 10, durationSeconds: 120, weakTopics: [], submittedAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED'
  }
];
