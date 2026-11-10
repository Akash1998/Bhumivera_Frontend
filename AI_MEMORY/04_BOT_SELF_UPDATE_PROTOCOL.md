# 🤖 Bhumivera Frontend — Bot Self-Updating Protocol & Operating Manual

> **SYSTEM LAW FOR ALL AI AGENTS & BOTS**:
> 
> You are operating within the `Bhumivera_Frontend` repository.
> 
> **THE USER WILL NOT ALWAYS REMIND YOU TO UPDATE MEMORY.**
> 
> Your instructions to maintain this memory come directly from these repository files. You are expected to honor this self-enforcing protocol on **every single task** that modifies frontend code.

---

## 1. The 3-Step Lifecycle

```
1. READ FIRST:
   - Check AI_MEMORY/00_START_HERE.md and AI_MEMORY/03_BOT_STATE_LEDGER.md.
   - Note the existing page or studio count in AI_MEMORY/02_PAGES_AND_STUDIOS_REGISTRY.md.

2. IMPLEMENT:
   - Write clean, responsive React 18 / Tailwind CSS components.
   - Respect panel isolation: Orders & Stock belong to /inventorysoftware, Marketing & CRM to /admin.

3. UPDATE MEMORY (MANDATORY):
   - Calculate the delta (e.g., Previous: 79, New: 80).
   - Update the count in AI_MEMORY/02_PAGES_AND_STUDIOS_REGISTRY.md.
   - Append a new row in AI_MEMORY/03_BOT_STATE_LEDGER.md with your changes and instructions for the next bot.
```

---

## 2. Standardized Templates

### When Adding a Storefront Page:
1. Create `src/pages/<PageName>.jsx`.
2. Register the route in `src/App.jsx`.
3. In `AI_MEMORY/02_PAGES_AND_STUDIOS_REGISTRY.md`:
   - Add `<PageName>.jsx` to the storefront table.
   - Increment `Total Page Modules` (e.g. `79` -> `80`).
4. In `AI_MEMORY/03_BOT_STATE_LEDGER.md`, append:
   ```markdown
   | #XXX | YYYY-MM-DD HH:MM IST | [Your AI Model] | src/pages/<PageName>.jsx | ADDED | 79 -> 80 pages | Added new storefront route /... | NEXT BOT: [Instructions] |
   ```

### When Adding an Admin Studio:
1. Create `src/pages/admin/<StudioName>.jsx`.
2. Register the tab in `src/pages/AdminDashboard.jsx`.
3. In `AI_MEMORY/02_PAGES_AND_STUDIOS_REGISTRY.md`:
   - Add `<StudioName>.jsx` to the admin studios table.
   - Increment `Total Page Modules` (e.g. `79` -> `80`).
4. In `AI_MEMORY/03_BOT_STATE_LEDGER.md`, record the addition.

---

## 3. Verification Command

Verify that memory numbers match actual disk files at any time:

```powershell
node "AI_MEMORY/scripts/audit_memory.js"
```
