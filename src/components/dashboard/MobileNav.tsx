import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { dashboardNavItems } from '../layout/navConfig'

/**
 * Small-screen nav: same destinations as Sidebar, behind Open/Close menu.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[var(--line)] px-4 py-2 md:hidden">
      <button
        type="button"
        className="min-h-11 rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-2 text-sm font-medium text-[var(--sea-ink)]"
        aria-expanded={open}
        aria-controls="mobile-dashboard-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>
      {open ? (
        <nav
          id="mobile-dashboard-menu"
          aria-label="Dashboard"
          className="mt-2 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-3"
        >
          <ul className="m-0 list-none space-y-2 p-0">
            {dashboardNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  activeOptions={{ exact: item.path === '/dashboard' }}
                  className="block min-h-11 rounded-lg px-3 py-2 text-sm font-medium leading-6 text-[var(--lagoon-deep)] no-underline hover:bg-[var(--link-bg-hover)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
