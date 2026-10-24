# Sprint 4 — Auth & Listings Verification Checklist

**Project:** PREIshare dashboard  
**Date:** 2026-10-24  
**Verifier:** Ammon Swenson  
**Environment:** local Vite on `http://127.0.0.1:43147` + GitHub `main`. No `.env.local` in this environment, so live Supabase Auth/Postgres was not reachable. No secrets below.

## How to use this doc

Mark each row **PASS** or **FAIL**. Under Evidence, write what you did and what you saw.  
If FAIL, note the fix prompt used and re-test before marking PASS.

This pass records **only checks that were actually run**. Live Table Editor, User A/B signup, and create-listing against Postgres are **FAIL** until someone with a real Supabase project fills `.env.local`, applies the migration, and re-runs those rows.

---

## 1. Database & migration

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1.1 | `property_listings` (or agreed table name) exists in Supabase | FAIL | Could not open Table Editor. This environment has no `.env.local` and no live project URL. Follow-up: apply `supabase/migrations/20250321000000_property_listings.sql` in SQL Editor, then confirm Table Editor shows `property_listings`. |
| 1.2 | RLS is **enabled** on the listings table | FAIL | Not observed on a live project. The **migration file** does include `alter table public.property_listings enable row level security;` (`docs/data-model/rls-policy-review.md`). Re-test after apply. |
| 1.3 | Policies match `docs/data-model/rls-policy-review.md` (select/insert/update scoped to owner) | FAIL | Live Policies tab not opened. Repo migration defines `listings_select_own`, `listings_insert_own`, `listings_update_own`, `listings_delete_own` for `authenticated` with `owner_id = auth.uid()` (INSERT/UPDATE WITH CHECK). No `anon` policy, no `USING (true)`. Confirm those four names in the dashboard after apply. |
| 1.4 | Migration file present: `supabase/migrations/20250321000000_property_listings.sql` | PASS | File exists in the repo (`ls` 2026-10-24). Creates `public.property_listings` with `owner_id` FK to `auth.users`. |

## 2. Authentication & session

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 2.1 | Sponsor can sign up with email/password | FAIL | `/auth/signup` renders email + password. Submitting without env shows `Missing VITE_SUPABASE_URL` (headless Chrome, 2026-10-24). No User A account was created. Follow-up: copy `.env.example` → `.env.local`, restart `npm run dev`, sign up a throwaway email. |
| 2.2 | Sponsor can log in via `src/routes/auth/login.tsx` | FAIL | Login page exists and posts through `createBrowserSupabaseClient()` (anon/VITE_ only). Same missing-env error on submit. No successful session. |
| 2.3 | Signed-out user hitting `/dashboard` (or listings) is redirected to login | PASS | `curl` 2026-10-24: `GET /dashboard` → **307** `Location: /auth/login`. `GET /dashboard/listings` and `GET /dashboard/listings/new` → **307** `/auth/login`. Headless Chrome followed both listings URLs to `/auth/login`. |
| 2.4 | Sign-out clears session; protected pages no longer load data | FAIL | Sign-out control exists on `src/routes/dashboard/route.tsx` (calls `signOut` then navigates to `/auth/login`). Live click-through was not run because no signed-in session existed. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 3.1 | Create listing via UI (title, address/fields per schema) succeeds | FAIL | `/dashboard/listings/new` is behind the dashboard gate (307 when signed out). No User A create against Postgres. Form fields match `src/lib/listings/schema.ts` (title, property_type, address, city, region, postal_code, price, status, description). |
| 3.2 | New row visible on `src/routes/dashboard/listings/index.tsx` | FAIL | Index route loads `listMyListings()`. Empty-state copy is “No properties yet.” Not verified with a real row. |
| 3.3 | Data matches Postgres (Supabase Table Editor), not mock arrays in the client | FAIL | Listings UI has **no** `mockHoldings` / `sampleInvestor` / `MOCK_` arrays (repo search of those routes). Table Editor comparison not run. |
| 3.4 | Server path used: create/read go through `src/server/listings.ts` (or documented server functions) | PASS | `src/routes/dashboard/listings/index.tsx` loader calls `listMyListings()`. `src/routes/dashboard/listings/new.tsx` submits `createListing()`. Both live in `src/server/listings.ts` and use `createUserServerSupabaseClient` (anon key + user JWT), **not** `createServerSupabaseClient` / service role. Live Network tab of those RPCs was not captured. |

