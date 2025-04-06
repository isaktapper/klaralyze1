"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  className?: string;
  tickets?: any[]; // Accept real tickets from the API
}

export function RecentActivity({ className, tickets: apiTickets }: RecentActivityProps) {
  // Default mock tickets to show if no real tickets are provided
  const mockTickets = [
    {
      id: "TKT-7890",
      title: "Login issue with new application version",
      customer: {
        name: "Emma Wilson",
        email: "emma.w@example.com",
        avatar: "/avatars/emma.png",
      },
      status: "Open",
      priority: "High",
      time: "5 minutes ago",
      tags: ["authentication", "mobile app"],
    },
    {
      id: "TKT-7889",
      title: "Cannot update profile information",
      customer: {
        name: "Alex Johnson",
        email: "alex.j@example.com",
        avatar: "/avatars/alex.png",
      },
      status: "Resolved",
      priority: "Medium",
      time: "32 minutes ago",
      tags: ["profile", "bug"],
    },
    {
      id: "TKT-7888",
      title: "Billing discrepancy on latest invoice",
      customer: {
        name: "Michael Chen",
        email: "michael.c@example.com",
        avatar: "/avatars/michael.png",
      },
      status: "Pending",
      priority: "Medium",
      time: "1 hour ago",
      tags: ["billing", "finance"],
    },
    {
      id: "TKT-7887",
      title: "Feature request: Export data to CSV",
      customer: {
        name: "Sophia Rodriguez",
        email: "sophia.r@example.com",
        avatar: "/avatars/sophia.png",
      },
      status: "Open",
      priority: "Low",
      time: "2 hours ago",
      tags: ["feature", "data export"],
    },
    {
      id: "TKT-7886",
      title: "Error when submitting payment",
      customer: {
        name: "Daniel Kim",
        email: "daniel.k@example.com",
        avatar: "/avatars/daniel.png",
      },
      status: "Resolved",
      priority: "High",
      time: "3 hours ago",
      tags: ["payment", "critical"],
    },
  ];

  // Use real tickets if provided, otherwise fall back to mock data
  const displayTickets = apiTickets?.length ? apiTickets.map(formatApiTicket) : mockTickets;

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "default";
      case "solved":
      case "resolved":
      case "closed":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "urgent":
        return "destructive";
      case "medium":
      case "normal":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  // Format API tickets to match the display format
  function formatApiTicket(ticket: any) {
    return {
      id: `TKT-${ticket.ticket_id || 'N/A'}`,
      title: ticket.subject || 'No subject',
      customer: {
        name: 'Customer', // We don't have requester details in this data
        email: '',
        avatar: '', 
      },
      status: ticket.status || 'Open',
      priority: ticket.priority || 'Normal',
      time: ticket.created_date ? formatDistanceToNow(new Date(ticket.created_date), { addSuffix: true }) : 'Unknown',
      tags: ticket.tags || [],
    };
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest ticket updates and activities</CardDescription>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        {displayTickets.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recent tickets found
          </div>
        ) : (
          <div className="space-y-4">
            {displayTickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-start gap-4 rounded-lg border p-3">
                <Avatar>
                  <AvatarImage src={ticket.customer.avatar} alt={ticket.customer.name} />
                  <AvatarFallback>{ticket.customer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{ticket.title}</div>
                    <Badge variant={getStatusVariant(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {ticket.id} • {ticket.customer.name}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ticket.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      {ticket.time}
                    </div>
                    <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                      {ticket.priority || 'Normal'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 