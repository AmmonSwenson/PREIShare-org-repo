/**
 * INTENTIONAL TYPE ERRORS — this file should NOT typecheck cleanly.
 * Each export demonstrates a failure mode documented in
 * docs/type-safety/expected-type-errors.md
 *
 * Do not "fix" these objects. Do not add `any`, `@ts-ignore`, or
 * `as unknown as InvestorListing`. Step 11 will treat the failures as proof.
 */
import type { InvestorListing } from "../types";

const baseAddress = {
  line1: "100 Main St",
  city: "Austin",
  region: "TX",
  postalCode: "78701",
  country: "US",
} as const;

const baseContact = {
  id: "ctc_alex_rivera",
  fullName: "Alex Rivera",
  role: "broker" as const,
  email: "alex@example.com",
};

const baseOwnership = {
  ownerName: "Rivera Holdings",
  relationship: "primary_owner" as const,
  ownershipPercent: 100,
};

const baseFinancials = {
  askingPrice: 450000,
  currency: "USD" as const,
};

/** Status spelled in a way ListingStatus does not allow. */
export const invalidStatusSpelling: InvestorListing = {
  id: "listing-bad-status",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  title: "Downtown duplex offering",
  summary: "Typo in lifecycle status would break filters.",
  status: "availble",
  propertyType: "multifamily",
  address: baseAddress,
  financialSummary: baseFinancials,
  contacts: [baseContact],
  primaryContactId: "ctc_alex_rivera",
  ownership: baseOwnership,
};

/** Required nested address.city missing — maps cannot place a pin. */
export const missingAddressCity: InvestorListing = {
  id: "listing-missing-city",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  title: "Lakeview fourplex",
  summary: "Address without a city is unsafe to show investors.",
  status: "draft",
  propertyType: "multifamily",
  address: {
    line1: "22 Lake Rd",
    region: "TX",
    postalCode: "78702",
    country: "US",
  },
  contacts: [baseContact],
  primaryContactId: "ctc_alex_rivera",
  ownership: baseOwnership,
};

/** Asking price given as text — money must be numeric for math. */
export const priceAsString: InvestorListing = {
  id: "listing-price-string",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  title: "Cedar Street portfolio slice",
  summary: "String prices cannot be compared or totaled.",
  status: "published",
  propertyType: "office",
  address: {
    line1: "9 Cedar St",
    city: "Dallas",
    region: "TX",
    postalCode: "75201",
    country: "US",
  },
  financialSummary: {
    askingPrice: "610000",
    currency: "USD",
  },
  contacts: [baseContact],
  primaryContactId: "ctc_alex_rivera",
  ownership: baseOwnership,
};

/** Sold/closed deal missing closedAt. */
export const soldMissingClosedAt: InvestorListing = {
  id: "listing-sold-no-close-date",
  createdAt: "2026-01-01T10:00:00Z",
  updatedAt: "2026-02-01T10:00:00Z",
  title: "Summit Office — Sold without close date",
  summary: "A sold listing must record when the deal closed.",
  status: "sold",
  propertyType: "office",
  address: baseAddress,
  financialSummary: baseFinancials,
  contacts: [baseContact],
  primaryContactId: "ctc_alex_rivera",
  ownership: baseOwnership,
};

/** Published listing with no one to call. */
export const publishedEmptyContacts: InvestorListing = {
  id: "listing-published-no-contacts",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  title: "Anonymous published offering",
  summary: "Investor-visible listings need at least one contact.",
  status: "published",
  propertyType: "retail",
  address: baseAddress,
  financialSummary: baseFinancials,
  contacts: [],
  primaryContactId: "ctc_nobody",
  ownership: baseOwnership,
};

/** Contact role not in the inventory closed list. */
export const invalidContactRole: InvestorListing = {
  id: "listing-bad-role",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  title: "Role spelling drift",
  summary: "Free-text roles like primary would fork three spellings in production.",
  status: "draft",
  propertyType: "land",
  address: baseAddress,
  contacts: [
    {
      id: "ctc_sam_lee",
      fullName: "Sam Lee",
      role: "primary",
      email: "sam@example.com",
    },
  ],
  primaryContactId: "ctc_sam_lee",
  ownership: baseOwnership,
};
