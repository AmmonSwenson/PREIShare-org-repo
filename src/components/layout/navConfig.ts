/**
 * Single source of truth for investor-facing nav labels, paths, and page titles.
 * Labels match docs/investor-dashboard-brief.md and docs/dashboard-ia.md.
 */
export type DashboardNavPath =
  | '/dashboard'
  | '/dashboard/portfolio'
  | '/dashboard/deals'
  | '/dashboard/profile'

export type NavItemConfig = {
  label: string
  path: DashboardNavPath
  title: string
}

export const dashboardNavItems: readonly NavItemConfig[] = [
  {
    label: 'Home',
    path: '/dashboard',
    title: 'Dashboard overview',
  },
  {
    label: 'Portfolio',
    path: '/dashboard/portfolio',
    title: 'Your portfolio',
  },
  {
    label: 'Deals',
    path: '/dashboard/deals',
    title: 'Open deals',
  },
  {
    label: 'Profile',
    path: '/dashboard/profile',
    title: 'Your profile',
  },
]

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export function getPageTitle(pathname: string): string {
  const current = normalizePathname(pathname)
  const exact = dashboardNavItems.find((item) => item.path === current)
  if (exact) return exact.title

  const prefixMatch = [...dashboardNavItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (item) =>
        item.path !== '/dashboard' && current.startsWith(`${item.path}/`),
    )

  return prefixMatch?.title ?? 'Dashboard overview'
}
