# PREIshare Investor Dashboard — Component Inventory

## Scope

Furniture list for a responsive **mock-data** shell. Components present structure and labeled placeholder content. They do **not** call real APIs, Supabase, or `createServerFn` as the source of truth.

Names below are **locked** for later agent prompts. Do not rename without updating `docs/dashboard-ia.md` and this file together.

The marketing site already has `src/components/Header.tsx`, `Footer.tsx`, and `ThemeToggle.tsx` for `/` and `/about`. **Dashboard `Header` is a different component** (shell top bar). Do not reuse the marketing header as the investor sidebar, and do not teach marketing Header to own dashboard nav.

## Layout components (shared chrome)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `AppShell` | Page frame: combines Sidebar, Header, and the main content slot | All `/dashboard/*` pages | Own page-specific widgets (`StatsCard`, tables, lists); fetch data; define nav paths |
| `Sidebar` | Branding plus the primary nav region on larger screens; collapses or hides on a narrow viewport | `AppShell` | Duplicate the page title that Header shows; hardcode deal/holding rows; invent extra destinations |
| `Header` | Top bar: current page title and a simple mock-user placeholder | `AppShell` | Define the full nav list (that lives in `navConfig`); render stats or tables |
| `NavItems` / `navConfig` | Single source of the four nav labels + paths (Home, Portfolio, Deals, Profile) | `Sidebar` (and a mobile menu later, if Header only *opens* that menu) | Render stats, tables, or deals; add Settings/Admin/Login entries |

## Dashboard home widgets

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `StatsCard` | Show **one** metric: label + value (+ optional “mock” hint) | Dashboard home (reusable if another page needs a single metric) | Fetch data; lay out the whole home page; replace `PortfolioSummary` |
| `PortfolioSummary` | Short snapshot of mock portfolio value / allocation for the home scan | Dashboard home only in this sprint | Replace the full Portfolio page or render `PortfolioTable` |
| `RecentActivity` | Short list of recent **mock** events (for example “viewed a deal”) | Dashboard home | Own global navigation; pretend to be a live audit log |

## Page-level shells

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `PortfolioTable` | Tabular mock holdings (property name, mock value) | Portfolio page (`/dashboard/portfolio`) | Live market data; live on Home as the full table (Home uses `PortfolioSummary` instead) |
| `DealsList` | List or cards of mock **open** deals | Deals page (`/dashboard/deals`) | Checkout, subscribe, or listing-editor forms; use statuses outside `published` / `under_offer` for these open-deal rows |
| `ProfileCard` | Mock member name, email, optional phone | Profile page (`/dashboard/profile`) | Password change, auth, team switcher, or a second investor’s data |

## Composition rules

1. **One job per component.** If two rows describe the same job, merge or delete one. Nav labels exist only in `navConfig`.
2. **Layout wraps pages.** Page widgets never re-implement Sidebar/Header.
3. **Mock data** may be inline constants or a small mock module this sprint. Label mock values in the UI (badge, caption, or “Sample data”). Real Supabase comes later.
4. **Deal/holding field names** should follow `src/types/index.ts` (`InvestorListing` and related types), not tutorial aliases like `active` / `closed`.
5. Names above stay locked — do not rename `AppShell` to `MainFrame` or similar.

## Mapping check (IA ↔ components)

Every IA page has widgets. Every page widget has a home page. Shared chrome is used once via `AppShell`.

| URL | Page-level / home widgets inside `AppShell` |
| --- | --- |
| `/dashboard` | `StatsCard` (row of a few cards), `PortfolioSummary`, `RecentActivity` |
| `/dashboard/portfolio` | `PortfolioTable` |
| `/dashboard/deals` | `DealsList` |
| `/dashboard/profile` | `ProfileCard` |

Shared on all four: `AppShell` → `Sidebar` (reads `navConfig`) + `Header` (title + mock user) + main slot.

## Critique pass (applied)

Checked both planning docs against the brief. Fixes already applied in these tables:

| Risk | Resolution |
| --- | --- |
| Header and Sidebar both owning the full nav | Nav paths/labels live only in `navConfig`. Sidebar renders them. Header may open a mobile menu that **reuses** that config. |
| Home `PortfolioSummary` vs Portfolio `PortfolioTable` | Summary is a snapshot on Home only; the full table is the Portfolio page. |
| `StatsCard` swallowing the home layout | One metric per card. Home composes several cards; `AppShell` still owns the frame. |
| Marketing `Header` vs dashboard `Header` | Different components. Marketing chrome stays on `/` and `/about`. |
| Invented pages (Settings, Login, Admin) | Not in IA. Not in `navConfig`. |
| Live fetch / auth widgets | Out of scope. Mock constants only. |

## Out of scope components (do not add this sprint)

LoginForm, AuthGuard, PaymentWidget, AdminTable, NotificationDrawer, SearchBar as a product area, listing create/edit forms.
