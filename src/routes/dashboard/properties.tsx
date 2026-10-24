import { Link, createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export type PropertyListItem = {
  id: string
  title: string
  city: string | null
  status: string
  created_at: string
}

function cookieStoreFrom(
  getCookie: (name: string) => string | undefined,
) {
  return {
    get: (key: string) => {
      const value = getCookie(key)
      if (typeof value !== 'string' || value.length === 0) {
        return undefined
      }
      return { value }
    },
  }
}

function asPropertyListItem(row: unknown): PropertyListItem | null {
  if (typeof row !== 'object' || row === null) {
    return null
  }
  const record = row as Record<string, unknown>
  if (typeof record.id !== 'string' || typeof record.title !== 'string') {
    return null
  }
  if (typeof record.created_at !== 'string') {
    return null
  }
  const city = record.city
  const status = record.status
  return {
    id: record.id,
    title: record.title,
    city: typeof city === 'string' ? city : null,
    status: typeof status === 'string' ? status : 'draft',
    created_at: record.created_at,
  }
}

/**
 * Server-only load path. Postgres RLS on `properties` (`owner_id = auth.uid()`)
 * restricts rows to the signed-in sponsor. This page does not re-filter by
 * owner in React.
 */
const loadSponsorProperties = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ properties: PropertyListItem[]; error: string | null }> => {
    try {
      const { getCookie } = await import('@tanstack/react-start/server')
      const { createSupabaseServerClient } = await import('../../lib/supabase.server')

      const accessToken = getCookie('preishare-access-token')
      if (typeof accessToken !== 'string' || accessToken.length === 0) {
        throw redirect({ to: '/login' })
      }

      const supabase = createSupabaseServerClient(cookieStoreFrom(getCookie))
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(accessToken)

      if (userError || !user) {
        throw redirect({ to: '/login' })
      }

      const { data, error } = await supabase
        .from('properties')
        .select('id, title, city, status, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        return {
          properties: [],
          error: 'Could not load properties. Try again.',
        }
      }

      const properties = (data ?? [])
        .map(asPropertyListItem)
        .filter((item): item is PropertyListItem => item !== null)

      return { properties, error: null }
    } catch (caught) {
      if (isRedirect(caught)) {
        throw caught
      }
      return {
        properties: [],
        error: 'Could not load properties. Try again.',
      }
    }
  },
)

export const Route = createFileRoute('/dashboard/properties')({
  loader: () => loadSponsorProperties(),
  pendingMs: 200,
  pendingComponent: PropertiesPending,
  component: PropertiesPage,
})

function PropertiesPending() {
  return (
    <section className="space-y-3">
      <h1 className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">
        Your properties
      </h1>
      <p className="m-0 text-sm text-[var(--sea-ink-soft)]">Loading listings…</p>
    </section>
  )
}

function PropertiesPage() {
  const { properties, error } = Route.useLoaderData()

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">
            Your properties
          </h1>
          <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
            Listings you are allowed to manage. Visibility is enforced by the
            database (RLS), not only by this page.
          </p>
        </div>
        <Link
          to="/dashboard/properties/new"
          className="inline-flex min-h-11 items-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
        >
          Add property
        </Link>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      {!error && properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--line)] px-4 py-8 text-center text-[var(--sea-ink-soft)]">
          <p className="m-0 font-medium text-[var(--sea-ink)]">No properties yet</p>
          <p className="mt-1 mb-0 text-sm">
            When you add a listing, it will show up here for your sponsor
            account only.
          </p>
          <p className="mt-4 mb-0">
            <Link
              to="/dashboard/properties/new"
              className="inline-flex min-h-11 items-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
            >
              Add property
            </Link>
          </p>
        </div>
      ) : null}

      {properties.length > 0 ? (
        <ul className="m-0 divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] p-0">
          {properties.map((property) => (
            <li
              key={property.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="m-0 font-medium text-[var(--sea-ink)]">
                  {property.title}
                </p>
                <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
                  {property.city ?? 'Location TBD'}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide text-[var(--sea-ink-soft)]">
                {property.status}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
