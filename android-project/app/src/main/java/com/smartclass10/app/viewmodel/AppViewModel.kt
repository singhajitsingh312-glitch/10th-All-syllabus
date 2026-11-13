package com.smartclass10.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartclass10.app.data.FirebaseRepository
import com.smartclass10.app.model.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AppUiState(
    val isAuthenticated: Boolean = false,
    val isAdmin: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val profile: StudentProfile = StudentProfile(displayName = "Aarav Kumar"),
    val selectedBoard: Board = Board.CBSE,
    val language: AppLanguage = AppLanguage.ENGLISH,
    val chapters: List<Chapter> = defaultChapters(),
    val tests: List<TestSeries> = defaultTests(),
    val attempts: List<TestAttempt> = emptyList(),
    val notifications: List<AppNotification> = defaultNotifications(),
    val dailySchedule: List<StudyTask> = defaultSchedule(),
    val activeTest: TestSeries? = null,
    val testRemainingSeconds: Int = 0,
    val selectedAnswers: Map<String, Int> = emptyMap(),
    val activeTestResult: TestAttempt? = null
)

class AppViewModel(
    private val repository: FirebaseRepository = FirebaseRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(AppUiState())
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()
    private var timerJob: Job? = null

    init {
        repository.currentUid()?.let { uid ->
            loadUserData(uid)
        }
    }

    private fun loadUserData(uid: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val profile = repository.fetchStudentProfile(uid) ?: StudentProfile(uid = uid, displayName = "Student")
            val attempts = repository.fetchTestAttempts(uid)
            val notifications = repository.fetchNotifications().ifEmpty { defaultNotifications() }
            val isAdmin = repository.currentEmail() == "singhajitsingh312@gmail.com"
            _uiState.update {
                it.copy(
                    isAuthenticated = true,
                    isAdmin = isAdmin,
                    isLoading = false,
                    profile = profile,
                    selectedBoard = profile.board,
                    language = profile.language,
                    attempts = attempts,
                    notifications = notifications
                )
            }
        }
    }

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            repository.signIn(email, password)
                .onSuccess { uid -> loadUserData(uid) }
                .onFailure { err -> _uiState.update { it.copy(isLoading = false, errorMessage = err.message) } }
        }
    }

    fun register(name: String, email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val state = _uiState.value
            repository.register(name, email, password, state.selectedBoard, state.language)
                .onSuccess { profile ->
                    _uiState.update { it.copy(isAuthenticated = true, isLoading = false, profile = profile) }
                }
                .onFailure { err -> _uiState.update { it.copy(isLoading = false, errorMessage = err.message) } }
        }
    }

    fun signOut() {
        repository.signOut()
        _uiState.update { it.copy(isAuthenticated = false, isAdmin = false) }
    }

    fun selectBoard(board: Board) {
        _uiState.update { it.copy(selectedBoard = board, profile = it.profile.copy(board = board)) }
        syncProfile()
    }

    fun toggleLanguage() {
        val next = if (_uiState.value.language == AppLanguage.ENGLISH) AppLanguage.HINDI else AppLanguage.ENGLISH
        _uiState.update { it.copy(language = next, profile = it.profile.copy(language = next)) }
        syncProfile()
    }

    fun toggleScheduleTask(taskId: String) {
        _uiState.update { state ->
            state.copy(
                dailySchedule = state.dailySchedule.map { task ->
                    if (task.id == taskId) task.copy(isDone = !task.isDone) else task
                }
            )
        }
    }

    fun markChapterCompleted(chapterId: String) {
        _uiState.update { state ->
            val updated = (state.profile.completedChapters + chapterId).distinct()
            state.copy(
                profile = state.profile.copy(
                    completedChapters = updated,
                    lastChapterId = chapterId
                )
            )
        }
        syncProfile()
    }

    fun startTest(test: TestSeries) {
        timerJob?.cancel()
        _uiState.update {
            it.copy(
                activeTest = test,
                testRemainingSeconds = test.durationMinutes * 60,
                selectedAnswers = emptyMap(),
                activeTestResult = null
            )
        }
        timerJob = viewModelScope.launch {
            while (_uiState.value.testRemainingSeconds > 0 && _uiState.value.activeTest != null) {
                delay(1000)
                _uiState.update { it.copy(testRemainingSeconds = (it.testRemainingSeconds - 1).coerceAtLeast(0)) }
            }
            if (_uiState.value.activeTest != null && _uiState.value.activeTestResult == null) {
                submitActiveTest()
            }
        }
    }

    fun selectOption(questionId: String, optionIndex: Int) {
        _uiState.update {
            it.copy(selectedAnswers = it.selectedAnswers + (questionId to optionIndex))
        }
    }

    fun submitActiveTest() {
        timerJob?.cancel()
        val state = _uiState.value
        val test = state.activeTest ?: return
        var score = 0
        val weak = mutableSetOf<String>()

        test.questions.forEach { q ->
            val picked = state.selectedAnswers[q.id]
            if (picked == q.correctIndex) {
                score++
            } else if (q.topicTag.isNotBlank()) {
                weak.add(q.topicTag)
            }
        }

        val elapsed = (test.durationMinutes * 60) - state.testRemainingSeconds
        val attempt = TestAttempt(
            id = "att_${System.currentTimeMillis()}",
            userId = state.profile.uid.ifBlank { "local_student" },
            testId = test.id,
            testTitle = if (state.language == AppLanguage.HINDI) test.titleHi else test.titleEn,
            board = state.selectedBoard,
            score = score,
            totalQuestions = test.questions.size.coerceAtLeast(1),
            durationSeconds = elapsed,
            weakTopics = weak.toList()
        )

        _uiState.update {
            it.copy(
                activeTestResult = attempt,
                attempts = listOf(attempt) + it.attempts,
                profile = it.profile.copy(weakTopics = (it.profile.weakTopics + weak).distinct())
            )
        }

        if (state.isAuthenticated && state.profile.uid.isNotBlank()) {
            viewModelScope.launch {
                repository.submitTestAttempt(attempt)
            }
        }
    }

    fun closeTest() {
        timerJob?.cancel()
        _uiState.update { it.copy(activeTest = null, activeTestResult = null) }
    }

    fun adminAddChapter(chapter: Chapter) {
        _uiState.update { it.copy(chapters = listOf(chapter) + it.chapters) }
        if (_uiState.value.isAdmin) {
            viewModelScope.launch { repository.adminSaveChapter(chapter) }
        }
    }

    fun adminSendNotification(notification: AppNotification) {
        _uiState.update { it.copy(notifications = listOf(notification) + it.notifications) }
        if (_uiState.value.isAdmin) {
            viewModelScope.launch { repository.adminSendNotification(notification) }
        }
    }

    private fun syncProfile() {
        val state = _uiState.value
        if (state.isAuthenticated && state.profile.uid.isNotBlank()) {
            viewModelScope.launch {
                repository.updateStudentProgress(
                    uid = state.profile.uid,
                    board = state.selectedBoard,
                    language = state.language,
                    completedChapters = state.profile.completedChapters,
                    weakTopics = state.profile.weakTopics,
                    lastChapterId = state.profile.lastChapterId,
                    streakDays = state.profile.streakDays
                )
            }
        }
    }
}

