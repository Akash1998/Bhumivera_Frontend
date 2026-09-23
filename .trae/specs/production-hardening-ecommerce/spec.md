# Bhumivera Production Hardening — Requirements Spec

## Problem Statement

The Bhumivera e-commerce codebase contains multiple inoperable feature modules that were scaffolded but never completed, alongside a mix of critical functional defects:
 1. A forced-logout bug affecting all authenticated customer sessions immediately after any admin saves order-tracking/status data.
 2. A data-accessibility defect preventing admin panel access to the complete customer historical-order record set.
 3. Non-functional UI stubs (Pages / Banners / SEO Settings / Email Templates / Customer Service) that present broken or placeholder views to admin users and consume maintenance surface area.
 4. A fitment engine that ships placeholder UI but has missing wiring between upload routes (`upload/:productId` vs `upload-excel`), column-name mismatches, and no production-grade delete-by-product endpoint.
 5. A wallet top-up feature (`POST /wallet/add`) that bypasses any payment gateway, performs free credits, exposes unauthenticated admin adjust endpoint with zero rate limit, and offers zero encryption of the user's balance field beyond `DECIMAL`.
 6. Fragmented admin↔frontend synchronization: admin endpoints live under both `/api/admin/*` AND `/api/<resource>/* + authenticateAdmin`, with no HTTPS enforcement of the JWT cookie/token transport, no token-bound CSRF mitigation, and blanket client-side logout on any unrelated 401 response.
 7. Orphaned navigation entries in the admin sidebar (Reports/Telemetry/Root-Terminal stubs), dead route registrations (`/api/admin/coupons` double-mount of couponRoutes), unused dependencies (`exceljs`, `@pinecone-database/pinecone` when no PINECONE_API_KEY is ever set, etc.), and ComingSoon stub endpoints that cannot ever be reached.

The codebase is **not production-ready** and cannot be shipped until the above 8 user-stated deliverables are closed out with auditable evidence.

## Goals

 1. Systematically catalog **every** inoperable module with root cause, blast-radius, and cross-reference to the frontend/backend touch points.
 2. Permanently delete (not merely hide behind feature flags) the 7 named non-functional feature groups:
      - CMS Pages
      - Banners (frontend hero banner carousel + admin BannerManagement)
      - SEO Settings (admin `seo` ComingSoon tab + settings group `seo`)
      - Email Templates (admin EmailTemplates)
      - Fitment Engine (FitmentMatrix admin + FitmentEngine customer page + `/api/fitments`)
      - Wallet Top-Up feature (`POST /wallet/add` and related top-up UI in Profile/WalletManagement; keep wallet balance/tx history for loyalty & store-credit bookkeeping if present; remove top-up and unauthenticated admin adjust)
 3. Integrate admin panel ↔ customer frontend end-to-end on:
      - **Authentication**: JWT role scoping; separate per-role token storage keys to prevent dual-login pollution; OAuth 2.0 style stateless bearer-token transport hygiene (bearer-only, `withCredentials: false` where no cookie session is used; `Secure`/`HttpOnly` if HttpOnly cookies are ever introduced); verify `JWT_SECRET` length >= 32 chars.
      - **Data consistency**: Exactly one canonical route per admin CRUD verb for orders/users/categories/coupons (dual-mounts removed); frontend `api.js` `adminManagement` namespace calls match the routes; profile endpoints match role (admin profile → `/api/auth/profile`, customer profile → `/api/users/profile`); 403 role-mismatch never cascades into a blanket client-side logout.
      - **Encryption policy**: TLS enforced in prod BASE_URL rewrite (already present, verify `https://` forced for non-localhost in api.js); tokens never logged or echoed back in JSON error payloads; PII (`email`, `phone`, `address_snapshot`) never exposed to unauthenticated endpoints.
 4. Full platform cleanup:
      - Remove obsolete admin sidebar menu entries (Reports/Telemetry/Terminal/Root-Terminal/Ad Network)
      - Remove dead React routes (FitmentEngine customer route `/fitment-engine`, Genuine_test double alias, any unreachable route)
      - Remove orphaned dependencies from `package.json` (Pinecone when lazy-init is enough, ExcelJS if Fitment deleted, xlsx if no longer required by any remaining page)
      - Remove dead API endpoint mounts (`/api/admin/coupons`, `/api/wallet/adjust`, `/api/wallet/overview`)
      - Remove unimplemented feature stubs (seo/ads/reports/performance/terminal admin tabs)
 5. Fix the **admin order-status update → customer forced-logout** critical bug. After fix:
      - Admin updates to `PUT /orders/:id/status` do **not** cause the JWT token of any unrelated customer session to be rejected or wiped by the axios interceptor.
      - Sessions are stateless JWT (no server-side session storage dependency — compliant with requirement)
      - Customer sessions survive 24 hours of idle time plus any order status update and no local-storage wipe happens outside the `/auth/*` 401 context.
 6. Fix admin historical-order visibility:
      - Admin `GET /orders/all` returns **every** row in orders (with user_name/user_email JOIN) regardless of age, with pagination + search + status filter parameters.
      - Admin `GET /orders/:id` returns the order (with items, address_snapshot) without the `order.user_id !== req.user.id` customer ownership guard.
      - Orders table has indexes on `(created_at DESC)`, `(status)`, `(user_id, created_at DESC)` — add them in init query if missing.
      - All 4 CRUD verbs exposed for admin orders: read list, read detail, update status/tracking, delete (soft-delete via status column is acceptable if documented).
 7. End-to-end testing:
      - Smoke tests cover: register → login → add to cart → checkout → order appears in admin → admin changes status to shipped → customer session still valid → order status visible in customer Profile > Orders + OrderTracking page.
      - Auth negative tests: wrong-role endpoint returns 403 without wiping tokens; expired JWT returns 401 on auth route and correctly wipes tokens.
      - Negative wallet/top-up tests: `POST /wallet/add` removed or returns 404/410 for any role.
      - Security tests: admin endpoint without token → 401; user endpoint with admin token → 403; no PII leaked in public endpoints.
 8. Version-controlled documentation repository containing:
      - Full audit log of defects found grouped by module with severity, root cause, file/line refs, fix strategy.
      - Change log per file touched with before/after snapshots of key signatures.
      - Test cases executed, pass/fail status, evidence (build logs / shell exit codes).
      - Deployment runbook (install order, env vars, DB init, build steps, health check URLs).
      - Architecture diagrams (as text flowcharts / Mermaid if renderable), maintenance guidelines, role matrix.

