/**
 * Physical location of a PREIshare listing.
 * Field names match docs/domain/listing-field-inventory.md (`address.*`).
 * Core map-pin fields are required; only unit/suite may be omitted.
 */
export interface Address {
  /** Street number and name (inventory `address.line1`). */
  line1: string;

  /** Unit, suite, or floor if any (inventory `address.line2`). */
  line2?: string;

  /** City. */
  city: string;

  /** State, province, or region. */
  region: string;

  /** Postal code. */
  postalCode: string;

  /** Country (prefer two-letter code, e.g. US). */
  country: string;
}
