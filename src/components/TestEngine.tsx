import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Lock, ArrowRight, RotateCcw } from 'lucide-react';
import type { BoardId, Language, TestAttempt, TestCategory, TestSeries } from '../types/education';

interface TestEngineProps {
  tests: TestSeries[];
  board: BoardId;
  language: Language;
  isPremiumUser: boolean;
  userId: string;
  onAttemptComplete: (attempt: TestAttempt) => void;
  onRequestPremium: () => void;
}

const CATEGORIES: { id: 'ALL' | TestCategory; labelEn: string; labelHi: string }[] = [
  { id: 'ALL', labelEn: 'All Tests', labelHi: 'सभी टेस्ट' },
  { id: 'CHAPTER', labelEn: 'Chapter-wise', labelHi: 'अध्याय-वार' },
  { id: 'SUBJECT', labelEn: 'Subject-wise', labelHi: 'विषय-वार' },
  { id: 'WEEKLY', labelEn: 'Weekly', labelHi: 'साप्ताहिक' },
  { id: 'MONTHLY', labelEn: 'Monthly', labelHi: 'मासिक' },
  { id: 'FULL', labelEn: 'Full Syllabus', labelHi: 'पूर्ण पाठ्यक्रम' },
  { id: 'BOARD_MOCK', labelEn: 'Board Mock', labelHi: 'बोर्ड मॉडल पेपर' }
];

