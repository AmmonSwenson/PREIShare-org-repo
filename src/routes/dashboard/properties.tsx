import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/properties')({
  component: PropertiesLayout,
})

function PropertiesLayout() {
  return <Outlet />
}
