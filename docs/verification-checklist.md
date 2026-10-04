# PREIshare Investor Dashboard Shell — Verification Checklist

**Sprint:** 3 (TanStack Start UI shell)  
**Verifier:** Ammon Swenson  
**Date:** 2026-10-04  
**App URL tested:** http://127.0.0.1:43123 (`npm run dev` default in README is port 3000; this pass used the running Vite process on 43123)  
**Sources of truth:** `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`

## How to use this checklist

- **Pass** — requirement met; evidence describes what you saw.
- **Fail** — in-scope shell issue; fix before handoff or note the fix commit.
- **Deferred** — intentionally out of scope for this sprint; reason required.

Walkthrough method: HTTP GET of each investor URL plus a live browser pass (desktop ~1280px and phone ~375px). Compared against the three source docs, not against memory.

---

## 1. Routing and information architecture

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| R1 | `/dashboard` (or agreed home) loads dashboard home inside AppShell | Pass | Opened `/dashboard` (200). AppShell present (`dash-shell`, sidebar `aria-label="Investor navigation"`, header, `main#main-content`). Header **h1** “Dashboard overview”. Banner “Demo shell — all figures are placeholders”. Stats row, Portfolio summary, Recent activity all visible. |
| R2 | `/dashboard/portfolio` loads portfolio page shell | Pass | Opened `/dashboard/portfolio` (200). Same AppShell. Header **h1** “Your portfolio”. Main **h2** “Your holdings” with `PortfolioTable` and sample-data badge. |
| R3 | `/dashboard/deals` loads deals page shell | Pass | Opened `/dashboard/deals` (200). Same AppShell. Header **h1** “Open deals”. `DealsList` cards for Riverfront Multifamily and Cedar Industrial. |
| R4 | `/dashboard/profile` loads profile page shell | Pass | Opened `/dashboard/profile` (200). Same AppShell. Header **h1** “Your profile”. `ProfileCard` with Alex Morgan / email / phone placeholders. |
| R5 | Unknown paths do not break the whole app (sensible fallback or framework 404) | Pass | `/dashboard/not-a-page` returns HTTP 404 with body “Not Found” inside `main#main-content`. AppShell (sidebar + header “Dashboard overview” + Sample investor chip) still wraps it; the app did not crash. `/login` is also a framework 404 on marketing chrome (not a dashboard area). |

**IA notes:** URLs match `docs/dashboard-ia.md` exactly (`/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`). Marketing `/` and `/about` remain outside the dashboard sidebar, as the IA allows. Header titles use equivalent wording (“Dashboard overview”, “Your portfolio”, “Open deals”, “Your profile”) rather than the single words Home / Portfolio / Deals / Profile; the brief explicitly allows equivalent clear wording. Sidebar brand “PREIshare” is text only (not a home link); Home in nav is the control that returns to `/dashboard`.

---

## 2. Navigation labels and active states

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| N1 | Sidebar/nav labels match brief/IA (Home/Dashboard, Portfolio, Deals, Profile) | Pass | Sidebar nav (`aria-label="Dashboard"`) lists exactly four `Link`s from `navConfig`: **Home**, **Portfolio**, **Deals**, **Profile**. No Admin, Settings, Billing, Notifications, or Login items. Marketing Header is not shown on `/dashboard*`. |
| N2 | Active nav item highlights the current route | Pass | On `/dashboard`, Home has `aria-current="page"` and `nav-link-active`. After clicking Portfolio / Deals / Profile in the browser, only that item stayed highlighted; Home did **not** remain active on child routes (`activeOptions={{ exact: true }}` on Home). |
| N3 | Header page title updates when changing routes | Pass | Browser clicks: `/dashboard` → “Dashboard overview”; `/dashboard/portfolio` → “Your portfolio”; `/dashboard/deals` → “Open deals”; `/dashboard/profile` → “Your profile”. Titles come from `getPageTitle` in `navConfig.ts`. |
| N4 | Nav links use client routing (no full page reload flash if applicable) | Pass | Nav uses TanStack `Link` (`src/components/layout/NavItems.tsx`). Browser walkthrough moved Profile → Home and Home → Deals from the sidebar without using Back. On 375px, opening the menu and clicking Deals navigated and the drawer closed via the `pathname` effect in `AppShell` (client route change, not a full document reload). |

---

## 3. Layout shell and responsiveness

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| L1 | AppShell shows sidebar + header + main content on desktop | Pass | At ~1280px: left `aside.dash-sidebar` (PREIshare + four nav items), top `header.dash-header` (page title + “Sample investor (mock)”), `main.dash-content` to the right. Re-check after CSS fix: hamburger is hidden on desktop (`display: none` on `.dash-header .dash-menu-toggle`); sidebar stays visible. Matches brief three-region chrome and `docs/component-plan.md`. |
| L2 | Narrow viewport: nav remains usable (collapse, drawer, or stacked pattern) | Pass | At ~375×812: hamburger **Open navigation** (`aria-controls="dashboard-sidebar"`, `aria-expanded`) visible; sidebar collapsed (`max-height: 0` below 768px). Opening the menu showed Home / Portfolio / Deals / Profile plus close control; backdrop and Escape are wired in `AppShell`. Clicking Deals closed the menu after navigation. |
| L3 | No permanent horizontal scroll on home/portfolio/deals/profile at ~375px width | Pass | Browser pass at ~375px on all four investor pages: content stacked; no permanent page-level horizontal scroll. Portfolio table sits in `.dash-table-wrap { overflow-x: auto }` so column overflow is intentional inside the card, not the whole page. |
| L4 | Main content remains readable; cards/tables stack or scroll intentionally | Pass | Home stats use `.dash-card-grid` (1 column &lt;640px, 2 then 3 on larger breakpoints). Portfolio summary + recent activity stack on narrow view. Deals cards wrap. Profile `dl` is one column then two from `sm`. Type stays readable against `--sea-ink`. |
| L5 | Basic accessibility: buttons/links are keyboard-focusable; interactive controls have accessible names | Pass | Skip link “Skip to main content” (`href="#main-content"`). Menu button named “Open navigation” / “Close navigation”. Backdrop named “Close navigation”. Nav is a list of links. Tab to the hamburger showed a visible focus ring (`:focus-visible` in `dashboard.css`). Min tap size 44px on nav/header controls. |

