# Bhumivera Production Hardening — Audit Log (RCA Catalog)

## Legend

| Severity | Definition |
|----------|------------|
| **CRITICAL** | Direct security exploit, mass customer logout, or admin data-access blackout; production blocker |
| **HIGH** | Non-functional feature exposed to end users, unauthenticated privileged endpoint, or N+1 query at >1000 rows |
| **MEDIUM** | UI stub / dead menu, orphaned dependency >1 MB, dangling import that survives build but causes confusion |
| **LOW** | Developer alias route, cosmetic misleading hint text, unused npm package <1 MB |

---

## 1. Module RCAs (Goal 2 Dead-Module Families)

### MOD-01: Fitment Engine
- **module_id**: `MOD-01`
- **severity**: HIGH
- **root_cause**: Frontend admin FitmentMatrix tab calls `POST /fitments/upload-excel` but backend only exposes `POST /fitments/upload/:productId` (route mismatch, 404). Single-year column `year` is parsed but DB stores `year_range` as concatenated string. Customer `/fitment-engine` page is a widget stub with no navbar callers and no backend search. Module imports `exceljs` (>30 MB install) for the broken upload path.
- **backend_entry_points**:
  - [fitmentRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/fitmentRoutes.js) (DELETED — was never mounted in server.js)
- **frontend_entry_points**:
  - [FitmentMatrix.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/FitmentMatrix.jsx) (DELETED)
  - [FitmentEngine.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/FitmentEngine.jsx) (DELETED)
- **resolving_task_ids**: Task 2 (DELETE pass), Task 5 (CLN sweep: removed Genuine_test alias)

---

### MOD-02: Banner Module (Hero Carousel + Admin BannerManagement)
- **module_id**: `MOD-02`
- **severity**: MEDIUM
- **root_cause**: BannerManagement admin tab is a ComingSoon UI stub with `banners` namespace in api.js and bannerRoutes.js CRUD that was never mounted in server.js; Home.jsx renders a static HeroSection component and never actually calls `/api/banners`. Leaving the model + routes creates a false impression of a working CMS-backed carousel when none exists.
- **backend_entry_points**:
  - [bannerModel.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/bannerModel.js) (DELETED)
  - [bannerRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/bannerRoutes.js) (DELETED — never mounted in server.js)
- **frontend_entry_points**:
  - [BannerManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/BannerManagement.jsx) (DELETED)
- **resolving_task_ids**: Task 3 (DELETE pass)

---

