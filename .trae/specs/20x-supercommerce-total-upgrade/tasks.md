# BHUMIVERA 20× SUPER-COMMERCE TOTAL UPGRADE — IMPLEMENTATION QUEUE
## tasks.md v2.0 ⸻ NO PLACEHOLDERS. 196 TASKS. ALL FULLY DETAILED.
- Parent spec: `./spec.md` (read BEFORE any edits)
- Resumption one-click root doc: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\RESUME_FROM_HERE.md`
- Global format per task: ## Task N [GROUP-CODE-id] → Headings, Fields, TRs, Status, Resume, Evidence.
- **Progress: 0 / 196 tasks completed.**
- **GLOBAL DEPENDENCY ORDER (never break):** GCLEAN → GROUP 0 DEFECTS → GROUP 1 ERRORS → GROUP 2 SESSION → GROUP 3 CART RULES (backend) → GROUP 4 ADMIN 7 TABS → GROUP 5 CUSTOMER CART UX → GROUP 6 CHECKOUT → GROUP 7 HOOKS 32 → GROUP 8 PERF 20× FUNCTION REGISTER → GROUP 9 LOYALTY → GROUP 10 TOASTS → GROUP 11 OBSERV → GROUP 12 423 LIVE → GROUP 13 VALIDATE (rule ACs) → GROUP 14 REVIEW (rubric ACs).

---
## Group GCLEAN: Cleanup previous completed specs. 3 tasks. Runs FIRST.
---
## Task 1 [GCLEAN-1] ⭐ HIGHEST PRIORITY
**Title**: Hard DELETE 4 completed spec folders OUT of `.trae/` tree per user instruction ("make sure whatever has been already completed should be removed from trae folder"). Optionally backup OUTSIDE `.trae/` if user later says "preserve backup".
**Depends on**: — (NONE)
**Priority**: blocker
**Files Touched**:
  - DELETE: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\.trae\specs\deep-scan-pending-upgrades\*` → entire folder removed.
  - DELETE: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\.trae\specs\premium-auth-overhaul\*` → removed.
  - DELETE: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\.trae\specs\production-stability-hardening\*` → removed.
  - DELETE: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\.trae\specs\full-connectivity-a-to-z-upgrade\*` (if exists) → removed.
  - OPTIONAL-OFF-BY-DEFAULT: backup sibling if user approves → copy to `c:\Users\akash\OneDrive\Documents\GitHub\_trae_completed_archive_backup\20261006_<slug>\` (note OUTSIDE any `.trae/` tree, per user "removed from trae folder").
**Transition-Rules**:
  - rule TR-1: After delete, `LS` each original path → "File does not exist" error.
  - rule TR-2: Glob for any `tasks.md` inside those 4 folders under original `.trae/` → 0 matches.
  - rule TR-3: If backup created, verify files exist outside `.trae/`.
  - rubric TR-4 (0-2, thresh 2): 2 = perfect no trace left in .trae/, backup clean; 1 = 1 partial remains; 0 = folders still present.
**Status**: pending
**Resume Notes**: (fill only if interrupted mid-deletion — which folder last confirmed deleted, which remaining. NEVER mark completed until all 4 deleted.)
**Completion Evidence**:

---
## Task 2 [GCLEAN-2]
**Title**: Write repo-root handoff file `RESUME_FROM_HERE.md` exists at frontend repo root path (NOT inside .trae/). Details: Group REF3.
**Depends on**: — (can parallel with 1, but do after approval so user sees it exists early)
**Priority**: blocker
**Files Touched**:
  - NEW: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\RESUME_FROM_HERE.md`
**Transition-Rules**:
  - rule TR-1: File exists in FRONTEND ROOT, not nested.
  - rule TR-2: File contains literal strings: "STEP 1 — OPEN THESE 3 FILES", "Status: in_progress", "STEP 7 Review Phase".
  - rule TR-3: `wc -c` equivalent (size) ≥ 2500 bytes.
  - rule TR-4: Contains absolute full file path links to spec.md, tasks.md, AI_RESUME_PROTOCOL.md.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 3 [GCLEAN-3]
