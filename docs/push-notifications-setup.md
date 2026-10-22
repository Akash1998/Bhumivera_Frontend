# Android push notifications setup

This runbook configures Firebase Cloud Messaging (FCM) for Android. Android code and configuration stay with free Firebase and Google Play tooling; native Android code, plugin, manifest, or permission changes still require a new APK/AAB and store release.

## Firebase Cloud Messaging

1. In Firebase Console, create or select the production Firebase project. Add an **Android app** with package name `com.bhumivera.app`, enable the Firebase Cloud Messaging API (HTTP v1), and download that app's `google-services.json`.
2. Place the file at `Bhumivera_Frontend/android/app/google-services.json`. It is intentionally Git-ignored. Confirm its package name is exactly `com.bhumivera.app`.
3. In Firebase project settings, create a service account for the Firebase Admin SDK. Give its credentials to the backend deployment's **secret manager**, not to the frontend, repository, issue tracker, or chat:
   - `FIREBASE_PROJECT_ID`: Firebase project ID.
   - `FIREBASE_SERVICE_ACCOUNT_JSON`: service-account JSON stored as a secret; or configure `GOOGLE_APPLICATION_CREDENTIALS` to point to a securely mounted credentials file.
4. Native push is enabled automatically for builds when `android/app/google-services.json` exists. Set `VITE_FCM_ENABLED=false` only to explicitly disable it. Builds without the Android config keep native push disabled.
5. Deploy the updated backend with Firebase Admin credentials and the updated frontend/native app. Run the backend migrations on deployment if they are not run automatically. `user_device_tokens` is initialized on first registration.
6. Install the new Android build and sign in as a customer. The app offers the notification permission prompt during its first-run permission setup; customers may skip it and enable notifications later under **Profile → Notifications**. Verify the device token is registered and test by creating a personal notification.

Never send Firebase service-account JSON, private keys, passwords, or API keys in chat. If a credential has been committed or shared, revoke/rotate it in its provider console and replace it only in the relevant deployment secret store.

## Safe configuration checklist

- Do not commit `google-services.json` or Firebase Admin service-account credentials.
- Use the same Firebase project for the Android client config and backend Admin SDK.
- Keep the Firebase Admin SDK credentials only on the backend.
- Use the release signing key and Play App Signing fingerprints for Play releases; the locally generated debug APK is not a Play Store release.
- Confirm test devices receive a notification while the app is backgrounded and foregrounded, and verify denied permission, sign-out/sign-in, and token refresh behavior.
- There is no third-party OTA service configured. Website PWA updates continue through the service worker; Android app changes require a new signed release distributed through Google Play or direct installation.
