/**
 * Closed set of listing lifecycle states from
 * docs/domain/listing-field-inventory.md.
 * Only these exact strings are allowed—no free text, no other casing.
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "under_offer"
  | "sold"
  | "archived";
