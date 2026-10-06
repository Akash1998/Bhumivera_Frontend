# Full Connectivity A-to-Z Upgrade — Specification

## 1. Overview & Intent

Broad full-stack hardening for **Bhumivera storefront (customer Website)** and **Admin Panel dashboard** with one explicit success criterion: **0 broken navigations, 0 method/path mismatches, 0 orphan pages, 100% of backend premium-auth endpoints consumed by matching Frontend UI.**

Scope covers:
- All `<Link to=...>`, `navigate(...)`, `<a href=...>` internal path resolution (Frontend React Router v6).
- Every `api.js` exported wrapper's **METHOD + PATH** must match the actual Backend route contract (`Bhumivera_Backend/routes/userRoutes.js`, `authRoutes.js`).
- Every orphan component page on disk (31 `src/pages/*.jsx` files + 23 `src/pages/admin/*.jsx` files) must be reachable via App.jsx Route entry OR admin `TAB_COMPONENTS` + `menuSections`, OR (if confirmed dead) explicitly deleted.
- All 8 new premium-auth reset/forgot Backend endpoints (applied in prior `deep-scan-pending-upgrades` T5+T8) must have matching Frontend pages, routes, api wrappers, and 3-step UI flows (email → OTP → new password) with backward-compat for legacy body paths.
- Frontend password validators aligned to Backend NIST SP 800-63B policy: MIN_LENGTH=12, 3/4 character classes, and the 6 fatal server error codes surfaced to users (MIN_LENGTH / MAX_LENGTH / COMPLEXITY / COMMON_PASSWORD / PWNED_PASSWORD / PASSWORD_REUSED).
- HTTP 423 ACCOUNT_LOCKED error handling branches added to Login + AdminLogin forms with secondsRemaining countdown dialog.

---

## 2. Context & Verbatim Preconditions

### Working directories
- Backend: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend`
- Frontend: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend`

### Backend endpoints already applied (must NOT be modified; Frontend only consumes)
| Method | Path | Source | Purpose |
|---|---|---|---|
| POST | `/auth/forgot-password` | authRoutes L265 | Customer: send reset OTP |
| POST | `/auth/verify-otp` | authRoutes L295 | Legacy: verify old OTP (backward compat) |
| POST | `/auth/verify-reset-otp` | authRoutes L660 | Customer: verify new reset OTP → returns `{resetJwt}` |
| POST | `/auth/security-question/verify-for-reset` | authRoutes L682 | Customer: verify security answer → returns `{resetJwt}` |
| POST | `/auth/reset-password` | authRoutes L310 | Customer: dual-path (Bearer resetJwt PREFERRED, legacy body fallback) |
| POST | `/auth/admin/forgot-password` | authRoutes L705 | Admin: send reset OTP |
| POST | `/auth/admin/verify-reset-otp` | authRoutes L731 | Admin: verify OTP → returns `{resetJwt}` |
| POST | `/auth/admin/reset-password` | authRoutes L752 | Admin: Bearer resetJwt + policy pipeline |
| POST | `/users/change-password` | userRoutes L98 | Logged-in user: POST (not PUT!) with current+new password |

### Reset JWT shape (must match, never persist in localStorage):
`{ sub, email, aud:'reset', scope:'reset-password', role }` — expiresIn `5m`.

### Rate limiters (already mounted, must NOT modify):
8 exports in `middleware/rateLimiter.js`: `loginLimiter, otpLimiter, registerLimiter, forgotLimiter, magicLinkLimiter, googleCallbackLimiter, adminStrictLimiter, challengeLimiter`.

### Password policy backend error codes (Frontend must display verbatim):
`MISSING_FIELDS`, `MIN_LENGTH`, `MAX_LENGTH`, `COMPLEXITY`, `COMMON_PASSWORD`, `PWNED_PASSWORD`, `PASSWORD_REUSED`.

### Lockout backend response (HTTP 423):
```json
{ "code": "ACCOUNT_LOCKED", "message": "...", "secondsRemaining": <number> }
```

---

## 3. Rules & Rubrics (Acceptance Criteria)

### RULE ROUTES — Orphan pages & route completeness
**Intent**: Every existing page on disk has a matching Route entry in App.jsx; all param-route patterns (orderId) match navigate() calls.

