# Property Listings Data Model & Auth Boundaries

> Sprint 4 design doc for PREIshare. Source of truth for migrations and RLS.
> Inputs: `docs/requirements/sponsor-auth-and-listings-brief.md`,
>         `docs/setup/supabase-env-checklist.md`
>
> This file is a **blueprint**, not a migration. Do not copy-paste SQL from here
> until the next step writes a recorded migration that matches these rules.

## 1. Purpose

Sponsors sign in and manage **real** property listings stored in Postgres.
No mock arrays in the browser (`mockHoldings`, `mockDeals`,
`sampleInvestorListings` are not the source of truth).

The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) **never** ships to the
client bundle and is **never** named with a `VITE_` prefix
(`docs/setup/supabase-env-checklist.md`).

A sponsor can **create** listings and **read** only their own rows after
refresh. Logged-out visitors must not see listing data
(`docs/requirements/sponsor-auth-and-listings-brief.md`).

## 2. Entity: `property_listings`

One table for this sprint. Address is stored as flat columns (not a nested
JSON document) so RLS and filters stay simple. Status and property type use
the **closed lists already in** `src/types/listing-status.ts` and
`src/types/property-type.ts` — do not invent `active`, `live`, or
`UNDER_OFFER`.

| Column | Type (Postgres) | Nullable | Notes |
|--------|-----------------|----------|-------|
| `id` | `uuid` | no | Primary key; default `gen_random_uuid()` |
| `owner_id` | `uuid` | no | FK → `auth.users(id)`; the signed-in sponsor who owns the row |
| `title` | `text` | no | Short display name (domain: non-empty title) |
| `description` | `text` | yes | Longer listing copy (maps to TypeScript `summary`) |
| `property_type` | `text` | no | Closed set: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` |
| `status` | `text` | no | Closed set: `draft`, `published`, `under_offer`, `sold`, `archived` |
| `address_line1` | `text` | no | Street address (domain `address.line1`) |
| `address_line2` | `text` | yes | Unit / suite |
| `city` | `text` | no | |
| `region` | `text` | no | State / province (required so the property can be located) |
| `postal_code` | `text` | no | |
| `country` | `text` | no | Default `'US'`; two-letter code preferred |
| `price` | `numeric(12,2)` | no | Asking price in USD; must be `>= 0` |
| `currency` | `text` | no | Default `'USD'`; only `USD` this version |
| `closed_at` | `timestamptz` | yes | Required conceptually when `status = sold`; otherwise null |
| `created_at` | `timestamptz` | no | Default `now()` |
| `updated_at` | `timestamptz` | no | Default `now()`; bump on every update |

`price` is a number (not a formatted string). Zero is allowed on `draft` so a
sponsor can save a row before they set an asking price. Investor-visible
statuses (`published`, `under_offer`, `sold`) should use a price `> 0` at the
application layer; the migration step should still enforce `price >= 0`.

### Indexes (recommended)

- Primary key on `id`
- Index on `owner_id` (filter “my listings”)
- Index on `(owner_id, status)` if the dashboard filters by status often

### Constraints the migration must encode (described, not SQL here)

- `status` only the five strings above (check constraint or Postgres enum —
  see open questions)
- `property_type` only the six strings above
- `currency` = `USD`
- `price >= 0`
- `owner_id` **required** foreign key to `auth.users(id)`

### Out of scope for this sprint (do not add tables or columns for these)

- Images / media tables
- Full-text search / pgvector embeddings
- Multi-sponsor shared ownership or team orgs
- Nested `contacts` / `ownership` arrays (domain types exist in TypeScript;
  persist them later, not in this first table)
- Public marketplace “all published listings” feed for logged-out visitors
- Payments, documents, maps, live investor portfolio balances

## 3. Ownership model

- Every listing row **must** have `owner_id` set to the Supabase Auth user id
  of the sponsor who created it (`auth.users.id`).
- Foreign key: `owner_id` → `auth.users(id)` with **`ON DELETE CASCADE`**.
  If the auth user is removed, their listings go with them. (Soft-delete of
  listings is an open question; we are not adding `deleted_at` this sprint.)
- Application code **never** lets the browser choose a different `owner_id`
  than the signed-in user. Server insert sets `owner_id` from the session
  (`auth.uid()`), then RLS **WITH CHECK** rejects any other value.
- Ownership is **not** a client-side filter. A sponsor “only seeing their
  listings” must be enforced by RLS (and by session-gated routes), not by
  hiding rows in React.

## 4. Proposed Row Level Security (RLS) — plain language

Enable RLS on `property_listings`. **No policy = no access.**

The current user id is `auth.uid()` (the signed-in sponsor).

| Policy name (suggested) | Command | Who | Rule |
|-------------------------|---------|-----|------|
| `listings_select_own` | SELECT | authenticated | `owner_id = auth.uid()` |
| `listings_insert_own` | INSERT | authenticated | WITH CHECK: `owner_id = auth.uid()` |
| `listings_update_own` | UPDATE | authenticated | USING and WITH CHECK: `owner_id = auth.uid()` (cannot steal or reassign rows) |
| `listings_delete_own` | DELETE | authenticated | USING: `owner_id = auth.uid()` |

Notes:

- **Anonymous (logged-out) users get no listing access** this sprint. Do not
  add a policy for the `anon` role.
- Do **not** add a public “read all published listings” policy. The brief does
  not ask for a world-readable marketplace.
- UPDATE must use **both** USING (which rows you can touch) and WITH CHECK
  (the row after the update must still be yours). That blocks changing
  `owner_id` to another user.
- INSERT WITH CHECK is required so a client cannot insert a row for someone
  else’s `owner_id`.
- The **service-role key bypasses RLS**. It may be used only on the **server**
  for admin/maintenance that this sprint does **not** build. Never import it
  into browser code. Never name it `VITE_SUPABASE_SERVICE_ROLE_KEY`.

## 5. Server vs browser operation map

Listing create/read/update run on the **server** with the **user session**
(anon/public key + cookies/JWT). RLS still applies. The service-role key is
not used for sponsor CRUD.

| Operation | Runs where | Client type | Notes |
|-----------|------------|-------------|-------|
| Sign up / sign in / sign out | Browser + Supabase Auth | Browser: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` + user session | No service-role |
| Session check for protected listing routes | Server loader / middleware | Server Supabase client **as the user** (session from cookies) | Redirect if no session; do not load listing rows for logged-out users |
| List my listings | Server loader (`createServerFn` or route loader) | Server client as the user; RLS `SELECT` own rows | Preferred so the UI gets trusted data, not a mock array |
| Create listing | Server action | Server client as the user; set `owner_id` from session | Validate title, status, property type, price server-side |
| Update / archive listing | Server action | Server client as the user | RLS blocks cross-owner edits |
| Hard DELETE | Server action (optional this sprint) | Server client as the user | Same own-row policy |
| Admin bulk jobs | Out of scope | Service-role on the server only | Never in the client bundle |

