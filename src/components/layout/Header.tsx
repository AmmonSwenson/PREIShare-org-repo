import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { getPageTitle } from './navConfig'

type HeaderProps = {
  title?: string | undefined
  children?: ReactNode
}

/** Top bar: page title from navConfig + optional actions / user slot. */
export function Header({ title, children }: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const heading = title ?? getPageTitle(pathname)

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 py-4 sm:px-6">
      <h1 className="m-0 text-xl font-semibold tracking-tight text-[var(--sea-ink)] sm:text-2xl">
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
