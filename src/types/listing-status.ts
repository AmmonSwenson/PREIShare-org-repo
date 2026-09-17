/**
 * Closed set of listing lifecycle states from
 * docs/domain/listing-field-inventory.md.
 * Only these exact strings are allowed—no free text, no other casing.
 *
 * `sold` is PREIshare’s closed-deal status (history, not active browse).
 * A sold listing must carry `closedAt`; other statuses must not.
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "under_offer"
  | "sold"
  | "archived";
