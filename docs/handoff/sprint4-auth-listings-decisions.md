# Sprint 4 Handoff — Sponsor Auth & Postgres Property Listings

**Project:** PREIshare dashboard  
**Sprint:** 4 (Topic 1) — Supabase auth & database  
**Audience:** Sponsors and the next-sprint implementer  
**Status date:** 2026-10-24  
**Verification:** `docs/verification/sprint4-auth-listings-checklist.md` — **Overall FAIL** (repo wiring in place; live Supabase Auth/Postgres not proven in that pass)

## 1. Client story recap

PREIshare sponsors need a secure way to sign in and manage **real** property listings stored in PostgreSQL—not mock arrays in the browser—while the service-role key and other privileged secrets stay out of the client bundle.

This sprint is that contract: email/password (Supabase Auth), session-gated listing pages, create and read of **that sponsor’s** rows, and a hard split between public anon keys and server-only secrets. It is not payments, not a live investor portfolio feed, and not a rewrite of the Sprint 3 shell (`docs/requirements/sponsor-auth-and-listings-brief.md`).

## 2. Delivered vs original request

| Client need | Delivered? | Where / evidence |
| --- | --- | --- |
| Secure sponsor login | **Partial** | Signup `/auth/signup`, login `src/routes/auth/login.tsx`, session helpers `src/lib/auth/session.ts`, dashboard `beforeLoad` in `src/routes/dashboard/route.tsx`. Verification **2.3 PASS** (signed-out `/dashboard` and listings **307 → `/auth/login`**). **2.1, 2.2, 2.4 FAIL** — no live account in the verification environment (missing `.env.local`). |
| Postgres-backed listings (create/read/display) | **Partial** | Server functions `src/server/listings.ts` (`listMyListings`, `createListing`) + UI `src/routes/dashboard/listings/index.tsx` and `.../new.tsx`. Verification **3.4 PASS** (UI calls those server functions; user-scoped client, not service role). **3.1–3.3 FAIL** — no listing was created against a live table. |
| Row-level security so sponsors only see allowed rows | **Partial** | Table `property_listings` with `owner_id` → `auth.users`; policies `listings_select_own` / `insert_own` / `update_own` / `delete_own` in `supabase/migrations/20250321000000_property_listings.sql` (`docs/data-model/property-listings-schema.md`, RLS review). Verification **1.4 PASS** (file in repo). **1.1–1.3 and all of section 4 FAIL** — Table Editor and User B isolation were not run. |
| Secrets kept out of the client bundle | **Partial** | `.env.example` placeholders only; browser client reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`; `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be `VITE_` (`docs/setup/supabase-env-checklist.md`). Verification **5.1–5.4 PASS**. **5.5 FAIL** — authenticated Network tab not inspected. |

**Gaps (from the verification checklist):** the **code and docs** for login, protected listings, Postgres schema/RLS, and secret split are in the repo. The **live** client story—sign up, create a row in Postgres, prove User B cannot see User A’s listing, confirm RLS in Table Editor—is **not** signed off. Do not demo this as production-ready until those FAIL rows are re-run after `.env.local` and the SQL migration are applied.

## 3. Architecture decisions (keep short)

