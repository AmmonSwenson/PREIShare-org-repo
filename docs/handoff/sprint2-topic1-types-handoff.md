# Sprint 2 Topic 1 — Types Handoff: PREIshare Investor Listings

**Audience:** next sprint topic owners, PREIshare eng, product partners  
**Status:** Topic 1 (TypeScript foundations) complete — implementation topics not started  
**Date:** 2026-09-18

This note is a bridge, not a second decision record. For *why* the types look this way, read [ADR-001](../decisions/ADR-001-investor-listing-types.md). For *whether they still pass*, use [the verification checklist](../type-safety/verification-checklist.md).

## 1. Client story recap

PREIshare was shipping investor listing data as loose objects and ad-hoc JSON. That let bad data reach production: missing asking prices, status strings spelled several ways (`Active` / `active` / `ACTIVE`), and nested address fields (especially city) that disappeared on some screens. Investors then saw deals they could not locate, price, or call anyone about.

Sprint 2 Topic 1 modeled investor listings with **strict TypeScript types** so those mistakes fail at **compile time**—while a developer is still building—instead of in front of users. The listing product is **not** done; only the shared data model and proof that invalid shapes fail typecheck.

## 2. What we shipped this topic

| Deliverable | Path | Why it matters |
| --- | --- | --- |
| Domain brief + field inventory | `docs/domain/investor-listing-domain-brief.md`, `docs/domain/listing-field-inventory.md` | Business rules before code; closed lists for status and property type |
| Types package (barrel) | `src/types/index.ts` | Single import surface for `InvestorListing` and related types |
| Core + nested + relationship types | `src/types/*.ts` | `ListingStatus`, `PropertyType`, `Address`, `FinancialSummary`, `InvestorContact`, `Ownership`, discriminated `InvestorListing` |
| Valid fixtures | `src/fixtures/sample-investor-listings.ts` | Five realistic listings (one per status) that type-check |
| Invalid / error cases + expected errors | `src/fixtures/invalid-listings.errors.ts`, `docs/type-safety/expected-type-errors.md` | Prove bad data is rejected (typo status, missing city, string price, sold without `closedAt`, published with no contacts, illegal contact role) |
| Typecheck script + verification checklist | `package.json` (`"typecheck": "tsc --noEmit"`), `docs/type-safety/verification-checklist.md` | Repeatable safety gate |
| Decision record | `docs/decisions/ADR-001-investor-listing-types.md` | Stakeholder-facing type decisions and inventory mismatches |

**How to verify locally:** follow `docs/type-safety/verification-checklist.md` and run `npm run typecheck` from the repo root. Valid fixtures must pass. Intentional invalid cases in `src/fixtures/invalid-listings.errors.ts` must remain type errors as documented; that file is excluded from the default typecheck gate on purpose.

Demo line for stakeholders: **the data model is typed and verified; product surfaces are next.**

## 3. What we must NOT claim is done yet

- No TanStack Start UI or listing **forms** are built or wired to these types.
- No **Supabase / PostgreSQL** tables, migrations, or pgvector work from this model.
- No **HTTP API** routes, request/response validation at the network boundary, or auth rules.
- No runtime schema library (for example Zod) is required by this topic.
- No production deployment of listing create/edit flows.
- Compile-time types still cannot prove `primaryContactId` exists in `contacts`, that `askingPrice` is greater than zero, that `ownershipPercent` is 0–100, or that email/phone are well-formed (see ADR-001).

If a demo only shows green typecheck on fixtures, say: **“the data model is typed and verified; product surfaces are next.”** Do not say “listings are done.”

## 4. Next sprint pickups (use the types — do not reinvent them)

Import from `src/types/index.ts`. Do not copy status strings, property-type labels, or nested shapes into a second unofficial listing type.

### A. TanStack Start forms (UI)