| ID | Statement | Severity |
|---|---|---|
| ROUTES-1 | Add App.jsx lazy imports + Route entries for 4 existing orphan pages: FlashSales (`/flash-sales`), SomaticRegistry (`/somatic-registry`), ProvenanceEngine (`/provenance-engine`), SpinRegistration (`/spin-registration`). All public (no guard) except where component requires auth. | Critical |
| ROUTES-2 | Add App.jsx lazy imports + Route entries for 3 new premium-auth pages: ForgotPassword (`/forgot-password` public), ResetPassword (`/reset-password` public), AdminForgotPassword (`/admin/forgot-password` public). | Critical |
| ROUTES-3 | Add optional-param Route variant `/order-success/:orderId?` (guarded ProtectedRoute) so Checkout `navigate(/order-success/${res.data.orderId})` does not 404. | Critical |
| ROUTES-4 | Add backward-compat Navigate redirect aliases: `/admin-login` → `/admin/login` (bookmark compat for AdminDashboard old logout typo). | Medium |
| ROUTES-5 | OrderSuccess.jsx must also read `useParams().orderId` as fallback (in addition to existing location.state?.orderId) and display Order ID if either source provides it. | High |

**Rubric ROUTES (0–2):** Score 0 if any of ROUTES-1..ROUTES-3 fails; score 1 if ROUTES-4 or ROUTES-5 missing; score 2 iff all 5 pass.

---

### RULE LINKS — Broken-link elimination
**Intent**: Every `<Link to>`, `navigate()`, internal `<a href>` resolves to a valid Route; no hard-anchor SPA internal links.

| ID | Statement | Severity |
|---|---|---|
| LINKS-1 | AdminDashboard L193 logout `navigate('/admin-login')` → `navigate('/admin/login')`. | Critical |
| LINKS-2 | Returns L52 `<Link to="/EWarranty">` → `<Link to="/warranty">` (case match existing route). | High |
| LINKS-3 | Login L295 `<a href="/register">Join Bhumivera</a>` → `<Link to="/register">` SPA navigation. | Medium |
| LINKS-4 | Login L178 `<a href="/forgot-password" />Forgot?</a>` → `<Link to="/forgot-password">` (and this link works because ROUTES-2 creates the target page). | Critical |
| LINKS-5 | ProductDetail L283 `/somatic-registry` Link now resolves because ROUTES-1 added the Route. | High |
| LINKS-6 | Navbar L89 "Exclusive Offers" `/flash-sales` quickLink now resolves because ROUTES-1 added the Route. | High |
| LINKS-7 | Footer.jsx L29 `/about#careers` and L30 `/about#press` are VALID (verified About.jsx has id="careers" L226 and id="press" L240 with useEffect scrollIntoView L27). No change required; structurally verify grep post-implement. | Low |

**Rubric LINKS (0–2):** Score 0 if any Critical (LINKS-1, LINKS-4) fails; score 1 if any High/Medium fails; score 2 iff all 7 pass.

---

### RULE API — Endpoint contract symmetry
**Intent**: Every api.js wrapper's METHOD+PATH matches the Backend route; new premium wrappers added for T8 backend endpoints.

| ID | Statement | Severity |
|---|---|---|
| API-1 | Fix api.js L133 `users.changePassword: d => api.put('/users/change-password', d)` → `api.post('/users/change-password', d)` (matches userRoutes L98 POST handler). Currently always 404s on submit. | Critical |
| API-2 | Fix api.js dead wrong paths (safe because unused — AdminLogin uses manual fetch): `auth.sendAdminOtp` `/auth/admin/otp/send` → `/auth/admin/request-otp` (matches authRoutes L544), `auth.verifyAdminOtp` `/auth/admin/otp/verify` → `/auth/admin/verify-otp` (matches authRoutes L569). | Medium |
| API-3 | Add 6 new premium reset wrappers to api.js `auth` object: (a) `verifyPremiumResetOtp: d => api.post('/auth/verify-reset-otp', d)` → returns {resetJwt}, (b) `verifySecurityQuestionForReset: d => api.post('/auth/security-question/verify-for-reset', d)` → returns {resetJwt}, (c) `resetPasswordBearer: (resetJwt, newPassword) => api.post('/auth/reset-password', {newPassword}, { headers: { Authorization: `Bearer ${resetJwt}` } })` (PREFERRED Bearer path; legacy body `auth.resetPassword` preserved for back-compat), (d) `adminForgotPassword: d => api.post('/auth/admin/forgot-password', d)`, (e) `adminVerifyResetOtp: d => api.post('/auth/admin/verify-reset-otp', d)` → returns {resetJwt}, (f) `adminResetPasswordBearer: (resetJwt, newPassword) => api.post('/auth/admin/reset-password', {newPassword}, { headers: { Authorization: `Bearer ${resetJwt}` } })`. | Critical |
| API-4 | api.js interceptor isAdminCall classification (L11-30): new `/auth/admin/forgot-password`, `/auth/admin/verify-reset-otp`, `/auth/admin/reset-password` are PUBLIC (no adminToken yet); ensure interceptor treats `/auth/admin/*` URLs as non-adminCall (it already does: classification L11 starts `/admin/` not `/auth/admin/` — structurally verified safe). | Low |