## 4. Row Level Security (User B)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 4.1 | Second account User B can sign up / log in | FAIL | No User B. Blocked on 2.1 (no local Supabase env). |
| 4.2 | User B **cannot** see User A’s listings in the UI | FAIL | Not run. Do **not** treat User A happy path as RLS proof. After env + migration: incognito signup as User B, open `/dashboard/listings`, confirm User A’s title is absent. |
| 4.3 | Direct read as User B (UI empty list and/or Table Editor filtered by auth) shows no foreign rows | FAIL | Not run. Server list query also filters `.eq('owner_id', context.ownerId)` in addition to RLS. |
| 4.4 | User B can create their own listing and only see their own | FAIL | Not run. |

## 5. Secret-hygiene audit

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 5.1 | `.env` with real values is **not** committed (`git status` / `git check-ignore`) | PASS | `git ls-files` tracks only `.env.example`. `git check-ignore -v .env` → `.gitignore:6:.env`. `git check-ignore -v .env.local` → `.gitignore:7:.env.*`. No `.env` / `.env.local` file present on disk. |
| 5.2 | `.env.example` has placeholder values only (no live keys) | PASS | Values are `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, `your-service-role-key` — matches `docs/setup/supabase-env-checklist.md`. |
| 5.3 | Repo search: no `service_role` key material in source, docs, or client bundle config | PASS | Search `SUPABASE_SERVICE_ROLE_KEY` / `service_role` / `VITE_SUPABASE_SERVICE`: hits are **variable names and docs only** in `src/lib/supabase/server.ts`, `.env.example`, `docs/setup/supabase-env-checklist.md`, `docs/data-model/property-listings-schema.md`, `docs/data-model/rls-policy-review.md` (5 tracked files). No JWT-shaped literals (`eyJ…`) in source/docs. **NOT found in repo** as live key material. |
| 5.4 | Browser-exposed env only uses public anon/URL names (e.g. `VITE_` / `PUBLIC_` per project convention)—never service role | PASS | `src/lib/supabase/client.ts` reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. There is no `VITE_SUPABASE_SERVICE_ROLE_KEY`. Login/signup import the browser client; listings UI does not import `src/lib/supabase/server.ts`. Compared to `docs/setup/supabase-env-checklist.md`. |
| 5.5 | Client bundle / Network tab does not send service-role header | FAIL | UI routes/components have **zero** `SUPABASE_SERVICE_ROLE` / `Authorization` construction. Earlier SSR HTML for `/auth/login` and `/auth/signup` did not contain `SUPABASE_SERVICE_ROLE_KEY`. Authenticated Network tab was **not** inspected (no session). Re-test after `.env.local`: create a listing and confirm no `service_role` apikey in browser requests. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
|-----|-------------------|----------------|
| No live `.env.local` / migration apply in this environment | No code change. Do not invent User A/B evidence. Human follow-up: fill gitignored `.env.local` from Project Settings → API, paste migration into SQL Editor, then re-run rows 1.1–1.3, 2.1–2.2, 2.4, 3.1–3.3, 4.1–4.4, 5.5. If User B can read User A rows, review RLS in the migration and confirm `src/server/listings.ts` still uses `createUserServerSupabaseClient` (not service role) — do not weaken RLS. | FAIL (blocked on secrets/project access, not on missing UI files) |

## 7. Sign-off

- [ ] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [ ] All critical rows above are PASS (or FAIL accepted with written follow-up)
- [x] No real secrets written into this markdown file

**Overall:** FAIL  

Repo wiring for auth, protected dashboard, listings UI, user-scoped server listings, migration SQL, and secret hygiene of **tracked** files is in place. The **live** client story (signup, create, User B isolation, Table Editor) was not proven here.

**Notes for handoff (Step 12):**

- Apply `supabase/migrations/20250321000000_property_listings.sql` on the PREIshare Supabase project; confirm RLS + four `listings_*_own` policies (`docs/data-model/rls-policy-review.md`).
- Create `.env.local` from `.env.example` (never commit it). Restart the dev server.
- User A: sign up → login → `/dashboard/listings/new` → confirm row on index **and** in Table Editor.
- User B (incognito): listings page must not show User A’s title.
- After that, flip 1.1–1.3, 2.1–2.2, 2.4, 3.1–3.3, 4.*, 5.5 to PASS with emails (no passwords) and listing titles only.
- If listings stay empty after create, confirm loaders still use the user JWT client in `src/server/listings.ts`, not the service-role helper.
