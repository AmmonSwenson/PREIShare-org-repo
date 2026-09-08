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
The team repo’s `main` also lacked the Cursor rules / `AGENTS.md` / onboarding docs that were prepared on the fork.
The team needs a small, low-risk docs change that proves the Git → review → merge path works
for a new teammate without touching product runtime code.

## Approach
- Created `CONTRIBUTORS.md` with one table row: Ammon Swenson / `AmmonSwenson` / Onboarding engineer / 2026-09-06.
- Added a single inventory row for `CONTRIBUTORS.md` in `docs/onboarding/repo-map.md`.
- Included the onboarding artifacts already on this branch: `.cursor/rules/preishare.mdc`, `AGENTS.md`, `docs/onboarding/team-orientation-notes.md`, `docs/onboarding/ai-tooling-verification.md`, `docs/onboarding/first-contribution-plan.md`, `docs/onboarding/first-contribution-notes.md`, and this PR record.
- Docs-only: no edits under `src/`, no lockfiles, no `.env`, no config runtime changes.

## Scope vs plan
The written plan (`docs/onboarding/first-contribution-plan.md`) asked for `CONTRIBUTORS.md` plus one `repo-map.md` row, reviewable in under 10 minutes. This cross-fork PR is larger because team `main` does not yet contain the Cursor rules and onboarding docs that already lived on the fork. Please start at `CONTRIBUTORS.md`. Treat extra `docs/onboarding/*` and `.cursor/rules/preishare.mdc` / `AGENTS.md` as supporting onboarding artifacts, not a product change.

## What reviewers should look at
- [x] `CONTRIBUTORS.md` — new entry is accurate, formatted as a Markdown table, and free of secrets (author self-checked 2026-09-08)
- [x] `docs/onboarding/repo-map.md` — includes a top-level layout row naming `CONTRIBUTORS.md`
- [x] Diff contains only the documentation/rules paths listed in Test plan (no `.env`, build output, or `agent-tools/`)
- [x] Commit messages explain why this onboarding change exists

## Test plan
1. Open the Files changed tab and confirm these paths (and no `src/` or lockfiles):
   - `.cursor/rules/preishare.mdc`
   - `AGENTS.md`
   - `CONTRIBUTORS.md`
   - `docs/onboarding/ai-tooling-verification.md`
   - `docs/onboarding/first-contribution-notes.md`
   - `docs/onboarding/first-contribution-plan.md`
   - `docs/onboarding/pr-description.md`
   - `docs/onboarding/repo-map.md`
   - `docs/onboarding/team-orientation-notes.md`
2. Skim `CONTRIBUTORS.md` in the PR diff: the table renders as valid Markdown with a link to `https://github.com/AmmonSwenson`.
3. Search the Files changed tab for `gho_`, `sk-`, `.env`, and `/Users/` — expect no secret values or machine-specific home paths.
4. Author already ran that search on 2026-09-08 against `git diff github/main...HEAD` (fork `main`) and `git grep` on the three contribution files; no secret values found. Reviewers should still skim Files changed on GitHub.
5. (Optional) Check out `docs/first-contribution-ammonswenson` locally and open `CONTRIBUTORS.md` in a Markdown preview. Skip `npm run dev` (no UI change).

## Screenshots / notes
No UI screenshots (docs-only change).  
Implementation decisions and verification notes: see `docs/onboarding/first-contribution-notes.md`.

## Checklist before requesting review
- [x] Feature branch is pushed to AmmonSwenson/PREIShare-org-repo
- [x] PR title is specific (not “update” or “fixes”)
- [x] Description states problem, approach, and test plan
- [x] I can explain every staged line if a reviewer asks
