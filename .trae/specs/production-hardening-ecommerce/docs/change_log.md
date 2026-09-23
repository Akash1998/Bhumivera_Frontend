# Bhumivera Production Hardening — Change Log

Entries are grouped by change category. Every modified/deleted file maps to at least one Acceptance Criterion (AC) from [spec.md](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/spec.md).

---

## Category: DELETE (Dead Feature Modules)

### 1. [routes/fitmentRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/fitmentRoutes.js) — **DELETED**
- **Before**: Non-functional fitment routes with mismatched endpoints (`/upload/:productId vs frontend's `/upload-excel`), used `exceljs` for a broken upload pipeline, never mounted in server.js.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1 (filename), AC-DEL-2 (endpoint grep 0)

### 2. [models/bannerModel.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/bannerModel.js) — **DELETED**
- **Before**: Banner CRUD model with no backend mount or callers.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1, AC-DEL-3

### 3. [routes/bannerRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/bannerRoutes.js) — **DELETED**
- **Before**: Banner route file, never mounted in server.js, no callers.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1, AC-DEL-3

### 4. [pages/FitmentEngine.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/FitmentEngine.jsx) — **DELETED**
- **Before**: Customer placeholder widget page with no navbar callers.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1, AC-CLN-2 (App.jsx no longer lazy-loads it)

### 5. [pages/admin/FitmentMatrix.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/FitmentMatrix.jsx) — **DELETED**
- **Before**: Admin ComingSoon stub tab with broken endpoint call.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1, AC-CLN-1 (no menu/tab id `fitment`)

### 6. [pages/admin/BannerManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/BannerManagement.jsx) — **DELETED**
- **Before**: Admin banner tab stub. No matching banners namespace remained in api.js or server routes already not mounted.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1, AC-DEL-3

### 7. [pages/admin/CMSManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/CMSManagement.jsx) — **DELETED**
- **Before**: Admin CMS ComingSoon stub; no backend page routes or settings group existed.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1, AC-DEL-4

### 8. [pages/admin/EmailTemplates.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/EmailTemplates.jsx) — **DELETED**
- **Before**: Admin email-templates ComingSoon stub. Mailer [mail.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/utils/mail.js) uses inline strings — no DB-backed template engine to connect it to.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-1, AC-DEL-4

### 9. [pages/admin/WalletManagement.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/admin/WalletManagement.jsx) — **DELETED**
- **Before**: Admin wallet top-up/overview stub. Top-up endpoints `/wallet/add` and `/wallet/adjust` **removed from backend. Deleting this tab removes the admin UI surface for the now-gated free-credit exploit.
- **After**: File removed from disk.
- **AC Mapping**: AC-DEL-2 (no more wallet top-up admin UI), FR-DEL-2

---

## Category: EDIT (Integration & Cleanup

### 10. [services/api.js](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js) — **EDIT**
- **Before (signature: Shared `localStorage.token` used for every role; blanket 401 wiped 4 keys.
- **After signature**:
  - **Request interceptor** ([L9-L44](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js#L9-L44) picks `adminToken` for admin-prefixed URLs, `warehouseToken` for `/warehouse/`, else `token` + `ms_token` fallback for customer URLs; `withCredentials: false` set explicitly.
  - **Response interceptor** ([L46-L70](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js#L46-L70) wipes `adminToken` on admin 401, `token (+ ms_token + user + auth/customer 401 on auth-like paths (only on `/auth/* | `/users/` | customer scoped 401, never on 403.
  - Removed namespaces `banners`, `fitment`, nor `wallet.addFunds`.
  - `adminManagement.getAllOrders` → `/orders/all` (matches real server mount).
- **AC Mapping**: AC-INT-1, AC-INT-2, AC-INT-3, FR-INT-4 (OAuth 2.0 hygiene)

### 11. [context/AuthContext.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/context/AuthContext.jsx) — **EDIT**
- **Before**: `logout()` wiped 4 keys blindly, redirected `/login`.
- **After signature**:
  - login writes to `localStorage.token` (customer), `localStorage.adminToken` (admin), `localStorage.warehouseToken` (warehouse).
  - `logout(scope)` accepts `'admin' | 'customer' — scope; customer scope only deletes the matching key set.
  - Redirect `/admin/*` → `/admin/login`, `/profile` → `/login`, other paths stay on page.
  - `catch(e)` on initAuth calls narrow scope logout rather than blanket wipe.
- **AC Mapping**: AC-LOG-1, AC-LOG-2, AC-LOG-3, FR-INT-4

### 12. [routes/orderRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js) — **EDIT**
- **Before signature**:
  - `GET /all` ([L19-L31](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L19-L31): parses `page | limit | status | search from req.query; passes filters object to model.
  - `GET /:id` ([L205-L215](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L205-L215): ownership guard skips when admin/superadmin.
  - `PUT /:id/status` ([L82-L119](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L82-L119): transactional update with email on + tracking_number/courier cols, authenticatedAdmin, triggers `DELETE /:id` ([L231-L242](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/orderRoutes.js#L231-L242): soft-delete → `status='archived'`.
  - User PATCH cancel + POST cancel alias for Profile-level self-cancel (restricted to `"cancellable`.
- **AC Mapping**: AC-ORD-1, AC-ORD-2, AC-ORD-4, FR-ORD-5 (2/3 query scalability: 1 batched WHERE IN for items)

### 13. [models/orderModel.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/orderModel.js) — **EDIT**
- **Before**:
  - createOrdersTables `addIndex` helper ([L54-L64](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/orderModel.js#L54-L64) uses `SHOW INDEX FROM guard before CREATE INDEX; 5 indexes added L80-L84.
  - getAllOrders ([L212-L270](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/orderModel.js#L212-L270filters.status eq LEFT JOIN users, search (name/email/orderId/courier/tracking), batched WHERE IN order_items, returns `{orders, pagination}`.
- **AC Mapping**: AC-ORD-3, FR-ORD-5 (3/3) — no N+1 items, JOIN users

### 14. [middleware/authMiddleware.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/middleware/authMiddleware.js) — **EDIT**
- **Before signature**: authenticateUser DB error leaked pool query → `jwt.verify catch → 401 (caused wipe.
- **After signature**:
  - authenticateUser ([L20-L48](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/middleware/authMiddleware.js#L20-L48): pool failure path catches DB err separately; returns 500 instead of 401 on connectivity failures (session validity DB unreachable.
  - authenticateAdmin ([L3-L18](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/middleware/authMiddleware.js#L3-L18) sets req.admin + req.user payload role-check admin/superadmin only.
- **AC Mapping**: AC-LOG-2, FR-SEC-2

### 15. [server.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/server.js) — **EDIT**
- **Before signature**: No JWT secret length check; duplicate `/api/admin/coupons mount; banner/fitment route requires (though they were already absent).
- **After signature**:
  - JWT_SECRET length warning ([L8-L13](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/server.js#L8-L13).
  - Clean route list; no `/api/admin/coupons duplicate; banner routes clean.
  - safeInit pattern for DB init (safeInit wrapper for all models; settings table init seed seo kept.
  - bcryptjs used (native bcrypt removed from package.json).
- **AC Mapping**: AC-INT-3, AC-CLN-3, AC-INT-4 (3/3)

### 16. [App.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/App.jsx) — **EDIT**
- **Before signature**: Genuine_test = lazy(EWarranty.jsx); double route `/Genuine_test` + `/warranty`.
- **After signature**:
  - Renamed lazy var → `EWarranty` ([L40](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/App.jsx#L40).
  - Removed `/Genuine_test` developer-alias ([L154-L157](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/App.jsx#L154-L157); only `/warranty` remains.
  - No `/fitment-engine` route (never existed after delete pass confirmed grep 0).
- **AC Mapping**: AC-CLN-2

### 17. [pages/AdminDashboard.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx) — **EDIT**
- **Before signature**: TAB_COMPONENTS `Genuine_test: EWarrantyManagement; menu Genuine_test label.
- **After signature**:
  - TAB_COMPONENTS key `'e-warranty': EWarrantyManagement` ([L65-L77](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx#L65-L77).
  - Menu items id `'e-warranty'` label E-Warranty ([L125-L130](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx#L125-L130).
  - No `banners | cms | seo | email | fitment | wallet entries.
- **AC Mapping**: AC-CLN-1, FR-CLN-1

### 18. [pages/Profile.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/Profile.jsx) — **EDIT**
- **Before**: Overview StatCard hint="Add funds anytime" on wallet card.
- **After**: Hint removed ([L593-L598](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/Profile.jsx#L593-L598).
  - Wallet tab has balance + tx history only; no add funds chips or top-up buttons present already; wallet namespace in tab structure renders only balance card + Transaction table.
- **AC Mapping**: AC-DEL-3 (Profile: 0 "Add Fund" buttons + 0 top-up)

### 19. [routes/notificationRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/notificationRoutes.js) — **EDIT**
- **Before signature**: PUT /read-all only; no PATCH alias for frontend notifications.markAllRead().
- **After signature**: Added verb alias `PATCH /read-all` ([L54-L63](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/notificationRoutes.js#L54-L63) (matches api.js `notifications.markAllRead: () ⇒ api.patch("/notifications/read-all"`).
- **AC Mapping**: Hard Constraint (project_memory)

### 20. [models/notificationModel.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/notificationModel.js) — **EDIT**
- **Before signature**: deleteNotification had no userId when user-owned guard when called with id only.
- **After signature**: deleteNotification ownership guard on DELETE ([L83-L88](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/notificationModel.js#L83-L88).
- **AC Mapping**: Hard Constraint (project_memory) — NFR-SEC-2 ownership

### 21. [components/Navbar.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Navbar.jsx) — **EDIT**
- **Before signature**: Fitment/Garage link pointed to `/fitment-engine`.
- **After signature**: Repurposed as `/science` (Bhumivera Botanical) Science`).
  - `/science` entry ([L173-L180](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Navbar.jsx#L173-L180): 'Botanical Science' / 'Active Regimen' chip (Hard Constraint mapping
- **AC Mapping**: project_memory (Nav links removed)

### 22. [components/Footer.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Footer.jsx) — **EDIT**
- **Before signature**: Footer had fitment-like link entries with no longer; replaced with link to `/science`.
- **After signature**:
  - Get to Know Us → /science link Bhumivera Science` Science /science Botanical ([L31](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Footer.jsx#L31)
  - Help You → /science link ([L56](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Footer.jsx#L56)
- **AC Mapping**: project_memory nav

---

## Category: EDIT (package.json — Orphaned Dependency Cleanup)

### 23. [package.json backend](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/package.json) — **EDIT**
- **Before**: `"bcrypt": "^5.1.1" present (native bindings fail on Node 24).
- **After**: `bcrypt` removed from dependencies; only `bcryptjs" bcryptjs": "^3.0.3"` (pure JS, Node 24 compatible).
- **AC Mapping**: FR-CLN-4, project_memory constraint
- exceljs KEPT: used in [serialRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/serialRoutes.js#L4) (serial bulk CSV export).
- @pinecone-database/pinecone KEPT: used in [vectorService.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/services/vectorService.js) (vector in [aiRoutes.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/aiRoutes.js) routes.

### 24. [package.json frontend](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/package.json) — **NO CHANGE**
- exceljs already absent xlsx@0.18.5 (npm registry version (not CDN tarball per project_memory lesson) used in OrderManagement export xlsx export (lessons learned).
- **AC Mapping**: FR-CLN-4
