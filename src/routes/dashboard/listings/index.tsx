import { Link, createFileRoute } from '@tanstack/react-router'
import { ListingCard } from '../../../components/listings/ListingCard'
import { listMyListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: () => listMyListings(),
  pendingMs: 200,
  pendingComponent: ListingsPending,
  component: ListingsIndexPage,
})

function ListingsPending() {
  return (
    <section aria-labelledby="listings-heading" className="space-y-3">
      <h1
        id="listings-heading"
        className="m-0 text-2xl font-semibold text-[var(--sea-ink)]"
      >
        Your property listings
      </h1>
      <p className="m-0 text-sm text-[var(--sea-ink-soft)]">Loading listings…</p>
    </section>
  )
}

function ListingsIndexPage() {
  const result = Route.useLoaderData()

  if (!result.ok) {
    return (
      <section aria-labelledby="listings-heading" className="space-y-4">
        <h1
          id="listings-heading"
          className="m-0 text-2xl font-semibold text-[var(--sea-ink)]"
        >
          Your property listings
        </h1>
        <p role="alert" className="m-0 text-sm text-red-700">
          {result.error}
        </p>
        <Link
          to="/dashboard/listings/new"
          className="inline-flex min-h-11 items-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
        >
          Add listing
        </Link>
      </section>
    )
  }

  const listings = result.listings

  if (listings.length === 0) {
    return (
      <section aria-labelledby="listings-heading" className="space-y-4">
        <h1
          id="listings-heading"
          className="m-0 text-2xl font-semibold text-[var(--sea-ink)]"
        >
          Your property listings
        </h1>
        <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
          No properties yet. Add your first listing to get started.
        </p>
        <Link
          to="/dashboard/listings/new"
          className="inline-flex min-h-11 items-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
        >
          Add listing
        </Link>
      </section>
    )
  }

  return (
    <section aria-labelledby="listings-heading" className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1
          id="listings-heading"
          className="m-0 text-2xl font-semibold text-[var(--sea-ink)]"
        >
          Your property listings
        </h1>
        <Link
          to="/dashboard/listings/new"
          className="inline-flex min-h-11 items-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
        >
          Add listing
        </Link>
      </header>
      <ul className="m-0 grid list-none gap-4 p-0">
        {listings.map((listing) => (
          <li key={listing.id}>
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </section>
  )
}
