"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { ZendeskGroupsSelector } from "@/components/dashboard/zendesk-groups-selector";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TicketAnalyzerProps {
  className?: string;
}

export function TicketAnalyzer({ className }: TicketAnalyzerProps) {
  // Ticket data and filtering state
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [ticketStats, setTicketStats] = useState<{
    total: number;
    openTickets: number;
    pendingTickets: number;
    solvedTickets: number;
  }>({
    total: 0,
    openTickets: 0,
    pendingTickets: 0,
    solvedTickets: 0,
  });

  // Fetch tickets on initial load
  useEffect(() => {
    fetchTickets();
  }, [dateRange, selectedGroups]);

  // Function to fetch tickets with the current filters
  const fetchTickets = async () => {
    if (!dateRange?.from) {
      toast.error("Please select a date range");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (dateRange.from) {
        params.append('from', format(dateRange.from, 'yyyy-MM-dd'));
      }
      
      if (dateRange.to) {
        params.append('to', format(dateRange.to, 'yyyy-MM-dd'));
      }
      
      if (selectedGroups.length > 0) {
        params.append('groups', selectedGroups.join(','));
      }
      
      // Fetch tickets
      const response = await fetch(`/api/dashboard/tickets/filtered?${params.toString()}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch tickets');
      }
      
      const data = await response.json();
      
      // Update state with ticket data
      setTickets(data.tickets || []);
      setTicketStats({
        total: data.total || 0,
        openTickets: data.openTickets || 0,
        pendingTickets: data.pendingTickets || 0,
        solvedTickets: data.solvedTickets || 0
      });
      
      toast.success(`Loaded ${data.total} tickets successfully`);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to export tickets to CSV
  const exportToCsv = () => {
    if (tickets.length === 0) {
      toast.error("No tickets to export");
      return;
    }

    try {
      // Get headers from first ticket
      const headers = Object.keys(tickets[0]).filter(key => 
        // Filter out complex objects or arrays
        typeof tickets[0][key] !== 'object' || tickets[0][key] === null
      );
      
      // Build CSV content
      let csvContent = headers.join(',') + '\n';
      
      tickets.forEach(ticket => {
        const row = headers.map(header => {
          const value = ticket[header];
          // Handle special cases (strings with commas, etc.)
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvContent += row.join(',') + '\n';
      });
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `zendesk-tickets-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Exported tickets to CSV");
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast.error('Failed to export tickets');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <Badge variant="default">Open</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'solved':
        return <Badge variant="secondary">Solved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ticket Analyzer</CardTitle>
        <CardDescription>
          View and analyze your Zendesk tickets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <DateRangePicker 
                dateRange={dateRange} 
                onDateRangeChange={setDateRange} 
              />
            </div>
            <ZendeskGroupsSelector 
              selectedGroups={selectedGroups}
              onGroupsSelected={setSelectedGroups}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <Button 
              onClick={fetchTickets} 
              disabled={isLoading || !dateRange?.from}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> 
                  Refresh Tickets
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={exportToCsv}
              disabled={isLoading || tickets.length === 0}
            >
              <Download className="mr-2 h-4 w-4" /> 
              Export CSV
            </Button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">
              Error: {error}
            </div>
          )}
          
          {/* Stats summary */}
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="bg-slate-100 p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{ticketStats.total}</div>
              <div className="text-xs text-slate-500">Total Tickets</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-blue-600">{ticketStats.openTickets}</div>
              <div className="text-xs text-slate-500">Open</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-orange-600">{ticketStats.pendingTickets}</div>
              <div className="text-xs text-slate-500">Pending</div>
            </div>
            <div className="bg-green-50 p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-green-600">{ticketStats.solvedTickets}</div>
              <div className="text-xs text-slate-500">Solved</div>
            </div>
          </div>
          
          {/* Tickets table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Solved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      {isLoading ? 'Loading tickets...' : 'No tickets found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.slice(0, 10).map((ticket) => (
                    <TableRow key={ticket.ticket_id}>
                      <TableCell className="font-medium">
                        #{ticket.ticket_id}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell>
                        {ticket.created_date ? new Date(ticket.created_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {ticket.solved_date ? new Date(ticket.solved_date).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {tickets.length > 10 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing 10 of {tickets.length} tickets. Export to CSV to view all.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        <div className="text-sm">
          Groups: {selectedGroups.length ? `${selectedGroups.length} selected` : 'All'}
        </div>
      </CardFooter>
    </Card>
  );
} 