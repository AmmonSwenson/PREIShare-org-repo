# PREIshare embedding data model

## Purpose

Software-ready design for property listings and their embedding vectors.

This doc is the contract for pgvector migrations, TypeScript types, seed/backfill, and similarity search.

It is **not SQL** and not application code yet. Later steps must follow this file instead of inventing a second listings table or a second vector size.

## Sources

- `docs/semantic-search-requirements.md` — actors, example queries, in/out of scope, success criteria
- `docs/embeddings-learner-notes.md` — generation vs storage; meaning as a number-list
- `docs/vector-search-learner-notes.md` — query embedding vs stored embeddings; top-K; distance vs similarity
- `docs/data-model-and-rls-matrix.md` — existing `public.properties` columns (this slice **adds** an embedding; it does not rebuild auth)

## Overview

Each **property** is one investment listing PREIshare can show in search.

Each property has normal text fields humans read, plus one **embedding** column: a fixed-length list of numbers that captures the meaning of selected listing text.

Search will compare a **query embedding** to these **stored** vectors (similarity ranking)—not only exact keyword matches. That is the ranking model in `docs/vector-search-learner-notes.md`.

This tutorial slice **extends** the existing `public.properties` table (sponsor dashboard listings). It does **not** create a parallel properties table and does **not** redesign RLS.

## Identifiers

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| id | UUID | yes | Primary key; unique per listing. Already on `public.properties`. |

One row = one property = **one embedding** for this tutorial.

## Core listing fields (this tutorial slice)

Human-readable fields. These stay as **text/scalars**. They are not the vector.

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| title | text | yes | Short headline. Part of the embedding input. Shown on result cards. |
| description | text | yes **for searchable rows** | Longer write-up; main meaning source. Existing table may still allow empty description on drafts; a row is **not** eligible for semantic search until description is non-empty and an embedding exists. |
| city | text | no | Optional display (already on the table). **Not** part of the embedding recipe. Not a search filter in this slice (maps/price/beds filters are out of scope). |
| created_at | timestamp | yes | When the row was inserted. Not embedded. |

### Already on the table — do not redesign in this slice

These exist from sponsor auth / listings work. This embedding contract **leaves them as-is**. Do not invent new statuses or a second owner model.

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| owner_id | UUID | yes (existing) | Sponsor owner. This slice does **not** add auth tables or change RLS. |
| status | text (closed list) | yes (existing) | `draft` \| `published` \| `under_offer` \| `sold` \| `archived` only. Not embedded. |
| updated_at | timestamp | yes (existing) | Touch on change. Not embedded. |

**Do not add in this model:** `price` as a required column, beds/baths, photos, or keyword-index columns. Requirements explicitly keep price/beds filters out of this tutorial. If another listings table already has `price`, do not copy it here just for embeddings.

## What text is embedded

**Embedding input (canonical string):** concatenate `title` and `description` with a blank line between them:

```
{title}

{description}
```

Rules:

- Always build listing embeddings **and** (when we re-embed) from this same recipe. If later code embeds only `title`, that is a fail against this contract.
- Do **not** embed `id`, `owner_id`, `city`, `status`, timestamps, or price-like numbers as if they were narrative meaning.
- Buyer **queries** are embedded as the query text itself, using the **same model and same DIMENSION_TODO** as listings (`docs/vector-search-learner-notes.md`).
- Store the **raw** `title` and `description` unchanged. The vector is a **separate** column derived from them so we can re-embed later without losing the listing.

Example (requirements query 1 meaning-match, different words):

- title: `Lakefront lodge`
- description: `Peaceful stay with strong weekend occupancy.`
- embedding input: those two strings joined as above — **not** the buyer phrase `quiet cabin near water with good rental upside`.

## Embedding column

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| embedding | vector(DIMENSION_TODO) | yes after backfill | Fixed dimension. Same size for every property row and every query vector. |

Logical type name: **vector(DIMENSION_TODO)**. That is the only size this doc uses.

### Dimension placeholder

