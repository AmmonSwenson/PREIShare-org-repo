/**
 * Deal metrics for a PREIshare listing.
 * Field names match docs/domain/listing-field-inventory.md (`financials.*`).
 * Amounts and rates are numbers. Percents use a 0–100 scale (12.5 means 12.5%).
 * Asking price is whole US dollars, not cents.
 */
export interface FinancialSummary {
  /**
   * Listed price amount, greater than zero when this summary is present.
   * Example: 12500000 means $12,500,000.
   */
  askingPrice: number;

  /** Currency code; only USD in this version of the inventory. */
  currency: "USD";

  /** Optional projected IRR on the 0–100 scale. */
  projectedIrrPercent?: number;

  /** Optional cap rate on the 0–100 scale. */
  capRatePercent?: number;
}
