import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

/** Fields every investor listing has, regardless of status. */
export interface InvestorListingBase {
  /** Stable identity — do not reassign after create. */
  readonly id: string;

  /** Set once when the row is created. */
  readonly createdAt: string;

  /** May change when the listing is edited; still not a business key. */
  readonly updatedAt: string;

  /** Short public headline shown in search results and cards. */
  title: string;

  /** Longer plain-text description of the investment opportunity. */
  summary: string;

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
}

/**
 * Discriminated union: TypeScript uses `status` to know which shape you have.
 * `sold` is PREIshare’s closed deal — `closedAt` is required only then.
 */
export type InvestorListing =
  | (InvestorListingBase & {
      status: "draft" | "published" | "under_offer" | "archived";
      /** Not used unless the listing is sold/closed. */
      closedAt?: undefined;
    })
  | (InvestorListingBase & {
      status: "sold";
      /** ISO-8601 datetime when the deal closed — required on sold listings. */
      closedAt: string;
    });

/** Listing whose status is the closed-deal branch (`sold`). */
export type ClosedInvestorListing = Extract<InvestorListing, { status: "sold" }>;

/** Listing that is not sold (draft, published, under offer, or archived). */
export type OpenInvestorListing = Exclude<InvestorListing, { status: "sold" }>;
