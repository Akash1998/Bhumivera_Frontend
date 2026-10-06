# AI RESUME PROTOCOL — DEEP REFERENCE
> Location: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\.trae\specs\20x-supercommerce-total-upgrade\AI_RESUME_PROTOCOL.md`
>
> Companion bootstrap (use THIS one first when you are a NEW AI mid-transfer):
> `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\RESUME_FROM_HERE.md`

---
## STEP 0 — BOOTSTRAP (from RESUME_FROM_HERE root file)
New AI opens `RESUME_FROM_HERE.md` at Frontend repo root → executes steps 0-10. This document = detailed same steps with extra rules.

---
## STEP 1 — READ IN ORDER (no coding yet):
1. This file.
2. `spec.md` in this folder.
3. `tasks.md` in this folder.

---
## STEP 2 — 10 IRON RULES FOR AI OPERATION IN THIS REPO
1. **NEVER RE-DO completed tasks.** tasks.md Status=completed → never apply same edit again. If in doubt → run TR greps.
2. **If interrupted mid-edit → task stays in_progress, NEVER mark completed.** Fill Resume Notes with exact line numbers / file states.
3. **Dependency order = GROUP ORDER.** Never GROUP 4 before GROUP 3; never GROUP 8 before 0-7.
4. **NO SSR. NO Next.js migration. Stay Vite React SPA.** (Hard non-goal unless user re-specifies.)
5. **Backend repo has NO `src/`.** Routes/models/middleware at repo root.
6. **Legacy auth wrappers PRESERVED ALWAYS.** `auth.verifyResetOtp → /auth/verify-otp`, `auth.resetPassword → body-shape` unchanged.
7. **New package cap = 2 only.** date-fns, date-fns-tz. No more.
8. **Completed specs = removed from .trae/.** (Task 1 GCLEAN.)
9. **Min-Cart admin tab NAME IS LITERAL "MIN-CART-VALUE CONTROL CENTER".** No "cart rules" synonym for tab label.
10. **Admin panel controls every commercial variable.** No redeploy shipping/coupon/cart-tier/gift/hook thresholds post-ship.

---
## STEP 3 — REPO LAYOUT MAP
### Frontend:
```
Bhumivera_Frontend/
├── RESUME_FROM_HERE.md   ← TOP LEVEL (this project handoff doc bootstrap)
├── src/
│   ├── services/api.js   ← ONE single source of truth for ALL HTTP calls (edits here)
│   ├── context/          ← Auth, Cart, Wishlist, Compare, Settings, Toast
│   ├── pages/
│   │   ├── admin/        ← Admin tabs + AdminDashboard lazy imports
│   │   ├── Cart.jsx      ← MIN-CART multi-tier UX apply site
│   │   ├── Checkout.jsx  ← mirror tiers + enforce
│   │   ├── Profile.jsx   ← 32 password toasts, address normalizer A/B
│   │   ├── ForgotPassword.jsx, ResetPassword.jsx, admin/AdminForgotPassword.jsx
│   │   └── OrderSuccess.jsx
│   ├── components/       ← DatetimeTzInput new (task 26) + existing Toasts etc
│   └── utils/dateTz.js
└── .trae/specs/20x-supercommerce-total-upgrade/  ← spec/tasks/resume here.
```

### Backend:
```
Bhumivera_Backend/
├── server.js
├── routes/    authRoutes, orderRoutes, returnRoutes, addressRoutes, settingsRoutes, cartRoutes, flashSalesRoutes, couponRoutes, userRoutes, profileRoutes
├── models/    settingsModel, returnModel + NEW cartRulesModel + client_error_logs
├── middleware/ authMiddleware authenticateUser/admin/warehouse
├── utils/     jtiCache.js + NEW fieldNormalizer.js + NEW passwordPolicy validator + NEW errorReporting
└── config/    db pool
```

---
## STEP 4 — DEFECT INVENTORY QUICK-REFERENCE
| ID | Fix in Tasks |
|---|---|
| D1 repeated 401 | 5,6,7,8,9,10,11 |
| D2 returns 500 | 12,13,14 |
| D3 addresses 400 | 15,16,17 |
| D4 reset success toast + routes | 18,19,20,21,22,23,24 |
| D5 flash invalid date + coupons | 4,25,26,27,28,29,30,31 |

---
## STEP 5 — MIN-CART CONTROL CENTER FLOW (USER #1 FEATURE)
Admin build tier → Frontend Cart multi-tier UX → Customer sees unlock → Server validates + injects gifts/ship0.
Task IDs 66–84 + 86–87 + 128–161.

---
## STEP 6 — 32 CONVERSION HOOKS QUICK LIST
See spec.md Chapter 2 § FR 2.1–2.32 for exact per-hook behavior. GROUP 7 tasks 162-190.

---
## STEP 7 — TASK FIELD DEFINITIONS (used in every tasks.md row):
- **ID**: Unique, stable. Never renumber even if inserting later; append letter A/B if needed.
- **Title**: Active verb one-liner.
- **Depends On**: Task IDs required to pass first. Not listed = safe concurrent if no file overlap.
- **Priority**: blocker / high / medium / low. Blocker means downstream ALL blocked.
- **Files Touched**: Exact absolute paths. Grep the files before first edit.
- **Transition-Rules (TRs)**: Two kinds:
  - **rule**: binary pass/fail. Usually a grep count, curl status-code, key presence. PASS = mark completed. FAIL = fix.
  - **rubric**: integer 0–5 with anchors. Threshold written in the task. If below threshold = fix / redo.
- **Status**: pending / in_progress / completed / blocked / cancelled
- **Resume Notes**: (critical for interruption) — last line numbers applied, which files opened, what verified, which pending (never leave blank if Status = in_progress).
- **Completion Evidence**: After you marked completed — write concrete proof outputs, e.g. `curl /api/auth/refresh 401 TOKEN_REVOKED — PASS`.

---
## STEP 8 — INTERRUPTION PLAYBOOK (user says "STOP + SAVE")
Within 15 seconds:
1. Save any open edits to disk if syntactically valid; if mid-expression wrap with `/* INTERRUPTED resume here */` comment + close open parens/braces so diagnostics pass.
2. In tasks.md, set current task `Status: in_progress`.
3. Populate its `Resume Notes:` section. Be granular. Example:
   ```
   Resume Notes:
   - Opened backend/routes/authRoutes.js for Task 6 (/auth/refresh).
   - jtiCache.rotate added up to line 212.
   - Return body {token, expiresIn} written. Test 2 TR1 (route defined) PASS.
   - Not yet verified: replayed refresh TR2 → TOKEN_REVOKED — NEXT AI run that curl.
   - Not yet touched: frontend interceptor logic.
   ```
4. Notify user "saved safe — resume point: Task 6 Status in_progress".

---
## STEP 9 — TRANSITION FROM PREVIOUS AI TO YOU
If you receive handoff with no Status in_progress:
- Grep all tasks for `in_progress` → count matches.
  - 0 matches → start from lowest pending task ID (Task 1).
  - 1 match → that's your first task.
  - 2+ matches → pick lowest numbered among them; later mark the others "blocked on first" if they overlap files.

---
## STEP 10 — FINAL REVIEW
Run Group 13 (AC-01..AC-16 rule tasks), Group 14 (rubric scores + independent reviewer) → produce review.md in this folder with pass/fail per sample task. Seal: write line in root RESUME doc if changes needed.

---
END OF AI_RESUME_PROTOCOL.md DEEP REFERENCE.
