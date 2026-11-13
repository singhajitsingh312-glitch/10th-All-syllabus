package com.smartclass10.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.smartclass10.app.model.AppLanguage
import com.smartclass10.app.model.Chapter
import com.smartclass10.app.model.SubjectType
import com.smartclass10.app.ui.screens.*
import com.smartclass10.app.ui.theme.SmartClass10Theme
import com.smartclass10.app.viewmodel.AppViewModel

enum class BottomNavTab { HOME, SYLLABUS, TESTS, DASHBOARD, ADMIN }

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SmartClass10Theme {
                SmartClass10RootApp()
            }
        }
    }
}

@Composable
fun SmartClass10RootApp(viewModel: AppViewModel = viewModel()) {
    val state by viewModel.uiState.collectAsState()
    var showAuth by remember { mutableStateOf(!state.isAuthenticated) }
    var currentTab by remember { mutableStateOf(BottomNavTab.HOME) }
    var selectedSubject by remember { mutableStateOf<SubjectType?>(null) }
    var activeChapter by remember { mutableStateOf<Chapter?>(null) }
    var videoChapter by remember { mutableStateOf<Chapter?>(null) }

    if (showAuth && !state.isAuthenticated) {
        AuthScreen(
            state = state,
            onSignIn = { email, pass ->
                viewModel.signIn(email, pass)
                showAuth = false
            },
            onRegister = { name, email, pass ->
                viewModel.register(name, email, pass)
                showAuth = false
            },
            onSelectBoard = viewModel::selectBoard,
            onToggleLanguage = viewModel::toggleLanguage,
            onContinueGuest = { showAuth = false }
        )
        return
    }

    videoChapter?.let { ch ->
        VideoPlayerScreen(
            chapter = ch,
            language = state.language,
            onBack = { videoChapter = null }
        )
        return
    }

    val isHindi = state.language == AppLanguage.HINDI

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = currentTab == BottomNavTab.HOME,
                    onClick = { activeChapter = null; currentTab = BottomNavTab.HOME },
                    icon = { Icon(Icons.Default.Home, contentDescription = null) },
                    label = { Text(if (isHindi) "होम" else "Home") }
                )
                NavigationBarItem(
                    selected = currentTab == BottomNavTab.SYLLABUS,
                    onClick = { activeChapter = null; currentTab = BottomNavTab.SYLLABUS },
                    icon = { Icon(Icons.Default.MenuBook, contentDescription = null) },
                    label = { Text(if (isHindi) "पाठ्यक्रम" else "Syllabus") }
                )
                NavigationBarItem(
                    selected = currentTab == BottomNavTab.TESTS,
                    onClick = { activeChapter = null; currentTab = BottomNavTab.TESTS },
                    icon = { Icon(Icons.Default.Assignment, contentDescription = null) },
                    label = { Text(if (isHindi) "टेस्ट" else "Tests") }
                )
                NavigationBarItem(
                    selected = currentTab == BottomNavTab.DASHBOARD,
                    onClick = { activeChapter = null; currentTab = BottomNavTab.DASHBOARD },
                    icon = { Icon(Icons.Default.Person, contentDescription = null) },
                    label = { Text(if (isHindi) "प्रगति" else "Progress") }
                )
                if (state.isAdmin) {
                    NavigationBarItem(
                        selected = currentTab == BottomNavTab.ADMIN,
                        onClick = { activeChapter = null; currentTab = BottomNavTab.ADMIN },
                        icon = { Icon(Icons.Default.AdminPanelSettings, contentDescription = null) },
                        label = { Text("Admin") }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            activeChapter?.let { ch ->
                ChapterDetailScreen(
                    chapter = ch,
                    state = state,
                    onBack = { activeChapter = null },
                    onOpenVideo = { videoChapter = it },
                    onMarkCompleted = viewModel::markChapterCompleted
                )
            } ?: when (currentTab) {
                BottomNavTab.HOME -> HomeDashboardScreen(
                    state = state,
                    onSelectBoard = viewModel::selectBoard,
                    onToggleLanguage = viewModel::toggleLanguage,
                    onContinueLearning = { activeChapter = it; currentTab = BottomNavTab.SYLLABUS },
                    onOpenSubject = { selectedSubject = it; currentTab = BottomNavTab.SYLLABUS },
                    onToggleTask = viewModel::toggleScheduleTask
                )
                BottomNavTab.SYLLABUS -> SyllabusScreen(
                    state = state,
                    initialSubject = selectedSubject,
                    onSelectChapter = { activeChapter = it }
                )
                BottomNavTab.TESTS -> TestSeriesScreen(
                    state = state,
                    onStartTest = viewModel::startTest,
                    onSelectOption = viewModel::selectOption,
                    onSubmitTest = viewModel::submitActiveTest,
                    onCloseTest = viewModel::closeTest
                )
                BottomNavTab.DASHBOARD -> StudentDashboardScreen(
                    state = state,
                    onSignOut = {
                        viewModel.signOut()
                        showAuth = true
                    }
                )
                BottomNavTab.ADMIN -> AdminPanelScreen(
                    state = state,
                    onAddChapter = viewModel::adminAddChapter,
                    onSendNotification = viewModel::adminSendNotification
                )
            }
        }
    }
}
