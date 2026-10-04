# Sprint 3 Handoff — PREIshare Investor Dashboard Shell

**Status:** Ready for stakeholder demo of the **UI shell** (not a live product)  
**Verified:** 2026-10-04 — `docs/verification-checklist.md` (all in-scope checks Pass; auth and live data Deferred)  
**Package:** `preishare-org-repo` (npm at the repo root)

## Stakeholder summary

We built a responsive investor dashboard **shell** for PREIshare members.
Investors can move between Dashboard Home, Portfolio, Deals, and Profile
without hunting through cluttered pages. Numbers and lists use **mock data**
so the UI can be demoed before live backend integration.

Say this in the room: **the investor dashboard shell is navigable; live data and login are next.** Do not say the dashboard product is done. Every figure on screen is a labeled placeholder (for example “Sample total”, “Sample data — placeholders only, not live balances”). There is no sign-in gate and no connection to Supabase, PostgreSQL, or pgvector in this sprint.

## What shipped

- TanStack Start + TypeScript app at the repository root (`package.json` name `preishare-org-repo`)
- File-based routes under `src/routes/`:
  - `/` — marketing home with a link **Open investor dashboard**
  - `/about` — starter about page (not a dashboard destination)
  - `/dashboard` — home overview (parent layout `src/routes/dashboard.tsx` + `src/routes/dashboard/index.tsx`)
  - `/dashboard/portfolio` — `src/routes/dashboard/portfolio.tsx`
  - `/dashboard/deals` — `src/routes/dashboard/deals.tsx`
  - `/dashboard/profile` — `src/routes/dashboard/profile.tsx`
- Shared layout: `AppShell`, `Sidebar`, dashboard `Header` (not the marketing header), `NavItems` + `navConfig` with active states
- Home widgets: `StatsCard` (portfolio value $300,000, open deals 3, contributions YTD $24,000), `PortfolioSummary`, `RecentActivity`
- Area shells: `PortfolioTable`, `DealsList` (investor chips **Open** / **Under offer** for `published` / `under_offer`), `ProfileCard` (Alex Morgan placeholders)
- Responsive + basic accessibility polish in `src/styles/dashboard.css` (desktop sidebar; hamburger under 768px; skip link; focus rings)
- Integration evidence: `docs/verification-checklist.md`

Nav labels are exactly **Home**, **Portfolio**, **Deals**, **Profile**. No Admin, Settings, Billing, Notifications, or Login screens shipped.

## How to run locally (cold start)

Package manager is **npm**. Scripts below are copied from `package.json` — there is **no** `test` script.

1. Install [Node.js LTS](https://nodejs.org/) if `node` or `npm` is missing.
2. Open a terminal in the folder that contains `package.json` and `docs/`.
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev` (Vite on **port 3000**)
5. Open http://localhost:3000 then go to http://localhost:3000/dashboard (or click **Open investor dashboard** on `/`).

Stop the server with `Ctrl+C`.

Other scripts that exist (optional): `npm run typecheck` (`tsc --noEmit`), `npm run build`, `npm run preview`, `npm run generate-routes`.

## Short demo script

1. Land on **Dashboard Home** (`/dashboard`). Point at the three stats cards and say they are **sample** figures ($300,000 total, 3 open deals, $24,000 YTD). Show Portfolio summary + Recent activity on the same page.
2. Use the **sidebar** (desktop) or the **Open navigation** button (phone width) to open Portfolio, Deals, and Profile. Do not use the browser Back button as the only path.
3. On Portfolio, show the holdings table (Riverfront Multifamily, Cedar Industrial, cash reserve) and the “not live balances” badge.
4. On Deals, show two open-opportunity cards with asking prices and **Open** / **Under offer** chips — PREIshare listing language, not generic tickets.
5. On Profile, show one member card (name, email, phone placeholders). No password or team switcher.
6. Resize to ~375px: sidebar collapses; hamburger opens the same four links; content stays readable.
7. Say clearly: **values are mock placeholders for Sprint 3.** Login and live portfolio data are the next sprint.

## Known limitations

These are intentional, not unfinished accidents:

- **No real authentication or authorization.** `/dashboard` loads with no login. `/login` is not a product page.
- **Portfolio, deals, and profile content are mock/static** (in-file constants on the widgets). They are not live balances.
- **No Supabase, PostgreSQL, or pgvector integration** in this sprint. No `createServerFn` as the source of truth.
- **No GitHub Actions CI** in this repo yet (no `.github/workflows`, no `test` script).
- **Not production-hardened:** no error boundaries for failed APIs, no empty/loading states for live queries (there are no live queries).
- **Not in this shell:** payments, document vault, admin tools, listing create/edit, notifications, search, multi-portfolio switcher.
- Polish only: sidebar brand “PREIshare” is text, not a home link — use **Home**. Unknown `/dashboard/*` URLs show a framework 404 inside AppShell.

## Recommended next-sprint work

1. **Supabase auth** and protect `/dashboard/*` (logged-out users should not see the member shell).
2. **Replace mock widgets** with live portfolio / deals / profile queries (route loaders or `createServerFn`), still using field names from `src/types/index.ts`.
3. **pgvector-powered search** for deals or documents once data lives in Postgres — do not add a Search nav item until there is something to search.
4. **GitHub Actions CI** on pull requests: `npm install`, `npm run typecheck`, then tests/lint when those scripts exist. Do not invent a `test` script in this handoff.
5. **Empty, loading, and error states** for each data widget once they fetch for real.

Keep `AppShell`, `navConfig`, and the four file-based URLs. Plug data in at the widgets, not by rebuilding the chrome.

## References

- Client brief: `docs/investor-dashboard-brief.md`
- IA: `docs/dashboard-ia.md`
- Components: `docs/component-plan.md`
- Verification: `docs/verification-checklist.md`
- Architecture decisions: `docs/architecture-decisions.md`
- Listing types (Sprint 2, still the deal vocabulary): `docs/decisions/ADR-001-investor-listing-types.md`
- Cold start: `README.md`
