package com.smartclass10.app.data

import android.net.Uri
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserProfileChangeRequest
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.storage.FirebaseStorage
import com.smartclass10.app.model.*
import kotlinx.coroutines.tasks.await

class FirebaseRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val db: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val storage: FirebaseStorage = FirebaseStorage.getInstance(),
    private val messaging: FirebaseMessaging = FirebaseMessaging.getInstance()
) {
    fun currentUid(): String? = auth.currentUser?.uid
    fun currentEmail(): String? = auth.currentUser?.email

    suspend fun signIn(email: String, password: String): Result<String> = runCatching {
        val result = auth.signInWithEmailAndPassword(email.trim(), password).await()
        result.user?.uid ?: error("User ID unavailable")
    }

    suspend fun register(
        name: String,
        email: String,
        password: String,
        board: Board,
        language: AppLanguage
    ): Result<StudentProfile> = runCatching {
        val result = auth.createUserWithEmailAndPassword(email.trim(), password).await()
        val user = result.user ?: error("Registration failed")
        user.updateProfile(UserProfileChangeRequest.Builder().setDisplayName(name).build()).await()

        val profileData = hashMapOf(
            "uid" to user.uid,
            "displayName" to name,
            "board" to board.code,
            "language" to language.code,
            "academicYear" to "2026-27",
            "isPremium" to false,
            "streakDays" to 1,
            "completedChapters" to emptyList<String>(),
            "weakTopics" to emptyList<String>(),
            "lastChapterId" to "",
            "createdAt" to FieldValue.serverTimestamp(),
            "updatedAt" to FieldValue.serverTimestamp()
        )
        db.collection("students").document(user.uid).set(profileData).await()
        db.collection("students").document(user.uid)
            .collection("private").document("info")
            .set(
                hashMapOf(
                    "uid" to user.uid,
                    "email" to email.trim(),
                    "updatedAt" to FieldValue.serverTimestamp()
                )
            ).await()

        messaging.subscribeToTopic("board_${board.code.lowercase()}").await()
        StudentProfile(
            uid = user.uid,
            displayName = name,
            board = board,
            language = language
        )
    }

    fun signOut() {
        auth.signOut()
    }

    suspend fun fetchStudentProfile(uid: String): StudentProfile? {
        val snap = db.collection("students").document(uid).get().await()
        if (!snap.exists()) return null
        return StudentProfile(
            uid = snap.getString("uid") ?: uid,
            displayName = snap.getString("displayName") ?: "Student",
            board = Board.entries.find { it.code == snap.getString("board") } ?: Board.CBSE,
            language = if (snap.getString("language") == "hi") AppLanguage.HINDI else AppLanguage.ENGLISH,
            academicYear = snap.getString("academicYear") ?: "2026-27",
            isPremium = snap.getBoolean("isPremium") ?: false,
            streakDays = (snap.getLong("streakDays") ?: 1L).toInt(),
            completedChapters = (snap.get("completedChapters") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            weakTopics = (snap.get("weakTopics") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            lastChapterId = snap.getString("lastChapterId") ?: ""
        )
    }

    suspend fun updateStudentProgress(
        uid: String,
        board: Board,
        language: AppLanguage,
        completedChapters: List<String>,
        weakTopics: List<String>,
        lastChapterId: String,
        streakDays: Int
    ) {
        db.collection("students").document(uid).update(
            mapOf(
                "board" to board.code,
                "language" to language.code,
                "completedChapters" to completedChapters,
                "weakTopics" to weakTopics,
                "lastChapterId" to lastChapterId,
                "streakDays" to streakDays,
                "updatedAt" to FieldValue.serverTimestamp()
            )
        ).await()
        messaging.subscribeToTopic("board_${board.code.lowercase()}")
    }

    suspend fun saveVideoProgress(uid: String, chapterId: String, watchedSec: Int, totalSec: Int) {
        val docId = "${uid}_$chapterId"
        db.collection("videoProgress").document(docId).set(
            mapOf(
                "userId" to uid,
                "chapterId" to chapterId,
                "watchedSeconds" to watchedSec,
                "totalSeconds" to totalSec.coerceAtLeast(1),
                "updatedAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    suspend fun submitTestAttempt(attempt: TestAttempt) {
        db.collection("testAttempts").document(attempt.id).set(
            mapOf(
                "id" to attempt.id,
                "userId" to attempt.userId,
                "testId" to attempt.testId,
                "testTitle" to attempt.testTitle,
                "board" to attempt.board.code,
                "score" to attempt.score,
                "totalQuestions" to attempt.totalQuestions,
                "durationSeconds" to attempt.durationSeconds,
                "weakTopics" to attempt.weakTopics,
                "submittedAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    suspend fun fetchTestAttempts(uid: String): List<TestAttempt> {
        val snap = db.collection("testAttempts")
            .whereEqualTo("userId", uid)
            .orderBy("submittedAt", Query.Direction.DESCENDING)
            .get().await()
        return snap.documents.map { doc ->
            TestAttempt(
                id = doc.id,
                userId = doc.getString("userId") ?: uid,
                testId = doc.getString("testId") ?: "",
                testTitle = doc.getString("testTitle") ?: "",
                board = Board.entries.find { it.code == doc.getString("board") } ?: Board.CBSE,
                score = (doc.getLong("score") ?: 0L).toInt(),
                totalQuestions = (doc.getLong("totalQuestions") ?: 1L).toInt(),
                durationSeconds = (doc.getLong("durationSeconds") ?: 0L).toInt(),
                weakTopics = (doc.get("weakTopics") as? List<*>)?.filterIsInstance<String>() ?: emptyList()
            )
        }
    }

    suspend fun fetchNotifications(): List<AppNotification> {
        val snap = db.collection("notifications")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(20)
            .get().await()
        return snap.documents.map { doc ->
            AppNotification(
                id = doc.id,
                titleEn = doc.getString("titleEn") ?: "",
                titleHi = doc.getString("titleHi") ?: "",
                bodyEn = doc.getString("bodyEn") ?: "",
                bodyHi = doc.getString("bodyHi") ?: "",
                board = doc.getString("board") ?: "ALL"
            )
        }
    }

    // --- Admin Operations ---
    suspend fun uploadPdfOrVideoToStorage(folder: String, fileName: String, fileUri: Uri): String {
        val ref = storage.reference.child("$folder/$fileName")
        ref.putFile(fileUri).await()
        return ref.downloadUrl.await().toString()
    }

    suspend fun adminSaveChapter(chapter: Chapter) {
        db.collection("chapters").document(chapter.id).set(
            mapOf(
                "id" to chapter.id,
                "board" to chapter.board.code,
                "subject" to chapter.subject.code,
                "chapterNumber" to chapter.chapterNumber,
                "titleEn" to chapter.titleEn,
                "titleHi" to chapter.titleHi,
                "summaryEn" to chapter.summaryEn,
                "summaryHi" to chapter.summaryHi,
                "isPremium" to chapter.isPremium,
                "videoUrl" to chapter.videoUrl,
                "pdfUrl" to chapter.pdfUrl,
                "updatedAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    suspend fun adminSendNotification(notification: AppNotification) {
        db.collection("notifications").document(notification.id).set(
            mapOf(
                "id" to notification.id,
                "titleEn" to notification.titleEn,
                "titleHi" to notification.titleHi,
                "bodyEn" to notification.bodyEn,
                "bodyHi" to notification.bodyHi,
                "board" to notification.board,
                "createdAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    suspend fun adminSetStudentPremium(studentUid: String, isPremium: Boolean) {
        db.collection("students").document(studentUid).update(
            mapOf(
                "isPremium" to isPremium,
                "updatedAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }
}
