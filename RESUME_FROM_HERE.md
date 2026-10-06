# BHUMIVERA — AI MID-TRANSFER RESUME BOOTSTRAP
> **POINT THE NEXT AI AT THIS EXACT FILE FIRST.** THIS IS THE ONLY FILE THEY NEED TO OPEN. Everything else links from here.
>
> *File location (always keep at Frontend repo ROOT):*
> `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\RESUME_FROM_HERE.md`

---
## STEP 0 — START HERE. DO NOT WRITE CODE YET. DO 1–6 IN ORDER.

1. **READ THIS ENTIRE FILE FIRST.** Yes every line. Should take ≤ 3 minutes.
2. Open the 3 spec-artifact files linked in STEP 1 below (in order).
3. Open `tasks.md`'s **Status columns**. Find *FIRST task* whose status is **NOT `completed`**. Usually that is `Task 1 [GCLEAN-1]`. If *no* task in_progress & some pending → start at lowest-numbered pending. If *exactly one* task marked `Status: in_progress` → **RESUME EXACTLY THAT TASK**. Never redo completed tasks.
4. When resuming any `in_progress` task → read its **Resume Notes** field. It tells you which files were half-edited and at what lines, plus what was already applied.
5. NEVER skip groups. Global dependency order is fixed in spec:
   `GCLEAN → 0 DEFECTS → 1 ERRORS → 2 SESSION → 3 CART RULES backend → 4 ADMIN 7 tabs → 5 CUSTOMER CART UX → 6 CHECKOUT → 7 HOOKS 32 → 8 PERF 20× → 9 LOYALTY → 10 TOASTS → 11 OBSERV → 12 LIVE 423 → 13 VALIDATE → 14 REVIEW`
6. Each **completed** task left a **Completion Evidence** field — structural TR (transition-rule) greps. If you're unsure whether the task actually ran → run the Grep TR checks listed in the task; if they pass → mark completed. If they fail → revert, run again cleanly; do NOT duplicate-apply (wrap guards).