### Environment boundary reminder

| Variable | Role |
|----------|------|
| `VITE_SUPABASE_URL` | Public project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon/publishable key (RLS still applies) |
| `SUPABASE_URL` | Same URL for server `process.env` |
| `SUPABASE_ANON_KEY` | Optional server alias of the anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only secret.** Bypasses RLS. Never `VITE_`. Never in `src/` files that run in the browser. |

See `docs/setup/supabase-env-checklist.md`.

## 6. Acceptance checks for the next (migration) step

- [ ] Table `property_listings` matches the column list above
- [ ] `owner_id` is `NOT NULL` and FK to `auth.users(id)` (`ON DELETE CASCADE`)
- [ ] RLS is **enabled** with own-row SELECT / INSERT / UPDATE / DELETE policies using `auth.uid()`
- [ ] INSERT has WITH CHECK `owner_id = auth.uid()`
- [ ] UPDATE has USING and WITH CHECK `owner_id = auth.uid()`
- [ ] No policy grants world-readable or anonymous access
- [ ] `status` and `property_type` cannot store values outside the closed lists
- [ ] Migration file is the only place SQL is introduced — not ad-hoc dashboard clicks without a recorded migration

## 7. Open questions (resolve before or during migration)

- **Status storage:** Postgres `enum` vs `text` plus a check constraint. Either is fine if the allowed values stay the five TypeScript statuses.
- **Soft-delete:** `deleted_at` vs hard DELETE. This sprint uses hard DELETE (and `archived` status for “removed from browse”). No `deleted_at` column unless we change this.
- **Draft completeness:** Domain types allow incomplete address/financials on `draft`. This table still requires address columns and `price >= 0` so the first create form stays simple. Relax nullability later if the create UI needs a true incomplete draft.
- **Default `country`:** `'US'` unless a sponsor form collects another two-letter code.
- **`closed_at`:** Database check that `sold` requires `closed_at` (and other statuses forbid it) can wait if the first migration only stores the column as nullable.

## 8. What this doc is not

- Not a `CREATE TABLE` script
- Not login UI, not a Supabase client module
- Not permission for the browser to use the service-role key “just for inserts”
