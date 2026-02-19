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
          <li><strong className="text-foreground">Framework:</strong> TanStack Start (React)</li>
          <li><strong className="text-foreground">UI:</strong> Shadcn UI + Tailwind v4</li>
          <li><strong className="text-foreground">Runtime:</strong> Cloudflare Workers</li>
          <li><strong className="text-foreground">Database:</strong> Cloudflare D1 (SQLite)</li>
          <li><strong className="text-foreground">Storage:</strong> Cloudflare R2</li>
          <li><strong className="text-foreground">Cache:</strong> Cloudflare KV</li>
        </ul>
      </section>

      <section className="space-y-4 py-8 border-t">
        <h2 className="text-2xl font-bold">Demo Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">Posts:</strong> Full CRUD with D1 database</li>
          <li><strong className="text-foreground">Files:</strong> Drag-and-drop upload to R2</li>
          <li><strong className="text-foreground">Settings:</strong> Key-value storage with KV</li>
          <li><strong className="text-foreground">Dark Mode:</strong> System-aware theme toggle</li>
        </ul>
      </section>
    </div>
  )
}
