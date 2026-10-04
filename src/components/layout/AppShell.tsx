import { useEffect, useState, type ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const SIDEBAR_ID = 'dashboard-sidebar'

type AppShellProps = {
  title?: string | undefined
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar + header + main content region.
 * Child routes render inside `children` (wired from the dashboard layout route).
 */
export function AppShell({ title, children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!navOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navOpen])

  return (
    <div
      className={navOpen ? 'dash-shell nav-open' : 'dash-shell'}
      data-area="dashboard-layout"
    >
      <a className="dash-skip-link" href="#main-content">
        Skip to main content
      </a>
      {navOpen ? (
        <button
          type="button"
          className="dash-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
      <Sidebar id={SIDEBAR_ID} />
      <div className="dash-main">
        <Header
          title={title}
          menuOpen={navOpen}
          sidebarId={SIDEBAR_ID}
          onToggleMenu={() => setNavOpen((open) => !open)}
        />
        <main className="dash-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
