import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <section>
      <h2 className="mt-0 text-lg font-semibold text-[var(--sea-ink)]">
        Profile
      </h2>
      <p className="text-[var(--sea-ink-soft)]">
        Placeholder for investor profile details.
      </p>
    </section>
  )
}
