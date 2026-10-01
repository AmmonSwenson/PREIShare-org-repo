# PREIshare Investor Dashboard — Information Architecture

## Purpose

Floor plan of investor-facing pages for the **dashboard shell** (mock data only).  
Source of truth for product goals: `docs/investor-dashboard-brief.md`.  
This sprint does **not** add auth flows, admin tools, live API contracts, or extra product areas.

**Done (same as the brief):** a stranger can click Home, Portfolio, Deals, and Profile inside one persistent shell, read a clear title on each page, and tell that the data is not live.

## URL map and page purposes

Exactly four investor URLs. Each path is unique. Nav labels are one word.

| URL path | Route name | Nav label | Page purpose | Primary content |
|----------|------------|-----------|--------------|-----------------|
| `/dashboard` | Dashboard home | Home | Quick scan of mock portfolio value and recent activity | Stats row (`StatsCard`), `PortfolioSummary`, `RecentActivity` |
| `/dashboard/portfolio` | Portfolio | Portfolio | Review holdings at a glance | `PortfolioTable` (mock rows) |
| `/dashboard/deals` | Deals | Deals | See open / available property opportunities | `DealsList` (mock cards or rows; statuses `published` or `under_offer`) |
| `/dashboard/profile` | Profile | Profile | View this member’s own profile details | `ProfileCard` (mock name, email, optional phone) |

Existing marketing routes `/` and `/about` may stay in the app. They are **not** dashboard destinations and must **not** appear in the dashboard sidebar.

## Navigation rules

- Shared chrome: left **sidebar** on desktop, **header** on top, **main** content to the right (or below on a narrow screen).
- Active nav item matches the current URL path.
- Labels stay short and investor-friendly: Home, Portfolio, Deals, Profile — and **only** those four dashboard destinations.
- Nested under `/dashboard` so one parent layout (`AppShell`) wraps all investor pages.
- From any of the four pages, the other three are reachable from the persistent nav (browser Back is not the only path).
- On a phone-width viewport, nav collapses or stacks; titles and tables must not overlap into an unusable layout.
- Nav labels and paths live in **one** config (`navConfig` / `NavItems`). Sidebar (and a later mobile menu) consume that config. Header does not define a second list.

## Brief goals ↔ URLs

| Investor goal (from the brief) | URL that covers it |
| --- | --- |
| See a portfolio snapshot + recent activity on first open | `/dashboard` |
| Review holdings | `/dashboard/portfolio` |
| Browse open deals | `/dashboard/deals` |
| Review own profile | `/dashboard/profile` |
| Trust the chrome (same labels, phone + desktop) | All four, via parent `dashboard` layout |

## Out of scope for this shell

Do not add these as pages or nav items:

- Sign-in / sign-up / logout
- Live Supabase queries or server functions as the source of truth
- Admin, listing-editor, or sponsor tools
- Payments, billing, document vaults, e-sign
- Notifications, Settings, Search, multi-portfolio switcher

## Notes for later route files

File-based TanStack Start routes (names locked):

| File idea | URL |
| --- | --- |
| Parent layout `dashboard` | wraps `/dashboard` and children |
| Child index (home) | `/dashboard` |
| Child `portfolio` | `/dashboard/portfolio` |
| Child `deals` | `/dashboard/deals` |
| Child `profile` | `/dashboard/profile` |

Do not create `settings`, `login`, or `admin` route files in this sprint.
