import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import type {
  AppNotification,
  BoardId,
  Chapter,
  Language,
  StudentProfile,
  TestAttempt,
  TestSeries
} from '../types/education';

export const ADMIN_EMAIL = 'singhajitsingh312@gmail.com';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    return true;
  }
}

export async function signInWithGooglePopup(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function isAdminUser(user: User | null): boolean {
  return Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified);
}

export async function loadOrCreateStudentProfile(
  user: User,
  defaults: { board: BoardId; language: Language; displayName?: string }
): Promise<StudentProfile> {
  const studentPath = `students/${user.uid}`;
  const refDoc = doc(db, 'students', user.uid);
  try {
    const snap = await getDoc(refDoc);
    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: user.uid,
        displayName: String(data.displayName || user.displayName || 'Student').slice(0, 100),
        email: user.email || undefined,
        board: (data.board as BoardId) || defaults.board,
        language: (data.language as Language) || defaults.language,
        academicYear: String(data.academicYear || '2026-27'),
        isPremium: Boolean(data.isPremium),
        streakDays: Number(data.streakDays || 1),
        completedChapters: Array.isArray(data.completedChapters) ? data.completedChapters : [],
        weakTopics: Array.isArray(data.weakTopics) ? data.weakTopics : [],
        lastChapterId: String(data.lastChapterId || '')
      };
    }

    const name = (defaults.displayName || user.displayName || 'Class 10 Student').slice(0, 100);
    await setDoc(refDoc, {
      uid: user.uid,
      displayName: name,
      board: defaults.board,
      language: defaults.language,
      academicYear: '2026-27',
      isPremium: false,
      streakDays: 1,
      completedChapters: [],
      weakTopics: [],
      lastChapterId: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    if (user.email) {
      await setDoc(doc(db, 'students', user.uid, 'private', 'info'), {
        uid: user.uid,
        email: user.email.slice(0, 200),
        updatedAt: serverTimestamp()
      });
    }

    return {
      uid: user.uid,
      displayName: name,
      email: user.email || undefined,
      board: defaults.board,
      language: defaults.language,
      academicYear: '2026-27',
      isPremium: false,
      streakDays: 1,
      completedChapters: [],
      weakTopics: [],
      lastChapterId: ''
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, studentPath);
  }
}

