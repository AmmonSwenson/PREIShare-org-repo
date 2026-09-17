import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { ListingStatus } from "./listing-status";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing.
 * Nested address is required so a map pin always has a location.
 * Nested financials may be omitted on a draft while underwriting is incomplete.
 *
 * Field names follow docs/domain/listing-field-inventory.md.
 * `summary` is the inventory’s `description`.
 * `financialSummary` is the inventory’s `financials` group.
 */
export interface InvestorListing {
  /** Stable unique id for this listing (assigned by the system). */
  id: string;

  /** Short public headline shown in search results and cards. */
  title: string;

  /** Longer plain-text description of the investment opportunity. */
  summary: string;

  /** Lifecycle state; only inventory-approved labels are allowed. */
  status: ListingStatus;

  /** Asset class; only inventory-approved labels are allowed. */
  propertyType: PropertyType;

  /**
   * Physical location. Required even when financials are still missing—
   * a listing without a locateable address is unsafe to show investors.
   */
  address: Address;

  /**
   * Deal metrics. Optional as a whole object so drafts can exist before
   * asking price and returns are underwritten. When present, askingPrice
   * and currency inside FinancialSummary are required.
   */
  financialSummary?: FinancialSummary;

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;
}
