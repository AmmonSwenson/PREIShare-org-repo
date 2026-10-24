// src/lib/supabase.server.ts
// Server-only module. Do not import this file from pure client components.
// Env names match docs/env-var-checklist.md and .env.example.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** HttpOnly access token written by sponsor session helpers. */
const ACCESS_COOKIE = 'preishare-access-token'

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing server env ${name}. See docs/env-var-checklist.md.`)
  }
  return value
}

function readProcessEnv(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string' || value.length === 0) {
    return undefined
  }
  return value
}

export type ServerCookieStore = {
  get: (key: string) => { value: string } | undefined
  set?: (key: string, value: string, options?: Record<string, unknown>) => void
  remove?: (key: string, options?: Record<string, unknown>) => void
}

function publicProjectUrl(): string {
  return requireEnv(
    'SUPABASE_URL',
    readProcessEnv('SUPABASE_URL') ?? readProcessEnv('VITE_SUPABASE_URL'),
  )
}

function anonKey(): string {
  return requireEnv(
    'SUPABASE_ANON_KEY',
    readProcessEnv('SUPABASE_ANON_KEY') ?? readProcessEnv('VITE_SUPABASE_ANON_KEY'),
  )
}

/**
 * Session-aware server client for sponsor auth + RLS.
 * Uses the anon/publishable key plus the access-token cookie so Postgres RLS
 * still applies. This is the default path for dashboard listing reads/writes.
 * Do not use createSupabaseServiceRoleClient for normal sponsor UI.
 */
export function createSupabaseServerClient(
  cookieStore: ServerCookieStore,
): SupabaseClient {
  const url = publicProjectUrl()
  const key = anonKey()
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value

  if (accessToken) {
    return createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    })
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Privileged admin client — ONLY on the server, ONLY when you truly need to
 * bypass RLS (migrations, trusted admin jobs). Prefer createSupabaseServerClient
 * for normal sponsor dashboard reads/writes so RLS still applies.
 */
export function createSupabaseServiceRoleClient(): SupabaseClient {
  const url = publicProjectUrl()
  const serviceRoleKey = requireEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    readProcessEnv('SUPABASE_SERVICE_ROLE_KEY'),
  )

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
