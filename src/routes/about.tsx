import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="space-y-8 max-w-3xl">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">About</h1>
        <p className="text-lg text-muted-foreground">
          This is a full-stack Cloudflare Workers template built with TanStack Start and Shadcn UI.
        </p>
      </section>

      <section className="space-y-4 py-8 border-t">
        <h2 className="text-2xl font-bold">Stack</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li><strong>Framework:</strong> TanStack Start (React)</li>
          <li><strong>UI:</strong> Shadcn UI + Tailwind v4</li>
          <li><strong>Runtime:</strong> Cloudflare Workers</li>
          <li><strong>Database:</strong> Cloudflare D1 (SQLite)</li>
          <li><strong>Storage:</strong> Cloudflare R2</li>
          <li><strong>Cache:</strong> Cloudflare KV</li>
          <li><strong>Auth:</strong> Better Auth (email/password)</li>
        </ul>
      </section>

      <section className="space-y-4 py-8 border-t">
        <h2 className="text-2xl font-bold">Demo Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li><strong>Posts:</strong> Full CRUD with D1 database</li>
          <li><strong>Files:</strong> Drag-and-drop upload to R2</li>
          <li><strong>Settings:</strong> Key-value storage with KV</li>
          <li><strong>Auth:</strong> Login, signup, and session management</li>
          <li><strong>Dashboard:</strong> Authenticated overview with stats</li>
          <li><strong>Dark Mode:</strong> System-aware theme toggle</li>
        </ul>
      </section>
    </div>
  )
}
