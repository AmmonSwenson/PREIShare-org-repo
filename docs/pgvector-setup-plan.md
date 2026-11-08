# PREIshare pgvector setup plan

## Purpose

Enable semantic property search **storage** in Supabase PostgreSQL using pgvector, aligned with `docs/embedding-data-model.md`.

This plan is the contract for the **SQL migration step**—no application search UI, no seed embeddings, and no full `CREATE TABLE` as the deliverable here.

`public.properties` **already exists** (sponsor listings). This migration **alters** it. It does not create a second listings table.

## Source of truth

Copied from `docs/embedding-data-model.md` — do not invent new names or a second size:

| Item | Value from the model |
| --- | --- |
| Table | `public.properties` |
| Embedding column | `embedding` |
| Embedding type | `vector(1536)` |
| Dimension | **1536** (locked with the data model and migration) |
| Other listing columns | Already present: `id`, `owner_id`, `title`, `description`, `city`, `status`, `created_at`, `updated_at` |
| Embedding input recipe | `{title}` + blank line + `{description}` (generation later; not this migration) |
| Distance / ranking style for demo | Cosine-style closeness (see Similarity approach) |

**Do not** silently change the table name, the column name `embedding`, or **1536**. If the size must change, update the **data model, this plan, and the migration in one pass**—never pick a size only in SQL.

## Migration goals (what “done” means)

1. pgvector extension is available in the database (`vector`).
2. `public.properties` still has the listing fields from the data model, plus a non-lossy `embedding vector(1536)` column. Existing text columns stay; we do not replace `description` with a vector.
3. It is valid for `embedding` to be **null** until a backfill/seed job runs (insert-then-embed lifecycle).
4. A beginner demo can run a similarity query **later** (a `match_properties` function is a **follow-up**, out of scope for this migration).
5. Verification queries prove: extension on, vector column shape, nulls allowed, chosen distance operator works on two literal vectors.

## Safe migration order (must not be reordered)

| Order | Step | Why this order |
|------:|------|----------------|
| 1 | Enable extension `vector` (pgvector) | Vector column types and operators (`<=>` and friends) do not exist until the extension is on. Creating `embedding` first **fails**. |
| 2 | **Alter** `public.properties`: add `embedding vector(1536)` nullable. Do **not** `CREATE TABLE properties` if the table already exists. Do **not** add `price`, photos, or a second embedding column. | Column type `vector(...)` depends on step 1. Listing fields already exist from sponsor auth. |
| 3 | Vector index | **Out of scope for this demo migration.** Indexes are not required to store vectors. Add only after the column exists, and only when sample size grows. Tiny seed set: sequential scan is enough. |
| 4 | Run verification SQL in the Supabase SQL editor | Confirms schema before any seed, TypeScript helper, or search route. |

**Do not** create vector columns before enabling the extension.

**Do not** invent a second dimension or a second embedding column name.

**Do not** drop or recreate `properties` to “make room” for embeddings (that would wipe sponsor listings and RLS).

## Similarity approach (beginner demo)

- **Choice:** Cosine-style ranking, standardized in later search SQL as pgvector **cosine distance** via the `<=>` operator on `embedding`.
- **How to read the score:** `<=>` returns a **distance**. **Smaller is closer / better.** Later `ORDER BY embedding <=> $query_embedding ASC` then `LIMIT` top-K (notes propose K = 5). Do **not** sort descending unless we switch to a similarity expression we have named.
- **Why:** Buyers care about meaning closeness (`docs/vector-search-learner-notes.md`). Cosine-style scoring is a common default for text embeddings. Using one operator everywhere avoids mixing L2 (`<->`) and inner product (`<#>`) by accident.
- **Tradeoff:** Exact scans over a handful of sample rows are simple and fine for learning. Approximate indexes (IVFFlat / HNSW) help when listings grow large but add operator-class setup we do not need for tens of rows. For this tutorial, **correct schema and clear SQL beat micro-optimization**.

