import { z } from 'zod'

/** Allowed listing status values — keep in sync with the Postgres check constraint. */
export const listingStatusSchema = z.enum([
  'draft',
  'published',
  'under_offer',
  'sold',
  'archived',
])

/** Allowed property types — keep in sync with the Postgres check constraint. */
export const propertyTypeSchema = z.enum([
  'multifamily',
  'office',
  'retail',
  'industrial',
  'mixed_use',
  'land',
])

const titleSchema = z.string().trim().min(1, 'Title is required').max(200)
const descriptionSchema = z.string().trim().max(5000)
const addressLine1Schema = z
  .string()
  .trim()
  .min(1, 'Address is required')
  .max(300)
const addressLine2Schema = z.string().trim().max(300)
const citySchema = z.string().trim().min(1, 'City is required').max(120)
const regionSchema = z.string().trim().min(1, 'Region is required').max(120)
const postalCodeSchema = z
  .string()
  .trim()
  .min(3, 'Postal code is required')
  .max(20)
const countrySchema = z.string().trim().min(2, 'Country is required').max(2)
const priceSchema = z.coerce.number().min(0, 'Price must be zero or greater')
const closedAtSchema = z.string().trim().min(1, 'Closed date is required')

function applyClosedAtRule(
  data: {
    status?: string | undefined
    closed_at?: string | null | undefined
  },
  ctx: z.RefinementCtx,
) {
  if (data.status === 'sold' && (data.closed_at === undefined || data.closed_at === null || data.closed_at === '')) {
    ctx.addIssue({
      code: 'custom',
      path: ['closed_at'],
      message: 'Sold listings need a closed date.',
    })
  }
  if (
    data.status !== undefined &&
    data.status !== 'sold' &&
    data.closed_at !== undefined &&
    data.closed_at !== null &&
    data.closed_at !== ''
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['closed_at'],
      message: 'Only sold listings can have a closed date.',
    })
  }
}

export const createListingSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema.optional(),
    property_type: propertyTypeSchema,
    status: listingStatusSchema.default('draft'),
    address_line1: addressLine1Schema,
    address_line2: addressLine2Schema.optional(),
    city: citySchema,
    region: regionSchema,
    postal_code: postalCodeSchema,
    country: countrySchema.default('US'),
    price: priceSchema.default(0),
    currency: z.literal('USD').default('USD'),
    closed_at: closedAtSchema.optional(),
  })
  .superRefine((data, ctx) => {
    applyClosedAtRule(data, ctx)
  })

export const updateListingSchema = z
  .object({
    id: z.string().uuid('Listing id must be a valid UUID'),
    title: titleSchema.optional(),
    description: descriptionSchema.nullable().optional(),
    property_type: propertyTypeSchema.optional(),
    status: listingStatusSchema.optional(),
    address_line1: addressLine1Schema.optional(),
    address_line2: addressLine2Schema.nullable().optional(),
    city: citySchema.optional(),
    region: regionSchema.optional(),
    postal_code: postalCodeSchema.optional(),
    country: countrySchema.optional(),
    price: priceSchema.optional(),
    currency: z.literal('USD').optional(),
    closed_at: closedAtSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    applyClosedAtRule(data, ctx)
  })

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
export type ListingStatus = z.infer<typeof listingStatusSchema>
export type ListingPropertyType = z.infer<typeof propertyTypeSchema>

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string[]> {
  const flattened = error.flatten()
  const fieldErrors: Record<string, string[]> = {}
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      fieldErrors[key] = messages
    }
  }
  if (flattened.formErrors.length > 0) {
    fieldErrors._form = flattened.formErrors
  }
  return fieldErrors
}

export function blankToNull(
  value: string | null | undefined,
): string | null | undefined {
  if (value === '') {
    return null
  }
  return value
}
