/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Circle,
  Code2,
  ClipboardCheck,
  Home,
  Lock,
  LogOut,
  PlayCircle,
  ShieldCheck,
  TrendingUp,
  User as UserIcon,
  X
} from 'lucide-react';
import {
  BOARDS,
  INITIAL_CHAPTERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SCHEDULE,
  INITIAL_TESTS,
  SUBJECTS
} from './data/syllabusData';
import type {
  AppNotification,
  AppTab,
  BoardId,
  Chapter,
  Language,
  McqQuestion,
  StudentProfile,
  StudyTask,
  SubjectId,
  TestAttempt,
  TestSeries,
  VideoProgressEntry
} from './types/education';
import {
  adminListAllStudents,
  adminSaveChapterToFirestore,
  adminSaveTestToFirestore,
  adminSendNotificationToFirestore,
  adminUpdateStudentPremium,
  auth,
  fetchAdminChapters,
  fetchNotificationsFromFirestore,
  fetchUserTestAttempts,
  isAdminUser,
  loadOrCreateStudentProfile,
  saveStudentProgressToFirestore,
  saveTestAttemptToFirestore,
  saveVideoProgressToFirestore,
  signInWithGooglePopup,
  signOutUser,
  testConnection
} from './lib/firebase';
import { ChapterWorkspace } from './components/ChapterWorkspace';
import { TestEngine } from './components/TestEngine';
import { StudentAnalytics } from './components/StudentAnalytics';
import { AdminConsole } from './components/AdminConsole';
import { AndroidProjectExplorer } from './components/AndroidProjectExplorer';

