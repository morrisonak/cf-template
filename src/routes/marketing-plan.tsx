import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { TrendingUp, Users, Target, Zap, BookOpen, Calendar } from 'lucide-react'

export const Route = createFileRoute('/marketing-plan')({
  component: MarketingPlan,
})

function MarketingPlan() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Marketing Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          B2B go-to-market strategy: direct outreach + content marketing + community engagement.
          Target: 9 clients and $3.5K MRR by month 6.
        </p>
      </section>

      {/* Key Metrics */}
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Outreach/Week"
          value="20-30"
          description="LinkedIn + email touches"
          icon={Zap}
        />
        <MetricCard
          title="Response Rate"
          value="10-15%"
          description="Qualified conversations"
          icon={TrendingUp}
        />
        <MetricCard
          title="Deals/Month"
          value="1-2"
          description="Initial target"
          icon={Target}
        />
        <MetricCard
          title="6-Month Goal"
          value="9 clients"
          description="$3.5K MRR gross"
          icon={BookOpen}
        />
      </section>

      {/* Main Tabs */}
      <Tabs defaultValue="personas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Personas Tab */}
        <TabsContent value="personas" className="space-y-4">
          <div className="grid gap-4">
            <PersonaCard
              name="VP of Operations"
              titles={['VP Ops', 'Director of Operations', 'COO']}
              companySize="100-300 employees"
              painPoints={[
                'Manual data entry & spreadsheet management',
                'Siloed systems (CRM, ERP, communication)',
                'Team spending 20+ hours/week on routine tasks',
                'Scaling operations without hiring'
              ]}
              buyingSignals={['automation', 'efficiency', 'tool consolidation', 'manual work bottleneck']}
              decisionTimeline="2-4 weeks"
              buyReasons={['Immediate ROI (labor savings)', 'Quick deployment', 'Managed service']}
            />

            <PersonaCard
              name="VP of Sales / RevOps"
              titles={['VP Sales', 'Director of Sales Ops', 'RevOps Manager']}
              companySize="50-200 employees"
              painPoints={[
                'Sales reps spending 5+ hours/week on admin',
                'Opportunity leakage in pipeline',
                'Forecasting inaccuracy',
                'Lead qualification bottleneck'
              ]}
              buyingSignals={['reps in CRM', 'lead scoring', 'pipeline visibility']}
              decisionTimeline="2-6 weeks"
              buyReasons={['Direct impact on velocity', 'Higher conversion rates', 'Better forecasting']}
            />

            <PersonaCard
              name="Head of Customer Success"
              titles={['VP Customer Success', 'Director of Support', 'VP CS']}
              companySize="100-500 employees"
              painPoints={[
                'Support team overwhelmed (ticket backlog)',
                'Routine questions = 60% of tickets',
                'Slow response times frustrating customers',
                'Cannot proactively identify at-risk customers'
              ]}
              buyingSignals={['understaffed', 'slow response time', 'automate inquiries']}
              decisionTimeline="4-8 weeks"
              buyReasons={['Improves NPS', 'Faster resolution', 'Better team utilization']}
            />

            <PersonaCard
              name="CEO / Founder (SaaS)"
              titles={['CEO', 'Founder', 'CPO']}
              companySize="20-150 employees"
              painPoints={[
                'Scaling without proportional headcount',
                'Manual customer data workflows',
                'Content generation',
                'Internal knowledge base management'
              ]}
              buyingSignals={['scale faster', 'solve same problems', 'hiring lag']}
              decisionTimeline="1-3 weeks"
              buyReasons={['Force multiplier for team', 'Shows investor efficiency', 'Extends capacity']}
            />
          </div>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4">
            <ChannelCard
              title="Direct Outreach (40%)"
              description="Highest ROI - LinkedIn + Email + Warm Intros"
              tactics={[
                'LinkedIn Sales Navigator: 10-15 messages/day to VPs at 50-300 person companies',
                'Email outreach: 5-10 personalized emails/day (3-touch sequence)',
                'Referral incentive: $500 per closed deal (best for Growth/Enterprise tiers)',
                'Warm intros: Ask existing contacts for introductions'
              ]}
              kpi="10-15% response rate → 2-3 calls/week"
              color="blue"
            />

            <ChannelCard
              title="Content Marketing (25%)"
              description="Drive organic discovery + nurture track"
              tactics={[
                'Blog posts targeting pain points (40+ hours on manual work, ROI of agents)',
                'Guest posts on Drift, ProductHunt, Revenue.io, Zapier blog',
                'LinkedIn newsletter: weekly insights + CTA to reply',
                'Case studies & customer testimonials (1-pager + video)'
              ]}
              kpi="Low-cost leads over time; drives organic search"
              color="green"
            />

            <ChannelCard
              title="Community & Events (20%)"
              description="Thought leadership + warm networking"
              tactics={[
                'Slack communities (ops efficiency, AI, SaaS founders): answer Q&s, share insights',
                'Industry meetups & conferences: 5-10 warm intros per event',
                'Webinar: "Build Your First AI Agent in 3 Hours" (co-hosted with partner)',
                'Sponsorships: booth/table at Revenue/AI conferences ($2-5K)'
              ]}
              kpi="Relationship building; 50% of attendees convert to opportunities"
              color="purple"
            />

            <ChannelCard
              title="Paid Ads (10% - Lower priority)"
              description="Amplify reach once organic is working"
              tactics={[
                'LinkedIn ads: $500-1K/month targeting job titles + company size',
                'Google search ads: automation + workflow keywords ($300-500/month)',
                'Retargeting: website visitors + LinkedIn engagers with social proof'
              ]}
              kpi="$20-40 per qualified lead (test only initially)"
              color="orange"
            />
          </div>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-4">
          <div className="space-y-4">
            <FunnelStage
              stage="1. Awareness"
              goal="Get the right person to know we exist"
              tactics={[
                'LinkedIn outreach (warm intro)',
                'Blog posts (organic search)',
                'Community participation'
              ]}
              kpi="20-30 outreach/week → 10% response = 2-3 conversations/week"
              volume="Hundreds"
              color="blue"
            />

            <FunnelStage
              stage="2. Interest"
              goal="Show them we understand their problem"
              tactics={[
                'Discovery call (20 min): understand their bottleneck',
                'Share relevant case study',
                'Invite to webinar if timely'
              ]}
              kpi="50% of conversations → qualify as potential fit"
              volume="2-3/week"
              color="blue"
            />

            <FunnelStage
              stage="3. Consideration"
              goal="Show them the ROI"
              tactics={[
                'Free ROI calculator (they input data, we show payback)',
                'Light audit: estimate labor savings',
                'Proposal for obvious fits'
              ]}
              kpi="70% of qualified leads → request proposal"
              volume="1-2/week"
              color="purple"
            />

            <FunnelStage
              stage="4. Decision"
              goal="Remove friction, close the deal"
              tactics={[
                'Clear pricing, simple 1-page SOW',
                'Discount for annual prepay (save 2 months)',
                'Fast onboarding (kick-off within 5 days)'
              ]}
              kpi="40-60% close rate → 1-2 deals/month initially"
              volume="40-60%"
              color="green"
            />
          </div>

          {/* Sales Process Detail */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Sales Process Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">Discovery Call (20 min)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• What's your biggest operational headache?</li>
                    <li>• How many hours/week is this costing?</li>
                    <li>• What have you already tried?</li>
                    <li>• What's your timeline?</li>
                  </ul>
                </div>

                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">Proposal (24h turnaround)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Problem + solution (1 page)</li>
                    <li>• 3-5 specific workflows to automate</li>
                    <li>• 3-week build + 2-week optimization</li>
                    <li>• Pricing & success metrics</li>
                  </ul>
                </div>

                <div className="space-y-2 p-4 border rounded-lg md:col-span-2">
                  <h4 className="font-semibold">Onboarding (3 weeks)</h4>
                  <p className="text-sm text-muted-foreground">
                    Day 1: Kick-off + access to dashboard | Days 2-5: Requirements gathering | Days 6-14: Agent development | Days 15-21: Testing + go-live | Ongoing: Monthly account management
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            <TimelinePhase
              month="Month 1"
              title="Foundation"
              targets="3-5 discovery calls"
              tasks={[
                'Finalize outreach templates & ROI calculator',
                'Build LinkedIn Sales Navigator list (500+ prospects)',
                'Launch content calendar',
                'Start LinkedIn newsletter'
              ]}
              metrics={[
                'Outreach: 20-30/week',
                'Response rate: 10-15%',
                'Discovery calls: 3-5'
              ]}
            />

            <TimelinePhase
              month="Month 2"
              title="Traction"
              targets="1 deal closed, 5 discovery calls"
              tasks={[
                'Scale outreach to 20-30/week',
                'Schedule 4-6 discovery calls',
                'Send first proposal',
                'Refine messaging based on feedback'
              ]}
              metrics={[
                'Deals: 1 (Starter tier)',
                'MRR: $3.2K ($3K upfront + $200 recurring)',
                'CAC: ~$200 (outreach effort)'
              ]}
            />

            <TimelinePhase
              month="Month 3"
              title="Momentum"
              targets="$11K MRR"
              tasks={[
                'Close 2 deals',
                'Refine messaging',
                'First guest post published',
                'Start webinar planning'
              ]}
              metrics={[
                'Deals: 3 total',
                'MRR: $11K gross ($8.25K profit)',
                'Close rate: 40-50%'
              ]}
            />

            <TimelinePhase
              month="Month 4"
              title="Scale"
              targets="$19K MRR"
              tasks={[
                'Close 2-3 new deals (focus on Growth tier)',
                'Webinar delivered (30 signups, 5 follow-ups)',
                'First customer success story published',
                'Refine sales playbook'
              ]}
              metrics={[
                'Deals: 5-6 total',
                'MRR: $19K gross ($14.25K profit)',
                'Average deal: $8K upfront'
              ]}
            />

            <TimelinePhase
              month="Month 5"
              title="Optimization"
              targets="$25K MRR"
              tasks={[
                'Close 2-3 new deals (mix of tiers)',
                'Email nurture sequence for not-ready leads',
                'Second guest post published',
                'Explore partnership opportunities'
              ]}
              metrics={[
                'Deals: 6-7 total',
                'MRR: $25K gross ($18.75K profit)',
                'Funnel: 10-12 conversations in progress'
              ]}
            />

            <TimelinePhase
              month="Month 6"
              title="Predictable"
              targets="$35K MRR (9 clients, 4K profit)"
              tasks={[
                'Close final 2-3 deals to reach 9 clients',
                'Repeatable sales process locked in',
                'Second webinar delivering leads',
                'First enterprise conversation (potential $15K+ deal)'
              ]}
              metrics={[
                'Deals: 9 total',
                'MRR: $35K gross ($26.25K profit)',
                'CAC payback: < 3 months',
                'Close rate: 40-60%'
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Success Factors */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Key Success Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <Badge variant="outline" className="flex-shrink-0 mt-0.5">1</Badge>
              <span>Personalization: Every outreach should reference something specific about their company/industry</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="flex-shrink-0 mt-0.5">2</Badge>
              <span>Speed: Respond to inquiries within 24h, send proposals within 24h of discovery call</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="flex-shrink-0 mt-0.5">3</Badge>
              <span>Focus: Start with Ops tier, then expand to Sales/CS. Don't chase enterprise without proof.</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="flex-shrink-0 mt-0.5">4</Badge>
              <span>Referrals: $500 referral fee drives word-of-mouth faster than paid ads</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="flex-shrink-0 mt-0.5">5</Badge>
              <span>Measurement: Track response rates, close rates, CAC every week. Adjust messaging weekly.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className: string }>
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function PersonaCard({
  name,
  titles,
  companySize,
  painPoints,
  buyingSignals,
  decisionTimeline,
  buyReasons,
}: {
  name: string
  titles: string[]
  companySize: string
  painPoints: string[]
  buyingSignals: string[]
  decisionTimeline: string
  buyReasons: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>
          {titles.join(', ')} • {companySize}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-sm mb-2">Pain Points</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {painPoints.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-red-500">•</span> {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Buying Signals</h4>
            <div className="flex flex-wrap gap-1">
              {buyingSignals.map((signal) => (
                <Badge key={signal} variant="secondary" className="text-xs">
                  {signal}
                </Badge>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Why They Buy</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {buyReasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className="text-green-500">✓</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t text-sm">
          <span className="font-semibold">Decision Timeline:</span> {decisionTimeline}
        </div>
      </CardContent>
    </Card>
  )
}

function ChannelCard({
  title,
  description,
  tactics,
  kpi,
  color,
}: {
  title: string
  description: string
  tactics: string[]
  kpi: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colors = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
  }

  return (
    <Card className={colors[color]}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Tactics</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {tactics.map((tactic) => (
              <li key={tactic} className="flex gap-2">
                <span>•</span> {tactic}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-2 border-t text-sm">
          <span className="font-semibold">KPI:</span> {kpi}
        </div>
      </CardContent>
    </Card>
  )
}

function FunnelStage({
  stage,
  goal,
  tactics,
  kpi,
  volume,
  color,
}: {
  stage: string
  goal: string
  tactics: string[]
  kpi: string
  volume: string
  color: 'blue' | 'purple' | 'green'
}) {
  const bgColors = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
  }

  return (
    <Card className={bgColors[color]}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{stage}</CardTitle>
            <CardDescription>{goal}</CardDescription>
          </div>
          <Badge variant="outline">{volume}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-semibold mb-1">Tactics</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {tactics.map((tactic) => (
              <li key={tactic} className="flex gap-2">
                <span>▸</span> {tactic}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm font-semibold text-foreground">KPI: {kpi}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function TimelinePhase({
  month,
  title,
  targets,
  tasks,
  metrics,
}: {
  month: string
  title: string
  targets: string
  tasks: string[]
  metrics: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{month}: {title}</CardTitle>
            <CardDescription className="mt-1">Target: {targets}</CardDescription>
          </div>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-sm mb-2">Tasks</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {tasks.map((task) => (
                <li key={task} className="flex gap-2">
                  <span>→</span> {task}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Expected Metrics</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {metrics.map((metric) => (
                <li key={metric} className="flex gap-2">
                  <span className="text-primary">◆</span> {metric}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
