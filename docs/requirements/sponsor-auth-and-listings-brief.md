# Sponsor Auth & Property Listings — Requirements Brief (Sprint 4)

## Client story (restated)

PREIshare sponsors need to sign in to the app and work with **real** property
listings stored in PostgreSQL, not arrays baked into React files. Secret keys
and privileged database access must stay on the server and must never ship in
the browser bundle.

This sprint is that contract: email/password (or equivalent Supabase Auth)
for a **sponsor**, session-gated listing pages, create + read of **that
sponsor’s** listings, and a hard split between client-safe anon keys and
server-only secrets. It is not a payments product, not a live investor
portfolio feed, and not a rewrite of the Sprint 3 shell.

## Actors

| Actor | Goal |
| --- | --- |
| Sponsor | Register and log in with email/password; create listings; see only their own listings after refresh |
| Unauthenticated visitor | Reach login/signup only; must not see listing rows or protected dashboard listing pages |
| System (server) | Check the session before listing reads/writes; talk to Supabase/Postgres with the correct keys |

The existing Sprint 3 **investor** dashboard (Home, Portfolio, Deals, Profile)
is a separate actor’s shell. This sprint does not turn mock portfolio balances
into live money. It adds **sponsor** identity and **listing** persistence.

## Goals for this sprint

1. Sponsors can register and log in (Supabase Auth email/password or equivalent).
2. Routes that show or edit listings require a valid session; logged-out users are sent to login (or otherwise blocked), not shown listing data.
3. Property listings are stored in Postgres via Supabase — not `mockHoldings`, `mockDeals`, or `sampleInvestorListings` as the source of truth.
4. A signed-in sponsor can **create** a listing and **read** listings that belong to them (row-level ownership).
5. Environment secrets are separated: project URL and anon/publishable key may be client-safe; **service role** and other privileged secrets stay server-only.

## Out of scope (defer)

- Payment processing, document/photo uploads, offering memorandums
- Social OAuth (Google, GitHub, etc.) beyond email/password Supabase Auth
- Production custom domain, multi-tenant orgs, team switchers
- Full admin / listing-editor consoles for other people’s data
- Live investor portfolio totals, distributions, or replacing every Sprint 3 home widget with finance APIs
- pgvector search, maps, charts, notifications inboxes
- Password-reset polish, MFA, or SSO unless a later brief adds them
- Inventing listing statuses or property types outside the closed Sprint 2 lists

## Current dashboard observations

Inspected 2026-10-24 against this repo (TanStack Start + React + TypeScript, npm).

### Routes that actually exist

| Path | File | Notes |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Marketing home; link into `/dashboard`. Not auth. |
| `/about` | `src/routes/about.tsx` | Starter about page. Not dashboard nav. |
| `/dashboard` layout | `src/routes/dashboard/route.tsx` | `AppShell` + `<Outlet />`. No session gate. |
| `/dashboard` home | `src/routes/dashboard/index.tsx` | Metric cards with `—` placeholders; empty portfolio/activity lists. |
| `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | Renders `PortfolioTable` (in-file mock holdings). |
| `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | Renders `DealsList` (in-file mock deals). |
| `/dashboard/profile` | `src/routes/dashboard/profile.tsx` | Renders `ProfileCard` (sample profile, “not a live account”). |

**Not found:** `src/routes/login.tsx`, signup, logout, settings, admin, or `/dashboard/activity`. Visiting `/login` today is a framework 404 (`docs/verification-checklist.md` O1).

Nav labels (investor shell): Home, Portfolio, Deals, Profile — `src/components/layout/navConfig.ts`.

### Listings today (mock)

- Typed listing shapes already exist (`src/types/investor-listing.ts` and related files) with closed statuses `draft` / `published` / `under_offer` / `sold` / `archived` and property types `multifamily` / `office` / `retail` / `industrial` / `mixed_use` / `land`.
- Fixtures: `src/fixtures/sample-investor-listings.ts` (in-memory samples for typecheck, not a database).
- UI mocks: `src/components/dashboard/PortfolioTable.tsx` (`mockHoldings`), `DealsList.tsx` (`mockDeals`), `ProfileCard.tsx` (`mockProfile`), plus exported `MOCK_PORTFOLIO_HOLDINGS` / `MOCK_RECENT_ACTIVITY` (home widgets currently pass **empty** arrays).
- No Supabase client, no `createServerFn` / `createServerOnlyFn` usage, no `process.env` / `VITE_` reads in `src/`.

### Auth today

- None. `src/lib/user.ts` `getUser()` always returns `null`.
- Dashboard `Header` shows a presentational “Investor” chip (`src/components/dashboard/Header.tsx`) — not a session.
- `.gitignore` already ignores `.env`. There is **no** `.env.example` yet (this sprint must add names-only docs, not real values).

### Gaps this sprint must close

Login/signup routes; session-aware protection on listing pages; Postgres-backed list + create for the signed-in sponsor; `.env.example` with variable **names** only; server-only handling of the service role key.

## Success criteria (how we know it worked)

- [ ] A sponsor can sign up and log in with email/password and is redirected to a protected dashboard or listings view.
- [ ] Logged-out users cannot open protected dashboard listing pages (redirect or equivalent; no listing rows in the HTML they get).
- [ ] Creating a listing persists it in Postgres and the same listing still appears after a full refresh.
- [ ] A sponsor only sees their own listings (RLS or equivalent ownership on the server — not a client-side filter alone).
- [ ] No service-role key or other privileged secret appears in the client bundle or in a committed `.env`.
- [ ] `.env.example` documents required variable **names** (for example `SUPABASE_URL`, anon/publishable key, server-only service role) without real secret values.

## Server-only boundary (must not ship to the browser)

Never in client modules, `VITE_*` env, or committed files:

- Supabase **service role** key (and any other privileged secrets)
- Direct privileged database URLs (for example a Postgres connection string used for admin/bypass)
- Any server-only env used to skip RLS or impersonate users

Client-safe **only when** intentionally designed that way by Supabase:

- Project URL
- Anon / publishable key (still must respect RLS; never treat it as a bypass)

TanStack Start rule for later implementation steps: read secrets with `process.env` inside server handlers / `createServerFn` / `createServerOnlyFn` — not at module scope in a file that also runs on the client, and never with a `VITE_` prefix on a secret.

## Implementation notes for later prompts

- Prefer server loaders/actions in TanStack Start for reads/writes that need the user session or privileged checks.
- Keep Sprint 3 `AppShell` / routing; add a session gate rather than rebuilding chrome.
- Data model and RLS policies are designed in later steps. When those steps run, listing **status** and **property type** must stay the closed lists already in `src/types/` — do not invent `active` / `live` / `UNDER_OFFER`.
- This brief does not include SQL, env files, or login components. Those are later steps that **consume** this file.
- Handoff later should map deliverables back to the goals and success criteria above.
