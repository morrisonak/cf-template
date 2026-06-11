# CF Template

Full-stack template with TanStack Start, TanStack Query, Shadcn UI, and Cloudflare Workers (D1, R2, KV) — with GitHub Actions CI/CD included.

## Features

- **Posts CRUD** (`/posts`) — D1 serverless SQLite with a complete REST API example
- **File Storage** (`/files`) — R2 object storage with drag & drop upload, download, and delete
- **Settings & Cache** (`/settings`) — KV namespace for key-value settings and a TTL cache demo
- **Modern UI** — Shadcn UI components with Tailwind CSS v4, dark mode included
- **CI/CD** — GitHub Actions workflow that builds, migrates, and deploys on every push to `main`

## Stack

- **TanStack Start** — Full-stack React framework with file-based routing and server route handlers
- **TanStack Query** — Client-side data fetching and cache invalidation
- **Shadcn UI** — Accessible components built with Radix and Tailwind CSS
- **Cloudflare Workers** — Edge deployment with 0ms cold starts
- **D1** — Serverless SQLite database at the edge
- **R2** — S3-compatible object storage with no egress fees
- **KV** — Low-latency key-value storage
- **Bun** — Fast JavaScript runtime and package manager

## Quick Start

```bash
# Install dependencies (also generates Cloudflare binding types)
bun install

# Apply database migrations locally
bun run db:migrate

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

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
│   └── ui/               # Shadcn UI components
├── lib/utils.ts          # cn() utility
├── styles/app.css        # Tailwind v4 theme
└── utils/cloudflare.ts   # getDB(), getBucket(), getKV() binding helpers
migrations/               # D1 SQL migrations
```

## Deployment

### 1. Create Cloudflare Resources

```bash
bunx wrangler d1 create my-app-db
bunx wrangler r2 bucket create my-app-bucket
bunx wrangler kv namespace create KV
```

### 2. Configure wrangler.jsonc

Each command above prints an ID — copy them into `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "my-app-db",
    "database_id": "YOUR_DATABASE_ID",
    "migrations_dir": "migrations"
  }],
  "r2_buckets": [{
    "binding": "BUCKET",
    "bucket_name": "my-app-bucket"
  }],
  "kv_namespaces": [{
    "binding": "KV",
    "id": "YOUR_KV_NAMESPACE_ID"
  }]
}
```

> **Important:** the `database_id` is what the deployed Worker actually binds to —
> if it points at the wrong database you'll get 500s even though migrations
> (applied by binding name) succeed. Always paste the ID from the create
> command's output.

### 3. Run Migrations

```bash
bun run db:migrate:prod
```

### 4. Deploy

```bash
bun run deploy
```

## CI/CD with GitHub Actions

The included workflow (`.github/workflows/ci.yml`) builds every push and PR, and on pushes to `main` it applies D1 migrations and deploys to Cloudflare Workers.

Add two repository secrets (Settings → Secrets and variables → Actions):

| Secret | Where to get it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | [Create an API token](https://dash.cloudflare.com/profile/api-tokens) with the **Edit Cloudflare Workers** template plus **D1 Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → Account ID (right sidebar) |

## Database Commands

```bash
bun run db:migrate       # Apply migrations locally
bun run db:migrate:prod  # Apply migrations to production
bun run db:studio        # Open D1 Studio for the local DB
```

## API Examples

### Posts

```bash
# List posts
curl https://your-worker.workers.dev/api/posts

# Create a post
curl -X POST https://your-worker.workers.dev/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "content": "My first post"}'

# Update a post (ID in body)
curl -X PUT https://your-worker.workers.dev/api/posts \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "title": "Updated title"}'

# Delete a post (ID as query param)
curl -X DELETE "https://your-worker.workers.dev/api/posts?id=1"
```

### Files

```bash
# Upload a file (10MB limit)
curl -X POST https://your-worker.workers.dev/api/files/upload \
  -F "file=@/path/to/file.pdf"

# List files
curl https://your-worker.workers.dev/api/files/list
```

### Settings (KV)

```bash
# Set a value
curl -X POST https://your-worker.workers.dev/api/settings \
  -H "Content-Type: application/json" \
  -d '{"key": "theme", "value": "dark"}'

# Get all settings
curl https://your-worker.workers.dev/api/settings
```

## License

MIT
