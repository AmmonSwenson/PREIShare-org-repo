import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <section>
      <h2 className="mt-0 text-lg font-semibold text-[var(--sea-ink)]">Deals</h2>
      <p className="text-[var(--sea-ink-soft)]">
        Placeholder for open and past investment deals.
      </p>
    </section>
  )
}
