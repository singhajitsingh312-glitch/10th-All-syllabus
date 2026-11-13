import readmeMd from '../../android-project/README.md?raw';
import settingsGradle from '../../android-project/settings.gradle.kts?raw';
import rootBuildGradle from '../../android-project/build.gradle.kts?raw';
import gradleProps from '../../android-project/gradle.properties?raw';
import appBuildGradle from '../../android-project/app/build.gradle.kts?raw';
import manifestXml from '../../android-project/app/src/main/AndroidManifest.xml?raw';
import mainActivityKt from '../../android-project/app/src/main/java/com/smartclass10/app/MainActivity.kt?raw';
import themeKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/theme/Theme.kt?raw';
import modelsKt from '../../android-project/app/src/main/java/com/smartclass10/app/model/Models.kt?raw';
import firebaseRepoKt from '../../android-project/app/src/main/java/com/smartclass10/app/data/FirebaseRepository.kt?raw';
import fcmServiceKt from '../../android-project/app/src/main/java/com/smartclass10/app/fcm/SmartClassMessagingService.kt?raw';
import viewModelKt from '../../android-project/app/src/main/java/com/smartclass10/app/viewmodel/AppViewModel.kt?raw';
import authScreensKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/screens/AuthScreens.kt?raw';
import homeDashboardKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/screens/HomeDashboardScreen.kt?raw';
import syllabusScreenKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/screens/SyllabusAndChapterScreen.kt?raw';
import videoPlayerKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/screens/VideoPlayerScreen.kt?raw';
import testSeriesKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/screens/TestSeriesScreen.kt?raw';
import studentDashboardKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/screens/StudentDashboardScreen.kt?raw';
import adminPanelKt from '../../android-project/app/src/main/java/com/smartclass10/app/ui/screens/AdminPanelScreen.kt?raw';
import firestoreRules from '../../firestore.rules?raw';

export interface AndroidSourceFile {
  path: string;
  language: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  { path: 'README.md', language: 'markdown', content: readmeMd },
  { path: 'settings.gradle.kts', language: 'kotlin', content: settingsGradle },
  { path: 'build.gradle.kts', language: 'kotlin', content: rootBuildGradle },
  { path: 'gradle.properties', language: 'properties', content: gradleProps },
  { path: 'firestore.rules', language: 'javascript', content: firestoreRules },
  { path: 'app/build.gradle.kts', language: 'kotlin', content: appBuildGradle },
  { path: 'app/src/main/AndroidManifest.xml', language: 'xml', content: manifestXml },
  { path: 'app/src/main/java/com/smartclass10/app/MainActivity.kt', language: 'kotlin', content: mainActivityKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/theme/Theme.kt', language: 'kotlin', content: themeKt },
  { path: 'app/src/main/java/com/smartclass10/app/model/Models.kt', language: 'kotlin', content: modelsKt },
  { path: 'app/src/main/java/com/smartclass10/app/data/FirebaseRepository.kt', language: 'kotlin', content: firebaseRepoKt },
  { path: 'app/src/main/java/com/smartclass10/app/fcm/SmartClassMessagingService.kt', language: 'kotlin', content: fcmServiceKt },
  { path: 'app/src/main/java/com/smartclass10/app/viewmodel/AppViewModel.kt', language: 'kotlin', content: viewModelKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/screens/AuthScreens.kt', language: 'kotlin', content: authScreensKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/screens/HomeDashboardScreen.kt', language: 'kotlin', content: homeDashboardKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/screens/SyllabusAndChapterScreen.kt', language: 'kotlin', content: syllabusScreenKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/screens/VideoPlayerScreen.kt', language: 'kotlin', content: videoPlayerKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/screens/TestSeriesScreen.kt', language: 'kotlin', content: testSeriesKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/screens/StudentDashboardScreen.kt', language: 'kotlin', content: studentDashboardKt },
  { path: 'app/src/main/java/com/smartclass10/app/ui/screens/AdminPanelScreen.kt', language: 'kotlin', content: adminPanelKt }
];
