import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="space-y-6 py-12">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            CF Template
          </h1>
          <p className="text-xl text-muted-foreground">
            A full-stack template built with TanStack Start, Shadcn UI, and Cloudflare Workers. Includes D1 database, R2 storage, KV namespace, and Better Auth.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/posts">
            <Button size="lg">
              View Posts Demo
            </Button>
          </Link>
          <Link to="/files">
            <Button variant="outline" size="lg">
              File Uploads
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">What's Included</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="D1 Database"
            description="SQLite-based database with full CRUD demo via the Posts page"
          />
          <FeatureCard
            title="R2 Storage"
            description="Object storage with drag-and-drop file upload and management"
          />
          <FeatureCard
            title="KV Namespace"
            description="Key-value storage demo with TTL-based caching"
          />
          <FeatureCard
            title="Better Auth"
            description="Email/password authentication with session management"
          />
          <FeatureCard
            title="Shadcn UI"
            description="Beautiful, accessible UI components with dark mode support"
          />
          <FeatureCard
            title="TanStack Start"
            description="Full-stack React framework with server functions and file-based routing"
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
