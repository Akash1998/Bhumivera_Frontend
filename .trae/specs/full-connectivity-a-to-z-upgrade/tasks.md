# Full Connectivity A-to-Z Upgrade — Tasks

## Dependency Map
```
Group A (Infrastructure, 0 deps):    A1 → A2 → A3
Group B (Low-hanging nav fixes):     B1 → B2 → B3 → B4
Group C (API layer & validators):    C1 → C2 → C3 → C4 → C5
Group D (Admin integration):         D1 → D2 → D3 → D4
Group E (Premium page components):   E1 → E2 → E3
Group F (Routes & aliases wire-up):  F1 → F2 → F3 → F4 → F5
Group G (Lockout UI):                G1 → G2
Group H (Final verification):        H1 → H2
```

Each task includes: **Approach** (what code changes), **TR** (structural transition rule to self-verify after apply), **Completion Evidence** (to be filled by grep output / file line snapshots after apply).

---

## GROUP A — Backend compat guardrails (verify only, no code changes)
These tasks confirm Backend readiness before Frontend changes. All are structural (no node needed).

### A1. Verify backend premium endpoint shape (TR)
- **Approach**: Structural grep authRoutes.js for endpoint lines L265/L295/L310/L411/L427/L544/L569/L660/L682/L705/L731/L752 to confirm paths/methods match spec §2 table. No code changes.
- **TR (A1-TR)**: Grep lines exact match: 12 POST handlers found with paths verbatim `/auth/forgot-password`, `/auth/verify-otp`, `/auth/reset-password`, `/auth/verify-reset-otp`, `/auth/security-question/verify-for-reset`, `/auth/admin/request-otp`, `/auth/admin/verify-otp`, `/auth/admin/forgot-password`, `/auth/admin/verify-reset-otp`, `/auth/admin/reset-password`, `/auth/security-question/verify`, `/auth/login`.
- **Completion Evidence**: [ ] Grep output pasted. 12 matches = PASS.

### A2. Verify userRoutes POST change-password (TR)
- **Approach**: Structural grep userRoutes.js L98-158 confirms `router.post('/change-password', ...)` (NOT put). No code changes.
- **TR (A2-TR)**: `Select-String userRoutes.js "/change-password"` returns exactly 1 match starting `router.post`.
- **Completion Evidence**: [ ] PASS.

### A3. Verify rateLimiter 8 exports (TR)
- **Approach**: Structural grep rateLimiter.js L71-80 confirms 8 named exports. No code changes.
- **TR (A3-TR)**: grep `exports\.` returns 8 lines including forgotLimiter, magicLinkLimiter, googleCallbackLimiter, adminStrictLimiter, challengeLimiter, loginLimiter, otpLimiter, registerLimiter.
- **Completion Evidence**: [ ] PASS.

---

## GROUP B — Frontend broken links & typo fixes
### B1. Fix AdminDashboard logout navigate path /admin-login → /admin/login
- **File**: `Bhumivera_Frontend/src/pages/AdminDashboard.jsx` L193
- **Approach**: `navigate('/admin-login')` → `navigate('/admin/login')`
- **TR (B1-TR)**: Post-edit grep `/admin-login` Frontend src → 0 matches remaining (only the backward-compat Navigate alias in App.jsx allowed).
- **Completion Evidence**: [ ] Grep 0 raw matches (excluding App.jsx redirect).

### B2. Fix Returns.jsx /EWarranty case typo → /warranty
- **File**: `Bhumivera_Frontend/src/pages/Returns.jsx` L52
- **Approach**: `<Link to="/EWarranty">` → `<Link to="/warranty">`
- **TR (B2-TR)**: grep whole Frontend for `/EWarranty` → 0 matches.
- **Completion Evidence**: [ ] PASS.

### B3. Fix Login.jsx hard anchor <a href="/register"> → Link SPA nav
- **File**: `Bhumivera_Frontend/src/pages/Login.jsx` L295
- **Approach**: Import `{Link}` already present? Verify L1 imports; if not add. Replace `<a href="/register">Join Bhumivera</a>` → `<Link to="/register" className="text-[#D4AF37] hover:underline font-semibold">Join Bhumivera</Link>` (match original classes).
- **TR (B3-TR)**: Login.jsx L295 starts with `<Link to=`. Whole-frontend grep internal `<a href="/` (non http/https/mailto) → remaining only external-purpose anchors (if any).
- **Completion Evidence**: [ ] PASS.

