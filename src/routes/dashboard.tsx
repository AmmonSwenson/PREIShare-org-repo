import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { AppShell } from '../components/dashboard/AppShell'
import { signOut } from '../lib/auth/session'

type DashboardSession = {
  user: {
    id: string
    email: string | null
  }
}

/**
 * Server session check via createSupabaseServerClient (anon key + cookies).
 * Dynamic-import the server module so it never ships in the browser bundle.
 */
const readDashboardSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DashboardSession | null> => {
    try {
      const { getCookie } = await import('@tanstack/react-start/server')
      const { createSupabaseServerClient } = await import('../lib/supabase.server')

      const accessToken = getCookie('preishare-access-token')
      if (typeof accessToken !== 'string' || accessToken.length === 0) {
        return null
      }

      const supabase = createSupabaseServerClient({
        get: (key) => {
          const value = getCookie(key)
          if (typeof value !== 'string' || value.length === 0) {
            return undefined
          }
          return { value }
        },
      })

      const { data, error } = await supabase.auth.getUser(accessToken)
      if (error || !data.user) {
        return null
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email ?? null,
        },
      }
    } catch {
      return null
    }
  },
)

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await readDashboardSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { session }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const { session } = Route.useRouteContext()
  const signOutFn = useServerFn(signOut)

  async function handleSignOut() {
    await signOutFn()
    await navigate({ to: '/login' })
  }

  return (
    <AppShell
      title="Overview"
      userLabel={session.user.email ?? 'Sponsor'}
      actions={
        <nav className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-[var(--lagoon-deep)] underline"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="min-h-11 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 text-sm font-semibold text-[var(--sea-ink)]"
          >
            Sign out
          </button>
        </nav>
      }
    >
      <Outlet />
    </AppShell>
  )
}
