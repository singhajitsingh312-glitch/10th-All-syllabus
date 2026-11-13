# Smart Class 10 — Firestore Security Specification

## 1. Data Invariants
1. **Owner-Isolated Profiles**: A student profile at `/students/{userId}` can only be created/read/updated by `request.auth.uid == userId` or a verified admin. Students cannot self-assign `isPremium: true` during creation or update.
2. **PII Isolation**: Email and phone numbers live strictly in `/students/{userId}/private/info` and are only accessible to `userId` or a verified admin.
3. **Immutable Audit & Test Attempts**: `/testAttempts/{attemptId}` requires `userId == request.auth.uid`, valid bounded scores (`0 <= score <= totalQuestions`), and cannot be modified by students after submission.
4. **Admin-Only Curriculum Writes**: `/chapters/{chapterId}`, `/customTests/{testId}`, and `/notifications/{notificationId}` are readable as public catalog resources (containing zero PII), and writable strictly by verified admins (`email_verified == true` and bootstrapped admin email or `/admins/{uid}`).
5. **Strict Timestamp & Key Hygiene**: Every `create` validates `hasAll` + `hasOnly` and `request.time`; every `update` validates `isValid[Entity](incoming())`, `affectedKeys().hasOnly(...)`, and immutable ownership fields.

## 2. Dirty Dozen Adversarial Payloads
1. **Unauthenticated Student Profile Create**: `{ uid: "attacker", displayName: "Hack", ... }` without auth -> `PERMISSION_DENIED`.
2. **Privilege Escalation on Register**: Authenticated student creates `/students/{uid}` with `isPremium: true` -> `PERMISSION_DENIED`.
3. **Self-Upgrade Premium Update**: Authenticated student updates `/students/{uid}` changing `isPremium` from `false` to `true` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection**: Student updates `/students/{uid}` with extra field `role: "admin"` -> `PERMISSION_DENIED`.
5. **Cross-User PII Read**: Student A tries to `get` `/students/{studentB}/private/info` -> `PERMISSION_DENIED`.
6. **Blanket List Scraping of Students**: Non-admin student tries to `list` `/students` -> `PERMISSION_DENIED`.
7. **Forged Test Attempt UserId**: Student A creates `/testAttempts/{id}` with `userId: studentB` -> `PERMISSION_DENIED`.
8. **Score Tampering Update**: Student A tries to `update` `/testAttempts/{id}` after submission -> `PERMISSION_DENIED`.
9. **Unauthorized Chapter Creation**: Non-admin user tries to create `/chapters/math_1` -> `PERMISSION_DENIED`.
10. **ID Poisoning Attack**: User targets `/students/a...1500chars` -> `PERMISSION_DENIED`.
11. **Unverified Email Spoof**: Unverified user with spoofed email claim tries admin write -> `PERMISSION_DENIED`.
12. **Client Timestamp Forgery**: Student creates `/testAttempts/{id}` with backdated `submittedAt` != `request.time` -> `PERMISSION_DENIED`.
