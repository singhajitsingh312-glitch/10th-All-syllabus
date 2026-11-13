export type BoardId = 'CBSE' | 'BIHAR' | 'UP' | 'MP' | 'ICSE';
export type Language = 'en' | 'hi';
export type SubjectId = 'MATH' | 'SCIENCE' | 'SST' | 'HINDI' | 'ENGLISH' | 'SANSKRIT';
export type TestCategory = 'CHAPTER' | 'SUBJECT' | 'WEEKLY' | 'MONTHLY' | 'FULL' | 'BOARD_MOCK';
export type AppTab = 'HOME' | 'SYLLABUS' | 'TESTS' | 'PROGRESS' | 'ADMIN' | 'ANDROID';

export interface QaItem {
  id: string;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  marks: number;
}

export interface McqQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
  topicTag: string;
  questionType?: 'MCQ' | 'DESCRIPTIVE';
  modelAnswerEn?: string;
  modelAnswerHi?: string;
}

export interface VideoTopicTimestamp {
  timeLabel: string;
  seconds: number;
  titleEn: string;
  titleHi: string;
}

export interface Chapter {
  id: string;
  board: BoardId;
  subject: SubjectId;
  chapterNumber: number;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  keyFormulas: string[];
  isPremium: boolean;
  videoTitleEn: string;
  videoTitleHi: string;
  videoUrl: string;
  videoDurationMin: number;
  videoTopics: VideoTopicTimestamp[];
  pdfTitleEn: string;
  pdfTitleHi: string;
  pdfUrl?: string;
  importantQuestionsEn: string[];
  importantQuestionsHi: string[];
  mcqs: McqQuestion[];
  shortAnswers: QaItem[];
  longAnswers: QaItem[];
}

export interface TestSeries {
  id: string;
  board: BoardId;
  category: TestCategory;
  subject: SubjectId | 'ALL';
  titleEn: string;
  titleHi: string;
  durationMinutes: number;
  isPremium: boolean;
  questions: McqQuestion[];
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  board: BoardId;
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  weakTopics: string[];
  submittedAt: string;
}

export interface StudyTask {
  id: string;
  timeSlot: string;
  titleEn: string;
  titleHi: string;
  subject: SubjectId;
  isDone: boolean;
}

export interface AppNotification {
  id: string;
  titleEn: string;
  titleHi: string;
  bodyEn: string;
  bodyHi: string;
  board: BoardId | 'ALL';
  createdAt: string;
}

export interface PyqPaper {
  id: string;
  board: BoardId;
  subject: SubjectId;
  year: number;
  titleEn: string;
  titleHi: string;
  isPremium: boolean;
  questionsCount: number;
}

export interface LiveClassSession {
  id: string;
  board: BoardId | 'ALL';
  subject: SubjectId;
  titleEn: string;
  titleHi: string;
  teacher: string;
  scheduleTime: string;
  isLiveNow: boolean;
}

export interface StudentProfile {
  uid: string;
  displayName: string;
  email?: string;
  board: BoardId;
  language: Language;
  academicYear: string;
  isPremium: boolean;
  streakDays: number;
  completedChapters: string[];
  weakTopics: string[];
  lastChapterId: string;
}

export interface VideoProgressEntry {
  chapterId: string;
  watchedSeconds: number;
  totalSeconds: number;
  updatedAt: string;
}
