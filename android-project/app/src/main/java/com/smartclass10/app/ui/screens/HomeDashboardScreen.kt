package com.smartclass10.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.outlined.Circle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.smartclass10.app.model.*
import com.smartclass10.app.viewmodel.AppUiState

@Composable
fun HomeDashboardScreen(
    state: AppUiState,
    onSelectBoard: (Board) -> Unit,
    onToggleLanguage: () -> Unit,
    onContinueLearning: (Chapter) -> Unit,
    onOpenSubject: (SubjectType) -> Unit,
    onToggleTask: (String) -> Unit
) {
    val isHindi = state.language == AppLanguage.HINDI
    val continueChapter = state.chapters.firstOrNull { it.id == state.profile.lastChapterId }
        ?: state.chapters.firstOrNull()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = if (isHindi) "नमस्ते, ${state.profile.displayName}" else "Hello, ${state.profile.displayName}",
                        style = MaterialTheme.typography.headlineMedium
                    )
                    Text(
                        text = "${state.selectedBoard.code} · ${state.profile.academicYear} · ${state.profile.streakDays}d Streak",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                OutlinedButton(onClick = onToggleLanguage) {
                    Text(if (isHindi) "EN" else "हिन्दी")
                }
            }
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(Board.entries) { board ->
                    FilterChip(
                        selected = state.selectedBoard == board,
                        onClick = { onSelectBoard(board) },
                        label = { Text(if (isHindi) board.labelHi else board.labelEn) }
                    )
                }
            }
        }

        continueChapter?.let { ch ->
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = if (isHindi) "अध्ययन जारी रखें" else "Continue Learning",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.85f)
                        )
                        Text(
                            text = if (isHindi) ch.titleHi else ch.titleEn,
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                        Text(
                            text = if (isHindi) ch.videoTitleHi else ch.videoTitleEn,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.9f)
                        )
                        Button(
                            onClick = { onContinueLearning(ch) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.surface,
                                contentColor = MaterialTheme.colorScheme.primary
                            )
                        ) {
                            Icon(Icons.Default.PlayArrow, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(if (isHindi) "क्लास शुरू करें" else "Resume Class")
                        }
                    }
                }
            }
        }

        item {
            Text(
                text = if (isHindi) "कक्षा 10 के विषय" else "Class 10 Subjects",
                style = MaterialTheme.typography.titleLarge
            )
        }

        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                SubjectType.entries.chunked(2).forEach { pair ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        pair.forEach { subject ->
                            Card(
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { onOpenSubject(subject) },
                                shape = RoundedCornerShape(14.dp),
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text(
                                        text = if (isHindi) subject.titleHi else subject.titleEn,
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "${state.selectedBoard.code} Syllabus",
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        item {
            Text(
                text = if (isHindi) "दैनिक अध्ययन समय-सारणी" else "Daily Study Schedule",
                style = MaterialTheme.typography.titleLarge
            )
        }

        items(state.dailySchedule) { task ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onToggleTask(task.id) },
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (task.isDone) Icons.Filled.CheckCircle else Icons.Outlined.Circle,
                        contentDescription = null,
                        tint = if (task.isDone) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) task.titleHi else task.titleEn,
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "${task.timeSlot} · ${if (isHindi) task.subject.titleHi else task.subject.titleEn}",
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
            }
        }

        item {
            Text(
                text = if (isHindi) "नवीनतम बोर्ड अपडेट" else "Latest Board Updates",
                style = MaterialTheme.typography.titleLarge
            )
        }

        items(state.notifications) { notif ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = if (isHindi) notif.titleHi else notif.titleEn,
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isHindi) notif.bodyHi else notif.bodyEn,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }
    }
}
