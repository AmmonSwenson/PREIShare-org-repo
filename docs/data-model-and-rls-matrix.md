# PREIshare — Data model and RLS policy matrix

## Purpose

Design-only blueprint for sponsor auth and property listings.

Step 6 migrations must follow this document; do not invent extra tables or open policies without updating this file first.

This file is **not** a migration. It names tables, columns, and who may do what. It does **not** contain `CREATE TABLE` or `CREATE POLICY` SQL.

## Source requirements

Consumed from: `docs/sponsor-auth-requirements.md`

Related (do not contradict): closed listing statuses and property types in `src/types/`; secret split in `docs/env-var-checklist.md`.

## Actors and identities

| Actor | How identity is established | Notes |
|-------|----------------------------|-------|
| Anonymous visitor | No Supabase session | Must not read or write sponsor properties. Login/sign-up pages only. |
| Sponsor (authenticated) | Supabase Auth user (email/password); `auth.uid()` is their user id | May manage **only** rows they own. Guessing another listing id still fails. |
| Admin | Not implemented this topic | Out of scope. Do not add “read all properties” policies for staff. |
| Service role / server admin tasks | Secret `SUPABASE_SERVICE_ROLE_KEY` on the **server** only | Bypasses RLS. Never used from the browser. Not a substitute for owner policies. |

A separate `sponsors` org table is **not** required for the in-scope stories. The signed-in Auth user **is** the listing owner. `profiles.id` equals that Auth user id so RLS can compare to `auth.uid()`.

## Tables

### `profiles` (sponsor linkage)

Links a Supabase Auth user to sponsor display data. Primary key **is** the Auth user id (no second random id).

| Column | Type (intent) | Required | Notes |
|--------|---------------|----------|-------|
| id | uuid (PK, = `auth.users.id`) | yes | Same value as `auth.uid()` after signup/login. FK to `auth.users(id)`. |
| display_name | text | yes | Shown in dashboard chrome. Default can be email local-part until the sponsor edits it. |
| created_at | timestamptz | yes | Default now() |

No extra role column this topic. Every signed-in sponsor may create and see **their own** rows only (`docs/sponsor-auth-requirements.md` open questions).

### `properties` (listings owned by a sponsor)

One listing table. Address stays as simple columns (not nested JSON) so RLS stays simple.

| Column | Type (intent) | Required | Notes |
|--------|---------------|----------|-------|
| id | uuid (PK) | yes | Generated default |
| owner_id | uuid (FK → `profiles.id`, which equals `auth.users.id`) | yes | **RLS hinge column** — owner policies compare this to `auth.uid()`. The app **must** set it from the session, never from a browser-chosen field. |
| title | text | yes | Listing title on dashboard cards |
| description | text | no | Longer copy |
| city | text | no | Location on dashboard cards (PREIshare also has `region` in domain types; city is enough for this first table) |
| status | text | yes | Closed list already in the app: `draft` \| `published` \| `under_offer` \| `sold` \| `archived`. Do not invent `active` / `live`. |
| created_at | timestamptz | yes | Default now() |
| updated_at | timestamptz | yes | Updated on change |

Indexes (intent, not SQL): primary key on `id`; index on `owner_id` for “my listings.”

**Reject in Step 6:** any `properties` table without `owner_id`, or any policy that lets all authenticated users read all rows.

## RLS posture

- Enable RLS on **every** table above before relying on the API. No policy = no access.
- No broad “allow all authenticated” rules on `properties`. That would let Sponsor A read Sponsor B’s listings.
- No policy for the `anon` role on `profiles` or `properties`.
- Browser clients use the anon/authenticated key only; never the service role (`docs/env-var-checklist.md`).
- Listing list/create on the server still runs **as the user** (anon key + session). Service role would skip this matrix.

## RLS policy matrix

One row per action and role. Each row should become one Postgres policy in Step 6. Plain English here; the last column is the **filter shape**, not a `CREATE POLICY` script.

| Table | Operation | Who | Rule (plain English) | Intended SQL shape (for Step 6) |
|-------|-----------|-----|----------------------|----------------------------------|
| profiles | SELECT | Authenticated sponsor | Can read own profile only | `id = auth.uid()` |
| profiles | INSERT | Authenticated sponsor | Can create own profile row only | `WITH CHECK (id = auth.uid())` |
| profiles | UPDATE | Authenticated sponsor | Can update own profile only | `USING` and `WITH CHECK`: `id = auth.uid()` |
| profiles | DELETE | Authenticated sponsor | Denied this topic | No policy / no grant |
| profiles | ALL | Anonymous | No access | No policy for `anon` |
| properties | SELECT | Authenticated sponsor | Can read **only** properties they own. Known ids of other sponsors still return nothing. | `owner_id = auth.uid()` |
| properties | INSERT | Authenticated sponsor | Can insert only if the new row’s owner is themselves. App sets `owner_id` from the session. | `WITH CHECK (owner_id = auth.uid())` |
| properties | UPDATE | Authenticated sponsor | Can update only owned rows; cannot reassign `owner_id` to someone else | `USING` and `WITH CHECK`: `owner_id = auth.uid()` |
| properties | DELETE | Authenticated sponsor | Can delete only owned rows (see open question on archive vs hard delete) | `owner_id = auth.uid()` |
| properties | ALL | Anonymous | No access — not even published rows | No policy for `anon` |

