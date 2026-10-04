# PREIshare Investor Dashboard Shell

TanStack Start + TypeScript app for the PREIshare **investor dashboard shell** (Sprint 3). Members can click Home, Portfolio, Deals, and Profile inside one layout. **All numbers and names are labeled mock data** — this is not live portfolio software.

Package name: `preishare-org-repo`. Package manager: **npm**.

## Cold start

1. Install [Node.js LTS](https://nodejs.org/) so `node` and `npm` are on your PATH.
2. Open a terminal in this repository root (the folder with `package.json` and `docs/`).
3. `npm install`
4. `npm run dev` — Vite on **port 3000**
5. Open http://localhost:3000, then http://localhost:3000/dashboard (or click **Open investor dashboard**).

Stop the server with `Ctrl+C`.

There is **no** `test` script. Do not invent one.

## Scripts (from `package.json`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (`vite dev --port 3000`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run generate-routes` | `tsr generate` (do not hand-edit `src/routeTree.gen.ts`) |

## Investor URLs

| Path | What you should see |
| --- | --- |
| `/dashboard` | Home overview — mock stats, portfolio summary, recent activity |
| `/dashboard/portfolio` | Holdings table (placeholders) |
| `/dashboard/deals` | Open-deal cards (`published` / `under_offer`) |
| `/dashboard/profile` | One mock member card |

Marketing `/` and `/about` remain. They are not dashboard nav items.

## Handoff docs

- [Sprint 3 handoff](docs/sprint3-handoff.md) — what shipped, how to demo, what is still mock
- [Architecture decisions](docs/architecture-decisions.md) — why routes, AppShell, and the mock-data line exist
- [Verification checklist](docs/verification-checklist.md) — pass / fail / deferred evidence
- Planning: [client brief](docs/investor-dashboard-brief.md), [IA](docs/dashboard-ia.md), [component plan](docs/component-plan.md)

## Project notes

- File-based routes live under `src/routes/`. Dashboard chrome is `AppShell` in `src/components/layout/`.
- Nav labels and paths live in `src/components/layout/navConfig.ts` only.
- Dashboard styles: `src/styles/dashboard.css`.
- Listing types (Sprint 2) stay the deal vocabulary: `src/types/index.ts`.
