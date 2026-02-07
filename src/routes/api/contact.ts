import { createAPIFileRoute } from '@tanstack/react-start/api'

interface ContactData {
  name: string
  email: string
  company: string
  message: string
}

export const APIRoute = createAPIFileRoute('/api/contact')({
  methods: ['POST'],
  handler: async ({ request, context }: { request: Request; context: any }) => {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const data: ContactData = await request.json()

      // Validate
      if (!data.name || !data.email || !data.company || !data.message) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Get D1 database from context
      const db = context.DB

      if (!db) {
        console.error('D1 database not available')
        // For MVP, we can still return success (log to console)
        console.log('Contact submission:', data)
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Insert into database
      await db
        .prepare(
          `INSERT INTO contacts (name, email, company, message, created_at) 
           VALUES (?, ?, ?, ?, datetime('now'))`
        )
        .bind(data.name, data.email, data.company, data.message)
        .run()

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Contact form error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to process request' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  },
})
