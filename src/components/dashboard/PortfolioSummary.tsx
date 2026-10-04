export type HoldingSnapshot = {
  id: string
  name: string
  allocationLabel: string
  valueLabel: string
}

export type PortfolioSummaryProps = {
  title?: string | undefined
  totalLabel: string
  holdings?: HoldingSnapshot[] | undefined
  isSampleData?: boolean | undefined
}

const DEFAULT_MOCK_HOLDINGS: HoldingSnapshot[] = [
  {
    id: 'h1',
    name: 'Riverfront Multifamily — 24 Units (sample)',
    allocationLabel: '40%',
    valueLabel: '$120,000',
  },
  {
    id: 'h2',
    name: 'Cedar Industrial — Under Offer (sample)',
    allocationLabel: '35%',
    valueLabel: '$105,000',
  },
  {
    id: 'h3',
    name: 'Cash reserve (sample)',
    allocationLabel: '25%',
    valueLabel: '$75,000',
  },
]

/** Compact holdings snapshot for the home overview — not the full Portfolio table. */
export function PortfolioSummary({
  title = 'Portfolio summary',
  totalLabel,
  holdings = DEFAULT_MOCK_HOLDINGS,
  isSampleData = true,
}: PortfolioSummaryProps) {
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
      <p className="mb-4 flex flex-wrap items-baseline justify-between gap-2 text-[var(--sea-ink)]">
        <span className="text-sm font-semibold uppercase tracking-wide text-[var(--kicker)]">
          Total (sample)
        </span>
        <span className="text-xl font-semibold tracking-tight">{totalLabel}</span>
      </p>
      <ul className="m-0 list-none space-y-3 p-0">
        {holdings.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3 text-sm first:border-t-0 first:pt-0"
          >
            <span className="font-medium text-[var(--sea-ink)]">{item.name}</span>
            <span className="text-[var(--sea-ink-soft)]">{item.allocationLabel}</span>
            <span className="font-semibold text-[var(--sea-ink)]">{item.valueLabel}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