- Build create/edit listing forms whose field names and option lists match `InvestorListing`, `ListingStatus`, and `PropertyType` imported from `src/types/index.ts`.
- Prefer importing those types rather than copying string literals into components.
- Use `src/fixtures/sample-investor-listings.ts` as realistic form defaults and examples (draft through archived).
- Acceptance sketch: a form cannot submit a status outside `draft | published | under_offer | sold | archived` without a type or validation failure during development.

### B. Supabase / PostgreSQL schema alignment (data)

- Draft table columns that mirror required listing fields, nested `Address` / `FinancialSummary` concepts (as columns or related tables), and constrained status/property-type values from `src/types/index.ts`.
- Document any intentional difference between TypeScript optional fields and database NULL rules in a follow-up ADR—do not silently diverge. ADR-001 already notes Topic 1 models **one** `Ownership` object, while the inventory described a list.
- Plan indexes and relationships (contacts, ownership) from the same domain brief that drove the types (`docs/domain/`).
- Acceptance sketch: a row that would fail `InvestorListing` assignment is also rejected by DB constraints or insert validation.

### C. API boundaries (server)

- Define request/response shapes for list/get/create/update that re-export or compose types from `src/types/index.ts` instead of anonymous JSON.
- Keep write endpoints from accepting free-form status strings; align with the same `ListingStatus` union tightened in Topic 1.
- Add tests that send fixture-shaped payloads from `src/fixtures/sample-investor-listings.ts` (valid) and known-bad payloads documented in `docs/type-safety/expected-type-errors.md` (invalid) at the boundary.
- Acceptance sketch: API handlers never widen listing status back to plain `string` without an explicit, documented escape hatch.

```text
Client pain (loose JSON)
        |
        v
 Domain brief + field inventory
        |
        v
 Strict TS types + fixtures + typecheck + ADR-001   <-- you are here
        |
        +--> TanStack Start forms (UI)
        +--> Supabase/PostgreSQL schema (data)
        +--> API routes & validation (boundary)
```

## 5. Prompting and review self-assessment

I (Ammon, types working group) used agents to draft files, then treated every draft as untrusted until it matched the inventory and `src/types`.

- **Prompting habit that helped:** I pasted the field inventory closed lists into prompts (`draft` / `published` / `under_offer` / `sold` / `archived`, not tutorial aliases like `active` / `closed`) and named exact output paths so the agent could not invent a parallel listing shape.
- **Second prompting habit that helped:** I asked for one file at a time and forbade `as InvestorListing` on invalid fixtures, so missing fields stayed as real compiler errors instead of being cast away.
- **Review habit that caught an agent mistake:** I compared every union member and nested field against `docs/domain/listing-field-inventory.md` and `src/types/index.ts` before accepting docs. That is how tutorial names (`state`, `financials`, `name`) were kept out of the types, and how ADR-001’s mapping table was stripped of anything the barrel does not export.
- **What I would do differently next topic:** Put a short “names we actually use” cheat sheet (`summary` not `description`, `financialSummary` not `financials`, `fullName` not `name`) in the *first* prompt of every step, instead of catching alias drift after a draft landed.
- **Confidence (1–5) explaining InvestorListing to a teammate:** 4 — I can walk status unions, nested `Address` / `FinancialSummary`, investor-visible required financials and contacts, and `sold` + `closedAt` without opening every file. I would still open ADR-001 for the ownership-list vs single-object mismatch.

## 6. Handoff checklist for the next owner

- [ ] Read [ADR-001](../decisions/ADR-001-investor-listing-types.md) and this handoff before opening a UI or SQL PR
- [ ] Import listing types from `src/types/index.ts` only
- [ ] Keep `npm run typecheck` green on valid fixtures (`package.json` script `"typecheck": "tsc --noEmit"`)
- [ ] Do not delete `src/fixtures/invalid-listings.errors.ts`; it documents safety (see `docs/type-safety/expected-type-errors.md`)
- [ ] File a new ADR if product changes allowed statuses or required fields
- [ ] Use `docs/type-safety/verification-checklist.md` as the acceptance gate when types change
