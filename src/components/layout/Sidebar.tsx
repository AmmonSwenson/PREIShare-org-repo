import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside
      className="border-[var(--line)] bg-[var(--surface-strong)] px-4 py-5 sm:min-h-screen sm:w-56 sm:border-r sm:px-5"
      aria-label="Investor navigation"
    >
      <div className="mb-4 text-sm font-semibold tracking-tight text-[var(--sea-ink)]">
        {brandLabel}
      </div>
      <nav className="sidebar-nav" aria-label="Dashboard">
        {/* Placeholder links — navConfig + active states come in the next step */}
        <ul className="m-0 flex list-none flex-wrap gap-3 p-0 text-sm font-semibold sm:flex-col sm:gap-2">
          <li>
            <Link
              to="/dashboard"
              className="text-[var(--lagoon-deep)] no-underline hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/portfolio"
              className="text-[var(--lagoon-deep)] no-underline hover:underline"
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/deals"
              className="text-[var(--lagoon-deep)] no-underline hover:underline"
            >
              Deals
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="text-[var(--lagoon-deep)] no-underline hover:underline"
            >
              Profile
            </Link>
          </li>
        </ul>
        {children}
      </nav>
    </aside>
  )
}
