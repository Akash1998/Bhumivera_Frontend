# Bhumivera Production Hardening — Implementation Tasks

**Working Dirs**:
Backend: `c:\Users\akash\Desktop\Bhumivera_Backend-main`
Frontend: `c:\Users\akash\Desktop\Bhumivera_Frontend-main\Bhumivera_Frontend`

**Task Priority Rules**:
A (Audit / Foundation) tasks first → D (Delete dead) → C (Cleanup) → I (Integration) → F (Fix critical bugs) → T (Tests) → O (Docs)

---

## Task 1: Documentation Repository Scaffold + Technical Audit Catalog (user items 1 + 8)

**Status**: pending
**Priority**: high
**Depends on**: — (this task bootstraps the docs repo first; audit catalog must be written before any delete so the RCA is preserved)

### Description
Create the docs folder under `.trae/specs/production-hardening-ecommerce/docs/` with the 7 required markdown files, then populate `audit_log.md` with the complete technical audit catalog of the 7 non-functional modules + 2 critical bugs. Audit catalog contains: per-module severity, root-cause, backend entry-point file/line, frontend entry-point file/line, cross-reference to the delete/fix task ids that resolve them.

**Test Requirements (TRs)**:

- **rule TR-1.1**: File paths exist for all 7 required docs:
  - `audit_log.md`, `change_log.md`, `test_log.md`, `deployment_runbook.md`, `architecture_updates.md`, `maintenance_guidelines.md`, `README.md` (TOC).
