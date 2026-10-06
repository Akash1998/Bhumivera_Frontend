# BHUMIVERA — 20× TOTAL SUPER-COMMERCE UPGRADE
## Master Specification v2.0
> Written per user explicit instruction: **DO NOT MODIFY SOURCE FILES — ONLY PLAN & SPEC ARTIFACTS.**

**ARTIFACT LOCATION** (this folder):
```
c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\.trae\specs\20x-supercommerce-total-upgrade\
├── spec.md                         ← YOU ARE HERE
├── tasks.md                        ← 196 fully-specified tasks, 15 groups, 0 placeholders
└── AI_RESUME_PROTOCOL.md           ← deep handoff reference (mirrors RESUME_FROM_HERE root doc)
```

**ROOT-LEVEL HANDOFF FILE** (for any AI, no path-guessing):
```
c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\RESUME_FROM_HERE.md   ← POINT NEXT AI HERE.
```

---
## CHAPTER 0 — SCOPE CONTRACT (READ BEFORE ANYTHING ELSE)
### What this spec DOES:
- Fixes every live console 4xx/5xx in your screenshot (401 orders/my x3, 500 returns, 400 addresses, no password reset toasts, Flash Sales `invalid date` native HTML5 error).
- Deletes 4 already-completed spec folders from inside `.trae/specs/` tree per your exact instruction ("make sure whatever has been already completed should be removed from trae folder"). Optional backup copy stored OUTSIDE `.trae/` folder in sibling `_trae_completed_archive_backup/` if user says "preserve".
- Upgrades **every function 20×** — performance budgets, zero cascading 401s, zero generic 500s.
- Builds a named UI **"MIN-CART-VALUE CONTROL CENTER"** exactly per your words: admin sets thresholds (e.g. ₹799), customer sees realtime "Add ₹X more to unlock FREE GIFT + FREE DELIVERY + LOYALTY BONUS" while checking cart/checkout. Fully admin-controlled. Zero redeploys after this code ships — all business rules live in MySQL settings.
- Delivers **Amazon-beating "trapped-by-offers" feeling** via 32 gamified hooks, not 16.
- Builds 6 new Admin Promotions tabs (Cart Rules Control Center, Gamification Studio, Lifecycle Offers, Personalization, A/B Lab, Loyalty Tier Forge).
- Delivers full **100% resumable** task protocol. Any AI at any time reads RESUME_FROM_HERE.md → picks EXACTLY up where previous AI left off, no rework.

### What this spec DOES NOT DO (hard non-goals, never start these):
- ❌ NO SSR / Next.js rewrite (stays Vite React SPA)
- ❌ NO MySQL → Postgres migration
- ❌ NO adding payment gateways beyond COD + Wallet
- ❌ NO warehouse / affiliate module rewrites (only error-format structuring)
- ❌ NO rewriting auth JWT → session cookies
- ❌ NO modifying source code during this spec/planning phase. Implementation only after user approval.

### Completed specs DELETED per your instruction, task IDs:
| Old spec | Action in Implementation Task 1 |
|---|---|
| Backend `.trae/specs/deep-scan-pending-upgrades/` | HARD DELETE from `.trae/` |
| Backend `.trae/specs/premium-auth-overhaul/` | HARD DELETE from `.trae/` |
| Backend `.trae/specs/production-stability-hardening/` | HARD DELETE from `.trae/` |
| Frontend `.trae/specs/full-connectivity-a-to-z-upgrade/` (Groups A–H 100% done) | HARD DELETE from `.trae/` |
| Optional (default OFF unless user confirms): sibling backup copy | `../.trae_completed_archive_backup/20261006_<slug>/` OUTSIDE the repo `.trae/` |