**Rubric API (0–2):** Score 0 if API-1 or API-3 fails; score 1 if API-2 missing; score 2 iff all 4 pass.

---

### RULE VALIDATION — Password policy alignment
**Intent**: Frontend pre-checks match backend MIN_LENGTH=12; all 6 reset/change/register forms correctly surface server error codes.

| ID | Statement | Severity |
|---|---|---|
| VALID-1 | Profile.jsx L313-314 password change: `length < 6` toast → `length < 12`; on 400 response read `err.response?.data?.code` and map to user-friendly message for {MIN_LENGTH, COMPLEXITY, COMMON_PASSWORD, PWNED_PASSWORD, PASSWORD_REUSED, MISSING_FIELDS, 401 wrong-current}. | High |
| VALID-2 | Register.jsx `getPasswordStrength` L38-45: threshold score-0 for `< 12` chars (was `> 7` gives score++ — now first score bump at length ≥ 12), then +score per character class match (uppercase, lowercase, digit, symbol) max score 4. | High |
| VALID-3 | AdminSettings.jsx L24 `newPassword.length < 6` → `< 12`; on catch block read `err.response?.data?.code` the same as VALID-1. | Medium |
| VALID-4 | NEW ForgotPassword final new-pw step and ResetPassword new-pw step enforce `minLength=12` client-side AND display server error codes identically to VALID-1. | High |
| VALID-5 | NEW AdminForgotPassword final new-pw step enforces `minLength=12` client-side AND displays server error codes including PASSWORD_REUSED last-5. | High |

**Rubric VALID (0–2):** Score 0 if any VALID-1..VALID-5 fails; score 2 iff all 5 pass.

---

### RULE LOCKOUT-UI — HTTP 423 handling
**Intent**: Premium lockout backend responses are visible to users with countdown + recovery shortcut.

| ID | Statement | Severity |
|---|---|---|
| LOCKOUT-1 | Login.jsx auth.login error branch: if `err.response?.status === 423` → show inline banner with icon + `Account locked for {Math.ceil(secondsRemaining/60)} min {secondsRemaining%60}s.` + a button `<Link to="/forgot-password">Reset password to unlock immediately</Link>`. | Critical |
| LOCKOUT-2 | AdminLogin.jsx manual fetch error branch: if `res.status === 423` → read `await res.json()` → show inline banner with secondsRemaining countdown + a link (once ROUTES-2 creates it) to `/admin/forgot-password`. | Critical |

**Rubric LOCKOUT (0–2):** Score 0 if either fails; score 2 iff both pass.

---

### RULE ADMIN-TABS — Orphan AdminSettings reachability
**Intent**: Existing `pages/admin/AdminSettings.jsx` file can be navigated to from AdminDashboard menu.

| ID | Statement | Severity |
|---|---|---|
| ADMIN-1 | AdminDashboard.jsx add lazy import: `const AdminSettings = lazyWithRetry(...)` pointing to `./pages/admin/AdminSettings.jsx`. | High |
| ADMIN-2 | AdminDashboard L65-77 `TAB_COMPONENTS` add entry `settings: AdminSettings` alongside existing ones. | High |
| ADMIN-3 | AdminDashboard L98-131 `menuSections` add a new group (e.g., "System" or append to existing group) with item `{ key: 'settings', label: 'Settings', icon: SettingsIcon }` so it appears in sidebar nav. | High |
| ADMIN-4 | AdminLogin.jsx add a small link below the OTP form "Forgot admin password?" that navigates to `/admin/forgot-password` (once ROUTES-2 creates the route). | Medium |