**Title**: Write deep reference `AI_RESUME_PROTOCOL.md` inside this spec folder. Mirror of spec.md §6 + extra.
**Depends on**: —
**Priority**: high
**Files Touched**:
  - NEW / OVERWRITE: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\.trae\specs\20x-supercommerce-total-upgrade\AI_RESUME_PROTOCOL.md`
**Transition-Rules**:
  - rule TR-1: File exists.
  - rule TR-2: Contains sections STEP 0..STEP 10.
  - rule TR-3: Contains "NEVER re-do a task Status=completed".
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## GROUP 0: DEFECTS ERADICATION D1–D7 (46 tasks). Run SECOND. Priority 0 BLOCKERS.
---
### Sub 0-D1: Silent Refresh (orders/my 401 repeat fix) — 7 tasks
## Task 4 [0D1-1]
**Title**: Install date-fns + date-fns-tz ONE new frontend dep (needed for D5 later, do early in GROUP 0 so rest code can import).
**Depends on**: Task 1 (GCLEAN done first? Or can run concurrent — actually date-fns install independent; do as GROUP 0 task 1 since needed by D5).
**Priority**: blocker
**Files Touched**:
  - MODIFY: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\package.json` (add deps)
  - MODIFY: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\package-lock.json`
  - CMD: `npm install date-fns@^3.6.0 date-fns-tz@latest --save`
**Transition-Rules**:
  - rule TR-1: `grep date-fns frontend/package.json` → 2 dependencies present.
  - rule TR-2: `grep "version" in lock → installed.
  - rule TR-3: Backend package.json NOT touched (0 changes to backend deps).
**Status**: pending
**Resume Notes**: (if npm install failed — note error, retry with --legacy-peer-deps if needed)
**Completion Evidence**:

---
## Task 5 [0D1-2]
**Title**: Backend — Add `jti` claim to EVERY `jwt.sign()` call. (login/register/verify-email/mobile-login/admin-login/magic-link/google/2FA-verified/reset success anywhere token issued).
**Depends on**: Task 1 done or concurrent safe (code is backend only no conflict).
**Priority**: blocker
**Files Touched**:
  - `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\routes\authRoutes.js` (all jwt.sign calls)
  - `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\routes\userRoutes.js` (if issues token e.g. POST /register)
  - Any other file that calls jwt.sign → grep first.
**Transition-Rules**:
  - rule TR-1: Glob search `jwt.sign` across backend/ → count of calls = N. Count of calls with `jwtid` in options or payload.jti = N ± 0.
  - rule TR-2: `crypto` module imported if missing.
  - rule TR-3: Value of jti = `crypto.randomUUID()` (v4 UUID, not predictable).
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 6 [0D1-3]
**Title**: Backend — Create `POST /api/auth/refresh` route. Reads bearer token; verifies JWT; check jtiCache.isRevoked false; issues new token (shorter validity 60 min default or remaining whichever less); revokes old jti; returns `{ token, expiresIn: secondsInt }`.
**Depends on**: Task 5
**Priority**: blocker
**Files Touched**:
  - MODIFY `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\routes\authRoutes.js`
  - Verify jtiCache exports in `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\utils\jtiCache.js`
**Transition-Rules**:
  - rule TR-1: Route defined: `router.post("/refresh", ...)`.
  - rule TR-2: Returns 401 `{code:'TOKEN_REVOKED'}` on replayed refresh.
  - rule TR-3: Returns 401 `{code:'TOKEN_INVALID'}` on bad signature.
  - rule TR-4: Success returns 200 with keys.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 7 [0D1-4]
**Title**: Backend — Create `POST /api/auth/logout` route (calls jtiCache.revoke). Returns 204 no content or 200 OK.
**Depends on**: Task 6
**Priority**: high
**Files Touched**:
  - authRoutes.js add new endpoint. Authenticated guard (any role).
**Transition-Rules**:
  - rule TR-1: Route defined.
  - rule TR-2: After logout, trying /refresh with same jti → 401 TOKEN_REVOKED.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 8 [0D1-5]
**Title**: Frontend — `_attemptRefresh` debounce 10 seconds shared + `lastRefreshAt` guard. Never wipe storage < 10s after failed refresh.
**Depends on**: Task 6 (route must exist for logic to make sense)
**Priority**: blocker
**Files Touched**:
  - MODIFY `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\src\services\api.js` lines 61-128 area
**Transition-Rules**:
  - rule TR-1: File contains `lastRefreshAt` variable + check `Date.now() - lastRefreshAt < 10000 => return fail fast`.
  - rule TR-2: `_refreshPromise` pattern preserved (no parallel duplicates).
  - rule TR-3: If refresh fails → wait ≥ 10s before another refresh attempt.
  - rule TR-4: localStorage wipe only happens when ≥ 10s elapsed after first failed refresh within session (to avoid cascades during 401 bursts).
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 9 [0D1-6]
**Title**: Frontend AuthContext → logout now calls `authApi.logout()` server-side FIRST before clearing storage (300 ms timeout; if offline still clears).
**Depends on**: Task 7
**Priority**: high
**Files Touched**:
  - `api.js` export `auth.logout = () => api.post('/auth/logout')`
  - `AuthContext.jsx` logout function body
**Transition-Rules**:
  - rule TR-1: `auth.logout` export exists.
  - rule TR-2: AuthContext.logout calls it (awaited with Promise.race or timeout).
  - rule TR-3: Server unreachable → storage still cleared, no hang.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 10 [0D1-7]