const HERO_IMAGE_URL = '/src/assets/images/hero_smart_class_banner_1794561102685.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('HOME');
  const [selectedBoard, setSelectedBoard] = useState<BoardId>('CBSE');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('MATH');
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [tests, setTests] = useState<TestSeries[]>(INITIAL_TESTS);
  const [schedule, setSchedule] = useState<StudyTask[]>(INITIAL_SCHEDULE);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgressEntry>>({});
  const [adFreeEnabled, setAdFreeEnabled] = useState(false);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [adminStudents, setAdminStudents] = useState<StudentProfile[]>([
    {
      uid: 'demo_student_1',
      displayName: 'Aarav Kumar',
      board: 'CBSE',
      language: 'en',
      academicYear: '2026-27',
      isPremium: false,
      streakDays: 5,
      completedChapters: ['cbse_math_ch1'],
      weakTopics: ['Trigonometric Ratios'],
      lastChapterId: 'cbse_math_ch1'
    }
  ]);

  const [profile, setProfile] = useState<StudentProfile>({
    uid: 'guest_student',
    displayName: 'Aarav Kumar',
    board: 'CBSE',
    language: 'en',
    academicYear: '2026-27',
    isPremium: false,
    streakDays: 5,
    completedChapters: ['cbse_math_ch1'],
    weakTopics: [],
    lastChapterId: 'cbse_math_ch1'
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [regName, setRegName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const isHi = language === 'hi';
  const isAdmin = isAdminUser(firebaseUser);

  // Boot Firebase connection check + auth listener
  useEffect(() => {
    testConnection();

    fetchNotificationsFromFirestore()
      .then((cloudNotifs) => {
        if (cloudNotifs.length > 0) {
          setNotifications([...cloudNotifs, ...INITIAL_NOTIFICATIONS]);
        }
      })
      .catch(() => {
        // Fallback to local notifications if offline or unconfigured
      });

    fetchAdminChapters()
      .then((cloudChapters) => {
        if (cloudChapters.length > 0) {
          setChapters((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const additions = cloudChapters
              .filter((c): c is Chapter => Boolean(c.id && c.titleEn && !existingIds.has(c.id)))
              .map((c) => ({
                ...INITIAL_CHAPTERS[0],
                ...c
              }));
            return [...additions, ...prev];
          });
        }
      })
      .catch(() => {
        // Keep seeded board curriculum
      });

    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const loaded = await loadOrCreateStudentProfile(user, {
            board: selectedBoard,
            language,
            displayName: regName || user.displayName || undefined
          });
          setProfile(loaded);
          setSelectedBoard(loaded.board);
          setLanguage(loaded.language);

          const userAttempts = await fetchUserTestAttempts(user.uid);
          setAttempts(userAttempts);

          if (isAdminUser(user)) {
            const list = await adminListAllStudents();
            if (list.length > 0) setAdminStudents(list);
          }
        } catch (err) {
          console.error(err);
        }
      }
    });

    return () => unsub();
  }, []);

  const boardChapters = useMemo(
    () => chapters.filter((c) => c.board === selectedBoard),
    [chapters, selectedBoard]
  );

  const activeChapter = useMemo(
    () => chapters.find((c) => c.id === activeChapterId) || null,
    [chapters, activeChapterId]
  );

  const continueChapter = useMemo(() => {
    const byId = boardChapters.find((c) => c.id === profile.lastChapterId);
    return byId || boardChapters[0] || chapters[0];
  }, [boardChapters, chapters, profile.lastChapterId]);

  const currentBoardInfo = BOARDS.find((b) => b.id === selectedBoard) || BOARDS[0];

  const syncProfile = async (next: StudentProfile) => {
    setProfile(next);
    if (firebaseUser) {
      try {
        await saveStudentProgressToFirestore(next);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBoardChange = (board: BoardId) => {
    setSelectedBoard(board);
    setActiveChapterId(null);
    const firstForBoard = chapters.find((c) => c.board === board)?.id || profile.lastChapterId;
    syncProfile({ ...profile, board, lastChapterId: firstForBoard });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    syncProfile({ ...profile, language: lang });
  };

  const handleToggleChapterComplete = (chapterId: string) => {
    const exists = profile.completedChapters.includes(chapterId);
    const updated = exists
      ? profile.completedChapters.filter((id) => id !== chapterId)
      : [...profile.completedChapters, chapterId];
    syncProfile({
      ...profile,
      completedChapters: updated,
      lastChapterId: chapterId
    });
  };

  const handleVideoProgress = (chapterId: string, watchedSeconds: number, totalSeconds: number) => {
    setVideoProgress((prev) => ({
      ...prev,
      [chapterId]: {
        chapterId,
        watchedSeconds,
        totalSeconds,
        updatedAt: new Date().toISOString()
      }
    }));
    if (firebaseUser && watchedSeconds % 10 === 0) {
      saveVideoProgressToFirestore(firebaseUser.uid, chapterId, watchedSeconds, totalSeconds).catch(
        () => {}
      );
    }
  };

  const handleAttemptComplete = async (attempt: TestAttempt) => {
    setAttempts((prev) => [attempt, ...prev]);
    const mergedWeak = Array.from(new Set([...profile.weakTopics, ...attempt.weakTopics])).slice(0, 30);
    await syncProfile({ ...profile, weakTopics: mergedWeak });
    if (firebaseUser) {
      try {
        await saveTestAttemptToFirestore({ ...attempt, userId: firebaseUser.uid });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const user = await signInWithGooglePopup();
      const loaded = await loadOrCreateStudentProfile(user, {
        board: selectedBoard,
        language,
        displayName: regName.trim() || user.displayName || 'Class 10 Student'
      });
      setProfile(loaded);
      setShowAuthModal(false);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setFirebaseUser(null);
  };

  const handleOpenChapter = (ch: Chapter) => {
    setActiveChapterId(ch.id);
    setActiveTab('SYLLABUS');
    syncProfile({ ...profile, lastChapterId: ch.id });
  };

  const handleToggleSchedule = (taskId: string) => {
    setSchedule((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isDone: !t.isDone } : t))
    );
  };

  const handleReviseWeakTopic = (topic: string) => {
    const match =
      boardChapters.find(
        (c) =>
          c.titleEn.toLowerCase().includes(topic.toLowerCase()) ||
          c.mcqs.some((q) => q.topicTag.toLowerCase() === topic.toLowerCase())
      ) || boardChapters[0];
    if (match) {
      setSelectedSubject(match.subject);
      setActiveChapterId(match.id);
      setActiveTab('SYLLABUS');
    }
  };

  const handleActivatePremium = () => {
    setProfile((prev) => ({ ...prev, isPremium: true }));
    setAdFreeEnabled(true);
    setShowPremiumModal(false);
  };

  const handleAdminAddChapter = async (ch: Chapter) => {
    setChapters((prev) => [ch, ...prev]);
    if (isAdmin) {
      await adminSaveChapterToFirestore(ch);
    }
  };

  const handleAdminAddQuestion = async (testId: string, q: McqQuestion) => {
    let updatedTest: TestSeries | undefined;
    setTests((prev) =>
      prev.map((t) => {
        if (t.id !== testId) return t;
        updatedTest = { ...t, questions: [...t.questions, q] };
        return updatedTest;
      })
    );
    if (isAdmin && updatedTest) {
      await adminSaveTestToFirestore(updatedTest);
    }
  };

  const handleAdminSendNotification = async (notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev]);
    if (isAdmin) {
      await adminSendNotificationToFirestore(notif);
    }
  };

  const handleAdminTogglePremium = async (uid: string, nextPremium: boolean) => {
    setAdminStudents((prev) =>
      prev.map((s) => (s.uid === uid ? { ...s, isPremium: nextPremium } : s))
    );
    if (uid === profile.uid) {
      setProfile((prev) => ({ ...prev, isPremium: nextPremium }));
    }
    if (isAdmin) {
      await adminUpdateStudentPremium(uid, nextPremium);
    }
  };

  const navItems: { id: AppTab; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    { id: 'HOME', labelEn: 'Home', labelHi: 'होम', icon: <Home className="w-5 h-5" /> },
    { id: 'SYLLABUS', labelEn: 'Syllabus', labelHi: 'पाठ्यक्रम', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'TESTS', labelEn: 'Tests', labelHi: 'टेस्ट', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'PROGRESS', labelEn: 'Dashboard', labelHi: 'प्रगति', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'ADMIN', labelEn: 'Admin', labelHi: 'एडमिन', icon: <ShieldCheck className="w-5 h-5" /> }
  ];

  const subjectFilteredChapters = boardChapters.filter((c) => c.subject === selectedSubject);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveChapterId(null);
              setActiveTab('HOME');
            }}
            className="text-lg font-bold tracking-tight text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Smart Class 10
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id !== 'SYLLABUS') setActiveChapterId(null);
                    setActiveTab(item.id);
                  }}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-blue-700 text-blue-700 font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  {isHi ? item.labelHi : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            {firebaseUser ? (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-blue-50 text-blue-800 text-xs sm:text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span className="max-w-[130px] truncate">{profile.displayName}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-blue-700 text-white text-xs sm:text-sm font-semibold hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isHi ? 'छात्र लॉगिन' : 'Student Sign In'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Learning Toolbar: Board & Language Switcher (placed cleanly below top bar) */}
        <section
          aria-label="Board and Language Selector"
          className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {BOARDS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleBoardChange(b.id)}
                className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedBoard === b.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isHi ? b.nameHi : b.nameEn}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === 'hi' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                हिन्दी
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('ANDROID')}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-blue-700" />
              <span>Android Kotlin Source</span>
            </button>
          </div>
        </section>

        {/* Tab Views */}
        {activeTab === 'HOME' && (
          <div className="space-y-8">
            {/* Hero Split (2-column balanced height) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-blue-700">
                    {isHi ? currentBoardInfo.patternNoteHi : currentBoardInfo.patternNoteEn}
                  </p>
                  <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                    {isHi
                      ? `नमस्ते ${profile.displayName}, कक्षा 10 बोर्ड की तैयारी शुरू करें`
                      : `Welcome back, ${profile.displayName}`}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                    {isHi
                      ? 'अध्याय-वार वीडियो क्लासेस, डाउनलोड योग्य PDF नोट्स, और समयबद्ध ऑनलाइन टेस्ट सीरीज़ के साथ अपनी बोर्ड परीक्षा की पूरी तैयारी करें।'
                      : 'Master every Class 10 subject with board-aligned video lectures, downloadable revision PDFs, and timed mock exams.'}
                  </p>
                </div>

                {/* Continue Learning Card */}
                {continueChapter && (
                  <div className="bg-blue-700 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-blue-100">
                        {isHi ? 'अध्ययन जारी रखें' : 'Continue Learning'} · {continueChapter.board}
                      </p>
                      <h2 className="text-lg font-semibold">
                        {isHi ? continueChapter.titleHi : continueChapter.titleEn}
                      </h2>
                      <p className="text-xs text-blue-100 tabular-nums">
                        {isHi
                          ? `अध्याय ${continueChapter.chapterNumber} · ${continueChapter.videoDurationMin} मिनट`
                          : `Chapter ${continueChapter.chapterNumber} · ${continueChapter.videoDurationMin} min lecture`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenChapter(continueChapter)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isHi ? 'क्लास शुरू करें' : 'Continue Learning'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden min-h-[260px]">
                {!heroImgFailed ? (
                  <img
                    src={HERO_IMAGE_URL}
                    alt="Smart Class 10 student study desk with science and mathematics notes"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen className="w-10 h-10 text-blue-700 mb-3" />
                    <p className="text-sm font-semibold text-slate-900">Smart Class 10</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedBoard} · 2026-27</p>
                  </div>
                )}
              </div>
            </section>

            {/* Class 10 Subjects Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {isHi ? 'कक्षा 10 के सभी विषय' : 'Class 10 Subjects'}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('SYLLABUS')}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline cursor-pointer"
                >
                  <span>{isHi ? 'पूरा पाठ्यक्रम देखें' : 'View Full Syllabus'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUBJECTS.map((subj) => {
                  const count = boardChapters.filter((c) => c.subject === subj.id).length;
                  const done = boardChapters.filter(
                    (c) => c.subject === subj.id && profile.completedChapters.includes(c.id)
                  ).length;
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(subj.id);
                        setActiveChapterId(null);
                        setActiveTab('SYLLABUS');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-left hover:border-blue-300 transition-colors flex flex-col cursor-pointer"
                    >
                      {subj.image && (
                        <div className="h-36 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={subj.image}
                            alt={subj.titleEn}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <div className="text-xs text-slate-500 tabular-nums">
                            {selectedBoard} · {count} {isHi ? 'अध्याय' : 'Chapters'} · {done}/{count}{' '}
                            {isHi ? 'पूर्ण' : 'Done'}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">
                            {isHi ? subj.titleHi : subj.titleEn}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1">
                            {isHi ? subj.subtitleHi : subj.subtitleEn}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                          <span>{isHi ? 'अध्ययन शुरू करें' : 'Open Chapters'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Daily Study Schedule & Latest Updates */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">
                    {isHi ? 'दैनिक अध्ययन समय-सारणी' : 'Daily Study Schedule'}
                  </h2>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {schedule.filter((s) => s.isDone).length}/{schedule.length}{' '}
                    {isHi ? 'पूर्ण' : 'completed'}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {schedule.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => handleToggleSchedule(task.id)}
                      className="w-full py-3.5 flex items-center gap-3 text-left hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                    >
                      {task.isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            task.isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {isHi ? task.titleHi : task.titleEn}
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                          {task.timeSlot} · {task.subject}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-700" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {isHi ? 'नवीनतम बोर्ड अपडेट' : 'Latest Updates'}
                  </h2>
                </div>
                <div className="space-y-3">
                  {notifications
                    .filter((n) => n.board === 'ALL' || n.board === selectedBoard)
                    .slice(0, 4)
                    .map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1"
                      >
                        <p className="text-xs font-medium text-blue-700">
                          {notif.board === 'ALL' ? 'All Boards' : notif.board}
                        </p>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {isHi ? notif.titleHi : notif.titleEn}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          {isHi ? notif.bodyHi : notif.bodyEn}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'SYLLABUS' && (
          activeChapter ? (
            <ChapterWorkspace
              chapter={activeChapter}
              language={language}
              isCompleted={profile.completedChapters.includes(activeChapter.id)}
              isPremiumUser={profile.isPremium}
              savedVideoProgress={videoProgress[activeChapter.id]}
              onBack={() => setActiveChapterId(null)}
              onToggleComplete={handleToggleChapterComplete}
              onVideoProgress={handleVideoProgress}
              onRequestPremium={() => setShowPremiumModal(true)}
            />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {isHi ? `${selectedBoard} कक्षा 10 संपूर्ण पाठ्यक्रम` : `${selectedBoard} Class 10 Complete Syllabus`}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {isHi ? currentBoardInfo.patternNoteHi : currentBoardInfo.patternNoteEn}
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                {SUBJECTS.map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => setSelectedSubject(subj.id)}
                    className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedSubject === subj.id
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isHi ? subj.titleHi : subj.titleEn}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectFilteredChapters.map((ch) => {
                  const done = profile.completedChapters.includes(ch.id);
                  const locked = ch.isPremium && !profile.isPremium;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleOpenChapter(ch)}
                      className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-blue-300 transition-colors flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1.5">
                        <div className="text-xs text-slate-500 tabular-nums">
                          <span>{isHi ? `अध्याय ${ch.chapterNumber}` : `Chapter ${ch.chapterNumber}`}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{ch.videoDurationMin} min</span>
                          <span aria-hidden="true"> · </span>
                          <span>
                            {ch.isPremium
                              ? isHi ? 'प्रीमियम' : 'Premium'
                              : isHi ? 'निःशुल्क' : 'Free'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {isHi ? ch.titleHi : ch.titleEn}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                          {isHi ? ch.summaryHi : ch.summaryEn}
                        </p>
                      </div>
                      <div className="shrink-0 mt-1">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : locked ? (
                          <Lock className="w-5 h-5 text-slate-400" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-blue-700" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}

        {activeTab === 'TESTS' && (
          <TestEngine
            tests={tests}
            board={selectedBoard}
            language={language}
            isPremiumUser={profile.isPremium}
            userId={profile.uid}
            onAttemptComplete={handleAttemptComplete}
            onRequestPremium={() => setShowPremiumModal(true)}
          />
        )}

        {activeTab === 'PROGRESS' && (
          <StudentAnalytics
            profile={profile}
            chapters={chapters}
            attempts={attempts}
            language={language}
            adFreeEnabled={adFreeEnabled}
            onToggleAdFree={() => setAdFreeEnabled((v) => !v)}
            onReviseTopic={handleReviseWeakTopic}
            onActivatePremiumDemo={() => setShowPremiumModal(true)}
          />
        )}

        {activeTab === 'ADMIN' && (
          <AdminConsole
            isFirebaseAdmin={isAdmin}
            language={language}
            chapters={chapters}
            tests={tests}
            students={adminStudents}
            attempts={attempts}
            onAddOrUpdateChapter={handleAdminAddChapter}
            onAddQuestionToTest={handleAdminAddQuestion}
            onSendNotification={handleAdminSendNotification}
            onToggleStudentPremium={handleAdminTogglePremium}
            onOpenAndroidExplorer={() => setActiveTab('ANDROID')}
          />
        )}

        {activeTab === 'ANDROID' && <AndroidProjectExplorer />}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Smart Class 10 · Class 10 Board Exam Platform ({selectedBoard} · 2026-27)</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('ANDROID')}
              className="text-blue-700 font-medium hover:underline cursor-pointer"
            >
              Android Studio Kotlin Project
            </button>
            <button
              type="button"
              onClick={() => setShowPremiumModal(true)}
              className="text-slate-700 font-medium hover:underline cursor-pointer"
            >
              {profile.isPremium ? 'Premium Member' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (within 15% mobile height cap) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 h-16"
      >
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id !== 'SYLLABUS') setActiveChapterId(null);
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
                active ? 'text-blue-700' : 'text-slate-500'
              }`}
            >
              {item.icon}
              <span>{isHi ? item.labelHi : item.labelEn}</span>
            </button>
          );
        })}
      </nav>

      {/* Auth / Student Profile Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close sign in dialog"
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {firebaseUser ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-blue-700">
                    {isAdmin ? 'Admin Account' : 'Verified Student Account'}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{profile.displayName}</h3>
                  <p className="text-sm text-slate-500">{firebaseUser.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
                  <p>
                    <span className="text-slate-500">{isHi ? 'बोर्ड:' : 'Board:'}</span>{' '}
                    <span className="font-semibold">{profile.board}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">{isHi ? 'योजना:' : 'Plan:'}</span>{' '}
                    <span className="font-semibold">{profile.isPremium ? 'Premium' : 'Free'}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isHi ? 'लॉगआउट करें' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {authMode === 'LOGIN'
                      ? isHi ? 'Smart Class 10 लॉगिन' : 'Sign in to Smart Class 10'
                      : isHi ? 'नया छात्र पंजीकरण' : 'Create Student Profile'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {isHi
                      ? 'अपने अध्याय, वीडियो प्रगति और टेस्ट स्कोर क्लाउड में सहेजने के लिए Google से जुड़ें।'
                      : 'Sync your chapters, video progress, and board test scores securely with Firebase.'}
                  </p>
                </div>

                {authMode === 'REGISTER' && (
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={isHi ? 'छात्र का पूरा नाम' : 'Student Full Name'}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                )}

                {authError && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                    {authError}
                  </p>
                )}

                <button
                  type="button"
                  disabled={authBusy}
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  {authBusy
                    ? 'Connecting...'
                    : isHi ? 'Google खाते से साइन इन करें' : 'Continue with Google'}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode((m) => (m === 'LOGIN' ? 'REGISTER' : 'LOGIN'))}
                  className="w-full text-xs font-medium text-blue-700 hover:underline cursor-pointer"
                >
                  {authMode === 'LOGIN'
                    ? isHi ? 'नया खाता बनाना है? नाम दर्ज करें' : 'New student? Set display name first'
                    : isHi ? 'पहले से पंजीकृत हैं? लॉगिन करें' : 'Already registered? Sign in'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowPremiumModal(false)}
              aria-label="Close premium modal"
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs font-medium text-blue-700">Smart Class 10 Premium</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {isHi ? 'बोर्ड परीक्षा में 95%+ के लिए प्रीमियम अनलॉक करें' : 'Unlock Full Class 10 Premium Access'}
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{isHi ? 'सभी प्रीमियम HD वीडियो क्लासेस' : 'All Premium HD chapter video lectures'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{isHi ? 'विज्ञापन-मुक्त अध्ययन अनुभव' : 'Ad-free distraction-free study mode'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{isHi ? 'पिछले वर्षों के हल प्रश्न-पत्र (PYQ) और विशेष टेस्ट' : '2022–2026 Previous Year Papers & Special Test Series'}</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={handleActivatePremium}
              className="w-full py-3 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
            >
              {isHi ? 'प्रीमियम एक्सेस सक्रिय करें (प्रीव्यू)' : 'Activate Premium Access (Preview)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
