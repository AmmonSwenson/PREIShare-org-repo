# PREIshare semantic search — requirements brief

**Project:** PREIshare dashboard  
**Audience:** Buyers/investors, PREIshare operators, and whoever implements the next tutorial steps  
**Status date:** 2026-11-07 (America/Denver)  
**This file is a contract.** Later migrations, embedding helpers, and the search page must be checkable against the example queries and success criteria below. No schema, APIs, or UI components are specified here.

## Problem (one paragraph)

PREIshare buyers and investors discover real-estate listings by describing **lifestyle and investment intent** in everyday language—not by reciting listing titles. Keyword search only matches exact words in listing text. A query such as “quiet cabin near water with good rental upside” misses a strong lakeside short-stay property whose description says “lakefront lodge, peaceful, strong weekend occupancy” because `cabin`, `water`, and `rental upside` never appear together. This tutorial adds a **small semantic search slice**: turn sample property descriptions into meaning-aware vectors, store them in Supabase PostgreSQL with pgvector, and rank those samples by similarity to the query. It is a demo on sample data, not a production search product.

## Actors

| Actor | Goal |
| --- | --- |
| Property buyer / investor | Type intent in everyday English and see listings that match **meaning**, not only exact phrases |
| PREIshare operator (us) | Demo trustworthy semantic matches on a small sample set and hand off cleanly |
| Coding agent (assistant) | Produce migrations, embedding helpers, and UI **only** inside the in-scope list |

Admin consoles, sponsor login, and public marketplaces are **not** actors this slice must serve (sponsor auth already exists in the app; this tutorial does not extend it).

## Example queries (must drive later tests)

For each query: what a **good** top result looks like in plain language, and why **keyword-only** search would fail. A tester should be able to mark pass/fail without asking what “relevant” means.

1. **“quiet cabin near water with good rental upside”**  
   - **Good top result:** A peaceful waterfront or lakeside stay whose copy talks about occupancy, weekend demand, or short-stay income—even if the listing never uses `cabin`, `water`, or `upside`.  
   - **Keyword search fails because:** the query tokens may be absent; synonyms (`lakefront`, `lodge`, `occupancy`) do not match.

2. **“family-friendly home close to good schools”**  
   - **Good top result:** A residential listing that mentions children, neighborhoods, or school proximity—even if `family-friendly` and `schools` are missing as exact strings.  
   - **Keyword search fails because:** it looks for the phrase `good schools` instead of related meaning (`elementary`, `kids`, `quiet street`).

3. **“downtown condo walkable to restaurants”**  
   - **Good top result:** An urban condo/loft whose description emphasizes walkability, dining, or a city core—even if `walkable` and `restaurants` never appear.  
   - **Keyword search fails because:** `downtown` + `condo` may miss “center-city loft steps from cafes.”

4. **Near-miss control: “large agricultural acreage for row crops”**  
   - **Good outcome:** This query must **not** dominate the ranked list when the sample set is cabins, condos, and family homes. Farmland (if present at all) may appear, but it should not crowd out the lifestyle/investment samples for queries 1–3.  
   - **Why it is here:** a tester can fail the demo if every query returns the same industrial/farm listing first.

Later seed data must include at least one listing that is a **meaning match** for query 1 **without** containing the words `cabin` and `water` both in the text.

## Success criteria (observable)

A stranger can mark each box pass/fail after a demo. “Feels smart” is not a criterion.

- [ ] A small **sample** set of properties exists, each with description text **and** a stored embedding vector.
- [ ] Typing a natural-language query returns a **ranked list** (best similarity first), not an unordered dump and not a keyword-only filter.
- [ ] **Demo query 1** returns a relevant waterfront/quiet-stay listing **even when** the listing text omits at least one of: `cabin`, `water`, `rental`.
- [ ] A beginner can point at that listing and say: “Keyword search would miss this because [missing words].”
- [ ] **Control query 4** does not put farmland/acreage in the #1 slot for queries 1–3 when those samples are cabins/condos/homes.
- [ ] The search page and helpers stay inside **in-scope** (no maps, payments, new auth, or production embedding ops).
- [ ] Distance metric and embedding size used at query time are the **same** ones used when vectors were stored (exact numbers are decided later; inconsistency is a fail).

## In scope for this tutorial

- Plain-language understanding of embeddings and vector similarity (later teaching steps)
- Data model for properties + embedding vectors suitable for Supabase + pgvector (design step—not this file)
- Migration to enable pgvector and store vectors
- TypeScript helper to generate embeddings for property text
- Seed/backfill path for a **small** sample set (enough to exercise the four queries)
- Similarity search SQL + TypeScript helper
- Minimal API route and simple React search page in TanStack Start
- End-to-end verification notes and a handoff doc

## Out of scope (explicit non-goals)

- Production embedding provider billing, rate-limit operations, or batch jobs at scale
- Map search, price/beds/baths filters, payments, messaging
- **New** auth, RLS redesign, or sponsor-invite work (existing login stays; this slice does not rebuild it)
- Advanced ranking (personalization, business-rule boosts, hybrid keyword+vector tuning beyond a basic demo)
- Perfect visual polish, native mobile apps, or a public consumer marketplace
- Inventing listing statuses or property types outside the closed lists already in the product
- Locking embedding **provider, dimension, or distance metric** in this brief (those are open questions for the data-model step)

## Assumptions and open questions

**Assumptions**

- Free-tier (or equivalent) Supabase is enough for the sample set.
- Sample listings are demo data for this tutorial, not a promise to embed every live sponsor listing on day one.
- One embedding model and one vector size will be chosen later and must stay consistent for insert and search.

**Open questions (resolve in the data-model / implementation steps, not here)**

- Which embedding provider and model (local vs hosted)?
- Vector dimension?
- Distance metric (for example cosine vs L2) and index type?
- How many sample listings (enough for the four queries; keep it small)?
- Whether search is a public demo page or sits behind existing sponsor login—**this brief does not require a new auth system**.

## Handoff note for later steps

Every implementation step should be checkable against the **example queries** and **success criteria** above. If a prompt would add maps, payments, production pipelines, or a second schema that this brief did not ask for, cut it. Do not invent column names or embedding dimensions in this file; later design steps own those decisions and must stay consistent end-to-end.
