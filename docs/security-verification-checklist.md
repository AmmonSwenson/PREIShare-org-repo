# Security verification checklist — PREIshare sponsor auth & properties

**Date:** 2026-10-24 (America/Denver)  
**Verifier:** Ammon Swenson  
**Build / branch:** `main` at `91a26b7` (routes and clients as of this pass)  
**Related docs:** `docs/sponsor-auth-requirements.md`, `docs/env-var-checklist.md`, `docs/data-model-and-rls-matrix.md`

Status values: `pass` | `fail` | `not-run`

This environment has **no** gitignored `.env` / `.env.local` and no live Supabase project URL. Live signup, create, two-user isolation, and logout click-through could not be proven. File review and signed-out HTTP/browser checks **were** run. No real key values appear in this document.

---

## 1. Environment and secret hygiene

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 1.1 | Browser-safe client (`src/lib/supabase.client.ts`) uses only public URL + anon key | Opened file 2026-10-24; reads only `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Project search of this file: zero `SERVICE_ROLE` / `service_role` hits | pass | Login uses this helper inside `createClientOnlyFn` so the `*.client.ts` marker is not imported on the server graph |
| 1.2 | Service-role / secret key used only in server module (`src/lib/supabase.server.ts`) or never used in this topic | Opened `src/lib/supabase.server.ts`; `SUPABASE_SERVICE_ROLE_KEY` is read only inside `createSupabaseServiceRoleClient`. `src/routes/**` has **zero** imports of that helper. Property list/create use `createSupabaseServerClient` (anon key + session cookie) | pass | Older `src/lib/supabase/server.ts` also reads the same **name** for session refresh; still server-only, not a `VITE_` var |
| 1.3 | No raw secrets committed in source or checklist | `rg` for JWT-shaped `eyJ…` in `src/`, docs, `.env.example`: no matches. `git ls-files` tracks `.env.example` only. `git check-ignore -v .env` → `.gitignore:6:.env`; `.env.local` → `.env.*` | pass | Never paste real key values here |
| 1.4 | `.env.example` documents required vars without real values | Compared to `docs/env-var-checklist.md`. Placeholders only: `your-project-ref.supabase.co`, `your-anon-key-here`, `your-service-role-key-here`. Service-role name has **no** `VITE_` prefix | pass | |

**Section result:** pass

---

## 2. Login and session-aware routing

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 2.1 | Unauthenticated visit to dashboard (or properties) redirects or blocks access | `curl` 2026-10-24 against local Vite `http://127.0.0.1:43148`: `GET /dashboard` → **307** `Location: /login`; `GET /dashboard/properties` → **307** `/login`; `GET /dashboard/properties/new` → **307** `/login`. Headless Chrome: `/dashboard/properties` landed on `/login` | pass | Dashboard `beforeLoad` uses a server function + session cookie; no session → redirect |
| 2.2 | Valid sponsor credentials reach an authenticated dashboard session | Could not sign in: no `.env.local` / live Auth project in this environment | not-run | Re-run after copying `.env.example` → `.env.local` and creating a throwaway sponsor in Supabase Auth |
| 2.3 | Invalid credentials do not grant dashboard access | Headless Chrome on `/login`: submitted `nobody@example.com` / `wrongpass`. Stayed on `/login`. Visible `role="alert"`: missing `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (no live keys). `GET /dashboard` still **307** `/login` | pass | Did not obtain a session. Wrong-password against live Auth still needs a re-test once env exists |
| 2.4 | Logout clears session; protected routes no longer load data as that user | No signed-in session existed to click Sign out | not-run | Code: dashboard Sign out calls `signOut` server fn then `navigate({ to: '/login' })`. Re-test after 2.2 |

**Section result:** fail (2.1 and 2.3 passed; live login and logout were not proven)

---

## 3. Property list isolation (RLS)

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 3.1 | Signed-in sponsor sees property list UI from `src/routes/dashboard/properties.tsx` | Could not reach the page while authenticated (blocked by 2.2). Signed-out visit redirects (2.1) | not-run | Route exists; loader calls `createSupabaseServerClient` then `from('properties').select('id, title, city, status, created_at')` with **no** React filter-by-owner |
| 3.2 | List shows only rows owned by the current sponsor (per docs/data-model-and-rls-matrix.md) | No live Postgres session. Did not compare UI titles to Table Editor | not-run | Intended control: policy `properties_select_own` `USING (owner_id = auth.uid())`. Must not query with the service-role helper |
| 3.3 | Empty state is safe (no error that leaks other tenants’ data) | Did not observe the signed-in empty UI. Read `properties.tsx`: empty copy is “No properties yet”; errors are the generic string “Could not load properties. Try again.” | not-run | File review looks safe; still needs a signed-in empty screenshot |

**Section result:** not-run

---

## 4. Property create under RLS

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 4.1 | Create form on `src/routes/dashboard/properties.new.tsx` requires an authenticated session | Logged-out `GET /dashboard/properties/new` → **307** `/login` | pass | Logged-in form render not observed |
| 4.2 | Successful create inserts a row owned by the current sponsor | No live insert | not-run | Code sets `owner_id: user.id` from `getUser` on the server; form fields are title/city/description only (matrix columns, not a client `owner_id`) |
| 4.3 | Create failure (validation or RLS) does not expose secret keys or raw DB internals in the UI | No live insert failure. File review: `publicInsertError` strips messages matching `service.role` / `jwt` / `apikey` / `secret`. Title `required` in HTML. Navigate to list only when `result.ok` | not-run | Re-test: empty title (browser validation) and a forced RLS/FK failure after env is set |

**Section result:** fail (4.1 passed for logged-out block; create-as-owner not proven live)

---

## 5. Cross-sponsor access attempt

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 5.1 | Sponsor B cannot list Sponsor A’s properties in the UI | No second test user; no live Auth | not-run | Do **not** treat a single-user happy path as isolation proof |
| 5.2 | Direct read/update of another sponsor’s row is denied by RLS (UI and/or Supabase policy behavior) | Policy review of `supabase/migrations/20250321000000_sponsors_properties_rls.sql`: `properties_select_own` / `insert_own` / `update_own` / `delete_own` use `owner_id = auth.uid()`; INSERT/UPDATE have `WITH CHECK`; no `anon` policy; no `USING (true)`. Live two-user attempt not run | not-run | SQL matches `docs/data-model-and-rls-matrix.md`. Apply the migration on a real project, then re-test as User B |

**Section result:** not-run

---

## 6. Gaps found and fixes applied

| Gap (checklist #) | What was wrong | Fix applied (files) | Re-test status |
|-------------------|----------------|---------------------|----------------|
| | | | |

None found in this pass that were still failing in code after earlier route work. Remaining gaps are **environment** (no `.env.local`, no two Auth users, migration not applied to a live project)—not additional UI bugs observed today.

---

## 7. Residual risks (honest leftovers)

- **No live Supabase in this verifier environment.** Checks 2.2, 2.4, 3.*, 4.2, 4.3, 5.* are `not-run`. A stakeholder demo of “real listings under RLS” is **not** proven here.
- **Single (zero) test sponsor.** Cross-sponsor UI isolation must be re-run with User A and User B after env + migration.
- **Authenticated Network tab not inspected.** File review shows the browser client never reads `SUPABASE_SERVICE_ROLE_KEY`, but a signed-in DevTools pass is still needed to confirm no service-role `apikey` header on list/create requests.
- **Two listing schemas exist in the repo.** This topic’s UI uses `public.properties` (`docs/data-model-and-rls-matrix.md`). An earlier sprint path still has `public.property_listings`. Operators must apply the **properties** migration this checklist talks about, or list/create will fail against the wrong table.
- **`profiles` row is required** before `properties.owner_id` FK insert. Create upserts the signed-in profile; if that upsert is skipped or RLS-denied, create fails. Confirm on first live insert.
- Deploy pipelines must still keep `SUPABASE_SERVICE_ROLE_KEY` as a **server** secret, never a `VITE_` variable.

---

## 8. Stakeholder verdict

**Ready to show stakeholders?** no

**Summary (3–5 sentences):**  
I personally verified secret hygiene on disk: `src/lib/supabase.client.ts` reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; the service-role **name** is confined to server helpers and docs; `.env.example` is placeholders; no JWT-shaped secrets are in git. I personally verified signed-out routing: `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` return **307** to `/login`; a failed login submit stays on `/login` with a visible alert and does not open the dashboard. I did **not** complete a live sponsor login, create, logout, or two-user isolation pass because this environment has no `.env.local` and no second Auth user. RLS **intent** in the migration matches the matrix (`owner_id = auth.uid()`, `WITH CHECK` on insert/update, no anon access), but that is design review, not a proven runtime. Do not demo this as production-ready until 2.2, 3.2, 4.2, and 5.1 are `pass`.

**Sign-off:** Ammon Swenson, 2026-10-24 (America/Denver)
