export type ActivityItem = {
  id: string
  title: string
  detail: string
  dateLabel: string
}

export type RecentActivityProps = {
  title?: string | undefined
  items?: ActivityItem[] | undefined
  isSampleData?: boolean | undefined
}

const DEFAULT_MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Viewed a deal (sample)',
    detail: 'Riverfront Multifamily — 24 Units · published',
    dateLabel: 'Mar 15, 2026',
  },
  {
    id: 'a2',
    title: 'Open deal still under offer (sample)',
    detail: 'Cedar Industrial — asking price placeholder',
    dateLabel: 'Mar 12, 2026',
  },
  {
    id: 'a3',
    title: 'Distribution posted (sample)',
    detail: 'Sample multifamily holding',
    dateLabel: 'Mar 1, 2026',
  },
  {
    id: 'a4',
    title: 'Profile details reviewed (sample)',
    detail: 'Contact placeholders only',
    dateLabel: 'Feb 20, 2026',
  },
]

/** Short mock event list for the home overview — not a live audit log. */
export function RecentActivity({
  title = 'Recent activity',
  items = DEFAULT_MOCK_ACTIVITY,
  isSampleData = true,
}: RecentActivityProps) {
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
      <ol className="m-0 list-none space-y-4 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-start justify-between gap-2 border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0"
          >
            <div>
              <p className="m-0 font-medium text-[var(--sea-ink)]">{item.title}</p>
              <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">{item.detail}</p>
            </div>
            <time className="text-sm text-[var(--sea-ink-soft)]">{item.dateLabel}</time>
          </li>
        ))}
      </ol>
    </section>
  )
}
