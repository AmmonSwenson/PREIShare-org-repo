# PREIshare onboarding handoff

**Author:** Ammon Swenson / AmmonSwenson  
**Date:** 2026-09-08  
**Branch / PR:** `docs/first-contribution-ammonswenson` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/6  
**Audience:** mentor, future self, sprint lead

## 1. Stakeholder summary (plain language)

I completed PREIshare engineering onboarding for Sprint 1 (dev environment and AI tooling). PREIshare is a real-estate intelligence product; this sprint did **not** ship a product feature. I forked the team repo, authenticated to GitHub as `AmmonSwenson`, configured Cursor project rules and `AGENTS.md`, mapped safe docs surfaces, implemented a small contributors roster change, opened a cross-fork pull request, and simulated mentor review with documented follow-up commits.

**Definition of done met:**
- [x] Fork created (`AmmonSwenson/PREIShare-org-repo`); this Cloud workspace can fetch/push that fork (see `docs/onboarding/setup-log.md`). Learner-laptop clone path is TODO.
- [x] AI rules / project memory in place and smoke-tested (`docs/onboarding/ai-tooling-verification.md`: ST1–ST4 pass, **GO**)
- [x] First contribution implemented and committed on `docs/first-contribution-ammonswenson`
- [x] PR opened and simulated review feedback addressed; **human mentor review is still outstanding**

**Three source-of-truth bullets for this handoff:**
1. **Done means:** rules + agent memory exist, a docs-only first contribution is on a feature branch, and PR #6 is merge-ready for a human—not that a PREIshare product feature shipped.
2. **Open risk:** no personal-laptop setup proof; `npm install` / `npm run dev` were never run; PR #6 is larger than the original two-file plan versus team `main`.
3. **Do not redo next sprint:** ST1–ST4 already passed; do not recreate `.cursor/rules/preishare.mdc` or `AGENTS.md` from zero.

## 2. Deliverables index (what exists and where)

| Artifact | Path | Why it matters |
| --- | --- | --- |
| Team orientation notes | `docs/onboarding/team-orientation-notes.md` | Mission, workflow, first-PR definition of done |
| Setup log | `docs/onboarding/setup-log.md` | What was actually verified in this Cloud workspace (laptop facts marked TODO) |
| Repo map | `docs/onboarding/repo-map.md` | Safe contribution surfaces; not a monorepo |
| AI tooling verification | `docs/onboarding/ai-tooling-verification.md` | Four smoke tests, all pass, GO |
| Project rules | `.cursor/rules/preishare.mdc` | Always-apply IDE-agent constraints |
| Agent memory entrypoint | `AGENTS.md` | Cross-tool project context |
| First contribution plan | `docs/onboarding/first-contribution-plan.md` | Scoped plan before implementation |
| Contribution notes | `docs/onboarding/first-contribution-notes.md` | Cycles used and review of diffs |
| Contributors credit | `CONTRIBUTORS.md` | Visible first contribution surface |
| PR description | `docs/onboarding/pr-description.md` | Reviewer-facing summary (matches Files changed) |
| Review response notes | `docs/onboarding/review-response-notes.md` | Simulated mentor comments and resolutions |
| This handoff | `docs/onboarding/onboarding-handoff.md` | Single entry point for mentors |

## 3. Environment and toolchain snapshot

Copied from `docs/onboarding/setup-log.md` (do not treat as a personal laptop receipt):

- OS: Linux 6.12.94+ x86_64 (Cursor Cloud VM)
- Git user.name / user.email configured: yes **in this VM** (`Cursor Agent` / `cursoragent@cursor.com`); learner laptop identity: TODO
- Node / package manager versions: Node v22.14.0 in this VM; repo expects npm; learner laptop Node/npm: TODO
- origin (my fork) URL: pushable remote is `github` → https://github.com/AmmonSwenson/PREIShare-org-repo.git (this VM’s `origin` is a Cursor git host, not the fork)
- upstream (team repo) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- Install/build/test commands run and result: none. Docs-only path skipped `npm run dev` (`first-contribution-notes.md`). No `test` script in `package.json`.
- Blockers hit and how resolved: cannot push to the team repo (pull-only); pushed to the fork and opened PR #6. GitHub device login completed as `AmmonSwenson`.

## 4. AI tooling posture