If later search SQL uses `1 - (embedding <=> query)` as similarity, document that **larger is better** at that moment. This plan’s default is **distance via `<=>`, lower better**.

## Index recommendation

- **Demo scale (tens of rows):** **No index required** for the sample seed. Sequential scan is OK and easier to explain.
- **This migration:** step 3 is **out of scope**. Do not add IVFFlat/HNSW “for production” in the first SQL file.
- **If a later change adds an index:** create it only after `embedding` exists; most rows should be non-null first; operator class must match cosine / `<=>` and **1536**.

## Environment values (high level—no secrets in this file)

Names only. Real values live in local env / the Supabase dashboard. Align with `docs/env-var-checklist.md`. **Never** paste keys, JWTs, or connection strings here.

| Name | When it is needed |
| --- | --- |
| `SUPABASE_URL` | Server-side project URL (same project as the public URL). |
| `VITE_SUPABASE_URL` | Browser-safe public URL. Not required to enable pgvector. |
| `SUPABASE_SERVICE_ROLE_KEY` | Trusted server/maintenance only. Never `VITE_`. Not required just to run SQL in the dashboard editor. |
| `DATABASE_URL` (or the Supabase DB connection string) | If migrations run via CLI. Name only. |
| Embedding provider API key (name TBD with the model; example shape `OPENAI_API_KEY`) | Needed when **generating** vectors later. **Not** required to enable pgvector or add the column. Do not put it on `VITE_`. |

Enabling the extension does not need an embedding vendor. Do not block the migration on a provider key.

## Verification queries (run after migration)

Intents a human can run in the Supabase SQL editor. Exact SQL may be tightened in the migration step; sketches below must keep table `properties`, column `embedding`, and **1536**.

1. **Extension installed:** `vector` appears in `pg_extension`.
2. **Column shape:** `properties.embedding` is a `vector` with the planned **1536** (confirm via catalog / `\d` / `information_schema` plus `atttypmod` or equivalent—not a guess). Listing columns `title` and `description` still exist as text.
3. **Nulls allowed:** insert or select a row with `embedding` IS NULL to prove the temporary insert-then-embed state is legal. Do not require a real model output in this check.
4. **Operator smoke test (optional):** compare two **literal** vectors of the **same** 1536 length with `<=>` so we know cosine distance works. Do not mix lengths.

Illustrative sketches (not the migration file; dimension must match the model when SQL is real):

```sql
-- 1) extension present
select * from pg_extension where extname = 'vector';

-- 2) column present on properties
select column_name, data_type, udt_name
from information_schema.columns
where table_schema = 'public' and table_name = 'properties'
order by ordinal_position;

-- 3) null embedding is allowed (intent: a searchable row still needs a vector later)
-- select id, title, embedding from public.properties where embedding is null;

-- 4) operator smoke test — two literals of length 1536
-- select '[...]'::vector(1536) <=> '[...]'::vector(1536) as cosine_distance;
```

A failed check: vector column exists but extension `vector` is missing; or `embedding` type is `text`/`jsonb` instead of `vector`; or dimension disagrees with the data model.

## Out of scope for this migration plan

- Generating real embeddings for listings (later TypeScript helper + seed)
- `match_properties` search function, API routes, and React search UI
- Seed content for the four requirements queries (cabin, schools, downtown, farmland)
- Creating a new `properties` table or dropping the existing one
- Production RLS hardening beyond what `docs/data-model-and-rls-matrix.md` already requires (no RLS redesign in this slice)
- Hybrid keyword + vector ranking, maps, price/beds filters, or re-ranking
- Vector index (IVFFlat/HNSW) for this first migration
- Choosing a vendor **name** (dimension is already 1536)

## Handoff to next step

The coding agent must implement **only** ordered goals **1–2**:

1. `create extension if not exists vector`
2. `alter table public.properties add column embedding vector(1536)` (nullable)

Names and dimension come from `docs/embedding-data-model.md`. Do not silently change vector size or table name. Do not add an index unless this plan is updated first. Verification queries (section above) run after that SQL, before seed or UI.
