# PREIshare investor listing types

This folder holds **shared TypeScript types** for PREIshare investor listings.

## Why this exists

A PREIshare listing is a property opportunity an investor can review—not a blob of notes. Investors rely on complete, consistent data: they must be able to locate the property, trust the asking price, and reach a human. Loose objects and ad-hoc JSON let bad data reach production (missing price, status spelled three ways, nested address fields that vanish on one screen). These types catch those mistakes at **compile time**—before users see them.

## What belongs here

- Domain type modules only (listing, address, status, contacts, ownership)
- No UI components, no API route handlers, no database clients

`investor-listing.ts` exports the core `InvestorListing` interface. Status and property category are named string unions in `listing-status.ts` and `property-type.ts`. Location lives on required `address` (`address.ts`); deal metrics live on optional `financialSummary` (`financial-summary.ts`). Contacts and ownership come later.

## How to check types

From the project root after `npm install`:

```bash
npm run typecheck
```

That runs `tsc --noEmit`: TypeScript checks files under `src/` and reports errors without writing JavaScript output files.

## Strict mode (plain language)

`strict: true` in `tsconfig.json` turns on the checker’s safest rules. It refuses accidental `any`, missing properties, and skipped null checks. Combined with flags like `noUncheckedIndexedAccess`, it also refuses “I indexed this list and assumed a value is always there.” That is what PREIshare needs so a missing asking price or a misspelled status fails here instead of on a live listing.

## Source of truth

Business vocabulary and field rules come from:

- `docs/domain/investor-listing-domain-brief.md`
- `docs/domain/listing-field-inventory.md`

If a later type allows a status, field, or nested shape not listed there, the type is wrong.
