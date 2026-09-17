/**
 * Core PREIshare investor listing — scalars plus closed status/category unions.
 * Nested types (address, financials, contacts, ownership) are added later.
 *
 * Field names follow docs/domain/listing-field-inventory.md.
 * `summary` is the inventory’s `description` (longer investor-facing copy).
 * `askingPrice` is the inventory’s `financials.askingPrice`, parked here as a
 * scalar until the nested financial summary type exists.
 */
import type { ListingStatus } from "./listing-status";
import type { PropertyType } from "./property-type";

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

  /** Lifecycle state; only inventory-approved labels are allowed. */
  status: ListingStatus;

  /** Asset class; only inventory-approved labels are allowed. */
  propertyType: PropertyType;

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;
}
