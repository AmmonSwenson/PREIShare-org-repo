import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '../../components/dashboard/AppShell'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <AppShell title="Overview">
      {/* Home widgets and child pages render here — do not wrap AppShell again */}
      <Outlet />
    </AppShell>
  )
}
