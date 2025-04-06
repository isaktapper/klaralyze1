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
      
      // Store original groups for logging
      const originalGroupIds = [...groupIds];
      
      // Log initial request info
      console.log('Zendesk filter request:', {
        startTime: startTime?.toISOString(),
        groupIds: originalGroupIds
      });
      
      // Filter out any invalid group IDs (0, NaN, undefined, etc.)
      const validGroupIds = groupIds.filter(id => id && !isNaN(id) && id > 0);
      if (validGroupIds.length !== originalGroupIds.length) {
        console.warn(`Filtered out ${originalGroupIds.length - validGroupIds.length} invalid group IDs`);
        console.log('Original group IDs:', originalGroupIds);
        console.log('Valid group IDs:', validGroupIds);
      }
      
      // Add group filter if provided
      if (validGroupIds.length > 0) {
        // Create proper filter format for multiple groups
        // The API requires syntax like: (group_id:123 OR group_id:456)
        const groupFilter = validGroupIds.map(id => `group_id:${id}`).join(' OR ');
        endpoint += ` (${groupFilter})`;
      }
      
      console.log('Zendesk search endpoint:', endpoint);
      console.log('Using domain:', this.domain);
      console.log('Filtering by groups:', validGroupIds);
      
      // Include ticket metrics in response
      endpoint += '&include=metric_sets';
      
      const response = await this.request(endpoint);
      console.log(`Retrieved ${response.results?.length || 0} tickets from Zendesk search`);
      
      if (!response.results) {
        console.error('Unexpected response format:', response);
        return [];
      }
      
      // Apply secondary filtering if needed - sometimes Zendesk search doesn't properly filter by group
      let tickets = response.results;
      if (validGroupIds.length > 0) {
        // Log each ticket's group ID for debugging
        tickets.forEach((ticket: any) => {
          console.log(`Ticket #${ticket.id} - Group ID: ${ticket.group_id}`);
        });
        
        // Apply explicit filtering by group ID
        const filteredTickets = tickets.filter((ticket: any) => {
          // Convert group IDs to numbers for comparison
          const ticketGroupId = ticket.group_id ? Number(ticket.group_id) : null;
          const included = ticketGroupId && validGroupIds.includes(ticketGroupId);
          
          if (!included && ticketGroupId) {
            console.log(`Ticket #${ticket.id} excluded - group ${ticketGroupId} not in filter list`);
          }
          
          return included;
        });
        
        console.log(`After explicit group filtering: ${filteredTickets.length} tickets remain (from ${tickets.length})`);
        
        // If we end up with zero tickets after filtering, we might have an issue with how group IDs are stored
        // Fallback to returning all tickets if the filtered result is empty
        if (filteredTickets.length === 0 && tickets.length > 0) {
          console.warn('No tickets matched the group filter. Returning all tickets to diagnose the issue.');
          return tickets.map(this.transformTicket);
        }
        
        tickets = filteredTickets;
      }
      
      return tickets.map(this.transformTicket);
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

  async getTicketComments(ticketId: number): Promise<any[]> {
    try {
      console.log(`Fetching comments for ticket #${ticketId}`);
      const response = await this.request(`tickets/${ticketId}/comments.json`);
      
      if (!response.comments || !Array.isArray(response.comments)) {
        console.warn(`No comments found for ticket #${ticketId}`);
        return [];
      }
      
      return response.comments.map((comment: any) => ({
        id: comment.id,
        author_id: comment.author_id,
        body: comment.body,
        html_body: comment.html_body,
        public: comment.public,
        created_at: comment.created_at,
        attachments: comment.attachments || []
      }));
    } catch (error) {
      console.error(`Error fetching comments for ticket #${ticketId}:`, error);
      return [];
    }
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