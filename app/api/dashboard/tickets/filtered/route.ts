import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ZendeskAPI } from '@/lib/zendesk';

export async function GET(request: Request) {
  console.log('==== Zendesk Filtered Tickets API Call ====');
  console.log('Request received:', new Date().toISOString());
  
  try {
    // Parse URL and query parameters
    const url = new URL(request.url);
    const fromDate = url.searchParams.get('from');
    const toDate = url.searchParams.get('to');
    const groups = url.searchParams.get('groups'); // Comma-separated list of group IDs
    const includeComments = url.searchParams.get('includeComments') === 'true';
    const ticketStatus = url.searchParams.get('status') || 'all'; // Get status filter if provided
    
    console.log('Request URL:', request.url);
    console.log('Query parameters:', { fromDate, toDate, groups, includeComments, ticketStatus });
    
    // Parse group IDs
    let groupIds: number[] = [];
    if (groups) {
      try {
        // Split by commas and process each ID
        const groupIdStrings = groups.split(',').map(id => id.trim()).filter(id => id);
        console.log('Group ID strings from request:', groupIdStrings);
        
        // Convert to numbers and filter out invalid values
        groupIds = groupIdStrings
          .map(idStr => {
            const numId = parseInt(idStr, 10);
            if (isNaN(numId)) {
              console.warn(`Invalid group ID skipped: "${idStr}"`);
              return null;
            }
            return numId;
          })
          .filter((id): id is number => id !== null);
        
        console.log('Parsed group IDs:', groupIds);
      } catch (error) {
        console.error('Error parsing group IDs:', error);
        groupIds = []; // Reset on error
      }
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
      console.error('User not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get Zendesk credentials from user metadata
    const { 
      zendesk_domain, 
      zendesk_email, 
      zendesk_api_key,
      zendesk_fetch_all_tickets,
      zendesk_import_comments,
      zendesk_ticket_status
    } = session.user.user_metadata || {};

    if (!zendesk_domain || !zendesk_email || !zendesk_api_key) {
      console.error('Zendesk credentials not found in user metadata');
      return NextResponse.json(
        { error: 'Zendesk not connected' },
        { status: 400 }
      );
    }

    // Respect user preferences if query params don't override them
    const shouldIncludeComments = includeComments !== undefined ? includeComments : zendesk_import_comments !== false;
    const effectiveTicketStatus = ticketStatus || zendesk_ticket_status || 'all';

    // Create Zendesk API client
    const zendesk = new ZendeskAPI(zendesk_domain, zendesk_email, zendesk_api_key);

    // Setup date filtering
    let startTime: Date | undefined;
    if (fromDate) {
      startTime = new Date(fromDate);
      console.log('Using start date:', startTime.toISOString());
    }

    // Fetch tickets from Zendesk
    console.log('Fetching Zendesk tickets with params:', { 
      fromDate, 
      toDate, 
      groups: groupIds,
      includeComments: shouldIncludeComments,
      status: effectiveTicketStatus
    });
    
    try {
      // Log the actual call parameters
      console.log(`Calling getFilteredTickets with ${groupIds.length} group IDs:`, groupIds);
      
      let tickets;
      let statusFilter = '';
      
      // Apply status filter if it's not 'all'
      if (effectiveTicketStatus !== 'all') {
        statusFilter = effectiveTicketStatus;
        console.log(`Applying status filter: ${statusFilter}`);
      }
      
      // Fetch tickets with appropriate filters
      tickets = await zendesk.getFilteredTickets(startTime, groupIds, statusFilter);
      
      // Log the results
      console.log(`Successfully fetched ${tickets.length} tickets from Zendesk`);
      
      if (groupIds.length > 0) {
        // Log group distribution in the results
        const groupCounts: Record<string, number> = {};
        tickets.forEach((ticket: any) => {
          const groupId = ticket.group_id;
          if (groupId) {
            groupCounts[groupId] = (groupCounts[groupId] || 0) + 1;
          }
        });
        console.log('Tickets per group:', groupCounts);
      }

      // Fetch comments for tickets if requested
      if (shouldIncludeComments && tickets.length > 0) {
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
      
      // Return the full response
      console.log('API request completed successfully');
      return NextResponse.json({
        total: tickets.length,
        ticketsByStatus,
        openTickets: ticketsByStatus.open || 0,
        pendingTickets: ticketsByStatus.pending || 0,
        solvedTickets: ticketsByStatus.solved || 0,
        avgResolutionTime,
        tickets: tickets,
        commentsIncluded: shouldIncludeComments,
        filtered_by: {
          groups: groupIds.length > 0 ? groupIds : null,
          date_from: fromDate || null,
          date_to: toDate || null,
          status: effectiveTicketStatus
        }
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
    console.error('Unhandled error in tickets/filtered API:', error);
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