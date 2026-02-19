import { createFileRoute } from '@tanstack/react-router'
import { getDB } from '~/utils/cloudflare'

export const Route = createFileRoute('/api/posts')({
  server: {
    handlers: {
      GET: async () => {
        const db = getDB()
        const result = await db
          .prepare('SELECT * FROM posts ORDER BY created_at DESC')
          .all()
        return Response.json(result.results)
      },
      POST: async ({ request }) => {
        const db = getDB()
        const { title, content } = (await request.json()) as {
          title: string
          content?: string
        }
        if (!title?.trim()) {
          return Response.json({ error: 'Title is required' }, { status: 400 })
        }
        const result = await db
          .prepare('INSERT INTO posts (title, content) VALUES (?, ?) RETURNING *')
          .bind(title, content ?? null)
          .first()
        return Response.json(result, { status: 201 })
      },
      PUT: async ({ request }) => {
        const db = getDB()
        const { id, title, content } = (await request.json()) as {
          id: number
          title: string
          content?: string
        }
        if (!title?.trim()) {
          return Response.json({ error: 'Title is required' }, { status: 400 })
        }
        const result = await db
          .prepare(
            'UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *',
          )
          .bind(title, content ?? null, id)
          .first()
        if (!result) {
          return Response.json({ error: 'Post not found' }, { status: 404 })
        }
        return Response.json(result)
      },
      DELETE: async ({ request }) => {
        const db = getDB()
        const url = new URL(request.url)
        const id = url.searchParams.get('id')
        if (!id) {
          return Response.json({ error: 'ID required' }, { status: 400 })
        }
        await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
        return Response.json({ success: true })
      },
    },
  },
})