## Non-Goals

 - No new payment-provider, SMS OTP, loyalty, or affiliate feature development.
 - No migration from MySQL (pool) to another DB.
 - No new "production hardening" beyond what is directly required by the 8 numbered items.
 - No SSR / Next rewrite.
 - No new admin UI components.
 - No dark-mode toggle or visual theme changes outside the earth-tone palette standard for customer-facing pages; admin pages may retain sci-fi dark theme.
 - No schema migration beyond `CREATE INDEX IF NOT EXISTS` patterns and ALTER TABLE guards already used.

## Users and Personas

 1. Storefront Guest / Customer — requires authentication, order history visibility, and persistent sessions.
 2. Store Admin — requires full CRUD over orders/users/categories/coupons/reviews and visibility into the complete historical order record set.
 3. Future Bhumivera SRE — requires a runnable build, documented env vars, and an audit trail.

## Functional Requirements (FRs)

| ID | Requirement | Typed as |
|----|-------------|----------|
| FR-AUD-1 | Every non-functional module listed in Goal 2 has a discrete audit entry in the docs repo containing: module name, entry point file paths, root-cause-of-failure analysis, severity (critical/high/medium/low), and cross-reference to the commit/task that deletes it. | rule |
| FR-DEL-1 | No file referencing the Fitment engine (FitmentMatrix, FitmentEngine, fitmentRoutes.js, fitment model table, `fitment` namespace in api.js) remains in the working tree after the delete pass. | rule |
| FR-DEL-2 | No file referencing the top-up / add-funds flow for the wallet (POST /wallet/add route, /wallet/adjust, frontend WalletManagement & Profile Wallet quick-add chips w/ add-funds + add + pay; keep transaction ledger read & balance read for loyalty/store-credit) remains. | rule |
| FR-DEL-3 | Banner module (bannerRoutes.js, bannerModel.js, BannerManagement.jsx, `/api/banners` mount, `banners` namespace in api.js, Home banner carousel usage if any) is fully deleted. | rule |
| FR-DEL-4 | CMS Pages + Email Templates + SEO Settings stubs are removed: CMSManagement.jsx, EmailTemplates.jsx, seo admin ComingSoon tab, `/api/settings` group `seo` + `email_template` + `pages` rows, `settings` routes that expose these are removed; settings route kept for tax/shipping/legal only. | rule |
| FR-DEL-5 | Customer Service module removed: SupportManagement.jsx, contact tickets dedicated pages, admin sidebar menu 'Support Tickets' and 'Messages' if they duplicate Returns/E-Warranty. | rule |
| FR-INT-1 | `api.js` adminManagement.getAllOrders and adminManagement.updateOrderStatus actually resolve to valid routes that exist in Express app, use authenticateAdmin, and return JSON matching OrderManagement UI expectations. | rule |
| FR-INT-2 | Admin tokens and customer tokens persist in **separate** localStorage keys (adminToken vs token). Client request interceptor picks the correct token based on URL prefix (admin vs non-admin). Response interceptor only removes the role-specific key whose call failed. | rule |
| FR-INT-3 | JWT issued for any role never echoes the JWT in a JSON error response or log. `JWT_SECRET` env var is verified >= 32 chars; fallback_secret usage is logged with a warning. | rule |
| FR-INT-4 | api.js `BASE_URL` forces https for non-localhost hosts (already present — preserve and test that it is exercised when VITE_BASE_URL is http). | rule |
| FR-CLN-1 | Admin sidebar only contains menu entries whose TAB_COMPONENTS[id] actually resolves to a real, functional module (no seo/ads/reports/performance/terminal). | rule |
| FR-CLN-2 | `App.jsx` React route table does not contain entries whose page file was deleted (FitmentEngine, etc.). All referenced pages exist on disk. | rule |
| FR-CLN-3 | `server.js` route mount list contains no double-mounts (current example: `/api/admin/coupons` on top of `/api/coupons`) and no mounts pointing to deleted route modules. | rule |
| FR-CLN-4 | `package.json` of both repos contain no production-only dependencies that are unreachable from any remaining `require`/`import` statement (grepped). | rule |
| FR-LOG-1 | Admin `PUT /orders/:id/status` when called with a valid admin token NEVER causes a 401/403 response on an unrelated authenticated customer user GET in the same browser; axios interceptor blanket-logout guard prevents role-cross contamination. | rule |
| FR-LOG-2 | Customer JWT auth middleware `authenticateUser` never returns 401 for DB connectivity reasons unrelated to account-flag (is_active=0); DB errors return 500 and never wipe tokens. | rule |
| FR-ORD-1 | Admin `GET /orders/all` accepts optional query params `?page=&limit=&status=&search=` and returns matching rows across the full lifetime of the `orders` table with LEFT JOIN user info. | rule |
| FR-ORD-2 | Admin `GET /orders/:id` bypasses the ownership guard (403 check) when caller is admin role. Returns items, address_snapshot, and all joined columns. | rule |
| FR-ORD-3 | `createOrdersTables` init adds non-duplicate indexes on `orders(created_at DESC)`, `orders(status)`, `orders(user_id, created_at DESC)`, `order_items(order_id)`, `order_items(product_id)`. | rule |
| FR-ORD-4 | Admin orders full CRUD verified: List (GET /orders/all), Read (GET /orders/:id), Update (PUT /orders/:id/status — tracking update, status update both work), Delete (DELETE /orders/:id or soft-status archived). | rule |
| FR-TST-1 | A runnable E2E checklist document (in docs repo) is produced and self-verified with build logs + shell exit codes for: backend node syntax OK, backend starts OK, frontend vite build OK, smoke tests FR-LOG-1, FR-ORD-1, FR-ORD-2. | rule |
| FR-TST-2 | Negative-security cases are documented and executed: user-token-to-admin-endpoint -> 403 no token wipe; expired JWT -> 401 with role-specific token wipe; public profile endpoint -> no PII. | rule |
| FR-DOC-1 | A new folder `docs/` (version-controlled, alongside the repos) or under `.trae/specs/<this spec>/docs/` contains every required document type: audit log; change log; test case log with pass/fail + evidence; deployment runbook; architecture update log; maintenance guidelines; role-permission matrix. | rule |

