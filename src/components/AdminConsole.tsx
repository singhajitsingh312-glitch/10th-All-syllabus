import React, { useState } from 'react';
import { Upload, PlusCircle, Bell, Users, FileText, Video, CheckCircle2, Code2 } from 'lucide-react';
import type {
  AppNotification,
  BoardId,
  Chapter,
  Language,
  McqQuestion,
  StudentProfile,
  SubjectId,
  TestAttempt,
  TestSeries
} from '../types/education';
import { BOARDS, SUBJECTS } from '../data/syllabusData';
import { uploadAssetToFirebaseStorage } from '../lib/firebase';

interface AdminConsoleProps {
  isFirebaseAdmin: boolean;
  language: Language;
  chapters: Chapter[];
  tests: TestSeries[];
  students: StudentProfile[];
  attempts: TestAttempt[];
  onAddOrUpdateChapter: (chapter: Chapter) => Promise<void>;
  onAddQuestionToTest: (testId: string, question: McqQuestion) => Promise<void>;
  onSendNotification: (notif: AppNotification) => Promise<void>;
  onToggleStudentPremium: (uid: string, nextPremium: boolean) => Promise<void>;
  onOpenAndroidExplorer: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  isFirebaseAdmin,
  language,
  chapters,
  tests,
  students,
  attempts,
  onAddOrUpdateChapter,
  onAddQuestionToTest,
  onSendNotification,
  onToggleStudentPremium,
  onOpenAndroidExplorer
}) => {
  const isHi = language === 'hi';
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Chapter & Video/PDF form
  const [board, setBoard] = useState<BoardId>('CBSE');
  const [subject, setSubject] = useState<SubjectId>('SCIENCE');
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryHi, setSummaryHi] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isPremiumChapter, setIsPremiumChapter] = useState(false);

  // Question form
  const [targetTestId, setTargetTestId] = useState(tests[0]?.id || '');
  const [qEn, setQEn] = useState('');
  const [qHi, setQHi] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanationEn, setExplanationEn] = useState('');
  const [topicTag, setTopicTag] = useState('Board Concept');

  // Notification form
  const [notifBoard, setNotifBoard] = useState<BoardId | 'ALL'>('ALL');
  const [notifTitleEn, setNotifTitleEn] = useState('');
  const [notifTitleHi, setNotifTitleHi] = useState('');
  const [notifBodyEn, setNotifBodyEn] = useState('');

  const handleFileUpload = async (folder: 'pdfs' | 'videos', file: File) => {
    setIsUploading(true);
    try {
      if (isFirebaseAdmin) {
        const url = await uploadAssetToFirebaseStorage(folder, file);
        if (folder === 'pdfs') setPdfUrl(url);
        else setVideoUrl(url);
        setStatusMessage(`Uploaded ${file.name} to Firebase Storage.`);
      } else {
        const localUrl = URL.createObjectURL(file);
        if (folder === 'pdfs') setPdfUrl(localUrl);
        else setVideoUrl(localUrl);
        setStatusMessage(`Attached ${file.name} (local preview; sign in as Admin for cloud Storage).`);
      }
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) return;
    const ch: Chapter = {
      id: `${board.toLowerCase()}_${subject.toLowerCase()}_${Date.now()}`,
      board,
      subject,
      chapterNumber: chapters.filter((c) => c.board === board && c.subject === subject).length + 1,
      titleEn: titleEn.trim(),
      titleHi: titleHi.trim() || titleEn.trim(),
      summaryEn: summaryEn.trim() || 'Updated Class 10 board syllabus chapter.',
      summaryHi: summaryHi.trim() || summaryEn.trim() || 'कक्षा 10 बोर्ड पाठ्यक्रम अध्याय।',
      keyFormulas: ['Key Board Formula · Updated 2026-27'],
      isPremium: isPremiumChapter,
      videoTitleEn: titleEn.trim(),
      videoTitleHi: titleHi.trim() || titleEn.trim(),
      videoUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDurationMin: 30,
      videoTopics: [{ timeLabel: '00:00', seconds: 0, titleEn: 'Introduction', titleHi: 'परिचय' }],
      pdfTitleEn: `${titleEn.trim().replace(/\s+/g, '_')}_Notes.pdf`,
      pdfTitleHi: `${titleHi.trim() || titleEn.trim()}_नोट्स.pdf`,
      pdfUrl: pdfUrl.trim() || undefined,
      importantQuestionsEn: ['Board important long question from this chapter.'],
      importantQuestionsHi: ['इस अध्याय का महत्वपूर्ण दीर्घ उत्तरीय प्रश्न।'],
      mcqs: [],
      shortAnswers: [],
      longAnswers: []
    };
    await onAddOrUpdateChapter(ch);
    setTitleEn('');
    setTitleHi('');
    setSummaryEn('');
    setSummaryHi('');
    setVideoUrl('');
    setPdfUrl('');
    setStatusMessage('Chapter published to syllabus.');
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTestId || !qEn.trim() || !optA.trim() || !optB.trim()) return;
    const q: McqQuestion = {
      id: `q_${Date.now()}`,
      questionEn: qEn.trim(),
      questionHi: qHi.trim() || qEn.trim(),
      optionsEn: [optA, optB, optC || 'None', optD || 'All'],
      optionsHi: [optA, optB, optC || 'कोई नहीं', optD || 'सभी'],
      correctIndex: correctIdx,
      explanationEn: explanationEn.trim() || 'Refer to textbook theorem.',
      explanationHi: explanationEn.trim() || 'पाठ्यपुस्तक प्रमेय देखें।',
      topicTag: topicTag.trim() || 'General'
    };
    await onAddQuestionToTest(targetTestId, q);
    setQEn('');
    setQHi('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanationEn('');
    setStatusMessage('Question added to Test Series.');
  };

  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitleEn.trim()) return;
    await onSendNotification({
      id: `notif_${Date.now()}`,
      titleEn: notifTitleEn.trim(),
      titleHi: notifTitleHi.trim() || notifTitleEn.trim(),
      bodyEn: notifBodyEn.trim() || notifTitleEn.trim(),
      bodyHi: notifBodyEn.trim() || notifTitleHi.trim() || notifTitleEn.trim(),
      board: notifBoard,
      createdAt: new Date().toISOString()
    });
    setNotifTitleEn('');
    setNotifTitleHi('');
    setNotifBodyEn('');
    setStatusMessage('Notification broadcast published.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6">
        <div>
          <p className="text-xs font-medium text-blue-700">
            {isFirebaseAdmin
              ? 'Verified Firebase Admin Session'
              : 'Interactive Preview Mode (Sign in with Admin Google account for Firestore cloud persistence)'}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {isHi ? 'एडमिन प्रबंधन पैनल' : 'Admin Management Console'}
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenAndroidExplorer}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Code2 className="w-4 h-4" />
          <span>{isHi ? 'Android Studio प्रोजेक्ट देखें' : 'Android Studio Project'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Add/Edit Chapter + Upload Video & PDF */}
        <form onSubmit={handleSaveChapter} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-semibold text-slate-900">
              {isHi ? 'अध्याय, वीडियो और PDF नोट्स जोड़ें' : 'Add Chapter · Upload Video & PDF Notes'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value as BoardId)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              {BOARDS.map((b) => (
                <option key={b.id} value={b.id}>{b.nameEn}</option>
              ))}
            </select>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectId)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{s.titleEn}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            required
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Chapter Title (English)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
          />
          <input
            type="text"
            value={titleHi}
            onChange={(e) => setTitleHi(e.target.value)}
            placeholder="अध्याय का नाम (हिन्दी)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
          />
          <textarea
            rows={2}
            value={summaryEn}
            onChange={(e) => setSummaryEn(e.target.value)}
            placeholder="Chapter summary (English)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
          />
          <textarea
            rows={2}
            value={summaryHi}
            onChange={(e) => setSummaryHi(e.target.value)}
            placeholder="अध्याय सारांश (हिन्दी)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Video URL (MP4/HLS)"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
              <label className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 cursor-pointer">
                <Video className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Upload Video File'}</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload('videos', f);
                  }}
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="PDF Notes URL"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
              <label className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 cursor-pointer">
                <FileText className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Upload PDF Notes'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload('pdfs', f);
                  }}
                />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPremiumChapter}
              onChange={(e) => setIsPremiumChapter(e.target.checked)}
              className="rounded border-slate-300 text-blue-700"
            />
            <span>{isHi ? 'प्रीमियम अध्याय चिह्नित करें' : 'Mark as Premium Chapter'}</span>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isHi ? 'अध्याय सहेजें' : 'Publish Chapter'}</span>
          </button>
        </form>

        {/* 2. Add Test Questions & Send Notifications */}
        <div className="space-y-6">
          <form onSubmit={handleAddQuestion} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              {isHi ? 'टेस्ट सीरीज़ में प्रश्न जोड़ें' : 'Add Test Question'}
            </h3>
            <select
              value={targetTestId}
              onChange={(e) => setTargetTestId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              {tests.map((t) => (
                <option key={t.id} value={t.id}>{t.titleEn}</option>
              ))}
            </select>
            <input
              type="text"
              required
              value={qEn}
              onChange={(e) => setQEn(e.target.value)}
              placeholder="Question (English)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={qHi}
              onChange={(e) => setQHi(e.target.value)}
              placeholder="प्रश्न (हिन्दी)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" required value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Option A" className="rounded-xl border border-slate-200 px-3 py-2 text-xs" />
              <input type="text" required value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Option B" className="rounded-xl border border-slate-200 px-3 py-2 text-xs" />
              <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Option C" className="rounded-xl border border-slate-200 px-3 py-2 text-xs" />
              <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Option D" className="rounded-xl border border-slate-200 px-3 py-2 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={correctIdx}
                onChange={(e) => setCorrectIdx(Number(e.target.value))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
              >
                <option value={0}>Correct: Option A</option>
                <option value={1}>Correct: Option B</option>
                <option value={2}>Correct: Option C</option>
                <option value={3}>Correct: Option D</option>
              </select>
              <input
                type="text"
                value={topicTag}
                onChange={(e) => setTopicTag(e.target.value)}
                placeholder="Topic Tag"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
            <input
              type="text"
              value={explanationEn}
              onChange={(e) => setExplanationEn(e.target.value)}
              placeholder="Solution Explanation"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="w-full py-2.5 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              {isHi ? 'प्रश्न जोड़ें' : 'Add Question to Test'}
            </button>
          </form>

          <form onSubmit={handleBroadcastNotification} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-semibold text-slate-900">
                {isHi ? 'सूचना भेजें (FCM Alert)' : 'Send Board Notification'}
              </h3>
            </div>
            <select
              value={notifBoard}
              onChange={(e) => setNotifBoard(e.target.value as BoardId | 'ALL')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Boards</option>
              {BOARDS.map((b) => (
                <option key={b.id} value={b.id}>{b.nameEn}</option>
              ))}
            </select>
            <input
              type="text"
              required
              value={notifTitleEn}
              onChange={(e) => setNotifTitleEn(e.target.value)}
              placeholder="Notification Title (English)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={notifTitleHi}
              onChange={(e) => setNotifTitleHi(e.target.value)}
              placeholder="सूचना शीर्षक (हिन्दी)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <textarea
              rows={2}
              value={notifBodyEn}
              onChange={(e) => setNotifBodyEn(e.target.value)}
              placeholder="Message body..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full py-2.5 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              {isHi ? 'सूचना भेजें' : 'Broadcast Notification'}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Manage Students & Subscriptions + Test Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-semibold text-slate-900">
              {isHi ? 'छात्र एवं प्रीमियम प्रबंधन' : 'Students & Premium Subscriptions'}
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {students.map((st) => (
              <div key={st.uid} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{st.displayName}</p>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {st.board} · {st.completedChapters.length} chapters · {st.streakDays}d streak
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleStudentPremium(st.uid, !st.isPremium)}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    st.isPremium
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.isPremium ? 'Premium Active' : 'Grant Premium'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            {isHi ? 'नवीनतम छात्र टेस्ट परिणाम' : 'Submitted Test Results'}
          </h3>
          {attempts.length === 0 ? (
            <p className="text-sm text-slate-500">No test attempts recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {attempts.slice(0, 8).map((att) => (
                <div key={att.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{att.testTitle}</p>
                    <p className="text-xs text-slate-500">{att.board} · {att.userId.slice(0, 10)}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-700 tabular-nums">
                    {att.score}/{att.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
