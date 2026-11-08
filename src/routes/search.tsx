import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/search')({
  component: PropertySearchPage,
})

type SearchResult = {
  id: string
  title: string
  description: string | null
  city?: string | null
  similarity: number
}

function snippet(text: string | null, max = 160): string {
  if (!text) return 'No description.'
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max).trimEnd()}…`
}

function PropertySearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setStatus('error')
      setErrorMessage('Type a description of the property you want.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      const data = (await res.json()) as {
        error?: string
        results?: SearchResult[]
      }
      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }
      // Display only — do not sort or re-score on the client.
      setResults(Array.isArray(data.results) ? data.results : [])
      setStatus('done')
    } catch (err) {
      setResults([])
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Search failed')
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Semantic search</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Find listings by intent
        </h1>
        <p className="mb-6 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Describe lifestyle and investment intent in everyday language. We
          match meaning, not only exact words. Try “quiet cabin near water with
          good rental upside” or “family-friendly home close to good schools.”
        </p>

        <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-3">
          <label htmlFor="q" className="text-sm font-semibold text-[var(--sea-ink)]">
            What are you looking for?
          </label>
          <input
            id="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="quiet cabin near water with good rental upside"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-fit rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
          >
            {status === 'loading' ? 'Searching…' : 'Search'}
          </button>
        </form>

        {status === 'loading' ? (
          <p className="mt-6 text-[var(--sea-ink-soft)]" aria-live="polite">
            Searching sample listings…
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-6 text-[var(--sea-ink)]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {status === 'done' && results.length === 0 && !errorMessage ? (
          <p className="mt-6 text-[var(--sea-ink-soft)]">
            No matching properties yet. Try a different intent from the sample
            set, such as a downtown loft or farmland control query.
          </p>
        ) : null}

        {results.length > 0 ? (
          <ol className="mt-8 m-0 list-decimal space-y-4 pl-5">
            {results.map((result) => (
              <li key={result.id} className="text-[var(--sea-ink)]">
                <strong>{result.title}</strong>
                {result.city ? (
                  <span className="text-[var(--sea-ink-soft)]"> · {result.city}</span>
                ) : null}
                <div className="mt-1 text-sm leading-6 text-[var(--sea-ink-soft)]">
                  {snippet(result.description)}
                </div>
                <div className="mt-1 text-sm">
                  Similarity:{' '}
                  {typeof result.similarity === 'number' &&
                  Number.isFinite(result.similarity)
                    ? result.similarity.toFixed(3)
                    : '—'}
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        <p className="mt-8 mb-0 text-sm text-[var(--sea-ink-soft)]">
          Scores come from the server. This page does not re-rank results.{' '}
          <Link to="/" className="font-semibold text-[var(--lagoon-deep)]">
            Back home
          </Link>
        </p>
      </section>
    </main>
  )
}
