/**
 * Who owns the property and how ownership is described for PREIshare.
 * This step models one ownership record on the listing (owner name / entity).
 * Relationship labels match docs/domain/listing-field-inventory.md.
 */
export interface Ownership {
  /** Person or entity name shown on the listing. */
  ownerName: string;

  /** Relationship to the asset (inventory closed list). */
  relationship: "primary_owner" | "co_owner" | "broker" | "property_manager";

  /** Optional free-text about splits, trusts, or co-owners. */
  notes?: string;

  /** When known, percent owned by this owner (0–100). */
  ownershipPercent?: number;
}
