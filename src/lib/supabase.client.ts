// src/lib/supabase.client.ts
// Browser-safe: ONLY public env values from docs/env-var-checklist.md.
// Login forms and React components may import this file.
// Do not import src/lib/supabase.server.ts from client components.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Public browser client: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY only.
 * Throws if either public value is missing instead of creating a broken client.
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env and docs/env-var-checklist.md.',
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

/** Alias for login/UI imports. Same public-only client as createBrowserSupabaseClient. */
export const supabaseBrowser = createBrowserSupabaseClient
