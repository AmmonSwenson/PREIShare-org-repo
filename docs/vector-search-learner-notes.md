# Vector search learner notes (PREIshare)

These notes pick up where `docs/embeddings-learner-notes.md` stopped. An embedding is a list of numbers for meaning. This file is about **what happens after** we have a query list and many stored property lists: compare, score, rank, keep the best few. Not SQL. Not a schema. A checklist I will use on a later `match_properties`-style helper.

My messy answer before a tutor: *The system compares the query’s number-list to each property’s saved number-list. Best match means the property whose list sits nearest the query’s list on that meaning map—not the listing that repeats the buyer’s words.*

## 1. My plain-language definition

Vector similarity ranking means: turn the buyer’s query into an embedding **the same way listings were embedded**, compare that list of numbers to each **stored** property embedding, score how close the meanings are, and return the closest properties first.

“Nearest neighbors” is just a name for those closest listings. **Top-K** means we only keep K of them (I want to try **K = 5** so a first page is not the whole table).

## 2. How a search runs (steps I can explain)

1. Buyer types a natural-language query (from `docs/semantic-search-requirements.md`).
2. System creates a **query embedding** with the **same** embedding approach used for listings (same model, same list length). Generation happens in app/code, as in the embeddings notes.
3. System compares the query embedding to **stored property embeddings** (the lists already saved in the database). It does not re-read listing text as keywords for this score.
4. Each property gets a **distance or similarity score**.
5. Results are **ranked** best-first and cut to **top-K** (example: K = 5).

```text
[Buyer query text]
        |
        v
[Query embedding] ----compare----> [Property embeddings in database]
        |
        v
[Scores] -> [Sort best-first] -> [Top-K listings shown]
```

I will check which kind of score later SQL reports **before** I trust `ORDER BY`:

- **Distance:** smaller usually means closer / better.
- **Similarity:** larger usually means closer / better.

Sorting the wrong way is a fail even if rows come back.

## 3. Keyword search vs vector search (same query)

**Example query (from the requirements brief):** quiet cabin near water with good rental upside

| Approach | What it looks for | Likely miss |
| --- | --- | --- |
| Keyword | Exact words like `cabin`, `water`, `rental` | Listing that says “lakefront lodge, peaceful, strong weekend occupancy” |
| Vector / semantic | Nearby meaning even when words differ | Still can miss if the listing text is empty, misleading, or was **never embedded** |

**My takeaway:** PREIshare buyers describe *intent*. Listings use `lakefront`, `lodge`, `occupancy` instead of the buyer’s tokens. Keyword search asks “is this word in the text?” Vector search asks “is the meaning nearby?” We need ranking by meaning, not a smarter `ILIKE`.

## 4. Worked ranking examples (no real math required)

I am practicing judgment, not computing real vectors.

### Example A — clear winner

**Query:** “family-friendly home near good schools” (requirements query 2)

| Listing blurb (short) | Expected rank | Why |
| --- | --- | --- |
| “4BR near top-rated elementary, quiet cul-de-sac, yard for kids” | 1 (best) | Same intent: family + schools, even if the query said `family-friendly` and `good schools` |
| “2BR downtown loft, nightlife, walk to offices” | lower | Different lifestyle (belongs with the downtown-condo query, not this one) |
| “Industrial warehouse, high ceilings, loading dock” | lowest | Unrelated meaning |
| “Large agricultural acreage for row crops” | must not win | Requirements control: farmland must not dominate family/cabin/condo queries |

Keyword search can miss the winner if it never says `family-friendly` or `schools` and instead says `elementary` / `kids`. Vector ranking should still put it first.

### Example B — different words, same intent

**Query:** “cabin by the lake” (shorter cousin of requirements query 1)

- **Strong match listing:** “rustic woodland retreat on the water with dock”
- **Why vector should win:** small getaway + water. Same intent as a cabin by a lake. Words are `retreat`, `water`, `dock`—not `cabin` or `lake`.
- **Why keyword may fail:** few or no shared exact tokens.
- **Unrelated distractor:** “center-city loft steps from cafes and night life” should rank below the retreat for this query.

This is the case the requirements brief cares about: a meaning match **without** `cabin` and `water` both in the listing text.

## 5. Top-K and scores (what I will check later)

- **Top-K:** only return K nearest neighbors. Default I want to try: **K = 5**. A UI should not dump every sample row.
- **Distance score:** smaller usually means closer / more similar.
- **Similarity score:** larger usually means closer / more similar.
- I must know which kind of score our later SQL returns so I do not sort the wrong way. I will not assume “bigger is better” until I read the function.
- A score alone is not enough later in the UI. I still want **property id**, a **title or short snippet**, and the **score** for debugging (“why did this hit appear?”).
- Farmland (requirements query 4) may appear in a full table scan; it should **not** sit in the top slots for queries 1–3 when samples are cabins, condos, and family homes.

## 6. What good ranking is *not*

- Not alphabetical order of titles
- Not “newest listing first” unless we add that as a separate product rule later
- Not filtering only with SQL `ILIKE` / keyword match and calling it semantic
- Not comparing embeddings built with **different models or list lengths** (apples to oranges—already a fail in the requirements success criteria)
- Not claiming search is done because embeddings were generated. Generation + storage is not ranking. This file is the ranking bar.
- Not production schema or a finished API. Later steps write the SQL.

## 7. Assessment questions for a future match_properties-style function

I will reject agent output later unless I can answer **YES** to these. “Does it return rows?” is not enough.

1. Does the function take a **query embedding**, or clearly take query text and embed it with the **same method and list length** as listings?
2. Does it compare that vector to the **stored property embedding column**, not to raw description text alone?
3. Does it **order** results so the best semantic matches come first (correct direction for distance vs similarity—I will check which one SQL uses)?
4. Does it support **top-K** (a limit on how many neighbors return; first try K = 5)?
5. Does each row include enough fields to explain the hit (at least property id, a human-readable label/snippet, and the score)?
6. Does it avoid silently mixing different embedding sizes/models?
7. If sample data includes an intentional semantic match with different wording (query 1 vs “lakefront lodge, peaceful, strong weekend occupancy”), does that row rank **above** an unrelated keyword-only distractor and above farmland?
8. Does it stay inside the requirements **out of scope** list (no maps, payments, new auth, or production embedding ops)?

## 8. Link back to requirements

Relevant example queries from `docs/semantic-search-requirements.md`:

1. “quiet cabin near water with good rental upside”
2. “family-friendly home close to good schools”
3. “downtown condo walkable to restaurants”
4. Control: “large agricultural acreage for row crops” (must not dominate 1–3)

Success criteria this ranking model supports (from that brief):

- A similarity search returns a **ranked list** (best match first), not an unordered dump and not a keyword-only filter.
- Demo query 1 returns a relevant waterfront/quiet-stay listing **even when** the listing omits at least one of: `cabin`, `water`, `rental`.
- Control query 4 does not put farmland in the #1 slot for queries 1–3 when those samples are cabins/condos/homes.
- Distance metric and embedding size used at **query time** are the **same** ones used when vectors were stored.

From `docs/embeddings-learner-notes.md`: generation creates the number-list outside the database; storage saves it. Ranking **uses** those stored lists. It does not replace generation or storage.

## 9. Open questions for later steps

- Which distance metric will Supabase/pgvector use in our migration (name only for now; I will then know if lower or higher is better)?
- What default K should the first API use? (I am proposing 5 until we pick.)
- What minimum fields should the first UI show next to each ranked hit? (I want id, snippet, score.)
- Exact embedding provider and dimension stay deferred, as in the requirements brief—ranking must stay consistent with whatever we pick.