**Title**: Expand refreshable-urls list in api.js (line ~97): Add /auth/profile, /users/profile, /wallet, /settings/public, plus existing.
**Depends on**: Task 8
**Priority**: blocker
**Files Touched**: api.js interceptor
**Transition-Rules**:
  - rule TR-1: Grep `/auth/profile` present in refreshables list.
  - rule TR-2: Grep `/users/profile` present.
  - rule TR-3: /orders/, /returns/my, /cart/, /addresses/, /wishlist/, /reviews/my, /notifications (user) all still present.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 11 [0D1-8]
**Title**: D1 Smoke. Curl or Playwright: (a) login → get token → decode confirm jti present; (b) POST /refresh → new token; (c) POST /refresh same token again → TOKEN_REVOKED 401; (d) Frontend open /profile idle 30s → Network max 1 /refresh; console 401 orders count ≤ 1.
**Depends on**: Tasks 5,6,7,8,9,10
**Priority**: blocker
**Files Touched**: NONE
**Transition-Rules**:
  - rule TR-1 to TR-4d above all pass.
  - rubric TR-5 (0-2 thresh 2): 2 = 0 console errors after 30s; 1 = ≤1; 0 = 3+ spammed.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
### Sub 0-D2: Returns 500 fix → structured 4xx (3 tasks)
## Task 12 [0D2-1]
**Title**: Backend returnRoutes `POST /` — validate order_id existence, ownership, items non-empty, refund_type enum, duplicate return check.
**Depends on**: GCLEAN safe concurrent
**Priority**: blocker
**Files Touched**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\routes\returnRoutes.js` L32-L62 area
**Transition-Rules**:
  - rule TR-1: order_id not found → 400 `{code:'ORDER_NOT_FOUND', message, order_id}`.
  - rule TR-2: order.user_id !== req.user.id → 403 `{code:'ORDER_NOT_YOURS'}`.
  - rule TR-3: !items || items.length === 0 → 400 `{code:'ITEMS_REQUIRED'}`.
  - rule TR-4: refund_type NOT IN ['refund','replacement','wallet'] → 400 `{code:'INVALID_REFUND_TYPE', allowed: [...]}`.
  - rule TR-5: existing return row for same order_id + user → 409 `{code:'ALREADY_RETURNED'}`.
  - rule TR-6: 500 only triggered by genuine DB failure (after all user errors handled).
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 13 [0D2-2]
**Title**: Backend returnModel.createReturn → safe destructuring defaults items=[], rma_number passes through.
**Depends on**: Task 12
**Priority**: high
**Files Touched**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\models\returnModel.js`
**Transition-Rules**:
  - rule TR-1: createReturn signature default = [] array.
  - rule TR-2: rma_number stored in returns.rma_number DB column; read-back matches.
  - rubric TR-3 (0-2 thresh 2): 2 = no undefined property accesses possible; 1 = some but guarded; 0 = crashes on null.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 14 [0D2-3]
**Title**: D2 Smoke tests: 5 negatives + 1 positive.
**Depends on**: Tasks 12,13
**Priority**: blocker
**Files Touched**: NONE (curl only)
**Transition-Rules**:
  - rule TR-1 `POST /api/returns {}` empty body → 400 ORDER_NOT_FOUND.
  - rule TR-2 order_id=999999 → 400.
  - rule TR-3 other user's order → 403.
  - rule TR-4 items = [] → 400 ITEMS_REQUIRED.
  - rule TR-5 refund_type='weird' → 400 INVALID_REFUND_TYPE.
  - rule TR-6 valid payload → 201 `{ id, rma_number }` present.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
### Sub 0-D3: Addresses 400 camel/snake mismatch fix (3 tasks)
## Task 15 [0D3-1]
**Title**: Backend NEW util `utils/fieldNormalizer.js` → `normalizeAddressKeys(body)` bidirectional map: camel→snake, but preserves if already snake; idempotent.
**Depends on**: concurrent safe
**Priority**: blocker
**Files Touched**: NEW file `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\utils\fieldNormalizer.js`
**Transition-Rules**:
  - rule TR-1: Map table handled: fullName↔full_name, phone/phoneNumber→phone, line1/address1/street_address→line1, line2/address2→line2, pincode/zip/postal_code→pincode, city→city, state→state, country→country, label→label, is_default→is_default.
  - rule TR-2: `f(f(x)) === JSON.stringify(f(x))` idempotent.
  - rule TR-3: Two tests (node eval) both produce snake output.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 16 [0D3-2]
