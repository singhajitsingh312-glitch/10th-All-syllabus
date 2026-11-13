import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  PlayCircle,
  BookOpen
} from 'lucide-react';
import type { Chapter, Language, VideoProgressEntry } from '../types/education';
import { VideoLecturePlayer } from './VideoLecturePlayer';

interface ChapterWorkspaceProps {
  chapter: Chapter;
  language: Language;
  isCompleted: boolean;
  isPremiumUser: boolean;
  savedVideoProgress?: VideoProgressEntry;
  onBack: () => void;
  onToggleComplete: (chapterId: string) => void;
  onVideoProgress: (chapterId: string, watchedSec: number, totalSec: number) => void;
  onRequestPremium: () => void;
}

type ChapterInnerTab = 'SUMMARY' | 'VIDEO' | 'NOTES' | 'MCQ' | 'QA';

export const ChapterWorkspace: React.FC<ChapterWorkspaceProps> = ({
  chapter,
  language,
  isCompleted,
  isPremiumUser,
  savedVideoProgress,
  onBack,
  onToggleComplete,
  onVideoProgress,
  onRequestPremium
}) => {
  const [innerTab, setInnerTab] = useState<ChapterInnerTab>('VIDEO');
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const isHi = language === 'hi';
  const locked = chapter.isPremium && !isPremiumUser;

  const handleDownloadPrintableNotes = () => {
    if (locked) {
      onRequestPremium();
      return;
    }
    if (chapter.pdfUrl) {
      window.open(chapter.pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const content = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${chapter.pdfTitleEn}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; max-width: 820px; margin: auto; line-height: 1.6; }
            h1 { color: #1d4ed8; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            h2 { color: #1e293b; margin-top: 24px; }
            .box { background: #eff6ff; padding: 14px; border-radius: 8px; margin: 12px 0; }
          </style>
        </head>
        <body>
          <h1>Smart Class 10 — ${chapter.board} Notes</h1>
          <p><strong>Chapter ${chapter.chapterNumber}:</strong> ${chapter.titleEn} / ${chapter.titleHi}</p>
          <h2>Summary (English)</h2>
          <p>${chapter.summaryEn}</p>
          <h2>सारांश (हिन्दी)</h2>
          <p>${chapter.summaryHi}</p>
          <h2>Key Formulas & Points</h2>
          <div class="box">${chapter.keyFormulas.map((f) => `<p>• ${f}</p>`).join('')}</div>
          <h2>Important Board Questions</h2>
          <ul>${chapter.importantQuestionsEn.map((q) => `<li>${q}</li>`).join('')}</ul>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = chapter.pdfTitleEn.replace('.pdf', '_Printable_Notes.html');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (locked) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? 'वापस जाएं' : 'Back to Syllabus'}</span>
        </button>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          {isHi ? chapter.titleHi : chapter.titleEn}
        </h3>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          {isHi
            ? 'यह प्रीमियम अध्याय HD वीडियो लेक्चर, PDF नोट्स और बोर्ड प्रश्न बैंक के साथ आता है।'
            : 'This Premium chapter includes full HD video lectures, downloadable PDF notes, and board question solutions.'}
        </p>
        <button
          type="button"
          onClick={onRequestPremium}
          className="mt-6 px-6 py-3 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
        >
          {isHi ? 'प्रीमियम अनलॉक करें' : 'Unlock Smart Class 10 Premium'}
        </button>
      </div>
    );
  }

  const tabs: { id: ChapterInnerTab; labelEn: string; labelHi: string }[] = [
    { id: 'VIDEO', labelEn: 'Video Class', labelHi: 'वीडियो क्लास' },
    { id: 'SUMMARY', labelEn: 'Summary & Formulas', labelHi: 'सारांश व सूत्र' },
    { id: 'NOTES', labelEn: 'PDF Notes', labelHi: 'PDF नोट्स' },
    { id: 'MCQ', labelEn: 'MCQs', labelHi: 'बहुविकल्पीय' },
    { id: 'QA', labelEn: 'Short & Long Q&A', labelHi: 'लघु/दीर्घ प्रश्न' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:underline cursor-pointer mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHi ? 'सभी अध्याय' : 'All Chapters'}</span>
          </button>
          <div className="text-xs text-slate-500">
            <span>{chapter.board}</span>
            <span aria-hidden="true"> · </span>
            <span>{isHi ? `अध्याय ${chapter.chapterNumber}` : `Chapter ${chapter.chapterNumber}`}</span>
            <span aria-hidden="true"> · </span>
            <span className="tabular-nums">{chapter.videoDurationMin} min</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isHi ? chapter.titleHi : chapter.titleEn}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onToggleComplete(chapter.id)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-blue-700 text-white hover:bg-blue-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {isCompleted
              ? (isHi ? 'अध्याय पूर्ण' : 'Completed')
              : (isHi ? 'पूर्ण चिह्नित करें' : 'Mark Completed')}
          </span>
        </button>
      </div>

      {/* Segmented Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setInnerTab(tab.id)}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              innerTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? tab.labelHi : tab.labelEn}
          </button>
        ))}
      </div>

      {innerTab === 'VIDEO' && (
        <VideoLecturePlayer
          chapter={chapter}
          language={language}
          savedProgress={savedVideoProgress}
          onProgressUpdate={onVideoProgress}
        />
      )}

      {innerTab === 'SUMMARY' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              {isHi ? 'अध्याय सारांश' : 'Chapter Summary'}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {isHi ? chapter.summaryHi : chapter.summaryEn}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              {isHi ? 'मुख्य सूत्र एवं बिंदु' : 'Key Formulas & Board Highlights'}
            </h4>
            <ul className="space-y-2">
              {chapter.keyFormulas.map((formula, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-sm font-mono-tabular text-slate-800"
                >
                  {formula}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              {isHi ? 'महत्वपूर्ण बोर्ड प्रश्न' : 'Important Board Exam Questions'}
            </h4>
            <ul className="space-y-2 list-disc list-inside text-sm text-slate-700">
              {(isHi ? chapter.importantQuestionsHi : chapter.importantQuestionsEn).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {innerTab === 'NOTES' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {isHi ? chapter.pdfTitleHi : chapter.pdfTitleEn}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {chapter.board} · {isHi ? 'प्रिंट और ऑफलाइन रिवीजन के लिए तैयार' : 'Formatted for offline study & PDF print'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPrintableNotes}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isHi ? 'नोट्स डाउनलोड / प्रिंट करें' : 'Download / Print Notes'}</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
              <BookOpen className="w-4 h-4" />
              <span>{isHi ? 'नोट्स प्रीव्यू' : 'Revision Sheet Preview'}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isHi ? chapter.summaryHi : chapter.summaryEn}
            </p>
            <div className="space-y-1.5">
              {chapter.keyFormulas.map((f, idx) => (
                <p key={idx} className="text-xs font-mono-tabular text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200">
                  {f}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {innerTab === 'MCQ' && (
        <div className="space-y-4">
          {chapter.mcqs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-sm text-slate-600">
              {isHi ? 'इस अध्याय के लिए शीघ्र ही और MCQ जोड़े जाएंगे।' : 'More MCQs for this chapter can be practised in the Tests tab.'}
            </div>
          ) : (
            chapter.mcqs.map((q, qIdx) => {
              const picked = mcqAnswers[q.id];
              const opts = isHi ? q.optionsHi : q.optionsEn;
              return (
                <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <p className="text-xs text-slate-500">
                    Q{qIdx + 1} · {q.topicTag}
                  </p>
                  <h4 className="text-base font-semibold text-slate-900">
                    {isHi ? q.questionHi : q.questionEn}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {opts.map((opt, oIdx) => {
                      const isPicked = picked === oIdx;
                      const isCorrect = q.correctIndex === oIdx;
                      let stateClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                      if (picked !== undefined) {
                        if (isCorrect) {
                          stateClass = 'border-emerald-300 bg-emerald-50 text-emerald-900';
                        } else if (isPicked) {
                          stateClass = 'border-rose-300 bg-rose-50 text-rose-900';
                        }
                      }
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setMcqAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                          className={`p-3 min-h-[44px] rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${stateClass}`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </button>
                      );
                    })}
                  </div>
                  {picked !== undefined && (
                    <div className="p-3.5 rounded-xl bg-blue-50 text-slate-800 text-xs sm:text-sm">
                      <span className="font-semibold text-blue-800">
                        {picked === q.correctIndex
                          ? (isHi ? 'सही उत्तर: ' : 'Correct: ')
                          : (isHi ? 'व्याख्या: ' : 'Explanation: ')}
                      </span>
                      {isHi ? q.explanationHi : q.explanationEn}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {innerTab === 'QA' && (
        <div className="space-y-4">
          {[...chapter.shortAnswers, ...chapter.longAnswers].length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">
                {isHi ? 'महत्वपूर्ण बोर्ड प्रश्न' : 'Key Practice Questions'}
              </h4>
              <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                {(isHi ? chapter.importantQuestionsHi : chapter.importantQuestionsEn).map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          ) : (
            [...chapter.shortAnswers, ...chapter.longAnswers].map((qa) => (
              <div key={qa.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
                <p className="text-xs text-blue-700 font-medium tabular-nums">
                  {qa.marks} {isHi ? 'अंक' : 'Marks'}
                </p>
                <h4 className="text-base font-semibold text-slate-900">
                  {isHi ? qa.questionHi : qa.questionEn}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {isHi ? qa.answerHi : qa.answerEn}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
