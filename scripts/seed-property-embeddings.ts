/**
 * Seed PREIshare sample listings + embeddings into public.properties.
 *
 * Columns written (must match the migration, not the tutorial JSON scaffold):
 *   id, owner_id, title, description, city, status, embedding
 *
 * Run from the repo root:
 *   npx tsx scripts/seed-property-embeddings.ts
 *   # or: npm run seed:embeddings
 *
 * Env (names only — never commit values):
 *   SUPABASE_URL or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (server/admin only; bypasses RLS)
 *   EMBEDDING_API_KEY          (or `mock` for a labeled 1536-d offline vector)
 *   SEED_OWNER_ID              (existing public.profiles.id / auth user uuid)
 *
 * Re-runs upsert by stable sample id so duplicates are not created.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import {
  assertEmbeddingDimension,
  generatePropertyEmbedding,
} from '../src/lib/embeddings/generate'
import { EMBEDDING_DIMENSIONS } from '../src/lib/embeddings/types'

const SAMPLE_STATUSES = [
  'draft',
  'published',
  'under_offer',
  'sold',
  'archived',
] as const

type SampleStatus = (typeof SAMPLE_STATUSES)[number]

type SampleProperty = {
  id: string
  title: string
  description: string
  city: string
  status: SampleStatus
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }
  return value.trim()
}

function loadLocalEnvFiles() {
  const load = (
    process as NodeJS.Process & { loadEnvFile?: (path: string) => void }
  ).loadEnvFile
  if (typeof load !== 'function') return
  for (const file of ['.env', '.env.local']) {
    try {
      load.call(process, file)
    } catch {
      // File is optional.
    }
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  )
}

function isSampleStatus(value: string): value is SampleStatus {
  return (SAMPLE_STATUSES as readonly string[]).includes(value)
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}

async function main() {
  loadLocalEnvFiles()

  const url = readEnv('SUPABASE_URL') ?? readEnv('VITE_SUPABASE_URL')
  const serviceRoleKey = readEnv('SUPABASE_SERVICE_ROLE_KEY')
  const ownerId = readEnv('SEED_OWNER_ID')

  if (!url || !serviceRoleKey) {
    console.error(
      'Missing SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY.',
    )
    process.exit(1)
  }
  if (!ownerId || !isUuid(ownerId)) {
    console.error(
      'Set SEED_OWNER_ID to an existing public.profiles.id (uuid). Seed rows require owner_id.',
    )
    process.exit(1)
  }
  if (!readEnv('EMBEDDING_API_KEY')) {
    console.error(
      'Missing EMBEDDING_API_KEY. Set a provider key, or use mock for offline 1536-d vectors.',
    )
    process.exit(1)
  }

  const filePath = path.join(process.cwd(), 'data', 'sample-properties.json')
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw) as { properties?: unknown }
  if (!Array.isArray(parsed.properties) || parsed.properties.length < 6) {
    console.error('data/sample-properties.json must contain at least 6 properties.')
    process.exit(1)
  }

  const properties: SampleProperty[] = []
  for (const row of parsed.properties) {
    if (typeof row !== 'object' || row === null) {
      console.error('Each sample property must be an object.')
      process.exit(1)
    }
    const candidate = row as Record<string, unknown>
    const id = candidate.id
    const title = candidate.title
    const description = candidate.description
    const city = candidate.city
    const status = candidate.status
    if (typeof id !== 'string' || !isUuid(id)) {
      console.error('Each sample needs a uuid id. Got:', id)
      process.exit(1)
    }
    if (typeof title !== 'string' || typeof description !== 'string') {
      console.error('Sample', id, 'needs title and description strings.')
      process.exit(1)
    }
    if (typeof city !== 'string') {
      console.error('Sample', id, 'needs a city string.')
      process.exit(1)
    }
    if (typeof status !== 'string' || !isSampleStatus(status)) {
      console.error('Sample', id, 'needs a closed-list status.')
      process.exit(1)
    }
    properties.push({ id, title, description, city, status })
  }

  // Same admin pattern as src/lib/supabase/server.ts (service role, no session).
  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let failed = false
  for (const property of properties) {
    const result = await generatePropertyEmbedding({
      title: property.title,
      description: property.description,
    })

    if (!result.ok) {
      console.error('Failed to embed', property.id, result.code, result.message)
      process.exit(1)
    }

    if (
      result.dimensions !== EMBEDDING_DIMENSIONS ||
      !assertEmbeddingDimension(result.embedding)
    ) {
      console.error(
        `Dimension mismatch for ${property.id}: expected ${EMBEDDING_DIMENSIONS}, got ${result.embedding.length}.`,
      )
      process.exit(1)
    }

    const { error } = await supabase.from('properties').upsert(
      {
        id: property.id,
        owner_id: ownerId,
        title: property.title,
        description: property.description,
        city: property.city,
        status: property.status,
        embedding: toVectorLiteral(result.embedding),
      },
      { onConflict: 'id' },
    )

    if (error) {
      console.error('Failed to seed', property.id, error.message)
      failed = true
      continue
    }

    console.log(
      'Seeded',
      property.id,
      property.title,
      'embedding dims:',
      result.embedding.length,
      'model:',
      result.model,
    )
  }

  if (failed) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