---
## CHAPTER 1 — PROBLEM INVENTORY: 5 LIVE DEFECTS CONFIRMED + ROOT CAUSE + FIX PLAN
| ID | User/Observed Symptom | Root Cause (from code scan) | Fix Register (Task IDs) |
|---|---|---|---|
| D1 💥 | `GET /api/orders/my 401 (Unauthorized)` repeats 3x in console. | Frontend `api.js` `_attemptRefresh` hits `/api/auth/refresh` → **no such route in backend**! Every expired token → refresh fails immediately → wipes storage → 401 repeats. | 5 (jti claim), 6 (POST /refresh), 7 (logout), 8 (debounce), 9 (logout server call), 10 (expand refresh url list), 11 (smoke) |
| D2 💥 | `POST /api/returns 500 Internal Server Error` | `returnRoutes` catches all DB errors with one generic 500 line. No validation of order ownership, items empty, or `refund_type` enum. | 12 (structured 4xx), 13 (returnModel safety), 14 (smoke 5 negatives) |
| D3 💥 | `POST /api/addresses 400 Bad Request` | Backend requires snake_case `{ full_name, phone, line1, pincode, city, state }`. Frontend forms emit camelCase `{ fullName, phoneNumber, address1, zip }`. 100% mismatch → 400 every address save. | 15 (normalizer util), 16 (routes apply), 17 (frontend snake emit OR rely on backend both) |
| D4 💥 | "no notification for saving resetting password" | TWO layers: (a) backend 6 premium reset endpoints `verify-reset-otp` / Bearer `reset-password` wrappers previously **added to frontend api.js C3 but never implemented in backend routes** → success path never fires so toast never shows; (b) ForgotPassword/ResetPassword success banners missing + no green in-page "Success!" before navigate. | 18 (backend 6 endpoints), 19 (Forgot success UI), 20 (Reset success UI), 21 (AdminForgot success UI), 29-31 (E2E smokes) |
| D5 💥 | Screenshot: Flash Sales Deploy Campaign modal → `Please enter a valid value. The field is incomplete or has an invalid date.` red native tooltip. | Termination time default empty → HTML5 `<input type=datetime-local>` shows `--:-- `; browser interprets as "invalid value" and blocks HTML5 submit on form. No timezone-aware normalization — ISO→local conversion bug. | 4 (install date-fns), 22 (dateTz.js helpers), 23 (DatetimeTzInput component), 24 (FlashSales swap), 25 (Coupons swap), 31 (validation smoke) |
| D6 ➕ (added) | Profile change-password / address-save silently fails 400 | No global `toast.success` / `toast.error` wired after Profile async calls; after D3 fixed need toast wiring. | Group 12 tasks 300-range |
| D7 ➕ (added) | Cart free-shipping progress bar hardcoded `₹5000` in JSX — Admin has zero control. | Literal `freeShippingThreshold = 5000` hardcoded in Cart.jsx & Checkout.jsx. Replaced by Min-Cart-Value Control Center (this build). | Group 5 Customer Cart UX |

---
## CHAPTER 2 — USERS & GOALS (20× Targets)
### Users: 5 Personas
1. **Customer (B2C buyer)** → trap them with delightful offers. Wants: gifts, urgency, "am I getting a good deal?" reassurance, zero broken pages.
2. **Store Owner / Admin (YOU)** → zero-code control. Wants: Set min-cart value, pick gift SKU, toggle hook on/off in 1 click. No redeploys.
3. **Warehouse / CS** → stable data streams. No phantom 401s, full error context (not generic 500).
4. **Next AI Agent Operator** → 1 click resume. Read RESUME_FROM_HERE.md → work continues without a single question.
5. **Bhumivera brand** → unique "Materia Medica earth palette meets premium" feel. No generic Amazon UI clone.