## Non-Functional Requirements (NFRs)

| ID | Requirement | Typed as |
|----|-------------|----------|
| NFR-BUILD-1 | After all changes, `npm run build` in the frontend directory exits with code 0. | rule |
| NFR-BUILD-2 | After all changes, `node server.js` in backend directory: prints "Access Core Online on Port" line with no uncaught exceptions (exit 0 on Ctrl-C after 3 seconds; DB init can ECONNREFUSED inside safeInit since there is no MySQL server in the environment). | rule |
| NFR-SEC-1 | No source file logs JWT or password to `console.*` or to a response body. | rule |
| NFR-SEC-2 | Admin endpoint verbs require role=`admin` or `superadmin` in JWT payload; customer endpoints require non-admin role and is_active check. | rubric (0-3) |
| NFR-PERF-1 | Admin orders list response for simulated 1000-row result returns in < 100 ms (model-level indexes verified; no N+1 query pattern per order for user fields). | rubric (0-3) |
| NFR-PERF-2 | Frontend production build gzipped JS/CSS total transfer size <= 500 KB for the customer entry bundle (excluding xlsx optional chunk). | rubric (0-3) |
| NFR-MAINTAIN-1 | Deleted code must not leave behind dangling references (imports of deleted files) in any remaining module; a full build + ESLint pass is the evidence. | rule |
| NFR-MAINTAIN-2 | Code style matches existing conventions: 4-space or 2-space consistent with the file's pre-existing indent, earth-tone palette for customer pages, no new inline comments added to JSX outside of existing patterns. | rule |

