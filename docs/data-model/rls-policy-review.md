# RLS policy review — property_listings

**Reviewed by:** Ammon Swenson  
**Date:** 2026-10-24  
**Design source:** `docs/data-model/property-listings-schema.md`

## Migration file

- **Path:** `supabase/migrations/20250321000000_property_listings.sql`
- **What it creates:** table `public.property_listings`, indexes on `owner_id` and `(owner_id, status)`, `updated_at` trigger, RLS enabled, four own-row policies
- **What it does not create:** anon/public read policies, `USING (true)` writes, `GRANT ALL`, service-role usage, image/search tables

## How to apply

Do this against the PREIshare **Supabase** project (the `auth` schema must exist). Do not run this on a blank local Postgres without Supabase Auth.

### Option A — SQL Editor (recommended for this sprint)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your PREIshare project.
2. Go to **SQL Editor** → **New query**.
3. Paste the **full** contents of `supabase/migrations/20250321000000_property_listings.sql`.
4. Run the query and confirm success (no error banner).
5. Open **Table Editor** → `property_listings`.
6. Confirm the table exists and the UI shows **RLS enabled** (lock / “RLS” badge).
7. Open the table’s **Policies** tab (or **Authentication → Policies**) and confirm four policies: `listings_select_own`, `listings_insert_own`, `listings_update_own`, `listings_delete_own`.

If a later run says the table already exists, do **not** disable RLS to “fix” it. Inspect policies first.

### Option B — CLI (if the project is already linked)

```bash
npx supabase db push
```

Only after `supabase link` to this project. Do not put the database password or service-role key in this file.

## Decisions recorded from the design doc (no silent defaults)

| Topic | Decision in this migration |
| --- | --- |
| Status storage | `text` + check constraint (five closed values), not a Postgres enum |
| Delete | Hard DELETE allowed for **own** rows; `archived` remains a status for “removed from browse”; no `deleted_at` |
| `closed_at` | Nullable column only — no DB check yet that `sold` requires it |
| Country | Default `'US'` |
| Price | `numeric(12,2) not null default 0` with `price >= 0` (not `price_cents`) |
| Region column | `region` (not `state`), matching the design doc |
| Property type | Required closed list from `src/types/property-type.ts` |

## Policies (plain language)

| Policy | Operation | Who | Rule |
|--------|-----------|-----|------|
| `listings_select_own` | SELECT | `authenticated` | `owner_id = auth.uid()` — a sponsor only reads their rows |
| `listings_insert_own` | INSERT | `authenticated` | WITH CHECK `owner_id = auth.uid()` — cannot insert as another user |
| `listings_update_own` | UPDATE | `authenticated` | USING + WITH CHECK `owner_id = auth.uid()` — cannot edit others’ rows or reassign `owner_id` |
| `listings_delete_own` | DELETE | `authenticated` | `owner_id = auth.uid()` — cannot delete others’ rows |

There is **no** policy for the `anon` role. Logged-out clients get no listing access (RLS default deny).

## Alignment with design doc

| Check | Match? | Notes |
| --- | --- | --- |
| Columns (id, owner_id, title, description, property_type, status, address fields, price, currency, closed_at, timestamps) | Yes | Types and nullability follow the design table |
| `owner_id` NOT NULL FK → `auth.users(id)` ON DELETE CASCADE | Yes | |
| Indexes on `owner_id` and `(owner_id, status)` | Yes | |
| `created_at` / `updated_at` defaults; trigger bumps `updated_at` | Yes | |
| RLS enabled | Yes | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` |
| Own-row SELECT / INSERT / UPDATE / DELETE with `auth.uid()` | Yes | Policy names from the design (`listings_*_own`) |
| INSERT WITH CHECK | Yes | |
| UPDATE USING + WITH CHECK | Yes | Blocks owner reassignment |
| No world-read / anon policies | Yes | No `to anon`, no `USING (true)` |
| Closed `status` and `property_type` lists | Yes | Check constraints, not invented aliases |
| Service-role key in SQL | No (good) | Migration never references the key |

Scaffold sample SQL used `price_cents`, `state`, and only `draft`/`published`/`archived`. **This migration follows the design doc instead**, so it does not implement those scaffold shortcuts.

## Risks and open questions

- **Empty table until login + insert exist.** RLS on with no rows looks “broken.” Do not add `USING (true)` to make the Table Editor show other people’s data.
- **Service role bypasses RLS.** Keep `SUPABASE_SERVICE_ROLE_KEY` server-only (`docs/setup/supabase-env-checklist.md`). Dashboard Table Editor as project owner may also see all rows — that is admin access, not a public policy.
- **Default grants on `public`.** Supabase often grants table DML to `anon` and `authenticated`. Without an anon **policy**, anon still cannot read rows. Do not add a compensating `USING (true)` policy.
- **Should published listings be readable by other sponsors later?** Not this sprint. The brief does not ask for a public marketplace.
- **`sold` without `closed_at`.** Allowed at the database for now; enforce in app code or a later migration.
- **Drafts require a full address.** Matches the design’s “simple first create form” choice; domain TypeScript still allows incomplete drafts.
- Apply this SQL only on a Supabase project. `auth.users` will not exist on a generic local Postgres.

## Sign-off

- [x] SQL matches `docs/data-model/property-listings-schema.md` ownership and RLS boundaries
- [x] No `USING (true)` writes, no anon listing access
- [x] Review names apply steps so a teammate can reproduce the table
- **Reviewed by:** Ammon Swenson
- **Date:** 2026-10-24
- **Ready for later loaders/actions:** Yes, after this migration has been run on the project
