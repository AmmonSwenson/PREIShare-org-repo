import type { ReactNode } from 'react'

export type StatsCardProps = {
  label: string
  value: string
  hint?: string | undefined
  /** Optional icon or badge slot for later polish */
  icon?: ReactNode | undefined
}

/** Reusable metric tile for the investor dashboard home. */
export function StatsCard({ label, value, hint, icon }: StatsCardProps) {
  return (
    <article
      className="island-shell rounded-2xl p-5"
      aria-label={label}
    >
      <header className="mb-3 flex items-start justify-between gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
          {label}
        </p>
        {icon ? <span className="text-[var(--sea-ink-soft)]">{icon}</span> : null}
      </header>
      <p className="m-0 text-2xl font-semibold tracking-tight text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 mb-0 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}
