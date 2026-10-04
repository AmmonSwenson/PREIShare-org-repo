export type PortfolioHolding = {
  id: string
  name: string
  /** Display string already formatted for UI, e.g. "$120,000" or "18%" */
  allocationLabel: string
}

export type PortfolioSummaryProps = {
  /** Section heading (architecture: headline) */
  title?: string | undefined
  holdings: PortfolioHolding[]
  /** Optional total line for the snapshot */
  totalLabel?: string | undefined
  /** Shown when holdings is empty */
  emptyMessage?: string | undefined
  /** When true, show a “not live balances” caption */
  isSampleData?: boolean | undefined
}

/** MOCK PLACEHOLDER — replace with real portfolio data in a later sprint */
export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { id: 'h1', name: 'Riverfront Multifamily', allocationLabel: '42%' },
  { id: 'h2', name: 'Cedar Retail Plaza', allocationLabel: '33%' },
  { id: 'h3', name: 'Harbor Industrial', allocationLabel: '25%' },
]

/**
 * Presentational holdings snapshot. Parents pass the list; this file does
 * not fetch or edit portfolio data.
 */
export function PortfolioSummary({
  title = 'Portfolio summary',
  holdings,
  totalLabel,
  emptyMessage = 'No holdings to show yet.',
  isSampleData = false,
}: PortfolioSummaryProps) {
  const isEmpty = holdings.length === 0

  return (
    <section
      className="island-shell rounded-2xl p-5 sm:p-6"
      aria-labelledby="portfolio-summary-heading"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2
          id="portfolio-summary-heading"
          className="m-0 text-lg font-semibold text-[var(--sea-ink)]"
        >
          {title}
        </h2>
        {isSampleData ? (
          <p
            className="m-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
            role="note"
          >
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>
      {totalLabel ? (
        <p className="mb-4 mt-0 text-sm text-[var(--sea-ink-soft)]">
          Total: {totalLabel}
        </p>
      ) : null}
      {isEmpty ? (
        <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <ul className="m-0 list-none divide-y divide-[var(--line)] p-0">
          {holdings.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 py-2 text-sm first:pt-0 last:pb-0"
            >
              <span className="font-medium text-[var(--sea-ink)]">{item.name}</span>
              <span className="text-[var(--sea-ink-soft)]">{item.allocationLabel}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