## Constraints

 1. Working directories: backend at `c:\Users\akash\Desktop\Bhumivera_Backend-main`, frontend at `c:\Users\akash\Desktop\Bhumivera_Frontend-main\Bhumivera_Frontend`. Changes confined to these trees.
 2. Keep authentication strategy as JWT (stateless bearer tokens via `Authorization: Bearer <token>` header on each request via axios). No cookie-session rewrite; `withCredentials` remains for future HttpOnly use but do not rely on it currently.
 3. No migration scripts shipped as `.sql` files; any `CREATE INDEX` goes inside `createOrdersTables` with `addCol` style IF-NOT-EXISTS guards so that repeated inits are idempotent.
 4. Dependencies are only removed, not added, unless absolutely required by an Acceptance Criterion (example: a test runner if tests are added; use Node builtins instead).
 5. `JWT_SECRET` source of truth is `process.env.JWT_SECRET`; no hard-coded secrets elsewhere; the `'fallback_secret'` literal is kept in authRoutes.js as last-resort but a console warning is emitted when used.
 6. All 403 responses do **not** trigger client-side token wipe. 401 only triggers a wipe when the 401 URL path begins with `/auth/*` (login-required endpoints) and the token signature does not decode / is expired.
 7. All deleted features in Goal 2 are **permanent deletes**. Not `/* comment out */`, not feature-flagged, not a ComingSoon stub. Any import statement that referenced a deleted file must be removed from `server.js`, `App.jsx`, `AdminDashboard.jsx`, `api.js`, package.json, and `Navbar.jsx`.

