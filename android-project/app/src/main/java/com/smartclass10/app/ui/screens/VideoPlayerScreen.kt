package com.smartclass10.app.ui.screens

import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import com.smartclass10.app.model.AppLanguage
import com.smartclass10.app.model.Chapter

@Composable
fun VideoPlayerScreen(
    chapter: Chapter,
    language: AppLanguage,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    var selectedQuality by remember { mutableStateOf("720p") }
    var playbackSpeed by remember { mutableFloatStateOf(1.0f) }

    val exoPlayer = remember(chapter.videoUrl) {
        ExoPlayer.Builder(context).build().apply {
            val mediaItem = MediaItem.fromUri(
                Uri.parse(
                    chapter.videoUrl.ifBlank {
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    }
                )
            )
            setMediaItem(mediaItem)
            prepare()
            playWhenReady = true
        }
    }

    DisposableEffect(exoPlayer) {
        onDispose { exoPlayer.release() }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Text(
                text = if (language == AppLanguage.HINDI) chapter.videoTitleHi else chapter.videoTitleEn,
                style = MaterialTheme.typography.titleMedium
            )
        }

        AndroidView(
            factory = { ctx ->
                PlayerView(ctx).apply {
                    player = exoPlayer
                    useController = true
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
        )

        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = if (language == AppLanguage.HINDI) "वीडियो गुणवत्ता चुनें" else "Video Quality",
                style = MaterialTheme.typography.titleMedium
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("360p", "720p", "1080p").forEach { quality ->
                    FilterChip(
                        selected = selectedQuality == quality,
                        onClick = { selectedQuality = quality },
                        label = { Text(quality) }
                    )
                }
            }

            Text(
                text = if (language == AppLanguage.HINDI) "प्लेबैक गति" else "Playback Speed",
                style = MaterialTheme.typography.titleMedium
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(1.0f, 1.25f, 1.5f, 2.0f).forEach { speed ->
                    FilterChip(
                        selected = playbackSpeed == speed,
                        onClick = {
                            playbackSpeed = speed
                            exoPlayer.setPlaybackSpeed(speed)
                        },
                        label = { Text("${speed}x") }
                    )
                }
            }
        }
    }
}
