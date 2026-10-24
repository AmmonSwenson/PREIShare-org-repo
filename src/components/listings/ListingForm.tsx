import type { FormEvent, ReactNode } from 'react'
import {
  listingStatusSchema,
  propertyTypeSchema,
  type ListingPropertyType,
  type ListingStatus,
} from '../../lib/listings/schema'

export type ListingFormValues = {
  title: string
  city: string
  description?: string | undefined
  property_type: ListingPropertyType
  address_line1: string
  address_line2?: string | undefined
  region: string
  postal_code: string
  country?: string | undefined
  price?: number | undefined
  status?: ListingStatus | undefined
}

export type ListingFormProps = {
  onSubmit: (values: ListingFormValues) => void | Promise<void>
  submitLabel?: string | undefined
  errorMessage?: string | null | undefined
  fieldErrors?: Record<string, string[]> | undefined
  isSubmitting?: boolean | undefined
}

const inputClassName =
  'min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal text-[var(--sea-ink)] disabled:opacity-60'

const propertyTypes = propertyTypeSchema.options
const listingStatuses = listingStatusSchema.options

function firstFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  name: string,
): string | undefined {
  const messages = fieldErrors?.[name]
  return messages?.[0]
}

export function ListingForm({
  onSubmit,
  submitLabel = 'Save listing',
  errorMessage = null,
  fieldErrors,
  isSubmitting = false,
}: ListingFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const description = String(data.get('description') ?? '').trim()
    const addressLine2 = String(data.get('address_line2') ?? '').trim()
    const priceRaw = String(data.get('price') ?? '').trim()
    const parsedPrice = priceRaw.length === 0 ? 0 : Number(priceRaw)

    void onSubmit({
      title: String(data.get('title') ?? ''),
      city: String(data.get('city') ?? ''),
      description: description.length > 0 ? description : undefined,
      property_type: String(
        data.get('property_type') ?? 'multifamily',
      ) as ListingPropertyType,
      address_line1: String(data.get('address_line1') ?? ''),
      address_line2: addressLine2.length > 0 ? addressLine2 : undefined,
      region: String(data.get('region') ?? ''),
      postal_code: String(data.get('postal_code') ?? ''),
      country: String(data.get('country') ?? 'US'),
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      status: String(data.get('status') ?? 'draft') as ListingStatus,
    })
  }

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={handleSubmit}>
      {errorMessage ? (
        <p role="alert" className="m-0 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <Field
        id="listing-title"
        label="Title"
        error={firstFieldError(fieldErrors, 'title')}
      >
        <input
          id="listing-title"
          name="title"
          type="text"
          required
          maxLength={200}
          disabled={isSubmitting}
          className={inputClassName}
        />
      </Field>

      <Field
        id="listing-property-type"
        label="Property type"
        error={firstFieldError(fieldErrors, 'property_type')}
      >
        <select
          id="listing-property-type"
          name="property_type"
          required
          disabled={isSubmitting}
          className={inputClassName}
          defaultValue="multifamily"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="listing-address-line1"
        label="Address"
        error={firstFieldError(fieldErrors, 'address_line1')}
      >
        <input
          id="listing-address-line1"
          name="address_line1"
          type="text"
          required
          maxLength={300}
          disabled={isSubmitting}
          className={inputClassName}
        />
      </Field>

      <Field
        id="listing-address-line2"
        label="Address line 2"
        error={firstFieldError(fieldErrors, 'address_line2')}
      >
        <input
          id="listing-address-line2"
          name="address_line2"
          type="text"
          maxLength={300}
          disabled={isSubmitting}
          className={inputClassName}
        />
      </Field>

      <Field
        id="listing-city"
        label="City"
        error={firstFieldError(fieldErrors, 'city')}
      >
        <input
          id="listing-city"
          name="city"
          type="text"
          required
          maxLength={120}
          disabled={isSubmitting}
          className={inputClassName}
        />
      </Field>

      <Field
        id="listing-region"
        label="Region"
        error={firstFieldError(fieldErrors, 'region')}
      >
        <input
          id="listing-region"
          name="region"
          type="text"
          required
          maxLength={120}
          disabled={isSubmitting}
          className={inputClassName}
        />
      </Field>

      <Field
        id="listing-postal-code"
        label="Postal code"
        error={firstFieldError(fieldErrors, 'postal_code')}
      >
        <input
          id="listing-postal-code"
          name="postal_code"
          type="text"
          required
          minLength={3}
          maxLength={20}
          disabled={isSubmitting}
          className={inputClassName}
        />
      </Field>

      <Field
        id="listing-price"
        label="Price (USD)"
        error={firstFieldError(fieldErrors, 'price')}
      >
        <input
          id="listing-price"
          name="price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={0}
          disabled={isSubmitting}
          className={inputClassName}
        />
      </Field>

      <Field
        id="listing-status"
        label="Status"
        error={firstFieldError(fieldErrors, 'status')}
      >
        <select
          id="listing-status"
          name="status"
          disabled={isSubmitting}
          className={inputClassName}
          defaultValue="draft"
        >
          {listingStatuses.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="listing-description"
        label="Description"
        error={firstFieldError(fieldErrors, 'description')}
      >
        <textarea
          id="listing-description"
          name="description"
          rows={4}
          maxLength={5000}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-base font-normal text-[var(--sea-ink)] disabled:opacity-60"
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error: string | undefined
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--sea-ink)]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="m-0 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
