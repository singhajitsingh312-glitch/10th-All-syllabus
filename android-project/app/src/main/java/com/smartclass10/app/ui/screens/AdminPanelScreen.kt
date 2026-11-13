package com.smartclass10.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.smartclass10.app.model.*
import com.smartclass10.app.viewmodel.AppUiState

@Composable
fun AdminPanelScreen(
    state: AppUiState,
    onAddChapter: (Chapter) -> Unit,
    onSendNotification: (AppNotification) -> Unit
) {
    var titleEn by remember { mutableStateOf("") }
    var titleHi by remember { mutableStateOf("") }
    var videoUrl by remember { mutableStateOf("") }
    var pdfUrl by remember { mutableStateOf("") }
    var notifTitle by remember { mutableStateOf("") }
    var notifBody by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("Admin Panel", style = MaterialTheme.typography.headlineMedium)

        Card {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Add Chapter / Upload Video & PDF", style = MaterialTheme.typography.titleMedium)
                OutlinedTextField(value = titleEn, onValueChange = { titleEn = it }, label = { Text("Chapter Title (English)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = titleHi, onValueChange = { titleHi = it }, label = { Text("Chapter Title (Hindi)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = videoUrl, onValueChange = { videoUrl = it }, label = { Text("Video Lecture URL") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = pdfUrl, onValueChange = { pdfUrl = it }, label = { Text("Firebase Storage PDF URL") }, modifier = Modifier.fillMaxWidth())
                Button(
                    onClick = {
                        if (titleEn.isNotBlank()) {
                            onAddChapter(
                                Chapter(
                                    id = "ch_${System.currentTimeMillis()}",
                                    board = state.selectedBoard,
                                    subject = SubjectType.SCIENCE,
                                    chapterNumber = state.chapters.size + 1,
                                    titleEn = titleEn,
                                    titleHi = titleHi.ifBlank { titleEn },
                                    summaryEn = "Uploaded by Admin.",
                                    summaryHi = "एडमिन द्वारा जोड़ा गया अध्याय।",
                                    videoTitleEn = titleEn,
                                    videoTitleHi = titleHi.ifBlank { titleEn },
                                    videoUrl = videoUrl,
                                    pdfUrl = pdfUrl
                                )
                            )
                            titleEn = ""
                            titleHi = ""
                            videoUrl = ""
                            pdfUrl = ""
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Save Chapter to Firestore")
                }
            }
        }

        Card {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Send Board Notification (FCM)", style = MaterialTheme.typography.titleMedium)
                OutlinedTextField(value = notifTitle, onValueChange = { notifTitle = it }, label = { Text("Notification Title") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = notifBody, onValueChange = { notifBody = it }, label = { Text("Message Body") }, modifier = Modifier.fillMaxWidth())
                Button(
                    onClick = {
                        if (notifTitle.isNotBlank()) {
                            onSendNotification(
                                AppNotification(
                                    id = "notif_${System.currentTimeMillis()}",
                                    titleEn = notifTitle,
                                    titleHi = notifTitle,
                                    bodyEn = notifBody,
                                    bodyHi = notifBody,
                                    board = state.selectedBoard.code
                                )
                            )
                            notifTitle = ""
                            notifBody = ""
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Broadcast Notification")
                }
            }
        }
    }
}
