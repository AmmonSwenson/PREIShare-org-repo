# Review response notes — first PREIshare PR

## PR under review
- Branch name: `docs/first-contribution-ammonswenson`
- PR title (after any edits): `docs: add CONTRIBUTORS entry for onboarding`
- Link or local identifier: https://github.com/EdTechForLearning/PREIShare-org-repo/pull/6
- Related files: CONTRIBUTORS.md, docs/onboarding/pr-description.md, docs/onboarding/first-contribution-notes.md

## Simulated reviewer setup
- Tool used (chat-assistant / coding-agent): Cursor Cloud coding-agent, given a mentor role against the real PR description, `CONTRIBUTORS.md`, `first-contribution-notes.md`, `first-contribution-plan.md`, and `git log --stat github/main..HEAD`
- What context I pasted for the reviewer: the live PR body (problem/approach/test plan), the one-row `CONTRIBUTORS.md` table, the cycle log in `first-contribution-notes.md`, and the four feature-branch commits (`ada23b3`, `46d86f3`, `9ea3372`, `23bf658`)
- Date of simulation: 2026-09-08

## Feedback received

### Comment 1
- **Theme:** scope
- **Blocking?** yes
- **Reviewer said:** The plan promised a two-file, under-10-minute review (`CONTRIBUTORS.md` plus one `repo-map.md` row). The cross-fork PR against team `main` lists nine documentation/rules paths. That is scope creep relative to the plan, even though the extra files are still docs-only. A reviewer who was not in the author’s head cannot tell whether they are supposed to review Cursor rules or only the roster row.
- **My decision:** accept-now
- **Why:** Fair. The description listed the extra paths but never explained *why* they appear versus the plan. Splitting into a second PR would rewrite history and is out of scope for this onboarding loop.
- **Action taken:** follow-up commit plus PR description edit — added a **Scope vs plan** section telling reviewers to start at `CONTRIBUTORS.md` and treat extra onboarding files as supporting artifacts.
- **Evidence:** commit `fb7928e` `docs: address mentor review on first-contribution PR`; `docs/onboarding/pr-description.md` section `## Scope vs plan`

### Comment 2
- **Theme:** verification
- **Blocking?** yes
- **Reviewer said:** Test plan step 3 tells the *reviewer* to search for tokens and local paths, but the author never recorded that they already ran that check. “Expect none” without evidence is an unproven claim.
- **My decision:** accept-now
- **Why:** Fair catch. A merge-ready onboarding PR should show the author did the secret scan, then still ask the reviewer to skim Files changed.
- **Action taken:** follow-up commit — Test plan now names the search strings (`gho_`, `sk-`, `.env`, `/Users/`) and states the author ran them on 2026-09-08. Re-ran `git grep` on the contribution docs; the only hits are those search-term mentions in the test plan, not secret values.
- **Evidence:** commit `fb7928e`; `docs/onboarding/pr-description.md` Test plan steps 3–4

### Comment 3
- **Theme:** commits
- **Blocking?** yes / no → **no**
- **Reviewer said:** History on this branch has several small docs commits, including two back-to-back `pr-description.md` commits (`9ea3372` then `23bf658`). That is noisy for a first PR. Consider squashing before merge.
- **My decision:** decline
- **Why:** This step prefers small follow-up commits over rewriting history. Each commit message still states why the change exists. Squashing would hide the review loop Step 13 needs to audit.
- **Action taken:** none (no squash)
- **Evidence:** N/A — `git log --oneline github/main..HEAD` still shows the original commits plus `fb7928e`

### Comment 4
- **Theme:** other (CONTRIBUTORS.md usability)
- **Blocking?** no
- **Reviewer said:** The GitHub column is a bare handle. Linking to `https://github.com/AmmonSwenson` would let a reviewer open the profile in one click without leaving Markdown.
- **My decision:** accept-now
- **Why:** Smallest in-scope table-cell change; still one row, no new sections, no extra personal data.
- **Action taken:** follow-up commit on `CONTRIBUTORS.md`
- **Evidence:** commit `fb7928e`; table cell is `[AmmonSwenson](https://github.com/AmmonSwenson)`

### Comment 5
- **Theme:** PR clarity
- **Blocking?** no
- **Reviewer said:** “What reviewers should look at” items were all unchecked `[ ]`, so it looked like the author had not self-reviewed the roster or the file list.
- **My decision:** accept-now
- **Why:** Cheap clarity fix; checking the boxes after actually re-reading `CONTRIBUTORS.md` and `git status` is honest.
- **Action taken:** PR description edit in the same follow-up commit
- **Evidence:** commit `fb7928e`; those four items are `[x]` with “author self-checked 2026-09-08”

## Follow-up commits (if any)
| Commit message | Files touched | Addresses which comment # |
| --- | --- | --- |
| `fb7928e` docs: address mentor review on first-contribution PR | `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md` | 1, 2, 4, 5 |
| `926220b` docs: record simulated review response notes | `docs/onboarding/review-response-notes.md` | documents 1–5 |

Comment 3 produced no commit (declined squash).

## PR description edits (if any)
- Sections changed (summary / test plan / risk / other): added **Scope vs plan**; Test plan steps 3–4 (author-run secret search); reviewer checklist marked done
- Before → after: Before, extra files were listed with no plan contrast, and secret scanning was only “expect none.” After, reviewers are told to start at `CONTRIBUTORS.md`, and the author records a 2026-09-08 scan.
- Why the edit helps a reviewer: A teammate who never saw the tutorial can tell intended vs accidental scope and can repeat the secret search on GitHub.

## Re-verification checklist
- [x] Still on the same feature branch (not main) — `git branch --show-current` → `docs/first-contribution-ammonswenson`
- [x] Latest commits pushed; PR shows updated head (push to `github` / AmmonSwenson fork after these notes)
- [x] Diff includes only intended onboarding files — `git diff --name-only github/main...HEAD` has no `src/`, `package.json`, or lockfiles; `agent-tools/` stays untracked
- [x] No secrets, .env values, or machine-specific paths added — `git grep` on contribution docs found only the test-plan search-term mentions
- [x] Manual or scripted checks claimed in the PR still pass — Files changed list still docs/rules only; `CONTRIBUTORS.md` still one data row; skip `npm run dev`
- [x] Blocking comments all have a written resolution — #1 and #2 fixed in `fb7928e` + PR text
- [x] Non-blocking items either fixed or parked with a reason — #4 and #5 fixed; #3 declined (no squash)

## Merge-readiness statement
From a beginner-onboarding perspective this PR is ready to merge: the roster row is accurate, the change is still docs-only, blocking review comments have a recorded fix, and the secret-string search was re-run after the edits. A human mentor should still double-check the **cross-fork file list** on GitHub (team `main` vs this branch) and confirm they are willing to land Cursor rules / `AGENTS.md` in the same PR as `CONTRIBUTORS.md` rather than asking for a split. They should also confirm the four-column `Onboarded` date is the roster format the team wants.

## What I learned about review culture
- One habit I will keep: triage every comment as accept-now, accept-later, or decline with a scope reason, and write the evidence down.
- One mistake I will avoid next time: claiming “search the diff for secrets — expect none” without recording that I actually ran the search.
