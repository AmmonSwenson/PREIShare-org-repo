# PREIshare repository map

> Onboarding map for first-contribution planning. Built with five read-only
> coding-agent inventory cycles, then human path checks. Do not treat this as
> architecture law if the real tree disagrees—update this file when you learn more.

## Meta

- Clone path (from `docs/onboarding/setup-log.md`): `/home/ubuntu/src/PREIShare-org-repo`
- Toolchain facts (from `docs/onboarding/setup-log.md`): Git `2.43.0`; OS Linux Ubuntu 24.04.4 LTS; HTTPS clone of fork `https://github.com/AmmonSwenson/PREIShare-org-repo.git`; remotes `origin` = fork, `upstream` = `https://github.com/EdTechForLearning/PREIShare-org-repo.git`
- Date mapped: `2026-09-05`
- Agent tool used: `coding-agent` (five narrow inventory prompts; no file edits during inventory)
- Mapper: `Ammon Swenson (AmmonSwenson)`

## 1. Overview (5–8 sentences)

PREIshare in this clone is a **single npm package** at the repo root (`preishare-org-repo` in `package.json`), not a monorepo. There is no `apps/` or `packages/` workspace, no `workspaces` field, and no Lerna/Nx/Turbo config. Product code lives in `src/` (file routes, React components, Tailwind tokens in `src/styles.css`, router factory in `src/router.tsx`). There is no top-level `lib/` directory. Docs live in `docs/onboarding/`. `docs/onboarding/team-orientation-notes.md` names Supabase, PostgreSQL, and pgvector as intended product direction, but those folders and clients are **not found** in this tree. `.cursorrules` tells agents to use `lib/supabase.ts`; that file is **not found**. This clone is the blank TanStack Start scaffold described in `AGENTS.md`. No application code was edited while building this map.

## 2. Top-level inventory

| Path | Kind | One-sentence purpose | Verified by me? |
|------|------|----------------------|-----------------|
| `.git/` | other | Git history and remotes for this clone | yes |
| `.vscode/` | config | Editor settings; treats generated `routeTree.gen.ts` as read-only | yes |
| `docs/` | docs | Onboarding documentation (`docs/onboarding/`) | yes |
| `src/` | app | TanStack Start / React application source | yes |
| `.cta.json` | config | Create TanStack App scaffold record (file-router, TypeScript, Tailwind, npm) | yes |
| `.cursorrules` | config | Cursor/agent conventions for this repo | yes |
| `.gitignore` | config | Ignores `node_modules`, `.env`, build output, and similar local files | yes |
| `AGENTS.md` | docs | Agent/project context: stack, layout, Intent skills, env rules | yes |
| `README.md` | docs | Human getting-started guide for the TanStack Start app | yes |
| `package.json` | config | Root package manifest and scripts | yes |
| `package-lock.json` | config | npm lockfile (`lockfileVersion` 3) | yes |
| `tsconfig.json` | config | TypeScript compiler options and path aliases | yes |
| `tsr.config.json` | config | TanStack Router CLI config (`target: "react"`) | yes |
| `vite.config.ts` | config | Vite plugins: `devtools()`, `tailwindcss()`, `tanstackStart()`, `viteReact()` | yes |

Top-level names **not found**: `apps/`, `packages/`, `supabase/`, `.github/`, `public/`, `lib/`, `node_modules/`, `index.html`.

## 3. Frontend concerns (TypeScript, React, TanStack Start)

- App root: `src/` (the app *is* the repo root package; there is no nested `apps/web`)
- Clues: `package.json` depends on `react`, `@tanstack/react-start`, `@tanstack/react-router`, `vite`, `tailwindcss`; `vite.config.ts` calls `tanstackStart()` and `viteReact()`; route files export `createFileRoute` / `createRootRoute`
- Entry / routes / UI:
  - `vite.config.ts` — Start Vite plugin (classic `src/main.tsx` and `index.html` are **not found**)
  - `src/router.tsx` — `getRouter()` factory
  - `src/routeTree.gen.ts` — generated route tree (**do not edit by hand**)
  - `src/routes/__root.tsx` — HTML shell / layout (`Header`, `Footer`, `src/styles.css`)
  - `src/routes/index.tsx` — home page `/`
  - `src/routes/about.tsx` — about page `/about`
  - `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ThemeToggle.tsx`
  - `src/styles.css` — Tailwind v4 entry and design tokens (including `--sea-ink`)
  - `src/lib/user.ts` — stub `User` type and `getUser()` that returns `null`
