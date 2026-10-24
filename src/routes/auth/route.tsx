import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="page-wrap px-4 py-12">
      <Outlet />
    </main>
  )
}
