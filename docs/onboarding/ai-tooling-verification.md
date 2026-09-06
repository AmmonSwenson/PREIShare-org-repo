# AI tooling verification — PREIshare onboarding

**Date:** 2026-09-06  
**Learner:** Ammon Swenson  
**Tool under test:** Cursor Cloud coding-agent (four short `explore` subagents, one prompt each)  
**Context loaded:** `.cursor/rules/preishare.mdc`, `AGENTS.md`, `docs/onboarding/repo-map.md`

## Environment check

- [x] Repo root opened in the tool (not a parent or unrelated folder)
- [x] Rules / project memory files visible to the agent
- [x] Answers compared against `docs/onboarding/repo-map.md` (human source of truth for paths)

Each smoke prompt required the agent to read those files first, cite concrete paths from this tree, and say “I don’t know” instead of guessing a generic layout. Prompts were run separately (not one mega-prompt).

## Smoke tests

| ID | Question theme | Result (pass / fail / vague) | Evidence (agent claim vs repo-map or rules) | Re-test after fix |
|----|----------------|------------------------------|---------------------------------------------|-------------------|
| ST1 | Where routes / UI entry / apps vs packages live | pass | `src/routes/`, `src/router.tsx`, `src/components/`; one root package, no `apps/` or `packages/` | n/a |
| ST2 | What must not be committed; secret handling | pass | Named `.env`; refuse values; document names only (`SUPABASE_URL`); cited `.gitignore`, `preishare.mdc`, `AGENTS.md` | n/a |
| ST3 | How to scope a tiny first change | pass | `docs/` / `README.md` / `AGENTS.md`; smallest diff; do not touch generated/toolchain/`src/` unless tasked | n/a |
| ST4 | Stack names and where their config lives | pass | TypeScript, TanStack Start + React, Vite, Tailwind, npm; Supabase not in tree; configs at `package.json`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json` | n/a |

### ST1 — Structure (notes)

- Prompt summary: Where do application routes and main UI entry points live? Which folders are packages versus apps?
- Agent answer (short): Routes in `src/routes/` (`__root.tsx`, `index.tsx`, `about.tsx`); factory `src/router.tsx`; generated `src/routeTree.gen.ts`. UI in `src/components/` (`Header`, `Footer`, `ThemeToggle`) and `src/styles.css`. Not a monorepo: one npm package `preishare-org-repo` at the root; no `packages/` or `apps/`.
- Expected (from repo-map): Same paths and “single package at repo root / app is `src/`”.
- Result: **pass** — no Next.js / CRA invented layout.

### ST2 — Safety (notes)

- Prompt summary: What must never be committed, and what to do if asked to put secrets in source?
- Agent answer (short): Never commit `.env` (listed in `.gitignore`), API keys, tokens, or connection strings. Do not put secrets in `VITE_*`. If asked: refuse; document variable *names* only (for example `SUPABASE_URL`); never print secrets into docs, rules, or chat.
- Expected (from rules / AGENTS.md): Same do-not-commit list and name-only config guidance.
- Result: **pass** — named `.env` and pointed at project memory, not a vague “be careful.”

### ST3 — Scope (notes)

- Prompt summary: How should a tiny first UI or docs change be scoped?
- Agent answer (short): One small PR, usually copy-only under `docs/` (including `docs/onboarding/`), `README.md`, or `AGENTS.md`. Smallest diff; no drive-by refactors. Do not touch `src/` product UI, `src/routeTree.gen.ts`, Vite/TS/router config, or lockfiles unless tasked. No multi-package rewrite (there is only `preishare-org-repo`).
- Expected (small surface, no drive-by refactors): Matches “safe first surfaces” and “rarely touch” in the repo-map and `preishare.mdc`.
- Result: **pass** — prefers docs over a first UI rewrite, which is what the rules require.

### ST4 — Stack awareness (notes)

- Prompt summary: Which core technologies does this repo use, and where does their config live?
- Agent answer (short): TypeScript, TanStack Start + React, Vite, Tailwind CSS, npm. Supabase / PostgreSQL / pgvector are intended but not in the tree yet. Config: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json`; app under `src/`.
- Expected (TypeScript, TanStack Start, React, Supabase, etc. as in repo): Same names; Supabase called out as intended-not-present; config paths match the repo-map.
- Result: **pass** — did not invent Next.js, Prisma, or a live `supabase/` client.

## Context gaps fixed

No gaps; all four passed on first run.

## Re-verification

- Failed IDs re-run: none
- Final results: ST1 pass ST2 pass ST3 pass ST4 pass
- Accepted limitations (if any): The TanStack Intent block at the top of `AGENTS.md` still mentions monorepos; ST1 correctly overrode that using the repo-map (“not a monorepo”). `.cursorrules` still names `lib/supabase.ts`, which is not in the tree — agents should prefer `preishare.mdc`. No `test` script exists; first contributions should not invent one.

## Go / no-go

**Decision:** GO for using this AI tooling on the first contribution.

**Rationale (2–4 sentences):** ST1 matched real `src/routes/` and `src/components/` paths and correctly denied a packages/apps monorepo. ST2 named `.env` and refused putting secret values in source, citing the rules file, `AGENTS.md`, and `.gitignore`. ST3 scoped a first change to `docs/` and forbade drive-by refactors of generated and toolchain files. ST4 used the official stack names and admitted Supabase is not in the tree yet, so a first PR is unlikely to be steered into a fake backend.

**Signed off by:** Ammon Swenson
