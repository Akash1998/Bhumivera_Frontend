# Bhumivera Production Hardening — Maintenance Guidelines

## 1. Role Matrix (Cheatsheet)

| Role | Storage Key | Login Endpoint | Admin Panel URL | Profile Endpoint |
|------|-------------|----------------|-----------------|------------------|
| `customer`  | `localStorage.token` | `/api/auth/login` | N/A (Profile) | `/api/users/profile` (customer-only) |
| `admin` / `superadmin` | `localStorage.adminToken` | `/api/auth/admin/login` | `/admin` → `/admin/dashboard/*` | `/api/auth/profile` (admin-only) |
| `warehouse_admin` | `localStorage.warehouseToken` | `/api/warehouse/login` | `/warehouseadmin` (login page) | N/A |

> ⚠️ Never call a customer endpoint with admin JWT (or vice versa) on purpose. The passthrough in authenticateUser lets admin passthrough into some routes (GET orders/:id for admin order detail OK, intentional bypass ownership), but GET /users/profile with admin JWT would fail gracefully → returns 404/empty, **never triggers token wipe**, because HTTP 200/404 not 401.

---

## 2. JWT_SECRET Rotation

**Critical**: `JWT_SECRET` signs every JWT; rotating invalidates all existing tokens → all users force-logged out next page load (graceful, interceptor wipes token on first 401 /auth/* call.

Steps to rotate:

1. In the backend `.env` file (not committed), replace with a new 32+ char random string:

```powershell
# Generate 32-char random (Node one-liner)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# example output: c4a9d8f7e6b5a4938271c0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

2. Save as `.env`: `JWT_SECRET=<new-hex>`
3. Restart backend: `pm2 restart bhumivera-backend`
4. Admin re-login; customers re-login. (All sessions invalided now.)

Code hook location for length warning (DO NOT remove the warning):
- [server.js L8-L13](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/server.js#L8-L13) — emits console.warn when `length < 32` OR equals literal `'fallback_secret'`.

---

## 3. Adding a New Admin Tab (AdminDashboard)

3 steps:

### Step 1 — Create the page file

Create file: `src/pages/admin/<NewFeature>Management.jsx`

```jsx
import React from 'react'
export default function NewFeatureManagement() {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-black uppercase tracking-widest mb-6">New Feature</h2>
    </div>
  );
}
```

### Step 2 — Lazy-import + register TAB_COMPONENTS

Edit: [AdminDashboard.jsx L6-L27](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx#L6-L27)

```
const NewFeatureManagement = lazy(() => import('./admin/NewFeatureManagement'));
```

Then edit: [TAB_COMPONENTS obj L65-L77](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx#L65-L77) add:

```
  'new-feature': NewFeatureManagement,
```

### Step 3 — Add menu item in admin menuSections

Edit [AdminDashboard.jsx L98-L131](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/pages/AdminDashboard.jsx#L98-L131) in the appropriate section (e.g., inside Marketing):

```
{ id: 'new-feature', label: 'New Feature' },
```

Navigate to `/admin/dashboard/new-feature` → tab renders.

Backend routes: Add in backend `routes/newFeatureRoutes.js`, then `server.js` `require("./routes/newFeatureRoutes")` + `app.use("/api/new-feature", newFeatureRoutes)`.

---

## 4. Adding a New Public Route

3 steps:

### Step 1 — Create the page file

Create: `src/pages/MyPage.jsx`

```jsx
import React from 'react'
export default function MyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B2419]">
      <h1 className="text-3xl font-bold">My Page</h1>
    </div>
  );
}
```

Customer pages MUST use earth-tone palette per [project_memory.md](file:///C:/Users/akash/.trae/memory/projects/-c-Users-akash-Desktop-Bhumivera-Backend-main--p2-efd94d2376af8dc4d7d9/project_memory.md):
- Background: `#FDFBF7`
- Primary text/buttons: `#0B2419` or `#2C3E2D`
- Gold accents: `#D4AF37`
- Sage: `#8B9D83`

### Step 2 — Register lazy import

Edit [App.jsx L32-L66](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/App.jsx#L32-L66):

```jsx
const MyPage = lazyWithRetry(() => import("./pages/MyPage.jsx"));
```

### Step 3 — Add route entry in Routes block

Edit [App.jsx L136-L188](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/App.jsx#L136-L188) inside `<Suspense fallback >` → `<Routes>`:

```jsx
<Route path="/my-page" element={<MyPage />} />
```

Protected (login required) wrap: `<ProtectedRoute><MyPage /></ProtectedRoute>` (L83-L90 ProtectedRoute component wraps.

Now add a Navbar or Footer link by editing [Navbar.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Navbar.jsx) or [Footer.jsx](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/components/Footer.jsx).

---

## 5. Adding a New Product Category / Subcategory

No code edits required for basic catalog — admin UI handles it.

1. Admin panel → Categories → `Add Category`
2. Fill name, slug, description, image.
3. Add subcategories under the category.
4. Products → Products → Add Product → pick category/subcategory.

SEO slug is auto-used in ProductDetail route via `/product/:id` (or slug) routing.

---

## 6. Adding a New Env Var

### Backend

1. Edit `.env` (uncommitted) + `.env.example` (committed) file with new line:
   ```
   NEW_FEATURE_API_KEY=your-value
   ```
2. In the code read via `process.env.NEW_FEATURE_API_KEY`. Always provide a fallback for safety and log warning if missing but optional:
   ```js
   const KEY = process.env.NEW_FEATURE_API_KEY;
   if (!KEY) console.warn('[NEW_FEATURE] NEW_FEATURE_API_KEY missing; feature disabled');
   ```
3. Add to deployment_runbook.md Env var section (in this docs folder) for future maintainers.

### Frontend

1. Edit `.env.production` + `.env.development` + `.env.example`:
   ```
   VITE_NEW_FEATURE_URL=https://...
   ```
2. Read via `import.meta.env.VITE_NEW_FEATURE_URL`. (Only VITE_* vars are exposed to browser bundle — NEVER prefix with VITE secrets like JWTs or private API keys.)
3. Reference in [api.js](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js) or component.

---

## 7. Log Review Locations

| Log | Location |
|-----|----------|
| Backend stderr/stdout | PM2: `pm2 logs bhumivera-backend` or server console |
| Frontend Vite build stderr | Build console |
| Order email delivery | Nodemailer in [mail.js](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/utils/mail.js) — catches and logs `[Mailer]` to backend console |
| System crashes/SQL errors | Telemetry notifications — admin Notifications System Notifications: admin panel → Admin panel → Notifications tab (logged via POST `/notifications/system-log` ingested; [notificationRoutes.js L7-L16](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/routes/notificationRoutes.js#L7-L16) |
| F12 client crashes | Frontend also POSTs to system-log endpoint on window.onerror catch → same admin Notifications → System Events column) |
| DB init warnings | First server-start console output `[DB_INIT] ... Warning:` on safeInit catches for failed table inits |
| CORS rejections | Backend console `CORS Origin Rejected` 403 JSON ([server.js L239](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/server.js#L239)) |

---

## 8. Hard Constraints Cheat Sheet (DO NOT TOUCH)

From [project_memory.md](file:///C:/Users/akash/.trae/memory/projects/-c-Users-akash-Desktop-Bhumivera-Backend-main--p2-efd94d2376af8dc4d7d9/project_memory.md):

1. ✅ **Preserve Customer Service modules** (Support Tickets, Returns, Contact, E-Warranty admin tabs & public pages). `SupportManagement.jsx` `ContactManagement.jsx` `ReturnManagement.jsx` `EWarrantyManagement.jsx` KEPT.
2. ✅ **api.js role-token isolation** (`adminToken`, `token`, `warehouseToken`). 401 only clears the matching role-session key — never a blanket wipe.
3. ✅ **No wallet top-up exploit**: `POST /wallet/add` + `/wallet/adjust` route permanently deleted. No public unauthenticated wallet endpoints!
4. ✅ **Admin order delete = soft-delete** → `status='archived'` NEVER `DELETE FROM orders WHERE id=?`.
5. ✅ **Use bcryptjs** NOT bcrypt native (won't compile Node 24). Native bcrypt removed from package.json.
6. ✅ **Customer pages = earth-tone palette** (colors defined above Section 4). Admin pages keep sci-fi dark/cyan theme.
7. ✅ **Notification delete ownership guard** `deleteNotification` in notificationModel.js with userId = req.user.id.
8. ✅ **PATCH verb alias for /notifications/read-all** exists (front-end api.js `notifications.markAllRead = patch`).

Break any of these 8 constraints = new bug regressions.

---

## 9. New Column to Existing Table (Safe AddCol Pattern)

All model table-create functions use a `safeInit` + `addCol` helper. Example re-use in [orderModel.js L42-L52](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main/models/orderModel.js#L42-L52):

```js
const addCol = async (table, column, definition) => {
  try {
    const [cols] = await pool.query(`SHOW COLUMNS FROM \`${table}\` LIKE '${column}'`);
    if (cols.length === 0) {
      await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
      console.log(`Added ${column} to ${table}`);
    }
  } catch (err) {
    console.error(`Error adding ${column} to ${table}:`, err.message);
  }
};

await addCol('orders', 'my_new_column', 'VARCHAR(255) DEFAULT NULL');
```

Never ship raw ALTER TABLE without SHOW guard — causes duplicate column errors on second server restart.
