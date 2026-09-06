# First contribution plan — PREIshare onboarding

## Author
- Name / GitHub handle: Ammon Swenson / [AmmonSwenson](https://github.com/AmmonSwenson)
- Feature branch: `docs/first-contribution-ammonswenson`
- Date: 2026-09-06

## One-sentence goal
Add myself as a new contributor in `CONTRIBUTORS.md` and add one inventory row for that file in `docs/onboarding/repo-map.md` so the team can review a small first PR.

## Why this surface (link to prior artifacts)
- From `docs/onboarding/repo-map.md`: Safe first-contributor work is `docs/` (including `docs/onboarding/`) and existing root markdown; `src/` product UI, generated `src/routeTree.gen.ts`, toolchain config, and lockfiles are “rarely touch.”
- From `docs/onboarding/team-orientation-notes.md`: First-PR definition of done is a scoped, isolated, described, reviewable docs change — “Small, clearly scoped docs changes under `docs/` are legitimate first-contributor work.”
- From `docs/onboarding/ai-tooling-verification.md`: All four smoke tests passed (ST1–ST4) with a **GO** for using this AI tooling on the first contribution; ST3 already recommended a tiny `docs/` surface.

## In scope (only these)
1. Create `CONTRIBUTORS.md` at the repo root with a short heading and one table row: name `Ammon Swenson`, GitHub handle `AmmonSwenson`, role `Onboarding engineer`.
2. Second touch (one file): edit `docs/onboarding/repo-map.md` to add a single top-level inventory row for `CONTRIBUTORS.md` (“Human list of people who have contributed”).
3. Capture implementation notes later in `docs/onboarding/first-contribution-notes.md` (next step—not done here).

## Out of scope (explicitly not this PR)
- Auth, sessions, or environment secrets
- Database schema, migrations, Supabase policies, or pgvector changes
- Dependency upgrades or lockfile churn unrelated to the contribution
- Multi-package refactors, renames, or formatting the whole repo
- CI/CD workflow edits unless a mentor explicitly assigns them
- Any edit under `src/`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json`, `package.json`, or `package-lock.json`
- Running or inventing scripts beyond `git` for this planning step

## Likely files to change
| File | Action | Why |
|------|--------|-----|
| `CONTRIBUTORS.md` | create | Add my contributor entry (does not exist in the tree today) |
| `docs/onboarding/repo-map.md` | edit | One inventory row so the new root doc is listed in the verified map |
| `docs/onboarding/first-contribution-notes.md` | create (next step) | Record what the agent did and what I verified |

## Acceptance criteria
- [ ] I am on feature branch `docs/first-contribution-ammonswenson` (not `main`).
- [ ] `CONTRIBUTORS.md` exists at the repo root and contains a Markdown table with exactly one data row: `Ammon Swenson` | `AmmonSwenson` | `Onboarding engineer`.
- [ ] The only other content change in the implementation PR is one new row in the “Top-level layout” table of `docs/onboarding/repo-map.md` naming `CONTRIBUTORS.md`.
- [ ] `git diff` for the implementation step shows no other paths (no `src/`, no lockfiles, no `.env`, no generated build output).
- [ ] A teammate can review the diff in under 10 minutes: two files, no product behavior change.

## Verification plan (how I will know it worked)
1. `git branch --show-current` prints `docs/first-contribution-ammonswenson`. `git status` lists only the files in the table above (plus this plan file for the planning step).
2. Open `CONTRIBUTORS.md` and confirm the table renders as plain Markdown with my handle spelled `AmmonSwenson`.
3. No UI touch is included — skip `npm run dev`.
4. Skim `git diff`: expected paths are `docs/onboarding/first-contribution-plan.md` (this step) then later `CONTRIBUTORS.md` and `docs/onboarding/repo-map.md` only.

## Risks and mitigations
- Risk: Agent expands scope into app core. Mitigation: refuse diffs that touch files not listed above; re-prompt with the out-of-scope list.
- Risk: Editing default branch by mistake. Mitigation: check `git branch --show-current` before every edit session; it must be `docs/first-contribution-ammonswenson`.
- Risk: Second touch becomes a repo-map rewrite. Mitigation: allow only one new table row; if the diff touches other sections of `repo-map.md`, revert those hunks.

## Definition of done for this planning step
- [x] Feature branch created from updated default branch (`github/main` at `1a5cd7b`).
- [x] This plan file saved at `docs/onboarding/first-contribution-plan.md` with all sections filled (no angle-bracket placeholders left).
- [x] Ready to implement in the next step without re-deciding scope.
