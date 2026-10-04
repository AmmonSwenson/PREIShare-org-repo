import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <section aria-labelledby="dashboard-home-heading">
      <h2
        id="dashboard-home-heading"
        className="text-xl font-semibold text-[var(--sea-ink)]"
      >
        Welcome back
      </h2>
      <p className="mt-2 max-w-prose text-[var(--sea-ink-soft)]">
        Portfolio metrics and recent activity will appear here. This placeholder
        confirms the /dashboard route tree is wired correctly.
      </p>
    </section>
  )
}
