import { Link } from '@tanstack/react-router'
import { dashboardNavItems } from '../layout/navConfig'

/**
 * Desktop / tablet vertical nav. Hidden on small screens (md+ in AppShell).
 * Labels and paths come from navConfig, matching docs/dashboard-routing-plan.md.
 */
export function Sidebar() {
  return (
    <div className="flex h-full flex-col p-4">
      <p className="mb-4 text-sm font-semibold text-[var(--sea-ink)]">
        PREIshare
      </p>
      <nav aria-label="Dashboard">
        <ul className="m-0 list-none space-y-2 p-0">
          {dashboardNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                activeOptions={{ exact: item.path === '/dashboard' }}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--lagoon-deep)] no-underline hover:bg-[var(--link-bg-hover)] [&.active]:bg-[var(--chip-bg)] [&.active]:font-semibold [&.active]:text-[var(--sea-ink)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
