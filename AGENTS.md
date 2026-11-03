# 🤖 AGENTS.md — Bhumivera Frontend Agent Directives

> **APPLIES TO ALL AUTONOMOUS AGENTS (Gemini, Claude, GPT, Antigravity, Aider, Roo Code, Cline, Windsurf, Cursor):**

Welcome, Agent. You have arrived at the **`Bhumivera_Frontend`** repository.

## 🛑 MANDATORY FIRST ACTION
Do NOT guess or analyze the frontend codebase from scratch.
**Your very first action MUST be to inspect:**
* [`AI_MEMORY/00_START_HERE.md`](./AI_MEMORY/00_START_HERE.md) — Architecture & protocols
* [`AI_MEMORY/03_BOT_STATE_LEDGER.md`](./AI_MEMORY/03_BOT_STATE_LEDGER.md) — What the last bot changed & handoff notes

---

## 📊 CURRENT SYSTEM BASELINE COUNTERS
* **Total Pages & Studios**: 79 JSX files
* **Storefront & Portals**: 43 pages
* **Admin Management Studios**: 36 studios (`src/pages/admin/`)
* **React Context Providers**: 7 contexts

---

## 🔒 PANEL ISOLATION DIRECTIVE
* All Online Orders, Shipping Labels, RTO Returns, and Master Stock Management live exclusively in **`/inventorysoftware`**.
* The **`/admin`** panel is strictly reserved for Website & Marketing Governance (Spins, Referrals, Customer CRM, Catalog, GST).
* Do NOT cross-pollinate or duplicate order/stock features across `/admin` and `/inventorysoftware`.

---

## ✍️ SELF-UPDATING REQUIREMENT (MANDATORY ON EVERY CHANGE)
Even if the user's prompt DOES NOT mention updating memory:
Whenever you add, modify, or delete code:
1. Recalculate the count of pages/components in that module.
2. Update the counter in [`AI_MEMORY/02_PAGES_AND_STUDIOS_REGISTRY.md`](./AI_MEMORY/02_PAGES_AND_STUDIOS_REGISTRY.md).
3. Append a new chronological entry to [`AI_MEMORY/03_BOT_STATE_LEDGER.md`](./AI_MEMORY/03_BOT_STATE_LEDGER.md) with:
   - File touched
   - Delta (`Previous Count -> New Count`)
   - Exact description of changes
   - Handoff note for the NEXT bot.
4. Verify using: `node AI_MEMORY/scripts/audit_memory.js`.
