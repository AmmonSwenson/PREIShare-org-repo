import type { ReactNode } from 'react'

export type MetricCardProps = {
  /** Short label shown above the value, e.g. "Portfolio value" */
  label: string
  /** Main figure investors should see first — parent formats the string */
  value: string
  /** Optional secondary line, e.g. "Sample data — not a live balance" */
  hint?: string | undefined
  /** Optional icon or badge slot */
  icon?: ReactNode | undefined
}

/**
 * Presentational KPI tile. Parents pass every figure; this file does not
 * fetch data or hard-code dollar amounts.
 */
export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <article
      className="island-shell rounded-2xl p-5"
      aria-label={label}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
          {label}
        </p>
        {icon ? (
          <span className="text-[var(--sea-ink-soft)]" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="m-0 text-2xl font-semibold tracking-tight text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 mb-0 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}
