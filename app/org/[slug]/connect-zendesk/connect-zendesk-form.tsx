'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createBrowserClient } from '@supabase/ssr'
import { ZendeskAPI } from '@/lib/zendesk'
import { toast } from 'sonner'

export default function ConnectZendeskForm({ slug }: { slug: string }) {
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Verify Zendesk credentials
      const zendesk = new ZendeskAPI(domain, email, apiToken)
      const isValid = await zendesk.verifyCredentials()

      if (!isValid) {
        throw new Error('Invalid Zendesk credentials')
      }

      // Update organization with Zendesk credentials
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          zendesk_domain: domain,
          zendesk_api_token: apiToken,
          settings: {
            zendesk_email: email
          }
        })
        .eq('slug', slug)

      if (updateError) throw updateError

      // Get organization ID
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!org) throw new Error('Organization not found')

      // Start initial data sync
      const agents = await zendesk.getAgents()
      const tickets = await zendesk.getTickets()

      // Store agents
      const { error: agentsError } = await supabase
        .from('zendesk_agents')
        .insert(agents.map(agent => ({
          organization_id: org.id,
          agent_id: agent.agent_id,
          name: agent.name,
          email: agent.email,
          role: agent.role,
          active: agent.active
        })))

      if (agentsError) throw agentsError

      // Store tickets
      const { error: ticketsError } = await supabase
        .from('zendesk_tickets')
        .insert(tickets.map(ticket => ({
          organization_id: org.id,
          ticket_id: ticket.ticket_id,
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          assignee_id: ticket.assignee_id,
          requester_id: ticket.requester_id,
          created_date: ticket.created_date,
          updated_date: ticket.updated_date,
          solved_date: ticket.solved_date,
          first_response_time_minutes: ticket.first_response_time_minutes,
          full_resolution_time_minutes: ticket.full_resolution_time_minutes,
          tags: ticket.tags,
          custom_fields: ticket.custom_fields
        })))

      if (ticketsError) throw ticketsError

      toast.success('Successfully connected to Zendesk!')
      router.push(`/org/${slug}/dashboard`)
    } catch (error) {
      console.error('Error connecting to Zendesk:', error)
      toast.error('Failed to connect to Zendesk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Connect Zendesk
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your Zendesk credentials to connect your account
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-medium text-gray-700"
              >
                Zendesk Domain
              </label>
              <div className="mt-1">
                <input
                  id="domain"
                  name="domain"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your-domain.zendesk.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apiToken"
                className="block text-sm font-medium text-gray-700"
              >
                API Token
              </label>
              <div className="mt-1">
                <input
                  id="apiToken"
                  name="apiToken"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your API token"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connecting...' : 'Connect Zendesk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 