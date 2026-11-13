package com.smartclass10.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.smartclass10.app.model.AppLanguage
import com.smartclass10.app.viewmodel.AppUiState

@Composable
fun StudentDashboardScreen(
    state: AppUiState,
    onSignOut: () -> Unit
) {
    val isHindi = state.language == AppLanguage.HINDI

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                text = if (isHindi) "छात्र डैशबोर्ड" else "Student Dashboard",
                style = MaterialTheme.typography.headlineMedium
            )
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Card(modifier = Modifier.weight(1f), border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("${state.profile.completedChapters.size}", style = MaterialTheme.typography.headlineMedium, color = MaterialTheme.colorScheme.primary)
                        Text(if (isHindi) "पूर्ण अध्याय" else "Completed Chapters", style = MaterialTheme.typography.bodySmall)
                    }
                }
                Card(modifier = Modifier.weight(1f), border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("${state.profile.streakDays} Days", style = MaterialTheme.typography.headlineMedium, color = MaterialTheme.colorScheme.primary)
                        Text(if (isHindi) "अध्ययन स्ट्रीक" else "Study Streak", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }

        item {
            Text(
                text = if (isHindi) "कमज़ोर विषय (सुधार के लिए)" else "Weak Topics to Revise",
                style = MaterialTheme.typography.titleLarge
            )
        }

        if (state.profile.weakTopics.isEmpty()) {
            item {
                Text(if (isHindi) "अभी तक कोई कमज़ोर विषय नहीं मिला।" else "No weak topics flagged yet.", style = MaterialTheme.typography.bodyMedium)
            }
        } else {
            items(state.profile.weakTopics) { topic ->
                Card(border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                    Text(text = topic, modifier = Modifier.padding(14.dp), style = MaterialTheme.typography.titleMedium)
                }
            }
        }

        item {
            Text(
                text = if (isHindi) "टेस्ट स्कोर इतिहास" else "Recent Test Scores",
                style = MaterialTheme.typography.titleLarge
            )
        }

        items(state.attempts) { attempt ->
            Card(border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(attempt.testTitle, style = MaterialTheme.typography.titleMedium)
                        Text("${attempt.board.code} · ${attempt.durationSeconds}s", style = MaterialTheme.typography.bodySmall)
                    }
                    Text("${attempt.score}/${attempt.totalQuestions}", style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.primary)
                }
            }
        }

        item {
            OutlinedButton(onClick = onSignOut, modifier = Modifier.fillMaxWidth()) {
                Text(if (isHindi) "लॉगआउट" else "Sign Out")
            }
        }
    }
}
