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

- Node.js supported by the installed Capacitor CLI
- Android Studio with an Android SDK and an Android device/emulator
- A configured `JAVA_HOME`/Android SDK environment when running Gradle outside Android Studio

From this directory:

```sh
npm install
npm run android:sync
npm run android:open
```

`android:sync` builds the web bundle into `dist` and copies it into the native project. In Android Studio, select a device and run the `app` configuration. To launch from the command line on a connected device, use `npm run android:run`.

The Android app targets Android API 36 and uses native status-bar and keyboard integration, native back navigation, haptics, geolocation, speech recognition, and push-notification plugins where supported. Location permission is requested only after a customer chooses **Use Current Location**. Review-photo capture and evidence selection use the operating system's file/camera picker; a native camera stream is not currently used. User-facing links can use the `bhumivera://` URI scheme. Verified HTTPS App Links require the app's release signing-certificate fingerprint to be published in the website's Digital Asset Links file before release.

## Release checklist

- Set up a Google Play Console application for `com.bhumivera.app`.
- Create and securely back up the release signing key; never commit signing credentials.
- Configure the production signing fingerprint for HTTPS App Links if those are needed.
- Configure Firebase Cloud Messaging credentials and validate push delivery if enabling push notifications.
- Build and test a signed Android App Bundle (`.aab`) on real Android devices, including checkout, payment return, authentication, notification permission, camera permission, back navigation, and offline behavior.
- Verify that the deployed backend's allowed origins include the native app's WebView origin and that production API endpoints use HTTPS.

Capacitor supplies the Android project under `android/`; generated Gradle outputs and machine-local SDK paths are ignored by Git. App Store publishing credentials and production deployment access are owner-managed.