### 12 Explicit Goals (20× Metrics Per Goal)
| # | Goal | Baseline (today) | 20× Target |
|---|---|---|---|
| G1 | **Stability**: Console 4xx/5xx errors happy path | ~7 errors/profile page | 0 errors. Hard zero. |
| G2 | **Min-Cart-Value Control Center** (YOUR #1 Request) | Hardcoded ₹5000 only in JSX | 20 tiered rules admin-set: min value + gift product + free ship + loyalty points + badge text. |
| G3 | **Conversion traps / offers uniqueness** | 1-2 hooks (flash sales, progress bar) | **32 hooks** across 9 surfaces — exit-intent 90s lock, low-stock fire, 3rd-order gift, spin-after-buy, etc. |
| G4 | **Admin Panels** | 10 default tabs | 6 NEW Promotions Center tabs + standalone Min-Cart Control Center tab = 17. |
| G5 | **Auth / Session** | Expired JWT → cascading wipe | Silent refresh with jtiCache anti-replay. Lockout live countdown tickers. |
| G6 | **DateTime correctness** | Broken `--:-- invalid date` error screenshot | IST-aware components across all scheduling. |
| G7 | **Every-function performance 20×** | Unbatched parallel fetches, no cache | TTL cache + Promise.all batching + lazy code split. |
| G8 | **Error quality** | Generic 500 "Failed" everywhere | Every 4xx/5xx carries `{ code, message, userAction }`. |
| G9 | **AI handoff integrity** | No resume protocol. Dead stops at handoff. | Read 1 file = pickup exact task in < 5 min AI time. |
| G10 | **Backward compatibility** | Risk of wrapper breakage | Legacy wrappers untouched; new additive only; settings seed INSERT IGNORE. |
| G11 | **Observability** | No client error logs | Client JS → `/api/client-log` → Admin SystemLogs ClientErrors subview. |
| G12 | **Loyalty tier system** | None today | 4 tiers Bronze/Silver/Gold/Platinum. Navbar progress bar + monthly tier perks. |

---
## CHAPTER 3 — FUNCTIONAL REQUIREMENTS BY DOMAIN (13 DOMAINS, 322 FRs)
### DOMAIN 0 — PRIORITY 0 BLOCKER: 5 DEFECTS ERADICATED (46 FRs detailed in tasks 1-46)
Every D1–D7 root cause addressed. Acceptance: hard-zero 401-repeat/500/400-address/no-success-toast/invalid-date errors.

### DOMAIN 1 — MIN-CART-VALUE CONTROL CENTER (YOUR EXACT REQUEST)
### FR 1.1 `cart_rules` SQL table
Columns: `id, name, description, priority INT, min_cart_value DECIMAL(12,2) NOT NULL DEFAULT 0, max_cart_value DECIMAL(12,2) NULL, discount_amount DECIMAL, discount_percent DECIMAL(5,2), free_shipping_enabled TINYINT(1), gift_product_id INT NULL FK products, gift_quantity INT DEFAULT 1, loyalty_bonus_points INT DEFAULT 0, auto_coupon_code VARCHAR(50), enforce_min_checkout TINYINT(1) DEFAULT 0, badge_text VARCHAR(255), start_time DATETIME, end_time DATETIME, status active/inactive`.

### FR 1.2 Backend REST `/api/settings/cart-rules` admin CRUD
`GET /list`, `GET /:id`, `POST /create`, `PUT /:id`, `PATCH /:id/toggle`, `DELETE /:id`. Guard `authenticateAdmin`.

### FR 1.3 `evaluateCartRules(subtotal, userProfile?)` pure deterministic engine
- Returns matched rule IDS sorted priority, totalDiscount, gifts[] to inject, shipping free?, loyalty points, badges[], enforced min or null.
- Performance budget: ≤ 25ms @ 50 rules.
- Time-window checks: start_time ≤ now ≤ end_time or both null.

### FR 1.4 Live Preview endpoint `/api/settings/cart-rules/preview?subtotal=X` (public, no auth)
Returns evaluation result so cart page can animate tier unlocking BEFORE server roundtrip for checkout. Used by:
- Admin **Min-Cart-Value Control Center** Preview Slider ("Set subtotal to ₹__ to simulate").
- Customer Cart realtime.
- Customer Checkout nudge.

### FR 1.5 Admin Standalone Tab: **MIN-CART-VALUE CONTROL CENTER**
Exact label match user terminology. Not buried under "cart rules".
- Top KPI Strip: Total Rules / Active Rules / Gift Rules / Free-Shipping Rules / Enforced-Min Tiers.
- Rules Table rows: Name | Min₹ → Max₹ | Gift | 🚚Free | 💎Points | ⛔Enforce? | Status | Actions.
- Create/Edit Modal = form with 15 fields. Gift Product Searchable Dropdown.
- Live SIMULATOR widget right-hand side: **"Simulate Cart" → number input ₹1-999,999 → displays what unlocks instantly. E.g. "Simulated ₹800 cart → 🎁 GIFT: Kumkumadi Mini (1pc) + 🚚 FREE Delivery + 💎 100 Points".

### FR 1.6 Customer Cart = MULTI-TIER PROGRESS
Replace single hardcoded ₹5000 free-shipping bar with STACKED MULTI-TIER BARS, one per active rule.
Each tier bar shows:
- Tier name badge, e.g. **🟡 SILVER TIER (₹799)**
- Progress width: `min(currentCartTotal / minRequired, 1)`
- If locked → "Add ₹X more to unlock: 🎁 GiftName + 🚚 FREE + 💎 100 pts".
- If unlocked → GREEN + bold "✅ UNLOCKED — You earned gift!".
- Threshold crossed animation → confetti + toast.

### FR 1.7 Enforcement
Any rule with `enforce_min_checkout = 1`: If user cart < that rule's min → **Checkout Button HARD DISABLED**, red label "Add ₹X more to place order. Rewards unlocked at ₹Y: [benefits]."

### FR 1.8 Server-Side Order Finalize = ALWAYS RUNS ENGINE
Client preview is informational only. Server enforces on `POST /api/orders`:
- Evaluates rules, applies discounts, injects gift product rows (unit price 0 + line_note "Cart Rule Gift — {rule.name}").
- Shipping = 0 if matched.free_shipping.
- Deposits loyalty points after order confirmed.

### FR 1.9 Coupon/CartRule Stacking Policy Admin Toggle in Settings
`stackable = true` default (best deal wins), `stackable = false` (only whichever benefit greater applies).

---
### DOMAIN 2 — 32 GAMIFIED CONVERSION TRAPS ("FEEL UNIQUE + AMAZON-BEATING")
### FR 2.1 — FR 2.32 = 32 hooks, deployable in 9 surfaces
| # | Hook Name | Placement | Behavior |
|---|-----------|-----------|----------|
| 2.1 | Exit-Intent 90s-Countdown Coupon Lock-In | Product + Cart + Checkout | On mouseLeave viewport → modal: "⏰WAIT! ₹200 OFF LIVE 90 seconds only — Claim & Stay!" button. Applies coupon AUTOMATICALLY on click. Countdown visibly ticks. |
| 2.2 | Low-Stock Fire Per Line-Item | Product Detail + Cart rows | Inventory < 5 → "🔥 Only 3 LEFT! Sold 9 this hour" with pulsing flame icon. |
| 2.3 | "X Users Viewing This Product Now" Social Proof | Product Detail | Live polling. |
| 2.4 | First-Order Badge Surprise + 24h Timer | Post-Register Shop banner | ⭐ 1ST ORDER PERK: Extra 5% + Gift Wrap FREE for next 23:59:__. |
| 2.5 | 3rd-Order Milestone Free Gift Auto-Inject | After 2nd order success + next cart loads | "🎉 On your next order — complimentary Mini Facial Kit. Already added automatically!" |
| 2.6 | Birthday 14-day Window Coupon | Profile if DOB set | 🎂 BIRTHDAY MONTH PERK: 10% OFF BDAY<userid> auto-created. |
| 2.7 | "You Saved ₹X Today — Shoppers Like You Save Y%" | Order Summary + Success | Saved-today big headline above subtotal. |
| 2.8 | Personalized "92% of Buyers Who Bought X, Also Bought:" | Below Cart + Product Detail | 3-row AI/rule-based upsell carousel with % match. |
| 2.9 | Spin-to-Win Wheel After Every Purchase | Order Success page | 100% Win probability: 5/10/15% coupons / coins / free gift on next order. Stores to user wallet. |
| 2.10 | "Your Cart Held For X:XX More Minutes" Timeout Nudge | Cart header → every minute | Countdown + "Checkout now to reserve your items." |
| 2.11 | "Added by X Shoppers in Past 24h" | Product Grid Cards | Social-proof tag under every SKU. |
| 2.12 | Abandon-Cart Email-capture nudge before tab-close | Cart > 0, mouse leave intent | Lightbox: "Save your cart + get ₹100 if you complete within 24h → enter email" → backend abandoned_carts table. |
| 2.13 | Refer & Get ₹250 + Friend Gets ₹250 | After Order Success + Profile | WhatsApp share button unique code. |
| 2.14 | Buy-3-Save-15% Bundle Tier Upsell | Product Detail | "Buy 2 → Save 5% / Buy 3 → Save 15% → Add 2 more to unlock!" badge. |
| 2.15 | Delivery Slot Urgency — "Only 2 Tomorrow Slots!" | Checkout Shipping Step | Slot button badge if count low. |
| 2.16 | Loyalty Tier Progress Micro-bar Nav Avatar Dropdown | Global Nav | "Gold (850/1000) → Spend ₹1500 → Free Express Forever". |
| 2.17 | Limited-Coupon Scarcity Bar | Flash Sales + Checkout coupon row | "First 27 of 100 claimed — 73 left!" progress. |
| 2.18 | Daily-Login Loyalty Streak | Nav + Profile | "🔥 3-Day Streak — come tomorrow for +50 bonus pts!" |
| 2.19 | Price Match Guarantee Badge | Product hero | "✅ Found cheaper? We match + beat by 5%." One-click support file. |
| 2.20 | "Customers Browsing This Category Also Bought:" Home & Category | Personalized rail. |
| 2.21 | Wishlist Low-Price Drop Alert | Product added to wishlist. Email when price ↓ ≥10%. |
| 2.22 | "Limited-Time Free Shipping Window" Banner Top | Home + Cart if customer total within ₹200 of free-shipping tier. |
| 2.23 | New-Product Early Access for Gold+ | Nav badge if tier = Gold/Platinum. |
| 2.24 | Mystery Offer Scratch-card After Review Submit | Profile after leaving product review → 100% reward. |
| 2.25 | Size-Chart One-tap → "Size you usually buy?" personalized recommendation | PDP. Reduces returns. |
| 2.26 | Checkout 1-Click Express Buttons | Checkout top if wallet ≥ total → "⚡ Pay with Wallet in 1 CLICK" prominent button. |
| 2.27 | VIP Early Access Flash Sales | Platinum tier users → 24h early unlock. |
| 2.28 | Referral Leaderboard Public | Community corner (optional). Top referrers of month badges. |
| 2.29 | "Complete the Look" Curated Outfit / Accessory Rail | PDP bottom with dynamic "Add all 3 for ₹X instead of ₹Y — You Save 12%". |
| 2.30 | Seasonal Event Countdown Clock Top Nav (Diwali / New Year Sale) | Fixed thin banner top with countdown → link to deals page. |
| 2.31 | Auto-apply Best Coupon Smart Button | Checkout coupon field → "✨ Auto-pick BEST coupon for my cart" → tests eligible + picks largest discount. |
| 2.32 | Post-Purchase Upsell 1-click Bump | Between Checkout Submit & Success → "Add this ₹149 Mini item 60% off with your order, only NOW!" 1-click yes adds, no re-enter shipping/payment. |

All 32 toggles live in Admin **Gamification Studio** tab. Per hook threshold numbers adjustable too (e.g. Low-Stock trigger at qty=3 or qty=10? admin sets).

---
### DOMAIN 3 — NEW ADMIN PROMOTIONS SUITE (6 TABS + MIN-CART STANDALONE = 7 NEW ADMIN SURFACES)
Tab ids + lazy component names:
1. **MIN-CART-VALUE CONTROL CENTER** → `MinCartValueCenter.jsx` (FR 1.5)
2. **Cart Rules Engine** (advanced rules builder) → `CartRulesEngine.jsx`
3. **Gamification Studio** (32 hooks toggles) → `GamificationStudio.jsx`
4. **Lifecycle Offers** (3rd-order / winback / churn) → `LifecycleOffers.jsx`
5. **Personalization** (welcome-name / related-algo weights) → `PersonalizationCenter.jsx`
6. **A/B Experiment Lab** (exit-intent timer 60s vs 90s etc.) → `ABExperimentLab.jsx`
7. **Loyalty Tier Forge** (Bronze/Silver/Gold/Platinum setup) → `LoyaltyTierForge.jsx`

All added to `AdminDashboard` TAB_COMPONENTS + menuSections new group **"🛒 COMMERCE CONTROL (7)"**.

---
### DOMAIN 4 — CHECKOUT 20× UPGRADE
FRs:
- 4.1 Shipping costs 100% from `settings group=shipping` keys: `standard_charge`, `express_charge`, `free_shipping_threshold`. Never hardcoded 150/0 again.
- 4.2 Min-Cart tiers progress mirror on Checkout right-hand summary.
- 4.3 Gift rows visibly marked "🎁 CART GIFT — {name} (FREE)".
- 4.4 Auto-Apply Best Coupon (2.31) button.
- 4.5 Post-purchase 1-click Upsell Bump (2.32) modal between submit → success.
- 4.6 Guarantee 4 Badges Strip: 🛡️ Purchase Protection | 🧾 E-Warranty Auto-Register | ↆↂ 7-Day Easy Return | ✅ 100% Authentic Botanicals.
- 4.7 Guest email-only checkout option → post success "Create password in 10s for future" step.

---
### DOMAIN 5 — SESSION 20× (D1 fix + lockouts + refresh)
FRs:
- 5.1 Backend `jti` on every signed JWT.
- 5.2 `POST /auth/refresh` → jtiCache anti-replay, rotates tokens.
- 5.3 `POST /auth/logout` → revoke.
- 5.4 Debounced refresh + 1x logout guard no cascading wipes.
- 5.5 Customer Login 423 lockout + LIVE EVERY-SECOND COUNTDOWN TICKER + auto-clear at 0.
- 5.6 Admin Login 423 same in both step 1 & 2.

---
### DOMAIN 6 — DATETIME 20× (D5 fix + IST correctness)
FRs:
- 6.1 ONE new dep install: `date-fns@^3.6` + `date-fns-tz`.
- 6.2 `src/utils/dateTz.js` helpers (to/from IST local input value + defaultRange).
- 6.3 Reusable `<DatetimeTzInput>` with IST badge, min/max, never-empty defaults.
- 6.4 Flash Sales, Coupons, Cart Rules start/end use it. Termination time always pre-filled to +7d for new campaign (no `--:--`).
- 6.5 Client validation end > start by ≥ 1h; server validation backup too.

---
### DOMAIN 7 — STRUCTURED ERRORS 20× (D2 + general)
FRs:
- 7.1 Every route catch: `{ code, message, userAction, status }`. Zero "Failed to ..." generic 500.
- 7.2 `utils/errorReporting.js` + `createError()` factory.
- 7.3 Frontend api.js error interceptor `e.normalized` with shape.
- 7.4 `POST /api/client-log` public rate-limited → `client_error_logs` table.
- 7.5 Admin System Logs new Client Errors sub-view.
- 7.6 All Profile async actions show success/failure toasts no silent fails.

---
### DOMAIN 8 — EVERY FUNCTION 20× PERFORMANCE REGISTER
_(Detailed line-item budget breakdown in Chapter 4)_
Functions across backend + frontend upgraded individually:
| Area | Old | 20× Budget | Mechanism |
|---|---|---|---|
| Profile mount (5 parallel endpoints sequential) | ~ 1500ms | < 200ms | `Promise.all([getProfile, orders, returns, addresses, reviews])` + TTL cache hook |
| Cart render | ~500ms | < 50ms | Memoized item rows, no re-renders on unrelated state |
| evaluateCartRules(x50 rules) | unknown | <25ms | O(n) linear, zero-N+1 |
| evaluateFlashSales products | slow | indexed by product.id map |
| Navbar prefetch on hover | N/A | <50ms next route paint | preload lazy component onMouseEnter |
| ProductGrid images | no lazy | 0 offscreen paint | `loading="lazy"` + IntersectionObserver fade-in |
| Flash sales list + products | double fetch | single batched | Promise.all once |
| Every API call | no cache | TTL 10s-60s per category | `useFetchCache.js` hook |

---
### DOMAIN 9 — LOYALTY FORGE 20×
FRs:
- 9.1 4 tiers Bronze 0 / Silver 500 / Gold 1000 / Platinum 5000 pts + admin adjustable.
- 9.2 Per-tier benefits: free_shipping_always, monthly_exclusive_coupon, priority_support, badge_color, product_access_early.
- 9.3 User profile response `.loyalty` = `{ points, tier, nextTierPointsRequired, nextTierName, progressPct }`.
- 9.4 Nav avatar micro progress bar.
- 9.5 Order confirmed → `points = floor( subtotal / 10 )` default (admin config). + Rule bonuses + Review bonuses + login streak.

---
### DOMAIN 10 — AI RESUMABILITY 20×
FRs:
- 10.1 Root-level `RESUME_FROM_HERE.md` → 1 file for next AI.
- 10.2 Spec/tasks every single task has: **ID, Title, Depends On, Priority, Files Touched, Transition-Rules (rule/rubric), Status, Resume Notes, Completion Evidence**.
- 10.3 On interruption → task Status stays `in_progress`, Resume Notes filled with line numbers.
- 10.4 Completed tasks NEVER redone. Grep rule TRs if unsure but don't apply duplicate edits.
- 10.5 Cleanup: previous completed specs HARD DELETED from `.trae/`.

---
### DOMAIN 11 — BACKWARD COMPAT 20×
FRs:
- 11.1 Existing frontend wrappers `auth.verifyResetOtp` / `auth.resetPassword` body-shape LEGACY untouched. New wrappers ADDITION only.
- 11.2 Settings rows `INSERT IGNORE` — if admin never visits, defaults = behavior matches today.
- 11.3 `GET /api/cart` response backward compat: adds `rulePreview` new key only; existing `items,total` shape identical.
- 11.4 Routes `/admin-login, /flash-sales, /forgot-password, /reset-password, /admin/forgot-password, /order-success/:orderId?` aliases all preserved; `/admin-login` redirect preserved.

---
### DOMAIN 12 — OBSERVABILITY 20×
FRs: 7.4 client-log route + 7.5 admin view + backend structured logs.

---
### DOMAIN 13 — REGRESSION DEFENSE (FINAL VALIDATION)
FRs:
- 13.1 Rule AC-01..AC-16 checklists applied.
- 13.2 Rubric AC-20..AC-25 scoring with evidence.
- 13.3 Manual 25-step happy path walk-through document with expected screens.
- 13.4 Independent sub-agent Review Phase.

---
## CHAPTER 4 — NON-FUNCTIONAL REQUIREMENTS (20 NFRs)
| ID | Type | Requirement |
|---|---|---|
| NFR-1 rule | Happy profile 30s idle → console ERROR count = 0. |
| NFR-2 rule | `/api/orders/my` repeated 401 count = max 1 on first expiry → silent refresh fixes subsequent. |
| NFR-3 rubric 0-2 (2 best) | Cart rules eval budget → 2 ≤25ms, 1 ≤40ms, 0 >40ms. |
| NFR-4 rubric 0-2 | TTI Cart Slow 4G → 2 <2s, 1 <4s, 0 >6s. |
| NFR-5 rule | Mobile breakpoint 375px → 423/401 banners render without horizontal scroll. |
| NFR-6 rule | Forgot success toast visible ≥ 2s before navigate. |
| NFR-7 rule | ForgotPassword/ResetPassword/AdminForgot → localStorage grep for resetJwt/resetJwtBearer → 0 hits. |
| NFR-8 rule | Legacy wrappers preserved. `auth.verifyResetOtp` in api.js export still hits `/auth/verify-otp`. |
| NFR-9 rule | AdminForgot page public, not wrapped in AdminRoute. (Locked-out admin = NO token yet.) |
| NFR-10 rubric 0-2 | AI resume time → 2 = next AI productive in < 5 min, 1 < 15 min, 0 > 30 min. |
| NFR-11 rule | 4 completed spec folders in .trae/ GONE after task 1 runs. Files not present. |
| NFR-12 rule | Datetime scheduling: IST 23:59 start = triggers exactly IST moment; no off-by-5:30 error. |
| NFR-13 rule | Address both snake/camel cases submit = 201/200 success. |
| NFR-14 rule | Min-Cart Rule enforcement: admin sets enforced tier ₹1000, ₹500 cart can't press Checkout. |
| NFR-15 rule | Flash Sales new campaign → Termination Time NEVER `--:--`. Defaults +7 days. |
| NFR-16 rule | New npm deps ≤ 2: only date-fns + date-fns-tz. No other net-new packages. |
| NFR-17 rule | Returns negative input (nonexistent order) → returns structured 4xx code, NEVER 500. |
| NFR-18 rule | Session 401 → localStorage cleared once per user session, not repeatedly per API call. |
| NFR-19 rule | Admin Min-Cart Simulator slider works offline. Changes without server reload. |
| NFR-20 rule | Backend routes EVERY catch → `code` field in JSON response; at least 95% of error paths. |

---
## CHAPTER 5 — ACCEPTANCE CRITERIA (rule ACs + rubric ACs, 22 ACs)
### Rule ACs = objective binary pass/fail (16)
| AC | Description |
|---|---|
| AC-01 rule | `POST /api/auth/refresh` exists → returns `{token, expiresIn}`. Revoked jti used 2x → 401 `code=TOKEN_REVOKED`. |
| AC-02 rule | Expired customer token on profile → silent refresh fires once. No repeated 401 orders/my. Zero cascading wipes. |
| AC-03 rule | returns.create POST {order_id:9999999} → 400 with `code=ORDER_NOT_FOUND`. Never 500. |
| AC-04 rule | `POST /api/addresses` camelCase `{fullName:"Akash V", line1:"Addr1", pincode, phone, city, state}` → succeeds 201 exactly like snake_case. |
| AC-05 rule | Backend exposes 6 premium reset endpoints matching api.js wrappers. Backend `/auth/reset-password` accepts both legacy body and Bearer resetJwt shapes. |
| AC-06 rule | ForgotPassword success → green inline banner + toast both present. Then navigates after delay. |
| AC-07 rule | New Flash Sales campaign: Termination time shows valid timestamp. Never `--:--`. start >= end blocked client-side. |
| AC-08 rule | Admin creates rule min=₹799 gift=productId, free_shipping=true. ₹800 customer cart → gift injected in order items server-side, shipping=0. |
| AC-09 rule | Enforced tier ₹1000, customer at ₹500 → Checkout button disabled + nudge visible. |
| AC-10 rule | Exit-intent fires once per session per page class. |
| AC-11 rule | After Task 1 runs: The 4 completed spec folder paths do NOT resolve any file inside `.trae/` tree. Gone = 0 matches. |
| AC-12 rule | `RESUME_FROM_HERE.md` file exists at Bhumivera_Frontend repo root. Size ≥ 2000 bytes. |
| AC-13 rule | Checkout shipping costs read from settings rows. If admin sets standard=49, express=149 → used live next reload. |
| AC-14 rule | No `setItem('resetJwt'` or `resetJwt` in localStorage writes in the 3 password reset pages. Grep = 0 hits. |
| AC-15 rule | Legacy wrapper export signatures `auth.verifyResetOtp` → `/auth/verify-otp` still in api.js. |
| AC-16 rule | Login/AdminLogin 423 banner counter decrements every 1 second visibly. Live, not static. |

### Rubric ACs = 0-5 score, pass threshold ≥ 3 (6)
| AC | Dimension | Scale anchors 0/3/5 |
|---|---|---|
| AC-20 | Conversion-trap feel (Amazon-beating) | 0 no hooks / 3 all 32 hooks render but basic UX / 5 "Better than Amazon browsing" — surprises, individuality, trap-by-value everywhere |
| AC-21 | Admin Min-Cart UX ease | 0 confusing / 3 usable in 2 minutes / 5 non-technical owner builds tier in < 60 seconds. |
| AC-22 | Cart-to-success TTI performance | 0 > 6s / 3 < 4s / 5 < 2s |
| AC-23 | Error actionability | 0 silent fails / 3 decent code messages only / 5 every error says "Your next step: X" |
| AC-24 | AI resumability | 0 rework required / 3 one clarifying question / 5 < 5 min productive after opening root RESUME file |
| AC-25 | Datetime IST correctness | 0 off by hours / 3 UTC only but labeled / 5 IST correct, DST boundaries fine |

---
## CHAPTER 6 — RESUME PROTOCOL SUMMARY (MIRROR OF `AI_RESUME_PROTOCOL.md` + ROOT FILE)
For next AI:
1. **OPEN ONLY THIS 1 FILE FIRST**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\RESUME_FROM_HERE.md`
2. Follow numbered steps. No code work until STEP 1-3 read complete.
3. Find `Status: in_progress` task in `tasks.md`. Resume FIRST.
4. Self-verify each TR before marking completed.
5. Interrupted mid-edit? Task stays `in_progress`. Write `Resume Notes:` line ranges last applied.
6. All done → independent review per TRAE Spec Mode.

---
## CHAPTER 7 — CONSTRAINTS / DEPENDENCIES / ASSUMPTIONS
- Constraints: ONLY 2 new packages (date-fns, date-fns-tz). All other libs already in package.json.
- Dependencies: lucide-react icons, framer-motion animations, react-router-dom v6, axios, react-hot-toast, react-icons/fi, otplib, bcrypt, jsonwebtoken, mysql2 pool, express-rate-limit, nodemailer pre-exist.
- Assumptions: products table has integer IDs usable as FK gift_product_id; `process.env.JWT_SECRET` set; IST timezone server or DB offset accepted.
- OPEN QUESTIONS for Approve or default:
  - OQ1: Default seed tier ₹799 — gift product_id NULL unless you map a SKU? Default NULL (no gift; admin maps after first login to Control Center).
  - OQ2: Points default = 1 per ₹10 spent. Ok?
  - OQ3: Exit-intent coupon flat ₹200 default OR %? default ₹200 flat, 90s.
  - OQ4: Delete 4 completed specs (Task 1) — backup outside .trae/ folder too? Default = hard DELETE only (no backup). If you say YES backup → write to sibling folder OUTSIDE `.trae/` tree.

---
END OF spec.md v2.0
