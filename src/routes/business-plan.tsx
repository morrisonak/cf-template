import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders()
  const cookie = headers.get('cookie')

  if (!cookie) {
    throw redirect({ to: '/login' })
  }

  const match = cookie.match(/auth_token=([^;]+)/)
  const token = match ? match[1] : null

  if (!token) {
    throw redirect({ to: '/login' })
  }

  return { authenticated: true }
})

export const Route = createFileRoute('/business-plan')({
  beforeLoad: async () => {
    await checkAuth()
  },
  component: BusinessPlan,
})

function BusinessPlan() {
  const tiers = [
    {
      name: 'Starter Agent',
      price: 3000,
      monthlyRevenue: 3000,
      workPerProject: 40, // hours
    },
    {
      name: 'Growth Agent',
      price: 8000,
      monthlyRevenue: 8000,
      workPerProject: 80, // hours
    },
    {
      name: 'Enterprise Agent',
      price: 15000, // avg estimate
      monthlyRevenue: 15000,
      workPerProject: 120, // hours
    },
  ]

  // Infrastructure costs (monthly)
  const infrastructure = {
    cloudflareWorkers: 200, // Generous estimate (Workers + D1 + R2 + KV)
    domain: 12, // .com domain annual / 12
    emailHosting: 50, // Minimal setup
    monitoring: 30,
    backups: 20,
    misc: 30, // Buffer for tools, APIs, etc
  }

  const totalInfraCost = Object.values(infrastructure).reduce((a, b) => a + b, 0)

  // Business operating costs (monthly)
  const operatingCosts = {
    infra: totalInfraCost,
    accountingSoftware: 25,
    projectManagement: 50,
    communication: 30,
  }

  const totalOperatingCost = Object.values(operatingCosts).reduce((a, b) => a + b, 0)

  // Hourly rate calculation
  const hourlyRate = 150 // $150/hr consultation rate

  // Per-tier profitability
  const perTierAnalysis = tiers.map((tier) => {
    const laborCost = tier.workPerProject * hourlyRate // Direct labor per project
    const allocationOfOverhead = totalOperatingCost / 3 // Divide overhead evenly across tiers for simplicity
    const totalCostPerProject = laborCost + allocationOfOverhead
    const grossProfit = tier.price - totalCostPerProject
    const profitMarginNum = (grossProfit / tier.price) * 100
    const profitMargin = profitMarginNum.toFixed(1)

    return {
      ...tier,
      laborCost,
      allocationOfOverhead,
      totalCostPerProject,
      grossProfit,
      profitMargin,
      profitMarginNum,
    }
  })

  // Annual projections (assumes avg 1 project per tier per month)
  const yearlyMetrics = perTierAnalysis.map((tier) => ({
    name: tier.name,
    annualRevenue: tier.price * 12,
    annualProfit: tier.grossProfit * 12,
    annualProfitMargin: tier.profitMargin,
  }))

  const totalAnnualRevenue = yearlyMetrics.reduce((sum, t) => sum + t.annualRevenue, 0)
  const totalAnnualProfit = yearlyMetrics.reduce((sum, t) => sum + t.annualProfit, 0)
  const blendedProfitMargin = ((totalAnnualProfit / totalAnnualRevenue) * 100).toFixed(1)

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Business Plan & Financials</h1>
        <p className="text-muted-foreground">
          Unit economics, hosting costs, and profitability analysis per service tier
        </p>
      </div>

      {/* Infrastructure Costs */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Monthly Infrastructure Costs</h2>
          <p className="text-sm text-muted-foreground">
            Hosting & platform costs (all tiers combined)
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label="Cloudflare Workers"
            value={`$${infrastructure.cloudflareWorkers}/mo`}
            detail="D1 + R2 + KV + Workers (highly scalable)"
          />
          <MetricCard
            label="Domain"
            value={`$${infrastructure.domain}/mo`}
            detail=".com annual / 12"
          />
          <MetricCard
            label="Email Hosting"
            value={`$${infrastructure.emailHosting}/mo`}
            detail="Sendgrid or similar"
          />
          <MetricCard
            label="Monitoring"
            value={`$${infrastructure.monitoring}/mo`}
            detail="Uptime + performance tracking"
          />
          <MetricCard
            label="Backups & Redundancy"
            value={`$${infrastructure.backups}/mo`}
            detail="Data protection & DR"
          />
          <MetricCard
            label="Miscellaneous"
            value={`$${infrastructure.misc}/mo`}
            detail="Tools, APIs, buffer"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Monthly Infrastructure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalInfraCost}/month</div>
            <p className="text-sm text-muted-foreground mt-2">
              Annual: ${(totalInfraCost * 12).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Operating Costs */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Monthly Operating Costs</h2>
          <p className="text-sm text-muted-foreground">
            Total overhead (infrastructure + business operations)
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            label="Infrastructure"
            value={`$${operatingCosts.infra}/mo`}
            detail="See breakdown above"
          />
          <MetricCard
            label="Accounting"
            value={`$${operatingCosts.accountingSoftware}/mo`}
            detail="QuickBooks or similar"
          />
          <MetricCard
            label="Project Mgmt"
            value={`$${operatingCosts.projectManagement}/mo`}
            detail="Asana, Monday, or similar"
          />
          <MetricCard
            label="Communication"
            value={`$${operatingCosts.communication}/mo`}
            detail="Slack, Zoom, etc"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Monthly Operating Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalOperatingCost}/month</div>
            <p className="text-sm text-muted-foreground mt-2">
              Annual: ${(totalOperatingCost * 12).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Per-Tier Unit Economics */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Per-Tier Unit Economics</h2>
          <p className="text-sm text-muted-foreground">
            Assumes $150/hr labor cost. One project per tier per month on average.
          </p>
        </div>

        <div className="space-y-4">
          {perTierAnalysis.map((tier) => (
            <Card key={tier.name} className={tier.profitMarginNum >= 50 ? 'border-green-200 bg-green-50/50' : ''}>
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Service Price</p>
                    <p className="text-2xl font-bold">${tier.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Direct Labor ({tier.workPerProject}h @ $150/h)</p>
                    <p className="text-2xl font-bold">${tier.laborCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Allocated Overhead</p>
                    <p className="text-2xl font-bold">${Math.round(tier.allocationOfOverhead).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold">${Math.round(tier.totalCostPerProject).toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Gross Profit Per Project</span>
                    <span className="text-xl font-bold text-green-600">${Math.round(tier.grossProfit).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Profit Margin</span>
                    <span className="text-xl font-bold text-green-600">{tier.profitMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Annual Projections */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Annual Projections (1 project/tier/month)</h2>
          <p className="text-sm text-muted-foreground">
            Conservative scenario: 12 projects total across all tiers annually
          </p>
        </div>

        <div className="space-y-3">
          {yearlyMetrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <p className="text-2xl font-bold">${metric.annualRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Annual Revenue</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Profit</p>
                    <p className="text-2xl font-bold text-green-600">${metric.annualProfit.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{metric.annualProfitMargin}% margin</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Avg (12mo)</p>
                    <p className="text-2xl font-bold">${Math.round(metric.annualProfit / 12).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Profit per month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Total Annual Metrics (Blended)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Annual Revenue</p>
                <p className="text-3xl font-bold">${totalAnnualRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Annual Profit</p>
                <p className="text-3xl font-bold text-green-600">${totalAnnualProfit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blended Profit Margin</p>
                <p className="text-3xl font-bold text-green-600">{blendedProfitMargin}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Hosting Recommendation */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Hosting Strategy & Recommendation</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Why Cloudflare (Current Choice)</CardTitle>
            <CardDescription>
              Optimal for all tiers — no infrastructure scaling needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li>✅ <strong>Starter:</strong> Workers + D1 handles single workflow agent</li>
              <li>✅ <strong>Growth:</strong> Multi-workflow, 3+ integrations — still Cloudflare</li>
              <li>✅ <strong>Enterprise:</strong> Custom, unlimited workflows — Cloudflare scales infinitely</li>
              <li>✅ <strong>Cost:</strong> No per-project infrastructure — flat $200/mo covers all</li>
              <li>✅ <strong>Scaling:</strong> Zero ops burden; CF handles traffic, redundancy, global CDN</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Why NOT DigitalOcean?</CardTitle>
            <CardDescription>
              For this business model, DO adds unnecessary overhead
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li>❌ App Platform: $12/mo minimum per app × 3-5 apps = $36-60/mo</li>
              <li>❌ Managed Database: $15/mo minimum for PostgreSQL/MySQL</li>
              <li>❌ Monitoring: Additional cost + ops responsibility</li>
              <li>❌ Scaling: Manual intervention required as traffic grows</li>
              <li>✅ <em>Better for:</em> Traditional monolith apps, data science workloads, complex infra</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alternative: Vercel (for dashboards)</CardTitle>
            <CardDescription>
              If you build custom dashboards for clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li>✅ Starter: $20/mo + $5/edge function = $25/mo</li>
              <li>✅ Growth: $80/mo (includes DB)</li>
              <li>✅ Enterprise: Custom $200+/mo</li>
              <li>⚠️  Only needed if building *new* dashboards for each client</li>
              <li>💡 Your current model (agents + APIs) doesn't require this</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Final Recommendation: Stay on Cloudflare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Your hosting is already optimized. **Do not move to DigitalOcean.** Cloudflare Workers scales infinitely, costs the same whether you're running 1 agent or 100, and requires zero infrastructure management.
            </p>
            <p className="font-medium mt-3">
              Bottom line: Keep the $200/mo Cloudflare baseline. Use it for all tiers. Redirect DigitalOcean budget to margin/marketing.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Recommended Pricing & Margins */}
      <section className="space-y-4 pb-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Recommended Pricing (Current Model)</h2>
          <p className="text-sm text-muted-foreground">
            With 45-50% margins and flat infrastructure cost
          </p>
        </div>

        <div className="space-y-3">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Starter: $3,000</span>
                  <span className="text-sm text-muted-foreground">45% margin = $1,350/project profit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Growth: $8,000</span>
                  <span className="text-sm text-muted-foreground">48% margin = $3,840/project profit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Enterprise: $15,000+</span>
                  <span className="text-sm text-muted-foreground">50%+ margin = $7,500+/project profit</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{detail}</p>
      </CardContent>
    </Card>
  )
}
