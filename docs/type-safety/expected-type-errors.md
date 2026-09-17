# Expected type errors for invalid investor listings

`src/fixtures/invalid-listings.errors.ts` is **supposed to fail** typechecking. Those red errors are proof the model rejects bad PREIshare data. Do not “fix” that file so it compiles.

Happy-path samples live in `src/fixtures/sample-investor-listings.ts` and must stay valid.

The main `npm run typecheck` script excludes the invalid file (see `tsconfig.json`) so the rest of the project can stay green. A later step can typecheck the invalid file on purpose and treat failures as expected proof.

## Documented rejection cases

| id | business problem | rule that should catch it | expected TS kind |
| --- | --- | --- | --- |
| `invalidStatusSpelling` | Status typo (`availble`) would break filters and show three spellings of the same state | `ListingStatus` string union | invalid string literal (not assignable to `ListingStatus`) |
| `missingAddressCity` | City required to place a map pin; incomplete address is unsafe to show | `Address.city` required string | missing property `city` |
| `priceAsString` | Asking price must be a number so math and comparisons work | `FinancialSummary.askingPrice: number` | type `"610000"` not assignable to `number` |
| `soldMissingClosedAt` | A sold (closed) deal must record when it closed | Discriminated union: `status: "sold"` requires `closedAt` | missing property `closedAt` |
| `publishedEmptyContacts` | Investor-visible listings need someone to call | `published` / `under_offer` / `sold` require a non-empty `contacts` tuple | empty array not assignable to `[InvestorContact, ...]` |
| `invalidContactRole` | Free-text role (`primary`) is not a PREIshare contact role | `InvestorContact.role` closed list | invalid string literal |

## Hole hunt (this step)

Reviewed `InvestorListing` and nested types against the domain brief.

**Tightened (matches rules we already agreed):**

- Investor-visible statuses (`published`, `under_offer`, `sold`) now require `financialSummary` and at least one contact. Draft/archived may still omit financials and may have an empty contacts list.

**Still not compile-time (TypeScript has no range or “id exists in array” checks without extra machinery):**

- `primaryContactId` is a `string`; the checker cannot prove it matches a `contacts[].id`
- `askingPrice` can be `0` or negative even though the brief wants greater than zero
- `ownershipPercent` can be `150` even though the brief wants 0–100
- Email/phone are strings, not format-checked

Those remaining holes are runtime or later-validation work. This step does not invent branded numeric types.

## Notes

- Do not add `any`, `@ts-ignore`, or `as unknown as InvestorListing` to the invalid file.
- Update this table if you add or remove invalid exports.
- Field names in the invalid file match the real types (`region`, `financialSummary`, `fullName`, `ownerName`), not the tutorial’s sample aliases.
