# Vercel Hobby setup — PREIshare investor app

**Date:** 2026-09-08
**Vercel plan:** Hobby (free) — not Pro

## URLs (the same ones you will reuse all semester)

| Item | Value |
| --- | --- |
| GitHub repository (you can push) | `https://github.com/AmmonSwenson/PREIShare-org-repo` |
| Instructor collaborator | `thortek` — write invite sent (pending accept) |
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

## Ship gate (2026-09-08)

Canvas / PAUL want this **same** Production host every sprint — not a Preview (`*-git-*`), not localhost, not a second Hobby project.

| Check | Result |
| --- | --- |
| Sprint work on fork `main` (the repo Vercel is linked to) | Yes — `e2cca58` (`docs: record Vercel Hobby production URL`) |
| GitHub Production deployment for that commit | `env: Production`, SHA `e2cca58`, created `2026-09-08T01:33:04Z` |
| `GET /` and `GET /about` | HTTP 200, TanStack Start Starter HTML |
| Collaborator `thortek` | Write invitation sent (`id` 332102200, not expired). Instructor must accept in GitHub for the name to appear under Settings → Collaborators. |

**PAUL / Canvas paste**

- Website URL: `https://prei-share-org-repo-omega.vercel.app`
- Text: GitHub `https://github.com/AmmonSwenson/PREIShare-org-repo` + collaborator `thortek` added (invitation outstanding until they accept) + reflection in the Canvas text box.
