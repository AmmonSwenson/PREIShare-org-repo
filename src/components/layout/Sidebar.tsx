import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

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
      <NavItems />
      {children}
    </aside>
  )
}
