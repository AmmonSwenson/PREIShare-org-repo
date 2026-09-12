# Listing Field Inventory (PREIshare)

Use this table as the source of truth when defining later data shapes. Field names are suggestions those shapes may adopt; **meanings, closed lists, nested groups, and required vs optional rules are mandatory**.

This inventory contains **no programming syntax**. Shapes are described in business language only: text, number, datetime, yes/no, fixed choice, nested object, or list.

**Investor-visible statuses** (`published`, `under_offer`, `sold`) must satisfy every “yes” and “yes for investor-visible” rule. `draft` may omit fields marked “yes for investor-visible.” `archived` is not shown in active browse; it still uses these same field names and closed lists.

## Identity and classification

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| id | Stable unique id for the listing | text | yes | `lst_ev_1001` |
| title | Short name shown to investors | text | yes | `Riverfront Multifamily Offering` |
| description | Longer investor-facing summary | text | yes for investor-visible | `Value-add asset near transit with in-place cash flow.` |
| status | Lifecycle state | fixed choice | yes | **Only** `draft`, `published`, `under_offer`, `sold`, `archived` |
| propertyType | Asset class | fixed choice | yes | **Only** `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` |
| createdAt | When the listing record was created | datetime | yes | `2026-03-01T10:00:00Z` |
| updatedAt | Last meaningful edit | datetime | yes | `2026-03-15T16:30:00Z` |

Status and property classification are **closed lists**. Do not store synonyms, mixed case variants, or free-text labels.

## Address (nested object)

`address` is a nested object, not a single string and not a set of loose top-level fields.

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| address | Street location of the property | nested object | yes for investor-visible | (group below) |
| address.line1 | Street number and name | text | yes for investor-visible | `500 River Rd` |
| address.line2 | Unit, suite, or floor if any | text | no | `Suite 200` |
| address.city | City | text | yes for investor-visible | `Austin` |
| address.region | State, province, or region | text | yes for investor-visible | `TX` |
| address.postalCode | Postal code | text | yes for investor-visible | `78701` |
| address.country | Country (prefer two-letter code) | text | yes for investor-visible | `US` |

An investor-visible listing with any of line1, city, region, postalCode, or country empty is invalid.

## Financial summary (nested object)

`financials` is a nested object. Percents use a 0–100 scale (twelve and a half percent is `12.5`, not `0.125`). Asking price is a major-unit amount (dollars), not cents.

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| financials | Money-related summary for the offering | nested object | yes for investor-visible | (group below) |
| financials.askingPrice | Listed price amount, greater than zero when required | number | yes for investor-visible | `12500000` |
| financials.currency | Currency code | fixed choice | yes for investor-visible | **Only** `USD` in this version |
| financials.projectedIrrPercent | Optional projected IRR on the 0–100 scale | number | no | `12.5` |
| financials.capRatePercent | Optional cap rate on the 0–100 scale | number | no | `5.8` |

Unknown status plus a missing asking price is the classic “unsafe to show investors” case. Do not replace this group with a free-text “price notes” field.

## Investor contacts (list of nested objects)

`contacts` is a **list**. A valid investor-visible listing needs **at least one** entry. An empty list is allowed only on `draft` (and is still unsafe to publish).

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| contacts | People or firms investors can reach about this listing | list | yes for investor-visible (min 1) | (list of contact objects) |
| contacts[].id | Stable id for this contact row, unique within the listing | text | yes (each contact) | `ctc_jordan_lee` |
| contacts[].name | Person or firm name | text | yes (each contact) | `Jordan Lee` |
| contacts[].role | Why they appear on the listing | fixed choice | yes (each contact) | **Only** `broker`, `owner_rep`, `property_manager`, `sponsor` |
| contacts[].email | Email if used | text | at least one of email or phone | `jordan@example.com` |
| contacts[].phone | Phone if used | text | at least one of email or phone | `+1-512-555-0142` |

A contact with neither email nor phone is invalid. Role is not free text.

## Ownership (list of nested objects tied to contacts)

`ownership` is a **list**, not a single string. Each row points at one contact by id. For investor-visible statuses, every `contacts[]` entry has exactly one matching ownership row.

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| ownership | How contacts relate to the asset | list | yes for investor-visible | (list of ownership rows) |
| ownership[].contactId | Which contact the row refers to; must match a `contacts[].id` | text | yes (each row) | `ctc_jordan_lee` |
| ownership[].relationship | Relationship to the asset | fixed choice | yes (each row) | **Only** `primary_owner`, `co_owner`, `broker`, `property_manager` |
| ownership[].sharePercent | Optional ownership share on the 0–100 scale | number | no | `60` |

Share percent, when present, is a number from 0 through 100. Relationship is not free text. Do not identify owners only by display name (names can collide); use `contactId`.

## Inventory rules (must hold)

1. Do not invent extra top-level groups beyond identity, `address`, `financials`, `contacts`, and `ownership` without updating the domain brief.
2. `status` and `propertyType` remain closed lists—never free text.
3. `address` and `financials` are nested objects, not flat optional strings only.
4. `contacts` is a list; a valid `published`, `under_offer`, or `sold` listing needs at least one contact with a reachable channel.
5. `ownership` is a list tied to contacts by `contactId`; relationship values are a closed list.
6. Every required field above must appear in later data definitions unless a written decision record deliberately relaxes it.
7. Expanding a closed list (status, property classification, currency, contact role, ownership relationship) requires editing **both** this inventory and `docs/domain/investor-listing-domain-brief.md` in the same change.
