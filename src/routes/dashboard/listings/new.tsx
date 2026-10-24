import { Link, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import {
  ListingForm,
  type ListingFormValues,
} from '../../../components/listings/ListingForm'
import { createListing } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const createListingFn = useServerFn(createListing)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]> | undefined
  >(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values: ListingFormValues) {
    setErrorMessage(null)
    setFieldErrors(undefined)
    setIsSubmitting(true)
    try {
      const result = await createListingFn({ data: values })
      if (!result.ok) {
        setErrorMessage(result.error)
        setFieldErrors(result.fieldErrors)
        return
      }
      await router.invalidate({ sync: true })
      await navigate({ to: '/dashboard/listings' })
    } catch (caught) {
      setErrorMessage(messageFromUnknown(caught))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-listing-heading" className="space-y-5">
      <div className="space-y-1">
        <h1
          id="new-listing-heading"
          className="m-0 text-2xl font-semibold text-[var(--sea-ink)]"
        >
          Add a property listing
        </h1>
        <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
          Saved listings belong only to your signed-in sponsor account.
        </p>
      </div>
      <ListingForm
        onSubmit={handleSubmit}
        submitLabel="Create listing"
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      />
      <p className="m-0 text-sm">
        <Link
          to="/dashboard/listings"
          className="font-semibold text-[var(--lagoon-deep)]"
        >
          Back to listings
        </Link>
      </p>
    </section>
  )
}

function messageFromUnknown(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }
  return 'Could not create listing. Try again.'
}
