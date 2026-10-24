# PREIshare environment variable checklist

**Contract:** `docs/sponsor-auth-requirements.md`  
**Template:** `.env.example` (placeholders only — copy to `.env` or `.env.local`, never commit the copy)

Vite exposes any `VITE_*` variable to the **browser bundle**. Only the public project URL and anon/publishable key may use that prefix. The **service-role** key bypasses Row-Level Security (RLS) and must stay **server-only**.

This file names variables and purposes. It does **not** contain real keys, passwords, JWTs, or connection strings.

## Per-variable table

| Name | Client-safe vs server-only | Used for | Never do this |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | **Client-safe** | Public project URL for browser auth (sign-in/sign-up) and any client Supabase client. Also readable on the server. | Do not put a database password or service-role key in this slot. Placeholder only in `.env.example`. |
| `VITE_SUPABASE_ANON_KEY` | **Client-safe** | Public anon / publishable key for **auth session** in the browser. Safe **only because RLS** still applies — it is not an admin bypass. | Do not treat this as a secret that skips RLS. Do not paste a live JWT here into git. |
| `SUPABASE_URL` | **Server-only** (same URL, no `VITE_` prefix) | Server `process.env` reads in loaders / `createServerFn`. Same project as `VITE_SUPABASE_URL`. | Do not prefix this with `VITE_` as a second public URL unless you intend it in the bundle (use `VITE_SUPABASE_URL` for that). |
| `SUPABASE_ANON_KEY` | **Server-only alias** of the anon key | Sponsor listing **list/create** on the server **as the signed-in user** (anon key + user JWT). RLS still applies. | Do **not** put the service-role value here. Do not import this into React components. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only secret** | **Admin bypass** of RLS. Trusted server/maintenance only — not sponsor listing CRUD in this topic. | **Never** name it `VITE_SUPABASE_SERVICE_ROLE_KEY`. Never import it into browser code, shared React components, committed `.env`, screenshots, or chat. If it leaks, rotate it in the Supabase dashboard. |

## Service-role rule (read this twice)

`SUPABASE_SERVICE_ROLE_KEY` **bypasses RLS**. Anyone who has it can read and write every listing row, ignoring owner checks.

- Read it only in **server-only** modules (for example a server Supabase helper), never in `src/` files that also run in the browser.
- Do not pass it into client components, Vite `import.meta.env`, or a `VITE_` variable.
- Listing create/list for a signed-in sponsor must use the **anon key + the user’s session**, so RLS still runs.

## Git hygiene

| File | Commit? |
| --- | --- |
| `.env.example` | **Yes** — placeholders only |
| `docs/env-var-checklist.md` | **Yes** |
| `.env`, `.env.local`, `.env.*.local` | **Never** |

`.gitignore` must ignore real env files and still track `.env.example`. Confirm with `git check-ignore -v .env` and `git status` before every commit. Do not run `git add .` if a real `.env` is untracked.

## How later steps use this checklist

- Supabase **browser** client: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` only.
- Supabase **server** client for sponsor listings: `SUPABASE_URL` / `SUPABASE_ANON_KEY` + user session — **not** the service-role key.
- Security verification: search the repo and the client bundle for `SUPABASE_SERVICE_ROLE_KEY` **values** (JWT-shaped strings). Names in docs and `.env.example` are expected; live key material is a fail.
