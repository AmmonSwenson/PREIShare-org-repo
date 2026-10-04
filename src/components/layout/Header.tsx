import type { ReactNode } from 'react'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title + optional actions / user slot. */
export function Header({ title = 'Investor Dashboard', children }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 py-4 sm:px-6">
      <h1 className="m-0 text-xl font-semibold tracking-tight text-[var(--sea-ink)] sm:text-2xl">
        {title}
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