**Rubric ADMIN (0–2):** Score 0 if ADMIN-1..ADMIN-3 any fails; score 1 if ADMIN-4 missing; score 2 iff all 4 pass.

---

### RULE BUILD — New premium 3-step UI page flows
**Intent**: New ForgotPassword, ResetPassword, AdminForgotPassword pages fully implement the 3-step email→OTP→new password consumer for the backend verify-reset-otp → resetJwt → Bearer reset-password pipeline.

| ID | Statement | Severity |
|---|---|---|
| PAGES-1 | ForgotPassword.jsx (customer): Step 1 = email submit → calls `auth.requestPasswordReset` (existing forgot OTP sender; already api.js L130) → toast "OTP sent to email". Step 2 = 6-digit OTP input → call `auth.verifyPremiumResetOtp({email, otp})` → on success store `resetJwt` in-memory state (NOT localStorage). Step 3 = newPassword + confirmPassword (min 12, match) → call `auth.resetPasswordBearer(resetJwt, newPassword)` → on success toast + `navigate('/login')`. All server error codes surfaced. | Critical |
| PAGES-2 | ResetPassword.jsx: Entry via email links. Accept optional query parameter `?mode=email&email=...` via `useSearchParams()` to prefill Step 1 and auto-advance. Otherwise identical 3-step flow to PAGES-1 with verifyPremiumResetOtp → resetJwt → resetPasswordBearer. | High |
| PAGES-3 | AdminForgotPassword.jsx: Step 1 email → `auth.adminForgotPassword`. Step 2 OTP → `auth.adminVerifyResetOtp` → admin `resetJwt` in memory. Step 3 new pw → `auth.adminResetPasswordBearer`. On success toast + `navigate('/admin/login')`. | Critical |
| PAGES-4 | PAGES-1..PAGES-3 all use the correct api wrappers from API-3. Never write resetJwt to localStorage. All 3 forms show loading states, disable submit while loading, and show success CTA to login page. | High |
| PAGES-5 | PAGES-1..PAGES-3 all have proper styling consistent with Login.jsx / AdminLogin.jsx palettes (earth tones customer, sci-fi cyan admin). | Medium |

**Rubric PAGES (0–2):** Score 0 if PAGES-1 or PAGES-3 fails; score 1 if PAGES-2/PAGES-4 missing; score 2 iff all 5 pass.

---

## 4. Non-Functional Requirements & Constraints

**NFR-1 (Backward compat zero regression):** Existing request/response contracts must not break. Legacy `auth.verifyResetOtp` (old path `/auth/verify-otp`) and `auth.resetPassword` (legacy body path) remain exported in api.js alongside new Bearer wrappers. App.jsx Navigate aliases for bookmark paths added per ROUTES-4.

**NFR-2 (No backend modification):** This spec is 95% Frontend. Do NOT modify Backend routes, models, middleware unless a specific integration-blocking bug is discovered and documented in the task with explicit override note.

**NFR-3 (No persistence of reset tokens):** resetJwt tokens are ephemeral — stored only in React component useState, NEVER written to localStorage / cookies / sessionStorage. This matches the 5-minute expiry and aud='reset' scope.

**NFR-4 (Palette consistency):** Customer pages follow earth palette `#0B2419, #8B5A2B, #D4AF37, #F3F9F1, #FAF8F5`. Admin pages follow sci-fi palette: dark `#0A0F1E` bg + cyan `#22D3EE` accent.

**NFR-5 (Protected guards):** Forgot/reset pages are PUBLIC (users are by definition logged out). OrderSuccess with param is ProtectedRoute (requires login, matches the non-param variant).

## 5. Out of Scope / Deferred

- Prior spec T9 scenario runs (curl/node --check / SQL) — deferred to next session.
- `npm.cmd uninstall bcrypt` (Backend package.json bcrypt already removed; user must run in real shell).
- New backend DB migrations; all columns already idempotently exist (confirmed premium-auth spec).
- SEO meta-tags for new pages; only route navigation fixed here.
