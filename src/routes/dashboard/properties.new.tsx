import { Link, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'

type CreatePropertyInput = {
  title: string
  city: string
  description: string
}

type CreatePropertyResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

function parseCreatePropertyInput(data: unknown): CreatePropertyInput {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid property payload')
  }
  const record = data as Record<string, unknown>
  const title = typeof record.title === 'string' ? record.title.trim() : ''
  const city = typeof record.city === 'string' ? record.city.trim() : ''
  const description =
    typeof record.description === 'string' ? record.description.trim() : ''
  if (title.length === 0) {
    throw new Error('Title is required')
  }
  return { title, city, description }
}

function publicInsertError(message: string): string {
  if (/service.role|jwt|apikey|secret/i.test(message)) {
    return 'Could not save this property. Try again.'
  }
  return message
}

function cookieStoreFrom(getCookie: (name: string) => string | undefined) {
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

/**
 * Server insert. Ownership is taken from the signed-in user (auth.uid()),
 * never from the form. RLS WITH CHECK on properties_insert_own must still pass.
 */
export const createProperty = createServerFn({ method: 'POST' })
  .validator(parseCreatePropertyInput)
  .handler(async ({ data }): Promise<CreatePropertyResult> => {
    const { getCookie } = await import('@tanstack/react-start/server')
    const { createSupabaseServerClient } = await import('../../lib/supabase.server')

    const accessToken = getCookie('preishare-access-token')
    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      return { ok: false, error: 'You must be signed in to add a property.' }
    }

    const supabase = createSupabaseServerClient(cookieStoreFrom(getCookie))
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      return { ok: false, error: 'You must be signed in to add a property.' }
    }

    const displayName =
      typeof user.email === 'string' && user.email.length > 0
        ? user.email
        : 'Sponsor'

    const profileResult = await supabase.from('profiles').upsert(
      { id: user.id, display_name: displayName },
      { onConflict: 'id' },
    )
    if (profileResult.error) {
      return {
        ok: false,
        error: publicInsertError(profileResult.error.message),
      }
    }

    const { data: row, error } = await supabase
      .from('properties')
      .insert({
        title: data.title,
        city: data.city.length > 0 ? data.city : null,
        description: data.description.length > 0 ? data.description : null,
        status: 'draft',
        owner_id: user.id,
      })
      .select('id')
      .single()

    if (error || !row || typeof row.id !== 'string') {
      return {
        ok: false,
        error: publicInsertError(
          error?.message ?? 'Could not save this property. Try again.',
        ),
      }
    }

    return { ok: true, id: row.id }
  })

export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewPropertyPage,
})

function NewPropertyPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const createPropertyFn = useServerFn(createProperty)
  const [title, setTitle] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      const result = await createPropertyFn({
        data: { title, city, description },
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      await router.invalidate({ sync: true })
      await navigate({ to: '/dashboard/properties' })
    } catch (caught) {
      setError(messageFromUnknown(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">
          Add property
        </h1>
        <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
          New listings are saved for your sponsor account only (enforced by
          RLS). Ownership is set from your session, not from this form.
        </p>
      </header>

      <form className="flex max-w-lg flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--sea-ink)]">
          Title
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={pending}
            className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--sea-ink)]">
          City
          <input
            name="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            disabled={pending}
            className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--sea-ink)]">
          Description
          <textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={pending}
            rows={4}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-base font-normal"
          />
        </label>

        {error ? (
          <p role="alert" className="m-0 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Create property'}
        </button>
      </form>

      <p className="m-0 text-sm">
        <Link
          to="/dashboard/properties"
          className="font-semibold text-[var(--lagoon-deep)]"
        >
          Back to properties
        </Link>
      </p>
    </section>
  )
}

function messageFromUnknown(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return publicInsertError(error.message)
  }
  return 'Could not save this property. Try again.'
}
