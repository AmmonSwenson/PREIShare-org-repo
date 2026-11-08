/**
 * SERVER-ONLY embedding generator.
 *
 * Text in → number[1536] or a typed failure. Do not import this module from
 * React components or any file that ships to the browser — it reads
 * EMBEDDING_API_KEY from process.env (never a VITE_ secret).
 *
 * Canonical string (docs/embedding-data-model.md):
 *   {title}\n\n{description}
 */
import {
  EMBEDDING_DIMENSIONS,
  type EmbeddingResult,
  type PropertyEmbeddingInput,
} from './types'

const DEFAULT_MODEL = 'text-embedding-3-small'
const DEFAULT_API_URL = 'https://api.openai.com/v1/embeddings'
const MOCK_KEY = 'mock'

function readEnv(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }
  return value.trim()
}

/**
 * Combine property fields into one string for the embedding model.
 * Pure: same title + description → same text. City is not included.
 */
export function buildEmbeddingText(input: PropertyEmbeddingInput): string {
  return [input.title, input.description]
    .map((part) => part.trim())
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Returns true when the vector is a finite number[] of the expected length.
 * Use this for local checks before seeding: assertEmbeddingDimension(result.embedding)
 */
export function assertEmbeddingDimension(
  embedding: number[],
  expected = EMBEDDING_DIMENSIONS,
): boolean {
  return (
    Array.isArray(embedding) &&
    embedding.length === expected &&
    embedding.every((n) => typeof n === 'number' && Number.isFinite(n))
  )
}

/**
 * Generate an embedding for property text.
 * Credentials: EMBEDDING_API_KEY (required). Optional EMBEDDING_MODEL,
 * EMBEDDING_API_URL. Set EMBEDDING_API_KEY=mock for a labeled offline vector
 * of length 1536 (not a real model; seed/search quality will be fake).
 */
export async function generatePropertyEmbedding(
  input: PropertyEmbeddingInput,
): Promise<EmbeddingResult> {
  const text = buildEmbeddingText(input)
  if (!text) {
    return {
      ok: false,
      code: 'EMPTY_INPUT',
      message: 'Property title and description are empty; nothing to embed.',
    }
  }

  const apiKey = readEnv('EMBEDDING_API_KEY')
  if (!apiKey) {
    return {
      ok: false,
      code: 'MISSING_API_KEY',
      message:
        'Set EMBEDDING_API_KEY in your environment before generating embeddings.',
    }
  }

  const model = readEnv('EMBEDDING_MODEL') ?? DEFAULT_MODEL

  try {
    const embedding =
      apiKey.toLowerCase() === MOCK_KEY
        ? createMockEmbedding(text)
        : await callEmbeddingProvider(text, apiKey, model)

    if (!assertEmbeddingDimension(embedding)) {
      return {
        ok: false,
        code: 'DIMENSION_MISMATCH',
        message: `Expected ${EMBEDDING_DIMENSIONS} numbers, got ${embedding.length}.`,
      }
    }

    return {
      ok: true,
      embedding,
      model: apiKey.toLowerCase() === MOCK_KEY ? 'mock-1536' : model,
      dimensions: embedding.length,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown provider error'
    return { ok: false, code: 'PROVIDER_ERROR', message }
  }
}

/** Deterministic 1536-d vector for offline practice. Not a semantic model. */
function createMockEmbedding(text: string): number[] {
  const embedding = new Array<number>(EMBEDDING_DIMENSIONS)
  let seed = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    seed ^= text.charCodeAt(i)
    seed = Math.imul(seed, 16777619)
  }
  for (let i = 0; i < EMBEDDING_DIMENSIONS; i += 1) {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    embedding[i] = ((seed >>> 0) / 0xffffffff) * 2 - 1
  }
  return embedding
}

async function callEmbeddingProvider(
  text: string,
  apiKey: string,
  model: string,
): Promise<number[]> {
  const url = readEnv('EMBEDDING_API_URL') ?? DEFAULT_API_URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      `Embedding provider HTTP ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
    )
  }

  const payload = (await response.json()) as {
    data?: Array<{ embedding?: unknown }>
  }
  const raw = payload.data?.[0]?.embedding
  if (!Array.isArray(raw)) {
    throw new Error('Embedding provider response did not include a vector.')
  }
  return raw.map((n) => Number(n))
}
