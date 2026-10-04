import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  title?: string
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar + header + main content region.
 * Child routes render inside `children` (wired from the dashboard layout route).
 */
export function AppShell({
  title = 'Investor Dashboard',
  children,
}: AppShellProps) {
  return (
    <div
      className="app-shell flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--sea-ink)] sm:flex-row"
      data-area="dashboard-layout"
    >
      <Sidebar />
      <div className="app-shell-main-column flex min-w-0 flex-1 flex-col">
        <Header title={title} />
        <main className="app-shell-content flex-1 px-4 py-6 sm:px-6 sm:py-8" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
