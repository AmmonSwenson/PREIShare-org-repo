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

## What reviewers should look at
- [ ] `CONTRIBUTORS.md` — new entry is accurate, formatted as a Markdown table, and free of secrets
- [ ] `docs/onboarding/repo-map.md` — includes a top-level layout row naming `CONTRIBUTORS.md`
- [ ] Diff contains only the documentation/rules paths listed in Test plan (no `.env`, build output, or `agent-tools/`)
- [ ] Commit messages explain why this onboarding change exists

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
