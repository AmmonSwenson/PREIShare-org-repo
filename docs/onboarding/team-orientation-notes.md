# PREIshare team orientation notes

## Product

PREIshare helps people make better real-estate decisions by turning property and market data into clear intelligence. The engineering team ships that product as a modern web app (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector). A new contributor joins that shipping loop safely — they do not rewrite the product on day one.

Investor-listing **product** roles (listing editor, investor, reviewer/compliance) live in `docs/domain/investor-listing-domain-brief.md`. This file names the **shipping** actors and the draft-to-PR path those people actually use.

## Actors

| Actor | Who (this repo) | What they do |
| --- | --- | --- |
| Learner / onboarding engineer | Ammon Swenson (`AmmonSwenson`) | Forks the team repo, commits on a feature branch, opens the review PR, and keeps fork `main` current so Hobby production can deploy. |
| AI coding agent | Cursor (reads `.cursor/rules/preishare.mdc` and `AGENTS.md`) | Drafts the smallest scoped diff, lists files before editing, never merges, never invents paths or scripts. |
| Mentor / human reviewer | Course mentor on GitHub (human; not the agent) | Reviews the pull request, asks for changes, and is the only one who merges into the team repo. |
| Instructor collaborator | `thortek` (write access on the fork) | Can inspect the GitHub repo linked to Vercel; invite must stay in place for Canvas/PAUL. |
| Team repo (upstream) | `EdTechForLearning/PREIShare-org-repo` | Source of truth for reviewed team `main`. Learners **pull**; they cannot push. Cross-fork PRs land here. |
| Learner fork | `AmmonSwenson/PREIShare-org-repo` | The repo this learner can push. Vercel Hobby is linked here. |
| Production host | Vercel Hobby | Deploys fork `main` to `https://prei-share-org-repo-omega.vercel.app` (not a Preview URL, not localhost). |

## Draft-to-PR mapping

How a change moves from a local draft to a reviewable pull request in **this** workspace. Do not skip the fork: merging only to upstream never updates Vercel.

| Stage | Branch / remote | Owner | Output |
| --- | --- | --- | --- |
| 0. Orient | Read `docs/onboarding/repo-map.md`, this file, `AGENTS.md`, `.cursor/rules/preishare.mdc` | Learner + agent | Shared file list and out-of-scope list |
| 1. Draft locally | Feature branch off current default (example: `docs/first-contribution-ammonswenson`). Not team `main`. | Learner + agent | Smallest diff; restated goal; no secrets |
| 2. Verify | Same feature branch | Learner | Only scripts named in `package.json` when the change needs them; docs-only work may skip `npm run dev` |
| 3. Push for review | Push the feature branch to the **fork** (`github` → `AmmonSwenson/PREIShare-org-repo`). Cloud `origin` may be a Cursor git host — that is not the GitHub fork. | Learner | Branch visible on GitHub |
| 4. Open PR | Cross-fork PR: base `EdTechForLearning/PREIShare-org-repo` `main` ← head `AmmonSwenson:<feature-branch>` | Learner | Reviewable GitHub PR (Sprint 1: [#6](https://github.com/EdTechForLearning/PREIShare-org-repo/pull/6)) |
| 5. Review | Same PR | Mentor (human). Agent may apply requested edits and push more commits to the **fork** branch. | Approval or change requests. **Do not merge.** |
| 6. Ship to production | Fast-forward the **same commits** onto fork `main` (the repo Vercel watches). Ignore Preview deployments. | Learner | Public Production URL `https://prei-share-org-repo-omega.vercel.app` |

First-contribution shape that matches this mapping: docs-only (`CONTRIBUTORS.md` + one `repo-map.md` row, plus onboarding artifacts). Product UI, lockfiles, and generated `src/routeTree.gen.ts` stay off that PR unless a mentor explicitly assigns them.

## Definition of done

1. Restate the goal and list the files you will touch.
2. Make the smallest diff that completes the requested task.
3. Verify using only scripts named in `package.json`.
4. Do not merge. Humans review on a GitHub pull request when the team asks for one.
5. The change is on a feature branch pushed to the **fork**, with a cross-fork PR into team `main` when the work is for review.
6. Anything that must appear on the public site is also on fork `main` so Hobby production (not a Preview host) can deploy it.

## Conventions

- Match existing naming, file layout, and TypeScript style in neighboring files.
- No drive-by refactors of unrelated modules.
- Do not add libraries unless the human explicitly asks and justifies them.
- Small, clearly scoped docs changes under `docs/` are legitimate first-contributor work.
- When unsure about structure, read this folder and the repo map rather than inventing paths.

## Safety (every agent)

- Never commit `.env`, API keys, tokens, or connection strings.
- Prefer the smallest diff that finishes the task.
- Ask before deleting files.
- Never print secrets into docs, rules, or chat. If configuration is needed, document the variable *name* only (for example `SUPABASE_URL`), not a value.
