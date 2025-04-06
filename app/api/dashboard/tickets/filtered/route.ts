import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ZendeskAPI } from '@/lib/zendesk';

export async function GET(request: Request) {
  try {
    // Parse URL and query parameters
    const url = new URL(request.url);
    const fromDate = url.searchParams.get('from');
    const toDate = url.searchParams.get('to');
    const groups = url.searchParams.get('groups'); // Comma-separated list of group IDs
    const includeComments = url.searchParams.get('includeComments') === 'true';
    
    console.log('Request URL:', request.url);
    console.log('Query parameters:', { fromDate, toDate, groups, includeComments });
    
    let groupIds: number[] = [];
    if (groups) {
      // Convert group IDs from string to numbers and log for debugging
      groupIds = groups.split(',').map(id => {
        const numId = parseInt(id.trim(), 10);
        console.log(`Parsed group ID: ${id} -> ${numId}`);
        return numId;
      }).filter(id => !isNaN(id)); // Filter out any NaN values
      
      console.log('Processing groups filter with IDs:', groupIds);
    }

    // Authentication check via Supabase
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get Zendesk credentials from user metadata
    const { zendesk_domain, zendesk_email, zendesk_api_key } = session.user.user_metadata || {};

    if (!zendesk_domain || !zendesk_email || !zendesk_api_key) {
      return NextResponse.json(
        { error: 'Zendesk not connected' },
        { status: 400 }
      );
    }

    // Create Zendesk API client
    const zendesk = new ZendeskAPI(zendesk_domain, zendesk_email, zendesk_api_key);

    // Setup date filtering
    let startTime: Date | undefined;
    if (fromDate) {
      startTime = new Date(fromDate);
      console.log('Using start date:', startTime);
    }

    // Fetch tickets from Zendesk
    console.log('Fetching Zendesk tickets with params:', { 
      fromDate, 
      toDate, 
      groups: groupIds,
      includeComments
    });
    
    try {
      // Ensure groupIds are properly passed to the API
      console.log(`Calling getFilteredTickets with ${groupIds.length} group IDs:`, groupIds);
      let tickets = await zendesk.getFilteredTickets(startTime, groupIds);
      
      // If group filtering is applied, log the results
      if (groupIds.length > 0) {
        console.log(`Filtering tickets by ${groupIds.length} groups`);
        console.log('Filtered tickets by group:', tickets.map(t => ({ 
          id: t.ticket_id, 
          group: t.group_id,
          status: t.status 
        })));
      }
      
      console.log(`Successfully fetched ${tickets.length} tickets from Zendesk`);

      // Fetch comments for tickets if requested
      if (includeComments && tickets.length > 0) {
        console.log(`Fetching comments for ${tickets.length} tickets`);
        
        // To avoid overwhelming the API, limit to first 20 tickets if there are many
        const ticketsToFetch = tickets.length > 20 ? tickets.slice(0, 20) : tickets;
        
        // Fetch comments for each ticket
        for (const ticket of ticketsToFetch) {
          try {
            const comments = await zendesk.getTicketComments(ticket.ticket_id);
            ticket.comments = comments;
            console.log(`Added ${comments.length} comments to ticket #${ticket.ticket_id}`);
          } catch (commentError) {
            console.error(`Failed to fetch comments for ticket #${ticket.ticket_id}:`, commentError);
            ticket.comments = [];
          }
        }
        
        // Add note if we limited the comments fetching
        if (tickets.length > 20) {
          console.log(`Only fetched comments for first 20 tickets out of ${tickets.length}`);
        }
      }

      // Calculate ticket metrics by status
      const ticketsByStatus = countTicketsByStatus(tickets);
      console.log('Tickets by status:', ticketsByStatus);
      
      // Calculate resolution metrics
      const resolvedTickets = tickets.filter(ticket => ticket.status === 'solved');
      const avgResolutionTime = calculateAverageResolutionTime(resolvedTickets);
      
      return NextResponse.json({
        total: tickets.length,
        ticketsByStatus,
        openTickets: ticketsByStatus.open || 0,
        pendingTickets: ticketsByStatus.pending || 0,
        solvedTickets: ticketsByStatus.solved || 0,
        avgResolutionTime,
        tickets: tickets,
        commentsIncluded: includeComments
      });
    } catch (error) {
      console.error('Error fetching tickets from Zendesk API:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch Zendesk ticket data',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching Zendesk tickets:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Zendesk ticket data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Helper function to count tickets by status
function countTicketsByStatus(tickets: any[]) {
  const statusCounts: Record<string, number> = {};
  
  tickets.forEach(ticket => {
    const status = ticket.status?.toLowerCase() || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  return statusCounts;
}

// Helper function to calculate average resolution time
function calculateAverageResolutionTime(tickets: any[]) {
  if (!tickets.length) return null;
  
  const ticketsWithResolutionTime = tickets.filter(t => 
    t.full_resolution_time_minutes !== null && 
    t.full_resolution_time_minutes !== undefined
  );
  
  if (!ticketsWithResolutionTime.length) return null;
  
  const totalResolutionTime = ticketsWithResolutionTime.reduce(
    (sum, ticket) => sum + (ticket.full_resolution_time_minutes || 0), 
    0
  );
  
  return totalResolutionTime / ticketsWithResolutionTime.length;
} 