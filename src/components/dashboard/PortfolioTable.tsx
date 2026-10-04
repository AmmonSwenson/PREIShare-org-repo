export type PortfolioHolding = {
  id: string
  propertyName: string
  assetType: string
  investedAmount: number
  currentValue: number
  status: 'Performing' | 'Under review' | 'Exited'
}

const mockHoldings: PortfolioHolding[] = [
  {
    id: 'h1',
    propertyName: 'Riverfront Multifamily — 24 Units (sample)',
    assetType: 'Multifamily',
    investedAmount: 50000,
    currentValue: 56200,
    status: 'Performing',
  },
  {
    id: 'h2',
    propertyName: 'Cedar Industrial (sample)',
    assetType: 'Industrial',
    investedAmount: 75000,
    currentValue: 74100,
    status: 'Under review',
  },
  {
    id: 'h3',
    propertyName: 'Cash reserve (sample)',
    assetType: 'Cash',
    investedAmount: 25000,
    currentValue: 25000,
    status: 'Performing',
  },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

type PortfolioTableProps = {
  holdings?: PortfolioHolding[] | undefined
  emptyMessage?: string | undefined
  isSampleData?: boolean | undefined
}

export function PortfolioTable({
  holdings = mockHoldings,
  emptyMessage = 'No holdings to show yet. New investments will appear here.',
  isSampleData = true,
}: PortfolioTableProps) {
  return (
    <section className="island-shell rounded-2xl p-5 sm:p-6" aria-label="Portfolio holdings">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">Your holdings</h2>
        {isSampleData ? (
          <p
            className="m-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
            role="note"
          >
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>
      {holdings.length === 0 ? (
        <p className="m-0 text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <div className="dash-table-wrap">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Property
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Type
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Invested
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Current value
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((row) => (
                <tr key={row.id} className="border-b border-[var(--line)] last:border-b-0">
                  <td className="py-3 pr-3 font-medium text-[var(--sea-ink)]">
                    {row.propertyName}
                  </td>
                  <td className="py-3 pr-3 text-[var(--sea-ink-soft)]">{row.assetType}</td>
                  <td className="py-3 pr-3 text-[var(--sea-ink)]">
                    {formatCurrency(row.investedAmount)}
                  </td>
                  <td className="py-3 pr-3 text-[var(--sea-ink)]">
                    {formatCurrency(row.currentValue)}
                  </td>
                  <td className="py-3 text-[var(--sea-ink)]">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
