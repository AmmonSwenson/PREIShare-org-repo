/**
 * Server-only property listing loaders and actions.
 *
 * UI (step 10) should import these createServerFn exports — not the browser
 * Supabase client and not src/lib/supabase/server.ts. Ownership always comes
 * from the signed-in session (`owner_id`), never from the request body.
 */
import { createServerFn } from '@tanstack/react-start'
import { getUser } from '../lib/auth/session'
import {
  blankToNull,
  createListingSchema,
  fieldErrorsFromZod,
  updateListingSchema,
} from '../lib/listings/schema'
import type {
  PropertyListingRow,
  PropertyListingUpdate,
} from '../lib/supabase/types'

export type ListingRow = PropertyListingRow

export type ListingsResult =
  | { ok: true; listings: ListingRow[] }
  | { ok: false; error: string }

export type ListingMutationResult =
  | { ok: true; listing: ListingRow }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

const unauthenticatedList: ListingsResult = {
  ok: false,
  error: 'You must be signed in to view listings.',
}

async function requireListingsClient(): Promise<
  | { ok: true; ownerId: string; supabase: Awaited<ReturnType<typeof loadUserClient>> }
  | { ok: false; error: string }
> {
  const user = await getUser()
  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const { readSponsorAuth } = await import('../lib/auth/session.server')
  const auth = await readSponsorAuth()
  if (!auth) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const supabase = await loadUserClient(auth.accessToken)
  return { ok: true, ownerId: auth.user.id, supabase }
}

async function loadUserClient(accessToken: string) {
  const { createUserServerSupabaseClient } = await import(
    '../lib/supabase/server'
  )
  return createUserServerSupabaseClient(accessToken)
}

/** Loader: listings for the signed-in sponsor only (session + RLS). */
export const listMyListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ListingsResult> => {
    const context = await requireListingsClient()
    if (!context.ok) {
      return unauthenticatedList
    }

    const { data, error } = await context.supabase
      .from('property_listings')
      .select('*')
      .eq('owner_id', context.ownerId)
      .order('created_at', { ascending: false })

    if (error) {
      return { ok: false, error: 'Could not load listings. Try again.' }
    }

    return { ok: true, listings: data ?? [] }
  },
)

/** Action: create a listing owned by the session user — never trust body.owner_id. */
export const createListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const parsed = createListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Please fix the highlighted fields.',
        fieldErrors: fieldErrorsFromZod(parsed.error),
      }
    }

    const context = await requireListingsClient()
    if (!context.ok) {
      return { ok: false, error: 'You must be signed in to create a listing.' }
    }

    const input = parsed.data
    const { data: row, error } = await context.supabase
      .from('property_listings')
      .insert({
        title: input.title,
        description: blankToNull(input.description) ?? null,
        property_type: input.property_type,
        status: input.status,
        address_line1: input.address_line1,
        address_line2: blankToNull(input.address_line2) ?? null,
        city: input.city,
        region: input.region,
        postal_code: input.postal_code,
        country: input.country,
        price: input.price,
        currency: input.currency,
        closed_at: blankToNull(input.closed_at) ?? null,
        owner_id: context.ownerId,
      })
      .select('*')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error: 'Could not create listing. Check your input and try again.',
      }
    }

    return { ok: true, listing: row }
  })

/** Action: update only if the row is visible under RLS for this sponsor. */
export const updateListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const parsed = updateListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Please fix the highlighted fields.',
        fieldErrors: fieldErrorsFromZod(parsed.error),
      }
    }

    const context = await requireListingsClient()
    if (!context.ok) {
      return { ok: false, error: 'You must be signed in to update a listing.' }
    }

    const { id, ...patch } = parsed.data
    const definedPatch: PropertyListingUpdate = {}
    if (patch.title !== undefined) definedPatch.title = patch.title
    if (patch.description !== undefined) {
      definedPatch.description = blankToNull(patch.description) ?? null
    }
    if (patch.property_type !== undefined) {
      definedPatch.property_type = patch.property_type
    }
    if (patch.status !== undefined) definedPatch.status = patch.status
    if (patch.address_line1 !== undefined) {
      definedPatch.address_line1 = patch.address_line1
    }
    if (patch.address_line2 !== undefined) {
      definedPatch.address_line2 = blankToNull(patch.address_line2) ?? null
    }
    if (patch.city !== undefined) definedPatch.city = patch.city
    if (patch.region !== undefined) definedPatch.region = patch.region
    if (patch.postal_code !== undefined) {
      definedPatch.postal_code = patch.postal_code
    }
    if (patch.country !== undefined) definedPatch.country = patch.country
    if (patch.price !== undefined) definedPatch.price = patch.price
    if (patch.currency !== undefined) definedPatch.currency = patch.currency
    if (patch.closed_at !== undefined) {
      definedPatch.closed_at = blankToNull(patch.closed_at) ?? null
    }

    if (Object.keys(definedPatch).length === 0) {
      return { ok: false, error: 'No fields to update.' }
    }

    const { data: row, error } = await context.supabase
      .from('property_listings')
      .update(definedPatch)
      .eq('id', id)
      .eq('owner_id', context.ownerId)
      .select('*')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error:
          'Could not update listing. It may not exist or you may not own it.',
      }
    }

    return { ok: true, listing: row }
  })