private fun defaultSchedule(): List<StudyTask> = listOf(
    StudyTask("t1", "06:30 AM", "Real Numbers — Euclid's Lemma", "वास्तविक संख्याएँ — यूक्लिड प्रमेयिका", SubjectType.MATH, true),
    StudyTask("t2", "04:00 PM", "Chemical Reactions & Equations", "रासायनिक अभिक्रियाएँ एवं समीकरण", SubjectType.SCIENCE, false),
    StudyTask("t3", "06:30 PM", "Nationalism in India — Notes", "भारत में राष्ट्रवाद — मुख्य नोट्स", SubjectType.SST, false),
    StudyTask("t4", "08:30 PM", "Weekly MCQ Practice Test", "साप्ताहिक बहुविकल्पीय अभ्यास टेस्ट", SubjectType.MATH, false)
)

private fun defaultNotifications(): List<AppNotification> = listOf(
    AppNotification(
        id = "notif_1",
        titleEn = "Class 10 Board Model Paper 2026-27 Released",
        titleHi = "कक्षा 10 बोर्ड मॉडल पेपर 2026-27 जारी",
        bodyEn = "Updated Mathematics & Science blueprint with 30% competency-based MCQs.",
        bodyHi = "गणित और विज्ञान का नया ब्लूप्रिंट 30% बहुविकल्पीय प्रश्नों के साथ उपलब्ध है।",
        board = "ALL"
    )
)

private fun defaultChapters(): List<Chapter> = listOf(
    Chapter(
        id = "cbse_math_1",
        board = Board.CBSE,
        subject = SubjectType.MATH,
        chapterNumber = 1,
        titleEn = "Real Numbers",
        titleHi = "वास्तविक संख्याएँ",
        summaryEn = "Fundamental Theorem of Arithmetic, HCF & LCM using prime factorisation, and proofs of irrationality.",
        summaryHi = "अंकगणित की आधारभूत प्रमेय, अभाज्य गुणनखंड द्वारा HCF और LCM तथा अपरिमेयता की उपपत्ति।",
        isPremium = false,
        videoTitleEn = "Lecture 1: Fundamental Theorem of Arithmetic",
        videoTitleHi = "लेक्चर 1: अंकगणित की आधारभूत प्रमेय",
        videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        mcqs = listOf(
            McqQuestion(
                id = "q1",
                questionEn = "If HCF(26, 91) = 13, what is LCM(26, 91)?",
                questionHi = "यदि HCF(26, 91) = 13 है, तो LCM(26, 91) क्या होगा?",
                optionsEn = listOf("182", "169", "236", "91"),
                optionsHi = listOf("182", "169", "236", "91"),
                correctIndex = 0,
                explanationEn = "HCF × LCM = Product of numbers => 13 × LCM = 26 × 91 => LCM = 182.",
                explanationHi = "HCF × LCM = दोनों संख्याओं का गुणनफल => 13 × LCM = 26 × 91 => LCM = 182.",
                topicTag = "HCF & LCM"
            )
        )
    )
)

private fun defaultTests(): List<TestSeries> = listOf(
    TestSeries(
        id = "test_cbse_math_ch1",
        board = Board.CBSE,
        category = TestCategory.CHAPTER,
        subject = SubjectType.MATH,
        titleEn = "Real Numbers — Chapter Test",
        titleHi = "वास्तविक संख्याएँ — अध्याय टेस्ट",
        durationMinutes = 15,
        isPremium = false,
        questions = defaultChapters().first().mcqs
    )
)