### B4. Fix Login.jsx forgot-password anchor → Link
- **File**: `Bhumivera_Frontend/src/pages/Login.jsx` L178
- **Approach**: `<a href="/forgot-password" className="...">Forgot?</a>` → `<Link to="/forgot-password" className="...">Forgot?</Link>` (preserve exact className).
- **TR (B4-TR)**: Login.jsx L178 starts with `<Link to="/forgot-password"`.
- **Completion Evidence**: [ ] PASS.

---

## GROUP C — API layer & password validators
### C1. Fix api.js users.changePassword PUT → POST
- **File**: `Bhumivera_Frontend/src/services/api.js` L133
- **Approach**: `changePassword: d => api.put('/users/change-password', d)` → `api.post('/users/change-password', d)`.
- **TR (C1-TR)**: grep api.js `users/change-password` → exactly 1 match; starts `api.post`.
- **Completion Evidence**: [ ] PASS.

### C2. Fix api.js dead adminOTP wrong paths
- **File**: `Bhumivera_Frontend/src/services/api.js` L130 (auth object)
- **Approach**: Within `auth = { ... sendAdminOtp, verifyAdminOtp ... }` update:
  - `sendAdminOtp: email => api.post('/auth/admin/otp/send', { email })` → `/auth/admin/request-otp`
  - `verifyAdminOtp: (email, otp) => api.post('/auth/admin/otp/verify', { email, otp })` → `/auth/admin/verify-otp`
- **TR (C2-TR)**: grep api.js `/auth/admin/otp/` → 0 matches.
- **Completion Evidence**: [ ] PASS.

### C3. Add 6 new premium reset API wrappers to auth object (api.js L130)
- **File**: `Bhumivera_Frontend/src/services/api.js` L130 `auth` export block
- **Approach**: Append 6 new keys to the exported auth object (preserve existing exports; do NOT remove legacy resetPassword/verifyResetOtp for back-compat):
  ```js
  verifyPremiumResetOtp: d => api.post('/auth/verify-reset-otp', d),
  verifySecurityQuestionForReset: d => api.post('/auth/security-question/verify-for-reset', d),
  resetPasswordBearer: (resetJwt, newPassword) => api.post('/auth/reset-password', { newPassword }, { headers: { Authorization: `Bearer ${resetJwt}` } }),
  adminForgotPassword: d => api.post('/auth/admin/forgot-password', d),
  adminVerifyResetOtp: d => api.post('/auth/admin/verify-reset-otp', d),
  adminResetPasswordBearer: (resetJwt, newPassword) => api.post('/auth/admin/reset-password', { newPassword }, { headers: { Authorization: `Bearer ${resetJwt}` } }),
  ```
- **TR (C3-TR)**: grep api.js for each of the 6 new method names → all 6 present exactly once in export object.
- **Completion Evidence**: [ ] PASS.

### C4. Align Profile.jsx password validator min-length <6 → <12 + error code handling
- **File**: `Bhumivera_Frontend/src/pages/Profile.jsx` security tab handler ~L310-L348
- **Approach**:
  1. Change `if (passwords.new.length < 6)` → `< 12` with toast "Password must be at least 12 characters"
  2. Keep the existing confirm-match check (if passwords.new !== passwords.confirm ...)
  3. In the catch block for users.changePassword API call: read `const d = err.response?.data;` then map code:
     ```
     if (d?.code === 'MIN_LENGTH') toast.error(d.message);
     else if (d?.code === 'COMPLEXITY') toast.error(d.message);
     else if (d?.code === 'COMMON_PASSWORD') toast.error(d.message);
     else if (d?.code === 'PWNED_PASSWORD') toast.error(d.message);
     else if (d?.code === 'PASSWORD_REUSED') toast.error(d.message);
     else if (err.response?.status === 401) toast.error('Current password is incorrect');
     else toast.error(d?.message || err.message || 'Failed');
     ```
- **TR (C4-TR)**: Profile.jsx grep `length < 6` → 0 matches; grep `length < 12` → at least 1 match in security handler; grep error codes present.
- **Completion Evidence**: [ ] PASS.

### C5. Align Register.jsx getPasswordStrength 7-char threshold → 12-char threshold
- **File**: `Bhumivera_Frontend/src/pages/Register.jsx` getPasswordStrength func ~L38-L45
- **Approach**: Rewrite getPasswordStrength scoring tiers:
  - score=0 always if pwd.length < 12
  - score += 1 each true: hasUpperCase, hasLowerCase, hasDigit, hasSymbol (maximum score = 4 if len≥12 AND 4/4 classes)
  - Map score→label: 0="Too Short (min 12 chars)", 1="Weak", 2="Fair", 3="Good", 4="Strong"
