import { createFileRoute } from '@tanstack/react-router'
import { getKV } from '~/utils/cloudflare'

export const Route = createFileRoute('/api/cache/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const kv = getKV()
        const key = params._splat
        const cacheKey = `cache:${key}`

        const cached = await kv.get(cacheKey)
        if (cached) {
          return Response.json({ value: cached, fromCache: true })
        }

        const computed = `Computed at ${new Date().toISOString()}`
        await kv.put(cacheKey, computed, { expirationTtl: 60 })
        return Response.json({ value: computed, fromCache: false })
      },
      DELETE: async ({ params }) => {
        const kv = getKV()
        const key = params._splat
        await kv.delete(`cache:${key}`)
        return Response.json({ cleared: true })
      },
    },
  },
})
