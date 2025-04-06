"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { ZendeskGroupsSelector } from "@/components/dashboard/zendesk-groups-selector";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Download, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TicketImportConfig, ImportConfig } from "@/components/dashboard/ticket-import-config";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  // Add export configuration state
  const [exportConfig, setExportConfig] = useState<ImportConfig>({
    selectedFields: [],
    includeComments: true
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
      
      // Add group IDs to the request if selected
      if (selectedGroups.length > 0) {
        params.append('groups', selectedGroups.join(','));
        console.log(`Including ${selectedGroups.length} groups in request:`, selectedGroups);
      }
      
      const requestUrl = `/api/dashboard/tickets/filtered?${params.toString()}`;
      console.log('Fetching tickets from:', requestUrl);
      
      // Fetch tickets
      const response = await fetch(requestUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to fetch tickets');
      }
      
      const data = await response.json();
      console.log('Ticket data received:', data);
      
      // Update state with ticket data
      setTickets(data.tickets || []);
      setTicketStats({
        total: data.total || 0,
        openTickets: data.openTickets || 0,
        pendingTickets: data.pendingTickets || 0,
        solvedTickets: data.solvedTickets || 0
      });
      
      // Show appropriate message based on group filtering and results
      if (selectedGroups.length > 0 && data.total === 0) {
        toast.warning(`No tickets found for the selected groups: ${selectedGroups.join(', ')}`);
      } else {
        toast.success(`Loaded ${data.total} tickets successfully`);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  // Updated function to export tickets with selected fields
  const exportToCsv = (selectedFields: string[] = []) => {
    if (tickets.length === 0) {
      toast.error("No tickets to export");
      return;
    }

    try {
      // If no fields specified, use the current export config
      const fieldsToExport = selectedFields.length > 0 
        ? selectedFields 
        : exportConfig.selectedFields;
        
      if (fieldsToExport.length === 0) {
        toast.error("No fields selected for export");
        return;
      }
      
      // Build CSV content with only selected fields
      let csvContent = fieldsToExport.join(',') + '\n';
      
      tickets.forEach(ticket => {
        const row = fieldsToExport.map(fieldId => {
          // Handle nested field paths like 'custom_fields.something'
          let value: any = ticket;
          const parts = fieldId.split('.');
          
          for (const part of parts) {
            if (value === null || value === undefined) {
              value = '';
              break;
            }
            value = value[part];
          }
          
          // Handle special cases (strings with commas, etc.)
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') {
            // For array values like tags
            if (Array.isArray(value)) {
              return `"${value.join(';')}"`;
            }
            // For other objects, stringify
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
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
      
      toast.success(`Exported ${tickets.length} tickets to CSV`);
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

  // Calculate pagination
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  
  // Page change handler
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  // Show max 5 page numbers around current page
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust startPage if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  // Function to get group name from ID
  const getGroupName = (groupId: number | null | undefined) => {
    if (!groupId) return "-";
    // Check if we have a groups selector with this ID
    const group = document.getElementById(`group-${groupId}`);
    if (group) {
      // Get the closest label text
      const label = group.nextElementSibling?.querySelector('label')?.textContent;
      if (label) {
        // Return just the name part, not the ID
        return label.split('(')[0]?.trim() || `Group ${groupId}`;
      }
    }
    return `Group ${groupId}`;
  };

  // Handle export config changes
  const handleExportConfigChange = (config: ImportConfig) => {
    setExportConfig(config);
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
          
          {/* Updated action buttons with export config */}
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
            
            <div className="flex">
              <Button 
                variant="outline" 
                onClick={() => exportToCsv()}
                disabled={isLoading || tickets.length === 0}
              >
                <Download className="mr-2 h-4 w-4" /> 
                Export CSV
              </Button>
              
              {tickets.length > 0 && (
                <TicketImportConfig
                  tickets={tickets}
                  onConfigChange={handleExportConfigChange}
                  onExport={exportToCsv}
                />
              )}
            </div>
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
          
          {/* Updated Tickets table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      {isLoading ? 'Loading tickets...' : 'No tickets found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentTickets.map((ticket) => (
                    <TableRow key={ticket.ticket_id}>
                      <TableCell className="font-medium">
                        #{ticket.ticket_id}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        {ticket.group_id ? getGroupName(ticket.group_id) : "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell>
                        {ticket.priority || "-"}
                      </TableCell>
                      <TableCell>
                        {ticket.created_date ? new Date(ticket.created_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {ticket.updated_date ? new Date(ticket.updated_date).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {tickets.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {pageNumbers.map(number => (
                  <PaginationItem key={number}>
                    <PaginationLink 
                      onClick={() => handlePageChange(number)}
                      isActive={currentPage === number}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
          
          {tickets.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, tickets.length)} of {tickets.length} tickets
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