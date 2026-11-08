# PREIshare semantic search — handoff

For a mentor or teammate. Facts come from the four source docs listed in section 9. This file does **not** add search code.

**Status (2026-11-07, America/Denver):** the pipeline is **coded** (schema, generate, seed script, SQL rank, API, `/search` page). It is **not** proven on live sample vectors. `docs/semantic-search-verification.md` signed off **NO** for a stakeholder demo until env, migrations, and seed succeed.

## 1. Client story recap

PREIshare buyers describe lifestyle and investment intent in everyday language. Keyword search only matches exact words. A query such as “quiet cabin near water with good rental upside” can miss a listing that says “lakefront lodge, peaceful, strong weekend occupancy” because those buyer words never appear together (`docs/semantic-search-requirements.md`).

This tutorial slice is **semantic search on sample data**: listing text → embedding (a list of numbers for meaning) → store next to the row in Postgres with pgvector → rank by closeness → thin API + search page. It is a demo, not a production catalog.

## 2. Stakeholder goals ↔ deliverables

| Stakeholder goal | What we delivered | Where to look |
| --- | --- | --- |
| Search by meaning, not only exact words | TypeScript generate module + `match_properties` ranking | `src/lib/embeddings/`, `src/lib/property-search.ts` |
| Store vectors next to property data | Enable `vector`, add `embedding vector(1536)` on existing `public.properties` | `supabase/migrations/20250315000000_enable_pgvector_properties.sql`, `docs/embedding-data-model.md` |
| Rankable matches for demo queries | SQL function: cosine distance `<=>`, return `similarity` (higher = closer), best first, top-K 5 | `supabase/migrations/20250315000001_match_properties_function.sql` |
| Something a person can type into | POST `/api/properties/search` + page `/search` (display only; no client re-rank) | `src/routes/api/properties/search.ts`, `src/routes/search.tsx` |
| Sample set that can fail a keyword trap | 8 listings; **Lakefront lodge** omits `cabin` and `water` | `data/sample-properties.json` |
| Proof it works | Verification report (honest: ranking **not** observed live) | `docs/semantic-search-verification.md` |

## 3. Architectural decisions (from earlier docs)

- **What text is embedded:** `{title}` + blank line + `{description}`. Do not embed city, ids, status, or price (`docs/embedding-data-model.md`). Buyer queries are embedded as the query phrase itself (same model, same 1536 size).
- **Embedding dimensions:** **1536**. Locked in the data model, `EMBEDDING_DIMENSIONS`, and `vector(1536)`. Query and stored lists must match.
- **Distance / similarity metric:** pgvector cosine **distance** `<=>` (smaller = closer). SQL returns **`similarity = 1 - distance`** (higher = closer) and `ORDER BY p.embedding <=> query_embedding` so best matches come first (`docs/pgvector-setup-plan.md`, match_properties migration).
- **Top-K / match count:** default **5** (API allows 1–10).
- **Where embeddings are created:** **app-side TypeScript** (`generatePropertyEmbedding` in `src/lib/embeddings/generate.ts`). Generation is not a database built-in. Storage is the `embedding` column.
- **Null embeddings:** allowed only before backfill; those rows are skipped in `match_properties`.
- **Index:** none for this demo (tens of rows; sequential scan). IVFFlat/HNSW stayed out of the first migration (`docs/pgvector-setup-plan.md`).
- **Seed / backfill path:** `data/sample-properties.json` (8 rows) + `scripts/seed-property-embeddings.ts` (`npm run seed:embeddings`). Upsert by stable uuid. Needs `SEED_OWNER_ID` (existing `profiles.id`).
- **Default embedding model name in code:** `text-embedding-3-small` (must emit 1536). `EMBEDDING_API_KEY=mock` is **offline hashes**, not meaning; verification says do not use mock to prove ranking.

## 4. In scope vs out of scope (this tutorial)

**In scope (built for the demo slice)**

- Requirements brief, learner notes, data model, pgvector plan
- pgvector extension + `embedding` on `public.properties` (alter existing table; no second listings table)
- One generate path and one `match_properties` path
- Minimal API + React search page
- Sample JSON designed for the four requirements queries
- Verification notes and this handoff

