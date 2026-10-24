/**
 * BROWSER-SAFE Supabase helper.
 * Reads only VITE_ public env vars. Never import the service-role key here.
 * React components and client routes may import this file.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

function requirePublicEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = import.meta.env[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill values from Project Settings → API. See docs/setup/supabase-env-checklist.md`,
    )
  }
  return value
}

export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  const url = requirePublicEnv('VITE_SUPABASE_URL')
  const anonKey = requirePublicEnv('VITE_SUPABASE_ANON_KEY')

  return createClient<Database>(url, anonKey)
}
