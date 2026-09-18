# ADR-001: Investor listing TypeScript types (PREIshare)

- **Status:** Accepted (Sprint 2, Topic 1)
- **Date:** 2026-09-18
- **Owners:** PREIshare types working group (Ammon Swenson + coach)
- **Related code:** `src/types/index.ts` (front door for all public listing types)

## Context

PREIshare listings describe property opportunities investors can review. When those listings were loose objects or ad-hoc JSON, production could accept a missing asking price, a status spelled three ways (`Active` / `active` / `ACTIVE`), or an address that dropped city on one screen. Investors then saw deals they could not locate, price, or call anyone about.

Sprint 2 Topic 1 models that domain with strict TypeScript types so those mistakes fail at **compile time**—before a form or API ships. This record explains the choices to product/ops partners and to the next sprint’s implementers. It does not invent new types.

Business inputs:

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Safety evidence: `docs/type-safety/expected-type-errors.md` and `docs/type-safety/verification-checklist.md`

## Decision

We keep a small types package centered on `InvestorListing`. Supporting types cover listing status, property type, address, financial summary, investor contacts, and ownership. Call sites should import from `src/types/index.ts` rather than picking files at random.

Three decisions that matter most to a non-engineer:

1. **Status and property kind are closed lists.** TypeScript rejects any spelling that is not on the agreed list.
2. **Location, money, and people travel as grouped objects**—not a pile of leftover strings on the listing.
3. **What investors can see is stricter than a draft.** A published, under-offer, or sold listing must have financials and at least one contact. A **sold** listing must also record `closedAt` (when the deal closed). `id`, `createdAt`, and `updatedAt` are `readonly` so ordinary code does not rewrite identity.

## Type choices mapped to business rules

