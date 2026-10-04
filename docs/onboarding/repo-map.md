# PREIshare repository map

Verified against this tree. Do not invent packages, scripts, or folders that are not listed here.

## Official stack (do not substitute)

- Language: TypeScript
- App framework: TanStack Start + React
- Backend/data: Supabase, PostgreSQL, pgvector (intended product stack; no Supabase folder or client in this tree yet)
- Collaboration: Git + GitHub pull requests
- Package manager: npm

## Top-level layout

| Path | What it is |
| --- | --- |
| `AGENTS.md` | Human and agent onboarding memory |
| `.cursor/rules/preishare.mdc` | Always-apply PREIshare agent rules |
| `.cursorrules` | Legacy Cursor rules; prefer `preishare.mdc` |
| `docs/onboarding/` | Orientation notes and this map |
| `docs/domain/` | Investor listing domain brief and field inventory (plain-language contract before later coding steps) |
| `docs/type-safety/` | Expected type errors plus the pre-review verification checklist |
| `docs/decisions/` | Architecture decision records (ADR-001: investor listing types) |
| `docs/handoff/` | Sprint topic handoffs (Topic 1 types → next UI / schema / API work) |
| `docs/investor-dashboard-brief.md` | Sprint 3 shell client brief (home, portfolio, deals, profile) |
| `docs/preishare-dashboard-requirements.md` | Beginner-readable requirements brief (actor, regions, must-have vs later, demo checks) |
| `docs/dashboard-routing-plan.md` | File-based URL map: inventory of `src/routes/`, `/dashboard` layout vs index, placeholder children |
| `docs/dashboard-component-architecture.md` | Shell blueprint: AppShell/Header/Sidebar/MobileNav + home widgets, responsive map |
| `docs/dashboard-ia.md` | Dashboard information architecture (four `/dashboard` URLs) |
| `docs/component-plan.md` | Dashboard component inventory (`AppShell`, widgets, must-NOT-do) |
| `docs/verification-checklist.md` | Sprint 3 integration pass: shell vs brief/IA (pass / fail / deferred with evidence) |
| `docs/sprint3-handoff.md` | Sprint 3 stakeholder handoff (what shipped, how to run, mock limits, next sprint) |
| `docs/architecture-decisions.md` | Sprint 3 shell ADRs (routing, AppShell, nav, mock data, a11y) + next-sprint foundations |
| `README.md` | Human getting-started guide |
| `package.json` | Root package (`preishare-org-repo`) and scripts |
| `src/` | TanStack Start / React application |
| `src/types/` | Shared investor-listing types (see `src/types/index.ts` barrel) |
| `src/fixtures/` | Valid sample listings plus `invalid-listings.errors.ts` (must fail typecheck) |
| `src/routes/` | File routes (`__root.tsx`, `index.tsx`, `about.tsx`, `dashboard.tsx` + `dashboard/*`) |
| `src/components/` | Marketing `Header`/`Footer`/`ThemeToggle`; dashboard layout and widgets under `layout/` and `dashboard/` |
| `src/router.tsx` | Router factory |
| `src/routeTree.gen.ts` | Generated route tree — do not edit by hand |
| `src/styles.css` | Tailwind entry |
| `vite.config.ts` | Vite + TanStack Start + Tailwind |
| `.git/` | Version control — do not edit |

## Scripts (do not invent others)

`dev`, `build`, `preview`, `generate-routes`, `typecheck` (`tsc --noEmit`) in `package.json`. No `test` script.

## Rarely touch as a first contributor

- `.git/`
- `src/routeTree.gen.ts`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json`
- `package.json` / `package-lock.json`
- `src/` product UI unless explicitly tasked
- Auth, billing, database migrations, CI secrets, large dependency upgrades (none of these exist yet — do not create them unprompted)
