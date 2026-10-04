# PREIshare Dashboard Routing Plan

## Purpose

Map investor-facing dashboard URLs to TanStack Start route files before any UI generation.
Source requirements: `docs/preishare-dashboard-requirements.md`.

This document is a **routing map only**. It does not include React component code, prop types, or styling. Inventory was read-only against `src/routes/` and `src/routeTree.gen.ts` (do not hand-edit the generated tree).

## Current app inventory (as found)

Every file under `src/routes/` that exists today:

| File / folder | Likely URL | Notes |
| --- | --- | --- |
| `src/routes/__root.tsx` | (app root layout) | Existing shared root — do not replace casually. Wraps all pages. Marketing chrome on `/` and `/about` only. |
| `src/routes/index.tsx` | `/` | Existing marketing home. Link into `/dashboard`. Not a dashboard destination. |
| `src/routes/about.tsx` | `/about` | Existing starter about page. Keep. Not in dashboard nav. |
| `src/routes/dashboard.tsx` | `/dashboard` **layout** | Existing parent layout (`createFileRoute('/dashboard')` + `<Outlet />`). This is this repo’s layout file. |
| `src/routes/dashboard/index.tsx` | `/dashboard` **index (home)** | Existing investor home. Separate from the layout file. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Existing placeholder child. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Existing placeholder child. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Existing placeholder child. |

**Not found:** `src/routes/dashboard/route.tsx`. TanStack Start allows either a folder `dashboard/route.tsx` **or** a sibling `dashboard.tsx` next to the `dashboard/` folder. This project already uses **`dashboard.tsx`**. Do **not** also create `dashboard/route.tsx` — that would fight the inventory and double-wrap the shell.

No `login`, `settings`, `admin`, or `activity` route files exist. Do not delete any file in the table above.

## Planned dashboard route tree

```text
/                          → existing marketing home (keep)
/about                     → existing about (keep; not dashboard nav)

/dashboard                 → layout route (shell: header + sidebar + outlet)
/dashboard                 → index (investor home: metrics, portfolio summary, activity)
/dashboard/portfolio       → placeholder child (holdings table shell)
/dashboard/deals           → placeholder child (open property opportunities)
/dashboard/profile         → placeholder child (member profile card)
```

Activity from the requirements brief is a **region on the home index**, not its own URL. Do not add `/dashboard/activity` as a fifth nav destination (brief: only Home, Portfolio, Deals, Profile).

## File map (exact files; create later only if missing)

Tutorial aliases vs this repo (same jobs):

| URL | Role | File | Status | Wraps / renders |
| --- | --- | --- | --- | --- |
| `/dashboard` | Layout route | `src/routes/dashboard.tsx` (equivalent job to `src/routes/dashboard/route.tsx`) | **Already exists** — do not create `route.tsx` | Shared dashboard chrome; renders child via Outlet |
| `/dashboard` | Index page | `src/routes/dashboard/index.tsx` | **Already exists** | Investor dashboard home content (metrics + activity regions) |
| `/dashboard/portfolio` | Placeholder | `src/routes/dashboard/portfolio.tsx` | **Already exists** | Stub holdings page inside the layout |
| `/dashboard/deals` | Placeholder | `src/routes/dashboard/deals.tsx` | **Already exists** | Stub open-deals page inside the layout |
| `/dashboard/profile` | Placeholder | `src/routes/dashboard/profile.tsx` | **Already exists** | Stub profile page inside the layout |

If a later step is starting from a blank `src/routes` with only `__root.tsx` and `index.tsx`, create in this order: `src/routes/dashboard/route.tsx` **or** `src/routes/dashboard.tsx` (pick one layout form), then `src/routes/dashboard/index.tsx`, then the three placeholder children. In **this** tree, those files are already present except `route.tsx` (layout lives in `dashboard.tsx`).

## Layout vs page responsibilities

- **Layout (`dashboard.tsx`, same role as `route.tsx`)**: persistent navigation regions only (header, sidebar/mobile nav slot, main outlet). No metric card business content.
- **Index (`index.tsx`)**: dashboard home composition (summary widgets, **metrics region**, **activity region**). Uses the parent layout.
- **Placeholders** (`portfolio.tsx`, `deals.tsx`, `profile.tsx`): minimal pages so nav links have real targets; they must render **inside** the layout Outlet, not replace the whole shell. Full live UI comes in later topics.

## Navigation labels (for sidebar / mobile nav later)

Traces to `docs/preishare-dashboard-requirements.md` §2 goals, §3 screens, and §4 nav labels.

| Label | Path | Requirement link |
| --- | --- | --- |
| Home | `/dashboard` | First-visit home base: branding, metrics at a glance, recent activity region on the index |
| Portfolio | `/dashboard/portfolio` | Nested placeholder: investor holdings (not live balances) |
| Deals | `/dashboard/deals` | Nested placeholder: open property opportunities |
| Profile | `/dashboard/profile` | Nested placeholder: this member’s own contact card |

Do not add Overview/Activity/Settings/Login as extra dashboard labels. “Activity” is satisfied on **Home**, not a separate path.

## Out of scope for this plan

- Component prop designs and styling tokens (next architecture step)
- Auth guards and loader data shape (later sprints unless already in starter)
- API routes and Supabase queries
- Creating `src/routes/dashboard/route.tsx` on top of existing `dashboard.tsx`
- Deleting `/`, `/about`, or any current dashboard child
- New URLs for search, admin, payments, or `/dashboard/activity`

## Success criteria for implementation steps

- Visiting `/dashboard` shows the layout shell and home index content region.
- Child placeholder paths (`/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`) render inside the same layout (not a blank full-page replace of the shell).
- No unrelated existing routes were deleted during dashboard work.

## Open questions

- Folder layout (`dashboard/route.tsx`) vs sibling layout (`dashboard.tsx`): **resolved for this repo** — keep `dashboard.tsx`. A greenfield tutorial copy may use `route.tsx` instead, never both.
- Should “recent activity” ever become `/dashboard/activity`? **Not in this sprint.** The brief puts activity on the home metrics/activity regions and forbids a fifth nav item.
- Auth-gated `/dashboard/*`: later; do not add `login` route files in the shell plan.
