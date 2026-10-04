# PREIshare Investor Dashboard — Stakeholder Handoff

**Sprint focus:** Responsive investor dashboard shell (TanStack Start routes + React UI)
**Audience:** PREIshare product stakeholders and the next implementation topic owners
**Date:** 2026-10-04
**Prepared by:** Ammon Swenson

**Demo line:** the investor dashboard shell is navigable; live data and login are next.

## 1. Demo today (what investors can click)

- Visit `/dashboard` to open the investor home base. Layout is `src/routes/dashboard/route.tsx` (`AppShell` + `<Outlet />`); home content is `src/routes/dashboard/index.tsx`.
- Desktop (~1280px): persistent left **Sidebar** (Home, Portfolio, Deals, Profile) plus **Header** with PREIshare branding and an “Investor” chip (not a real session).
- Tablet (~768px): same sidebar; **MobileNav** is hidden so the two patterns do not fight.
- Phone (~375px): sidebar is hidden; **Open menu** / **Close menu** (`MobileNav`) shows the same four links.
- Home composition (inside main, not a second shell):
  - Three **MetricCard** tiles: Portfolio value, Open deals, Distributions (YTD). Values are em dashes (`—`) with hints such as “Connect data to see live totals.”
  - **PortfolioSummary** with an empty holdings list and “No portfolio holdings to show yet…”
  - **RecentActivity** with an empty items list and “No recent activity yet…”
- Nested placeholders (same shell): `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`. Those pages use sample copy (for example names marked “(sample)” and a “Sample profile — not a live account” note). They are not live balances.

**Out of scope for this demo:** live Supabase data, login/auth gates, editing holdings, payments, charts, or a fifth nav item such as `/dashboard/activity`.

## 2. Requirements traceability

Success criteria copied verbatim from `docs/preishare-dashboard-requirements.md` §6.

| Success criterion (from requirements brief) | Status | Evidence |
| --- | --- | --- |
| An investor can open the dashboard home route in the browser | Met | `src/routes/dashboard/route.tsx` + `src/routes/dashboard/index.tsx` serve `/dashboard`. QA tested http://127.0.0.1:43123/dashboard (`docs/responsive-qa-checklist.md`). |
| Header, navigation, metrics, and activity regions are all visible on desktop | Met | `AppShell` + `Header` + `Sidebar`; home renders `MetricCard`, `PortfolioSummary`, and `RecentActivity`. QA D1–D5 Pass at 1280px. |
| On a narrow (mobile) width, navigation remains usable (e.g. mobile nav pattern) | Met | `MobileNav` Open/Close menu at 375px; sidebar `display: none`. QA M3–M5 Pass. |
| Placeholder content is clearly labeled so stakeholders know data is not live | Met | Home intro: “Numbers and lists stay empty until live data is connected.” Metric hints name the gap. Empty-state strings on `PortfolioSummary` / `RecentActivity`. Child pages use “(sample)” labels and a sample-profile caption. |
| Requirements in this brief match what was built (no surprise mega-features) | Met | Four dashboard destinations only (`docs/dashboard-routing-plan.md`). No Supabase client, no login routes, no chart libraries in `src/` (grep). |
| A teammate can read this brief and understand scope in under 5 minutes | Met | `docs/preishare-dashboard-requirements.md` remains the scope contract; this handoff is the short map of what shipped vs what did not. |

Must-haves from the brief §5 (demoable shell) that are not repeated as §6 bullets: file-based `/dashboard` routes — Met; app shell of header + nav + main — Met; responsive mobile/tablet/desktop — Met (`docs/responsive-qa-checklist.md` critical rows Pass); placeholder metrics and activity on home — Met; empty-state messaging — Met; investor-facing nav labels Home / Portfolio / Deals / Profile — Met (`navConfig` + Sidebar / MobileNav).

## 3. Decisions made (so the next topic does not re-litigate them)

