export type InvestorProfile = {
  displayName: string
  email: string
  phone?: string | undefined
  membershipTier: string
  preferredContact: string
  notes: string
}

const mockProfile: InvestorProfile = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1-512-555-0142',
  membershipTier: 'Preferred investor',
  preferredContact: 'Email',
  notes: 'Interested in multifamily and industrial deals in Texas. Sample profile only.',
}

type ProfileCardProps = {
  profile?: InvestorProfile | undefined
  isSampleData?: boolean | undefined
}

export function ProfileCard({
  profile = mockProfile,
  isSampleData = true,
}: ProfileCardProps) {
  return (
    <section
      className="island-shell rounded-2xl p-5 sm:p-6"
      aria-label="Investor profile"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">Your profile</h2>
        {isSampleData ? (
          <p
            className="m-0 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
            role="note"
          >
            Sample profile — not a live account
          </p>
        ) : null}
      </div>
      <dl className="m-0 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
            Name
          </dt>
          <dd className="m-0 mt-1 text-[var(--sea-ink)]">{profile.displayName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
            Email
          </dt>
          <dd className="m-0 mt-1 text-[var(--sea-ink)]">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
            Membership
          </dt>
          <dd className="m-0 mt-1 text-[var(--sea-ink)]">{profile.membershipTier}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
            Preferred contact
          </dt>
          <dd className="m-0 mt-1 text-[var(--sea-ink)]">{profile.preferredContact}</dd>
        </div>
        {profile.phone ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
              Phone
            </dt>
            <dd className="m-0 mt-1 text-[var(--sea-ink)]">{profile.phone}</dd>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
            Notes
          </dt>
          <dd className="m-0 mt-1 text-[var(--sea-ink)]">{profile.notes}</dd>
        </div>
      </dl>
    </section>
  )
}
