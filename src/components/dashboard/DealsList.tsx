export type DealStatus = 'published' | 'under_offer'

export type Deal = {
  id: string
  name: string
  location: string
  assetClass: string
  askingPrice: number
  status: DealStatus
}

const mockDeals: Deal[] = [
  {
    id: 'd1',
    name: 'Riverfront Multifamily — 24 Units (sample)',
    location: 'Austin, TX',
    assetClass: 'Multifamily',
    askingPrice: 12500000,
    status: 'published',
  },
  {
    id: 'd2',
    name: 'Cedar Industrial (sample)',
    location: 'Houston, TX',
    assetClass: 'Industrial',
    askingPrice: 6100000,
    status: 'under_offer',
  },
]

const dealStatusLabel: Record<DealStatus, string> = {
  published: 'Open',
  under_offer: 'Under offer',
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

type DealsListProps = {
  deals?: Deal[] | undefined
  emptyMessage?: string | undefined
  isSampleData?: boolean | undefined
}

export function DealsList({
  deals = mockDeals,
  emptyMessage = 'No open deals right now. Check back soon for new opportunities.',
  isSampleData = true,
}: DealsListProps) {
  return (
    <section className="island-shell rounded-2xl p-5 sm:p-6" aria-label="Open deals">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">Open deals</h2>
        {isSampleData ? (
          <p
            className="m-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
            role="note"
          >
            Sample deals — not live listings
          </p>
        ) : null}
      </div>
      {deals.length === 0 ? (
        <p className="m-0 text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0">
          {deals.map((deal) => (
            <li
              key={deal.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
            >
              <div>
                <h3 className="m-0 text-base font-semibold text-[var(--sea-ink)]">
                  {deal.name}
                </h3>
                <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">
                  {deal.location} · {deal.assetClass}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                <p className="m-0 font-semibold text-[var(--sea-ink)]">
                  Asking {formatCurrency(deal.askingPrice)}
                </p>
                <p className="m-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--lagoon-deep)]">
                  {dealStatusLabel[deal.status]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