- Use **DIMENSION_TODO** everywhere the vector size appears in this contract, the later migration, and TypeScript types until a model is chosen.
- A number such as 1536 sometimes appears in vendor docs. **We have not chosen a model.** Do not treat 1536 as our size. When a later step picks a model, replace **DIMENSION_TODO** in one pass (this doc, migration, types).
- **Critical:** query vectors and stored vectors must use the **same model and same DIMENSION_TODO**. Mismatched sizes break insert or search. Mixed models in one column are a fail (`docs/embeddings-learner-notes.md`, requirements success criteria).

### Nullability and backfill

- `embedding` may be null **only** as a temporary state: listing text exists, generate step has not run yet (insert-then-embed).
- After seed/backfill, every property that should appear in semantic search **must** have a non-null embedding **and** non-empty `title` + `description`.
- A null embedding means **not searchable** by vector ranking. Do not pretend keyword `ILIKE` is a fallback in this slice.
- Intended lifecycle: **create listing text → generate embedding (app/code) → store vector on the same row → eligible for semantic search.**

That split is generation vs storage from `docs/embeddings-learner-notes.md`. This model does not collapse them into one step.

## Separation of concerns

| Concern | Where it lives |
|---------|----------------|
| Human-readable listing | `title`, `description`, `city`, and other scalar columns |
| Meaning for search | `embedding` vector column only |
| Similarity metric | Decided at query time. Reminder from vector-search notes: know whether SQL returns **distance** (lower better) or **similarity** (higher better). Planned style to try first: **cosine similarity** (name only; SQL operator is a later step). |
| Top-K | Query/API concern, not a column. First try **K = 5**. |
| Auth / RLS | Existing `owner_id` policies. Not redesigned here. |

Do not replace `description` with the vector. You need both: text for the UI (id, title/snippet, score), vector for ranking.

## In scope vs out of scope (data model)

**In scope**

- One `properties` table (the existing one) with id, listing fields, and **one** `embedding` column
- One embedding per property for this tutorial
- Clear embedding input recipe (`title` + blank line + `description`) and a single **DIMENSION_TODO**
- Seed/backfill path for a small sample set that can exercise the four requirements queries (cabin/water/rental, family/schools, downtown/walkable, farmland control)

**Out of scope (do not model yet)**

- A second listings table or a second embedding column
- Multiple embedding versions per property
- New user-account, saved-search, or permission tables (existing login stays; no RLS redesign)
- Photos, payments, messaging
- Map search; price / beds / baths **filters**
- Full-text keyword indexes as a replacement for vectors
- Production model keys, rate limits, or batch job infrastructure
- Locking a vendor name or a numeric dimension in this file (that is **DIMENSION_TODO** plus an open question)

## Consistency checklist (must pass before migration)

- [x] Every field has a clear purpose tied to requirements (searchable meaning vs display vs existing owner/status)
- [x] Primary key defined (`id`)
- [x] Embedding input text recipe is explicit (`title` + `\n\n` + `description`)
- [x] Single dimension placeholder used consistently (**DIMENSION_TODO** only)
- [x] Raw text and vector are separate
- [x] Null rules for embedding are stated (temporary null; required after backfill for search)
- [x] Out-of-scope items are listed so the agent does not invent them later
- [x] Query and stored vectors must share the same model and **DIMENSION_TODO**

## Open questions

Resolve in the pgvector plan / implementation steps, then update **DIMENSION_TODO** in one pass:

- Exact embedding **model name** and final dimension (replace DIMENSION_TODO everywhere)
- Final similarity operator / distance metric in SQL (align with `docs/vector-search-learner-notes.md`; cosine is the reminder, not a locked operator yet)
- Index type for pgvector (later plan)
- Whether demo seed rows live as published sample listings on `public.properties` or a tiny dedicated seed set — still **one** table, not a new product surface
- Default K for the first API (notes propose 5)
- Whether the first search page is public demo or behind existing sponsor login — **no new auth system**

## Handoff

Next: plan Supabase pgvector enablement and migration order using this doc as the schema contract (`docs/pgvector-setup-plan.md`).

The migration must: enable pgvector, add `embedding vector(DIMENSION_TODO)` to `public.properties`, and not invent photos, payments, or a second properties table.