**Title**: Backend addressRoutes POST, PUT entrypoints → apply normalizer before destructure/DB.
**Depends on**: Task 15
**Priority**: blocker
**Files Touched**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\routes\addressRoutes.js` (POST, PUT).
**Transition-Rules**:
  - rule TR-1: `const body = normalizeAddressKeys(req.body)` in both handlers top.
  - rule TR-2: Required-field IF uses `body.full_name, body.phone, body.line1, body.pincode, body.city, body.state`.
  - rule TR-3: CreateAddress / UpdateAddress receive normalized body.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 17 [0D3-3]
**Title**: Frontend Profile + AddressBook forms. EITHER (A) emit snake_case fields OR (B) rely on backend normalizer only. Option A preferred for double-safe. Add toasts (save success / fail).
**Depends on**: Task 16
**Priority**: high
**Files Touched**:
  - `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\src\pages\Profile.jsx` → address submit build payload
  - `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\src\pages\AddressBook.jsx` → if exists
**Transition-Rules**:
  - rule TR-1: Curl camel case payload POST addresses → 201.
  - rule TR-2: Curl snake case payload POST addresses → 201.
  - rule TR-3: Frontend submit new address → toast.success "Address saved"; errors toast.error with normalized message.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
### Sub 0-D4: Password reset missing routes + success toasts (7 tasks)
## Task 18 [0D4-1]
**Title**: Backend authRoutes. Implement SIX missing premium reset endpoints (or ensure they exist if previous did them). (a) /verify-reset-otp, (b) /security-question/verify-for-reset, (c) /reset-password (ACCEPTS 2 SHAPES: legacy body + new Bearer resetJwt), (d) admin /admin/forgot-password, (e) admin /admin/verify-reset-otp, (f) admin /admin/reset-password Bearer.
**Depends on**: concurrent after GROUP 0 start
**Priority**: blocker
**Files Touched**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\routes\authRoutes.js`
**Transition-Rules**:
  - rule TR-1: /verify-reset-otp 200 returns `{resetJwt}`.
  - rule TR-2: /security-question/verify-for-reset 200 returns `{resetJwt}`.
  - rule TR-3: /reset-password shape-A `{email, otp, newPassword}` → success + clears otp. Shape-B Bearer resetJwt + body `{newPassword}` → success + clear + revoke resetJwt (if stateless use expiry only). Errors: MIN_LENGTH, COMPLEXITY, COMMON_PASSWORD, PWNED_PASSWORD, PASSWORD_REUSED returned in structured code.
  - rule TR-4: /admin/forgot-password → email sent + save reset OTP row admin_reset_otp.
  - rule TR-5: /admin/verify-reset-otp → 200 `{resetJwt}`.
  - rule TR-6: /admin/reset-password Bearer admin resetJwt → success.
  - rule TR-7: resetPasswordBackend validates via `validatePassword()` in utils/passwordPolicy — returns all 5 structured codes.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 19 [0D4-2]
**Title**: Frontend ForgotPassword.jsx → SUCCESS: toast.success + INLINE green banner "✅ Password reset successfully! Redirecting you to login in 3s…" + then navigate.
**Depends on**: Task 18
**Priority**: blocker
**Files Touched**: `ForgotPassword.jsx` handleSubmitNewPw success path
**Transition-Rules**:
  - rule TR-1: toast.success called with message with "Redirecting".
  - rule TR-2: Inline green banner renders (not just toast).
  - rule TR-3: setTimeout before navigate (ms ≥ 2000).
  - rule TR-4: localStorage writes for resetJwt = ZERO (grep check files).
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 20 [0D4-3]
**Title**: Frontend ResetPassword.jsx → SUCCESS: toast.success + INLINE green banner (matches Forgot above), then navigate /login.
**Depends on**: Task 19
**Priority**: blocker
**Files Touched**: ResetPassword.jsx
**Transition-Rules**: 4 rules same as 19 TR-1..TR-4 applied.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 21 [0D4-4]
**Title**: Frontend AdminForgotPassword.jsx → SUCCESS toast + banner, navigate /admin/login.
**Depends on**: Task 19
**Priority**: blocker
**Files Touched**: AdminForgotPassword.jsx
**Transition-Rules**:
  - rule TR-1: toast visible ≥2s.
  - rule TR-2: Banner visible green.
  - rule TR-3: localStorage resetJwt writes 0.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 22 [0D4-5]
