# PREIshare Dashboard — Component Architecture & Responsive Layout Map

## Purpose

Blueprint for the investor dashboard **shell** only. Implementation agents must
follow these names, regions, and responsive rules. No real portfolio API yet—
placeholder content is OK in later UI steps.

This file is a **plan**, not React source. Do not paste implementation code here.

## Sources

- `docs/preishare-dashboard-requirements.md`
- `docs/dashboard-routing-plan.md`

Nav labels and paths must stay: **Home** `/dashboard`, **Portfolio** `/dashboard/portfolio`, **Deals** `/dashboard/deals`, **Profile** `/dashboard/profile`. No `/dashboard/activity` URL (activity is a home widget). Marketing `/` and `/about` stay outside this shell.

Dashboard **Header** is not `src/components/Header.tsx` (marketing). Do not reuse the marketing header as the investor sidebar.

## Layout regions

| Region | Role | Typical components |
|--------|------|--------------------|
| Header | Top bar: product name, page title, user/placeholder label | Header |
| Sidebar | Vertical nav on tablet/desktop | Sidebar |
| Mobile nav | Overlay or drawer nav on small screens | MobileNav |
| Main | Scrollable page content for the active route | Route outlet + widgets |

AppShell is the frame that places Header, Sidebar/MobileNav, and Main together.

```text
┌─────────────────────────────────────────────┐
│ Header (brand / title / sample user)        │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ Main (outlet)                    │
│ or hidden│  home: MetricCards + summary     │
│ + Mobile │         + RecentActivity         │
│ Nav      │  children: placeholder pages     │
└──────────┴──────────────────────────────────┘
```

On mobile the Sidebar column is gone; a menu control in Header opens MobileNav. Open/close state lives in **AppShell**, not in two competing menus.

## Component inventory

### AppShell

- **Responsibility:** Outer dashboard frame; arranges header, nav, and main.
- **Parent:** Dashboard layout route (`src/routes/dashboard.tsx`).
- **Children:** Header, Sidebar, MobileNav, main content slot.
- **Props (beginner):** `children` (the page content to show in main). Owns `open` for mobile nav (yes/no) and passes `onClose` / toggle into Header and MobileNav.

### Header

- **Responsibility:** Top bar with PREIshare branding and simple status/user placeholder.
- **Parent:** AppShell.
- **Children:** none required (menu button on small screens is part of Header chrome).
- **Props:** `title` (text, optional—default page title from the route, e.g. “Dashboard overview”); `userLabel` (text, optional placeholder such as “Sample investor”). Does **not** own the full nav list.

### Sidebar

- **Responsibility:** Desktop/tablet navigation links matching the routing plan.
- **Parent:** AppShell.
- **Children:** nav links (can be plain elements). Same four destinations as MobileNav.
- **Props:** `items` (list of `{ label, to }` from the routing plan). Hidden below 768px; not a second source of URLs.

### MobileNav

- **Responsibility:** Small-screen navigation (menu button + panel/drawer).
- **Parent:** AppShell.
- **Children:** same destinations as Sidebar.
- **Props:** `items` (same shape as Sidebar); `open` (yes/no); `onClose` (action). **Open state lives in AppShell.** Header’s menu button only asks AppShell to toggle. Closing: backdrop tap, Escape, or choosing a link.

If a later implementation already opens a collapsing Sidebar from the Header button, that **is** MobileNav behavior. Still treat MobileNav as a named job (extract a file or keep the same rules). Do not add a fifth destination.

### MetricCard

- **Responsibility:** One reusable metric tile (label + value + optional hint).
- **Parent:** Dashboard home (main).
- **Props:** `label` (text), `value` (text or number as text), `hint` (text, optional). Parents pass placeholders; **do not hard-code dollar amounts inside MetricCard**.

Alias in this repo: `StatsCard` already does this job. Use **one** tile component, not MetricCard plus StatsCard.

### PortfolioSummary

- **Responsibility:** Short summary block for portfolio snapshot placeholder.
- **Parent:** Dashboard home.
- **Props:** `headline` (text), `summaryLines` (list of text), `emptyMessage` (text when no data). Optional `isSampleData` (yes/no) so a “not live balances” caption can show.

### RecentActivity

- **Responsibility:** List of recent activity placeholders for the investor.
- **Parent:** Dashboard home.
- **Props:** `items` (list of `{ id, title, detail, timestamp }`), `emptyMessage` (text). Same sample-data labeling rule as other widgets.

## Composition (dashboard home)

Main content on `/dashboard` should compose roughly:

1. Row/grid of MetricCard (e.g. 3 placeholders: portfolio value, open-deal count, another summary number)
2. PortfolioSummary
3. RecentActivity

Empty states: each widget must support a clear empty message from requirements
(no fake “production” numbers required in the architecture—placeholders fine).

Placeholder child routes (`/dashboard/portfolio`, `/deals`, `/profile`) still render **inside** AppShell main. Their page-specific lists/cards are not extra chrome and are not new nav items.

## Responsive behavior

Pick-and-stick nav rule: **from 768px up, Sidebar stays visible; below 768px, Sidebar is hidden and MobileNav is used.** Tablet does not invent a third pattern.

| Viewport | Approx width | Nav behavior | Main content |
|----------|--------------|--------------|--------------|
| Mobile | < 768px | Sidebar hidden; MobileNav via menu control | Single column; cards stack |
| Tablet | 768px–1024px | Sidebar visible (may be narrower) | 2-column card grid when space allows |
| Desktop | > 1024px | Sidebar visible and fixed/sticky in the shell | Cards in a multi-column grid; summary + activity side-by-side or stacked with max readable width |

Notes for implementers:

- Touch targets on mobile controls should be easy to tap (about 44px menu button).
- Main content must remain scrollable; header should not crowd out content.
- Do not rely on hover-only actions for anything required on mobile.
- No permanent page-level horizontal scroll on core dashboard pages.

## File targets (for later steps—do not create all here)

Tutorial names (jobs):

- `src/components/dashboard/AppShell.tsx`
- `src/components/dashboard/Header.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/MobileNav.tsx`
- `src/components/dashboard/MetricCard.tsx`
- `src/components/dashboard/PortfolioSummary.tsx`
- `src/components/dashboard/RecentActivity.tsx`

This repo already keeps chrome under `src/components/layout/` (`AppShell`, dashboard `Header`, `Sidebar`) and widgets under `src/components/dashboard/` (`StatsCard` / MetricCard, `PortfolioSummary`, `RecentActivity`). **Do not duplicate** a second AppShell. New files only if a named job is missing (for example a dedicated `MobileNav.tsx`).

Shared nav `items` should come from one list (for example `navConfig`) so Sidebar and MobileNav cannot drift.

## Out of scope (prevent scope creep)

- Real Supabase/PostgreSQL data fetching and auth
- Charts libraries, map views, PDF export
- Additional routes beyond the agreed routing plan
- Design-system package extraction or animation-heavy UI
- Editing portfolio holdings
- Login forms, notifications drawers, search as a product area, payments, tax exports, crypto tickers

## Success criteria for this blueprint

- Every named component has one clear responsibility.
- Props are listed in plain language (no unexplained advanced patterns).
- Mobile / tablet / desktop nav behavior is explicit.
- Widget list matches investor dashboard home needs from requirements.
- Out-of-scope section blocks accidental mega-features.
- Destinations match `docs/dashboard-routing-plan.md` (Home, Portfolio, Deals, Profile only).
