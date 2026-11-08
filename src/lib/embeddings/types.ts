/**
 * Embedding module contract for PREIshare semantic search.
 * Dimension and input fields match docs/embedding-data-model.md.
 * Implementation lives in ./generate.ts — this file has no network code.
 */

/** Must match `properties.embedding vector(1536)` in the pgvector migration. */
export const EMBEDDING_DIMENSIONS = 1536

/**
 * Text fields concatenated into one embedding.
 * Recipe: `{title}\n\n{description}` — do not add city, ids, or price.
 */
export type PropertyEmbeddingInput = {
  title: string
  description: string
}

export type EmbeddingSuccess = {
  embedding: number[]
  /** Provider/model id for handoff notes (not used in ranking math). */
  model: string
  dimensions: number
}

export type EmbeddingErrorCode =
  | 'EMPTY_INPUT'
  | 'MISSING_API_KEY'
  | 'PROVIDER_ERROR'
  | 'DIMENSION_MISMATCH'

export type EmbeddingFailure = {
  ok: false
  code: EmbeddingErrorCode
  message: string
}

export type EmbeddingResult =
  | ({ ok: true } & EmbeddingSuccess)
  | EmbeddingFailure
