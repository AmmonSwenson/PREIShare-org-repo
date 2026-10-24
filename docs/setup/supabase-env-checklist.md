# Supabase environment setup checklist (PREIshare Sprint 4)

## Purpose

Configure the Supabase project URL and API keys for this TanStack Start
dashboard so later steps can add sponsor login and Postgres listings **without**
shipping the service-role key to the browser.

This step is configuration only. Do not add login UI, tables, or a Supabase
client until later sprint steps.

## Source requirements

`docs/requirements/sponsor-auth-and-listings-brief.md` — authentication,
listings in Postgres, and the server-only secrets boundary.

## Where to click in Supabase

1. Sign in at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a new project for PREIshare (or open the empty project for this sprint).
   Wait until the project shows as ready (provisioning can take a minute).
3. Open **Project Settings → API** (some dashboards say **Data API** or **API Keys**).
4. Copy these three values into a **private** note (password manager), not into Git:
   - **Project URL** — example shape `https://<ref>.supabase.co`
   - **anon** / **publishable** key — browser-safe when RLS is on
   - **service_role** / **secret** key — bypasses RLS; treat like a password
5. Store the **database password** you chose at project creation in a password
   manager. It is not an API key and must not go in the repo.

If the dashboard says “Publishable” instead of “anon”, use it as the public
client key. If it says “secret” instead of “service_role”, that is the
server-only key.

## Repo files

| File | Commit? | What goes in it |
| --- | --- | --- |
| `.env.example` | **Yes** | Placeholder names only (`your-project-ref`, `your-anon-or-publishable-key`, `your-service-role-key`) |
| `docs/setup/supabase-env-checklist.md` | **Yes** | This checklist |
| `.env.local` or `.env` | **Never** | Real URL and keys, copied from the dashboard |
| `.gitignore` | **Yes** | Must ignore `.env`, `.env.*`, and `*.local` (keep `!.env.example`) |

Local setup:

```bash
cp .env.example .env.local
# paste real values from Project Settings → API into .env.local
```

Then run `git status`. The real env file must **not** appear as a file to add.

## Public vs server-only rules

This app uses **Vite’s `VITE_` prefix** for anything allowed in the browser
(`import.meta.env.VITE_*`). Server-only values are read with `process.env`
inside `createServerFn` / `createServerOnlyFn` / loaders — never at module
scope in a file that also runs on the client.

| Variable | Prefix | Where it may be used |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `VITE_` (public) | Browser or server |
| `VITE_SUPABASE_ANON_KEY` | `VITE_` (public) | Browser or server; still subject to RLS |
| `SUPABASE_URL` | none | Server only (same URL, no public prefix) |
| `SUPABASE_ANON_KEY` | none | Server only (same anon key, optional alias) |
| `SUPABASE_SERVICE_ROLE_KEY` | **none** | **Server only.** Must never be `VITE_SUPABASE_SERVICE_ROLE_KEY`. |

Checks:

- [ ] Browser-safe vars use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has **no** public/client prefix
- [ ] No file under `src/` that runs in the browser reads `SUPABASE_SERVICE_ROLE_KEY`
- [ ] This checklist and `.env.example` contain **zero** real key material
- [ ] The service-role key must **never ship in the client bundle**

## Checklist

### Supabase project

- [ ] Supabase project created (or selected) for PREIshare
- [ ] Project URL copied from Project Settings → API
- [ ] anon/public (publishable) key copied
- [ ] service_role key copied and stored **only** in a local untracked env file
- [ ] Database password stored in a password manager (not in the repo)

### Repo files

- [ ] `.env.example` committed with placeholder values only
- [ ] Local `.env` or `.env.local` created from the example and filled with real values
- [ ] `.gitignore` includes `.env`, `.env.*`, and `*.local`, with `!.env.example`
- [ ] `git status` does not list the real env file as something to add
- [ ] `git check-ignore -v .env .env.local` reports an ignore rule

### Smoke checks before feature work

- [ ] Restart the dev server after creating or editing the local env file
- [ ] App still starts (`npm run dev` / existing Vite command)
- [ ] Search the **tracked** repo for your real service_role key string — **zero** hits
- [ ] Confirm you did **not** name the service-role variable with `VITE_`

## Handoff notes

- Hosting providers (for example Vercel) need the same split: `VITE_*` for the
  client build, `SUPABASE_SERVICE_ROLE_KEY` only in server/runtime secret
  storage — never as a `VITE_` variable.
- Next steps in this sprint: data model, migrations/RLS, then Supabase clients
  that read **these same variable names**. Do not invent a second set of env keys.
- Do not add login pages, listing tables, or extra third-party services in this
  configuration step.
