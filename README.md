# Bhumivera storefront

The customer website and Android app share this React/Vite codebase and the same backend API. The Android app packages the production-built storefront with Capacitor; it does not use a remote website URL as its screen. The admin dashboard remains web-only.

## Website

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
```

The production website registers `public/sw.js`. It caches the app shell and static assets, and IndexedDB keeps a bounded set of public product-list/detail responses. Saved catalog content is informational and can be stale; cart/account writes, live inventory checks, and checkout are not cached or queued for later.

### Install from a browser

- On supported Android browsers, open the site over HTTPS, open the mobile navigation menu, and choose **Install Bhumivera** when the browser offers installation.
- On iPhone or iPad, open the site in Safari, open the Share menu, choose **Add to Home Screen**, then confirm with **Add**.
- Browser-installed apps still use web platform capabilities. Checkout, account actions, notifications, and some device integrations may behave differently from a native application; offline support is limited to the app shell and previously saved public catalog details.

## Android development

Requirements:

- Node.js 22.12 or newer (Node.js 24 LTS recommended)
- Current stable Android Studio; its bundled JetBrains Runtime (JBR) is sufficient for Gradle
- Android SDK Platform 36, Android SDK Build-Tools 36, Platform-Tools, and Android SDK Command-line Tools
- An Android 7/API 24 or newer emulator image or physical device for testing

From this directory:

```sh
npm install
npm run android:sync
npm run android:open
```

`android:sync` generates app assets, builds the web bundle into `dist`, and syncs native plugins. In Android Studio, select a device and run the `app` configuration. To launch from the command line on a connected device, use `npm run android:run`. The native project uses Android Gradle Plugin 8.13.0 and Gradle 8.13.

The Android app supports Android API 24+ (Android 7+) and targets API 36. Responsive web layouts adapt to phone and tablet sizes; device coverage still requires validation on real hardware. When running Gradle from a terminal rather than Android Studio, set `JAVA_HOME` to Android Studio's bundled `jbr` directory and `ANDROID_SDK_ROOT` to the SDK directory. The app uses native status-bar and keyboard integration, native back navigation, haptics, geolocation, speech recognition, and push-notification plugins where supported. Native customers must sign in before entering the app. On first sign-in, a permission screen explains location and (when Firebase is configured) notification access; the customer can allow or skip either. Android may grant approximate rather than precise location. Push permission and delivery require the Firebase setup described in [the push notification runbook](./docs/push-notifications-setup.md). Review-photo capture and evidence selection use the operating system's file/camera picker; a native camera stream is not currently used. User-facing links can use the `bhumivera://` URI scheme. Verified HTTPS App Links require the app's release signing-certificate fingerprint to be published in the website's Digital Asset Links file before release.

To produce an installable debug APK after syncing, run `android\\gradlew.bat assembleDebug` from this directory. The APK is written to `android\\app\\build\\outputs\\apk\\debug\\app-debug.apk`. A Play Store release requires a separately configured signing key and release build. Android APKs cannot be installed on iPad; iPad's browser-installable PWA is available from Safari, while a native iPad app requires a separate iOS target and a macOS/Xcode build.

## Release checklist

- Set up a Google Play Console application for `com.bhumivera.app`.
- Create and securely back up the release signing key; never commit signing credentials.
- Configure the production signing fingerprint for HTTPS App Links if those are needed.
- Configure Firebase Cloud Messaging credentials and validate push delivery if enabling push notifications.
- Build and test a signed Android App Bundle (`.aab`) on real Android devices, including checkout, payment return, authentication, notification permission, camera permission, back navigation, and offline behavior.
- Verify that the deployed backend's allowed origins include the native app's WebView origin and that production API endpoints use HTTPS.

Capacitor supplies the Android project under `android/`; generated Gradle outputs and machine-local SDK paths are ignored by Git. App Store publishing credentials and production deployment access are owner-managed.
