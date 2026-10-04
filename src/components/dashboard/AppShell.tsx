import type { ReactNode } from 'react'
import { Header } from './Header'

export type AppShellProps = {
  children: ReactNode
  /** Forwarded to Header */
  title?: string | undefined
  /** Optional sidebar slot — a later step will pass the real Sidebar here */
  sidebar?: ReactNode | undefined
}

/**
 * Shared frame for all /dashboard routes: header, optional sidebar region, main slot.
 */
export function AppShell({ children, title, sidebar }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--sea-ink)]">
      <Header title={title} />

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-60 shrink-0 border-r border-[var(--line)] bg-[var(--surface-strong)] md:block"
          aria-label="Dashboard sidebar"
        >
          {sidebar ?? (
            <div className="p-4 text-sm text-[var(--sea-ink-soft)]">
              Navigation coming soon
            </div>
          )}
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
