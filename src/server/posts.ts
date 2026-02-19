import { createServerFn } from '@tanstack/react-start'
import { getDB } from '~/utils/cloudflare'

export type Post = {
  id: number
  title: string
  content: string | null
  created_at: string
  updated_at: string
}

function toPost(row: Post): Post {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const db = getDB()
  const result = await db
    .prepare('SELECT * FROM posts ORDER BY created_at DESC')
    .all<Post>()
  return result.results.map(toPost)
})

export const getPost = createServerFn({ method: 'GET' })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    const db = getDB()
    const post = await db
      .prepare('SELECT * FROM posts WHERE id = ?')
      .bind(id)
      .first<Post>()
    return post ? toPost(post) : null
  })

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string; content?: string }) => data)
  .handler(async ({ data }) => {
    const db = getDB()
    const result = await db
      .prepare(
        'INSERT INTO posts (title, content) VALUES (?, ?) RETURNING *'
      )
      .bind(data.title, data.content ?? null)
      .first<Post>()
    return result ? toPost(result) : null
  })

export const updatePost = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number; title: string; content?: string }) => data)
  .handler(async ({ data }) => {
    const db = getDB()
    const result = await db
      .prepare(
        'UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *'
      )
      .bind(data.title, data.content ?? null, data.id)
      .first<Post>()
    return result ? toPost(result) : null
  })

export const deletePost = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    const db = getDB()
    await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
    return { success: true }
  })