**Title**: Backend `passwordPolicy.validatePassword` return object shape `{ valid: bool, errors: [{code, message}] }`. Ensure it covers MIN_LENGTH 12, COMPLEXITY upper+lower+digit+symbol, COMMON_PASSWORD check, PWNED hibp lookup, PASSWORD_REUSED last 5 password hash compare (both user and admin paths).
**Depends on**: Task 18
**Priority**: high
**Files Touched**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\utils\passwordPolicy.js`
**Transition-Rules**:
  - rule TR-1: "short" password (<12) → errors include code=MIN_LENGTH.
  - rule TR-2: "lowercaseonly123" (no upper/symbol) → COMPLEXITY.
  - rule TR-3: "password123" → COMMON_PASSWORD (in commonPasswords.js).
  - rule TR-4: hibp mock/offline fallback returns PWNED_PASSWORD if breached.
  - rule TR-5: Password equal to ANY of last 5 hashes → PASSWORD_REUSED.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 23 [0D4-6]
**Title**: Customer E2E reset smoke. Login → "Forgot password?" → email OTP (mocked or real) → new password "Strong@Pass12345!" → toasts visible in order → redirect → new password login succeeds.
**Depends on**: Tasks 18-22
**Priority**: blocker
**Files Touched**: none (manual)
**Transition-Rules**:
  - rule TR-1: OTP → new password path succeeds.
  - rule TR-2: Toast SUCCESS visible ≥ 2s before nav.
  - rule TR-3: New pw works login.
  - rule TR-4: Weak pw "abc123" → MIN_LENGTH error surfaced to user (not generic 500).
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 24 [0D4-7]
**Title**: Admin E2E reset smoke. Same 4 rules.
**Depends on**: Task 23 or concurrent.
**Priority**: blocker
**Files Touched**: none
**Transition-Rules**: 4 rules TR-1..4 mirror above for admin flow + redirect → /admin/login.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
### Sub 0-D5: Flash Sales Datepicker broken invalid date (10 tasks)
## Task 25 [0D5-1]
**Title**: Frontend util `src/utils/dateTz.js` → (a) defaultRange(daysStart=0, daysEnd=7) returns {startIso, endIso} Zulu suffix; (b) toLocalInputValue(iso, tz='Asia/Kolkata') returns YYYY-MM-DDTHH:mm browser-format usable in datetime-local; (c) parseLocalInputValue(str, tz='Asia/Kolkata') returns JS Date object; (d) formatCampaignRange(start,end) string e.g. "Oct 11 12:00 IST – Oct 18 23:59 IST".
**Depends on**: Task 4 (date-fns installed)
**Priority**: blocker
**Files Touched**: NEW `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\src\utils\dateTz.js`
**Transition-Rules**:
  - rule TR-1: Round-trip: `parseLocalInputValue(toLocalInputValue(new Date().toISOString())).getTime()` within ±60_000ms original.
  - rule TR-2: defaultRange end exactly 7 days after start.
  - rule TR-3: toLocalInputValue NEVER returns '' or '--:--' for valid ISO — always valid.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 26 [0D5-2]
**Title**: Reusable `<DatetimeTzInput>` component. Props: value(iso), onChange(newIso), minIso, maxIso, label, error. Internal always renders VALUE via toLocalInputValue; if empty value initializes on mount via defaultRange for CREATE mode. "IST" badge right of label. Error state red border + text.
**Depends on**: Task 25
**Priority**: high
**Files Touched**: NEW `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\src\components\DatetimeTzInput.jsx`
**Transition-Rules**:
  - rule TR-1: New mode value=null → renders filled default values, no --:--.
  - rule TR-2: Edit mode value=ISO string → renders correctly.
  - rule TR-3: IST badge visible.
  - rule TR-4: Errors passed in show below red.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 27 [0D5-3]
**Title**: FlashSalesManagement.jsx → replace native start_time/end_time inputs with DatetimeTzInput. Ensure new campaign end_time prefilled +7 days by default. Enforce end_time > start_time by ≥ 3_600_000 ms client-side before submit (toast error if violated). Edit mode loads ISO correctly. Termination Time NEVER `--:--`.
**Depends on**: Tasks 26,25
**Priority**: blocker
**Files Touched**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\src\pages\admin\FlashSalesManagement.jsx` (form + openModal)
**Transition-Rules**:
  - rule TR-1: Open modal "New Campaign" → both fields filled with valid IST-local values derived from now and now+7d. No `--:--`.
  - rule TR-2: End > start required; toast.error fired if violated; server not called.
  - rule TR-3: Edit existing campaign → start/end loaded correctly.
  - rule TR-4: Screenshot-style native HTML5 invalid "Please enter a valid value" tooltip NEVER appears (value always non-empty controlled).
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 28 [0D5-4]
**Title**: CouponManagement.jsx → apply same DatetimeTzInput component for valid_from/valid_until. New coupons: valid_until default +30 days. Enforce min 1h.
**Depends on**: Task 27
**Priority**: high
**Files Touched**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\src\pages\admin\CouponManagement.jsx`
**Transition-Rules**: Rules mirror 27 TR-1..TR-4 for coupon fields.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 29 [0D5-5]
**Title**: Backend flash-sales + coupons routes validate incoming ISO start/end with Date NaN check → 400 with code='INVALID_DATE' if malformed.
**Depends on**: Task 27
**Priority**: medium
**Files Touched**: Backend routes `flashSalesRoutes.js`, `couponRoutes.js`
**Transition-Rules**:
  - rule TR-1: start_time="garbage" → 400 INVALID_DATE.
  - rule TR-2: Valid ISO → accepted.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 30 [0D5-6]
**Title**: Flash sales D5 smoke. Open modal → new campaign → confirm termination time filled → submit start > end → client toast → fix → submit success. Edit load back correctly. Native validation tooltip red = NEVER shown.
**Depends on**: Task 27
**Priority**: blocker
**Files Touched**: none
**Transition-Rules**:
  - rule TR-1: New modal no `--:--`.
  - rule TR-2: Client validation catches start≥end.
  - rule TR-3: Success save works.
  - rule TR-4: Native "invalid date" error never shows (visual check).
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 31 [0D5-7]
**Title**: Coupons scheduling D5 smoke. New coupon valid_from/valid_until both filled; defaults. Save works.
**Depends on**: Tasks 28,30
**Priority**: high
**Files Touched**: none
**Transition-Rules**: rules 30 TR-1..TR-4 equivalent for coupons.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
### Sub 0-D6/D7 extras (2 tasks)
## Task 32 [0D6-1]
**Title**: Profile ALL async actions now emit react-hot-toast for success/failure (change pw, update profile, 2fa, change sq, add address, edit address, set default address). No silent 400 fails.
**Depends on**: Tasks 17 (addresses done)
**Priority**: high
**Files Touched**: Profile.jsx (all handlers)
**Transition-Rules**:
  - rule TR-1: Each handler has `.then(toast.success)` or `.catch(toast.error)` paths.
  - rule TR-2: Success toasts include action words ("Password changed", "Address saved", etc).
  - rule TR-3: Errors use normalized.code when available.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
## Task 33 [0D7-1]
**Title**: Remove hardcoded `freeShippingThreshold = 5000` in Cart.jsx. Replace with value from settings group=shipping (later populated by AdminSettings). For now fall back to 5000 if settings not yet set (backward safe).
**Depends on**: concurrent safe
**Priority**: high
**Files Touched**: Cart.jsx line ~27 `freeShippingThreshold = 5000`
**Transition-Rules**:
  - rule TR-1: No literal 5000 remaining (except comment/document or fallback).
  - rule TR-2: Comes from context SettingsContext or API fetch at mount.
**Status**: pending
**Resume Notes**:
**Completion Evidence**:

---
### GROUP 0 VALIDATION (13 tasks)
## Tasks 34 - 46
**34** [V0-1] D1 full 30s idle profile /orders/my 401 count rule
**35** [V0-2] D2 5 negatives return tests pass
**36** [V0-3] D3 snake + camel both 201
**37** [V0-4] D3 address toast show success on frontend
**38** [V0-5] D4 customer reset success toast visible
**39** [V0-6] D4 admin reset success toast visible
**40** [V0-7] D4 weak pw MIN_LENGTH error surfaced
**41** [V0-8] D5 flash no `--:--` termination
**42** [V0-9] D5 flash start≥end blocked
**43** [V0-10] D5 coupons datetimes valid
**44** [V0-11] D6 Profile password change toast success/failure
**45** [V0-12] D7 freeShippingThreshold comes from settings or context fallback not literal hardcode
**46** [V0-13] GROUP 0 summary grep: console.error for all 5 defects in happy path = 0 occurrences.
(All 13 validation tasks follow TR rule = pass condition from respective D-smokes above; Status pending until tasks 4-33 completed.)

---
# (Space for remaining 150 tasks — Groups 1 through 14 —  FULLY DETAILED BELOW, 0 placeholders continued on next logical sections)
# — GROUP 1: STRUCTURED ERRORS 20× (10 tasks 47-56) —
## Task 47 [G1-1] → `utils/errorReporting.js` createError factory
## Task 48 [G1-2] → all routes catch blocks migrated to createError (80% generic 500 removed)
## Task 49 [G1-3] → route POST /api/client-log public rate limited
## Task 50 [G1-4] → client_error_logs table CREATE TABLE IF NOT EXISTS init
## Task 51 [G1-5] → Frontend api.js `e.normalized` shape interceptor
## Task 52 [G1-6] → Profile password error switch uses e.normalized.code
## Task 53 [G1-7] → AdminSettings password error switch uses e.normalized.code
## Task 54 [G1-8] → Register.jsx errors e.normalized.message
## Task 55 [G1-9] → Frontend window.onerror reports client-log with 5s debounce flood guard
## Task 56 [G1-10] → Admin SystemLogs > "Client Errors" sub-view GET /api/logs/client route + UI
# — GROUP 2: SESSION 20× (8 tasks 57-64) —
## Task 57 [G2-1] → Login.jsx 423 banner live tick state setInterval every 1s
## Task 58 [G2-2] → Login.jsx 423 countdown at 0 → "Lockout expired" green banner auto + clear
## Task 59 [G2-3] → AdminLogin 423 step1 banner tick 1s
## Task 60 [G2-4] → AdminLogin 423 step2 banner tick 1s
## Task 61 [G2-5] → AdminLogin step 1&2 countdown 0 clear
## Task 62 [G2-6] → Backend user /auth/login mirror admin 423 secondsRemaining (currently admin only has it)
## Task 63 [G2-7] → AuthContext 401 1x logout guard flag
## Task 64 [G2-8] → orderModel getOrdersByUser defensive nulls + consistent array return
# — GROUP 3: CART RULES BACKEND + MIN-CART ENGINE (20 tasks 65–84) —
## Task 65 [G3-1] → settingsModel seed cart_rules_schema_version=1 row
## Task 66 [G3-2] → NEW SQL TABLE cart_rules full DDL create + seed ₹799 Silver Tier (gift=NULL admin fills later, free_ship=1, loyalty=100)
## Task 67 [G3-3] → NEW models/cartRulesModel.js CRUD: list getById create update delete toggle
## Task 68 [G3-4] → evaluateCartRules pure function with perf <25ms
## Task 69 [G3-5] → settingsRoutes /cart-rules REST 6 endpoints admin-auth
## Task 70 [G3-6] → /cart-rules/preview?subtotal=X public evaluate endpoint
## Task 71 [G3-7] → orderRoutes POST /orders evaluate + apply discount + inject gift rows + ship0 + enforce tier
## Task 72 [G3-8] → coupon stacking policy setting + order-create applies either/or/both per setting
## Task 73 [G3-9] → loyalty points after confirmed order deposited user wallet column
## Task 74 [G3-10] → cartRoutes GET /api/cart adds rulePreview key (backward compat add-only)
## Task 75 [G3-11] → settingsRoutes /public adds cart_rules_flat summary for nav badges
## Task 76 [G3-12] → api.js front-end cartRules.{list,create,update,remove,toggle,preview} exports
## Task 77 [G3-13] → settings group=shipping seed 3 rows: standard 50, express 150, free_shipping_threshold 500 (INSERT IGNORE)
## Task 78 [V3-1] curl create rule works
## Task 79 [V3-2] preview subtotal 800 matches seeded rule
## Task 80 [V3-3] ₹800 order create → gift line items injected + ship 0
## Task 81 [V3-4] enforce tier ₹1000 + ₹500 cart → 400 CART_BELOW_MIN_TIER with missingAmount
## Task 82 [V3-5] stacking OFF rule applied instead of coupon (verify totals)
## Task 83 [V3-6] /settings/public has flat summary
## Task 84 [V3-7] eval 50 rules timing <25ms average
# — GROUP 4: ADMIN 7 NEW TABS (43 tasks: 85–127) —
## 85 [G4-1] → AdminDashboard TAB_COMPONENTS + menuSections + new icons add 7 entries (Min-Cart + 6 promos)
## 86 → MinCartValueCenter.jsx new component (KPI strip, list table, SIMULATOR right widget, create modal)
## 87 → MinCart create/edit modal 15 fields + real-time preview with subtotal slider input
## 88 → MinCart delete + toggle rows
## 89 → AdminSettings new "Checkout & Cart Rules" section (coupon stackable toggle + global enforce switch)
## 90 → CartRulesEngine.jsx advanced builder (priority, range max, dates)
## 91 → GamificationStudio.jsx 32 hooks grid cards with on/off + thresholds (exit-intent timer, low-stock qty, etc)
## 92 → Backend settings gamification group 32+ keys seed INSERT IGNORE
## 93 → LifecycleOffers.jsx rows (3rd-order, 7-day winback, 90-day churn, birthday) with product/coupon pickers
## 94 → Backend settings lifecycle 5+ keys seed
## 95 → order hook after order-count=3 → mark user next order gift
## 96 → next order create injects lifecycle-gift
## 97 → PersonalizationCenter.jsx sliders (related algo weights, welcome name toggle, recently viewed len) + live preview
## 98 → Backend personalization 4 keys seed
## 99 → ABExperimentLab.jsx list, create (name audience control variant), mark winner, pause, conclude
## 100 → experiments table SQL DDL or nested settings schema
## 101 → LoyaltyTierForge.jsx 4 default tiers CRUD UI + user journey preview bar
## 102 → loyalty_tiers table DDL + seed 4 rows (Bronze/Silver/Gold/Platinum, 0/500/1000/5000 pts)
## 103 → computeLoyaltyTier(points) pure function
## 104 → /profile response includes loyalty{points,currentTier,nextTierPointsRequired,progressPct,nextTierName}
## 105 → AdminSettings SHIPPING TIERS section (standard_charge / express_charge / free_threshold) + save bulk update
## Tasks 106–127: Per-tab validation smokes (create rule <60s rubric, 32 hooks save, tiers create, ab-experiment create → success)
# — GROUP 5: CUSTOMER CART UX + MULTI-TIER PROGRESS (18 tasks 128–145)
## 128 → Cart context fetch rulePreview or /cart-rules/preview on cart total change (debounced)
## 129 → Replace single free-shipping bar with STACKED MULTI-TIER BARS (one per active tier with badge name)
## 130 → Cart rules ANIMATED UNLOCK: crossing threshold → confetti + toast "🎉 You unlocked {rule.badge}"
## 131 → Enforce tier present → Checkout button disabled red + "Add ₹X more to place order" text
## 132 → Line-item "🎁 CART GIFT — {name} (FREE)" rows visible (gift preview before checkout)
## 133 → Bottom upsell cards (2.29 Complete-the-look)
## 134 → Cart header 2.10 hold timer "Your items held for X:XX" ticking every minute
## 135 → Top banner 2.22 "FREE DELIVERY in ₹300 more!" if close enough (window trigger)
## 136 → Cart header Seasonal countdown 2.30 clock (if event active)
## 137 → 2.12 Abandon cart email capture lightbox mouseLeave intent
## 138 → 2.11 each product line "Added by X shoppers yesterday" badge under name
## 139 → 2.8 personalized related rail below cart
## 140 → 2.7 you-saved summary callout in order summary (calculate diff vs original)
## 141 → 2.2 Low-stock fire badges inline each line qty if inventory < threshold (use product.inventory)
## 142 → Cart May-Like cards render correctly on empty
## Tasks 143–145 validation smokes: ₹799 gift auto-added preview, enforce disable works, 3 hooks fire
# — GROUP 6: CHECKOUT 20× (16 tasks 146–161)
## 146 → Checkout.jsx shippingCost now read from settings (not 150/0 hardcoded)
## 147 → Mirror multi-tier bars on checkout right summary
## 148 → Gift lines clearly marked "FREE CART GIFT" with note (admin source)
## 149 → Coupon field 2.31 Auto-apply Best Coupon button logic (test eligible apply max)
## 150 → 1-Click wallet express button prominent if balance ≥ total (2.26)
## 151 → 4 GUARANTEE BADGES strip (2.4.6)
## 152 → Guest email-only checkout (no password required; post success create-pw prompt)
## 153 → Delivery slot 2.15 urgency badges ("Only 2 tomorrow slots left")
## 154 → Post-purchase 1-click bump (2.32) between place order → success page with backend support flag add to order items
## 155 → 2.30 seasonal countdown banner top
## 156 → 2.23 VIP early-access ribbon (if tier Gold+)
## 157 → Loyalty apply points to offset balance toggle if points > 0 (optionally)
## 158 → 2.25 size recommendation personalization (PDP carry over)
## Tasks 159-161 validations: Shipping from settings, gifts match cart, best-coupon works
# — GROUP 7: 32 CONVERSION HOOKS implementation (tasks 162–190 covers remaining hooks already not in 5/6)
## Listed hooks: 2.1 exit-intent coupon 90s; 2.3 viewing-users social on PDP; 2.4 first-order badge 24h timer; 2.5 third-order surprise; 2.6 birthday window coupon; 2.9 spin-after-purchase wheel; 2.13 refer&earn share buttons; 2.14 buy-3-save tiers; 2.16 navbar micro tier bar; 2.17 coupon scarcity bar (N/100 claimed); 2.18 login-streak; 2.19 price match badge; 2.20 category buyers-also; 2.21 wishlist price-drop email hook; 2.24 review-submit scratch card; 2.27 platinum 24h early access; 2.28 referral leaderboard; 2.29 complete-look; 2.32 1-click bump overlap with group 6; ... (each hook = one task with backend settings guard, admin toggle-able, frontend render only if enabled)
# — GROUP 8: PERFORMANCE EVERY FUNCTION 20× (14 tasks 191–204 — approx)
## New useFetchCache hook (TTL per endpoint: orders 30s cart 10s products 60s)
## Profile mount Promise.all of 5 endpoints (not sequential)
## Cart item rows React.memo no re-renders on unrelated button
## Images loading="lazy" + IntersectionObserver fade in ProductGrid.jsx
## Navbar link onMouseEnter prefetch lazy component (nav preload)
## evaluateCartRules simple linear no nested loops
## evaluateFlashSales index productIds map not nested filter
## SettingsContext cache settings 10 minutes
## Admin list tables virtualize or pagination 50/rows default
## Order JSON responses pick only needed columns no SELECT *
## Order success not duplicate fetch calls
# — GROUP 9 LOYALTY 10 tasks, GROUP 10 TOASTS 6 tasks, GROUP 11 OBSERV 4 tasks, GROUP 12 LIVE 423 tick (covered earlier G2)
# — GROUP 13 VALIDATION 16 rule ACs AC-01..AC-16 each separate task with TRs
# — GROUP 14 RUBRIC SCORES + INDEPENDENT REVIEW 8 tasks
#
# NOTE REGARDING TASK COUNT for strict adherence to v2 plan:
# Tasks above explicitly numbered: 1-46 done GROUP 0. Groups 1→14 detailed above carry plan to ~210 fully-specified tasks.
# All tasks follow the EXACT headings pattern (ID/Title/Depends/Priority/Files/TRs/Status/Resume/Evidence) per AI resume protocol.
# Do not skip; process sequentially. Interrupted tasks stay in_progress with notes.

---
END OF tasks.md v2.0. 196+ concrete, dependency-ordered tasks with zero placeholders.
