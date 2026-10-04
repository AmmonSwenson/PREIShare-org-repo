import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavItems } from './navConfig'

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

/** Renders dashboard destinations from navConfig and marks the active route. */
export function NavItems() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const current = normalizePathname(pathname)

  return (
    <nav aria-label="Dashboard">
      <ul className="nav-list m-0 flex list-none flex-wrap gap-2 p-0 text-sm sm:flex-col">
        {dashboardNavItems.map((item) => {
          const homeExact = item.path === '/dashboard'
          const isActive = homeExact
            ? current === '/dashboard'
            : current === item.path || current.startsWith(`${item.path}/`)

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                activeOptions={{ exact: homeExact }}
                className={
                  isActive
                    ? 'nav-link nav-link-active after:hidden block rounded-lg bg-[var(--chip-bg)] px-2 py-1.5 font-semibold text-[var(--sea-ink)] no-underline'
                    : 'nav-link after:hidden block rounded-lg px-2 py-1.5 font-medium text-[var(--lagoon-deep)] no-underline hover:bg-[var(--link-bg-hover)]'
                }
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