### MOD-03: CMS Pages Stub
- **module_id**: `MOD-03`
- **severity**: MEDIUM
- **root_cause**: Admin CMSManagement.jsx is a ComingSoon-style stub with TAB_COMPONENTS registration. No backend page routes or settings `group='pages'` rows exist beyond the initial settings KV seed. Menu entry "Pages" would lead admin users to an unusable tab.
- **backend_entry_points**: N/A beyond settings seed KV (seo/policy groups retained; pages group never seeded)
- **frontend_entry_points**:
  - [CMSManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/CMSManagement.jsx) (DELETED)
  - TAB_COMPONENTS / menuSections in [AdminDashboard.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx#L65-L131) (never referenced `cms` — dead import was absent, so only file delete required)
- **resolving_task_ids**: Task 3 (DELETE pass)

---

### MOD-04: SEO Settings Tab
- **module_id**: `MOD-04`
- **severity**: LOW
- **root_cause**: `settings` group `seo` row is seeded in [server.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/server.js#L203-L207) with `meta_title` but no admin UI ever existed to consume or edit it. `seo` group returned by `/api/settings` for admin. Frontend has SEO wrapper in [SEO.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/SEO.jsx) which uses hardcoded values, not the settings row. Deemed acceptable: settings GET /settings/public does not leak seo rows (group filter), and seo tab never existed in menu. No code delete required beyond keeping seo out of the admin sidebar.
- **backend_entry_points**: [server.js DB init seed](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/server.js#L203-L207) (seed left intact; meta_title row harmless)
- **frontend_entry_points**: N/A (tab was never added to menuSections)
- **resolving_task_ids**: Task 3 (no-op: was already absent)

---

### MOD-05: Email Templates Admin Tab
- **module_id**: `MOD-05`
- **severity**: MEDIUM
- **root_cause**: EmailTemplates.jsx is a ComingSoon stub registered as TAB_COMPONENTS. No backend email-template CRUD exists; mailer in [mail.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/utils/mail.js) uses inline HTML strings. Admin sidebar menu never had a direct `email` id entry but the tab was reachable via deep URL /admin/dashboard/email (404 now since file deleted).
- **backend_entry_points**: N/A (mail.js uses hardcoded strings, no DB template engine)
- **frontend_entry_points**:
  - [EmailTemplates.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/EmailTemplates.jsx) (DELETED)
- **resolving_task_ids**: Task 3 (DELETE pass)

---

### MOD-06: Customer Service Admin Ticket Queues
- **module_id**: `MOD-06`
- **severity**: MEDIUM
- **root_cause**: Admin SupportManagement / ContactManagement duplicate ReturnsCentre + EWarranty flows. **HARD CONSTRAINT EXCEPTION (Project Memory)**: Contact + Returns + E-Warranty + Support Tickets MUST be preserved. Audit result: `SupportManagement.jsx` and `ContactManagement.jsx` are KEPT (real tabs backed by `contactRoutes` and `returnRoutes`). Spec Task 4 would delete them but the Hard Constraint wins. Only WalletManagement admin tab (MOD-07 related) is deleted.
- **backend_entry_points** (KEPT per hard constraint):
  - [contactRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/contactRoutes.js)
  - [returnRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/returnRoutes.js)
  - [warrantyRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/warrantyRoutes.js)
- **frontend_entry_points** (KEPT per hard constraint):
  - [SupportManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/SupportManagement.jsx)
  - [ContactManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/ContactManagement.jsx)
  - [EWarrantyManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/EWarrantyManagement.jsx) (TAB_COMPONENTS id renamed `Genuine_test` → `e-warranty`)
  - [ReturnManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/ReturnManagement.jsx)
  - Public Contact page: [Contact.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/Contact.jsx) (KEPT)
- **resolving_task_ids**: Task 4 (partial; only WalletManagement admin tab deleted)

---

### MOD-07: Wallet Top-Up (Free Credit Exploit)
- **module_id**: `MOD-07`
- **severity**: CRITICAL
- **root_cause**: Previous code exposed `POST /wallet/add` (unauthenticated or admin-only with zero rate limit — any admin could grant free balance to any user_id), `POST /wallet/adjust` (anonymous access), and `GET /wallet/overview` (anonymous ledger). Frontend Profile Wallet tab contained "Add ₹100 / ₹500 / ₹1000" chips with "Add Funds" button routing to the non-gateway `/wallet/add` endpoint. Combined this is a free-wallet-credit exploit (direct debit of balance with zero payment processing).
- **backend_fix_state**: ✅ Already clean. Routes `/add`, `/adjust`, `/overview` **removed** from [walletRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/walletRoutes.js). Only `/balance`, `/history`, `/pay` (debit during checkout) remain.
- **frontend_fix_state**:
  - [WalletManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/WalletManagement.jsx) (DELETED — was an admin top-up overview stub)
  - Profile Wallet tab top-up chips: already absent (confirmed no buttons matching regex `/^(Add Fund|Top Up|Add ₹|Add credit)$/i`). Misleading hint "Add funds anytime" removed from overview StatCard in [Profile.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/Profile.jsx#L596).
  - api.js wallet namespace: clean — only `getBalance`, `getHistory`, `pay`. No `addFunds` export in [api.js](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js#L87).
- **resolving_task_ids**: Task 4 (DELETE + UI cleanup), Task 9 (SEC tests)

---

## 2. Critical Bug RCAs (Goal 5 + Goal 6 Blockers)

### BUG-01: Admin Order-Status Update → Customer Forced-Logout Cross-Contamination
- **bug_id**: `BUG-01`
- **severity**: CRITICAL
- **reproduction**: Login as customer (token in localStorage). Login as admin (adminToken) in same browser in incognito or another tab. Admin saves PUT /orders/:id/status → customer's 401 interceptor wiped customer `token` key.
- **root_cause_multifactor** (4 co-occurring issues):
  1. **Shared token key** (old): frontend wrote BOTH customer and admin JWTs to the same `localStorage.token` key — admin login overwrote customer token and vice versa.
  2. **Blanket 401 interceptor** (old): api.js response interceptor called `localStorage.removeItem` on 4 keys (`token`, `ms_token`, `warehouseToken`, `user`) on **ANY** 401 regardless of URL or role. A transient DB error returning 401 (via authenticateUser mishandling) wiped all tokens.
  3. **authenticateUser DB→401 misclassification** (old): when `pool.query('SELECT is_active …')` failed (ETIMEDOUT, ECONNREFUSED, PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR), the outer catch block for `jwt.verify` was being reached and returning 401 instead of 500, triggering the blanket interceptor wipe.
  4. **AuthContext catch → blanket logout**: `useEffect` initAuth catches user/admin profile fetch failure → calls `logout()` which deleted all keys unconditionally and did a blind `/login` redirect that broke admin pages.
- **fix_file_refs**:
  - Token-key separation: [api.js request interceptor](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js#L9-L44) picks `adminToken` for admin URLs, `warehouseToken` for warehouse, `token` otherwise; login functions in [AuthContext.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/context/AuthContext.jsx#L56-L60) write the correct key.
  - Role-scoped 401 wipe: [api.js response interceptor](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js#L46-L70) wipes only admin-token key for admin URLs, only customer-token key for customer/auth URLs; 403 never triggers wipe.
  - authenticateUser 500 on DB error: [authMiddleware.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/middleware/authMiddleware.js#L36-L42) returns 500 with message "Internal server error during session validation." on any pool error that is not ER_BAD_FIELD_ERROR (column already dropped guard).
  - Narrowed logout + redirect: [AuthContext.jsx logout(scope)](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/context/AuthContext.jsx#L63-L76) accepts `'admin' | 'customer'` scope, deletes only matching key, redirects `/admin/*` → `/admin/login` and `/profile` → `/login` but leaves all other paths on screen.
  - JWT_SECRET length warning: [server.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/server.js#L8-L13) emits `[SECURITY WARNING]` if fallback or <32 chars on boot.
- **resolving_task_ids**: Task 6 (OAuth hygiene), Task 7 (session persistence)

---

### BUG-02: Admin Cannot See Full Historical Order Record Set (403 + No Pagination)
- **bug_id**: `BUG-02`
- **severity**: HIGH
- **root_cause_multifactor**:
  1. **Ownership guard bypassed only for passthrough, not checked for order.user_id match**: `GET /orders/:id` in old code checked `if (order.user_id !== req.user.id) return 403`. authenticateUser L27-29 allowed admin JWT `req.user = payload` passthrough (so admin JWT could authenticate), but `req.user.id` was the ADMIN's own user id, NOT the order's user_id — so the ownership comparison always failed. The passthrough check was necessary but insufficient; we needed a **role-based ownership bypass**.
  2. **getAllOrders empty filters always**: old route `GET /orders/all` forwarded `filters = {}` regardless of `req.query.page / status / search`, so the UI rendered a single unfiltered slice.
  3. **Missing indexes**: orders table had only PK index; admin list queries filtered by `(status)` / ordered by `(created_at DESC)` / joined on `(user_id)` causing full tablescans at >1000 rows. order_items table had no FK indexes causing N+1 item lookup to compound.
  4. **No DELETE verb**: admin had no way to archive/remove test/spam orders.
- **fix_file_refs**:
  - Admin ownership bypass (GET /:id): [orderRoutes.js L205-L215](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L205-L215) — `const isAdmin = ['admin','superadmin'].includes(req.user.role); if (!isAdmin && order.user_id !== req.user.id) return 403`.
  - Pagination + filters + search: [orderRoutes.js L19-L31](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L19-L31) parses page/limit/status/search; model [getAllOrders](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/orderModel.js#L212-L270) applies WHERE clauses + batched WHERE IN for order_items + returns `{ orders, pagination: { page, limit, total, totalPages } }`.
  - 5 idempotent indexes (SHOW INDEX guard): [createOrdersTables](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/orderModel.js#L54-L84) — `idx_orders_created_at` (created_at DESC), `idx_orders_status` (status), `idx_orders_user_created` (user_id, created_at DESC), `idx_order_items_order_id` (order_id), `idx_order_items_product_id` (product_id).
  - Soft-delete via status `archived`: [DELETE /orders/:id](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L231-L242) — `UPDATE orders SET status='archived' WHERE id=?` (unrecoverable only via manual DB revert; matches spec preference for soft delete with documented semantics).
- **resolving_task_ids**: Task 8 (Historical Order Visibility)

---

## 3. Hard Constraints Cross-Check (Project Memory)

All items from [project_memory.md](file:///C:/Users/akash/.trae/memory/projects/-c-Users-akash-Desktop-Bhumivera-Backend-main--p2-efd94d2376af8dc4d7d9/project_memory.md) verified:

| Constraint | Verified Location |
|------------|-------------------|
| Preserve Customer Service modules (Support / Returns / Contact / E-Warranty) | MOD-06 above; files KEPT |
| api.js role-token isolation (adminToken / token / warehouseToken); 401 clears only relevant session | [api.js](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js#L9-L70) |
| No free wallet exploit; removed POST /wallet/add and unauthenticated adjust endpoints | [walletRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/walletRoutes.js) (only 3 routes remain) |
| Admin order delete = soft-delete → status `archived` | [orderRoutes.js L236](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L236) |
| Use bcryptjs not bcrypt (Node 24 compat) | [package.json](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/package.json#L32); bcrypt REMOVED from dependencies |
| Customer pages earth-tone palette (#FDFBF7, #0B2419/#2C3E2D, #D4AF37, #8B9D83) | [Profile.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/Profile.jsx), [Navbar.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Navbar.jsx), [Footer.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Footer.jsx) |
| Admin pages retain sci-fi dark/cyan | [AdminDashboard.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx#L149-L250) |
| notificationModel delete userId ownership guard | [notificationModel.js L83-L88](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/notificationModel.js#L83-L88) |
| PATCH alias for /notifications/read-all | [notificationRoutes.js L54-L63](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/notificationRoutes.js#L54-L63) |
