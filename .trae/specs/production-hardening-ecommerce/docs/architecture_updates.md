# Bhumivera Production Hardening — Architecture Updates

## 1. Role Permission Matrix (4 Roles × 12 Example Endpoints)

✅ = allowed
❌ = 403 forbidden
🔒 = 401 if no token
↩️ = redirects to /login via ProtectedRoute

| Endpoint (Backend) | Role: customer | Role: warehouse_admin | Role: admin | Role: superadmin | Notes |
|---------------------|:--------------:|:-----------------:|:-----------:|:----------------:|-------|
| `POST /auth/login` (customer) | ✅ | ✅ | ✅ | ✅ | Returns customer `token` |
| `POST /auth/admin/login` | ❌ | ❌ | ✅ | ✅ | Returns `adminToken` |
| `GET /users/profile` | ✅ | ❌ | ❌ passthrough but returns 404/empty (no user-table row for admin creds) | ⚠️ No row for admin not in users; 404 not 401/403 → no token wipe (safe) | Customer profile endpoint exclusively |
| `GET /auth/profile` | ❌ | ❌ | ✅ | ✅ | Admin profile reserved |
| `GET /orders/my` | ✅ | ❌ | ❌ no ownership | Own orders always uses authenticateUser + admin passthrough to bypasses ownership | Customer my order listing |
| `GET /orders/all` | ❌ 403 authenticateAdmin gate | ❌ | ✅ | ✅ | Admin global orders table |
| `GET /orders/:id` | ✅ (own only) | ❌ | ✅ bypass | ✅ bypass | Admin skips ownership check orderRoutes.js L209-L210 |
| `PUT /orders/:id/status` | ❌ | ❌ | ✅ | ✅ | Update tracking+status+courier |
| `DELETE /orders/:id` (soft → archived) | ❌ | ❌ | ✅ | ✅ | Status update archived; not physical delete |
| `GET /wallet/balance` | ✅ | ❌ | ❌ | ❌ | Customer only bookkeeping |
| `POST /wallet/add` | ❌ (404 ROUTE GONE) | ❌ GONE | ❌ GONE | ❌ GONE | Exploit closed — route permanently |
| `POST /wallet/pay` | ✅ | ❌ | ❌ | ❌ | Checkout wallet debit |
| `GET /notifications` | ✅ own+global | ❌ | ❌ | ❌ | User-notif (notif unread own |
| `GET /notifications/admin/all` | ❌ 403 authenticateAdmin | ❌ | ✅ | ✅ | Telemetry heart beat (all users |
| `GET /admin/users` | ❌ | ❌ | ✅ | ✅ | Admin user management |
| `DELETE /notifications/:id` | ✅ own only (userId guard) | ❌ | ✅ (no userId param → delete any) | ✅ | [notificationModel.js L83-L88](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/notificationModel.js#L83-L88) ownership guard |

---

## 2. JWT Bearer Token Transport Flow (OAuth 2.0 RFC 6750 subset)

### Request flow (ASCII flowchart)

```
┌──────────────────────┐
│  Customer Browser   │ localStorage stores:
│                    │   token        = customer JWT
│                    │   adminToken   = admin JWT (if dual logged in same browser)
│                    │   warehouseToken = warehouse JWT
└──────────┬─────────┘
           │ axios request
           ▼
┌────────────────────────────────────────────────────────────┐
│ api.js REQUEST INTERCEPTOR [L9-L44                       │
│ URL starts with /admin/  OR /orders/all OR /analytics/ OR   │
│ /settings OR /inventory/ OR /notifications/admin/       │
│   └─► pick localStorage.adminToken (or fallback token)     │
│ URL starts with /warehouse/ NOT /warehouse/login         │
│   └─► pick localStorage.warehouseToken                   │
│ All other URLs                                            │
│   └─► pick localStorage.token OR ms_token (customer)        │
│                                                            │
│ Header added: Authorization: Bearer <token>                  │
│ withCredentials: false (no HttpOnly cookie flow today)     │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTPS (non-localhost rewrites http → https)
                       │ api.js L3-L5)
                       ▼
              ┌────────────────────┐
              │  EXPRESS APP     │
              │  CORS + CSP  │
              └───────┬────────┘
                      │
                      ▼
           ┌──────────────────────────────┐
           │ authMiddleware          │
           │                          │
           │ authenticateAdmin:        │
           │   check Bearer           │
           │   jwt.verify(JWT_SECRET) │
           │   check role admin/superadmin │
           │   req.admin + req.user    │
           │                          │
           │ authenticateUser:        │
           │   check Bearer               │
           │   jwt.verify                │
           │   if admin role: passthrough│
           │   DB SELECT is_active        │
           │     DB error: → status(500)  │← NO 401! │
           │     is_active=0 → 401          │
           │   req.user = payload          │
           └──────────────┬───────────────┘
                          │
                          ▼
                  ┌─────────────────┐
                  │ Route Handler  │ → DB query, business logic
                  │ (orderRoutes.js    │
                  │ userRoutes.js  │
                  └──────┬────────┘
                         │
                         ▼
              ┌──────────────────────────────────────────────┐
              │ api.js RESPONSE INTERCEPTOR L46-L70       │
              │ status === 403 → Promise.reject only       │
              │   → NO TOKEN WIPE (403 NEVER WIPE NEVER wipes │
              │                                            │
              │ status === 401:                              │
              │   IF isAdminUrl → removeItem(adminToken)  │
              │   IF isWarehouseUrl → removeItem(warehouseToken) │
              │   IF isAuthUrl || customer-like paths:         │
              │     removeItem(token + ms_token + user + event auth-expired │
              │                                            │
              │ status=== 2xx → passthrough original res          │
              └───────────────────────┬──────────────────────────┘
                                      │
                                      ▼
                              Browser: React state update
                              (AuthContext listens for auth-expired event
                                  → narrow logout(role))
```

---

## 3. Cleaned Express Route Mount List (After Deletes)

`server.js L109-L136 23 mounts (no duplicate `/api/admin/coupons, no banners, no fitments):

```
/api/flash-sales
/api/ai
/api/affiliate
/api/tax
/api/wallet              (balance, history, pay — 3 routes only)
/api/search
/api/categories
/api/subcategories
/api/products
/api/warranty
/api/contact
/api/auth
/api/serials
/api/users
/api/cart
/api/orders            (all, my, :id, status PUT/DELETE, cancel, return)
/api/addresses
/api/admin
/api/wishlist
/api/coupons
/api/reviews
/api/notifications       (GET /, /unread-count, PUT+PATCH read-all, admin/all, DELETE :id)
/api/analytics           (dashboard/sales/products/kpis/revenue)
/api/settings            (GET /, /public, PUT /)
/api/shipping
/api/returns
/api/inventory
/api/warehouse
```

Dynamically generated sitemap.xml at server root `/sitemap.xml`.

---

## 4. Order Status Update Flow (Admin Save → Unchanged Customer Session)

```
Admin Panel (OrderManagement.jsx)
  │ PUT /orders/:id/status  body { status, trackingNumber, courier }
  │ Authorization: Bearer adminToken
  ▼
authenticateAdmin (401 only if adminToken bad → interceptor wipes adminToken only
  │
  ▼
orderRoutes PUT /:id/status [L82-L119]
  │ pool.getConnection + beginTransaction
  │ UPDATE orders SET status, tracking_number, courier
  │ JOIN users to pull email/name
  │ commit
  │ sendOrderStatusEmail → fire-and-forget email (catch logs errors)
  │
  │ 200 { success:true, message }
  ▼
Admin 200 OK → no 401 → adminToken still there.
  │
  ▼
Customer session (different tab in same browser
  │ JWT customer token (in localStorage.token) is NOT TOUCHED.
  │ GET /users/profile → authenticateUser →
  │   jwt.verify → valid
  │   SELECT is_active → DB ok
  │   200 OK (or 500 if DB down → NO token wipe (500 skips wipe)
  ▼
Customer remains logged in. ✅  (BUG-01 fixed.)
```

Key enablers:
1. **Separate keys**: token vs adminToken.
2. **403 never wipes**: 403 no wipe path.
3. **DB error → 500 not 401**: authMiddleware.js L36-L42.
4. **authMiddleware admin passthrough scoped logout function scope narrow customer paths match.

---

## 5. Notification Ownership Guard + Verb Alias List

- `PATCH /notifications/read-all alias (frontend uses api.js L85 notifications.markAllRead = patch — matches spec) — alias at L54-L63 notificationRoutes.js.
- `DELETE /notifications/:id` → userId ownership guard at [notificationModel.js L83-L88 (project_memory hard constraint).

---

## 6. Order Query Scalability

Query Pattern (Orders List)

```sql
--  /orders/all?page=2&limit=50&status=shipped&search=ravi
```

Executes:
1. COUNT with LEFT JOIN users + WHERE status + name/email/order id/courier/tracking.
2. Main SELECT o.*, user name,user_email 5 cols joined users LEFT JOIN orders o LEFT JOIN users u LIMIT 50 OFFSET 50.
3. Batched order_items SELECT * FROM order_items WHERE order_id IN (50 placeholders).
4. Client pagination UI build from pagination.page /.limit /.total /.totalPages.

5 indexes on orders/order_items tables accelerate WHERE + SORT avoids full-table scans

```
idx_orders_created_at  (created_at DESC)
idx_orders_status     (status)
idx_orders_user_created (user_id, created_at DESC)
idx_order_items_order_id (order_id)
idx_order_items_product_id (product_id)
```

Idempotent createOrdersTables L54 SHOW INDEX guard.
