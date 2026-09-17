import type { ClosedInvestorListing, InvestorListing } from "../types";

/** Draft retail pad — still being prepared; financials omitted until underwriting. */
export const sampleDraftListing: InvestorListing = {
  id: "lst_ev_1002",
  createdAt: "2026-03-02T09:00:00Z",
  updatedAt: "2026-03-02T09:00:00Z",
  title: "Draft — Oak Street Retail Pad",
  summary: "Small retail pad near a grocery-anchored center. Price and returns not locked.",
  status: "draft",
  propertyType: "retail",
  address: {
    line1: "88 Oak St",
    city: "Dallas",
    region: "TX",
    postalCode: "75201",
    country: "US",
  },
  contacts: [
    {
      id: "ctc_morgan_patel",
      fullName: "Morgan Patel",
      role: "sponsor",
      email: "morgan.patel@example.com",
    },
  ],
  primaryContactId: "ctc_morgan_patel",
  ownership: {
    ownerName: "PREI Draft Vehicles LLC",
    relationship: "primary_owner",
    ownershipPercent: 100,
  },
};

/** Published multifamily — investor-visible with full nested shapes. */
export const samplePublishedListing: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-15T16:30:00Z",
  title: "Riverfront Multifamily — 24 Units",
  summary: "Value-add asset near transit with in-place cash flow.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "1200 River Rd",
    line2: "Suite 100",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  financialSummary: {
    askingPrice: 12500000,
    currency: "USD",
    projectedIrrPercent: 12.5,
    capRatePercent: 5.8,
  },
  contacts: [
    {
      id: "ctc_jordan_lee",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@example.com",
      phone: "+1-512-555-0142",
    },
  ],
  primaryContactId: "ctc_jordan_lee",
  ownership: {
    ownerName: "PREI Riverfront Holdings LLC",
    relationship: "primary_owner",
    ownershipPercent: 100,
  },
};

/** Under-offer industrial — active interest, same completeness as published. */
export const sampleUnderOfferListing: InvestorListing = {
  id: "lst_ev_1003",
  createdAt: "2026-02-10T14:00:00Z",
  updatedAt: "2026-03-18T11:15:00Z",
  title: "Cedar Industrial — Under Offer",
  summary: "Last-mile warehouse with a credit tenant; buyer diligence in progress.",
  status: "under_offer",
  propertyType: "industrial",
  address: {
    line1: "4500 Cedar Blvd",
    city: "Houston",
    region: "TX",
    postalCode: "77002",
    country: "US",
  },
  financialSummary: {
    askingPrice: 6100000,
    currency: "USD",
    capRatePercent: 6.4,
  },
  contacts: [
    {
      id: "ctc_sam_rivera",
      fullName: "Sam Rivera",
      role: "owner_rep",
      email: "sam.rivera@example.com",
    },
    {
      id: "ctc_riley_nguyen",
      fullName: "Riley Nguyen",
      role: "property_manager",
      email: "riley.nguyen@example.com",
      phone: "+1-713-555-0199",
    },
  ],
  primaryContactId: "ctc_sam_rivera",
  ownership: {
    ownerName: "PREI Cedar JV",
    relationship: "co_owner",
    ownershipPercent: 60,
    notes: "Remaining 40% held by an operating partner.",
  },
};

/** Sold office — closed deal; closedAt required on this status branch. */
export const sampleSoldListing: ClosedInvestorListing = {
  id: "lst_ev_1004",
  createdAt: "2025-11-01T08:00:00Z",
  updatedAt: "2026-01-20T17:45:00Z",
  title: "Summit Office — Sold",
  summary: "Closed sale of a two-building suburban office campus.",
  status: "sold",
  propertyType: "office",
  closedAt: "2026-01-20T17:45:00Z",
  address: {
    line1: "1 Summit Plaza",
    city: "San Antonio",
    region: "TX",
    postalCode: "78205",
    country: "US",
  },
  financialSummary: {
    askingPrice: 2750000,
    currency: "USD",
    capRatePercent: 7.2,
  },
  contacts: [
    {
      id: "ctc_alex_chen",
      fullName: "Alex Chen",
      role: "broker",
      email: "alex.chen@example.com",
    },
  ],
  primaryContactId: "ctc_alex_chen",
  ownership: {
    ownerName: "PREI Summit LLC",
    relationship: "primary_owner",
    ownershipPercent: 100,
  },
};

/** Archived land — off active browse; not a sold/closed deal so no closedAt. */
export const sampleArchivedListing: InvestorListing = {
  id: "lst_ev_1005",
  createdAt: "2025-06-12T12:00:00Z",
  updatedAt: "2026-02-01T09:30:00Z",
  title: "Hill Country Land — Archived",
  summary: "Entitled land parcel pulled from active browse after strategy change.",
  status: "archived",
  propertyType: "land",
  address: {
    line1: "2100 Ranch Road 12",
    city: "Dripping Springs",
    region: "TX",
    postalCode: "78620",
    country: "US",
  },
  contacts: [
    {
      id: "ctc_casey_brooks",
      fullName: "Casey Brooks",
      role: "sponsor",
      email: "casey.brooks@example.com",
    },
  ],
  primaryContactId: "ctc_casey_brooks",
  ownership: {
    ownerName: "PREI Hill Country Land LLC",
    relationship: "primary_owner",
  },
};

/** All valid samples — useful for later UI mocks and typecheck scripts. */
export const sampleInvestorListings: InvestorListing[] = [
  sampleDraftListing,
  samplePublishedListing,
  sampleUnderOfferListing,
  sampleSoldListing,
  sampleArchivedListing,
];
