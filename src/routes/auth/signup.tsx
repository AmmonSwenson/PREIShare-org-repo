import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import { persistSession } from '../../lib/auth/session'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/auth/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const persistSessionFn = useServerFn(persistSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setPending(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) {
        setError(signUpError.message)
        return
      }
      if (!data.session) {
        setNotice(
          'Check your email to confirm this account, then sign in. If your project has email confirmation off, sign in directly.',
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
      setError(messageFromUnknown(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="island-shell mx-auto max-w-md rounded-2xl p-6 sm:p-8">
      <p className="island-kicker mb-2">Sponsor access</p>
      <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
        Create an account
      </h1>
      <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
        Register with email and password to manage your property listings.
      </p>

      <form className="flex flex-col gap-4" onSubmit={(event) => void onSubmit(event)}>
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
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal text-[var(--sea-ink)]"
          />
        </label>

        {error ? (
          <p role="alert" className="m-0 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p role="status" className="m-0 text-sm text-[var(--sea-ink)]">
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
        >
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 mb-0 text-sm text-[var(--sea-ink-soft)]">
        Already registered?{' '}
        <Link to="/auth/login" className="font-semibold text-[var(--lagoon-deep)]">
          Sign in
        </Link>
      </p>
    </section>
  )
}

function messageFromUnknown(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }
  return 'Sign-up failed. Try again.'
}
