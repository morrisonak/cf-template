import { createFileRoute } from '@tanstack/react-router'
import { getBucket } from '~/utils/cloudflare'

export const Route = createFileRoute('/api/files/list')({
  server: {
    handlers: {
      GET: async () => {
        const bucket = getBucket()
        const listed = await bucket.list({ prefix: 'uploads/' })
        const files = listed.objects.map((obj) => ({
          key: obj.key,
          size: obj.size,
          uploaded: obj.uploaded.toISOString(),
          httpMetadata: obj.httpMetadata
            ? { contentType: obj.httpMetadata.contentType }
            : undefined,
        }))
        return Response.json(files)
      },
    },
  },
})
