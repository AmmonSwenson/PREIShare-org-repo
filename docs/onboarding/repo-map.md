# PREIshare repository map

Verified against this tree. Do not invent packages, scripts, or folders that are not listed here.

## Official stack (do not substitute)

- Language: TypeScript
- App framework: TanStack Start + React
- Backend/data: Supabase, PostgreSQL, pgvector (intended product stack; no Supabase folder or client in this tree yet)
- Collaboration: Git + GitHub pull requests
- Package manager: npm

## Top-level layout

| Path | What it is |
| --- | --- |
| `AGENTS.md` | Human and agent onboarding memory |
| `CONTRIBUTORS.md` | Human list of people who have contributed |
| `.cursor/rules/preishare.mdc` | Always-apply PREIshare agent rules |
| `.cursorrules` | Legacy Cursor rules; prefer `preishare.mdc` |
| `docs/onboarding/` | Orientation notes and this map |
| `README.md` | Human getting-started guide |
| `package.json` | Root package (`preishare-org-repo`) and scripts |
| `src/` | TanStack Start / React application |
| `src/routes/` | File routes (`__root.tsx`, `index.tsx`, `about.tsx`) |
| `src/components/` | `Header`, `Footer`, `ThemeToggle` |
| `src/router.tsx` | Router factory |
| `src/routeTree.gen.ts` | Generated route tree — do not edit by hand |
| `src/styles.css` | Tailwind entry |
| `vite.config.ts` | Vite + TanStack Start + Tailwind |
| `.git/` | Version control — do not edit |

## Scripts (do not invent others)

`dev`, `build`, `preview`, `generate-routes` in `package.json`. No `test` script.

## Rarely touch as a first contributor

- `.git/`
- `src/routeTree.gen.ts`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json`
- `package.json` / `package-lock.json`
- `src/` product UI unless explicitly tasked
- Auth, billing, database migrations, CI secrets, large dependency upgrades (none of these exist yet — do not create them unprompted)
