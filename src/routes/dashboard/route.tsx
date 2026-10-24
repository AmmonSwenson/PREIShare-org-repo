import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AppShell } from '../../components/dashboard/AppShell'
import { getUser, signOut } from '../../lib/auth/session'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getUser()
    if (!user) {
      throw redirect({ to: '/auth/login' })
    }
    return { user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const signOutFn = useServerFn(signOut)

  async function handleSignOut() {
    await signOutFn()
    await navigate({ to: '/auth/login' })
  }

  return (
    <AppShell
      title="Overview"
      userLabel={user.email ?? 'Sponsor'}
      actions={
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="min-h-11 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 text-sm font-semibold text-[var(--sea-ink)]"
        >
          Sign out
        </button>
      }
    >
      {/* Home widgets and child pages render here — do not wrap AppShell again */}
      <Outlet />
    </AppShell>
  )
}
