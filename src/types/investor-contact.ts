/**
 * A person the team can reach about an investor listing.
 * `fullName` is the inventory’s `contacts[].name`.
 * Role labels match docs/domain/listing-field-inventory.md.
 */
export interface InvestorContact {
  /** Stable id within this listing’s contact list. */
  id: string;

  /** Person or firm name shown on the listing. */
  fullName: string;

  /** Why they appear on the listing (inventory closed list). */
  role: "broker" | "owner_rep" | "property_manager" | "sponsor";

  /** Reachable email (required identity channel for this step). */
  email: string;

  /** Optional — not every contact shares a phone. */
  phone?: string;
}
