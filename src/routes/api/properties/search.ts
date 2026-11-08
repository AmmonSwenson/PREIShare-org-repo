import { createFileRoute } from '@tanstack/react-router'
import { searchPropertiesByText } from '../../../lib/property-search'

type SearchBody = {
  query?: unknown
  matchCount?: unknown
}

export const Route = createFileRoute('/api/properties/search')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as SearchBody
          const query = typeof body.query === 'string' ? body.query.trim() : ''

          if (!query) {
            return Response.json(
              { error: 'Query is required', results: [] },
              { status: 400 },
            )
          }

          const matchCount =
            typeof body.matchCount === 'number' && Number.isFinite(body.matchCount)
              ? Math.min(10, Math.max(1, Math.floor(body.matchCount)))
              : 5

          const results = await searchPropertiesByText(query, matchCount)

          return Response.json({ query, results })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Search failed'
          console.error('property search failed', message)
          return Response.json(
            { error: 'Search failed', results: [] },
            { status: 500 },
          )
        }
      },
    },
  },
})
