package com.smartclass10.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.smartclass10.app.model.AppLanguage
import com.smartclass10.app.model.TestSeries
import com.smartclass10.app.viewmodel.AppUiState

@Composable
fun TestSeriesScreen(
    state: AppUiState,
    onStartTest: (TestSeries) -> Unit,
    onSelectOption: (String, Int) -> Unit,
    onSubmitTest: () -> Unit,
    onCloseTest: () -> Unit
) {
    val isHindi = state.language == AppLanguage.HINDI
    val activeTest = state.activeTest
    val result = state.activeTestResult

    if (activeTest != null && result != null) {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = if (isHindi) "परीक्षा परिणाम" else "Test Result",
                style = MaterialTheme.typography.headlineMedium
            )
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("${result.score} / ${result.totalQuestions}", style = MaterialTheme.typography.headlineMedium, color = MaterialTheme.colorScheme.primary)
                    Text("${if (isHindi) "लिया गया समय" else "Time Taken"}: ${result.durationSeconds}s")
                }
            }
            LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(activeTest.questions) { q ->
                    val picked = state.selectedAnswers[q.id]
                    val isCorrect = picked == q.correctIndex
                    Card(border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(if (isHindi) q.questionHi else q.questionEn, style = MaterialTheme.typography.titleMedium)
                            Text(
                                text = if (isCorrect) "Correct" else "Incorrect",
                                color = if (isCorrect) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
                            )
                            Text(if (isHindi) q.explanationHi else q.explanationEn, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
            Button(onClick = onCloseTest, modifier = Modifier.fillMaxWidth()) {
                Text(if (isHindi) "टेस्ट सूची पर लौटें" else "Back to Test Series")
            }
        }
        return
    }

    if (activeTest != null) {
        val mins = state.testRemainingSeconds / 60
        val secs = state.testRemainingSeconds % 60
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(if (isHindi) activeTest.titleHi else activeTest.titleEn, style = MaterialTheme.typography.titleLarge)
                Text(String.format("%02d:%02d", mins, secs), style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary)
            }
            Spacer(modifier = Modifier.height(12.dp))
            LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(activeTest.questions) { q ->
                    val opts = if (isHindi) q.optionsHi else q.optionsEn
                    val picked = state.selectedAnswers[q.id]
                    Card(border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(if (isHindi) q.questionHi else q.questionEn, style = MaterialTheme.typography.titleMedium)
                            opts.forEachIndexed { idx, opt ->
                                Row(
                                    modifier = Modifier.fillMaxWidth().clickable { onSelectOption(q.id, idx) },
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    RadioButton(selected = picked == idx, onClick = { onSelectOption(q.id, idx) })
                                    Text(opt)
                                }
                            }
                        }
                    }
                }
            }
            Button(onClick = onSubmitTest, modifier = Modifier.fillMaxWidth().height(48.dp)) {
                Text(if (isHindi) "टेस्ट सबमिट करें" else "Submit Test")
            }
        }
        return
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = if (isHindi) "ऑनलाइन टेस्ट सीरीज़" else "Online Test Series",
                style = MaterialTheme.typography.headlineMedium
            )
        }
        items(state.tests) { test ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(if (isHindi) test.category.titleHi else test.category.titleEn, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary)
                        Text(if (isHindi) test.titleHi else test.titleEn, style = MaterialTheme.typography.titleMedium)
                        Text("${test.questions.size} Qs · ${test.durationMinutes} min", style = MaterialTheme.typography.bodySmall)
                    }
                    Button(onClick = { onStartTest(test) }) {
                        Text(if (isHindi) "शुरू करें" else "Start")
                    }
                }
            }
        }
    }
}
