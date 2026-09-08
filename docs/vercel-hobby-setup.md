# Vercel Hobby setup — PREIshare investor app

**Date:** 2026-09-08
**Vercel plan:** Hobby (free) — not Pro

## URLs (the same ones you will reuse all semester)

| Item | Value |
| --- | --- |
| GitHub repository (you can push) | `https://github.com/AmmonSwenson/PREIShare-org-repo` |
| Instructor collaborator | `thortek` added: invited 2026-09-08 (write access; pending instructor accept) |
| Vercel Production URL | TODO — complete one Hobby import of this fork with Production Branch `main`, then paste `https://<project>.vercel.app` here (not a `*-git-*` Preview URL) |
| Preview URLs | Do **not** submit these to Canvas |

## Hobby constraints I will keep

- One Vercel project for this course
- Production deploys from `main` only
- No cron / Fluid Compute / paid add-ons
- Secrets go in the Vercel dashboard later — never in git

## First production deploy

- Status: Not Ready yet in this workspace (no Vercel dashboard session). App is prepared for SSR: `nitro` is in `package.json`, `vite.config.ts` plugins are `tanstackStart()` → `nitro()` → `viteReact()` (plus existing Tailwind/devtools). Local `npm run build` succeeded with a Nitro server output under `.output/` (gitignored). Do **not** set `outputDirectory: "dist"`.
- Incognito check of Production URL: fail (no Production URL yet)
