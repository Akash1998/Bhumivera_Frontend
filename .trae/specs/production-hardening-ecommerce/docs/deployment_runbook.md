# Bhumivera Production Hardening — Deployment Runbook

## Prerequisites

| Tool | Minimum Version | Notes |
|------|-----------------|-------|
| Node.js | 24.x (recommended), 20.x (minimum) | bcryptjs pure JS — no native bindings needed |
| MySQL | 8.0+ | InnoDB, utf8mb4 |
| npm | 10.x bundled with Node 24 | Used for dependency install |
| Optional: Redis/PM2 | latest | Process manager for production |
| Optional: Cloudflare R2 / AWS S3 | — | Product image storage (S3 client @aws-sdk v3) |

---

## Step 1: Clone / Install Node + MySQL

```powershell
# Verify Node
node --version  # expect v24.x
npm --version

# Verify MySQL (local install or Railway/Planetscale/Amazon RDS connection string
# Ensure user with: CREATE DATABASE bhumivera DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

---

## Step 2: Backend — Environment Variables

Create file `c:\Users\akash\Desktop\Bhumivera_Backend-main\.env` (never commit). **Set file file `.env`):

```dotenv
# ⚠️  MUST be 32+ chars PRODUCTION (256 bits+)
JWT_SECRET=replace-me-with-a-32-char-random-string-xxxx

# MySQL pool config
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=bhumivera_user
DB_PASSWORD=replace-me
DB_NAME=bhumivera

# SMTP (mailer — optional (order status emailer
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=orders@bhumivera.com
SMTP_PASS=replace-me
SMTP_FROM="Bhumivera Boutique <noreply@bhumivera.com>

# Optional: SMS (order SMS OTP (optional — module)
SMS_API_KEY=leave-empty-if-not-used

# S3-compatible product image storage (AWS Cloudflare R2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_REGION=ap-south-1
AWS_S3_BUCKET=bhumivera-products
AWS_S3_ENDPOINT=https://<account>.r2.cloudflarestorage.com  # Cloudflare-only

# AI / AI search (vector search — optional; module exists)
PINECONE_API_KEY=leave-empty-to-lazy-init-off
PINECONE_INDEX=
GOOGLE_API_KEY=leave-empty-lazy-init
GOOGLE_GEMINI_MODEL=gemini-2.0-flash

