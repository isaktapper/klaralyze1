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

  async getFilteredTickets(
    startTime?: Date, 
    groupIds: number[] = [], 
    statusFilter: string = ''
  ): Promise<ZendeskTicket[]> {
    try {
      console.log('getFilteredTickets called with params:', { 
        startTime: startTime?.toISOString(),
        groupIds,
        statusFilter,
        domain: this.domain
      });
      
      // Base query for tickets - adjust based on statusFilter
      let endpoint = '';
      
      if (statusFilter && statusFilter !== 'all') {
        // Filter by specific status
        console.log(`Using specific status filter: ${statusFilter}`);
        endpoint = `search.json?query=status:${statusFilter}`;
      } else {
        // Default query to get tickets with Open, Pending, and Solved statuses
        console.log('Using default status filters (open, pending, solved)');
        endpoint = 'search.json?query=status:open status:pending status:solved';
      }
      
      // Add time filter if provided
      if (startTime) {
        endpoint += ` created>${startTime.toISOString()}`;
      }
      
      // Clean and validate group IDs
      const cleanedGroupIds = (groupIds || [])
        .filter(id => id !== undefined && id !== null)
        .map(id => Number(id))
        .filter(id => !isNaN(id) && id > 0);
      
      console.log('Original group IDs:', groupIds);
      console.log('Cleaned group IDs:', cleanedGroupIds);
      
      // Add group filter if provided
      if (cleanedGroupIds.length > 0) {
        // Create proper filter format for multiple groups
        // The API requires syntax like: (group_id:123 OR group_id:456)
        const groupFilter = cleanedGroupIds.map(id => `group_id:${id}`).join(' OR ');
        endpoint += ` (${groupFilter})`;
        console.log('Added group filter to query:', `(${groupFilter})`);
      } else if (groupIds.length > 0) {
        console.warn('Group IDs were provided but none were valid after cleaning');
      }
      
      console.log('Full Zendesk search endpoint:', endpoint);
      
      // Include ticket metrics in response
      endpoint += '&include=metric_sets';
      
      // Make the API request
      console.time('Zendesk API request');
      const response = await this.request(endpoint);
      console.timeEnd('Zendesk API request');
      
      console.log(`Retrieved ${response.results?.length || 0} tickets from Zendesk search`);
      
      if (!response.results) {
        console.error('Unexpected response format, missing results array:', response);
        return [];
      }
      
      // Convert response to tickets
      const tickets = response.results;
      
      // Debug group information
      const groupsInResults = new Set();
      tickets.forEach((ticket: any) => {
        if (ticket.group_id) {
          groupsInResults.add(Number(ticket.group_id));
        }
      });
      
      console.log('Groups found in results:', Array.from(groupsInResults));
      
      // Apply secondary explicit filtering to ensure group filter works
      let filteredTickets = tickets;
      if (cleanedGroupIds.length > 0) {
        console.log('Applying secondary explicit group filtering');
        
        // Log each ticket's group ID for debugging
        filteredTickets = tickets.filter((ticket: any) => {
          const ticketGroupId = ticket.group_id ? Number(ticket.group_id) : null;
          const included = ticketGroupId && cleanedGroupIds.includes(ticketGroupId);
          
          if (ticketGroupId) {
            console.log(`Ticket #${ticket.id} - Group: ${ticketGroupId}, Included: ${included}`);
          }
          
          return included;
        });
        
        console.log(`After explicit group filtering: ${filteredTickets.length} tickets remain (from ${tickets.length})`);
        
        // If we get zero tickets after filtering, this is unusual - log and return unfiltered
        if (filteredTickets.length === 0 && tickets.length > 0) {
          console.warn('No tickets matched after explicit group filtering. Possible group_id mismatch.');
          console.log('Requested group IDs:', cleanedGroupIds);
          console.log('Available group IDs in response:', Array.from(groupsInResults));
          
          // Try to diagnose the issue
          const sampleTickets = tickets.slice(0, 3);
          console.log('Sample tickets for diagnosis:', JSON.stringify(sampleTickets, null, 2));
          
          // Return all tickets without filtering as a fallback
          return tickets.map(this.transformTicket);
        }
      }
      
      // Transform the filtered tickets
      const transformedTickets = filteredTickets.map(this.transformTicket);
      console.log(`Returning ${transformedTickets.length} transformed tickets`);
      
      return transformedTickets;
    } catch (error) {
      console.error('Error in getFilteredTickets:', error);
      throw error; // Re-throw to allow proper error handling by caller
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