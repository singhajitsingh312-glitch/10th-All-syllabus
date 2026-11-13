package com.smartclass10.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.smartclass10.app.model.AppLanguage
import com.smartclass10.app.model.Board
import com.smartclass10.app.viewmodel.AppUiState

@Composable
fun AuthScreen(
    state: AppUiState,
    onSignIn: (String, String) -> Unit,
    onRegister: (String, String, String) -> Unit,
    onSelectBoard: (Board) -> Unit,
    onToggleLanguage: () -> Unit,
    onContinueGuest: () -> Unit
) {
    var isRegisterMode by remember { mutableStateOf(false) }
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val isHindi = state.language == AppLanguage.HINDI

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            text = "Smart Class 10",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = if (isHindi) "कक्षा 10 बोर्ड परीक्षा की संपूर्ण तैयारी" else "Complete Class 10 Board Exam Preparation",
            style = MaterialTheme.typography.bodyMedium
        )
        Spacer(modifier = Modifier.height(20.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = onToggleLanguage) {
                Text(if (isHindi) "Switch to English" else "हिन्दी में बदलें")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = if (isRegisterMode) {
                        if (isHindi) "नया छात्र खाता बनाएं" else "Create Student Account"
                    } else {
                        if (isHindi) "छात्र लॉगिन" else "Student Sign In"
                    },
                    style = MaterialTheme.typography.titleLarge
                )

                Text(
                    text = if (isHindi) "अपना बोर्ड चुनें:" else "Select Your Board:",
                    style = MaterialTheme.typography.labelMedium
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Board.entries.take(3).forEach { board ->
                        FilterChip(
                            selected = state.selectedBoard == board,
                            onClick = { onSelectBoard(board) },
                            label = { Text(board.code) }
                        )
                    }
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Board.entries.drop(3).forEach { board ->
                        FilterChip(
                            selected = state.selectedBoard == board,
                            onClick = { onSelectBoard(board) },
                            label = { Text(board.code) }
                        )
                    }
                }

                if (isRegisterMode) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text(if (isHindi) "पूरा नाम" else "Full Name") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text(if (isHindi) "ईमेल पता" else "Email Address") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text(if (isHindi) "पासवर्ड" else "Password") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                state.errorMessage?.let { err ->
                    Text(text = err, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }

                Button(
                    onClick = {
                        if (isRegisterMode) onRegister(name, email, password) else onSignIn(email, password)
                    },
                    enabled = !state.isLoading && email.isNotBlank() && password.length >= 6,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = if (isRegisterMode) {
                            if (isHindi) "रजिस्टर करें" else "Register Now"
                        } else {
                            if (isHindi) "लॉगिन करें" else "Sign In"
                        },
                        fontWeight = FontWeight.SemiBold
                    )
                }

                TextButton(
                    onClick = { isRegisterMode = !isRegisterMode },
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text(
                        if (isRegisterMode) {
                            if (isHindi) "पहले से खाता है? लॉगिन करें" else "Already registered? Sign In"
                        } else {
                            if (isHindi) "नए छात्र हैं? खाता बनाएं" else "New student? Create account"
                        }
                    )
                }

                HorizontalDivider()

                OutlinedButton(
                    onClick = onContinueGuest,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(if (isHindi) "डेमो छात्र के रूप में जारी रखें" else "Continue as Preview Student")
                }
            }
        }
    }
}