- **Auth:** Supabase Auth, email/password only this sprint (no Google/GitHub OAuth). Session cookies are HttpOnly; protected `/dashboard/*` runs `getUser()` in `beforeLoad` and redirects to `/auth/login` when empty.
- **Data:** PostgreSQL table `public.property_listings`. Ownership column is **`owner_id`** (not `sponsor_id`). Statuses: `draft`, `published`, `under_offer`, `sold`, `archived`. Property types: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`. Address is flat columns (`address_line1`, `city`, `region`, …). Price is `numeric` USD, `>= 0`.
- **Authorization:** RLS own-row policies for SELECT/INSERT/UPDATE/DELETE using `auth.uid()`. No anon/world-read marketplace. Listing CRUD on the server uses the **anon key + user JWT** so RLS still applies. The service-role key bypasses RLS and must not be used for sponsor create/list.
- **Clients:** `src/lib/supabase/client.ts` — public URL + anon/publishable key only (`VITE_*`). `src/lib/supabase/server.ts` — server env; service-role helper for trusted admin-style Auth calls; **user-scoped** helper for listing loaders/actions. React listing UI must not import the server module.
- **Env hygiene:** Document **names**, never values. Public: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Server: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Never commit `.env` / `.env.local`. Never name the service-role var with `VITE_`.

## 4. How to run locally (sponsor-friendly)

Do **not** paste real keys into chat, Git, or this file. Names only.

1. Copy `.env.example` to **`.env.local`** (or `.env`). Fill **Project URL**, **anon/publishable** key, and **service_role** key from Supabase → Project Settings → API (`docs/setup/supabase-env-checklist.md`). Confirm `git status` does **not** list that file.
2. In the Supabase SQL Editor, run the full contents of `supabase/migrations/20250321000000_property_listings.sql`. Confirm Table Editor shows `property_listings` with **RLS enabled** and the four `listings_*_own` policies.
3. From the repo root: `npm install`, then `npm run dev` (Vite, port 3000 per `package.json`). Restart the dev server after editing env.
4. Open `/auth/signup`, create a test sponsor, then `/auth/login` if needed. Open **Listings** (`/dashboard/listings`). Use **Add listing**, save, and confirm the row on the list after reload. Signed-out visits to `/dashboard` should send you to login.

Hosting later: same split — `VITE_*` on the client build; `SUPABASE_SERVICE_ROLE_KEY` only in server/runtime secrets, never as a `VITE_` variable.

## 5. Known limitations

From the brief **out of scope** and from verification **FAIL** rows—do not treat these as shipped:

- Live signup/login, sign-out click-through, and Postgres create/list were **not** proven (checklist 2.1, 2.2, 2.4, 3.1–3.3).
- User B RLS isolation was **not** run (section 4). Own-row policies exist in SQL only until applied and tested with two accounts.
- Authenticated browser Network tab was **not** checked for a service-role header (5.5).
- No branded email templates, password-reset UX, MFA, or social login.
- Listing fields are the first table only: no images, contacts, documents, or nested ownership arrays.
- No approvals workflow (draft → submit → approve/reject by another role).
- No public marketplace of published listings for logged-out visitors.
- No pgvector / full-text search, maps, or charts.
- Sprint 3 Home / Portfolio / Deals / Profile widgets are still **mock or empty**—this sprint did not turn them into live money.
- Update exists as a server function; the listings UI shipped **list + create**, not a full editor/delete screen.

## 6. Recommended next-sprint work (pick with stakeholders)

All three **keep** current auth, `owner_id` RLS, and the public-vs-server key split. Do not replace that foundation.

1. **Richer listing fields** — persist more of the existing TypeScript domain (contacts, ownership, media) on top of `property_listings`; add edit/delete UI that calls the existing update (and optional delete) server path. Depends on a verified User A create/list loop.
2. **Approvals workflow** — extra statuses or a separate review table; who may transition `draft` → published; RLS so only the owner (or a named reviewer role) can change state. Depends on current closed status list and own-row policies.
3. **pgvector search** — embeddings + similarity search for listings **after** CRUD and two-user isolation are PASS on the verification checklist. Search must still respect RLS (a sponsor must not retrieve another sponsor’s rows via similarity).

## 7. Open questions for stakeholders

- Who may **create** listings vs only **view** them? This sprint assumes every signed-in sponsor is an owner of their own rows only.
- Is **multi-sponsor isolation** (two accounts, zero cross-reads) required before richer fields or search? Verification says yes before calling the sprint done.
- Preferred next theme: richer fields, approvals, or search?
- Should **published** listings ever be readable by other sponsors or logged-out visitors? The current design says **no** marketplace this version.
- Confirm email in Supabase Auth: leave confirmation on (sponsors click a link) or turn it off for local testing?

## 8. Source artifacts

- `docs/requirements/sponsor-auth-and-listings-brief.md`
- `docs/verification/sprint4-auth-listings-checklist.md`
- `docs/data-model/property-listings-schema.md`
- `docs/setup/supabase-env-checklist.md`
