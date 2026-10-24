/**
 * Cookie + Supabase Auth implementation for sponsor sessions.
 * Imported only from createServerFn handlers in session.ts.
 */
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '../supabase/server'
import type { SponsorSession, SponsorUser } from './session'

const ACCESS_COOKIE = 'preishare-access-token'
const REFRESH_COOKIE = 'preishare-refresh-token'
const WEEK_SECONDS = 60 * 60 * 24 * 7

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: WEEK_SECONDS,
  }
}

function writeSessionCookies(accessToken: string, refreshToken: string) {
  const options = cookieOptions()
  setCookie(ACCESS_COOKIE, accessToken, options)
  setCookie(REFRESH_COOKIE, refreshToken, options)
}

export function clearSessionCookies() {
  const options = { path: '/' }
  deleteCookie(ACCESS_COOKIE, options)
  deleteCookie(REFRESH_COOKIE, options)
}

function toSponsorUser(id: string, email: string | undefined): SponsorUser {
  return { id, email: email ?? null }
}

export async function readSponsorSession(): Promise<SponsorSession | null> {
  const accessToken = getCookie(ACCESS_COOKIE)
  const refreshToken = getCookie(REFRESH_COOKIE)

  if (!accessToken && !refreshToken) {
    return null
  }

  const supabase = createServerSupabaseClient()

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (!error && data.user) {
      return { user: toSponsorUser(data.user.id, data.user.email) }
    }
  }

  if (!refreshToken) {
    clearSessionCookies()
    return null
  }

  const refreshed = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  })
  const nextSession = refreshed.data.session
  if (refreshed.error || !nextSession) {
    clearSessionCookies()
    return null
  }

  writeSessionCookies(nextSession.access_token, nextSession.refresh_token)
  return {
    user: toSponsorUser(nextSession.user.id, nextSession.user.email),
  }
}

export async function persistSponsorSession(tokens: {
  accessToken: string
  refreshToken: string
}): Promise<{ user: SponsorUser }> {
  const supabase = createServerSupabaseClient()
  const { data: userData, error } = await supabase.auth.getUser(
    tokens.accessToken,
  )
  if (error || !userData.user) {
    throw new Error('Could not verify this session. Sign in again.')
  }
  writeSessionCookies(tokens.accessToken, tokens.refreshToken)
  return { user: toSponsorUser(userData.user.id, userData.user.email) }
}

export async function revokeSponsorSession(): Promise<void> {
  const accessToken = getCookie(ACCESS_COOKIE)
  if (accessToken) {
    try {
      const supabase = createServerSupabaseClient()
      await supabase.auth.admin.signOut(accessToken, 'global')
    } catch {
      // Cookie clear still ends the app session even if revoke fails.
    }
  }
  clearSessionCookies()
}