**Out of scope (not claimed as done)**

- Production auth/RLS redesign, rate limits, multi-tenant search isolation
- Hybrid keyword + vector ranking
- Filters (price, beds, map, property type) combined with vectors
- Automatic re-embed on every property update in production
- Large eval sets / quality dashboards
- CI that calls a paid embedding API on every PR
- Maps, payments, messaging (`docs/semantic-search-requirements.md`)

Sponsor login already exists in the app; this slice did not rebuild it.

## 5. Demo limitations (be honest)

From `docs/semantic-search-verification.md` (2026-11-07):

- **No live ranking yet.** This environment had no `SUPABASE_URL` / service role / embedding key. Seed exited 1. Non-empty search POSTs returned **503** `Search is not configured…` and `results: []`. Empty query **400** worked.
- **Ready to demo? NO.** Blockers: apply migrations, seed 8 non-null embeddings with a **real** 1536-d model, then re-run query 1.
- Quality, when it runs, depends on **eight sample rows**. Odd order may be thin coverage, not a broken `<=>`.
- Ranking explainability is a score plus listing text, not a “why this matched” UI.
- No production latency, cost, or full-catalog claim.

## 6. How to re-run the demo (handoff checklist)

1. Apply migrations in order: `vector` extension → `embedding vector(1536)` on `public.properties` → `match_properties`.
2. Set env **names** only (values in local env / dashboard): `SUPABASE_URL` (or `VITE_SUPABASE_URL`), `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, `SEED_OWNER_ID`. Optional: `EMBEDDING_MODEL`. Never `VITE_` for secrets.
3. Run `npm run seed:embeddings`. Confirm eight rows with non-null `embedding`.
4. Start the app; open `/search`; try queries from `docs/semantic-search-requirements.md`.
5. Expect query 1 top neighbor **Lakefront lodge** (keyword trap). Farmland must not dominate queries 1–3.
6. Record real top-3 titles in `docs/semantic-search-verification.md` (replace the 503 rows).

## 7. Next actions for later Sprint 5 work

Concrete enough to pick up without a meeting:

1. **Finish the demo gate** — Configure env, apply migrations, seed, fill live top-3 rows in `docs/semantic-search-verification.md` until query 1 hits Lakefront lodge and farmland is not #1 for 1–3.
2. **Filters + vector search** — Add optional `status` / city (then price/beds if those columns are added) as SQL `WHERE` on `match_properties` **and** matching fields on POST `/api/properties/search`, keeping `ORDER BY embedding <=> query`.
3. **Hybrid search** — Add a documented mix of Postgres full-text (or `ILIKE`) with `similarity`; write how the two scores combine; do not hide it in the React page.
4. **Re-embed on update** — On title/description change, call `generatePropertyEmbedding` and update `embedding`; add an idempotent backfill for `embedding IS NULL`.
5. **Grow the evaluation set** — Expand `data/sample-properties.json` and a checked-in query list with expected ids (cabin trap, family, downtown, farmland control) for regression.
6. **CI** — Lint/typecheck helpers and parse sample JSON in CI; **do not** call the paid embedding API on every PR. Keep live seed/search manual or nightly.
7. **Observability** — Log truncated query, latency, and top similarity (no API keys) from the search API to debug bad rankings.

## 8. Open questions for mentor / next owner

- Keep **1536** / `text-embedding-3-small`, or change model and rewrite every stored vector in one pass?
- Stay on cosine `<=>` + `similarity = 1 - distance` app-wide?
- Who owns embedding cost and key rotation (`EMBEDDING_API_KEY`)?
- Is `/search` a public demo or behind existing sponsor login? (Requirements: no new auth system.)
- First filter set for the next stakeholder demo (city vs price vs beds)?

## 9. Sources used for this handoff

- `docs/semantic-search-requirements.md`
- `docs/embedding-data-model.md`
- `docs/pgvector-setup-plan.md`
- `docs/semantic-search-verification.md`
