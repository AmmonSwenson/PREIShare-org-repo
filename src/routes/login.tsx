import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createClientOnlyFn, useServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import { persistSession } from '../lib/auth/session'

const signInWithPassword = createClientOnlyFn(
  async (email: string, password: string) => {
    const { createBrowserSupabaseClient } = await import('../lib/supabase.client')
    const supabase = createBrowserSupabaseClient()
    return supabase.auth.signInWithPassword({ email, password })
  },
)

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const persistSessionFn = useServerFn(persistSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const { data, error } = await signInWithPassword(email, password)

      if (error) {
        setErrorMessage(
          error.message || 'Sign-in failed. Check your email and password.',
        )
        return
      }

      if (!data.session) {
        setErrorMessage(
          'Sign-in did not return a session. Confirm your email and try again.',
        )
        return
      }

      await persistSessionFn({
        data: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        },
      })
      await navigate({ to: '/dashboard' })
    } catch (caught) {
      setErrorMessage(messageFromUnknown(caught))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap mx-auto max-w-md px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Sponsor access</p>
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
          Sponsor sign in
        </h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Sign in to manage PREIshare properties you are allowed to see.
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-[var(--sea-ink)]">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal text-[var(--sea-ink)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-[var(--sea-ink)]">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal text-[var(--sea-ink)]"
            />
          </label>

          {errorMessage ? (
            <p role="alert" className="m-0 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 mb-0 text-sm text-[var(--sea-ink-soft)]">
          New sponsor?{' '}
          <Link
            to="/auth/signup"
            className="font-semibold text-[var(--lagoon-deep)]"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}

function messageFromUnknown(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }
  return 'Sign-in failed. Check your email and password.'
}
