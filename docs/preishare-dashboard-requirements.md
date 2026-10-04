# PREIshare Investor Dashboard — Requirements Brief

**How to use this file:** This is the scope contract for humans and AI agents. Compare later prompts and code to these sections. If something is not listed under Must-have, do not build it in this sprint.

Related client story (same product, more detail): `docs/investor-dashboard-brief.md`.

## 1. Product context

PREIshare needs an investor-facing dashboard shell: a clear home base where
investors can eventually see portfolio metrics, recent activity, and navigation
into deeper tools. This sprint delivers the shell only (layout + placeholder
content), not live market data or account management.

PREIshare is a **real-estate** investment product. The shell is for members who want to scan **their holdings**, **open property deals**, and **their own profile**—not a bank, crypto ticker, or trading desk.

## 2. Primary actor and goals

- **Actor:** Investor (signed-in user viewing their private dashboard)
- **Goals on first visit:**
  1. Recognize they are in the PREIshare investor area (branding / header)
  2. Navigate among dashboard sections without getting lost
  3. See high-level portfolio metrics at a glance
  4. Scan recent activity related to their investments

The investor is the only actor we build for now. Admins and listing editors are named later; do not add their screens.

## 3. Primary screens (this sprint)

| Screen | Purpose | In this sprint? |
|--------|---------|-----------------|
| Dashboard home | Shell + metrics + activity placeholders | Yes |
| Nested dashboard sections (placeholders / empty states) | Prove routing and nav work | Yes (minimal): Portfolio, Deals, and Profile under `/dashboard` |
| Login / signup | Authentication | No (later) |
| Live portfolio detail / trades | Deep investment tools | No (later) |

Home is `/dashboard`. Nested placeholders: `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`. Marketing pages (`/` and `/about`) may exist; they are not dashboard screens.

## 4. Dashboard layout regions (must describe in UI work)

1. **Header** — product name/logo area, simple user/account placeholder
2. **Navigation** — sidebar on desktop; collapsible/mobile nav on small screens
3. **Metrics region** — cards for summary numbers (placeholders OK)
4. **Activity region** — list of recent items (placeholders OK)
5. **Main content area** — where page-specific content renders inside the shell

Nav labels an investor would understand: **Home**, **Portfolio**, **Deals**, **Profile**—and only those four dashboard destinations. Header, nav, and main stay visible together (the app shell). Metrics and activity live on the home page inside main.

## 5. Must-have vs later

### Must-have (demoable shell)

- File-based dashboard route(s) under a `/dashboard` area
- App shell composing header + nav + main content
- Responsive behavior: usable on mobile, tablet, and desktop widths
- Placeholder metric cards and recent-activity list on the home page
- Empty-state messaging when real data is not connected yet (badges or captions such as “Sample data” / “placeholders only”)
- Clear navigation labels an investor would understand

Placeholders are allowed and expected. Numbers may be fake. They must be **labeled** so nobody thinks they are live balances.

### Later (explicitly out of scope now)

- Real Supabase queries, balances, or pgvector search
- Authentication, roles, and permissions UI
- Payments, documents vault, tax exports
- Polished design system beyond a clean functional layout
- Charts that require live time-series data

Also later: wire transfers, crypto tickers, tax reports, admin consoles, listing editors, notifications inboxes, and any fifth dashboard nav item.

## 6. Success criteria (how we know the shell is done)

- [ ] An investor can open the dashboard home route in the browser
- [ ] Header, navigation, metrics, and activity regions are all visible on desktop
- [ ] On a narrow (mobile) width, navigation remains usable (e.g. mobile nav pattern)
- [ ] Placeholder content is clearly labeled so stakeholders know data is not live
- [ ] Requirements in this brief match what was built (no surprise mega-features)
- [ ] A teammate can read this brief and understand scope in under 5 minutes

Demo line if that is all you show: **“the investor dashboard shell is navigable; live data and login are next.”**

## 7. Notes for AI-assisted build

- Every implementation prompt should reference this file as scope control.
- Prefer small milestones: routes → shell → nav → widgets → compose → responsive QA.
- Reject agent output that adds out-of-scope fintech features without asking.
- Do not invent listing statuses outside PREIshare’s closed list (`draft`, `published`, `under_offer`, `sold`, `archived`). Open-deal placeholders should look like `published` or `under_offer`.
- If output drifts (extra charts, bank links, login walls, live APIs), compare it to sections 5 and 6 and say no.