- `src/routes/demo/` — **not found**
- How this relates to screens: Visiting `/` and `/about` renders the two starter pages inside the root layout. Path aliases `#/*` and `@/*` both map to `src/` in `tsconfig.json`.

## 4. Backend / data concerns (Supabase, PostgreSQL, pgvector, APIs)

- Supabase or data config paths: **not found** (no `supabase/` folder; no `lib/supabase.ts`; no `src/lib/supabase.ts`; no `@supabase/*` in `package.json`)
- Migrations / SQL / schema-related paths: **not found** (no `*.sql`; no Prisma/Drizzle/Knex config)
- Env examples (NOT secret values): **not found** (`.env` is listed in `.gitignore`; there is no `.env.example`. No `.env` file was present in this clone.)
- `src/lib/user.ts` exists but does not talk to a database; `getUser()` returns `null`
- Beginner note: Do not invent database credentials, run migrations against a shared project, or paste secrets into agents. `AGENTS.md` says this blank app has no auth/DB yet. `.cursorrules` names `lib/supabase.ts` as a future client path; that file is **not found**. Orientation notes describe the *intended* stack only.

## 5. Tooling and CI

- TypeScript config: `tsconfig.json` (strict). No ESLint, Prettier project config, Biome, or `lint`/`format`/`typecheck` scripts in `package.json`.
- CI workflows (GitHub Actions): **not found** (no `.github/`)
- Editor or agent config: `.vscode/settings.json`, `.cursorrules`, `AGENTS.md`; also `.cta.json`, `tsr.config.json`, `vite.config.ts`
- Scripts from `package.json`: `dev` (`vite dev --port 3000`), `build`, `preview`, `generate-routes` (no `test` script)
- Package manager: npm, from `package-lock.json`. `package.json` also contains a `pnpm.onlyBuiltDependencies` block; `pnpm-lock.yaml` is **not found**.
- `prettier` appears only as a transitive entry inside `package-lock.json`, not as a direct dependency or config file.

## 6. Safe first-touch vs do-not-edit-yet

### Safe first-touch (good candidates for a tiny onboarding PR)

| Path or area | Why it is relatively safe | Risk if handled carelessly |
|--------------|---------------------------|----------------------------|
| `docs/onboarding/` | Docs-only; helps the team | Misleading docs |
| `docs/onboarding/repo-map.md` (this file) | Onboarding artifact; no runtime impact | Stale or wrong paths if the tree changes |
| `docs/onboarding/setup-log.md` | Personal clone checklist already in the fork | Accidental secrets in the log |
| `README.md` (small copy-only tweaks, if a mentor agrees) | Human-facing but not application logic | Confusing getting-started steps |

### Do not edit yet (wait until you have tests, review, and a real task)

| Path or area | Why wait | What could break |
|--------------|----------|------------------|
| CI under `.github/` | Shared pipeline (**not found** in this clone; do not invent one for a first PR) | Everyone’s builds |
| `package.json`, `package-lock.json` | Dependency graph | Install failures for all |
| `vite.config.ts`, `tsconfig.json`, `tsr.config.json` | Build and type toolchain | Dev server, build, or route generation |
| `src/routeTree.gen.ts` | Generated by TanStack Router | Overwritten or type-unsafe routing |
| `src/` application routes and components | Product UI; needs a real task | User-facing screens and layout |
| Supabase / migrations / production env | Data and secrets (**not found**; still out of scope) | Data loss or leaked secrets |
| `.env` or any credentials | Secrets | Leaked keys or broken local setup |
| `node_modules/` | Installed third-party code (**not found** in this clone) | Local-only noise; never commit |

## 7. Open questions for the team

- Is the intended Supabase / PostgreSQL / pgvector work in another repo, an unmerged branch, or simply not started? This clone has UI only.
- Should `.cursorrules` keep pointing at `lib/supabase.ts` before that file exists, or should the rule wait until the client is added?
- When will GitHub Actions (mentioned in orientation notes as later automation) land, and what should a first PR expect to pass?
- Is `.cta.json` still read by Create TanStack App / Intent tooling, or is it leftover scaffold bookkeeping?
- `package.json` contains a `pnpm.onlyBuiltDependencies` block while the lockfile is npm—intentional or leftover from the scaffold?
- There is no `test` script; where should new-feature tests go when `.cursorrules` says to write them?
- `src/lib/user.ts` is unused by routes/components in this clone—keep as a stub, or wait for a real auth task?

## 8. How I will use this map next

- Configure AI project rules/memory using the paths above (next tooling steps).
- Pick a first contribution only from **Safe first-touch** unless a mentor expands scope.
- Revisit and edit this file when a path claim is proven wrong.
