# CLAUDE.md — Instructions for Claude Code in Bhumivera_Frontend

## Repository Overview
React 18.3 + Vite 6 + Tailwind CSS v4 + Capacitor 8.5 client storefront and admin portals for Bhumivera Organics India Private Limited.

## Core Protocols for Claude
1. **Always Read AI Memory First**:
   - Check `AI_MEMORY/00_START_HERE.md` and `AI_MEMORY/03_BOT_STATE_LEDGER.md` before analyzing code.
2. **Current Baseline**:
   - 79 total pages (43 storefront & portal pages + 36 admin studios).
3. **Mandatory Memory Update Protocol**:
   - Whenever you add or alter pages or studios, you MUST update `AI_MEMORY/03_BOT_STATE_LEDGER.md` with count deltas (`Prev -> New`) and next bot instructions, even if the user did not explicitly remind you in their prompt.
4. **Validation**:
   - Run `node AI_MEMORY/scripts/audit_memory.js` to verify counters against disk.
