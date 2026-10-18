# Bhumivera Website — Two-Page Product Overview

## Page 1 — What customers can do

Bhumivera is a botanical skincare storefront available as a responsive website and an Android app. The website works across phone, tablet, and desktop layouts. Customers can explore the home page, browse and search the product catalogue, open product details, compare items, and save products to a wishlist. Brand and information sections explain ingredients, product verification, impact, policies, and customer support.

### Shopping and accounts

Customers can create an account or sign in with email and password, request an email one-time code, or continue with Google on the website and Android app. Google sign-in verifies the identity token on the backend, requires acceptance of the Conditions of Use and Privacy Notice when creating a new account, and still requires an authenticator code when customer two-factor authentication is enabled. Password sign-in likewise asks for an authenticator code only when enabled. Passkeys are available in supported secure browsers; the installed Android WebView currently offers password and email-code sign-in instead. An account includes order history and tracking, saved addresses, wishlist, wallet and loyalty information, coupons, notifications, reviews, returns, and support. Product quantities and selected offers are held in the cart; signed-in cart additions and checkout validate live stock on the backend rather than trusting potentially stale catalogue data.

The checkout flow asks the customer to select a delivery address, review delivery and discount details, and choose an available payment method. Razorpay handles online payments. Wallet checkout uses the account balance. Cash on delivery is restricted by the server's delivery-history policy. A successful payment/order leads to the order confirmation and tracking flows; payment status is verified by the backend and provider callbacks.

### Delivery addresses, maps, and photos

Customers can save a delivery address to their signed-in account. They may enter the address manually or explicitly tap **Use Current Location**. On the web, the browser asks for location access over a secure origin. In the Android app, the native Geolocation plugin requests Android location permission only when the customer taps that action. If location is denied or unavailable, the address can still be entered manually.

Coordinates can produce a Google Maps link. The website also sends the selected coordinates to OpenStreetMap's Nominatim reverse-geocoding service to suggest street, city, state, and postal-code fields. Suggestions are not guaranteed to match a delivery address; customers should verify them before saving. Account addresses are stored through the authenticated Bhumivera API, not silently substituted with a local-only success when the API is unavailable. Guest address-book data, where used, is held in that browser's local storage and is not synced between devices.

For purchase reviews, the account offers **Take photo** and **Choose photos** controls using the platform's file/camera picker. Return evidence can be selected as image files. The app validates supported image formats and size before upload. Camera access is initiated through the operating system's picker flow; a direct in-app camera stream is not part of the current feature set.

## Page 2 — How the service is delivered

### Application structure

The storefront is a React single-page application built with Vite. Route-level pages are lazy-loaded, and shared components provide navigation, product cards, cart, account state, notifications, and support. Browser requests use the frontend API client to communicate with the Express backend. The backend owns customer authentication, address and order records, catalogue data, delivery policies, and payment workflows backed by MySQL and configured external providers.

The Android application packages the same production web bundle with Capacitor 8, rather than loading the storefront from a remote page. It supports Android 7 (API 24) and newer and targets API 36. Native integrations are added only where the application uses them, including Google sign-in, status-bar/keyboard behavior, app links, notifications, haptics, and on-demand location. Google OAuth must be configured in the owner's Google Cloud project with `https://www.bhumivera.com` as an authorized JavaScript origin and `https://www.bhumivera.com/` as an authorized redirect URI, as well as the Android package/signing fingerprints; the Play App Signing fingerprint differs from the debug fingerprint. Local development requires its own origin and redirect URI registration. A permission prompt is contextual: users are not asked for location merely by opening the app. Review-photo inputs hand capture/selection to the system UI; device-specific camera behavior still needs testing on a physical Android device.

### Installability and offline behavior

The website publishes a web app manifest and service worker. Supported browsers can install it as a home-screen app; iPhone and iPad installation is performed from Safari's **Add to Home Screen** action. The PWA can display the cached app shell and saved public catalogue data, but this is not a full offline store: account actions, current stock/prices, address synchronization, payment, and checkout require a live connection. A notice warns when displayed catalogue information may be stale.

The app can be built and checked from the frontend directory with `npm test`, `npm run lint`, and `npm run build`. Android packaging uses Node.js 22.12+ and Android Studio with SDK Platform/Build-Tools 36; the project uses Android Gradle Plugin 8.13.0 and Gradle 8.13. `npm run android:sync` prepares the native project, which is then built/tested through Android Studio or a connected device. The backend has its own test and deployment configuration. Build success and automated tests do not replace a signed release build, payment-provider test transaction, notification delivery test, or permission test on actual iPhone/Android hardware.

### Operational boundaries

Production operation depends on configured HTTPS frontend/API origins, database connectivity, and provider credentials held by the deployment owner. Razorpay keys and webhook secrets must remain server-side. Push delivery requires the Android Firebase configuration and provider setup. Before release, verify account sign-in, address create/update/delete, location denial/manual entry, payment success/failure/return, order tracking, photo upload, PWA installation/update, and device back/keyboard behavior on supported devices.

This overview describes the implementation and configured flows; it is not a claim that every route or third-party integration has been tested on every browser, device, production account, and payment configuration.