- **TR (C5-TR)**: grep Register.jsx `length > 7` → 0 matches; grep `length < 12` → 1 match at start of getPasswordStrength; grep 4 class checks present.
- **Completion Evidence**: [ ] PASS.

### C6. Align AdminSettings.jsx password min-length 6 → 12 + error code handling
- **File**: `Bhumivera_Frontend/src/pages/admin/AdminSettings.jsx` L24 + L42 catch
- **Approach**:
  1. `newPassword.length < 6` → `< 12`, message: "New password must be at least 12 characters"
  2. catch block L42: `err.response?.data?.code` switch identical to C4 (MIN_LENGTH, COMPLEXITY, COMMON, PWNED, REUSED).
- **TR (C6-TR)**: AdminSettings.jsx grep `length < 6` → 0; grep `length < 12` → 1; error codes present.
- **Completion Evidence**: [ ] PASS.

---

## GROUP D — AdminSettings orphan reachability & AdminLogin forgot link
### D1. AdminDashboard add lazy import for AdminSettings
- **File**: `Bhumivera_Frontend/src/pages/AdminDashboard.jsx` L6-L27 lazy imports area
- **Approach**: Add after WarehouseManagement import line:
  ```jsx
  const AdminSettings = lazyWithRetry(() => import("./pages/admin/AdminSettings.jsx"));
  ```
  (Note: AdminDashboard is already inside src/pages/ so relative path `./pages/admin/...` — verify existing WarehouseManagement pattern at L36.)
- **TR (D1-TR)**: grep AdminDashboard.jsx `AdminSettings` ≥ 2 occurrences (import + use below).
- **Completion Evidence**: [ ] PASS.

### D2. AdminDashboard add settings to TAB_COMPONENTS
- **File**: `Bhumivera_Frontend/src/pages/AdminDashboard.jsx` TAB_COMPONENTS map ~L65-L77
- **Approach**: Append new key `settings: AdminSettings` to the TAB_COMPONENTS object. Preserve comma style.
- **TR (D2-TR)**: grep AdminDashboard.jsx `TAB_COMPONENTS` block line containing `settings:` present.
- **Completion Evidence**: [ ] PASS.

### D3. AdminDashboard add settings to menuSections
- **File**: `Bhumivera_Frontend/src/pages/AdminDashboard.jsx` menuSections ~L98-L131
- **Approach**: Add a new final group `{ title: 'System', items: [{ key: 'settings', label: 'Settings', icon: SettingsIcon }] }` to the menuSections array. Import `Settings` or `Settings2` icon from lucide-react at L2 import block.
- **TR (D3-TR)**: grep menuSections object → group with key `settings` exists and has an icon.
- **Completion Evidence**: [ ] PASS.

### D4. AdminLogin add "Forgot admin password?" link
- **File**: `Bhumivera_Frontend/src/pages/AdminLogin.jsx` OTP form bottom area (below Verify button)
- **Approach**: Add a small centered link: `<Link to="/admin/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">Forgot admin password?</Link>`. Ensure `Link` is imported from react-router-dom at L1.
- **TR (D4-TR)**: grep AdminLogin.jsx `/admin/forgot-password` → exactly 1 match as a Link target.
- **Completion Evidence**: [ ] PASS.

---

## GROUP E — Premium page components (3 new files)
### E1. Create ForgotPassword.jsx (customer, 3-step flow)
- **File (NEW)**: `Bhumivera_Frontend/src/pages/ForgotPassword.jsx`
- **Approach (3-step state machine via useState step ∈ {1,2,3})**:
  - Step 1: Email input form. Submit → `await auth.requestPasswordReset({ email })`. On 2xx: toast "OTP sent to your email"; setStep(2); keep email in state.
  - Step 2: 6-digit OTP input. Submit → `await auth.verifyPremiumResetOtp({ email, otp })`. On 2xx: store `resetJwt = res.data.resetJwt` ONLY in component useState (NOT localStorage); setStep(3). On 400 show "Invalid OTP".
  - Step 3: newPassword (min 12) + confirmPassword input. Submit check match→ `await auth.resetPasswordBearer(resetJwt, newPassword)`. On 2xx: toast.success("Password reset successfully"); setTimeout navigate('/login') via useNavigate(). On 4xx: show error codes (MIN_LENGTH/COMPLEXITY/COMMON/PWNED/REUSED).
  - Styling matches Login.jsx earth palette. Add `<Link to="/login">← Back to login</Link>` at top.