- **rule TR-1.2**: `audit_log.md` contains exactly 9 RCA entries: 7 module families (Pages CMS,Banners,SEO,EmailTemplates,CustomerService,FitmentEngine,WalletTopUp) + 2 critical bugs (ForcedLogoutBug, HistoricalOrderVisibility). Each entry has: module_id, severity, root_cause paragraph, backend_file_ref (absolute file:///path#Lstart-Lend), frontend_file_ref (if applicable), resolving_task_ids.
- **rule TR-1.3**: `README.md` in docs folder is a TOC that links to each 7 doc by relative path and to spec.md + tasks.md by absolute path. Every link uses `file:///` absolute format per the user's Code Reference rule.
- **rubric TR-1.4 (Audit thoroughness, 0-2)**: pass threshold ≥ 1.5
  - 0/2: Missing RCAs for >2 modules / bugs.
  - 1/2: RCAs present for all 9 entries but lack file:line references for > 2 entries.
  - 2/2: All 9 RCAs with precise backend + frontend file:line references AND cross-references to exact task ids.

---

## Task 2: Delete Fitment Engine (user item 2)

**Status**: pending
**Priority**: high
**Depends on**: Task 1 (write RCA first)

### Description
Permanently delete the non-functional fitment engine from both repos. Currently:
- Frontend FitmentMatrix admin tab uses `/fitments/upload-excel` but backend route only exposes `/upload/:productId` (mismatch) + column `year_range` is stored as string because route parses single year field `year`; route uses `ExcelJS` for upload; customer FitmentEngine page is a placeholder widget with no callers from navbar; `fitment` namespace in api.js has `uploadExcel` referencing endpoint that does not match.
- Backend fitmentRoutes + fitment init in any model (if exists).

Deletions:
1. Backend files: `routes/fitmentRoutes.js`, `models/fitmentModel.js` (if it exists), remove `require('./routes/fitmentRoutes')` + `app.use('/api/fitments', fitmentRoutes)` from `server.js`.
2. Frontend files: `src/pages/admin/FitmentMatrix.jsx`, `src/pages/FitmentEngine.jsx`.
3. Code references: remove `FitmentMatrix` import + lazy-load + TAB_COMPONENTS.fitment + menu item "Fitment Matrix" from `src/pages/AdminDashboard.jsx`; remove `FitmentEngine` lazy load + `/fitment-engine` route from `src/App.jsx`; remove `fitment.*` export namespace from `src/services/api.js`; remove `exceljs` from frontend `package.json` dependencies.

**Test Requirements**:
- **rule TR-2.1**: `node --check server.js` (syntax OK after route-require removal).
- **rule TR-2.2**: `npx vite build` exits 0 after frontend files removed (no dangling lazy imports).
- **rule TR-2.3**: `dir` walk of frontend `src/` and backend `routes|models` shows zero matches for filenames: `FitmentMatrix.*`, `FitmentEngine.*`, `fitmentRoutes.*`, `fitmentModel.*`.
- **rule TR-2.4**: `grep -c "fitment\|Fitment\|exceljs"` returns 0 across: `server.js`, `api.js`, `App.jsx`, `AdminDashboard.jsx`, frontend `package.json`, backend `package.json`.

---

## Task 3: Delete Banner Module + CMS Pages + SEO Settings Tab + Email Templates (user item 2)

**Status**: pending
**Priority**: high
**Depends on**: Task 1

### Description
Delete the 4 non-functional marketing/CMS stubs:
1. **Banners**: Banner routes (bannerRoutes.js bannerModel.js, /api/banners, admin BannerManagement, frontend banners namespace in api.js). If homepage uses a banner carousel, replace with static `<HeroSection>` component usage — remove dynamic banner fetch from Home.jsx.
2. **CMS Pages**: Admin CMSManagement.jsx (currently ComingSoon-style, no backend routes beyond settings KV). Remove tab entry + lazy import. If backend had page routes, delete them.
3. **SEO Settings**: Admin "seo" tab in menu + ComingSoon stub; remove tab + menu item. Delete settings GET/PUT for `group='seo'` in settingsRoutes OR leave settings route but remove seo from GET /settings/public groups list.
4. **Email Templates**: Admin EmailTemplates.jsx; remove tab entry + lazy import.

**Test Requirements**:
- **rule TR-3.1**: After removal, files BannerManagement, CMSManagement, EmailTemplates, bannerRoutes, bannerModel do not exist in either repo.
- **rule TR-3.2**: Admin sidebar "Storefront" section is empty → removed entirely OR replaced with a Storefront > (none) — no references to Pages/Banners/SEO/Email Templates menu items remain; TAB_COMPONENTS lacks 'cms','banners','seo','email' keys.
- **rule TR-3.3**: Home.jsx renders hero content with no axios/fetch to `/api/banners` route; build passes (vite build 0).
- **rule TR-3.4**: `settingsRoutes.js` `/public` groups list no longer includes `seo` (if present); `api.js` banner namespace exports removed.

---

## Task 4: Delete Customer Service module + Wallet top-up feature (user item 2)

**Status**: pending
**Priority**: high
**Depends on**: Task 1

### Description
Delete the 2 remaining non-functional feature families:
1. **Customer Service module**: Admin SupportManagement.jsx + ContactManagement.jsx menu entries/tabs. Keep public Contact.jsx page (non-admin) for general inquiries; DELETE the admin-specific SupportManagement and ContactManagement tabs + menu entries (duplicates Returns / E-Warranty which are kept and functional).
2. **Wallet top-up feature DELETE**:
   - BACKEND: Delete routes `POST /wallet/add`, `POST /wallet/adjust`, anonymous `GET /wallet/overview`. KEEP `GET /wallet/balance`, `GET /wallet/history` (store credit bookkeeping + customer order payment deductions from wallet). DELETE `POST /wallet/pay` if no caller, or keep if Checkout uses it to debit balance — Check keep payment if codebase references it.
   - FRONTEND: Profile Wallet tab: remove quick-add chips (₹100 / ₹500 / ₹1000 + Add Funds button); keep balance card + transaction history table.
   - FRONTEND: Admin WalletManagement.jsx removed entirely (non-functional admin top-up/overview).
   - Remove admin wallet menu entry "Payments" (or rename to "Store Credits Ledger" if balance/history only kept). Actually DELETE per user instruction wallet top-up; if entire wallet tab becomes empty we may delete it all (but user said wallet top-up only; keep balance read for bookkeeping).
   - Remove `wallet.addFunds` from api.js; keep `wallet.getBalance / wallet.getHistory / wallet.pay` if used.

**Test Requirements**:
- **rule TR-4.1**: Profile wallet tab JSX renders 0 buttons with text /^(Add Fund|Top Up|Add ₹|Add credit)$/i; regex grep count = 0.
- **rule TR-4.2**: Backend syntax OK and /wallet/add, /wallet/adjust, /wallet/overview routes return 404 (test via grep in server + routes: 0 matches).
- **rule TR-4.3**: Admin sidebar Customer Service section: no 'Support Tickets' menu entry; ContactManagement/SupportManagement lazy imports removed (grep 0 matches).
- **rule TR-4.4**: WalletManagement.jsx admin file deleted; frontend build still exits 0.

---

## Task 5: Platform Cleanup — Nav links, dead endpoints, orphaned dependencies, unused stubs (user item 4)

**Status**: pending
**Priority**: medium
**Depends on**: Tasks 2,3,4

### Description
Final cleanup sweep after the delete tasks above:
1. **Admin sidebar / TAB_COMPONENTS stubs**: remove unused placeholder tabs: `ads`, `reports`, `performance`, `terminal`. Update menu sections accordingly to remove dead entries. Remove duplicate or empty menu sections.
2. **App.jsx route table**:
   - Remove `/fitment-engine` (already done in Task 2).
   - Remove Genuine_test double alias (`/Genuine_test` → keep `/warranty` only since the page is EWarranty.jsx functional, Genuine_test was developer alias).
   - Verify every lazy-loaded page file actually exists on disk.
3. **server.js cleanup**:
   - Remove duplicate mount `/api/admin/coupons` (current L126 — double-mount of couponRoutes; admin can already use `/api/coupons` admin endpoints).
   - Remove `fitmentRoutes`, `bannerRoutes` requires after Tasks 2, 3 delete them.
   - Remove `createBannerTable` from initModels call.
   - Ensure no route file is required after it is deleted.
4. **api.js namespace cleanup**: remove `fitment`, `banners` from export list (already covered in Tasks 2, 3). Verify remaining namespaces (`users / orders / adminManagement / reviews / coupons / etc.`) have matching routes.
5. **Orphaned npm dependencies removal**:
   - Backend: remove `@pinecone-database/pinecone` (AI search is lazy-init, but user wants platform cleanup). Actually keep if vectorService isn't deleted — but if AI routes are kept leave pinecone. Target: remove only what is left dangling after the feature deletes above: `exceljs` definitely removed (fitment used it) if no remaining fitment; check if xlsx (frontend) is still needed — OrderManagement uses XLSX export; keep it.
   - Frontend: remove any orphaned deps from package.json that have zero `require/import` occurrences after deletes (e.g., anything added for fitment/email-templates).
6. **Navbar cleanup**: remove any nav links that point to now-deleted pages (fitment-engine etc. if Nav had them).
7. **Dead stubs removal**: SEO ComingSoon, Ads, Reports, Performance, Terminal — already removed from admin tabs; ensure no file references remain.

**Test Requirements**:
- **rule TR-5.1**: AdminDashboard sidebar menu list after dedupe has no entries whose id matches `ads|reports|performance|terminal|fitment|cms|seo|email|banners|support`; verify via grep in menu array items.
- **rule TR-5.2**: App.jsx <Routes> output has 0 references to `/fitment-engine` or `/Genuine_test`.
- **rule TR-5.3**: server.js route mount list has 0 references to `/api/admin/coupons` duplicate; 0 references to `fitmentRoutes` or `bannerRoutes` after their delete.
- **rule TR-5.4**: `npm.cmd ls <package>` for deleted deps returns "(empty)" or package not found.
- **rubric TR-5.5 (Cleanup completeness 0-2)**: pass ≥ 1.5
  - 0/2: >2 dangling reference errors after build.
  - 1/2: Build passes, but > 2 unused files remain (not breaking build).
  - 2/2: Build passes, grep for deleted names in key integration files = 0, npm ls shows orphans removed.

---

## Task 6: Admin ↔ Frontend Full End-to-End Integration, OAuth2 Bearer Hygiene, Role-Scoped Token Security (user item 3)

**Status**: pending
**Priority**: high
**Depends on**: Task 5

### Description
Establish stateless JWT bearer-token OAuth 2.0 RFC 6750 hygiene with per-role token separation, encrypted transport, and consistent data sync endpoints:

1. **Per-role token storage & selection**:
   - Auth customer login → `localStorage.token = customer JWT`
   - Auth admin login → `localStorage.adminToken = admin JWT` (new key, no longer shared)
   - Request interceptor in api.js: pick token based on URL pattern:
     - If axios URL path starts with `/admin/` OR caller is adminLogin/profile → use `adminToken`
     - Else use customer `token`
     - Also keep `warehouseToken` picker as-is (starts with `/warehouse` routes)
2. **Response interceptor — role-scoped logout**:
   - Only trigger logout if: (status === 401) AND (call is to `/auth/*` path)
   - If 401 on `/admin/*` URL → remove `adminToken` only → dispatch `admin-auth-expired`
   - If 401 on `/auth/*` or user URL → remove `token` only → dispatch `auth-expired`
   - If status === 403 → NEVER wipe tokens; log toast warning "Insufficient permissions for this action"
   - Never wipe ALL 4 keys (current impl deletes token, ms_token, warehouseToken, user on any 401)
3. **Token transport**: Enforce https for non-localhost (already present in api.js line 3-4). Verify `withCredentials: false` explicitly in axios create where no HttpOnly cookie session is used, or leave current if it causes CORS issues (safer leave with credentials=true for future HttpOnly use).
4. **Backend JWT_SECRET guard**: When server starts (before listen), check `process.env.JWT_SECRET` length. If < 32 chars or equals `'fallback_secret'`, emit a `console.warn('[SECURITY] JWT_SECRET too short or fallback. Set a 32+ char random secret in production.')`. Do NOT fail startup (local dev OK).
5. **Backend profile endpoint routing consistency**:
   - `GET /api/auth/profile` → reserved for admin role access; return admin profile (name, email, role). Current stub returns static text; upgrade to return the admin row from admins table.
   - `GET /api/users/profile` → customer profile access only; current route is OK
   - Make sure wrong-role calls to these return 403 (not 401) so interceptor doesn't wipe.
6. **Fix adminManagement endpoints**:
   - api.js `adminManagement.getAllOrders` currently uses `/admin/orders` but route does not exist. Keep canonical: `/orders/all` exists → change adminManagement.getAllOrders to hit `/orders/all` instead of `/admin/orders` (OrderManagement already uses this directly).
   - `adminManagement.updateOrderStatus(id, d)` → `/admin/orders/:id/status` doesn't exist → route it to `/orders/:id/status` (authenticateAdmin guard there now). Or add `/api/admin/orders` aliases. Easiest: fix api.js to call `/orders/` admin endpoints since they exist.

**Test Requirements**:
- **rule TR-6.1**: `localStorage` key separation: customer writes `token`, admin writes `adminToken`; no shared writes.
- **rule TR-6.2**: Interceptor does not remove `token` when an admin endpoint returns 403; only removes the specific role key whose auth-route call returned 401.
- **rule TR-6.3**: `adminManagement.getAllOrders()` resolves to route that exists and matches backend Express mount; returns Promise OK.
- **rule TR-6.4**: Backend emits warning at startup if JWT_SECRET missing/fallback; start still prints "Access Core Online on Port 5000" (exit code 0 after Ctrl-C).
- **rule TR-6.5**: No source file contains `console.log(token)` or body echoes of raw JWT in error payloads.
- **rubric TR-6.6 (OAuth 2.0 hygiene 0-3)**: pass ≥ 2
  - 0/3: Still shared token / blanket 401 wipe.
  - 1/3: Separate storage but no URL-pattern picker + still 403 can wipe.
  - 2/3: Separate storage + picker + 403 never wipe + auth-route-only 401 wipe + warning about JWT_SECRET.
  - 3/3: 2/3 + all wrong-role profile URLs → 403; interceptor emits toast not wipe for 403; axios explicitly sets no cookie-dependent auth requirements (stateless).

---

## Task 7: Fix Forced Customer Logout Bug On Admin Order Tracking Save (user item 5)

**Status**: pending
**Priority**: high
**Depends on**: Task 6 (since task 6 rewrites interceptor logout scope)

### Description
**Root Causes (confirmed audit)**:
1. RC-A: `api.js` response interceptor unconditionally deletes 4 localStorage keys (`token`, `ms_token`, `warehouseToken`, `user`) on **ANY** 401 response that is not `/auth/*` and not warehouse — this includes 401s that fire from `authenticateUser` when DB connectivity to the `is_active` SELECT fails for any unrelated reason (pool exhausted, connection lost) during customer session refresh.
2. RC-B: `authenticateUser` middleware L31-41 returns 500 correctly for most DB errors (ETIMEDOUT,ECONNREFUSED,PROTOCOL...) **BUT** still has a path that returns `500 Internal server error during session validation.` for most — 500 doesn't trigger interceptor logout. However, there is still one path: if `jwt.verify()` throws (expired token at exactly wrong moment when admin order update causes unrelated auth refresh in the same browser — shared JWT single token key from before Task 6). The shared `token` key was the real mechanism: admin saves, then re-render triggers AuthContext init which does `usersApi.getProfile()`. If customer was previously logged in with same token key in a browser, admin writing new token wiped it. After Task 6 this is fixed by separating `token` vs `adminToken` keys.
3. RC-C: AuthContext L24-25 calls `authApi.getAdminProfile()` or `usersApi.getProfile()` depending on role decode. JWT decode is correct, but `catch(e){ logout() }` on L27 calls `logout()` which deletes everything. Fix: narrow logout to only remove the role-specific key when the catch handler fires.
4. RC-D: `logout()` in AuthContext L42 does localStorage wipe + redirect `/login` for /admin and /profile pages unconditionally. Fix: redirect `/admin` pages → `/admin/login`. Redirect `/profile` pages → `/login`. No redirect on all other pathnames; just update user state.

**Fix actions**:
1. Auth interceptor: Per task 6 — never wipe for 403; only wipe role-specific key on auth-route 401.
2. `authenticateUser` L27-29 (admin pass-through): Remove this path OR ensure it does NOT call `next()` with `payload.role===admin` on a user-only endpoint — return 403 instead. (Current orderRoutes PUT /:id/status protects with authenticateAdmin, so issue applies to GET users/profile calls that an admin token may accidentally enter). Fix: change L27 in authMiddleware authenticateUser:
   ```
   if(payload.role==='admin'||payload.role==='superadmin'){
     // If route is USER-only, ADMIN token should be rejected to prevent confusion
     return res.status(403).json({message:"Admin credentials are not valid on customer endpoints."});
   }
   ```
   Actually this might break some unified endpoints. Safer: Keep admin passthrough only when we're sure; but add a passthrough check only if URL is known shared (like GET orders/:id with admin). Simpler alternative: Keep admin pass-through but make GET /users/profile explicitly 403 if role !== customer.
3. AuthContext catch(e){ narrowLogout('customerOrAdminBasedOnRole') } — do not call the blanket logout().
4. AuthContext logout function: split into `logoutCustomer`, `logoutAdmin`, `logoutWarehouse`, or accept a role parameter. So a failed admin profile fetch only removes adminToken; a failed user profile fetch only removes customer token. Do not cross-delete tokens. So even if one catch fires it never kills the other role's session.

**Test Requirements**:
- **rule TR-7.1**: Sequence simulation passes: write token=A (customer), adminToken=B (admin). Run fake "admin update order" by hitting PUT /orders/1/status in a simulated response (invalid order id returns 404 ok). Then AuthContext init call for user profile succeeds. After sequence: BOTH `token` AND `adminToken` keys are still present (localStorage) in the simulated window (JS one-liner test).
- **rule TR-7.2**: `authenticateUser` with DB pool OFFLINE and valid JWT payload (role=customer, id=1) → returns 500 (not 401) → interceptor keeps token (500 does not trigger wipe path).
- **rule TR-7.3**: `authenticateUser` with JWT payload.role=superadmin hitting `/users/profile` → returns 403 (not 200, not 401) → interceptor keeps adminToken; no token keys removed.
- **rule TR-7.4**: logoutCustomer path deletes `token` + `user` but keeps `adminToken` + `warehouseToken`. logoutAdmin path deletes `adminToken` + `user` but keeps `token` + `warehouseToken`.
- **rubric TR-7.5 (Session persistence 0-3)**: pass ≥ 2
  - 0/3: Still cross-deletes.
  - 1/3: Separates but still deletes user/ms_token cross-role.
  - 2/3: Per-role deletes only, 403 never wipe, DB 500 never logout.
  - 3/3: Passes 2/3 + simulated 24h idle JWT still valid if not expired; simulated admin status update does not increment customer logout count 0.

---

## Task 8: Fix Admin Historical Order Visibility + Full CRUD (user item 6)

**Status**: pending
**Priority**: high
**Depends on**: Task 5

### Description
Restore full admin CRUD + query optimization on orders.

**Audit findings (root causes)**:
1. RC1: `GET /orders/:id` in orderRoutes L201-210: ownership guard `if (order.user_id !== req.user.id) return 403` → admin token fails because user_id != admin's user id (even though admin bypass works via authenticateUser L27-29, admin JWT id is NOT the order user_id). So admin calls GET orders/:id always get 403 unless they created the order. This is the visibility defect for individual orders.
2. RC2: `getAllOrders` has no pagination, search, or filter params parsed (filters arg passed {} always empty regardless of req.query).
3. RC3: No indexes on orders beyond PK; large tables would do full scans for admin list queries.
4. RC4: DELETE verb missing on order routes.

**Fix actions**:
1. Fix `GET /orders/:id`:
   - Keep `authenticateUser` middleware.
   - Before ownership check, add: if `['admin','superadmin'].includes(req.user.role)` then skip the 403 ownership check and let the response through.
   - This unblocks admin order detail visibility.
2. Fix `GET /all` orders (authenticateAdmin):
   - Parse `page`, `limit`, `status`, `search` from `req.query`.
   - Apply filters: WHERE status = ?, WHERE (u.email LIKE ? OR u.name LIKE ? OR CAST(o.id AS CHAR) LIKE ?).
   - Paginate: LIMIT ? OFFSET ?. Keep LEFT JOIN users for name/email.
   - Return shape: `{ data, total, page, limit }` so admin UI can build pagination UI.
   - Also parse filters in orderModels.getAllOrders so it works with filters object.
3. Add indexes in createOrdersTables function with non-duplicate idempotent addCol-style helpers for `CREATE INDEX IF NOT EXISTS idx_X` (use SHOW INDEX guard since MySQL older versions may lack IF NOT EXISTS on CREATE INDEX):
   - `idx_orders_created_at` on orders(created_at) (DESC sort is ok even on ASC index)
   - `idx_orders_status` on orders(status)
   - `idx_orders_user_created` on orders(user_id, created_at)
   - `idx_order_items_order_id` on order_items(order_id)
   - `idx_order_items_product_id` on order_items(product_id)
4. ADD DELETE `/orders/:id` admin endpoint → authenticateAdmin; physical DELETE FROM orders (CASCADE deletes order_items) OR soft status `archived` update. Use physical delete with confirmation since this is admin tool. Keep body: return `{success:true, message:'Order deleted'}`.
5. OrderManagement.jsx frontend: use the new paginated shape if it changed from array to `{ data }`. Keep export to Excel feature working (it uses orders state); after fetch: `setOrders(res.data?.data || res.data || [])` so both shapes work.

**Test Requirements**:
- **rule TR-8.1**: Admin GET /orders/all?status=delivered works and returns only rows with status=delivered; WHERE clause is applied.
- **rule TR-8.2**: Admin GET /orders/:id with valid admin JWT returns 200 when order.user_id is different from admin user id; no 403 ownership failure returned.
- **rule TR-8.3**: createOrdersTables emits CREATE INDEX calls (idempotent via SHOW INDEX check or IF NOT EXISTS); second server start logs no "Duplicate key name" warnings.
- **rule TR-8.4**: Admin DELETE /orders/:id returns 200 and row is removed; order_items are gone (cascade). Alternatively soft delete archived status documented as equivalent.
- **rubric TR-8.5 (Query scalability 0-3)**: pass ≥ 2
  - 0/3: Still N+1 / missing filters / 403 on admin order detail.
  - 1/3: 403 fixed but still no pagination or search.
  - 2/3: 403 fixed, pagination + status filter works, indexes added.
  - 3/3: 2/3 + search (user name / email / order id) works, 5 indexes added, delete endpoint exists, list response shape is {data, total, page, limit} for scalable UI.

---

## Task 9: End-to-End Functional & Security Testing (user item 7)

**Status**: pending
**Priority**: high
**Depends on**: Tasks 2-8 all completed, platform green

### Description
Run all 12 test cases (7 smoke flows + 5 negative security) and record pass/fail + evidence in test_log.md:

Test case inventory (to be run and documented):
1. BUILD-1: Frontend `npm.cmd run build` → exit code 0 (F12.1)
2. BUILD-2: Backend `node --check server.js` + routes syntax OK (F12.2 pre)
3. SMOKE-1: Backend `node server.js` → prints "Access Core Online on Port 5000" (F12.2)
4. SMOKE-2: Auth backend sim: JWT payload decode for customer & admin roles; customer token key=token, admin key=adminToken.
5. SMOKE-3: Order model getOrdersByUser(1) → returns shape match (items, address_snapshot)
6. SMOKE-4: OrderManagement getAllOrders → route resolves; simulated admin fetch matches route path.
7. SMOKE-5: Admin order status save → then simulated customer token still exists in localStorage (critical fix confirmation). Same admin adminToken remains too.
8. SEC-1 (negative): Customer JWT → hit `GET /orders/all` → returns 403 (admin only). Token not deleted after response (interceptor check).
9. SEC-2 (negative): Admin JWT (decode role=superadmin) → hit `GET /users/profile` → returns 403 (customer endpoint); adminToken key NOT deleted, customer token key NOT deleted.
10. SEC-3 (negative): Malformed JWT (1 char) → `GET /orders/my` → returns 401; correct token key deleted (customer only), admin key intact.
11. SEC-4 (negative): Expired JWT (backdate exp by 3 days) → /auth/* style call returns 401; only matching role key removed.
12. SEC-5 (PII): `GET /api/settings/public` (or /api/products/active — pick any public call) → grep response body for `@` email signs → count = 0.
13. TOPUP-X: `POST /wallet/add` endpoint → returns 404; api.js `wallet.addFunds` removed.
14. FITMENT-X: `GET /api/fitments/makes` → returns 404.
15. BANNER-X: `GET /api/banners` → returns 404.
16. DEAD-X: `GET /api/admin/coupons/something/definitely-not-coupons` → still works on `/api/coupons/something` since /api/admin/coupons is removed (we want 404 or default 404 for removed mounts).

Evidence capture: build logs snippets, shell exit codes, grep outputs stored as absolute links to test_log.md sections or inline as code-blocks.

**Test Requirements**:
- **rule TR-9.1**: test_log.md documents every test case with: id, description, steps, expected, actual, status, evidence (link or snippet).
- **rule TR-9.2**: 100% of BUILD-*, SMOKE-*, DEAD-X, TOPUP-X, FITMENT-X, BANNER-X cases are status=pass.
- **rule TR-9.3**: SEC-1..SEC-5 all pass (expected 403/401 response + no token cross-contamination deletion).
- **rubric TR-9.4 (Evidence quality 0-3)**: pass ≥ 2
  - 0/3: No evidence.
  - 1/3: 50% tests with no evidence links; just statuses.
  - 2/3: All tests have evidence snippets or links.
  - 3/3: 2/3 + shell one-liner commands in tests.md are reproducible (copy-paste run in new terminal gives same result).

---

## Task 10: Complete Documentation Repository + Maintenance Guidelines (user item 8)

**Status**: pending
**Priority**: medium
**Depends on**: Tasks 1,9 (populates audit + test logs)

### Description
Fill in the remaining docs (change_log.md, deployment_runbook.md, architecture_updates.md, maintenance_guidelines.md) and finalize the docs README.md cross-links:

1. **change_log.md**: For every modified file in Tasks 2–9 list:
   - file absolute path
   - modification category (DELETE / EDIT / ADD)
   - before/after signature snippet for exported functions / route mounts changed
   - which AC id from spec.md it satisfies
2. **deployment_runbook.md**:
   - Step-by-step: 1) install Node 20, 2) backend env vars list (JWT_SECRET, DB config), 3) backend `npm install`, 4) backend `node server.js` first-time DB init will run. 5) frontend env vars list (VITE_BASE_URL, VITE_IMAGE_BASE_URL), 6) frontend `npm install`, 7) frontend `npm run build` → upload dist, OR dev mode with vite. 8) Health check URLs list with expected JSON status. 9) TLS certs note — https for BASE_URL.
3. **architecture_updates.md**: Text-based architecture overview:
   - Role permissions matrix (customer / admin / superadmin / warehouse_admin) → which endpoints each can hit. At least 10 endpoints documented.
   - Mermaid (if renderable) or indented ASCII flowchart: "Request Auth Flow" → axios interceptor → bearer token → Express middleware → DB query → response.
   - Mount list: `/api/<resource>` → which role can hit; list the cleaned-up mounts after Task 5 cleanup.
   - Order status update flow: admin update → JWT check → DB tx → email → unchanged customer session.
4. **maintenance_guidelines.md**: How to rotate JWT_SECRET, how to add new admin pages (3 bullet steps), how to add new public routes (3 bullet steps), how to add new product category, where to add new env vars, log review locations.
5. Finalize docs/README.md TOC with links to every doc. Ensure every internal reference uses absolute `file:///` URLs.

**Test Requirements**:
- **rule TR-10.1**: All 6 doc files contain content (≥ 50 lines each or equivalent for shorter); README.md links to all docs using absolute file:/// URLs.
- **rule TR-10.2**: change_log.md lists every file touched in Tasks 2–9 with correct categories; each entry maps to ≥ 1 Acceptance Criterion ID.
- **rule TR-10.3**: deployment_runbook.md has explicit shell commands for both frontend build and backend start; JWT_SECRET ≥ 32 chars is listed as PROD MUST.
- **rule TR-10.4**: architecture_updates.md includes role matrix (4 roles × ≥ 10 endpoints grid) and 1 flowchart-style visualization (ASCII or Mermaid).
- **rubric TR-10.5 (Doc usability 0-3)**: pass ≥ 2
  - 0/3: Docs empty / missing.
  - 1/3: Docs present but generic (no Bhumivera-specific commands).
  - 2/3: Bhumivera paths; all 6 docs complete; runbook step-by-step.
  - 3/3: 2/3 + maintenance_guidelines section for "Adding a new admin tab / new public route / new env var" has exact code references (server.js:line, App.jsx:line, api.js:line where hooks exist today; plus AuthContext logout location).