- Rules file purpose (one sentence): `.cursor/rules/preishare.mdc` is an always-apply guardrail so agents stay on TypeScript + TanStack Start + React, ship the smallest docs-safe diff, and never commit secrets.
- AGENTS.md purpose (one sentence): root onboarding memory that points humans and other tools at `preishare.mdc`, the repo-map, and the npm scripts that actually exist.
- Smoke-test prompt used and whether the agent correctly named stack pieces (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector): four separate explore-agent prompts (structure, safety, scope, stack). ST4 named TypeScript, TanStack Start + React, Vite, Tailwind, npm, and said Supabase / PostgreSQL / pgvector are **intended but not in the tree**. ST1–ST3 also passed (`ai-tooling-verification.md`).
- Context gaps found and fixes applied: none on first run (“No gaps; all four passed on first run”). Known limitations left in place: Intent block in `AGENTS.md` still mentions monorepos; `.cursorrules` still names `lib/supabase.ts`, which is not in the tree—prefer `preishare.mdc`.

## 5. First contribution and review outcome

- Plan goal (from first-contribution-plan.md): add Ammon Swenson to `CONTRIBUTORS.md` and one inventory row in `docs/onboarding/repo-map.md`.
- Files touched for that contribution: `CONTRIBUTORS.md`, `docs/onboarding/repo-map.md`, plus plan/notes/PR/review/handoff docs on the same branch. Cross-fork Files changed versus team `main` also includes `.cursor/rules/preishare.mdc`, `AGENTS.md`, and other `docs/onboarding/*` files that team `main` never had.
- PR title and link: `docs: add CONTRIBUTORS entry for onboarding` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/6 (OPEN, cross-repository)
- Review-style feedback received (summary): simulated mentor (2026-09-08) — blocking: scope vs plan, unproven secret search; non-blocking: noisy commits, bare GitHub handle, unchecked self-review boxes.
- Changes made in response: `fb7928e` linked the GitHub handle and clarified PR scope/verification; squash declined; notes in `review-response-notes.md`.
- Merge readiness: **ready with follow-ups** — beginner onboarding bar is met; a human mentor should still decide whether Cursor rules and `AGENTS.md` may land in the same PR as the roster, and whether the four-column `Onboarded` date is the team’s roster format.

## 6. Open risks and environment gaps

1. No verified personal-laptop clone/toolchain (setup log is Cloud-VM only; laptop OS/Git/Node are TODO).
2. App never installed or run here (`npm install` / `npm run dev` / `npm run build` not executed). There is no `test` script.
3. Intended data stack (Supabase, PostgreSQL, pgvector) is **not in the tree**; no local env vars configured.
4. PR #6 is still awaiting a **human** mentor (only simulated review is done) and is larger than the original two-file plan versus team `main`.
5. This VM’s `origin` remote is not the GitHub fork; future pushes must keep using the `github` remote (or a renamed origin) to avoid 403 on the team repo.

## 7. Decisions log (for stakeholders)

| Decision | Choice | Rationale |
| --- | --- | --- |
| First contribution surface | `CONTRIBUTORS.md` + one `repo-map.md` row | Matches the plan; docs-only; repo-map lists `docs/` as a safe first surface |
| Branch naming | `docs/first-contribution-ammonswenson` | Matches orientation: isolated feature branch, not `main` |
| AI tool category used most | coding-agent (Cursor Cloud) | Could read the repo and rules files; chat-style mentor role used for simulated review |
| GitHub push target | Fork `AmmonSwenson/PREIShare-org-repo`, then cross-fork PR | No push permission on `EdTechForLearning/PREIShare-org-repo` |
| Review history | Keep small follow-up commits; do not squash | Audit trail for the review loop |

## 8. Next-sprint preview (what this unlocks)

The next sprint topic can assume:

1. **Trusted local environment** — fork + GitHub auth + Cloud checkout are documented in `setup-log.md`. Re-run laptop clone/install only if working on a personal machine (those facts are still TODO).
2. **AI alignment** — `.cursor/rules/preishare.mdc` and `AGENTS.md` exist and ST1–ST4 passed; extend rules when new packages appear, do not start from zero.
3. **Git habit** — feature branch → focused commits → cross-fork PR → respond to review was practiced once (`docs/first-contribution-ammonswenson` → PR #6).
4. **First PR path** — merge-ready for a human mentor with documented follow-ups; feature work should use the same PR quality bar (plan, small diff, test steps a reviewer can run on GitHub).

**Explicitly out of scope until later:** large product features, production deployments, and database migrations / Supabase work you have not been trained on yet.

## 9. Ask for mentor

- Questions still open: Should PR #6 land Cursor rules + `AGENTS.md` together with `CONTRIBUTORS.md`, or split? Is the four-column `Onboarded` date the roster format you want? Should a laptop `setup-log` be required before feature tickets?
- Review of this handoff requested: yes
- Preferred follow-up time or channel: GitHub review on https://github.com/EdTechForLearning/PREIShare-org-repo/pull/6

---

*End of handoff. Keep this file updated if merge status or env gaps change before the next sprint starts.*
