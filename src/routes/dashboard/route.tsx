import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--sea-ink)]">
      <header className="border-b border-[var(--line)] bg-[var(--header-bg)] px-4 py-3">
        <p className="text-sm font-medium tracking-wide text-[var(--kicker)]">
          PREIshare
        </p>
        <h1 className="text-lg font-semibold">Investor Dashboard</h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