# Server
NODE_ENV=production
PORT=5000
```

**Hard requirement**:`JWT_SECRET length >=`:** PRODUCTION; short 32 chars triggers warning printed at server.js L8-L13 warning. Shutdown OK for local dev but production MUST set it to 32+ char value.

---

## Step 3: Backend Install + Init

```powershell
cd c:\Users\akash\Desktop\Bhumivera_Backend-main
npm.cmd install
```

First server start — DB init runs on in server models tables inits orders/categories/reviews/notifications/wishlist/cart/users/admin/wallet/addresses/returns/contact/warehouse tables.  Idempotent: `CREATE TABLE IF NOT EXISTS + addCol SHOW COLUMNS` guards, so safe run:

```powershell
# first start triggers DB init
node server.js
```

Expected stdout lines (example):

```
[SECURITY WARNING] JWT_SECRET ...   (if <= 32)
Access Core Online on Port 5000
Added index idx_orders_created_at on orders  (first run only)
Added index idx_orders_status on orders
Added index idx_orders_user_created on orders
Added index idx_order_items_order_id on order_items
Added index idx_order_items_product_id on order_items
--- ROOT ADMIN ACCESS ACTIVATED: adminbhumivera27@gmail.com ---  (first run — default admin created

```

The seed default admin email: `adminbhumivera27@gmail.com` password: `Akash#*@1998`  (change password on first login in production immediately!

---

## Step 4: Backend Process Manager (Production — PM2)

```powershell
npm.cmd install -g pm2 -g
cd c:\Users\akash\Desktop\Bhumivera_Backend-main
pm2 start server.js --name bhumivera-backend
pm2 save
pm2 startup   (follow instructions to auto-start on Windows boot via pm2-windows
```

---

## Step 5: Frontend Environment Variables

File: `c:\Users\akash\Desktop\Bhumivera_Frontend-main\Bhumivera_Frontend\.env.production`:

```dotenv
# Force https for non-localhost URL. If domain: force https automatically (api.js L3-L4

VITE_BASE_URL=https://service.bhumivera.com
VITE_IMAGE_BASE_URL=https://bhumivera-products.<account>.r2.dev/   # Cloudflare R2 public bucket

# Dev:
# VITE_BASE_URL=http://localhost:5000
```

Notes:
- api.js automatically rewrites http:// → https:// for non-localhost URLs ([api.js L3-L5](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/src/services/api.js#L3-L5)

---

## Step 6: Frontend Build

```powershell
cd c:\Users\akash\Desktop\Bhumivera_Frontend-main\Bhumivera_Frontend
npm.cmd install
npm.cmd run build
```

Build output → `dist/` folder deploy to Vercel / Netlify / IIS / Nginx.

Vercel deploy config already present (see [vercel.json](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend/vercel.json) rewrite SPA fallback.

---

## Step 7: Health Check URLs

After both services are up:

| URL | Expected JSON | Purpose |
|-----|-------------|---------|
| `GET https://service.bhumivera.com/` | `{"status":"ok","message":"Bhumivera Eco-Lab Core API running!"}` | API liveness |
| `GET https://service.bhumivera.com/api/settings/public` | `{success:true, settings:[...]} general/ SEO rows | Public site-name etc.`)| Public settings (no PII) |
| `GET https://service.bhumivera.com/sitemap.xml` | XML text/xml header | Dynamic sitemap |
| `GET https://service.bhumivera.com/api/products/active?page=1&limit=1` | `{data:[...] or array of products}` | Product catalog public |
| `POST https://service.bhumivera.com/api/auth/admin/login` body `{email, password}` → `{token, admin}` | Admin login endpoint; 401 on bad creds → wipes adminToken only |

TLS certs: Use Cloudflare Full (Full (strict) origin server nginx/apache on Railway/Plesk; never serve HTTP port 5000 on HTTP to TLS cert or behind the load balancer TLS termination; api.js forces https for non-localhost.

---

## Step 8: First-Login Checklist (Production)

1. Login default admin → **immediately:
2. Navigate to Admin → Users → change root admin password (via admin profile /admin/dashboard/overview + settings) → Settings tab to reset admin profile
3. Navigate to Settings → Tax and populate tax rates
4. Navigate to Settings → Shipping zones/couriers
5. Navigate to Coupons → delete any seed demo coupons
6. Products → add 1+ test product → test complete end-to-end order flow: Register → Login → Add to cart → Checkout COD → Order appears in Admin Orders → Admin change status to Shipped → Customer Profile → Orders see status shipped → Customer session still valid (no logout!)) →  verify BUG-01 is dead.

---

## Rollback Procedure

```powershell
pm2 restart bhumivera-backend   # backend rolling
# If build rollback front: just redeploy previous dist folder.
```

DB rollback: All DDL changes are additive (CREATE TABLE IF NOT EXISTS / ADD COLUMN / CREATE INDEX — no destructive ALTERs. `createOrder

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|---------------|-----|
| `[SECURITY WARNING] JWT_SECRET too short | `.env` JWT_SECRET 32 | Set 32+ char |
| Orders admin 403 GET /orders/:id when id mismatch 403 ownership check fails for admin role? No! Fixed — admin bypass at orderRoutes.js L209-210 — if isAdmin skip ownership `isAdmin check | role decode  verify JWT `adminToken` → token in admin logged in as admin role. Check token)
| Customer logs customer session Admin interceptor logout| Admin is 401 wipe token was caused by JWT token key wipe separation; 403 never wipe | Check interceptor: api.js response only wipes 401 on auth/... endpoints. SMOKE-5 edge-case fix: expand admin URLs isAdminUrl to include `/orders/:id/status` (fix mentioned in test_log.md SMOKE-5.
| Excel serials serial import serialRoutes serial CSV export fails | exceljs used in serialRoutes; ensure kept package.json (exceljs@4.4.0 | Keep in backend deps |
| bcrypt fails native bindings compile | Installed Node 24. Fixed: Removed native bcrypt; only bcryptjs@3.0.3 is used (package.json L32
| Navbar links /science | Project memory: removed fitment links → repurpose | ✅  Navbar L173-L180 Footer L31,56 links to/science
