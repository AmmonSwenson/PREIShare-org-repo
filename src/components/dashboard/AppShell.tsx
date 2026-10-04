import type { ReactNode } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

export type AppShellProps = {
  children: ReactNode
  /** Forwarded to Header */
  title?: string | undefined
  /** Optional sidebar slot — defaults to the dashboard Sidebar */
  sidebar?: ReactNode | undefined
}

/**
 * Shared frame for all /dashboard routes: header, sidebar/mobile nav, main slot.
 */
export function AppShell({ children, title, sidebar }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--sea-ink)]">
      <Header title={title} />
      <MobileNav />

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-60 shrink-0 border-r border-[var(--line)] bg-[var(--surface-strong)] md:block"
          aria-label="Dashboard sidebar"
        >
          {sidebar ?? <Sidebar />}
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