| Business rule (plain language) | Type choice | Why this shape |
| --- | --- | --- |
| Every listing has a stable id, title, investor-facing summary, timestamps, address, contacts list, primary-contact id, and ownership | Required fields on `InvestorListingBase` (summary is the inventory’s `description`) | Optional identity reintroduces “we do not know which listing this is” bugs |
| Asking price and currency must be numeric/structured money, not a sentence | Nested `FinancialSummary` with `askingPrice: number` and `currency: "USD"` | String prices cannot be compared; currency is closed to USD in this version |
| Drafts may omit money; investors must never see a listing without a price | `financialSummary` optional on `draft` / `archived`; **required** on `published`, `under_offer`, and `sold` | Matches “unsafe to show investors” in the domain brief |
| Workflow status may only be known values | `ListingStatus` string union: `draft`, `published`, `under_offer`, `sold`, `archived` | Free `string` allows typos (`availble`) and three spellings of the same state |
| Property category is a closed vocabulary | `PropertyType` string union: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` | Same reason as status |
| Street, city, region, postal code, and country travel together | Nested `Address`: required `line1`, `city`, `region`, `postalCode`, `country`; optional `line2` (unit/suite) | Prevents a pin with no city; `Address` is required on every listing |
| Who to call is structured people data | `contacts: InvestorContact[]` plus `primaryContactId: string`. Each contact has `id`, `fullName`, closed `role` (`broker`, `owner_rep`, `property_manager`, `sponsor`), required `email`, optional `phone` | Stops “contact” from being a random blob; TypeScript cannot prove the primary id exists in the array (runtime follow-up) |
| Investor-visible listings need at least one person | Non-empty contacts on `published`, `under_offer`, and `sold` | Empty `contacts: []` on a published listing is a type error |
| Ownership is first-class, not a footnote | `Ownership` with required `ownerName` and closed `relationship` (`primary_owner`, `co_owner`, `broker`, `property_manager`); optional `notes` and `ownershipPercent` | Captures who owns the asset; Topic 1 models **one** ownership record (the inventory also described a list—see Follow-ups) |
| A sold (closed) deal must record when it closed; other statuses must not carry a fake close date | Discriminated union on `status`: `sold` requires `closedAt`; other statuses set `closedAt?: undefined` | Helpers: `ClosedInvestorListing` (`status: "sold"`) and `OpenInvestorListing` |
| Identity and audit stamps should not be rewritten in ordinary app code | `readonly id`, `readonly createdAt`, `readonly updatedAt` | Title, contacts, and financials stay updatable |

## Alternatives considered

1. **Keep listings as `string` / `any` / untyped JSON**  
   Rejected: fastest short term, but every bug waits until production.

2. **One giant flat interface with dozens of optional fields**  
   Rejected: optional everything recreates missing-field bugs; flat shapes hide address and money structure.

3. **TypeScript `enum` objects for every closed vocabulary**  
   Avoided for this beginner package. String unions stay easy to read in fixtures and error messages. Revisit only if runtime enum objects become a clear need.

4. **A runtime schema library (for example Zod) as the source of truth in this topic**  
   Out of scope for Topic 1. Compile-time types and fixtures come first; runtime validators can wrap the same decisions later.

## Consequences

**Positive**

- `src/fixtures/invalid-listings.errors.ts` shows the compiler rejecting: bad status spelling, missing `address.city`, asking price as a string, sold without `closedAt`, published with no contacts, and an illegal contact role (see `docs/type-safety/expected-type-errors.md`).
- `src/fixtures/sample-investor-listings.ts` constructs five realistic listings (one per `ListingStatus`).
- `npm run typecheck` (`tsc --noEmit`) is the shared clean gate. The invalid-fixtures file is excluded from that gate on purpose.

**Tradeoffs**

- Authors must use exact union members; “almost right” strings fail typecheck by design.
- Nested objects mean fixtures and future API mappers supply whole `Address` / `FinancialSummary` objects, not scattered fields.
- Discriminated status and `readonly` add a small learning curve in exchange for stronger guarantees.

**Still not compile-time** (honest limits; do not pretend the types do this yet):

- `primaryContactId` matching a `contacts[].id`
- Asking price greater than zero (type is `number`, so `0` still typechecks)
- `ownershipPercent` between 0 and 100
- Email/phone format

## Out of scope for Sprint 2 Topic 1

- Database tables, migrations, or Supabase row types
- HTTP API routes and request/response validation at runtime
- React form components and client-side validation UX
- Authentication, authorization, and multi-tenant rules
- pgvector / search indexing fields beyond this listing model
- Changing production data or deploying a new service
- A second Hobby Vercel project (production stays the existing PREIshare host)

## Follow-ups (for the next topic / implementers)

1. Import domain types from `src/types/index.ts` when building UI or API layers.
2. Keep sample fixtures green under `npm run typecheck` before expanding the model.
3. If product adds a listing status or property type, extend the **union**, fixtures, expected-error notes, and this ADR—do not widen the field back to free `string`.
4. Consider runtime validators that mirror these types once API boundaries land (including primary-contact id membership and numeric ranges).
5. If product needs several ownership rows per listing (as the original inventory list described), evolve `Ownership` into a list **and** update this ADR in the same change.
6. Use `docs/type-safety/verification-checklist.md` as the acceptance gate when types change.

### Known differences from the field inventory (types win)

The inventory is still the business glossary. Topic 1 types are stricter or renamed in a few places. Do not “fix” the types back to looser inventory wording without a new ADR.

| Inventory / brief | What `src/types` actually does | Why it is called out |
| --- | --- | --- |
| Field `description` | Listing field is `summary` | Same meaning; name chosen in the types package |
| Nested group `financials` | Listing field is `financialSummary` | Same nested money object; name chosen in the types package |
| `contacts[].name` | `InvestorContact.fullName` | Same person/firm label |
| Address and description optional on `draft` | `address` and `summary` are required on every listing, including draft/archived | Types refuse a listing that cannot be located or titled, even internally |
| Contact needs email **or** phone | `email` is always required; `phone` is optional | Compile-time cannot express “at least one of two fields” without extra machinery |
| `ownership` is a **list** of rows with `contactId` and `sharePercent` | One `Ownership` object with `ownerName` and `ownershipPercent`; plus listing-level `primaryContactId` | Topic 1 models a single owner record; a list + `contactId` is a follow-up |
| `primaryContactId` not in the inventory table | Required `string` on every listing | Marks who to call first; membership in `contacts` is still a runtime hole |

## Evidence links

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Expected compile errors: `docs/type-safety/expected-type-errors.md`
- Verification checklist: `docs/type-safety/verification-checklist.md`
- Types entrypoint: `src/types/index.ts`
- Valid samples: `src/fixtures/sample-investor-listings.ts`
- Invalid proof (must fail typecheck): `src/fixtures/invalid-listings.errors.ts`
