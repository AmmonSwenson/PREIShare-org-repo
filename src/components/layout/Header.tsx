import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { getPageTitle } from './navConfig'

type HeaderProps = {
  title?: string | undefined
  children?: ReactNode
  menuOpen?: boolean | undefined
  sidebarId?: string | undefined
  onToggleMenu?: (() => void) | undefined
}

/** Top bar: page title from navConfig + mobile menu toggle + user slot. */
export function Header({
  title,
  children,
  menuOpen = false,
  sidebarId = 'dashboard-sidebar',
  onToggleMenu,
}: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const heading = title ?? getPageTitle(pathname)

  return (
    <header className="dash-header">
      {onToggleMenu ? (
        <button
          type="button"
          className="dash-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={sidebarId}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={onToggleMenu}
        >
          <svg
            viewBox="0 0 16 16"
            width="18"
            height="18"
            aria-hidden="true"
            focusable="false"
          >
            {menuOpen ? (
              <path
                fill="currentColor"
                d="M3.2 3.2 8 8l4.8-4.8 1.1 1.1L9.1 9.1l4.8 4.8-1.1 1.1L8 10.2l-4.8 4.8-1.1-1.1 4.8-4.8-4.8-4.8z"
              />
            ) : (
              <path
                fill="currentColor"
                d="M1 3h14v1.5H1V3zm0 4.25h14v1.5H1v-1.5zM1 12h14v1.5H1V12z"
              />
            )}
          </svg>
        </button>
      ) : null}
      <h1 className="m-0 flex-1 text-xl font-semibold tracking-tight text-[var(--sea-ink)] sm:text-2xl">
        {heading}
      </h1>
      <div className="header-actions flex items-center gap-3 text-sm text-[var(--sea-ink-soft)]">
        {children ?? (
          <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1">
            Sample investor (mock)
          </span>
        )}
      </div>
    </header>
  )
}
