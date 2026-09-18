# Investor listing types — verification checklist

Use this list before review. Check each box only when you have evidence. Field names and status labels below match **this repo**, not the tutorial’s sample aliases (`published` not `active`, `sold` not `closed`, `region` not `state`, `financialSummary` not `financials`).

Evidence for this pass: `npm run typecheck` at the project root (exit 0) on 2026-09-18 after the typecheck README and this checklist landed.

## A. Domain coverage

- [x] Every required inventory identity field appears on `InvestorListing` or a nested type it uses: `id`, `title`, `summary` (inventory `description`), `status`, `propertyType`, `createdAt`, `updatedAt`.
- [x] Listing status values match the inventory closed list only: `draft`, `published`, `under_offer`, `sold`, `archived` (`src/types/listing-status.ts`). No free-form strings.
- [x] Property type values match the inventory closed list only: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` (`src/types/property-type.ts`).
- [x] Address nested shape matches the inventory: `line1`, optional `line2`, `city`, `region`, `postalCode`, `country` (`src/types/address.ts`). Core pin fields are required.
- [x] Financial summary nested shape matches the inventory: required `askingPrice` (number) and `currency: "USD"` when the object is present; optional `projectedIrrPercent` and `capRatePercent` (`src/types/financial-summary.ts`). Listing property name is `financialSummary`.
- [x] Investor contact fields match the brief/inventory: `id`, `fullName` (inventory `name`), closed `role`, required `email`, optional `phone` (`src/types/investor-contact.ts`).
- [x] Ownership fields match the brief/inventory: `ownerName`, closed `relationship`, optional `notes` and `ownershipPercent` (`src/types/ownership.ts`). Listing also has `primaryContactId` (this step’s primary-contact rule).
- [x] Extra listing field `closedAt` exists only on the `sold` (closed-deal) branch — domain: sold deals are retained history and must record when they closed.

## B. Type safety shape

- [x] Public types are re-exported from `src/types/index.ts`: `InvestorListing`, `InvestorListingBase`, `ClosedInvestorListing`, `OpenInvestorListing`, `ListingStatus`, `PropertyType`, `Address`, `FinancialSummary`, `InvestorContact`, `Ownership`.
- [x] Discriminated union: `status` picks the branch. `sold` requires `closedAt`; other statuses set `closedAt?: undefined`. Investor-visible statuses (`published`, `under_offer`, `sold`) require `financialSummary` and at least one contact.
- [x] Readonly intent: `id`, `createdAt`, and `updatedAt` are `readonly` on `InvestorListingBase`. Title, price, and contacts stay writable.
- [x] Intentional failures in `docs/type-safety/expected-type-errors.md` still match the union/nested rules above.

## C. Fixtures

- [x] `src/fixtures/sample-investor-listings.ts` typechecks cleanly and includes five realistic listings: draft, published, under_offer, sold, archived.
- [x] `src/fixtures/invalid-listings.errors.ts` still demonstrates the six named cases in `docs/type-safety/expected-type-errors.md` (`invalidStatusSpelling`, `missingAddressCity`, `priceAsString`, `soldMissingClosedAt`, `publishedEmptyContacts`, `invalidContactRole`).
- [x] Expected-error notes use this repo’s field names (`region`, `financialSummary`, `fullName`, `ownerName`) and statuses (`sold`, `published`), not stale tutorial aliases.

## D. Typecheck gate

- [x] `package.json` defines `"typecheck": "tsc --noEmit"` (check only; no compiled output).
- [x] Running `npm run typecheck` from the project root succeeds for valid sources (exit 0).
- [x] `src/fixtures/invalid-listings.errors.ts` is listed in `tsconfig.json` `exclude`, so it is not required to pass the normal gate.
- [x] `src/types/README.md` Typecheck section explains the command, success (exit 0), what the gate covers, and that intentional invalid fixtures stay on a separate review path.

## E. Sign-off

- [x] I re-ran `npm run typecheck` after these doc/script updates.
- [x] A teammate can run the gate from `src/types/README.md` without a verbal walkthrough of secret steps.

## tsconfig note (for reviewers)

Default `include` still covers `src/**/*.ts` (types, valid fixtures, and the app). The only extra exclude beyond `node_modules` and `dist` is `src/fixtures/invalid-listings.errors.ts`, so the clean gate can pass while that file remains in the repo for documented failures.
