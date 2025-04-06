import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Create sample mock data
  const mockTickets = Array.from({ length: 25 }, (_, i) => ({
    ticket_id: 1000 + i,
    subject: `Sample Ticket ${i + 1}`,
    description: `This is a description for sample ticket ${i + 1}`,
    status: getRandomStatus(),
    priority: getRandomPriority(),
    assignee_id: Math.floor(Math.random() * 5) + 1,
    requester_id: Math.floor(Math.random() * 10) + 1,
    created_date: getRandomDate(30),
    updated_date: getRandomDate(15),
    solved_date: Math.random() > 0.7 ? getRandomDate(5) : null,
    tags: getRandomTags(),
    first_response_time_minutes: Math.floor(Math.random() * 60),
    full_resolution_time_minutes: Math.floor(Math.random() * 480),
  }));

  // Calculate metrics
  const ticketsByStatus = countTicketsByStatus(mockTickets);
  const resolvedTickets = mockTickets.filter(ticket => ticket.status === 'solved' || ticket.status === 'closed');
  const avgResolutionTime = calculateAverageResolutionTime(resolvedTickets);

  return NextResponse.json({
    total: mockTickets.length,
    ticketsByStatus,
    ticketsCreatedInPeriod: mockTickets.length,
    resolvedTickets: resolvedTickets.length,
    avgResolutionTime,
    recentTickets: mockTickets.slice(0, 10)
  });
}

// Helper function to generate random status
function getRandomStatus() {
  const statuses = ['open', 'pending', 'solved', 'closed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Helper function to generate random priority
function getRandomPriority() {
  const priorities = ['low', 'normal', 'high', 'urgent'];
  return priorities[Math.floor(Math.random() * priorities.length)];
}

// Helper function to generate random date within the past X days
function getRandomDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

// Helper function to generate random tags
function getRandomTags() {
  const allTags = ['billing', 'technical', 'feature request', 'bug', 'account', 'login', 'payment', 'subscription', 'mobile', 'web'];
  const numTags = Math.floor(Math.random() * 3) + 1;
  const tags: string[] = [];
  
  for (let i = 0; i < numTags; i++) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }
  
  return tags;
}

// Helper function to count tickets by status
function countTicketsByStatus(tickets: any[]) {
  const statusCounts: Record<string, number> = {};
  
  tickets.forEach(ticket => {
    const status = ticket.status || 'unknown';
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