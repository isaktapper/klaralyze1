import { ZendeskTicket, ZendeskAgent } from '@/types/database'

export class ZendeskAPI {
  private domain: string
  private apiToken: string
  private email: string

  constructor(domain: string, email: string, apiToken: string) {
    this.domain = domain
    this.apiToken = apiToken
    this.email = email
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `https://${this.domain}/api/v2/${endpoint}`
    const auth = Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64')

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Zendesk API error: ${response.statusText}`)
    }

    return response.json()
  }

  async verifyCredentials(): Promise<boolean> {
    try {
      await this.request('users/me.json')
      return true
    } catch (error) {
      return false
    }
  }

  async getTickets(startTime?: Date): Promise<ZendeskTicket[]> {
    let endpoint = 'tickets.json?include=metrics'
    if (startTime) {
      endpoint += `&start_time=${startTime.toISOString()}`
    }

    const response = await this.request(endpoint)
    return response.tickets.map(this.transformTicket)
  }

  async getAgents(): Promise<ZendeskAgent[]> {
    const response = await this.request('users.json?role=agent')
    return response.users.map(this.transformAgent)
  }

  async getTicketMetrics(ticketId: number) {
    const response = await this.request(`tickets/${ticketId}/metrics.json`)
    return response.ticket_metric
  }

  private transformTicket(ticket: any): Partial<ZendeskTicket> {
    return {
      ticket_id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignee_id: ticket.assignee_id,
      requester_id: ticket.requester_id,
      created_date: ticket.created_at,
      updated_date: ticket.updated_at,
      solved_date: ticket.solved_at,
      tags: ticket.tags,
      custom_fields: ticket.custom_fields,
      first_response_time_minutes: ticket.metric?.reply_time_in_minutes?.calendar,
      full_resolution_time_minutes: ticket.metric?.full_resolution_time_in_minutes?.calendar
    }
  }

  private transformAgent(user: any): Partial<ZendeskAgent> {
    return {
      agent_id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    }
  }
} 