import { createFileRoute } from '@tanstack/react-router'
import { MetricCard } from '../../components/dashboard/MetricCard'
import {
  PortfolioSummary,
  type PortfolioHolding,
} from '../../components/dashboard/PortfolioSummary'
import {
  RecentActivity,
  type ActivityItem,
} from '../../components/dashboard/RecentActivity'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

/** Shell demo metrics only — replace with loaders/Supabase in a later sprint */
const demoMetrics = [
  {
    label: 'Portfolio value',
    value: '—',
    hint: 'Connect data to see live totals',
  },
  {
    label: 'Open deals',
    value: '—',
    hint: 'No open property opportunities loaded yet',
  },
  {
    label: 'Distributions (YTD)',
    value: '—',
    hint: 'Figures appear after sync',
  },
]

function DashboardHome() {
  const holdings: PortfolioHolding[] = []
  const activityItems: ActivityItem[] = []

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="m-0 text-2xl font-semibold tracking-tight text-[var(--sea-ink)]">
          Investor dashboard
        </h1>
        <p className="m-0 max-w-prose text-sm text-[var(--sea-ink-soft)]">
          Your PREIshare home base for portfolio metrics and recent activity.
          Numbers and lists stay empty until live data is connected.
        </p>
      </header>

      <section
        aria-label="Key metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {demoMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PortfolioSummary
            holdings={holdings}
            emptyMessage="No portfolio holdings to show yet. When your account is linked, summaries will appear here."
          />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity
            items={activityItems}
            emptyMessage="No recent activity yet. Distributions, documents, and updates will list here."
          />
        </div>
      </section>
    </div>
  )
}
