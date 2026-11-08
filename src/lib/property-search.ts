/**
 * SERVER-ONLY similarity search helper.
 *
 * Query text → generatePropertyEmbedding → match_properties RPC → ranked rows.
 * Do not import from browser components (reads EMBEDDING_API_KEY + service role).
 *
 * Score: SQL returns `similarity` where HIGHER means closer meaning
 * (1 - cosine distance). Ordering is already best-first.
 */
import { createServerSupabaseClient } from './supabase/server'
import {
  assertEmbeddingDimension,
  generatePropertyEmbedding,
} from './embeddings/generate'
import { EMBEDDING_DIMENSIONS } from './embeddings/types'

export type PropertyMatch = {
  id: string
  title: string
  description: string | null
  city: string | null
  /** Higher = closer meaning. Not raw <=> distance. */
  similarity: number
}

export type PropertySearchError = {
  ok: false
  message: string
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}

/**
 * Embed a buyer query and return the top-K property matches.
 * Empty/whitespace queries return [] and do not call the model or RPC.
 */
export async function searchPropertiesByText(
  query: string,
  matchCount = 5,
): Promise<PropertyMatch[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const limit = Math.max(1, matchCount)

  // Same generate module as seed: query text as the title, empty description
  // so buildEmbeddingText emits the phrase alone (data model: embed the query).
  const generated = await generatePropertyEmbedding({
    title: trimmed,
    description: '',
  })

  if (!generated.ok) {
    throw new Error(
      `Could not embed search query (${generated.code}): ${generated.message}`,
    )
  }

  if (
    generated.dimensions !== EMBEDDING_DIMENSIONS ||
    !assertEmbeddingDimension(generated.embedding)
  ) {
    throw new Error(
      `Query embedding length ${generated.embedding.length} !== ${EMBEDDING_DIMENSIONS}.`,
    )
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc('match_properties', {
    query_embedding: toVectorLiteral(generated.embedding),
    match_count: limit,
  })

  if (error) {
    throw new Error(`match_properties failed: ${error.message}`)
  }

  const rows = (data ?? []) as PropertyMatch[]
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    city: row.city ?? null,
    similarity: Number(row.similarity),
  }))
}
