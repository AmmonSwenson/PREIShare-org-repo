# Embeddings learner notes (PREIshare)

These notes are how I will review later agent code. They are not app code, not a schema, and not a vendor choice. I wrote them after the requirements brief in `docs/semantic-search-requirements.md`.

## Plain-language definition

An embedding is a **list of numbers** that stands for the *meaning* of a piece of text. For PREIshare that text is usually a property description or a buyer’s search phrase.

It is **not** a keyword index. It does not store the original sentence as text inside the list. You cannot read the numbers and recover the words “lakefront” or “Airbnb.” The only useful fact about the list is: **similar meanings produce similar number patterns.**

My own sentence before looking anything up: *An embedding turns property text into a list of numbers so that similar meanings sit close together.*

## Tiny intuition (not real model output)

Imagine a toy 3-number list just to picture “near” vs “far.” These numbers are made up. Real embeddings are hundreds or thousands of numbers long. The idea is the same.

| Text | Toy list | Relative to the cabin |
| --- | --- | --- |
| “lakefront cabin, quiet, strong Airbnb history” | `[0.9, 0.8, 0.1]` | starting point |
| “waterfront cottage, peaceful, good short-term rental” | `[0.88, 0.82, 0.12]` | nearby (same ideas, different words) |
| “downtown loft near nightlife and offices” | `[0.1, 0.2, 0.95]` | far (city energy, not a quiet stay) |

A buyer who types “quiet place with rental upside” should land nearer the first two lists than the loft, even if none of those three texts share the exact query words.

One number in the list is **not** a human-readable score (“how lakefront is this?”). Closeness is about the **whole** list lining up with another whole list. How we turn that closeness into a ranked search result is **Step 3**, not this file.

## PREIshare examples from our requirements

Pulled from `docs/semantic-search-requirements.md` so later tests and these notes talk about the same story.

- **Buyer query I care about:** “quiet cabin near water with good rental upside”
- **Listing A (should feel close to the query):** “lakefront lodge, peaceful, strong weekend occupancy”
- **Listing B (should feel far):** “large agricultural acreage for row crops” (the near-miss control in the brief)
- **Why A is closer in meaning than B (in my words):** Listing A is a calm stay by water that can make short-stay income. The buyer asked for quiet + water + rental upside. Listing B is farmland for growing crops. That is a different job. Keyword search can miss A because `cabin`, `water`, and `upside` never appear—A says `lakefront`, `lodge`, `occupancy` instead. An embedding should still put A near the query and B far away.

A second pair I will use when I read TypeScript later:

- Close pair: “peaceful lakefront cabin with strong short-term rental history” vs “quiet waterfront cottage, great Airbnb returns”
- Far contrast: “center-city loft steps from cafes and night life” (this one belongs with the downtown-condo query, not with the cabin query)

If later seed data puts farmland first for the cabin query, that is a fail—even if some numbers got generated.

## Generation vs storage (do not mix these up)

Two places. Mixing them up is the mistake I expect to see in later PRs.

| Stage | What happens | Where |
| --- | --- | --- |
| **Generation** | Text goes into an embedding model or API. A number-list comes back. Nothing is “in the database” yet. | App/code side (later: a TypeScript helper) |
| **Storage** | That number-list is saved next to the property so search can compare later. | Database (later: Supabase PostgreSQL with pgvector) |

Search will later:

1. **Generate** an embedding for the buyer’s query (same kind of model/list length as the listings).
2. **Compare** that query list to the **stored** property lists.
3. **Rank** the properties (Step 3). This notes file does not solve ranking.

Picture on paper: **Text → Model → Numbers → Database.** Left of the last arrow is generation. The last arrow is storage.

If an agent writes “create embedding” and I only see an `INSERT` with no model/API call, they skipped generation. If they call the model and never save the list, search has nothing to compare against.

## Misconceptions to watch for when reviewing agent code later

- Thinking the vector stores the original sentence as text, or that I can print the numbers and read the listing back.
- Assuming two listings must share the same words (`cabin`, `water`) to be “close.” Meaning can match through `lakefront` / `lodge` / `occupancy`.
- Forgetting every embedding from the **same** model must use the **same list length** (dimensions). Mixing lengths, or embedding the query with a different model than the listings, is a fail. The requirements brief already says this is a fail even before we pick a number.
- Mixing up **create embedding** (generation) with **INSERT into the database** (storage).
- Believing a higher or lower single number in the list is a score a human can interpret on its own.
- Treating embeddings as a fancy keyword list (“does this vector contain water?”).
- Claiming search is done once numbers exist. Generation + storage is not ranking. Closeness → ordered results is Step 3.
- Picking a vendor or dimension count in this step. We have not chosen those yet.

## What I can explain to a teammate in 60 seconds

PREIshare buyers type intent, like “quiet cabin near water with good rental upside.” Keyword search only looks for those exact words, so a listing that says “lakefront lodge, peaceful, strong weekend occupancy” can vanish. An embedding is a long list of numbers that stands for meaning, not for the words themselves. A quiet waterfront rental and a waterfront cottage with Airbnb returns should get number-lists that sit near each other. A downtown loft, and farmland for row crops, should sit farther away. Creating those numbers happens outside the database, in a model or API. Saving them next to the property happens in Postgres with pgvector. At search time we embed the buyer’s phrase the same way and compare it to the saved lists. We have not yet defined how “close” becomes a ranked page—that is the next step.

## Open questions before similarity ranking (Step 3)

These stay unanswered here on purpose.

- How do we turn “closeness” of two number-lists into an **ordered** list of properties (best match first)?
- What happens if two different embedding models (or two different list lengths) are mixed in one table?
- Which distance idea we will use, and how a beginner should check it without treating it as a magic score.
- How many sample listings we need so the cabin query, the loft query, and the farmland control can actually fail a demo.