- **TR (E1-TR)**:
  1. File exists with default export ForgotPassword.
  2. Grep file for `"localStorage"` → 0 matches (resetJwt ephemeral constraint).
  3. Grep file for 3 api wrapper calls: `requestPasswordReset`, `verifyPremiumResetOtp`, `resetPasswordBearer` → all 3 present.
  4. Grep file for `length < 12` → exactly 1 match (new pw pre-check).
- **Completion Evidence**: [ ] PASS (4/4 TRs).

### E2. Create ResetPassword.jsx (customer, email-entry + searchParams)
- **File (NEW)**: `Bhumivera_Frontend/src/pages/ResetPassword.jsx`
- **Approach**: Same 3-step state machine as E1, PLUS at component mount:
  ```js
  const [params] = useSearchParams();
  const emailFromLink = params.get('email');
  const modeFromLink = params.get('mode');
  useEffect(() => {
    if (modeFromLink === 'email' && emailFromLink) {
      setEmail(emailFromLink);
      setStep(2); // auto-advance to OTP entry
      toast('Enter the OTP sent to your email');
    }
  }, [modeFromLink, emailFromLink]);
  ```
  All 3 API calls identical to E1. Styling earth palette. Top `<Link to="/login">← Back to login</Link>`.
- **TR (E2-TR)**:
  1. File exists default export ResetPassword.
  2. grep file `useSearchParams` → 1 match.
  3. grep file `mode === 'email'` (or equivalent) → 1 match.
  4. grep localStorage → 0.
  5. 3 api wrappers (requestPasswordReset, verifyPremiumResetOtp, resetPasswordBearer) present.
- **Completion Evidence**: [ ] PASS (5/5).

### E3. Create AdminForgotPassword.jsx (admin 3-step)
- **File (NEW)**: `Bhumivera_Frontend/src/pages/admin/AdminForgotPassword.jsx`
- **Approach**: 3-step mirror. Api wrappers differ. Use admin sci-fi palette dark #0A0F1E bg + cyan #22D3EE accent.
  - Step 1 email. Submit → `auth.adminForgotPassword({ email })`.
  - Step 2 OTP. Submit → `auth.adminVerifyResetOtp({ email, otp })` → stores adminResetJwt in useState ONLY.
  - Step 3 new/confirm pw (min 12). Submit → `auth.adminResetPasswordBearer(adminResetJwt, newPassword)`. On 2xx: toast + navigate('/admin/login').
  - Top link: `<Link to="/admin/login">← Back to admin login</Link>`.
- **TR (E3-TR)**:
  1. File exists. grep `useState` × at least 5 (step, email, otp, new, confirm, loading, resetJwt).
  2. grep localStorage → 0.
  3. grep 3 wrappers: `adminForgotPassword`, `adminVerifyResetOtp`, `adminResetPasswordBearer` → all 3 present.
  4. grep `length < 12` → 1.
  5. grep `navigate('/admin/login')` → step 3 success.
- **Completion Evidence**: [ ] PASS (5/5).

---

## GROUP F — App.jsx routes + lazy imports wire-up + backward-compat redirects
### F1. App.jsx add 4 orphan page lazy imports & Route entries
- **File**: `Bhumivera_Frontend/src/App.jsx`
- **Approach**:
  1. Add lazy import block (near BhumiveraScience L60 area):
     ```jsx
     const FlashSales = lazyWithRetry(() => import("./pages/FlashSales.jsx"));
     const SomaticRegistry = lazyWithRetry(() => import("./pages/SomaticRegistry.jsx"));
     const ProvenanceEngine = lazyWithRetry(() => import("./pages/ProvenanceEngine.jsx"));
     const SpinRegistration = lazyWithRetry(() => import("./pages/SpinRegistration.jsx"));
     ```
  2. Add Routes in the Routes block (public section L137-L158):
     ```jsx
     <Route path="/flash-sales" element={<FlashSales />} />
     <Route path="/somatic-registry" element={<SomaticRegistry />} />
     <Route path="/provenance-engine" element={<ProvenanceEngine />} />
     <Route path="/spin-registration" element={<SpinRegistration />} />
     ```
- **TR (F1-TR)**: grep App.jsx for each of the 4 paths → exactly 1 Route element per path.
- **Completion Evidence**: [ ] PASS.

