# Architecture Decisions — PREIshare Dashboard Shell (Sprint 3)

These records explain **why** the Sprint 3 investor shell is shaped this way so the next sprint can add auth and live data without ripping out routing or chrome.

Listing-domain TypeScript choices from Sprint 2 live separately in `docs/decisions/ADR-001-investor-listing-types.md`. This file does **not** replace that ADR.

Sources: `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`, `docs/verification-checklist.md`.

---

## ADR-001: TanStack Start with file-based routes

- **Context:** PREIshare needs a clear URL per investor area (home, portfolio, deals, profile) and room to grow into full-stack data loading. A hand-written route table or a single-page tab switcher would hide URLs and make later loaders harder to attach.
- **Decision:** Use TanStack Start + TypeScript **file-based** routing under `src/routes/`. Parent `src/routes/dashboard.tsx` wraps children; `dashboard/index.tsx`, `dashboard/portfolio.tsx`, `dashboard/deals.tsx`, and `dashboard/profile.tsx` own the four IA paths. Do not hand-edit `src/routeTree.gen.ts`.
- **Consequences:** Navigation matches `docs/dashboard-ia.md`. Later, per-route loaders or `createServerFn` can attach without a rewrite. Marketing `/` and `/about` stay outside the dashboard layout (`SiteChrome` in `src/routes/__root.tsx`). Do not add `login`, `settings`, or `admin` route files until product scope says so.

## ADR-002: Shared AppShell layout

- **Context:** Every investor page needs the same chrome: left sidebar (desktop), header with page title, main content. Copy-pasting that frame into four pages would drift labels and break mobile independently.
- **Decision:** Implement `AppShell` + `Sidebar` + dashboard `Header` in `src/components/layout/` and wrap dashboard routes via the parent layout’s `<Outlet />`. Page files only render widgets. Marketing `src/components/Header.tsx` is a **different** component and must not own dashboard nav.
- **Consequences:** Layout and mobile-menu fixes happen in one place (`AppShell` + `src/styles/dashboard.css`). Page files stay focused on content. Do not let widgets re-implement Sidebar/Header.

## ADR-003: Central nav config

- **Context:** Labels, paths, and active states must stay consistent. If Header and Sidebar each listed destinations, one would say “Account” while the other said “Profile.”
- **Decision:** Keep the four items in `src/components/layout/navConfig.ts` (`dashboardNavItems` + `getPageTitle`). `NavItems` renders them. Header **opens** the mobile menu; it does not define a second list. Home uses exact active matching so it does not stay highlighted on child routes.
- **Consequences:** Adding a destination is a config change plus a route file — not a scavenger hunt. Do not put Settings, Admin, or Login into `navConfig` for a “helpful” extra. Sidebar brand text is not a home link; **Home** is.

## ADR-004: Mock data boundary for the shell

- **Context:** Sprint 3 goal is a trustworthy UI shell the client can click through, not live finance data. A hidden fake HTTP layer would look like production and confuse the next sprint.
- **Decision:** Widgets take simple mock props or in-file constants only (`StatsCard`, `PortfolioSummary`, `RecentActivity`, `PortfolioTable`, `DealsList`, `ProfileCard`). Label every figure as sample/mock in the UI. Deal rows use PREIshare statuses `published` / `under_offer` (shown as **Open** / **Under offer**). Import listing vocabulary from `src/types/index.ts` rather than `active` / `closed`. No Supabase client, no `createServerFn` as source of truth this sprint.
- **Consequences:** Next sprint can replace mocks at the widget or route-loader boundary without untangling a pretend API. Do not treat missing live balances as a shell bug. Do not invent a second listing shape.

## ADR-005: Responsive CSS + accessibility baseline

- **Context:** Investors will use desktop and phone. Overlapping titles or an unusable table would fail the demo. A full a11y audit is out of scope, but buttons need names and a visible focus treatment.
- **Decision:** Dashboard-specific rules live in `src/styles/dashboard.css` (imported from `src/styles.css`). Desktop: persistent sidebar, hamburger hidden. Below 768px: collapse sidebar, show **Open navigation**, backdrop + Escape to close, cards stack, tables scroll inside `.dash-table-wrap`. Skip link to `#main-content`; 44px minimum tap on nav/header controls; `:focus-visible` rings.
- **Consequences:** Demo quality is good enough for Sprint 3 (verified at ~1280px and ~375px). Deeper a11y and empty/error states for live data still belong in a later sprint. Do not “fix” mobile by shrinking the sidebar to half the screen while leaving it always open.

---

## Next-sprint foundations (do not reverse casually)

| Foundation | Why it builds on this shell |
| --- | --- |
| Supabase auth | Protect `/dashboard/*` and replace the “Sample investor (mock)” chip / `ProfileCard` with the signed-in member. Keep `AppShell`; add a session gate around the dashboard layout. |
| Live portfolio data | Replace mock `StatsCard` / `PortfolioSummary` / `PortfolioTable` via route loaders or `createServerFn`. Keep field names aligned with `src/types/index.ts`. |
| pgvector search | Add search UI on deals or documents **after** listings live in Postgres. Do not add a Search nav item on an empty index. |
| GitHub Actions CI | This package already has `npm install`, `npm run typecheck`, and `npm run build`. Gate PRs on those first. There is no `test` script yet — add tests before adding a test CI step. |

## Explicit non-goals for Sprint 3

- Real money movement, trading, or compliance workflows
- Final visual brand system (starter tokens in `src/styles.css` are enough)
- Production deployment hardening (error boundaries, rate limits, a second Vercel project)
- Admin, listing-editor, payments, document vault, notifications
- Claiming CI, auth, or live data already work — they do not
