# Smart Class 10 — Android Studio Project (Kotlin + Jetpack Compose)

A complete Class 10 Board Exam Education Android Application supporting **CBSE, Bihar Board, UP Board, MP Board, and ICSE** in **Hindi and English**, powered by **Firebase Authentication, Cloud Firestore, Firebase Storage, Firebase Cloud Messaging (FCM), and Media3 ExoPlayer**.

## Project Structure

- `build.gradle.kts` / `settings.gradle.kts` — Root Gradle configuration (AGP 8.7+, Kotlin 2.0+, Google Services).
- `app/build.gradle.kts` — Jetpack Compose Material 3, Navigation Compose, Firebase BOM, Media3 ExoPlayer, Coil.
- `app/src/main/AndroidManifest.xml` — Permissions (`INTERNET`, `POST_NOTIFICATIONS`), `MainActivity`, and `SmartClassMessagingService`.
- `app/src/main/java/com/smartclass10/app/model/Models.kt` — Data classes for Boards, Subjects, Chapters, Videos, Questions, Tests, TestAttempts, PYQs, and Notifications.
- `app/src/main/java/com/smartclass10/app/data/FirebaseRepository.kt` — Auth, Firestore queries & mutations, Firebase Storage PDF/Video uploads, FCM topic subscriptions.
- `app/src/main/java/com/smartclass10/app/viewmodel/AppViewModel.kt` — StateFlow state management, timer engine, progress & streak computation.
- `app/src/main/java/com/smartclass10/app/ui/theme/Theme.kt` — Modern Blue & White Material 3 theme.
- `app/src/main/java/com/smartclass10/app/ui/screens/` — Auth, Home Dashboard, Syllabus & Chapter Studio, Media3 Video Player, Online Test Engine, Student Analytics, and Admin Panel.

## Setup & Installation Instructions

1. **Open in Android Studio**:
   - Launch Android Studio (Koala / Ladybug or newer).
   - Select **File > Open** and choose the `android-project/` folder.
2. **Connect Firebase**:
   - In the [Firebase Console](https://console.firebase.google.com/), open project **`flawless-infinity-tbcxw`** (or your own Firebase project).
   - Register an Android App with package name: **`com.smartclass10.app`**.
   - Download **`google-services.json`** and place it inside `android-project/app/google-services.json`.
   - Enable **Email/Password** and **Google Sign-In** in **Authentication > Sign-in method**.
   - Deploy `firestore.rules` from the repository root (`firebase deploy --only firestore:rules`).
   - Enable **Firebase Storage** and **Cloud Messaging**.
3. **Sync & Run**:
   - Click **Sync Project with Gradle Files**.
   - Select an Android Emulator (API 26+) or physical Android device (USB Debugging enabled).
   - Click **Run > Run 'app'** (or run `./gradlew assembleDebug` to generate `app/build/outputs/apk/debug/app-debug.apk`).
4. **Admin Access**:
   - Sign in with your configured admin account or add the admin UID to the `admins/{uid}` collection in Firestore to unlock chapter uploads, PDF uploads, test creation, student management, and FCM broadcasts.