**Fail this matrix:** a Step 6 policy that uses an always-true filter for authenticated `SELECT` on `properties`.

## Requirement → design mapping

| Requirement (from `docs/sponsor-auth-requirements.md`) | Satisfied by |
|-----------------------------------------------|--------------|
| Sponsors need to sign in, view listings they may manage, and add properties | Auth session + `properties` owned by `owner_id`; dashboard list/create later consume this table |
| “The app must know who is signed in before it shows or writes listings” | No `anon` policies; SELECT/INSERT require authenticated role and `auth.uid()` |
| “A sponsor must never receive another sponsor’s property rows, even if they guess a URL or id” | `properties` SELECT: `owner_id = auth.uid()` — not a React hide |
| Service-role key never ships to the browser | Matrix assumes browser uses authenticated/anon role only; service role is out of band (`docs/env-var-checklist.md`) |
| Actor: Anonymous visitor — login only, not dashboard or listing changes | No `anon` policy on `profiles` or `properties`; route gate is a later step, RLS is the database backstop |
| Actor: Sponsor — manages **their own** listings | Own-row SELECT/INSERT/UPDATE/DELETE on `properties` |
| Actor: Admin — out of scope | No admin table, no “read all” policy |
| Story: sign in with email/password so the app knows who I am | Identity = `auth.uid()`; `profiles.id` matches that user |
| Story: see a list of **only my** properties after sign-in (Postgres, not mock arrays) | `properties` SELECT `owner_id = auth.uid()`; columns `title`, `city`, `status`, `created_at` for cards |
| Story: create a new property **owned by my account**; server sets ownership from the session | INSERT `WITH CHECK (owner_id = auth.uid())`; app must not take `owner_id` from the form |
| Story: anonymous visitor cannot open dashboard or change listings | No `anon` write or read policies; guessed ids still empty |
| Non-goal: public create/update/delete | No `anon` INSERT/UPDATE/DELETE |
| Non-goal: full admin console / view all listings | No cross-owner SELECT |
| Non-goal: browser chooses `owner_id` | Hinge column set from session; INSERT check rejects any other id |
| Success: unauthenticated users blocked; HTML must not include others’ rows | RLS deny for `anon` plus later route gate |
| Success: list scoped to owner; known foreign id still denied | SELECT `owner_id = auth.uid()` |
| Success: create associates the row with the signed-in sponsor | INSERT WITH CHECK + session `owner_id` |
| Success: RLS in Postgres, not only UI hiding | This matrix; User B must not read User A |
| Threat: stolen session | Session check on routes (other step); RLS still scopes that user to **their** rows only |
| Threat: guessing another sponsor’s property id | SELECT/UPDATE/DELETE still require `owner_id = auth.uid()` |
| Threat: leaked service-role key | Env hygiene (other step); this matrix is for the authenticated role, not a reason to put the secret in the client |
| Threat: security by hiding buttons | Separate INSERT/UPDATE/DELETE policies; UI hide is not enough |
| Open question: published listings world-readable? **No** | No `anon` SELECT on `properties` |
| Open question: `profiles` vs `auth.users` | `profiles.id` = `auth.users.id`; listings still own via `owner_id` comparable to `auth.uid()` |

## Out of scope this sprint

- Public marketplace read of published listings (would need a **separate, intentional** SELECT policy — do not add it in Step 6).
- Multi-sponsor / team ownership of one property.
- Admin override UI (service role only on server, not via RLS for sponsors).
- Viewer-only sponsor role.
- Images, documents, payments, maps, pgvector search, nested contacts/ownership arrays.
- Password-reset polish, OAuth, MFA.
- A second listings table name (`property_listings` vs `properties`): Step 6 must use **`properties`** as named here unless this file is updated first.

## Open questions for review

- [ ] Confirm DELETE vs soft-delete (`status = 'archived'`) with the team. Matrix currently **allows** own-row DELETE. If the team prefers archive-only, remove the DELETE policy in Step 6 and keep `archived` on UPDATE.
- [ ] Confirm whether the `profiles` row is created by a trigger on Auth signup or by the first-login app path. Either is fine if `id` always equals `auth.uid()`.
- [ ] Optional later columns (`region`, `price`, `property_type`) exist in TypeScript domain types. **Do not** add them in Step 6 unless this matrix is updated — first migration should stay on the columns listed above.

## Ready for Step 6 when

- [x] Every sponsor-facing action in the requirements maps to a matrix row.
- [x] `owner_id` exists and is named consistently; it is comparable to `auth.uid()`.
- [x] No policy grants all authenticated users access to all properties.
- [x] Anonymous access to private sponsor properties is denied (no `anon` policy).
- [x] SELECT and INSERT on `properties` are separate, ownership-scoped rows — not a single “manage” rule.