---

## 4. Mock content clarity (demo readiness)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| M1 | Dashboard home: stats cards show labeled mock investor metrics | Pass | Three `StatsCard`s: **Total portfolio value** $300,000 (“Sample total”); **Open deals** 3 (“Sample count · published / under_offer”); **Contributions YTD** $24,000 (“Sample YTD”). Chip “Demo shell — all figures are placeholders”. `PortfolioSummary` total $300,000 with three sample holdings; `RecentActivity` four dated sample events. |
| M2 | Portfolio summary / table shows clear placeholder holdings | Pass | Home snapshot: Riverfront Multifamily 40% $120,000; Cedar Industrial 35% $105,000; Cash reserve 25% $75,000; badge “Sample data — placeholders only, not live balances”. Portfolio page table columns Property / Type / Invested / Current value / Status with the same sample names ($50,000→$56,200 Performing; $75,000→$74,100 Under review; $25,000 cash). |
| M3 | Deals list shows open-deal style placeholders | Pass | Two cards, sample badge “Sample deals — not live listings”. Riverfront Multifamily — 24 Units (sample), Austin-style listing copy, Asking $12,500,000, status chip **Open** (maps `published`). Cedar Industrial (sample), Asking $6,100,000, chip **Under offer** (`under_offer`). No Active/Closed ticket language; no draft/sold/archived rows on this open-deals list. |
| M4 | Profile card shows member-style placeholder fields | Pass | Single `ProfileCard`: Name Alex Morgan; Email alex.morgan@example.com; Phone +1-512-555-0142; Membership Preferred investor; Preferred contact Email; Notes about Texas multifamily/industrial. Badge “Sample profile — not a live account”. No password, team switcher, or second investor. |
| M5 | No raw "TODO" / empty broken panels on primary views | Pass | Repo grep of `src/**/*.{tsx,ts,css}` found no `TODO`. Home, portfolio, deals, and profile all render labeled widgets (no empty islands). Header chip “Sample investor (mock)” on every dashboard page. |

---

## 5. Out-of-scope boundaries (must stay deferred)

| ID | Check | Status | Evidence / reason |
|----|--------|--------|-------------------|
| O1 | No real authentication / login gate required for shell demo | Deferred | Brief non-goal: real sign-in / session gating. All four dashboard URLs load without a login screen. `/login` is not a product route (framework 404). Do not treat missing auth as a shell failure. |
| O2 | No live Supabase/PostgreSQL data — mock data only | Deferred | Brief non-goal: live backend. Widgets use in-file mock constants (`PortfolioTable`, `DealsList`, `ProfileCard`, home widgets). No `supabase` client, no `createServerFn` as source of truth. Sample badges state data is not live. |
| O3 | No production deploy required for this verification | Deferred | Local Vite on http://127.0.0.1:43123 is enough for this pass. Production/Vercel is not part of Sprint 3 shell verification. |
| O4 | No payment, document vault, or admin tools added beyond brief | Pass | Confirmed nothing extra shipped: dashboard nav has only the four IA destinations; no payment, vault, admin, notifications, settings, or listing-editor UI in routes or `navConfig`. Those product areas stay out of this sprint. |

---

## 6. Defects found and resolution

| Defect | Severity (blocker / polish) | Resolution | Re-check |
|--------|----------------------------|------------|----------|
| Desktop (~1280px) still showed the hamburger beside the always-visible sidebar. `.dash-header button { display: inline-flex }` (specificity 0,1,1) overrode `.dash-menu-toggle { display: none }` (0,1,0). | polish | Raised hide/show rules to `.dash-header .dash-menu-toggle` in `src/styles/dashboard.css` so the toggle is `display: none` from 768px up and `inline-flex` below. | Pass (L1/L2 re-run after the CSS change) |

**Polish notes (not fails):**

- Sidebar brand “PREIshare” is not a clickable home control; **Home** is the documented path back to `/dashboard`.
- Unknown `/dashboard/*` URLs keep the fallback header title “Dashboard overview” while showing “Not Found” in main — acceptable framework 404, not a crash.
- Investor-facing deal chips say **Open** / **Under offer** instead of raw tokens `published` / `under_offer`; mapping is intentional and still uses the closed status list.

---

## 7. Sign-off for handoff

- [x] All **blocker** fails fixed or explicitly accepted with reason
- [x] Deferred items only cover agreed out-of-scope work
- [x] Shell is demoable against the PREIshare client story for Sprint 3

**Overall result:** Ready for stakeholder handoff

**Verifier signature:** Ammon Swenson, 2026-10-04
