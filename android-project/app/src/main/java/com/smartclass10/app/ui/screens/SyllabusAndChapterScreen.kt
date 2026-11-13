package com.smartclass10.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.smartclass10.app.model.*
import com.smartclass10.app.viewmodel.AppUiState

@Composable
fun SyllabusScreen(
    state: AppUiState,
    initialSubject: SubjectType?,
    onSelectChapter: (Chapter) -> Unit
) {
    var selectedSubject by remember(initialSubject) { mutableStateOf(initialSubject ?: SubjectType.MATH) }
    val isHindi = state.language == AppLanguage.HINDI
    val filtered = state.chapters.filter {
        it.subject == selectedSubject && (it.board == state.selectedBoard || it.board == Board.CBSE)
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = if (isHindi) "${state.selectedBoard.labelHi} पाठ्यक्रम" else "${state.selectedBoard.labelEn} Syllabus",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(10.dp))

        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(SubjectType.entries) { subj ->
                FilterChip(
                    selected = selectedSubject == subj,
                    onClick = { selectedSubject = subj },
                    label = { Text(if (isHindi) subj.titleHi else subj.titleEn) }
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(filtered) { chapter ->
                val isCompleted = state.profile.completedChapters.contains(chapter.id)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectChapter(chapter) },
                    shape = RoundedCornerShape(14.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Ch ${chapter.chapterNumber} · ${chapter.videoDurationMin} min",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = if (isHindi) chapter.titleHi else chapter.titleEn,
                                style = MaterialTheme.typography.titleMedium
                            )
                            Text(
                                text = if (chapter.isPremium && !state.profile.isPremium) {
                                    if (isHindi) "प्रीमियम अध्याय" else "Premium Chapter"
                                } else {
                                    if (isHindi) "वीडियो · PDF नोट्स · प्रश्नोत्तर" else "Video · PDF Notes · Q&A"
                                },
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                        if (isCompleted) {
                            Icon(Icons.Filled.CheckCircle, contentDescription = "Completed", tint = MaterialTheme.colorScheme.primary)
                        } else if (chapter.isPremium && !state.profile.isPremium) {
                            Icon(Icons.Filled.Lock, contentDescription = "Premium", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            Icon(Icons.Filled.PlayCircle, contentDescription = "Open", tint = MaterialTheme.colorScheme.primary)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ChapterDetailScreen(
    chapter: Chapter,
    state: AppUiState,
    onBack: () -> Unit,
    onOpenVideo: (Chapter) -> Unit,
    onMarkCompleted: (String) -> Unit
) {
    val isHindi = state.language == AppLanguage.HINDI
    var activeTab by remember { mutableIntStateOf(0) }
    val tabs = if (isHindi) {
        listOf("सारांश", "नोट्स PDF", "MCQ", "लघु/दीर्घ प्रश्न")
    } else {
        listOf("Summary", "PDF Notes", "MCQs", "Important Q&A")
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = if (isHindi) chapter.titleHi else chapter.titleEn,
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "${chapter.board.code} · Ch ${chapter.chapterNumber}",
                    style = MaterialTheme.typography.bodySmall
                )
            }
            Button(onClick = { onMarkCompleted(chapter.id) }) {
                Text(if (isHindi) "पूर्ण करें" else "Complete")
            }
        }

        Card(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Row(
                modifier = Modifier.padding(14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = if (isHindi) chapter.videoTitleHi else chapter.videoTitleEn,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text("${chapter.videoDurationMin} min HD Lecture", style = MaterialTheme.typography.bodySmall)
                }
                Button(onClick = { onOpenVideo(chapter) }) {
                    Text(if (isHindi) "वीडियो देखें" else "Watch Video")
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        ScrollableTabRow(selectedTabIndex = activeTab) {
            tabs.forEachIndexed { index, label ->
                Tab(
                    selected = activeTab == index,
                    onClick = { activeTab = index },
                    text = { Text(label) }
                )
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            when (activeTab) {
                0 -> item {
                    Text(
                        text = if (isHindi) chapter.summaryHi else chapter.summaryEn,
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
                1 -> item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(
                                text = chapter.pdfTitleEn.ifBlank { "${chapter.titleEn} Revision Notes.pdf" },
                                style = MaterialTheme.typography.titleMedium
                            )
                            Text(
                                text = if (isHindi) "बोर्ड परीक्षा के लिए सूत्र और मुख्य बिंदु शामिल हैं।" else "Includes formulas, definitions, and solved board examples.",
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                }
                2 -> items(chapter.mcqs) { q ->
                    Card(border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(if (isHindi) q.questionHi else q.questionEn, style = MaterialTheme.typography.titleMedium)
                            val opts = if (isHindi) q.optionsHi else q.optionsEn
                            opts.forEachIndexed { idx, opt ->
                                Text(
                                    text = "${idx + 1}. $opt ${if (idx == q.correctIndex) "(Correct)" else ""}",
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                            Text(
                                text = if (isHindi) q.explanationHi else q.explanationEn,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
                3 -> {
                    items(chapter.shortAnswers + chapter.longAnswers) { qa ->
                        Card(border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(if (isHindi) qa.questionHi else qa.questionEn, style = MaterialTheme.typography.titleMedium)
                                Text(if (isHindi) qa.answerHi else qa.answerEn, style = MaterialTheme.typography.bodyMedium)
                            }
                        }
                    }
                }
            }
        }
    }
}
