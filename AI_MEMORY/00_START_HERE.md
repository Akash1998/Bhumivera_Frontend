# 🧠 Bhumivera Frontend — Master AI Memory & Self-Enforcing Agent Protocol

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & BOTS (Claude, Gemini, GPT, Cursor, Copilot, Cline, Windsurf, etc.):**
> 
> **STOP & READ THIS FIRST BEFORE PROPOSING OR EXECUTING ANY FRONTEND EDITS!**
> 
> Even if the USER DID NOT explicitly say *"update AI memory"* in their prompt, you are **STRICTLY REQUIRED** by this repository's architecture to:
> 1. Consult the **Current Frontend Inventory Counters** below before modifying files.
> 2. Respect the strict boundary between `/admin` (Website & Marketing Governance) and `/inventorysoftware` (100% Orders, Shipping Labels, RTO Returns & Stock).
> 3. **Immediately record any page/component/feature additions in [`AI_MEMORY/03_BOT_STATE_LEDGER.md`](./03_BOT_STATE_LEDGER.md)**, incrementing the respective counters (e.g. from 79 to 80 pages).
> 4. Leave explicit **Next Bot Handoff Directives** so subsequent AI sessions never analyze from scratch.

---

## 1. Quick Master Navigation (Inside `Bhumivera_Frontend`)

| Document | Purpose | Core Contents |
| :--- | :--- | :--- |
| **[`01_FRONTEND_ARCHITECTURE.md`](./01_FRONTEND_ARCHITECTURE.md)** | **Architecture Blueprint** | React 18.3, Vite 6, Tailwind CSS v4, Framer Motion, Capacitor 8.5 Android app, 5 panels, routes in `App.jsx`, context providers. |
| **[`02_PAGES_AND_STUDIOS_REGISTRY.md`](./02_PAGES_AND_STUDIOS_REGISTRY.md)** | **Frontend Manifest** | **79 Total Pages (43 Storefront & Portal Pages + 36 Admin Studios) \| 7 Contexts \| 3 Shell Layouts**. Complete file list. |
| **[`03_BOT_STATE_LEDGER.md`](./03_BOT_STATE_LEDGER.md)** | **Living State & Bot Relay** | **The delta ledger**. Chronological log of bot edits, previous count vs new count, exact changes made, and instructions for next bot. |
| **[`04_BOT_SELF_UPDATE_PROTOCOL.md`](./04_BOT_SELF_UPDATE_PROTOCOL.md)** | **Bot Operating Manual** | Step-by-step instructions and templates for bots to maintain this frontend memory system autonomously. |

---

## 2. Global Frontend Counters (Verified Baseline)

*Audit verified via `node AI_MEMORY/scripts/audit_memory.js` on 2026-11-03.*

```
======================================================================
  BHUMIVERA FRONTEND METRIC BASELINE
======================================================================
• Total Page Modules:           79 JSX files
• Storefront & Customer Portals: 43 pages
• Admin Management Studios:     36 studios (src/pages/admin/)
• React Context Providers:      7 contexts (Cart, Auth, Toast, etc.)
• Native Mobile Packaging:      Capacitor 8.5 (Android)
• Framework Stack:              React 18.3 + Vite 6 + Tailwind CSS v4
======================================================================
```

---

## 3. The 5-Panel Isolation Rule (Zero Confusion)

1. **Storefront (`bhumivera.com`)**: Public customer catalog, batch verification, checkout, and live order tracking.
2. **Website Admin (`/admin`, `/admin/dashboard`)**: Reserved strictly for Website & Marketing Governance (Spins, Referrals, Customer CRM, Catalog, GST).
   - **CRITICAL**: Order lifecycle, shipping labels, returns, and warehouse inventory are **REMOVED** and routed automatically to `/inventorysoftware`.
3. **Support Desk (`/support`)**: L1–L3 Support Agent ticketing, live customer chat, courtesy coupons.
4. **SuperAdmin Support (`/superadminsupport`)**: Staff IAM, support agent credentials, warehouse staff IDs, passkeys & TOTP.
5. **Omnichannel Inventory Software (`/inventorysoftware`)**:
   - Order lifecycle (`?view=online`), 4x6 thermal courier labels (`?view=labels`), undelivered RTO return/restock (`?view=ret`), master stock lock (`?view=inv`), offline POS billing (`?view=sale`), mobile QR scanner bridge (`?view=scanner`), storage bin keeper (`?view=keeper`), GRN inwarding (`?view=grn`), physical stock audit (`?view=audit`), and daily SQL backups (`?view=backup`).

---

## 4. The Bot Rule: How to Handle Page or View Additions

Suppose you (the AI) are asked:
> *"Add a new loyalty history view"* or *"Add a move function to inventory software"*

**Your mandatory workflow:**
1. **Check existing count**: Frontend currently has **79 pages** (43 storefront + 36 admin studios).
2. **Implement the component/view**: Register the route in `App.jsx` or tab in `AdminDashboard.jsx`.
3. **Update Memory Ledger**:
   - Open `AI_MEMORY/03_BOT_STATE_LEDGER.md`.
   - Add a row:
     `src/pages/...` | Page Count: `79 -> 80` | Added component | Note for next bot: *"Registered in App.jsx under route /..."*
   - Update `AI_MEMORY/02_PAGES_AND_STUDIOS_REGISTRY.md` to reflect the new count.

**By following this rule, any future bot entering `Bhumivera_Frontend` will immediately see what you did, the new count, and can continue building without re-reading or guessing!**
