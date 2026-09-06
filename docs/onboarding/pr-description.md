# Pull request description — first PREIshare contribution

**PR URL:** https://github.com/EdTechForLearning/PREIShare-org-repo/pull/6
**Base repository:** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository (my fork):** AmmonSwenson/PREIShare-org-repo
**Compare branch:** docs/first-contribution-ammonswenson
**Author:** Ammon Swenson / AmmonSwenson
**Date opened:** 2026-09-06

## Problem
PREIshare had no reviewed onboarding contribution from this engineer yet.
The team needs a small, low-risk change that proves the Git → review → merge path
works for a new teammate without touching product runtime code.

## Approach
- Created `CONTRIBUTORS.md` with one table row: Ammon Swenson / `AmmonSwenson` / Onboarding engineer / 2026-09-06.
- Added a single inventory row for `CONTRIBUTORS.md` in `docs/onboarding/repo-map.md`.
- Recorded the plan and implementation cycles in `docs/onboarding/first-contribution-plan.md` and `docs/onboarding/first-contribution-notes.md`.
- Docs-only: no edits under `src/`, no lockfiles, no `.env`, no config runtime changes.

## What reviewers should look at
- [ ] `CONTRIBUTORS.md` — new entry is accurate, formatted as a Markdown table, and free of secrets
- [ ] `docs/onboarding/repo-map.md` — one new top-level layout row naming `CONTRIBUTORS.md`
- [ ] Diff contains only intended onboarding paths (no accidental `.env`, build output, or `agent-tools/`)
- [ ] Commit messages explain why this onboarding change exists

## Test plan
1. Open the Files changed tab and confirm the paths are `CONTRIBUTORS.md`, `docs/onboarding/repo-map.md`, `docs/onboarding/first-contribution-plan.md`, `docs/onboarding/first-contribution-notes.md`, and `docs/onboarding/pr-description.md` (this record).
2. Skim `CONTRIBUTORS.md` in the PR diff: the table renders as valid Markdown with handle `AmmonSwenson`.
3. Search the diff for tokens, passwords, or local absolute paths — expect none.
4. (Optional) Check out `docs/first-contribution-ammonswenson` locally and open `CONTRIBUTORS.md` in a Markdown preview. Skip `npm run dev` (no UI change).

## Screenshots / notes
No UI screenshots (docs-only change).  
Implementation decisions and verification notes: see `docs/onboarding/first-contribution-notes.md`.

## Checklist before requesting review
- [x] Feature branch is pushed to AmmonSwenson/PREIShare-org-repo
- [x] PR title is specific (not “update” or “fixes”)
- [x] Description states problem, approach, and test plan
- [x] I can explain every staged line if a reviewer asks
