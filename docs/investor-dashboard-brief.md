# PREIshare Investor Dashboard — Client Brief (Sprint 3 Shell)

**Audience:** PREIshare product partners and the next routing/UI implementers  
**Status:** Shell-only sprint — layout, navigation, and labeled mock content  
**Date:** 2026-09-18  
**Related:** listing domain at `docs/domain/investor-listing-domain-brief.md`; types barrel at `src/types/index.ts`

## Product summary

PREIshare is for real-estate investors who need to check **their** holdings, **open property opportunities** (deals), and **their own contact profile** in one place. Today that story is easy to lose: listing data used to arrive as loose JSON, and the public site is still a generic starter homepage. This sprint builds a **dashboard shell**—not a live product.

An investor should land on a calm home overview, see a portfolio snapshot and recent-activity placeholders, then reach Portfolio, Deals, and Profile without hunting. Numbers and names on screen are **mock and labeled as mock**. Sign-in, a live database, payments, and admin tools are not part of this sprint.

**Done for this sprint** means a stranger can click Home, Portfolio, Deals, and Profile inside one persistent app shell, read a clear title on each page, and tell that the data is not live.

## Primary actors

| Actor | Role in this sprint | In scope to build? |
| --- | --- | --- |
| Investor (member) | Uses the dashboard to scan portfolio value, browse open deals, and review their profile | Yes — primary user of every screen we build |
| Future admin | May later manage deals and users | No — name the actor only; do not build admin screens |
| Listing editor / ops (from the domain brief) | Creates listings before investors see them | No — editor/create-listing UI is a later topic |

## Investor goals

1. Open the dashboard home and immediately see a **portfolio snapshot** (mock total value) plus a **recent activity** placeholder list—no extra product areas on that first screen.
2. Move to **Portfolio** (holdings), **Deals** (open/available property opportunities), and **Profile** (their own name and contact placeholders) without leaving the app shell.
3. Trust the chrome: the same nav labels on every page, readable type, usable on a phone and on a desktop. They should not need a tooltip to know which of the four areas they are in.

## Must-have dashboard areas (this sprint)

Exactly these four. Do not add a fifth in-scope area (no notifications inbox, no settings hub, no admin console, no deal-editor form).

| Area | Route idea (for later steps) | What the investor should see |
| --- | --- | --- |
| Home overview | `/dashboard` | Page title for Home. Stats-card placeholders (for example mock portfolio value, open-deal count). Portfolio summary placeholder. Recent-activity list placeholder. Every mock figure labeled mock. |
| Portfolio | `/dashboard/portfolio` | Page title for Portfolio. Table or list **shell** of holdings (property name, mock value). Mock rows OK. No live balances. |
| Deals | `/dashboard/deals` | Page title for Deals. List **shell** of open/available opportunities. Mock rows should read like PREIshare listings (title, asking price, status such as `published` or `under_offer`)—not generic “Active/Closed” SaaS tickets. |
| Profile | `/dashboard/profile` | Page title for Profile. A single profile **card** shell: display name, email, optional phone placeholders. One investor, their own data. No password manager, no team switcher. |

## Success criteria (demo-ready shell)

Check these in a walkthrough with **no** live backend. Each line is a yes/no.

- [ ] Persistent navigation (sidebar on desktop, or an equivalent that remains available) lists **Home**, **Portfolio**, **Deals**, and **Profile**—and only those four dashboard destinations.
- [ ] From any of the four pages, the investor can reach the other three without using the browser Back button as the only path.
- [ ] Each area is its own route/page and shows a **visible page title** matching that area (`Home` / `Portfolio` / `Deals` / `Profile`, or equivalent clear wording).
- [ ] The shell has three regions a stakeholder can point at: **nav**, **header** (app name or investor context), and **main content**.
- [ ] On a narrow phone-width viewport, content stays readable: nav collapses or stacks; titles and tables do not overflow into unusable overlap.
- [ ] Every mock number, name, and deal row is **labeled mock** (badge, caption, or “Sample data” copy) so nobody mistakes it for live portfolio value.
- [ ] No surprise in-scope page appears in the nav (no Notifications, Billing, Admin, Settings, or Login as a built product area).
- [ ] Deals mock copy does not invent listing statuses outside PREIshare’s closed list (`draft`, `published`, `under_offer`, `sold`, `archived`). Investor-facing deal rows in this shell should look like **open** opportunities (`published` or `under_offer`).

## Out of scope (explicit non-goals for this sprint)

- Real sign-in, session cookies, authorization, or “logged-in vs logged-out” gating
- Live Supabase / PostgreSQL / pgvector portfolio, holdings, or deals data
- Wiring screens to `createServerFn` or an HTTP API as the source of truth (mock modules only)
- Payments, subscriptions, capital calls, or document e-sign
- Admin CRUD for investors, listings, or deals
- Listing **create/edit** forms for ops (that is a later TanStack Start topic; this shell is investor-facing read-only placeholders)
- Notifications center, global search, dark-mode settings as a product area, multi-portfolio switcher
- Production hardening, a second Vercel project, or CI beyond what the repo already has

If a demo only shows four titled shells with mock badges, say: **“the investor dashboard shell is navigable; live data and login are next.”** Do not say the dashboard product is done.

## Prompting notes for later AI steps

When directing a coding-agent, attach this brief and require:

1. TypeScript + TanStack Start **file-based** routes under `src/routes/` for the four areas above.
2. Reusable React components for the shell (nav, header, page title, mock-data badge)—do not paste a new layout into every page.
3. **Mock data only.** Label it mock in the UI.
4. **No auth**, no payments, no admin routes, no extra in-scope pages.
5. For deal/holding placeholders, **import types from `src/types/index.ts`** (or reuse field names from `InvestorListing`) instead of inventing a second listing shape. Prefer sample-shaped mock rows over tutorial aliases like `active` / `closed`.
6. Reject output that adds features listed under Out of scope.

Reject a first draft that “helpfully” adds login, a notifications drawer, or live fetch.

## Open questions / assumptions

- English UI copy for the shell.
- A **single** investor persona viewing their own mock portfolio (no household or fund switcher).
- Visual brand can stay the existing PREIshare/TanStack starter tokens in `src/styles.css`; a full brand system is not required this sprint.
- Home “recent activity” is a short placeholder list (for example “viewed a deal”), not a real audit log.
- Portfolio holdings may be a simplified mock table this sprint; they do not have to be a full `Ownership` graph. If a row looks like a listing, still use PREIshare field names.
- Public marketing routes (`/` and `/about`) may remain; they are not dashboard areas and should not replace the four-area nav inside the shell.
- Existing listing types and fixtures stay the source of deal vocabulary; this brief does not change ADR-001.
