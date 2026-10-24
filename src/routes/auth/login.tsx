import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  beforeLoad: () => {
    throw redirect({ to: '/login' })
  },
  component: AuthLoginRedirect,
})

function AuthLoginRedirect() {
  return null
}
