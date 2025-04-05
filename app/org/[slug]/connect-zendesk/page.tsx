'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { ZendeskAPI } from '@/lib/zendesk'
import ProtectedRoute from '@/components/auth/protected-route'
import toast from 'react-hot-toast'

export default function ConnectZendesk({ params }: { params: { slug: string } }) {
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        .eq('slug', params.slug)

      if (updateError) throw updateError

      // Get organization ID
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', params.slug)
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
      router.push(`/org/${params.slug}/dashboard`)
    } catch (error) {
      console.error('Error connecting to Zendesk:', error)
      toast.error('Failed to connect to Zendesk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Connect your Zendesk account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We'll use this to analyze your support ticket data
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Zendesk Domain
                </label>
                <div className="mt-1">
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="your-company.zendesk.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="admin@your-company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700">
                  API Token
                </label>
                <div className="mt-1">
                  <input
                    id="apiToken"
                    name="apiToken"
                    type="password"
                    required
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  You can find this in Zendesk Admin → Channels → API
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Connecting...' : 'Connect Zendesk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 