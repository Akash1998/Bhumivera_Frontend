# Bhumivera Production Hardening — Documentation Index

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [Audit Log](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/docs/audit_log.md) | 9 RCA entries: 7 dead-module families + 2 critical bugs with severity, root cause, and file:line references |
| [Change Log](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/docs/change_log.md) | Per-file DELETE / EDIT / ADD list with before/after signatures and AC mappings |
| [Test Log](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/docs/test_log.md) | 16-case E2E + negative-security test matrix with steps, expected, actual, status, evidence |
| [Deployment Runbook](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/docs/deployment_runbook.md) | Env vars, install order, build commands, health check URLs — production & dev |
| [Architecture Updates](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/docs/architecture_updates.md) | Role-permission matrix, cleaned route mount list, JWT auth flowchart, order-status flow |
| [Maintenance Guidelines](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/docs/maintenance_guidelines.md) | How to add admin tabs, public routes, env vars, rotate JWT_SECRET, role matrix cheatsheet |

## Spec & Tasks (Upstream)

- **Requirements Spec**: [spec.md](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/spec.md)
- **Implementation Tasks**: [tasks.md](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/.trae/specs/production-hardening-ecommerce/tasks.md)

## Acceptance Criteria Coverage Map

| AC Group | Spec ACs | Status | Evidence Doc |
|----------|----------|--------|---------------|
| AC-AUD | AC-AUD-1, AC-AUD-2 | ✅ PASS | audit_log.md |
| AC-DEL | AC-DEL-1, AC-DEL-2, AC-DEL-3 | ✅ PASS | change_log.md, test_log.md (TOPUP-X, FITMENT-X, BANNER-X) |
| AC-INT | AC-INT-1, AC-INT-2, AC-INT-3, AC-INT-4 | ✅ PASS | change_log.md, test_log.md (SMOKE-2, SEC-1..SEC-4) |
| AC-CLN | AC-CLN-1, AC-CLN-2, AC-CLN-3, AC-CLN-4 | ✅ PASS | change_log.md, test_log.md (DEAD-X) |
| AC-LOG | AC-LOG-1, AC-LOG-2, AC-LOG-3 | ✅ PASS | audit_log.md (RCA-BUG-1), test_log.md (SMOKE-5, SEC-2) |
| AC-ORD | AC-ORD-1..AC-ORD-4, AC-ORD-5 | ✅ PASS | audit_log.md (RCA-BUG-2), change_log.md, test_log.md (SMOKE-4) |
| AC-TST | AC-TST-1, AC-TST-2, AC-TST-3, AC-TST-4 | ✅ PASS | test_log.md |
| AC-DOC | AC-DOC-1, AC-DOC-2, AC-DOC-3 | ✅ PASS | this README + 6 sibling docs |

## Repositories

- **Backend Root**: [Bhumivera_Backend-main](file:///C:/Users/akash/Desktop/Bhumivera_Backend-main)
- **Frontend Root**: [Bhumivera_Frontend](file:///C:/Users/akash/Desktop/Bhumivera_Frontend-main/Bhumivera_Frontend)
