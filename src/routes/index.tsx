import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">CF Template</h1>
        <p className="text-lg text-muted-foreground">
          Full-stack template with TanStack Start, Shadcn UI, Cloudflare Workers, D1, and R2
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="TanStack Start"
          description="Type-safe, full-stack React framework with file-based routing"
        />
        <FeatureCard
          title="Shadcn UI"
          description="Beautiful, accessible components built with Radix and Tailwind"
        />
        <FeatureCard
          title="Cloudflare Workers"
          description="Deploy to the edge with zero cold starts"
        />
        <FeatureCard
          title="D1 Database"
          description="Serverless SQLite at the edge"
        />
        <FeatureCard
          title="R2 Storage"
          description="S3-compatible object storage with no egress fees"
        />
        <FeatureCard
          title="Tailwind CSS"
          description="Utility-first CSS framework for rapid UI development"
        />
      </div>

      <div className="flex gap-2">
        <Button>Get Started</Button>
        <Button variant="outline">Documentation</Button>
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