## Dependencies / Assumptions

  - Node 20+ (v24 currently installed; bcryptjs pure JS to avoid native bindings).
  - MySQL 8 accessible via `config/db.js` pool; connection failures during tests are expected and are handled by `safeInit` try/catch.
  - Vite 6.x in frontend.
  - No `.env` file is committed to the repo (verify; it probably doesn't exist — that is fine, backend starts and logs warning for PINECONE_API_KEY / GOOGLE_API_KEY / etc.; those modules are deleted or lazy-init anyway).
  - Axios 1.x with interceptors.
  - React Router v6.
  - Lucide-react icons; no inline SVGs outside SafeIcon and Navbar.

## Open Questions Resolved

 1. Q: What OAuth 2.0 scope to implement given there is no authorization server? → A: Follow RFC 6750 bearer-token transport (JWT with role scopes, short `exp`, no token echo, explicit bearer-only, role separation). This is the OAuth 2.0 industry-standard subset the codebase can adopt without introducing a new authorization server.
 2. Q: Delete "Customer Service" completely or keep Contact public form page? → A: Keep Contact.jsx public page (for general inquiries) and delete the admin SupportManagement / ContactManagement dedicated ticket queues if they are non-functional stubs.
 3. Q: Wallet balance and transaction ledgers kept after top-up delete? → A: Yes, for store credits / loyalty bookkeeping. Only top-up (`POST /wallet/add`) and unauthenticated adjust (`POST /wallet/adjust` + `/wallet/overview` anonymous) are explicitly removed, plus UI chips / buttons that offer add funds.
 4. Q: Admin order Delete physical or soft? → A: Either is acceptable; soft status `archived` with documentation preferred since physical delete is unrecoverable.

## Acceptance Criteria

Every AC below is typed **rule** or **rubric**. Evidence artifacts are produced in tasks.md Completion Evidence.

### AC-AUD (Audit Deliverable — user item 1)
- **rule AC-AUD-1**: The docs repo audit-log file lists all 7 non-functional module families (Pages,Banners,SEO,EmailTemplates,CustomerService,FitmentEngine,Wallet top-up); each entry has: module_id, name, severity, root cause, backend entry-point files, frontend entry-point files, cross-reference to the DELETE task id that resolved it.
- **rule AC-AUD-2**: Two critical bug RCA entries exist — one for the admin-order-update→customer-logout bug, one for admin-can't-see-historical-orders bug; each entry names the exact file:line that is the root cause and maps to the specific fix task id.

### AC-DEL (Delete Dead Modules — user item 2)
- **rule AC-DEL-1**: `find`/dir walk shows zero matches for filenames: `FitmentMatrix.jsx`, `FitmentEngine.jsx`, `fitmentRoutes.js`, `BannerManagement.jsx`, `bannerRoutes.js`, `bannerModel.js`, `CMSManagement.jsx`, `EmailTemplates.jsx`, `SupportManagement.jsx` in both repo roots after delete pass.
- **rule AC-DEL-2**: grep for `/fitments`, `banner`, `cms`, `email_template`, `seo-setting`, `customer_service-setting`, `/wallet/add` returns 0 matches across `server.js` route mounts, api.js, frontend App.jsx, and AdminDashboard sidebar items (after deletions).
- **rule AC-DEL-3**: Profile Wallet tab shows balance + transaction ledger only; no "Add ₹100" / "Top up" / "Add Funds" CTA buttons remain. WalletManagement admin tab: removed (not functional).

### AC-INT (Admin↔Frontend Integration — user item 3)
- **rule AC-INT-1**: (Separate key storage) Frontend auth.js writes admin bearer to `localStorage.adminToken`; customer bearer to `localStorage.token`. Axios request interceptor for URLs starting with `/admin/` reads `adminToken`. Axios response interceptor deletes only `adminToken` when a 401 occurs on an `/admin/` URL and only `token` when a 401 occurs on `/auth/*`.
- **rule AC-INT-2**: `adminManagement.updateOrderStatus(orderId, data)` in api.js points to a route whose Express mount exists and returns `{success: true, message}` when called with admin role JWT.
- **rule AC-INT-3**: Profile page fetch uses `/users/profile` (customer role); admin dashboard profile uses `/auth/profile` (admin role). Calls to wrong-role profile URLs return 403 without wiping tokens.
- **rubric AC-INT-4 (OAuth 2.0 hygiene, 0-3)**:
  - 0/3: Still uses single shared token key / shared 401 wipe.
  - 1/3: Separate keys but still cross-contamination possible.
  - 2/3: Separate keys, URL-based picker in request interceptor, correct role-specific wipe, no JWT echo in errors, JWT length >= 256 bits `JWT_SECRET` warning logged.
  - 3/3: Passes 2/3 plus `JWT_SECRET` length check on backend boot emits warning if < 32 chars; authMiddleware checks `typ=JWT` if present; all customer-profile `withCredentials` transport is set to `false` explicitly where no HttpOnly cookie flow is used.

### AC-CLN (Platform Cleanup — user item 4)
- **rule AC-CLN-1**: AdminDashboard menu sections and TAB_COMPONENTS contain no `seo`, `ads`, `reports`, `performance`, `terminal`, `fitment`, `cms`, `email`, `banners` (or exact equivalents) ids after cleanup.
- **rule AC-CLN-2**: `server.js` no longer `require`s deleted route files; `App.jsx` no longer `lazy()`s deleted page files; `api.js` export namespaces for fitment/banners are removed.
- **rule AC-CLN-3**: `package.json` front and back: unused direct dependencies from the deleted feature set are removed from both `dependencies` and the install tree is re-resolved by npm install.
- **rubric AC-CLN-4 (Cleanup thoroughness, 0-2)**:
  - 0/2: Leaves at least one dangling import visible after build.
  - 1/2: Removes all dangling imports but leaves orphaned unused `npm` dev-dependencies that are > 1 MB install size.
  - 2/2: Removes all references, passes build, removes obvious large orphans (exceljs, pinecone if no API key ever set, etc.).

### AC-LOG (Order Tracking Session Persistence Fix — user item 5)
- **rule AC-LOG-1**: After backend fix (authenticateUser DB failures → 500 not 401) AND frontend interceptor fix (URL-scoped 401 logout), an admin `PUT /orders/:id/status` executed in one test context never results in customer `logout()` being called by a parallel customer request that succeeds JWT decode.
- **rule AC-LOG-2**: `authenticateUser` returns 401 only for: no bearer header; JWT verify fails; account is_active=0 confirmed by DB row. For any DB connection error it returns 500 and never a 401 that would trigger token wipe.
- **rule AC-LOG-3**: logout() redirect logic no longer navigates profile/admin to `/login` when logout() was triggered for wrong-role; customer logout → stay or redirect only /admin pages.

### AC-ORD (Historical Orders Admin Visibility — user item 6)
- **rule AC-ORD-1**: GET /orders/all returns all orders when called with admin token. Supports query params `page, limit, status, search` (search filters by user email/name/order id). Response array length matches orders table row count (for the slice of env we can test).
- **rule AC-ORD-2**: GET /orders/:id called with admin token succeeds (no 403) regardless of order.user_id. It returns `items` (order_items) and `address_snapshot` parsed JSON.
- **rule AC-ORD-3**: createOrdersTables adds non-duplicate indexes using `SHOW INDEX FROM orders` guard or equivalent; no duplicate index error is logged on repeated server start. At least `idx_orders_created_at` (created_at DESC), `idx_orders_status` (status), `idx_orders_user_created` (user_id, created_at DESC) exist in the emitted SQL.
- **rule AC-ORD-4**: All four verbs for admin orders are wired to functional endpoints: List (/orders/all), Read (/orders/:id), Update (/orders/:id/status), Delete (/orders/:id). Delete is either physical or a soft status='archived' with the same semantics.
- **rubric AC-ORD-5 (Query efficiency, 0-3)**:
  - 0/3: Still N+1 per order for user names or items.
  - 1/3: JOIN users, items still N+1 but indexes present.
  - 2/3: JOIN users + items loaded in one batched follow-up WHERE IN + indexes.
  - 3/3: JOIN users, items in one admin-specific query with indexes; explain plan would use indexes for the 3 covered columns.

### AC-TST (E2E + Security Testing — user item 7)
- **rule AC-TST-1**: Test case file contains >= 12 distinct tests covering 7 FR smoke flows + 5 negative-security cases. Each case lists: id, steps, expected, actual (recorded), status (pass/fail), evidence file/line.
- **rule AC-TST-2**: E2E key chain: build frontend → run backend smoke → simulated login JWT decode → simulated customer order flow → simulated admin order status save → confirm customer JWT still valid → confirm admin order list size. All 7 steps recorded with exit codes / log snippets.
- **rule AC-TST-3**: Security negative tests: wrong-role endpoint → 403; malformed JWT → 401 (wipes correct token key); expired JWT → 401 (wipes correct token key); public endpoint → no PII (email/phone/address not echoed).
- **rubric AC-TST-4 (Coverage and stability, 0-3)**:
  - 0/3: Test file missing or empty.
  - 1/3: Only positive flows documented.
  - 2/3: Positive flows + negative flows documented but no reproducible shell commands to rerun.
  - 3/3: All 12+ tests with runnable node shell one-liners to reproduce (node --check, grep, vite build etc.).

### AC-DOC (Documentation Repository — user item 8)
- **rule AC-DOC-1**: Documentation folder exists and contains (exact names are specified in tasks) at minimum:
  1. audit_log.md — per-module RCA.
  2. change_log.md — per-file modification list with before/after signature snippets.
  3. test_log.md — AC-TST results table + evidence refs.
  4. deployment_runbook.md — install order, env vars, DB init steps, build commands, health check URLs (`/api/settings/public` should be alive, `/api/` default msg, etc.).
  5. architecture_updates.md — text/Mermaid flow of: route-mount list per role, JWT transport flow, order status flow.
  6. maintenance_guidelines.md — role matrix, how to add a new admin page, how to add a new public route, how to rotate JWT_SECRET.
- **rule AC-DOC-2**: All documents are written in Markdown with clickable `file:///` links for every file/code-block reference (not relative, absolute per Code Reference rule).
- **rubric AC-DOC-3 (Doc quality, 0-3)**:
  - 0/3: Docs missing.
  - 1/3: Docs present but generic (no file/line refs).
  - 2/3: Docs present with file/line refs; runbook actionable; cross-links between audit ↔ change ↔ test ids.
  - 3/3: Adds a navigation README.md inside docs with index/TOC linking every doc, every AC mapping, and passes a "follow runbook step-by-step" mental review (no gaps between install and smoke tests).
