/**
 * Core PREIshare investor listing — scalar fields only.
 * Nested types (address, financials, contacts, ownership) and unions
 * (status, property type) are added in later steps.
 *
 * Field names follow docs/domain/listing-field-inventory.md.
 * `summary` is the inventory’s `description` (longer investor-facing copy).
 * `askingPrice` is the inventory’s `financials.askingPrice`, parked here as a
 * scalar until the nested financial summary type exists.
 */
export interface InvestorListing {
  /** Stable unique id for this listing (assigned by the system). */
  id: string;

  /** Short public headline shown in search results and cards. */
  title: string;

  /** Longer plain-text description of the investment opportunity. */
  summary: string;

  /**
   * Asking price in whole US dollars (no currency symbol).
   * Example: 12500000 means $12,500,000.
   */
  askingPrice: number;

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;
}
