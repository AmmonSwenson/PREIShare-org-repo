# Investor Listing Domain Brief (PREIshare)

## Purpose

Define what an investor listing is in PREIshare business language so later coding steps match real workflows—not invented fields.

A listing is a **property opportunity** an investor can review. It is not a blob of notes. It always has identity (id, title), a **closed** lifecycle status, a **closed** property classification, a nested street address, a nested money summary, a list of investor contacts, and ownership rows that tie those contacts to the asset.

## Actors

- **Listing editor (internal ops)** — creates and updates listings before investors see them. May save incomplete `draft` records.
- **Investor (end user)** — browses listings that are safe to show (`published` or `under_offer`; historically `sold`). Relies on complete, consistent data: locate the property, trust the asking price, reach a human.
- **Reviewer / compliance** — checks that status, asking price, address, and contact info are trustworthy before a listing leaves `draft`.
- **Future systems** — website UI, API, and database will all read the same listing shape. They must not invent a catch-all “details” field.

## Business goals

- One shared definition of a listing across screens and teammates.
- Catch missing or invalid data before production (once later coding steps exist).
- Support nested real-world data: address, financial summary, investor contacts, ownership.
- Keep status and property classification as **small closed lists** so the product never stores three spellings of the same state.

## Listing lifecycle statuses (allowed values only)

These five values are the **entire** status list. Free-text status is not allowed. Do not add aliases (`live`, `active`, `under offer`, `UNDER_OFFER`).

| Status | Meaning | Investor-visible in active browse? |
| --- | --- | --- |
| `draft` | Internal only; editor may still be filling address, price, or contacts. | No |
| `published` | Approved opportunity; must meet full validity rules below. | Yes |
| `under_offer` | Active interest on a still-structured listing (same completeness as published). | Yes |
| `sold` | Closed deal; retained for history. Completeness matches published. | History only (not active browse) |
| `archived` | Removed from active browse; not deleted. Identity and last known nested groups remain. | No |

**Investor-visible statuses** in this brief means `published`, `under_offer`, and `sold`. Those three must pass every success criterion. `draft` and `archived` still use the same field names and the same closed lists; they may omit fields that are required only for investor-visible statuses (see criterion 8).

## Nested data groups

Do not flatten these into one vague “details” or “metadata” bucket.

- **Address** — nested object: street line(s), city, region/state, postal code, country. Incomplete address is unsafe to show investors.
- **Financial summary** — nested object: asking price (a number), currency (closed code list), optional projected return metrics the team agrees to track (IRR percent, cap rate percent). Missing or non-numeric asking price is unsafe to show investors.
- **Investor contacts** — a **list** of nested objects (name, role from a closed list, email and/or phone). At least one entry is required for investor-visible statuses.
- **Ownership** — a **list** of nested objects tying a contact to the asset (relationship from a closed list, optional share percent). Each contact on an investor-visible listing has exactly one ownership row.

## Core identity fields (high level)

- Stable listing id
- Human-readable title
- Property classification from the closed set: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` (no free text)
- Status from the lifecycle list above
- Short description for investors (required once the listing is investor-visible)
- Created and updated timestamps (business concepts; storage format is decided in a later step, not here)

## Success criteria — “a valid investor listing”

Use this numbered list as the checklist for later work. A listing that fails any applicable item is not valid.

1. Has a non-empty id and a non-empty title.
2. Status is exactly one of: `draft`, `published`, `under_offer`, `sold`, `archived` (no free-text variants, no extra values).
3. Property classification is exactly one of: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`.
4. Address is a nested object and, for investor-visible statuses, includes street line 1, city, region/state, postal code, and country so the property can be located. Line 2 (unit/suite) may be absent.
5. Financial summary is a nested object and, for investor-visible statuses, includes a numeric asking price greater than zero and a currency code from the closed list (`USD` in this version).
6. Contacts is a list. For investor-visible statuses there is at least one contact; each contact has a non-empty name and at least one reachable channel (email or phone).
7. Ownership is a list. For investor-visible statuses, each contact has one ownership row whose relationship is exactly one of: `primary_owner`, `co_owner`, `broker`, `property_manager` (not free text). Share percent, if present, is a number from 0 through 100.
8. Optional fields may be absent. For `published`, `under_offer`, and `sold`, required fields in criteria 1–7 must never be missing. `draft` must still have id, title, status, and property classification; nested groups may be incomplete until publish. `archived` keeps the same shape; it is not shown in active browse.

A listing is **unsafe to show investors** if status is unknown or free text, the address cannot locate the property, asking price or currency is missing, or there is no reachable contact.

## Out of scope for this topic

- Building UI forms, API routes, or database tables.
- Authentication, payments, or document uploads.
- Map geometry, photos, offering memorandums, or chat threads.
- Exact programming syntax (comes in later steps).

## Handoff note

Later steps must honor this brief and the companion field inventory at `docs/domain/listing-field-inventory.md`. If a later definition allows a status, property classification, contact role, ownership relationship, or currency not listed here, that definition is wrong. If it flattens address or financials into optional strings, or treats contacts as a single object instead of a list, that definition is wrong.
