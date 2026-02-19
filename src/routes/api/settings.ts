import { createFileRoute } from '@tanstack/react-router'
import { getKV } from '~/utils/cloudflare'

export const Route = createFileRoute('/api/settings')({
  server: {
    handlers: {
      GET: async () => {
        const kv = getKV()
        const list = await kv.list({ prefix: 'setting:' })
        const settings = await Promise.all(
          list.keys.map(async (key) => ({
            key: key.name.replace('setting:', ''),
            value: (await kv.get(key.name)) ?? '',
          })),
        )
        return Response.json(settings)
      },
      POST: async ({ request }) => {
        const kv = getKV()
        const { key, value } = (await request.json()) as {
          key: string
          value: string
        }
        await kv.put(`setting:${key}`, value)
        return Response.json({ key, value }, { status: 201 })
      },
      DELETE: async ({ request }) => {
        const kv = getKV()
        const url = new URL(request.url)
        const key = url.searchParams.get('key')
        if (!key) {
          return Response.json({ error: 'Key required' }, { status: 400 })
        }
        await kv.delete(`setting:${key}`)
        return Response.json({ deleted: true })
      },
    },
  },
})