### F2. App.jsx add 3 new premium page lazy imports & Route entries (public)
- **File**: `Bhumivera_Frontend/src/App.jsx`
- **Approach**:
  1. Add lazy imports (near Login/L45 area):
     ```jsx
     const ForgotPassword = lazyWithRetry(() => import("./pages/ForgotPassword.jsx"));
     const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword.jsx"));
     const AdminForgotPassword = lazyWithRetry(() => import("./pages/admin/AdminForgotPassword.jsx"));
     ```
  2. Add Routes:
     ```jsx
     {/* Public Auth Password Reset Routes */}
     <Route path="/forgot-password" element={<ForgotPassword />} />
     <Route path="/reset-password" element={<ResetPassword />} />
     <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
     ```
     Place these in the Auth Routes area (after L161 /register). AdminForgotPassword is PUBLIC (no AdminRoute guard) because by definition admin user is locked out / not authenticated.
- **TR (F2-TR)**: grep App.jsx 3 paths → 1 Route each; AdminForgotPassword NOT wrapped in AdminRoute.
- **Completion Evidence**: [ ] PASS.

### F3. App.jsx add /order-success/:orderId? optional-param Route variant
- **File**: `Bhumivera_Frontend/src/App.jsx` L167 existing order-success Route.
- **Approach**: Change L167 from `path="/order-success"` to `path="/order-success/:orderId?"` (make param optional with `?`). KEEP the `<ProtectedRoute><OrderSuccess /></ProtectedRoute>` element exactly the same.
- **TR (F3-TR)**: grep App.jsx `order-success` → exactly 1 Route element, path contains `:orderId?`.
- **Completion Evidence**: [ ] PASS.

### F4. OrderSuccess.jsx add useParams() orderId fallback read
- **File**: `Bhumivera_Frontend/src/pages/OrderSuccess.jsx`
- **Approach**:
  1. Import `{ useParams }` from react-router-dom alongside existing useLocation/Link.
  2. At top of component: `const { orderId: paramOrderId } = useParams();`
  3. Update the orderId extract: `const orderId = state?.orderId || paramOrderId;`
  4. Keep the rest of the component identical (display logic L16-L20 already shows Order ID when present).
- **TR (F4-TR)**: grep OrderSuccess.jsx `useParams` → 1 match; L6 `orderId =` line uses `|| paramOrderId` fallback.
- **Completion Evidence**: [ ] PASS.

### F5. App.jsx add backward-compat Navigate redirect alias /admin-login → /admin/login
- **File**: `Bhumivera_Frontend/src/App.jsx` Routes block
- **Approach**: In Public Auth Routes area (after L181 `/admin/login` route) add:
  ```jsx
  {/* Backward-compat redirects (old bookmarks) */}
  <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
  ```
- **TR (F5-TR)**: grep App.jsx `/admin-login` → exactly 1 match wrapped Navigate replace; (note: B1 also removed the navigate('/admin-login') call, so total grep src `/admin-login` = 1 redirect only).
- **Completion Evidence**: [ ] PASS.

---

## GROUP G — Lockout UI (HTTP 423 branches)
### G1. Login.jsx add 423 lockout banner + reset password CTA
- **File**: `Bhumivera_Frontend/src/pages/Login.jsx` login submit error handler (where auth.login is called)
- **Approach**: In try/catch around `await login(creds)`:
  ```jsx
  catch (err) {
    const status = err.response?.status;
    const d = err.response?.data;
    if (status === 423) {
      const secs = d?.secondsRemaining || 0;
      const mins = Math.floor(secs / 60);
      const rSecs = secs % 60;
      setLockoutMsg(`Account temporarily locked. Try again in ${mins}m ${rSecs}s or reset password now.`);
      setShowLockoutBanner(true);
    } else {
      toast.error(d?.message || err.message || 'Login failed');
    }
  }
  ```
  Above the submit button (or below form) conditionally render:
  ```jsx
  {showLockoutBanner && (
    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-sm">
      <div className="font-semibold text-red-500 mb-2">🔒 {lockoutMsg}</div>
      <Link to="/forgot-password" className="text-[#D4AF37] font-bold hover:underline">
        Reset password to unlock immediately →
      </Link>
    </div>
  )}
  ```
  Add `useState` vars `showLockoutBanner, setShowLockoutBanner` and `lockoutMsg, setLockoutMsg`.
