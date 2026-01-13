import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">About This Template</h1>
        <p className="text-muted-foreground mt-2">
          A full-stack template for building modern web applications with TanStack Start
          deployed to Cloudflare Workers.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FeatureCard
          title="Authentication"
          description="Custom lightweight auth with email/password signup, secure sessions using HttpOnly cookies, and protected routes."
          items={['Sign up / Sign in', 'Session management', 'Protected dashboard & profile']}
        />
        <FeatureCard
          title="Database (D1)"
          description="Serverless SQLite database at the edge with full CRUD operations."
          items={['Posts management', 'User & session storage', 'SQL migrations']}
        />
        <FeatureCard
          title="File Storage (R2)"
          description="S3-compatible object storage with no egress fees for file uploads."
          items={['File upload/download', 'File listing & deletion', 'Size tracking']}
        />
        <FeatureCard
          title="Key-Value (KV)"
          description="Low-latency key-value storage for settings and caching."
          items={['Settings storage', 'Cache with TTL', 'Fast global reads']}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
          <CardDescription>Built with modern technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StackItem name="TanStack Start" description="Full-stack React framework with file-based routing" />
            <StackItem name="Shadcn UI" description="Accessible components with Radix and Tailwind" />
            <StackItem name="Cloudflare Workers" description="Edge deployment with 0ms cold starts" />
            <StackItem name="D1 Database" description="Serverless SQLite at the edge" />
            <StackItem name="R2 Storage" description="Object storage with no egress fees" />
            <StackItem name="KV Namespace" description="Global low-latency key-value store" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pages & Features</CardTitle>
          <CardDescription>Explore what's included</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <PageLink href="/posts" name="Posts" description="Create, read, update, and delete posts stored in D1" />
            <PageLink href="/files" name="Files" description="Upload, download, and manage files in R2 storage" />
            <PageLink href="/settings" name="Settings" description="Key-value storage demo with KV namespace" />
            <PageLink href="/dashboard" name="Dashboard" description="Protected page with real-time stats (requires login)" />
            <PageLink href="/profile" name="Profile" description="View account and session info (requires login)" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function StackItem({ name, description }: { name: string; description: string }) {
  return (
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function PageLink({ href, name, description }: { href: string; name: string; description: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
    >
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-muted-foreground">→</span>
    </a>
  )
}
