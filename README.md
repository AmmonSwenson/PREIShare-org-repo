# PREIshare Investor Dashboard Shell

TanStack Start + TypeScript starter for the PREIshare investor dashboard (Sprint 3). Planning lives in `docs/dashboard-ia.md` and `docs/component-plan.md`. This scaffold is the project skeleton only — **dashboard area routes (portfolio, deals, profile) are added in a later step**.

## What each starter file is for

| File | Job |
| --- | --- |
| `package.json` | Project recipe: name, `npm` scripts, and libraries (React, TanStack Start). |
| `app.config.ts` | TanStack Start app config entry at the repo root (Vite-based Start; plugins also live in `vite.config.ts`). |
| `tsconfig.json` | Tells TypeScript how to check `.ts` / `.tsx` files (`strict` is on). |
| `src/routes/__root.tsx` | Root layout that wraps every page (`Outlet` / shell). |
| `src/routes/index.tsx` | Home page for `/`. |

## Setup

1. Install [Node.js LTS](https://nodejs.org/) if `node` or `npm` is missing.
2. Open a terminal at this project root (the folder that contains `package.json` and `docs/`).
3. Install libraries: `npm install`
4. Start the development server: `npm run dev`
5. Open the local URL printed in the terminal (this project uses port **3000**, for example http://localhost:3000).

Stop the server with `Ctrl+C`.

## Other scripts

- `npm run typecheck` — TypeScript check only (`tsc --noEmit`).
- `npm run build` — production build.
- `npm run preview` — preview the production build.

## Project notes

- File-based routes live under `src/routes/`.
- The root layout is `src/routes/__root.tsx`. The home route is `src/routes/index.tsx`.
- Do **not** add `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, or `/dashboard/profile` in this scaffold step. Do **not** build `AppShell` yet.
- Mock-data dashboard UI comes after this skeleton is running.