export async function saveStudentProgressToFirestore(profile: StudentProfile): Promise<void> {
  const path = `students/${profile.uid}`;
  try {
    await updateDoc(doc(db, 'students', profile.uid), {
      displayName: profile.displayName.slice(0, 100),
      board: profile.board,
      language: profile.language,
      academicYear: profile.academicYear.slice(0, 20),
      streakDays: Math.min(3650, Math.max(0, profile.streakDays)),
      completedChapters: profile.completedChapters.slice(0, 150),
      weakTopics: profile.weakTopics.slice(0, 30),
      lastChapterId: (profile.lastChapterId || '').slice(0, 128),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveVideoProgressToFirestore(
  userId: string,
  chapterId: string,
  watchedSeconds: number,
  totalSeconds: number
): Promise<void> {
  const progressId = `${userId}_${chapterId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `videoProgress/${progressId}`;
  const safeTotal = Math.max(1, Math.round(totalSeconds));
  const safeWatched = Math.min(safeTotal, Math.max(0, Math.round(watchedSeconds)));
  try {
    await setDoc(doc(db, 'videoProgress', progressId), {
      userId,
      chapterId,
      watchedSeconds: safeWatched,
      totalSeconds: safeTotal,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveTestAttemptToFirestore(attempt: TestAttempt): Promise<void> {
  const safeId = attempt.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `testAttempts/${safeId}`;
  try {
    await setDoc(doc(db, 'testAttempts', safeId), {
      id: safeId,
      userId: attempt.userId,
      testId: attempt.testId.slice(0, 128),
      testTitle: attempt.testTitle.slice(0, 180),
      board: attempt.board,
      score: Math.min(attempt.totalQuestions, Math.max(0, attempt.score)),
      totalQuestions: Math.max(1, attempt.totalQuestions),
      durationSeconds: Math.max(0, Math.round(attempt.durationSeconds)),
      weakTopics: attempt.weakTopics.slice(0, 30),
      submittedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchUserTestAttempts(userId: string): Promise<TestAttempt[]> {
  const path = 'testAttempts';
  try {
    const q = query(
      collection(db, 'testAttempts'),
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc'),
      limit(30)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: String(data.userId),
        testId: String(data.testId),
        testTitle: String(data.testTitle),
        board: data.board as BoardId,
        score: Number(data.score),
        totalQuestions: Number(data.totalQuestions),
        durationSeconds: Number(data.durationSeconds),
        weakTopics: Array.isArray(data.weakTopics) ? data.weakTopics : [],
        submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate().toISOString() : new Date().toISOString()
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fetchAdminChapters(): Promise<Partial<Chapter>[]> {
  const path = 'chapters';
  try {
    const snap = await getDocs(collection(db, 'chapters'));
    return snap.docs.map((d) => d.data() as Partial<Chapter>);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminSaveChapterToFirestore(chapter: Chapter): Promise<void> {
  const safeId = chapter.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `chapters/${safeId}`;
  try {
    await setDoc(doc(db, 'chapters', safeId), {
      id: safeId,
      board: chapter.board,
      subject: chapter.subject,
      chapterNumber: chapter.chapterNumber,
      titleEn: chapter.titleEn.slice(0, 180),
      titleHi: chapter.titleHi.slice(0, 180),
      summaryEn: chapter.summaryEn.slice(0, 4000),
      summaryHi: chapter.summaryHi.slice(0, 4000),
      isPremium: chapter.isPremium,
      videoUrl: (chapter.videoUrl || '').slice(0, 500),
      pdfUrl: (chapter.pdfUrl || '').slice(0, 500),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function adminSaveTestToFirestore(test: TestSeries): Promise<void> {
  const safeId = test.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `customTests/${safeId}`;
  try {
    await setDoc(doc(db, 'customTests', safeId), {
      id: safeId,
      titleEn: test.titleEn.slice(0, 180),
      titleHi: test.titleHi.slice(0, 180),
      board: test.board,
      category: test.category,
      durationMinutes: test.durationMinutes,
      isPremium: test.isPremium,
      questions: test.questions.slice(0, 100),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function adminSendNotificationToFirestore(notif: AppNotification): Promise<void> {
  const safeId = notif.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `notifications/${safeId}`;
  try {
    await setDoc(doc(db, 'notifications', safeId), {
      id: safeId,
      titleEn: notif.titleEn.slice(0, 180),
      titleHi: notif.titleHi.slice(0, 180),
      bodyEn: notif.bodyEn.slice(0, 1000),
      bodyHi: notif.bodyHi.slice(0, 1000),
      board: notif.board,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchNotificationsFromFirestore(): Promise<AppNotification[]> {
  const path = 'notifications';
  try {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        titleEn: String(data.titleEn),
        titleHi: String(data.titleHi),
        bodyEn: String(data.bodyEn),
        bodyHi: String(data.bodyHi),
        board: (data.board as BoardId | 'ALL') || 'ALL',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminListAllStudents(): Promise<StudentProfile[]> {
  const path = 'students';
  try {
    const snap = await getDocs(collection(db, 'students'));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        uid: d.id,
        displayName: String(data.displayName || 'Student'),
        board: (data.board as BoardId) || 'CBSE',
        language: (data.language as Language) || 'en',
        academicYear: String(data.academicYear || '2026-27'),
        isPremium: Boolean(data.isPremium),
        streakDays: Number(data.streakDays || 1),
        completedChapters: Array.isArray(data.completedChapters) ? data.completedChapters : [],
        weakTopics: Array.isArray(data.weakTopics) ? data.weakTopics : [],
        lastChapterId: String(data.lastChapterId || '')
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminUpdateStudentPremium(studentUid: string, isPremium: boolean): Promise<void> {
  const path = `students/${studentUid}`;
  try {
    await updateDoc(doc(db, 'students', studentUid), {
      isPremium,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function uploadAssetToFirebaseStorage(folder: 'pdfs' | 'videos', file: File): Promise<string> {
  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storageRef = ref(storage, `${folder}/${safeName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
