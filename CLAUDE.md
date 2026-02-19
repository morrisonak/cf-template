# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun install              # Install dependencies
bun run dev              # Start dev server on port 3000
bun run build            # Build for production
bun run preview          # Build and preview locally

# Deployment
bun run deploy           # Build and deploy to Cloudflare Workers
bun run cf-typegen       # Regenerate Cloudflare binding types

# Database (D1)
bun run db:migrate       # Apply migrations locally
bun run db:migrate:prod  # Apply migrations to production
bun run db:studio        # Open D1 Studio for local DB
```

## Architecture

**Stack:** TanStack Start + TanStack Query + Shadcn UI + Cloudflare Workers + D1 + R2 + KV

### Project Structure
```
src/
├── routes/
│   ├── __root.tsx        # Root layout with nav
│   ├── index.tsx         # Home page
│   ├── about.tsx         # About page
│   ├── posts.tsx         # Posts CRUD UI (D1)
│   ├── files.tsx         # File management UI (R2)
│   ├── settings.tsx      # KV settings + cache demo UI
│   └── api/
│       ├── posts.ts          # Posts REST API (GET, POST, PUT, DELETE)
│       ├── settings.ts       # Settings REST API (GET, POST, DELETE)
│       ├── cache.$.ts        # Cache API with splat param
│       ├── files.list.ts     # File listing endpoint
│       ├── files.upload.ts   # File upload endpoint
│       └── files.$.ts        # File serving/delete endpoint
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── mobile-nav.tsx
│   ├── DefaultCatchBoundary.tsx
│   └── NotFound.tsx
├── lib/
│   └── utils.ts          # cn() utility
├── styles/app.css        # Tailwind v4 theme
└── utils/
    ├── cloudflare.ts     # getDB(), getBucket(), getKV()
    └── seo.ts
migrations/               # D1 SQL migrations
```

## API Routes

Use `createFileRoute` with `server.handlers` for REST endpoints. Page components use `fetch()` + TanStack Query (`useQuery`/`useMutation`) to call these.

```ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/example')({
  server: {
    handlers: {
      GET: async ({ request }) => Response.json({ message: 'Hello' }),
      POST: async ({ request }) => {
        const body = await request.json()
        return Response.json(body, { status: 201 })
      },
    },
  },
})
```

### Important: Avoid parent-child route nesting for API routes

TanStack Router treats a route with children as a layout route, which breaks `server.handlers` (returns HTML instead of JSON). **Do NOT create child routes under API routes that have handlers.**

Bad (broken):
```
api/posts.ts    ← parent, server.handlers won't fire
api/posts.$.ts  ← child, creates parent-child nesting
```

Good (working):
```
api/posts.ts    ← leaf route, all handlers (GET/POST/PUT/DELETE) in one file
```

For operations on individual resources, pass IDs via request body (PUT) or query params (DELETE) instead of path segments:
```ts
// DELETE with query param
DELETE: async ({ request }) => {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  // ...
}

// PUT with ID in body
PUT: async ({ request }) => {
  const { id, title } = await request.json()
  // ...
}
```

### Client-side data fetching (TanStack Query)

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ['posts'],
  queryFn: async () => {
    const res = await fetch('/api/posts')
    if (!res.ok) throw new Error('Failed to load')
    return res.json() as Promise<Post[]>
  },
})

// Mutate data
const mutation = useMutation({
  mutationFn: async (data: { title: string }) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create')
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
})
```

## Cloudflare Bindings

Access D1, R2, and KV via `~/utils/cloudflare`:
```ts
import { getDB, getBucket, getKV } from '~/utils/cloudflare'

const db = getDB()        // D1Database
const bucket = getBucket() // R2Bucket
const kv = getKV()        // KVNamespace
```

### KV Usage
```ts
// Get value
const value = await kv.get('key')

// Set value (optional TTL)
await kv.put('key', 'value')
await kv.put('key', 'value', { expirationTtl: 60 }) // 60 seconds

// Delete value
await kv.delete('key')

// List keys with prefix
const list = await kv.list({ prefix: 'setting:' })
```

Types auto-generated in `worker-configuration.d.ts` - run `bun run cf-typegen` after changing `wrangler.jsonc`.

## Shadcn UI Components

Available in `src/components/ui/`:
- `button.tsx` - Button with variants
- `card.tsx` - Card, CardHeader, CardContent, etc.
- `input.tsx` - Text input
- `label.tsx` - Form label
- `textarea.tsx` - Multiline input
- `alert-dialog.tsx` - Confirmation dialogs

Add more components:
```bash
bunx shadcn@latest add [component]
```

## Demo Features

### Posts CRUD (`/posts`)
- List, create, edit, delete posts
- API routes with D1 database
- TanStack Query for data fetching

### File Management (`/files`)
- Drag & drop upload to R2
- File listing with icons
- Download and delete files
- 10MB file size limit

### Settings & Cache (`/settings`)
- Key-value storage with KV
- Add, view, delete settings
- Cache demo with 60-second TTL
- Demonstrates KV as cache layer

## Cloudflare Setup

> **Gotcha:** If Wrangler gives a 400 Bad Request on the `/memberships` endpoint, it means the API token lacks account-level permissions. The fix is to add the `database_id` (and KV `id`, etc.) directly in `wrangler.jsonc` so Wrangler skips the account lookup entirely. Always grab the IDs from the `wrangler d1 create` / `wrangler kv namespace create` output and add them to the config immediately.

1. Create resources:
   ```bash
   bunx wrangler d1 create cf-template-db
   bunx wrangler r2 bucket create cf-template-bucket
   bunx wrangler kv namespace create KV
   ```

2. Update `wrangler.jsonc` with D1 `database_id` and KV namespace `id` from the output above

3. Run migrations:
   ```bash
   bun run db:migrate:prod
   ```

4. Deploy:
   ```bash
   bun run deploy
   ```

## Tailwind v4

Uses `@theme` directive for custom colors in `src/styles/app.css`:
```css
@theme {
  --color-background: hsl(0 0% 100%);
  --color-primary: hsl(240 5.9% 10%);
  /* ... */
}
```

Colors available as utilities: `bg-background`, `text-primary`, `text-muted-foreground`, etc.
