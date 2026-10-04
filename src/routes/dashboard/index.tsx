import { createFileRoute } from '@tanstack/react-router'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { StatsCard } from '../../components/dashboard/StatsCard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <p
        className="m-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink-soft)]"
        role="note"
      >
        Demo shell — all figures are placeholders
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total portfolio value"
          value="$300,000"
          hint="Sample total"
        />
        <StatsCard
          label="Open deals"
          value="3"
          hint="Sample count · published / under_offer"
        />
        <StatsCard
          label="Contributions YTD"
          value="$24,000"
          hint="Sample YTD"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PortfolioSummary totalLabel="$300,000" />
        <RecentActivity />
      </div>
    </div>
  )
}
