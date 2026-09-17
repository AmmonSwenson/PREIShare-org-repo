import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { ListingStatus } from "./listing-status";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing.
 * Nested address is required so a map pin always has a location.
 * Nested financials may be omitted on a draft while underwriting is incomplete.
 * Contacts and ownership attach people so a listing is not an anonymous blob.
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

  /** One or more people associated with this listing. */
  contacts: InvestorContact[];

  /**
   * Must match InvestorContact.id of one entry in `contacts`.
   * TypeScript cannot fully enforce "id exists in array" alone;
   * we still type it as string so callers pass an id, not a whole loose object.
   */
  primaryContactId: string;

  /** Who owns the asset and how that ownership is described. */
  ownership: Ownership;

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;
}
