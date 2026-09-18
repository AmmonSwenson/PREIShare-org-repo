# PREIshare investor listing types

This folder holds **shared TypeScript types** for PREIshare investor listings.

## Why this exists

A PREIshare listing is a property opportunity an investor can review—not a blob of notes. Investors rely on complete, consistent data: they must be able to locate the property, trust the asking price, and reach a human. Loose objects and ad-hoc JSON let bad data reach production (missing price, status spelled three ways, nested address fields that vanish on one screen). These types catch those mistakes at **compile time**—before users see them.

## What belongs here

- Domain type modules only (listing, address, status, contacts, ownership)
- No UI components, no API route handlers, no database clients

`InvestorListing` is a status-discriminated union on a shared base: `sold` requires `closedAt`; other statuses forbid a real close date. `id`, `createdAt`, and `updatedAt` are `readonly`. Import public types from `index.ts`.

## Typecheck

From the project root, after `npm install`, run:

```bash
npm run typecheck
```

That is the team’s clean gate. It runs `tsc --noEmit`: TypeScript **checks types only** and does **not** write compiled JavaScript files.

**What success looks like:** the command finishes with no type errors (exit code 0).

What the clean gate covers:

- Public types under `src/types/` (including `index.ts`)
- Valid samples in `src/fixtures/sample-investor-listings.ts`

What it does **not** require to pass:

- `src/fixtures/invalid-listings.errors.ts` — intentional bad listings. `tsconfig.json` excludes this file so a misspelled status cannot fail the team gate. Those red errors are documented in `docs/type-safety/expected-type-errors.md`. Open the invalid file in the editor to see them; do not “fix” that file so it compiles.

Before review, walk `docs/type-safety/verification-checklist.md`.

## Strict mode (plain language)

`strict: true` in `tsconfig.json` turns on the checker’s safest rules. It refuses accidental `any`, missing properties, and skipped null checks. Combined with flags like `noUncheckedIndexedAccess`, it also refuses “I indexed this list and assumed a value is always there.” That is what PREIshare needs so a missing asking price or a misspelled status fails here instead of on a live listing.

## Source of truth

Business vocabulary and field rules come from:

- `docs/domain/investor-listing-domain-brief.md`
- `docs/domain/listing-field-inventory.md`

If a later type allows a status, field, or nested shape not listed there, the type is wrong.
