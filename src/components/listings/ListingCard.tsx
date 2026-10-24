export type ListingCardListing = {
  id: string
  title: string
  city: string
  region: string
  status: string
  property_type: string
  price: number
}

export type ListingCardProps = {
  listing: ListingCardListing
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article
      aria-label={listing.title}
      className="island-shell rounded-2xl p-5"
    >
      <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
        {listing.title}
      </h2>
      <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">
        {listing.city}, {listing.region}
      </p>
      <p className="mt-2 mb-0 text-sm text-[var(--sea-ink)]">
        {formatPrice(listing.price)} · {listing.property_type.replaceAll('_', ' ')}
      </p>
      <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">
        Status: {listing.status.replaceAll('_', ' ')}
      </p>
    </article>
  )
}
