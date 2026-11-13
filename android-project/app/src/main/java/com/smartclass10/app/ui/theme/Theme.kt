package com.smartclass10.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val BrandCobalt = Color(0xFF1D4ED8)
val BrandSky = Color(0xFF2563EB)
val BrandSurfaceTint = Color(0xFFEFF6FF)
val CanvasWhite = Color(0xFFF8FAFC)
val CardWhite = Color(0xFFFFFFFF)
val InkPrimary = Color(0xFF0F172A)
val InkMuted = Color(0xFF475569)
val HairlineBorder = Color(0xFFE2E8F0)
val SemanticEmerald = Color(0xFF059669)
val SemanticAmber = Color(0xFFD97706)
val SemanticRose = Color(0xFFDC2626)

private val SmartClassLightColors = lightColorScheme(
    primary = BrandCobalt,
    onPrimary = Color.White,
    primaryContainer = BrandSurfaceTint,
    onPrimaryContainer = BrandCobalt,
    secondary = BrandSky,
    onSecondary = Color.White,
    background = CanvasWhite,
    onBackground = InkPrimary,
    surface = CardWhite,
    onSurface = InkPrimary,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = InkMuted,
    outline = HairlineBorder,
    error = SemanticRose
)

private val SmartClassTypography = Typography(
    headlineMedium = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 30.sp,
        color = InkPrimary
    ),
    titleLarge = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 24.sp,
        color = InkPrimary
    ),
    titleMedium = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp,
        color = InkPrimary
    ),
    bodyMedium = TextStyle(
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = InkMuted
    ),
    labelMedium = TextStyle(
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp
    )
)

@Composable
fun SmartClass10Theme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SmartClassLightColors,
        typography = SmartClassTypography,
        content = content
    )
}
