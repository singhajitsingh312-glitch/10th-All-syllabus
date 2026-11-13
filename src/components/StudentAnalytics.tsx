import React from 'react';
import { Award, Flame, Download, Lock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Chapter, Language, StudentProfile, SubjectId, TestAttempt } from '../types/education';
import { PYQ_PAPERS, SUBJECTS } from '../data/syllabusData';

interface StudentAnalyticsProps {
  profile: StudentProfile;
  chapters: Chapter[];
  attempts: TestAttempt[];
  language: Language;
  adFreeEnabled: boolean;
  onToggleAdFree: () => void;
  onReviseTopic: (topic: string) => void;
  onActivatePremiumDemo: () => void;
}

export const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({
  profile,
  chapters,
  attempts,
  language,
  adFreeEnabled,
  onToggleAdFree,
  onReviseTopic,
  onActivatePremiumDemo
}) => {
  const isHi = language === 'hi';
  const boardChapters = chapters.filter((c) => c.board === profile.board);
  const completedCount = profile.completedChapters.length;
  const totalBoardChapters = Math.max(1, boardChapters.length);
  const avgScore =
    attempts.length > 0
      ? Math.round(
          (attempts.reduce((sum, a) => sum + a.score / Math.max(1, a.totalQuestions), 0) /
            attempts.length) *
            100
        )
      : 0;

  const subjectProgress = (subjId: SubjectId) => {
    const subjCh = boardChapters.filter((c) => c.subject === subjId);
    const done = subjCh.filter((c) => profile.completedChapters.includes(c.id)).length;
    return {
      done,
      total: subjCh.length,
      pct: subjCh.length > 0 ? Math.round((done / subjCh.length) * 100) : 0
    };
  };

  const handleDownloadPyq = (title: string, isLocked: boolean) => {
    if (isLocked) {
      onActivatePremiumDemo();
      return;
    }
    const html = `
      <!doctype html>
      <html>
        <head><meta charset="utf-8" /><title>${title}</title>
        <style>body{font-family:Arial,sans-serif;padding:32px;max-width:800px;margin:auto;line-height:1.6;}h1{color:#1d4ed8;}</style></head>
        <body>
          <h1>${title}</h1>
          <p>Board: ${profile.board} · Class 10 Official Solved Question Paper</p>
          <hr />
          <h3>Section A — Multiple Choice Questions (1 Mark Each)</h3>
          <p>Q1. Find the HCF of 96 and 404 by prime factorisation. <strong>Ans: 4</strong></p>
          <p>Q2. Which mirror forms a virtual, erect and diminished image? <strong>Ans: Convex Mirror</strong></p>
          <h3>Section B — Short Answer Questions (2-3 Marks)</h3>
          <p>Q3. Why is respiration considered an exothermic reaction? Explain with balanced chemical equation.</p>
          <script>window.onload=function(){window.print();}</script>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const boardPyqs = PYQ_PAPERS.filter((p) => p.board === profile.board || p.board === 'CBSE');
  const streakDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isHi ? 'छात्र प्रगति एवं विश्लेषण' : 'Student Dashboard & Progress'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {profile.displayName} · {profile.board} · {profile.academicYear}
          </p>
        </div>

        <button
          type="button"
          onClick={onActivatePremiumDemo}
          className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 ${
            profile.isPremium
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-blue-700 text-white hover:bg-blue-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>
            {profile.isPremium
              ? (isHi ? 'प्रीमियम सदस्य सक्रिय' : 'Premium Active')
              : (isHi ? 'प्रीमियम अनलॉक करें' : 'Upgrade to Premium')}
          </span>
        </button>
      </div>

      {/* 4 KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs text-slate-500">{isHi ? 'पूर्ण अध्याय' : 'Completed Chapters'}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {completedCount} / {totalBoardChapters}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs text-slate-500">{isHi ? 'औसत टेस्ट स्कोर' : 'Average Test Score'}</p>
          <p className="text-2xl font-bold text-blue-700 mt-1 tabular-nums">{avgScore}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs text-slate-500">{isHi ? 'कुल दिए गए टेस्ट' : 'Tests Attempted'}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{attempts.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs text-slate-500">{isHi ? 'अध्ययन स्ट्रीक' : 'Study Streak'}</p>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {profile.streakDays} {isHi ? 'दिन' : 'Days'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Completion */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            {isHi ? 'विषय-वार प्रगति रिपोर्ट' : 'Subject-Wise Progress Report'}
          </h3>
          <div className="space-y-4">
            {SUBJECTS.map((subj) => {
              const stat = subjectProgress(subj.id);
              return (
                <div key={subj.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">
                      {isHi ? subj.titleHi : subj.titleEn}
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {stat.done}/{stat.total} ({stat.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-700 rounded-full transition-all"
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak & Weak Topics */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              {isHi ? 'साप्ताहिक अध्ययन स्ट्रीक' : 'Weekly Study Streak'}
            </h3>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {streakDays.map((day, i) => {
                const active = i < Math.min(7, profile.streakDays);
                return (
                  <div key={day} className="space-y-1">
                    <div
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${
                        active ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {active ? '✓' : '·'}
                    </div>
                    <span className="text-[11px] text-slate-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              {isHi ? 'कमज़ोर विषय (सुधार हेतु)' : 'Weak Topics to Strengthen'}
            </h3>
            {profile.weakTopics.length === 0 ? (
              <p className="text-sm text-slate-500">
                {isHi
                  ? 'टेस्ट पूरा करने के बाद आपके कमज़ोर टॉपिक यहाँ दिखेंगे।'
                  : 'Complete a test to automatically diagnose topics that need revision.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {profile.weakTopics.map((topic) => (
                  <div key={topic} className="py-2.5 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-rose-700">{topic}</span>
                    <button
                      type="button"
                      onClick={() => onReviseTopic(topic)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>{isHi ? 'दोहराएं' : 'Revise'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Test Scores & Trend */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          {isHi ? 'टेस्ट स्कोर एवं प्रदर्शन सुधार' : 'Test Scores & Performance History'}
        </h3>
        {attempts.length === 0 ? (
          <p className="text-sm text-slate-500">
            {isHi ? 'अभी तक कोई टेस्ट नहीं दिया गया है।' : 'No test attempts recorded yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="pb-3 font-medium">{isHi ? 'परीक्षा' : 'Test'}</th>
                  <th className="pb-3 font-medium">{isHi ? 'बोर्ड' : 'Board'}</th>
                  <th className="pb-3 font-medium">{isHi ? 'अंक' : 'Score'}</th>
                  <th className="pb-3 font-medium">{isHi ? 'समय' : 'Duration'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 font-medium text-slate-900">{a.testTitle}</td>
                    <td className="py-3 text-slate-600">{a.board}</td>
                    <td className="py-3 font-semibold text-blue-700 tabular-nums">
                      {a.score}/{a.totalQuestions} ({Math.round((a.score / a.totalQuestions) * 100)}%)
                    </td>
                    <td className="py-3 text-slate-500 tabular-nums">{a.durationSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Premium Features: PYQs & Ad-Free Mode */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {isHi
                ? 'प्रीमियम सुविधाएँ · पिछले वर्षों के प्रश्न-पत्र (PYQ)'
                : 'Premium Library · Previous Year Question Papers'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi
                ? 'विज्ञापन-मुक्त अध्ययन, डाउनलोड योग्य नोट्स और विशेष टेस्ट सीरीज़'
                : 'Ad-free learning mode, downloadable PDF notes, and official board solved papers'}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleAdFree}
            className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-medium border cursor-pointer whitespace-nowrap shrink-0 ${
              adFreeEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {adFreeEnabled
                ? (isHi ? 'विज्ञापन-मुक्त मोड: चालू' : 'Ad-Free Mode: ON')
                : (isHi ? 'विज्ञापन-मुक्त मोड चालू करें' : 'Enable Ad-Free Mode')}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boardPyqs.map((pyq) => {
            const locked = pyq.isPremium && !profile.isPremium;
            return (
              <div
                key={pyq.id}
                className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    {pyq.board} · {pyq.year} · {pyq.questionsCount} Qs
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mt-1">
                    {isHi ? pyq.titleHi : pyq.titleEn}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadPyq(isHi ? pyq.titleHi : pyq.titleEn, locked)}
                  className={`w-full py-2 min-h-[40px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                    locked
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {locked ? <Lock className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>
                    {locked
                      ? (isHi ? 'प्रीमियम अनलॉक करें' : 'Unlock PYQ')
                      : (isHi ? 'पेपर डाउनलोड करें' : 'Download Paper')}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
