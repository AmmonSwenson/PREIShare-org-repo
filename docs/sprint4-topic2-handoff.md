# Sprint 4 Topic 2 Handoff — PREIshare Sponsor Auth & Protected Listings

**Project:** PREIshare dashboard  
**Sprint:** 4 Topic 2 — sponsor auth, env split, RLS, list/create  
**Audience:** Sponsors and the next-topic implementer  
**Status date:** 2026-10-24 (America/Denver)  
**Verification:** `docs/security-verification-checklist.md` — **not ready for stakeholders** (secret hygiene and signed-out routing passed; live login, create, and two-user isolation were **not-run**)

## Client story outcomes

What this topic **aimed** to deliver (from `docs/sponsor-auth-requirements.md`):

- Sponsors sign in with email/password and reach a session-aware dashboard (`/login` → `/dashboard`).
- Property list and create run against Postgres table `properties` under Row-Level Security, so a sponsor only sees and creates **their own** rows (`owner_id = auth.uid()`).
- Public project URL and anon key may be used in the browser; the service-role (secret) key stays on server-only paths and must never ship in the client bundle.

What was **actually proven** on 2026-10-24:

- Signed-out visits to `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` redirect to `/login`.
- A failed sign-in stays on `/login` with a visible error and does not open the dashboard.
- File review: browser client uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; no JWT-shaped secrets in git.

Live “sign in, see only my rows, create as owner, User B cannot see User A” is **not** signed off. Do not demo this as production-ready until those verification rows are `pass`.

## Architecture decisions (why we built it this way)

- **Auth:** Supabase Auth email/password. HttpOnly session cookies. Dashboard `beforeLoad` checks the session on the server and sends strangers to `/login`. Login UI uses the browser-safe client only.
- **Data:** Sponsor linkage is `public.profiles` (`id` = `auth.users.id` = `auth.uid()`). Listings are `public.properties` with hinge column **`owner_id`**. There is **no** separate `sponsors` org table in this topic (`docs/data-model-and-rls-matrix.md`).
- **Authorization:** RLS enabled on both tables. Own-row SELECT/INSERT/UPDATE/DELETE on `properties`; INSERT/UPDATE use `WITH CHECK`. No `anon` policies. No always-true filter for authenticated reads. List/create use the **anon key + user JWT**, not the service-role bypass.
- **Clients:** `src/lib/supabase.client.ts` — public URL + anon key. `src/lib/supabase.server.ts` — session-aware helper for normal dashboard work; `createSupabaseServiceRoleClient` is a documented bypass and must not be used for sponsor UI.
- **Env hygiene:** Names in `.env.example` and `docs/env-var-checklist.md`. Public: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Server: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (never `VITE_`). Never commit `.env` / `.env.local`. Document **names**, never values.

## Source documents (read these first)

| Doc | Path | Purpose |
| --- | --- | --- |
| Requirements | `docs/sponsor-auth-requirements.md` | Who can see/change what; admin and public writes out of scope |
| Data model & RLS | `docs/data-model-and-rls-matrix.md` | `profiles` + `properties`, `owner_id`, policy matrix |
| Env checklist | `docs/env-var-checklist.md` | Public vs secret vars |
| Security verification | `docs/security-verification-checklist.md` | What was tested, not-run items, residual risks |

## Key implementation files

- `src/lib/supabase.client.ts` — browser-safe Supabase client (`VITE_` only)
- `src/lib/supabase.server.ts` — server-only clients (session + optional service-role helper)
- `src/routes/login.tsx` — sponsor login
- `src/routes/dashboard.tsx` — session-aware dashboard shell
- `src/routes/dashboard/properties.tsx` — protected property list
- `src/routes/dashboard/properties.new.tsx` — create; `owner_id` from session, not the form
- `supabase/migrations/20250321000000_sponsors_properties_rls.sql` — schema + RLS for `profiles` / `properties`

## Known limitations

Copied from verification — do **not** treat these as done:

- Live valid login (checklist **2.2**) and logout click-through (**2.4**) were **not-run** (no `.env.local` / live Auth in the verifier environment).
- Signed-in property list, owner-only isolation, and empty-state screenshot (**3.1–3.3**) were **not-run**.
- Successful create-as-owner and live create-failure UI (**4.2–4.3**) were **not-run**.
- Cross-sponsor checks (**5.1–5.2**) were **not-run** — no second test user. Policy review is not a substitute for User B in the UI.
- Authenticated browser Network tab was not inspected for a service-role header.
- Listing fields on `properties` are minimal (`title`, `city`, `status`, timestamps). Richer PREIshare domain columns (full address, price, property type, contacts, media) are out of scope for this topic.
- Sponsor invites, team orgs, and admin “view all” are **not** implemented.
- CI/CD secret injection (GitHub Actions / host secret store) is **not** completed here.
- The repo still contains an earlier `property_listings` path. This topic’s list/create use **`properties`**. Apply the Topic 2 migration or those screens will miss the table.

**Stakeholder verdict from verification:** **no** — not ready to show as a live, isolated listings demo.

## Recommended next work (next topic / sprint)

Build **on** current auth, `owner_id` RLS, and the public-vs-server key split. Do not replace them.

1. **Richer listing fields** — more columns, validation, and edit/delete on top of `properties`, after a verified User A create/list loop.
2. **Sponsor invite or role model** — if more than one person may manage one sponsor account (RLS + UI). Multi-sponsor isolation for two Auth users should be `pass` first.
3. **CI secret injection** — deploy-time env checks so production never uses committed secrets; `SUPABASE_SERVICE_ROLE_KEY` only in server/runtime secret storage, never `VITE_`.
4. **Automated RLS tests** — sponsor A cannot read sponsor B rows (list, guessed id, create with a forged owner id).

## Handoff checklist for the next learner

- [ ] Read the four source docs above before changing auth or RLS.
- [ ] Confirm local `.env` / `.env.local` matches `.env.example` **names**; never commit real secret values.
- [ ] Apply `supabase/migrations/20250321000000_sponsors_properties_rls.sql` and re-run `docs/security-verification-checklist.md` (especially 2.2, 3.2, 4.2, 5.1).
- [ ] Keep service-role usage server-only; listing CRUD must keep using the session-aware anon client so RLS still applies.
- [ ] Do not add a public marketplace SELECT or `USING (true)` on `properties` without updating the matrix first.
