import type { ReactNode } from 'react'

export type HeaderProps = {
  /** Optional page or section label shown near the brand */
  title?: string | undefined
  /** Optional right-side actions (keep empty for now if unused) */
  actions?: ReactNode | undefined
  /** Presentational demo label only — not a real session */
  userLabel?: string | undefined
}

/**
 * Top chrome for the PREIshare investor dashboard.
 * Shows branding + a demo user placeholder only — not real auth state.
 */
export function Header({
  title = 'Dashboard',
  actions,
  userLabel = 'Investor',
}: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 py-3"
      role="banner"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--sea-ink)] text-sm font-semibold text-white">
          P
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">
            PREIshare
          </p>
          <p className="truncate text-xs text-[var(--sea-ink-soft)]">{title}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <div
          className="flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-1"
          aria-label="Signed-in user placeholder"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--chip-bg)] text-xs font-medium text-[var(--sea-ink)]">
            IN
          </span>
          <span className="hidden text-sm text-[var(--sea-ink-soft)] sm:inline">
            {userLabel}
          </span>
        </div>
      </div>
    </header>
  )
}
