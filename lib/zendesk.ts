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
    const url = `https://${this.domain}.zendesk.com/api/v2/${endpoint}`
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
      console.error(`Zendesk API error (${response.status}): ${response.statusText}`)
      throw new Error(`Zendesk API error: ${response.statusText} (${response.status})`)
    }

    return response.json()
  }

  async verifyCredentials(): Promise<boolean> {
    try {
      await this.request('users/me.json');
      return true;
    } catch (error) {
      console.error('Error verifying Zendesk credentials:', error);
      return false;
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

  async getClosedTickets(startTime?: Date, groupIds: number[] = []): Promise<ZendeskTicket[]> {
    // Base query to get closed and solved tickets
    let endpoint = 'search.json?query=status:closed status:solved'
    
    // Add time filter if provided
    if (startTime) {
      endpoint += ` created>${startTime.toISOString()}`
    }
    
    // Add group filter if provided
    if (groupIds.length > 0) {
      const groupFilter = groupIds.map(id => `group_id:${id}`).join(' OR ')
      endpoint += ` (${groupFilter})`
    }
    
    console.log('Zendesk search query:', endpoint)
    
    // Include ticket metrics in response
    endpoint += '&include=metric_sets'
    
    const response = await this.request(endpoint)
    return response.results.map(this.transformTicket)
  }

  async getFilteredTickets(startTime?: Date, groupIds: number[] = []): Promise<ZendeskTicket[]> {
    try {
      // Base query to get tickets with Open, Pending, and Solved statuses
      let endpoint = 'search.json?query=status:open status:pending status:solved';
      
      // Add time filter if provided
      if (startTime) {
        endpoint += ` created>${startTime.toISOString()}`;
      }
      
      // Add group filter if provided
      if (groupIds.length > 0) {
        const groupFilter = groupIds.map(id => `group_id:${id}`).join(' OR ');
        endpoint += ` (${groupFilter})`;
      }
      
      console.log('Zendesk search endpoint:', endpoint);
      console.log('Using domain:', this.domain);
      
      // Include ticket metrics in response
      endpoint += '&include=metric_sets';
      
      const response = await this.request(endpoint);
      console.log(`Retrieved ${response.results?.length || 0} tickets from Zendesk search`);
      
      if (!response.results) {
        console.error('Unexpected response format:', response);
        return [];
      }
      
      return response.results.map(this.transformTicket);
    } catch (error) {
      console.error('Error in getFilteredTickets:', error);
      return [];
    }
  }

  async getAgents(): Promise<ZendeskAgent[]> {
    const response = await this.request('users.json?role=agent')
    return response.users.map(this.transformAgent)
  }

  async getTicketMetrics(ticketId: number) {
    const response = await this.request(`tickets/${ticketId}/metrics.json`)
    return response.ticket_metric
  }

  private transformTicket = (ticket: any): Partial<ZendeskTicket> => {
    // Check if metric_sets is available (from search endpoint)
    const metrics = ticket.metric_sets ? ticket.metric_sets : ticket.metrics;
    
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
      first_response_time_minutes: metrics?.reply_time_in_minutes?.calendar,
      full_resolution_time_minutes: metrics?.full_resolution_time_in_minutes?.calendar
    };
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