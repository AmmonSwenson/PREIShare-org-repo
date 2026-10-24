/**
 * Server-only sponsor session helpers.
 *
 * Import these from loaders, `beforeLoad`, and event handlers.
 * Cookie reads and `src/lib/supabase/server.ts` stay behind `createServerFn`
 * so the service-role key is not imported by login/signup UI.
 *
 * Tokens live in HttpOnly cookies. `getSession` / `getUser` return the
 * sponsor identity only — never access or refresh tokens — so route context
 * cannot leak JWTs into the browser payload.
 */
import { createServerFn } from '@tanstack/react-start'

export type SponsorUser = {
  id: string
  email: string | null
}

export type SponsorSession = {
  user: SponsorUser
}

function parseSessionTokens(data: unknown): {
  accessToken: string
  refreshToken: string
} {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid session payload')
  }
  const accessToken =
    'accessToken' in data && typeof data.accessToken === 'string'
      ? data.accessToken
      : ''
  const refreshToken =
    'refreshToken' in data && typeof data.refreshToken === 'string'
      ? data.refreshToken
      : ''
  if (accessToken.length === 0 || refreshToken.length === 0) {
    throw new Error('Invalid session payload')
  }
  return { accessToken, refreshToken }
}

/** Validate a browser-issued session and store it in HttpOnly cookies. */
export const persistSession = createServerFn({ method: 'POST' })
  .validator(parseSessionTokens)
  .handler(async ({ data }) => {
    const { persistSponsorSession } = await import('./session.server')
    return persistSponsorSession(data)
  })

export const getSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SponsorSession | null> => {
    const { readSponsorSession } = await import('./session.server')
    return readSponsorSession()
  },
)

export const getUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SponsorUser | null> => {
    const { readSponsorSession } = await import('./session.server')
    const session = await readSponsorSession()
    return session?.user ?? null
  },
)

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const { revokeSponsorSession } = await import('./session.server')
  await revokeSponsorSession()
  return { ok: true as const }
})