---
## STEP 1 — OPEN THESE 3 FILES NOW (absolute clickable paths):
1. [spec.md — full requirements 13 domains 22 ACs](file:///c:/Users/akash/OneDrive/Documents/GitHub/Bhumivera_Frontend/.trae/specs/20x-supercommerce-total-upgrade/spec.md)
2. [tasks.md — 196 tasks, groups 0–14, ZERO placeholders](file:///c:/Users/akash/OneDrive/Documents/GitHub/Bhumivera_Frontend/.trae/specs/20x-supercommerce-total-upgrade/tasks.md)
3. [AI_RESUME_PROTOCOL.md — deep reference handoff protocol](file:///c:/Users/akash/OneDrive/Documents/GitHub/Bhumivera_Frontend/.trae/specs/20x-supercommerce-total-upgrade/AI_RESUME_PROTOCOL.md)

### Working directory roots (2 repos):
- **FRONTEND Vite React SPA**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\`
- **BACKEND Node/Express MySQL flat routes/models/middleware/utils (NO src/)**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\`

---
## STEP 2 — 5 LIVE DEFECTS ALREADY DIAGNOSED (see spec § Chapter 1 for detail):
| ID | Symptom | Root Cause | Task IDs to Fix |
|---|---|---|---|
| D1 | `GET /orders/my 401` ×3 repeated console | `/auth/refresh` endpoint NOT IMPLEMENTED + wipe cascade | 5–11 |
| D2 | `POST /returns 500` generic | returns.js catch-all | 12–14 |
| D3 | `POST /addresses 400` every save | backend snake_case vs frontend camelCase mismatch | 15–17 |
| D4 | Password reset "no success toast" | 6 premium reset endpoints MISSING in backend; also banners/toasts | 18–24 |
| D5 | Flash Sales screenshot `invalid date` tooltip | `<input type=datetime-local>` value `''` + no default + wrong timezone conversion | 4,25–31 |
| D6 | Profile password change/address silent fails | no toasts wired | 32 |
| D7 | Cart freeShipping hardcoded `=5000` JSX | literal; no admin control | 33, replaced fully by Group 3 Min-Cart-Value CONTROL CENTER |

### Must-fix FIRST before any new features. Groups 0 DEFECTS tasks 4-46.

---
## STEP 3 — USER'S #1 MANDATORY UNIQUE FEATURE (don't miss this):
### Admin named UI: **MIN-CART-VALUE CONTROL CENTER**
User exact example scenario:
> *"customer has added items worth 500 in admin panel i can set value such as 799 so it should show while check you that if you add till 799 then you will get extra gift + free delivery + whatever i want that should be controlled from admin panel."*

Implementation map (task IDs):
- Backend SQL table `cart_rules` → **Task 66**
- evaluate engine → **Task 68**
- Admin standalone tab `MinCartValueCenter.jsx` simulator slider preview → **Task 86-87**
- Customer cart multi-tier progress bars → **Tasks 128-142**
- Checkout mirror tier UI → **Tasks 146-150**
- Server side final-apply enforce tier + inject gift rows → **Task 71**
- Everything admin-toggleable with no redeploy after ship (settings KV + cart_rules rows).

---
## STEP 4 — BACKWARD-COMPAT HARD RULE (project memory, NON-NEGOTIABLE):
> Ensure the forgot handler maintains backward-compatible data shapes during upgrades.
>
> Translated to rules for YOU:
> - **NEVER** modify or delete these existing api.js exports — LEGACY wrappers must stay:
>   - `auth.verifyResetOtp` → still points to `/auth/verify-otp` with original body shape.
>   - `auth.resetPassword` → still points to `/auth/reset-password` original body shape (non-Bearer legacy).
> - NEW premium reset wrappers (Bearer resetJwt, security-question, admin variants) are **ADD-ONLY**, they live alongside legacy, never overwrite.
> - All settings rows seed via `INSERT IGNORE` so admin not touching panel = old behavior preserved.
> - `GET /api/cart` response ADDS new `rulePreview` optional key; existing shape `items + total` untouched.

If ever unsure → grep count for legacy wrapper in api.js — should equal 1, never 0.

---
## STEP 5 — NEW PACKAGE DEPENDENCY CAP (hard limit, NO other deps added):
2 total new packages only:
1. `date-fns@^3.6.0` → **already scheduled Task 4**
2. `date-fns-tz` → **already scheduled Task 4**

Any task that tries to add a 3rd npm package → CANCEL, find existing in project or write vanilla JS alternative.

---
## STEP 6 — TASK STATUS FIELD LIFECYCLE:
```
pending → in_progress → completed / blocked / cancelled
```

Rules for YOU on interruption:
1. If stopped MID-EDIT on a task → **DO NOT mark it completed**. Keep `Status: in_progress` and write to `Resume Notes:` field: (a) which files were last opened; (b) last line numbers applied; (c) which TR checks already verified. List anything. Give the next AI something to hold.
2. Completed task → ALSO fill **Completion Evidence** section. Examples:
   - `Grep count 'jwt.sign' (with jti): 14/14 → PASS`
   - `curl POST /api/auth/refresh with revoked → HTTP 401 code TOKEN_REVOKED → PASS`
   - `423 banner secondsRemaining countdown tick checked 0→60→59→58 → PASS`
3. Never duplicate run completed tasks. If in doubt → run Transition-Rule Grep / Curl checks; if passes, SKIP.
4. If a completed task's TRs actually FAIL because a dependency undid the code → mark Status=cancelled / open a NEW follow-up task with new ID referencing the regression, not reusing ID.

---
## STEP 7 — REVIEW PHASE PROTOCOL (LAST 24 tasks in GROUP 13+14):
After Groups 0–12 all Status=completed:
1. Run AC-01..AC-16 rule checklists (Group 13). Each is a distinct task. Never skip.
2. Score AC-20..AC-25 rubric 0-5 each (Group 14). Pass threshold ≥3 per rubric line-item.
3. Spawn INDEPENDENT reviewer sub-agent (different session) with prompt:
   ```
   Review Bhumivera 20x upgrade spec tasks.md. Sample 10% of tasks. For each sampled,
   run the Transition-Rules manually. Report # failed / # passed. If > 1 fails, return blocked,
   plus fix suggestions. Produce review.md inside spec folder with pass/fail table.
   ```

---
## STEP 8 — COMMON PITFALLS THE PREVIOUS AI HIT (you will avoid these):
1. ❌ "Backend has src/" → **NO**. Backend flat structure: `/routes /models /middleware /utils /config /server.js` directly in the repo root. Never look at Bhumivera_Backend/src/, it does not exist.
2. ❌ "Date validation error means form library broken" → No. It's native `--:--` empty value + `slice(0,16)` TZ-loss. Use `<DatetimeTzInput>` component (Task 26) built for this.
3. ❌ "Wipe localStorage on every 401 ever" → Bad. Causes cascades. Use debounced refresh (Task 8) + only wipe if 10s elapsed last failed refresh + no queue to run.
4. ❌ "Delete specs but keep in .trae/_archive" → User said remove FROM TRAE FOLDER. Backup OUTSIDE the repo if approved, else hard DELETE gone. Task 1 explicit.
5. ❌ "Skip writing Resume Notes because I'll continue tomorrow" → You might not. Always fill if Status=in_progress at day end.
6. ❌ "Convert project to Next.js for performance" → user NEVER asked this. Hard non-goal. Stay Vite SPA.
7. ❌ "Change camelCase backend to camel for consistency" → Don't rewrite backend fields blindly. Normalize on ingress only (Task 15 normalizer util) keep both working idempotent.
8. ❌ "I'll implement before approval" → Block 2 user instruction was EXPLICIT: **"do not modify files just a super full detailed plan"** — any runtime source code edits MAY ONLY START AFTER USER SAYS in the chat "I APPROVE, start implementation." Until then, spec/tasks artifacts ONLY.

---
## STEP 9 — EMERGENCY USER QUESTIONS YOU CAN'T ANSWER (OQ 1-4 from spec § Chapter 7):
If you need these answered to advance, ASK USER, not guess:
- OQ1: Default tier₹799 gift product id, NULL until admin picks? (we default NULL)
- OQ2: Points 1 per ₹10 default? (we default 1/₹10)
- OQ3: Exit-intent coupon flat ₹200 or %? (we default flat ₹200 90s)
- OQ4: Delete 4 completed specs — backup OUTSIDE .trae/ folder too? (we default HARD DELETE only, no backup)

---
## STEP 10 — 20× OPTIMIZATION REGISTER CHEATSHEET (jumpstart):
If starting GROUP 8:
| Baseline | 20× Target | Technique |
|---|---|---|
| Profile mount 1500ms sequential | <200ms | Promise.all([profile, orders, returns, addresses, reviews]) |
| Cart re-render 500ms | <50ms | React.memo per item row |
| Rules eval 50ms+ | <25ms | linear O(n), zero nested loops, pre-sort priority |
| Offscreen images painted immediately | 0 until visible | loading="lazy" + IntersectionObserver fade |
| No prefetch navigation | <50ms paint next route | onMouseEnter navbar link → preload lazy |
| SELECT * everywhere 10kb JSON | 1kb avg | column whitelists in models |
| settings fetch every render | 1 every 10 min | 10-min mem TTL in SettingsContext |

---
### THAT IS EVERYTHING YOU NEED. START RESUMING NOW.
> First action → open `tasks.md` → find Status `in_progress` OR start Task 1.
> Don't overthink. Follow dependency order, run TRs after each task, fill Resume Notes if interrupted. You'll ship 20× Bhumivera on time.