- **Routing:** File-based TanStack Start tree. Live layout is `src/routes/dashboard/route.tsx` (not a sibling `dashboard.tsx`). Home is `src/routes/dashboard/index.tsx`. Children: `portfolio.tsx`, `deals.tsx`, `profile.tsx`. Activity is a **home region**, not `/dashboard/activity`. Marketing `/` and `/about` stay outside the investor shell.
- **Nav labels:** Home `/dashboard`, Portfolio `/dashboard/portfolio`, Deals `/dashboard/deals`, Profile `/dashboard/profile` only (`docs/dashboard-routing-plan.md`).
- **Shell regions:** `AppShell` composes `Header`, `Sidebar` (visible `md+` / 768px), `MobileNav` (`md:hidden`), and a `children` / Outlet main slot (`docs/dashboard-component-architecture.md`).
- **Widgets:** `MetricCard`, `PortfolioSummary`, and `RecentActivity` are presentational (props in, JSX out). Home currently passes empty arrays and placeholder metric strings so later loaders can fill the same props.
- **Responsive approach:** Below 768px, sidebar hidden + MobileNav toggle. From 768px up, sidebar visible. Metrics: 1 column (375) → 2 columns (768) → 3 columns (1280). Portfolio summary and recent activity stack until `lg` (~1024px), then sit side by side.
- **MobileNav state:** Open/close lives in `MobileNav` (`useState`), not lifted into `AppShell`. Same four links as the sidebar. Architecture allowed a named MobileNav job; overlay/drawer was not required for this sprint’s beginner toggle.

## 4. Known limitations (honest baseline)

- **Mock / empty data only:** Home metrics are `—`, not PostgreSQL/Supabase. Holdings and activity lists on home are empty by design. Nested Portfolio/Deals/Profile pages still show **sample** fixtures, not live accounts.
- **Auth not wired:** Anyone who can load the app can open `/dashboard/*`. The Header “Investor” chip is presentational. There is no session, role check, or login screen (brief §5 Later).
- **No mutations:** Read-only shell. No forms that persist changes, no capital calls, no document uploads.
- **QA residual — X2:** Opening MobileNav is in-flow, so the home content shifts down instead of sitting under an overlay (`docs/responsive-qa-checklist.md` X2 Fail, documented as a known limitation). Critical mobile/tablet/desktop checks M1–M7, T1–T5, D1–D5 Pass. Not a full screen-reader audit (X1).
- **Architecture drift (small):** Architecture described overlay MobileNav owned by AppShell. Shipped version is a labeled Open/Close panel with local state. Do not treat that as a second product map.
- **No production hardening in this document:** This handoff describes the shell you can demo locally. Deployment, secrets, and host adapters are outside the client success criteria for this sprint.

## 5. Recommended next sprint work

1. Connect loaders or server functions to Supabase for real portfolio, open-deal, and activity **reads**. Keep `MetricCard` / `PortfolioSummary` / `RecentActivity` prop shapes; replace empty arrays and `—` values at the route, not inside the widgets.
2. Add authentication and protect `/dashboard` for signed-in investors only. Replace the Header placeholder with a real display name only after a session exists.
3. Keep presentational components stable; introduce typed DTOs at the loader boundary. Do not add `/dashboard/activity` unless the product brief changes.
4. Re-run `docs/responsive-qa-checklist.md` against real content lengths (long property names, full vs empty lists). Optionally replace the in-flow mobile menu with an overlay if X2 still bothers the demo.
5. Stakeholder demo script: desktop `/dashboard` → Portfolio → Deals → Profile → Home; then 375px Open menu through the same four links. Say out loud: shell is navigable; live data and login are next.

## 6. Artifact index (for handoff package)

- Requirements: `docs/preishare-dashboard-requirements.md`
- Routing plan: `docs/dashboard-routing-plan.md`
- Component architecture: `docs/dashboard-component-architecture.md`
- Responsive QA: `docs/responsive-qa-checklist.md`
- Routes: `src/routes/dashboard/route.tsx`, `src/routes/dashboard/index.tsx`
- Nested placeholders: `src/routes/dashboard/portfolio.tsx`, `src/routes/dashboard/deals.tsx`, `src/routes/dashboard/profile.tsx`
- Shell: `src/components/dashboard/AppShell.tsx`, `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`
- Home widgets: `src/components/dashboard/MetricCard.tsx`, `PortfolioSummary.tsx`, `RecentActivity.tsx`
- Shared nav labels/paths: `src/components/layout/navConfig.ts`
