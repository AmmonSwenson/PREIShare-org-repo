# PREIshare Sponsor Auth & Property Listings — Security Requirements

**Project:** PREIshare dashboard  
**Audience:** Sponsors, implementers, and anyone verifying login + listings later  
**Status:** Contract for this topic — write this before treating login UI, env clients, or listing tables as “done”  
**Secret rule:** This file may name environment **variables**. It must never contain real API keys, passwords, JWTs, or connection strings.

## 1. Context

PREIshare is a real-estate intelligence product. Sponsors (partners who own or manage properties) need a dashboard where they can **sign in**, **see only the listings they may manage**, and **add a new property**. Listing data lives in **Postgres via Supabase**, not in mock arrays in the browser.

Three rules never change:

1. The app must know **who** is signed in before it shows or writes listings.
2. A sponsor must **never** receive another sponsor’s property rows, even if they guess a URL or id.
3. The Supabase **service-role** (secret) key must **never** ship to the browser, appear in git, or be pasted into this document.

This brief is the checklist later steps (env setup, RLS, login routes, verification) must satisfy. It does not ship features by itself.

## 2. Actors

| Actor | Description | Signed in? |
| --- | --- | --- |
| Anonymous visitor | Anyone who has not logged in. May see marketing pages and the login/sign-up screens only. | No |
| Sponsor | Partner who owns or manages **their own** property listings. | Yes (sponsor account) |
| Admin | Internal operator who might later see every listing. **Out of scope for this topic.** | N/A this sprint topic |

There is no public “anyone can post a listing” role. There is no cross-sponsor manager in this topic.

## 3. User stories (in scope)

1. As a **sponsor**, I can sign in with **email and password** (Supabase Auth) so the app knows who I am.
2. As a **sponsor**, I can see a list of **only my** properties after sign-in. Refreshing the page still shows those same rows from Postgres, not a mock list in React.
3. As a **sponsor**, I can create a new property that is **owned by my account** (the server sets ownership from the session; I cannot pick someone else’s owner id).
4. As an **anonymous visitor**, I can reach the login (and sign-up) page, but I **cannot** open the dashboard, listing list, listing create form, or change any listing.

## 4. Non-goals (out of scope this topic)

- Public (anonymous) create, update, or delete of properties
- Full **admin** console, cross-sponsor moderation, or “view all listings” for staff
- Putting the Supabase **service-role** (secret) key in any client/browser bundle, `VITE_*` variable, committed `.env`, screenshot, or this markdown file
- Password-reset email polish, OAuth social login (Google/GitHub), magic-link as the primary method, or multi-factor auth
- Payments, document/photo uploads, maps, pgvector search, or turning Sprint 3 investor widgets into live money
- Letting the browser choose which `owner_id` a new listing gets

## 5. Success criteria

Each item is pass/fail in a browser or a repo search. “Secure login” is not a criterion unless it maps to one of these.

- [ ] A sponsor can complete **email/password** login and land on a **protected** dashboard or listings route (for example `/dashboard` or `/dashboard/listings`).
- [ ] An unauthenticated visitor who opens `/dashboard` (or listing routes under it) is **blocked** — redirect to login, or equivalent — and the HTML they get does **not** include other people’s listing rows.
- [ ] After sign-in, the property list returns **only** rows the signed-in sponsor is allowed to see. Knowing another sponsor’s listing id in the URL still must **not** return that row.
- [ ] Creating a property stores a Postgres row **owned by the signed-in sponsor**. The owner is taken from the **session**, not from a hidden form field the browser can edit.
- [ ] Browser-exposed config uses only **public** keys (project URL and anon/publishable key). Secret keys stay **server-only** / env. Repo search finds **no** real service-role value in source or docs.
- [ ] Database access for listings is enforced with **Row-Level Security (RLS)** on Postgres, not only by hiding buttons in React. A signed-in User B must not read or write User A’s rows.

## 6. Simple threat list

| Threat | What goes wrong | Requirement to mitigate |
| --- | --- | --- |
| Stolen or reused session | Attacker uses a copied cookie and acts as the sponsor | Protected routes **check the session on the server**. Sign-out must clear the session so the same cookie no longer opens `/dashboard`. Prefer HttpOnly cookies so ordinary page scripts cannot read the token. |
| Guessing another sponsor’s property id | Attacker opens `/dashboard/listings/<someone-else’s-id>` or calls an API with that id and reads or edits it | RLS (and server queries) **deny** cross-sponsor access even when the id is known. Do not rely on “we never show that link in the UI.” |
| Leaked service-role key | Attacker uses the secret key and **bypasses RLS** | Never put the service-role key in client code, git commits, chat, or screenshots. Name it without a `VITE_` prefix. Read it only on the **server**. Rotate the key in Supabase if it ever leaks. |
| “Security by hiding buttons” | UI hides Edit/Delete, but the API still allows writes | Enforce create/read/update/delete in **Postgres RLS** and **server paths**, not only in React components. |

## 7. Environment & secret hygiene notes (requirements only)

Document **names and purpose**, never values.

| Variable name | Public or secret? | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Public (browser-safe) | Supabase project URL for the client |
| `VITE_SUPABASE_ANON_KEY` | Public (browser-safe) | Anon / publishable key; **still subject to RLS** — not a bypass |
| `SUPABASE_URL` | Server-only alias of the same URL | Server `process.env` reads |
| `SUPABASE_ANON_KEY` | Server-only alias of the anon key | Server listing loaders/actions as the signed-in user |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Bypasses RLS. Server/admin only. **Never** `VITE_SUPABASE_SERVICE_ROLE_KEY` |

Rules:

- Do not write real key values into this markdown file, `.env.example`, or chat.
- Later steps create `.env.example` (placeholders only) and separate **browser** vs **server** Supabase clients to match this table.
- A real `.env` / `.env.local` is **never** committed.

## 8. Open questions for the team

- **Login method for this topic:** **email/password** via Supabase Auth. Magic link, OAuth, and MFA stay in Non-goals unless a later brief adds them.
- **Sponsor profile vs `auth.users`:** For the stories above, the signed-in Auth user **is** the listing owner. A separate `sponsors` profile table is **not required** for login, list-own, or create. Decide extra profile columns in the data-model step; do not block these stories on it.
- **Who may create vs only view?** This topic assumes every signed-in sponsor may create and see **their own** rows only. A viewer-only role is not in scope.
- **Should published listings be world-readable?** **No** for this topic. Anonymous visitors get no listing rows.

## 9. How later steps use this brief

This file is the contract for:

- env separation (public `VITE_*` vs server-only service-role)
- RLS policy design (own-row read/write; no anonymous writes)
- login and protected dashboard routes
- property list and create flows owned by the session
- the end-to-end security verification checklist (stolen session, guessed id, leaked service-role, UI-only hiding)

If a later change would let an anonymous visitor write listings, put the service-role key in the browser, or show Sponsor B Sponsor A’s properties, it **fails this brief**.
