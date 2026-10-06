# AI RESUME / HANDOFF PROTOCOL
## Bhumivera 20× Super-Commerce Total Upgrade
**Sibling files**: `spec.md` (full requirements), `tasks.md` (task queue with Status & TR checks)

This document is BINDING for any AI operator (TRAE or otherwise) resuming this project. Read the entire file before opening any source code.

---
## STEP 0 — OPEN THESE 4 FILES FIRST (no code changes yet!)
1. Spec: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\.trae\specs\20x-supercommerce-total-upgrade\spec.md`
   - Pay attention to §1.1 Problem/Live Defects D1-D5 (ROOT CAUSES identified, never re-diagnose)
   - §5 = full resume protocol mirror of this file
   - §4 Acceptance Criteria (rule AC-01..AC-16 + rubric AC-20..AC-25)
2. Tasks: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\.trae\specs\20x-supercommerce-total-upgrade\tasks.md`
3. This file: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\.trae\specs\20x-supercommerce-total-upgrade\AI_RESUME_PROTOCOL.md`
4. If present after work began: `review.md` (same folder) — read Review History if any.

---
## STEP 1 — DECIDE CURRENT WORK ITEM (exactly one of these, in this priority order)
### Priority 1: Any task with Status = in_progress
Grep in `tasks.md` for the literal string `Status: in_progress`.
If one or more matches:
- Pick the lowest-numbered matching task (ID monotonic = dependency order).
- Open its "Resume Notes:" section — this tells you where the previous AI stopped.
- Do NOT start new tasks until all in_progress are resolved completed or blocked.

### Priority 2: Otherwise pick highest-priority (high > medium > low) pending task whose Depends On are ALL Status: completed.
- Never skip dependency ordering. Tasks are numbered in dependency order globally.

---
## STEP 2 — UPDATE TASK STATUS TO in_progress (if not already)
Edit `tasks.md` at the task's Status line from `Status: pending` → `Status: in_progress`.
- DO NOT change any other task's Status line.
- Leave Resume Notes blank unless you get interrupted mid-task.

---
## STEP 3 — EXECUTE THE TASK (Standard TRAE pattern)
1. **Read first**: Use Read tool on ALL files under "Files Touched" to get current file contents and line numbers. Never apply edits based on memory.
2. **Apply changes**: Use Edit (preferred) or Write tool (only NEW files). One atomic change per edit call.
3. **Never modify files outside Files Touched** without adding the file first to the task.

---
## STEP 4 — SELF-VERIFY EVERY TRANSITION RULE (TR)
Under the task's "Transition-Rules" section:

### For type `rule TR-<n>` (binary):
- Run a `Grep` (structural), or `GetDiagnostics` (lint), or a `RunCommand` curl test.
- Must produce observable PASS evidence. If FAIL, stay in_progress, fix, re-verify.

### For type `rubric TR-<n>` (0-X scale, pass threshold noted):
- Score it, write rationale + how you'd reproduce the score (e.g. "admin built rule in 42s → score 2").

Never mark a task completed until every TR passes.

---
## STEP 5 — WRITE COMPLETION EVIDENCE + MARK COMPLETED
Under "Completion Evidence" heading fill:
```
Applied YYYY-MM-DD HH:mm.
Files: <file1> Lstart-Lend, <file2> Lstart-Lend.
Rule TR-1: (evidence, e.g. grep X returns 4 hits → PASS)
Rule TR-2: ...
Rubric TR-N: score 2/N, rationale. "Admin created the example rule in 54s."
```
Then update Status line → `Status: completed`.

Update global progress counter at top of tasks.md: `Progress: X / 196 tasks completed.`

---
## STEP 6 — ON INTERRUPTION (if session cuts mid-task)
1. DO NOT mark the task completed. Leave it Status: in_progress.
2. Add or fill the section `Resume Notes:` at that task:
   - What was read: files + line ranges already confirmed.
   - What was edited: file + anchor snippet of last successful edit + next planned edit.
   - What TRs verified so far: e.g. "TR-1 PASS, TR-2 unverified (needs POST /auth/refresh test)".
   - What was about to be done NEXT.
3. Save tasks.md. Next session Step 1 finds it.

---
## STEP 7 — PREVIOUSLY COMPLETED SPECS (ARCHIVED. NEVER RE-OPEN.)
After task G-CLEAN-1 runs these live under:
```
Bhumivera_Backend/.trae/specs/_archive/20261006-deep-scan-pending-upgrades/
Bhumivera_Backend/.trae/specs/_archive/20261006-premium-auth-overhaul/
Bhumivera_Backend/.trae/specs/_archive/20261006-production-stability-hardening/
Bhumivera_Frontend/.trae/specs/_archive/20261006-full-connectivity-a-to-z-upgrade/
```
Rules:
- NEVER modify archived spec/tasks files.
- NEVER re-run their completed tasks. Previous Groups A→H (frontend full connectivity) were 100% verified — if code appears broken, add a NEW task in THIS spec to fix the regression, never go back.
- If G-CLEAN-1 not yet done, first thing in a fresh session is run Task 1.

---
## STEP 8 — NON-GOALS (REJECT IF USER ASKS OUT OF SCOPE)
Never implement these mid-session — open a new spec for them:
- Switch to SSR / Next.js / Nuxt
- Change MySQL → PostgreSQL or any DB driver swap
- Add payment gateways beyond COD + wallet (Razorpay/Stripe integration is NEW spec)
- Warehouse module / Affiliate module full rewrites (only error-format structuring allowed per FR-7.1)
- Rewrite auth away from JWT Bearer (no sessions table)

---
## STEP 9 — INTERRUPTED GROUPS CONTINUITY NOTES
If last-known progress shows:
- Group 0-DEFECTS partially done (D1 done, D2 not): always finish Defects group before moving to Cart Rules. Defects = blockers.
- Group 3 (Cart Rules backend) done but Group 4 (Admin UI) not: Admin page tabs can be added one at a time — order is CRE-1 → CRE-2 → CRE-3/4 → GAM-1/2 → LC-1/2 → PERS-1/2 → AB-1/2 → TIER-1/2 → SET-1. Verify each with V-A tasks.
- Group 4 (admin tabs) partially, Group 5 (Customer Cart UX) not started: Group 4 Admin must fully build rules BEFORE customer sees them (otherwise user-facing nudge references will 404).

---
## STEP 10 — ON 100% TASKS DONE (Progress = 196/196 completed)
Enter REVIEW phase per TRAE-spec-mode:
1. If no review.md → create it.
2. Launch a FRESH sub-agent with only READ-only access.
3. Hand the reviewer: spec.md, tasks.md, review.md, repo roots.
4. Contract: "Re-check every rule AC AC-01..AC-16 independently. Score every rubric AC-20..AC-25. Produce: pass/fail/blocked, actionable findings if any."
5. If review = pass → mark session as done and notify user.
6. If review = fail → add new REMEDIATION tasks at end of tasks.md with Status pending. Mark existing failed AC with references. Enter Implement Phase again for new tasks.

---
## QUICK GREP CHEATSHEET for AI resuming
Find the next item with:
```powershell
# Find next in-progress task
Select-String -Path tasks.md -Pattern "Status: in_progress" -Context 2,2
# Find all completed count
(Select-String -Path tasks.md -Pattern "Status: completed").Count
# Find pending high-priority
Select-String -Path tasks.md -Pattern "Priority: high" | Select-String -Pattern "Status: pending" -Context 1,1
```

---
## SCOPE BOUNDARY: 2 REPOS
- **Frontend root**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Frontend\`
  - All customer & admin UI pages under `src/pages/`
  - All lazy imports, routing in `src/App.jsx`
  - API wrappers + interceptor in `src/services/api.js`
  - Context providers: Auth, Cart, Wishlist, Compare, Settings, Toast under `src/context/`
- **Backend root**: `c:\Users\akash\OneDrive\Documents\GitHub\Bhumivera_Backend\`
  - Entry: `server.js`
  - Routes: `routes/*.js`
  - Models: `models/*.js`
  - Utils: `utils/*.js` (passwordPolicy, hibp, mail, jtiCache, otpBackoff, rateLimiter middleware, etc.)
  - Middleware: `middleware/authMiddleware.js`, `middleware/rateLimiter.js`

---
END OF AI_RESUME_PROTOCOL.md
