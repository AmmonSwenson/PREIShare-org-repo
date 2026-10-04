import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  id?: string | undefined
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({
  id = 'dashboard-sidebar',
  brandLabel = 'PREIshare',
  children,
}: SidebarProps) {
  return (
    <aside id={id} className="dash-sidebar" aria-label="Investor navigation">
      <div className="mb-4 text-sm font-semibold tracking-tight text-[var(--sea-ink)]">
        {brandLabel}
      </div>
      <NavItems />
      {children}
    </aside>
  )
}
