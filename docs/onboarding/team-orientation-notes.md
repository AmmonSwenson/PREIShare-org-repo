# PREIshare team orientation notes

## Product

PREIshare helps people make better real-estate decisions by turning property and market data into clear intelligence. The engineering team ships that product as a modern web app (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector). A new contributor joins that shipping loop safely — they do not rewrite the product on day one.

## Definition of done

1. Restate the goal and list the files you will touch.
2. Make the smallest diff that completes the requested task.
3. Verify using only scripts named in `package.json`.
4. Do not merge. Humans review on a GitHub pull request when the team asks for one.

## Conventions

- Match existing naming, file layout, and TypeScript style in neighboring files.
- No drive-by refactors of unrelated modules.
- Do not add libraries unless the human explicitly asks and justifies them.
- Small, clearly scoped docs changes under `docs/` are legitimate first-contributor work.
- When unsure about structure, read this folder and the repo map rather than inventing paths.

## Safety (every agent)

- Never commit `.env`, API keys, tokens, or connection strings.
- Prefer the smallest diff that finishes the task.
- Ask before deleting files.
- Never print secrets into docs, rules, or chat. If configuration is needed, document the variable *name* only (for example `SUPABASE_URL`), not a value.
