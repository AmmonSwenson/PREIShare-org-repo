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
   * Deal metrics. Optional on draft/archived; required on investor-visible
   * statuses (see the union branches). When present, askingPrice and
   * currency inside FinancialSummary are required.
   */
  financialSummary?: FinancialSummary;

  /**
   * People associated with this listing. Draft/archived may be empty;
   * investor-visible statuses require at least one contact (union branches).
   */
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

/** At least one reachable person — required once investors can see the listing. */
type InvestorVisibleContacts = [InvestorContact, ...InvestorContact[]];

/**
 * Discriminated union: TypeScript uses `status` to know which shape you have.
 * `sold` is PREIshare’s closed deal — `closedAt` is required only then.
 * Published / under-offer / sold also require financials and a non-empty contacts list
 * (domain: unsafe to show investors without price or a person to call).
 */
export type InvestorListing =
  | (InvestorListingBase & {
      status: "draft" | "archived";
      /** Not used unless the listing is sold/closed. */
      closedAt?: undefined;
    })
  | (InvestorListingBase & {
      status: "published" | "under_offer";
      closedAt?: undefined;
      financialSummary: FinancialSummary;
      contacts: InvestorVisibleContacts;
    })
  | (InvestorListingBase & {
      status: "sold";
      /** ISO-8601 datetime when the deal closed — required on sold listings. */
      closedAt: string;
      financialSummary: FinancialSummary;
      contacts: InvestorVisibleContacts;
    });

/** Listing whose status is the closed-deal branch (`sold`). */
export type ClosedInvestorListing = Extract<InvestorListing, { status: "sold" }>;

/** Listing that is not sold (draft, published, under offer, or archived). */
export type OpenInvestorListing = Exclude<InvestorListing, { status: "sold" }>;
