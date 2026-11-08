# Semantic search verification report (PREIshare)

## Scope checked
- Requirements source: `docs/semantic-search-requirements.md`
- UI: `src/routes/search.tsx`
- API: `src/routes/api/properties/search.ts`
- Search helper: `src/lib/property-search.ts`
- Seed inputs: `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`

## Environment
- Date tested: 2026-11-07 (America/Denver)
- Supabase project (name or ref only, no secrets): **none in this environment** (no `.env`, no `SUPABASE_URL`)
- App run method: local TanStack Start / Vite (`npm run dev -- --port 3847 --host 127.0.0.1`)
- Embedding model / dimension expected: `text-embedding-3-small` (default) / **1536**, matching `docs/embedding-data-model.md` and `vector(1536)`

These HTTP checks were actually run. Ranked titles were **not** invented.

## Data checks
| Check | Result | Notes |
| --- | --- | --- |
| Sample properties present | PARTIAL | **8** listings in `data/sample-properties.json`. **0** rows proven in Supabase (no project URL/key). |
| Embeddings non-null for all samples | FAIL | Could not query `properties.embedding`. Null count: **unknown**. Seed never ran here. |
| Seed script re-runnable without breaking search | FAIL (blocked) | `npx tsx scripts/seed-property-embeddings.ts` exited **1**: `Missing SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY.` |

Expected neighbors (from seed JSON, **not** live ranking):

- Query 1 (“quiet cabin near water…”): **Lakefront lodge** (no words `cabin` or `water` in title+description) then woodland shore retreat. Farmland/warehouse/nightlife loft should not win.
- Query 2 (family/schools): **Four-bedroom house on a quiet cul-de-sac** (`elementary`, `kids` — not the phrase `good schools`).
- Query 3 (downtown/walkable): **Center-city loft steps from cafes**.
- Control query 4: **Large agricultural acreage for row crops** may match itself; it must not be #1 for queries 1–3.

## Query results (semantic)
| # | Query | Top 3 results (title or id) | Sensible neighbors? | Notes |
| --- | --- | --- | --- | --- |
| 1 | quiet cabin near water with good rental upside | *(none)* | NO | `POST /api/properties/search` → **503** `{ error: "Search is not configured (missing embedding or Supabase server env).", results: [] }` after the refine below. Before refine: **500** `"Search failed"`. |
| 2 | family-friendly home close to good schools | *(none)* | NO | Same **503**, empty `results`. |
| 3 | downtown condo walkable to restaurants | *(none)* | NO | Same **503**, empty `results`. |
| 4 | large agricultural acreage for row crops | *(none)* | NO | Control query also **503**; farmland #1 cannot be judged. |

`GET /search` returned **200** and the page HTML includes “Find listings by intent” and the cabin placeholder. The UI can render; it cannot show ranked neighbors without a configured backend.

## Keyword-trap check
- Trap query (paraphrase, not exact listing text): **peaceful lodge with weekend occupancy**
- Expected kind of property: Lakefront lodge (meaning match; listing never uses `cabin` or `water`)
- Actual top results: *(none)* — same **503** / empty array
- Did semantic search beat exact-keyword matching? **NO** (not demonstrated)
- Evidence (one sentence): The trap request never returned ranked JSON, so we could not show a lodge beating a keyword-only miss; seed text *would* support that demo once embeddings are stored.

Local text check (not ranking): sample **Lakefront lodge** has `cabin=false` and `\bwater\b=false` in title+description, which is the intended trap once search runs.

## Safety / edge cases
| Case | Expected | Actual | PASS / FAIL |
| --- | --- | --- | --- |
| Empty query | Clear error or empty list, no crash | `POST {"query":""}` and whitespace → **400** `{ error: "Query is required", results: [] }` | PASS |
| Nonsense tokens | Low similarity or empty, no crash | `zzzzxyqq 12qwaszx` → **503** configured-missing, empty results, no crash | PARTIAL (safe fail; no ranking) |
| Very short query | Stable response | `loft` → **503**, empty results, no crash | PARTIAL (stable error, not a ranked list) |

## Refine cycle (required)
- Failing or weak example (query + bad ranking or error): Query **quiet cabin near water with good rental upside** returned **HTTP 500** `{ error: "Search failed", results: [] }` with no hint whether ranking, seed, or env failed.
- Suspected layer (seed data / embedding text / SQL distance / helper / API / UI): **API error mapping + missing environment** (not inverted `<=>`). Helper throws `MISSING_API_KEY` / missing `SUPABASE_URL` before RPC.
- Change made (files touched): `src/routes/api/properties/search.ts` — map those configuration errors to **503** `{ error: "Search is not configured (missing embedding or Supabase server env).", results: [] }` instead of a generic 500. No ranking “boost.”
- Re-test result: Same cabin query now **503** with that message; empty query still **400**. Still **no** ranked titles (env still unset). Considered embedding only `title` vs title+description: **rejected** (data model requires `{title}\n\n{description}`).
- Keep or revert decision: **Keep** the 503 mapping. Rejected hybrid keyword+vector and mock-hash ranking as they would fake semantic value.

## Requirements traceability
| Requirement / success criterion | Met? | Evidence |
| --- | --- | --- |
| Sample properties exist with description text **and** stored embedding vectors | NO | 8 JSON samples; 0 proven DB rows / vectors |
| Natural-language query returns a ranked list (best similarity first) | NO | All non-empty POSTs returned empty `results` (503) |
| Demo query 1 returns a waterfront/quiet-stay listing even when `cabin`/`water`/`rental` are missing from listing text | NO | No live top hit. Seed **Lakefront lodge** is designed for this (no `cabin`/`water` in text) |
| A beginner can explain why keyword search would fail on that query | PARTIAL | Can explain from seed copy; cannot point at a live result card |
| Control query 4 does not put farmland #1 for queries 1–3 | NO | Ranking not observed |
| In-scope vs out-of-scope (no maps, payments, new auth, production embedding ops) | YES | Search page/API call helper only; no new filters/auth/maps |
| Query-time embedding size matches stored vectors (1536) | PARTIAL | Code and migration agree on **1536**; not proven at runtime |
| Empty query fails safely | YES | API 400; UI copy asks for a description |

## Remaining limitations (honest handoff)
- What this tutorial slice does **not** do yet: maps, price/beds filters, production embedding jobs, hybrid keyword+vector, public marketplace, or a live seeded Supabase in this agent VM.
- Known ranking weaknesses on the sample set: **untested live**. If `EMBEDDING_API_KEY=mock` is used to seed, vectors are hash-based and **will not** prove meaning-nearness—use a real 1536-d model.
- Follow-ups for the next topic: set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, `SEED_OWNER_ID`; apply pgvector + `match_properties` migrations; run `npm run seed:embeddings`; re-run this table on `/search` and record real top-3 titles.

## Sign-off
- Verified by: Cursor Agent, 2026-11-07 (America/Denver), from HTTP against local `/search` and `/api/properties/search`
- Ready to demo to a stakeholder? **NO**
- Blockers before demo: Supabase project + migrations applied, non-null embeddings on the 8 samples, real embedding provider (not `mock`) so query 1 can show Lakefront lodge without the words `cabin`/`water`
