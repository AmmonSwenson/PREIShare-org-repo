/**
 * SERVER-ONLY Supabase helper.
 *
 * Never import this file from React components, `src/components/`, or any
 * module that ships to the browser. Use it from loaders, `createServerFn`,
 * and `createServerOnlyFn` only.
 *
 * This client uses SUPABASE_SERVICE_ROLE_KEY, which **bypasses RLS**.
 * Sponsor listing CRUD in later steps should attach the user session
 * (anon key + JWT) so RLS still applies. Do not put this key in VITE_ vars.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

function readServerEnv(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string' || value.length === 0) {
    return undefined
  }
  return value
}

export function createServerSupabaseClient(): SupabaseClient<Database> {
  const url = readServerEnv('SUPABASE_URL') ?? readServerEnv('VITE_SUPABASE_URL')
  const serviceRoleKey = readServerEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY. These are server-only. See docs/setup/supabase-env-checklist.md',
    )
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
