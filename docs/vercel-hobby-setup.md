# Vercel Hobby setup — PREIshare investor app

**Date:** 2026-09-08
**Vercel plan:** Hobby (free) — not Pro

## URLs (the same ones you will reuse all semester)

| Item | Value |
| --- | --- |
| GitHub repository (you can push) | `https://github.com/AmmonSwenson/PREIShare-org-repo` |
| Instructor collaborator | `thortek` added: yes |
| Vercel Production URL | `https://prei-share-org-repo-omega.vercel.app` |
| Preview URLs | Do **not** submit these to Canvas |

## Hobby constraints I will keep

- One Vercel project for this course
- Production deploys from `main` only
- No cron / Fluid Compute / paid add-ons
- Secrets go in the Vercel dashboard later — never in git

## First production deploy

- Status: Ready. SSR via Nitro (`tanstackStart()` → `nitro()` → `viteReact()`). `GET https://prei-share-org-repo-omega.vercel.app/` and `/about` returned HTTP 200 HTML (`title`: TanStack Start Starter; Home/About nav). Not a Vercel dashboard page, not `NOT_FOUND`, not a `*-git-*` Preview URL. Do **not** set `outputDirectory: "dist"`.
- Incognito check of Production URL: pass (HTTP 200, app HTML)