export const TestEngine: React.FC<TestEngineProps> = ({
  tests,
  board,
  language,
  isPremiumUser,
  userId,
  onAttemptComplete,
  onRequestPremium
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | TestCategory>('ALL');
  const [activeTest, setActiveTest] = useState<TestSeries | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [descriptiveNotes, setDescriptiveNotes] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submittedResult, setSubmittedResult] = useState<TestAttempt | null>(null);
  const isHi = language === 'hi';

  useEffect(() => {
    if (!activeTest || submittedResult) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeTest, submittedResult, answers]);

  const startTest = (test: TestSeries) => {
    if (test.isPremium && !isPremiumUser) {
      onRequestPremium();
      return;
    }
    setActiveTest(test);
    setCurrentIdx(0);
    setAnswers({});
    setDescriptiveNotes({});
    setSecondsLeft(test.durationMinutes * 60);
    setSubmittedResult(null);
  };

  const handleSubmit = () => {
    if (!activeTest || submittedResult) return;
    let score = 0;
    const weakSet = new Set<string>();
    activeTest.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        score += 1;
      } else if (q.topicTag) {
        weakSet.add(q.topicTag);
      }
    });

    const elapsed = Math.max(1, activeTest.durationMinutes * 60 - secondsLeft);
    const attempt: TestAttempt = {
      id: `att_${Date.now()}`,
      userId: userId || 'guest_student',
      testId: activeTest.id,
      testTitle: isHi ? activeTest.titleHi : activeTest.titleEn,
      board,
      score,
      totalQuestions: Math.max(1, activeTest.questions.length),
      durationSeconds: elapsed,
      weakTopics: Array.from(weakSet),
      submittedAt: new Date().toISOString()
    };

    setSubmittedResult(attempt);
    onAttemptComplete(attempt);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // --- Result View ---
  if (activeTest && submittedResult) {
    const accuracy = Math.round((submittedResult.score / submittedResult.totalQuestions) * 100);
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-700">
              {isHi ? 'स्वचालित परीक्षा परिणाम' : 'Automated Test Report'} · {board}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {isHi ? activeTest.titleHi : activeTest.titleEn}
            </h2>
            <p className="text-sm text-slate-500 mt-1 tabular-nums">
              {isHi ? 'लिया गया समय' : 'Time Taken'}: {formatTimer(submittedResult.durationSeconds)}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-700 tabular-nums">
                {submittedResult.score}/{submittedResult.totalQuestions}
              </div>
              <div className="text-xs text-slate-500 tabular-nums">
                {accuracy}% {isHi ? 'सटीकता' : 'Accuracy'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTest(null);
                setSubmittedResult(null);
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isHi ? 'सभी टेस्ट देखें' : 'All Tests'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activeTest.questions.map((q, idx) => {
            const picked = answers[q.id];
            const isCorrect = picked === q.correctIndex;
            const opts = isHi ? q.optionsHi : q.optionsEn;
            return (
              <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Q{idx + 1} · {q.topicTag}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{isCorrect ? (isHi ? 'सही' : 'Correct') : (isHi ? 'गलत' : 'Incorrect')}</span>
                  </span>
                </div>

                <h4 className="text-base font-semibold text-slate-900">
                  {isHi ? q.questionHi : q.questionEn}
                </h4>

                <div className="text-sm space-y-1">
                  <p className="text-slate-600">
                    {isHi ? 'आपका उत्तर:' : 'Your Answer:'}{' '}
                    <span className="font-medium text-slate-900">
                      {picked !== undefined ? opts[picked] : isHi ? 'अनुत्तरित' : 'Not Attempted'}
                    </span>
                  </p>
                  <p className="text-emerald-700">
                    {isHi ? 'सही उत्तर:' : 'Correct Answer:'}{' '}
                    <span className="font-semibold">{opts[q.correctIndex]}</span>
                  </p>
                </div>

                {descriptiveNotes[q.id] && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {isHi ? 'आपका वर्णनात्मक उत्तर: ' : 'Your written note: '}
                    {descriptiveNotes[q.id]}
                  </p>
                )}

                <div className="p-3.5 rounded-xl bg-blue-50 text-xs sm:text-sm text-slate-800">
                  <span className="font-semibold text-blue-800">
                    {isHi ? 'विस्तृत व्याख्या: ' : 'Detailed Explanation: '}
                  </span>
                  {isHi ? q.explanationHi : q.explanationEn}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Active Exam View ---
  if (activeTest) {
    const q = activeTest.questions[currentIdx];
    const opts = isHi ? q.optionsHi : q.optionsEn;
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">
              {board} · {isHi ? `प्रश्न ${currentIdx + 1} / ${activeTest.questions.length}` : `Question ${currentIdx + 1} of ${activeTest.questions.length}`}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isHi ? activeTest.titleHi : activeTest.titleEn}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-mono-tabular font-semibold">
              <Clock className="w-4 h-4" />
              <span>{formatTimer(secondsLeft)}</span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isHi ? 'सबमिट करें' : 'Submit Test'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="text-xs text-slate-500">
              {q.questionType === 'DESCRIPTIVE'
                ? isHi ? 'वर्णनात्मक + अवधारणा जाँच' : 'Descriptive & Concept Verification'
                : isHi ? 'बहुविकल्पीय प्रश्न' : 'Multiple Choice Question'}{' '}
              · {q.topicTag}
            </div>
            <h4 className="text-lg font-semibold text-slate-900">
              {isHi ? q.questionHi : q.questionEn}
            </h4>

            {q.questionType === 'DESCRIPTIVE' && (
              <textarea
                rows={3}
                value={descriptiveNotes[q.id] || ''}
                onChange={(e) => setDescriptiveNotes((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder={isHi ? 'अपना संक्षिप्त उत्तर यहाँ लिखें (वैकल्पिक)...' : 'Draft your short descriptive answer here (optional)...'}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            )}

            <div className="space-y-2.5">
              {opts.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                    className={`w-full p-3.5 min-h-[44px] rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'border-blue-700 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 min-h-[44px] rounded-xl border border-slate-200 text-sm font-medium text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                {isHi ? 'पिछला' : 'Previous'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentIdx < activeTest.questions.length - 1) {
                    setCurrentIdx((i) => i + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 cursor-pointer"
              >
                <span>
                  {currentIdx < activeTest.questions.length - 1
                    ? (isHi ? 'अगला प्रश्न' : 'Next Question')
                    : (isHi ? 'परिणाम देखें' : 'Finish & Grade')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">
              {isHi ? 'प्रश्न पैलेट' : 'Question Palette'}
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {activeTest.questions.map((item, idx) => {
                const answered = answers[item.id] !== undefined;
                const active = idx === currentIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-lg text-xs font-semibold tabular-nums border cursor-pointer ${
                      active
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : answered
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setActiveTest(null)}
              className="w-full py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'टेस्ट से बाहर निकलें' : 'Exit Test'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Test Directory ---
  const filteredTests = tests.filter(
    (t) => categoryFilter === 'ALL' || t.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isHi ? 'ऑनलाइन टेस्ट सीरीज़ एवं मॉडल पेपर' : 'Online Test Series'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {isHi
              ? 'समयबद्ध परीक्षा, स्वचालित परिणाम और विस्तृत व्याख्या के साथ अभ्यास करें।'
              : 'Timer-based exams with instant scoring, step-by-step explanations, and weak topic tracking.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.map((test) => {
          const locked = test.isPremium && !isPremiumUser;
          return (
            <div
              key={test.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="text-xs text-slate-500">
                  <span>{test.category.replace('_', ' ')}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="tabular-nums">{test.questions.length} Qs</span>
                  <span aria-hidden="true"> · </span>
                  <span className="tabular-nums">{test.durationMinutes} min</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-1.5">
                  {isHi ? test.titleHi : test.titleEn}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {locked
                    ? isHi ? 'प्रीमियम टेस्ट सीरीज़' : 'Premium Test Series'
                    : isHi ? 'निःशुल्क अभ्यास' : 'Free Access'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => startTest(test)}
                className={`w-full py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  locked
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                {locked && <Lock className="w-4 h-4" />}
                <span>
                  {locked
                    ? isHi ? 'प्रीमियम से अनलॉक करें' : 'Unlock with Premium'
                    : isHi ? 'टेस्ट शुरू करें' : 'Start Test'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
