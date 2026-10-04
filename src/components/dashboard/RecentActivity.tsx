export type ActivityItem = {
  id: string
  /** Already-formatted time label for display, e.g. "Mar 18 · 2:04 PM" */
  whenLabel: string
  description: string
  category?: string | undefined
}

export type RecentActivityProps = {
  title?: string | undefined
  items: ActivityItem[]
  /** Shown when items is empty */
  emptyMessage?: string | undefined
  /** When true, show a “not a live feed” caption */
  isSampleData?: boolean | undefined
}

/** MOCK PLACEHOLDER — replace with real activity feed later */
export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    whenLabel: 'Mar 18 · 2:04 PM',
    description: 'Distribution posted for Riverfront Multifamily',
    category: 'Distribution',
  },
  {
    id: 'a2',
    whenLabel: 'Mar 17 · 11:20 AM',
    description: 'Quarterly report available for Cedar Retail Plaza',
    category: 'Document',
  },
  {
    id: 'a3',
    whenLabel: 'Mar 15 · 9:00 AM',
    description: 'Capital call reminder — Harbor Industrial',
    category: 'Notice',
  },
]

/**
 * Presentational activity list. Parents pass items; this file does not
 * fetch, subscribe, or navigate.
 */
export function RecentActivity({
  title = 'Recent activity',
  items,
  emptyMessage = 'No recent activity yet.',
  isSampleData = false,
}: RecentActivityProps) {
  const isEmpty = items.length === 0

  return (
    <section
      className="island-shell rounded-2xl p-5 sm:p-6"
      aria-labelledby="recent-activity-heading"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2
          id="recent-activity-heading"
          className="m-0 text-lg font-semibold text-[var(--sea-ink)]"
        >
          {title}
        </h2>
        {isSampleData ? (
          <p
            className="m-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
            role="note"
          >
            Sample activity — not connected to a live feed
          </p>
        ) : null}
      </div>
      {isEmpty ? (
        <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <ul className="m-0 list-none space-y-3 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-l-2 border-[var(--line)] pl-3"
            >
              <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
                {item.whenLabel}
              </p>
              <p className="mt-1 mb-0 text-sm font-medium text-[var(--sea-ink)]">
                {item.description}
              </p>
              {item.category ? (
                <p className="mt-1 mb-0 text-xs text-[var(--sea-ink-soft)]">
                  {item.category}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