- **TR (G1-TR)**: grep Login.jsx `status === 423` → 1 match; grep `secondsRemaining` → 1 match; grep Link `/forgot-password` → 2 total (L178 original + banner CTA).
- **Completion Evidence**: [ ] PASS.

### G2. AdminLogin.jsx add 423 lockout banner + admin forgot password CTA
- **File**: `Bhumivera_Frontend/src/pages/AdminLogin.jsx` OTP verify / first-step manual fetch error branches
- **Approach**: Where AdminLogin does `fetch(...)` (both request-otp and verify-otp steps), after `res.json()` check for `res.status === 423` → same pattern as G1 with secondsRemaining calc and banner CTA linking to `/admin/forgot-password` (Link style cyan-400). If response is not-ok AND not 423, fall through to existing generic error handling.
- **TR (G2-TR)**: grep AdminLogin.jsx `status === 423` → 1 or 2 matches (one per fetch); banner Link to `/admin/forgot-password` present; secondsRemaining calc present.
- **Completion Evidence**: [ ] PASS.

---

## GROUP H — Final structural verification & diagnostics
### H1. Whole-frontend connectivity structural sweep (composite grep TR)
- **Approach**: Run the following batch after all tasks applied. Record PASS/FAIL per sub-TR. All must PASS.
- **Composite TR (H1-TR)**:
  1. `/admin-login` matches = 1 (only App.jsx Navigate redirect). PASS/FAIL [ ]
  2. `/EWarranty` matches = 0. PASS/FAIL [ ]
  3. `/flash-sales` Route + existing Navbar reference = 1 Route + ≥ 1 Link target (total ≥ 2). PASS/FAIL [ ]
  4. `/somatic-registry` Route + ProductDetail Link = ≥ 2 matches. PASS/FAIL [ ]
  5. `/forgot-password` Route + Login Link(s) + banner CTA + resetJwt ephemeral pages = ≥ 5 matches. PASS/FAIL [ ]
  6. `/reset-password` Route + ≥ 1 ResetPassword file on disk = ≥ 2 matches. PASS/FAIL [ ]
  7. `/admin/forgot-password` Route + AdminLogin Link + AdminForgotPassword refs = ≥ 3 matches. PASS/FAIL [ ]
  8. `/order-success/:orderId?` Route param matcher in App.jsx (post F3) = 1 match. PASS/FAIL [ ]
  9. api.js `users/change-password` POST (not PUT) = grep shows POST. PASS/FAIL [ ]
  10. api.js `/auth/admin/otp/send` or `/auth/admin/otp/verify` = 0 matches dead paths gone. PASS/FAIL [ ]
  11. 6 new auth wrapper names present in api.js exports: verifyPremiumResetOtp, verifySecurityQuestionForReset, resetPasswordBearer, adminForgotPassword, adminVerifyResetOtp, adminResetPasswordBearer → all 6. PASS/FAIL [ ]
  12. Profile/Register/AdminSettings grep `length < 6` → 0 matches; grep `length < 12` ≥ 3 matches. PASS/FAIL [ ]
  13. AdminDashboard TAB_COMPONENTS contains `settings:` + menuSections contains settings key → both true. PASS/FAIL [ ]
- **Completion Evidence**: [ ] All 13 sub-TRs PASS (13/13).

### H2. GetDiagnostics full sweep (IDE lint & type)
- **Approach**: Run GetDiagnostics tool for Frontend repo. Record results.
- **TR (H2-TR)**: GetDiagnostics → 0 lint errors, 0 type errors across entire Frontend repo.
- **Completion Evidence**: [ ] 0/0 errors. PASS.

### H3. Backward-compat rubric score (NFR-1)
- **Approach**: Grep-based. Confirm existing API paths NOT removed:
  - api.js still exports legacy `auth.verifyResetOtp` → `/auth/verify-otp` (L130 old path preserved, not removed)
  - api.js still exports legacy `auth.resetPassword` → `/auth/reset-password` body path (not removed)
- **TR (H3-TR)**: Both legacy wrappers still present in api.js L130 auth export object. Score rubric COMPAT 2/2.
- **Completion Evidence**: [ ] COMPAT 2/2.

### H4. Coverage rubric score (remaining broken items = 0)
- **Approach**: Re-grep H1 composite + diff count. Confirm 0 remaining.
- **TR (H4-TR)**: H1 13/13 + H2 0 errors → COVERAGE 2/2.
- **Completion Evidence**: [ ] COVERAGE 2/2.
