package com.smartclass10.app.model

enum class Board(val code: String, val labelEn: String, val labelHi: String) {
    CBSE("CBSE", "CBSE Board", "सीबीएसई बोर्ड"),
    BIHAR("BIHAR", "Bihar Board (BSEB)", "बिहार बोर्ड"),
    UP("UP", "UP Board (UPMSP)", "यूपी बोर्ड"),
    MP("MP", "MP Board (MPBSE)", "एमपी बोर्ड"),
    ICSE("ICSE", "ICSE Board", "आईसीएसई बोर्ड")
}

enum class AppLanguage(val code: String, val displayName: String) {
    ENGLISH("en", "English"),
    HINDI("hi", "हिन्दी")
}

enum class SubjectType(val code: String, val titleEn: String, val titleHi: String) {
    MATH("MATH", "Mathematics", "गणित"),
    SCIENCE("SCIENCE", "Science", "विज्ञान"),
    SST("SST", "Social Science", "सामाजिक विज्ञान"),
    HINDI("HINDI", "Hindi", "हिन्दी"),
    ENGLISH("ENGLISH", "English", "अंग्रेज़ी"),
    SANSKRIT("SANSKRIT", "Sanskrit", "संस्कृत")
}

enum class TestCategory(val titleEn: String, val titleHi: String) {
    CHAPTER("Chapter-wise", "अध्याय-वार"),
    SUBJECT("Subject-wise", "विषय-वार"),
    WEEKLY("Weekly Test", "साप्ताहिक टेस्ट"),
    MONTHLY("Monthly Test", "मासिक टेस्ट"),
    FULL("Full Syllabus", "पूर्ण पाठ्यक्रम"),
    BOARD_MOCK("Board Exam Mock", "बोर्ड मॉडल पेपर")
}

data class StudentProfile(
    val uid: String = "",
    val displayName: String = "",
    val board: Board = Board.CBSE,
    val language: AppLanguage = AppLanguage.ENGLISH,
    val academicYear: String = "2026-27",
    val isPremium: Boolean = false,
    val streakDays: Int = 1,
    val completedChapters: List<String> = emptyList(),
    val weakTopics: List<String> = emptyList(),
    val lastChapterId: String = ""
)

data class QaItem(
    val questionEn: String = "",
    val questionHi: String = "",
    val answerEn: String = "",
    val answerHi: String = ""
)

data class McqQuestion(
    val id: String = "",
    val questionEn: String = "",
    val questionHi: String = "",
    val optionsEn: List<String> = emptyList(),
    val optionsHi: List<String> = emptyList(),
    val correctIndex: Int = 0,
    val explanationEn: String = "",
    val explanationHi: String = "",
    val topicTag: String = ""
)

data class Chapter(
    val id: String = "",
    val board: Board = Board.CBSE,
    val subject: SubjectType = SubjectType.MATH,
    val chapterNumber: Int = 1,
    val titleEn: String = "",
    val titleHi: String = "",
    val summaryEn: String = "",
    val summaryHi: String = "",
    val isPremium: Boolean = false,
    val videoTitleEn: String = "",
    val videoTitleHi: String = "",
    val videoUrl: String = "",
    val videoDurationMin: Int = 25,
    val pdfTitleEn: String = "",
    val pdfUrl: String = "",
    val mcqs: List<McqQuestion> = emptyList(),
    val shortAnswers: List<QaItem> = emptyList(),
    val longAnswers: List<QaItem> = emptyList()
)

data class TestSeries(
    val id: String = "",
    val board: Board = Board.CBSE,
    val category: TestCategory = TestCategory.CHAPTER,
    val subject: SubjectType? = null,
    val titleEn: String = "",
    val titleHi: String = "",
    val durationMinutes: Int = 20,
    val isPremium: Boolean = false,
    val questions: List<McqQuestion> = emptyList()
)

data class TestAttempt(
    val id: String = "",
    val userId: String = "",
    val testId: String = "",
    val testTitle: String = "",
    val board: Board = Board.CBSE,
    val score: Int = 0,
    val totalQuestions: Int = 0,
    val durationSeconds: Int = 0,
    val weakTopics: List<String> = emptyList()
)

data class StudyTask(
    val id: String,
    val timeSlot: String,
    val titleEn: String,
    val titleHi: String,
    val subject: SubjectType,
    val isDone: Boolean = false
)

data class AppNotification(
    val id: String = "",
    val titleEn: String = "",
    val titleHi: String = "",
    val bodyEn: String = "",
    val bodyHi: String = "",
    val board: String = "ALL"
)
