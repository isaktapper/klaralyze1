'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard/layout";
import { TicketStats } from "@/components/dashboard/ticket-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { FrequentInsights } from "@/components/dashboard/frequent-insights";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Loader2 } from 'lucide-react';
import { UserStats } from '@/components/dashboard/user-stats';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import { TicketsCountBox } from '@/components/dashboard/tickets-count-box';
import { DateRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';

// Interface for the ticket data returned from the API
interface TicketData {
  total: number;
  ticketsByStatus: Record<string, number>;
  ticketsCreatedInPeriod: number;
  resolvedTickets: number;
  avgResolutionTime: number | null;
  recentTickets: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [showZendeskModal, setShowZendeskModal] = useState(false);
  
  // Determine if Zendesk is connected based on user metadata
  const hasZendeskConnection = user?.user_metadata?.zendesk_connected || false;
  
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // State for ticket data
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Log user data to debug
  useEffect(() => {
    if (user) {
      console.log('User metadata:', user.user_metadata);
      console.log('Zendesk connected status:', user?.user_metadata?.zendesk_connected);
    }
  }, [user]);
  
  const [zendeskForm, setZendeskForm] = useState({
    domain: '',
    email: '',
    apiKey: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Check for Zendesk connection modal
    if (searchParams?.get('connect') === 'zendesk') {
      setShowZendeskModal(true);
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  // Fetch ticket data when date range changes or when the component mounts
  useEffect(() => {
    if (hasZendeskConnection && dateRange?.from) {
      fetchTicketData();
    }
  }, [hasZendeskConnection, dateRange]);

  // Function to fetch ticket data from the API
  const fetchTicketData = async () => {
    if (!dateRange?.from) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Create query parameters for the API call
      const params = new URLSearchParams();
      
      if (dateRange.from) {
        params.append('from', format(dateRange.from, 'yyyy-MM-dd'));
      }
      
      if (dateRange.to) {
        params.append('to', format(dateRange.to, 'yyyy-MM-dd'));
      }
      
      // Make the API call using the real endpoint
      const response = await fetch(`/api/dashboard/tickets?${params.toString()}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch ticket data');
      }
      
      const data = await response.json();
      setTicketData(data);
    } catch (err) {
      console.error('Error fetching ticket data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleZendeskConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsConnecting(true);

    try {
      // Redirect to the multi-step flow instead
      router.push('/connect-zendesk');
      return;
    } catch (err) {
      setFormError('Failed to connect to Zendesk. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
              <p className="text-muted-foreground">
                Key metrics and insights for your support operations
              </p>
            </div>
            {!hasZendeskConnection && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/connect-zendesk')}
                className="connect-zendesk-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Zendesk
              </Button>
            )}
          </div>
          
          {/* Date Range Picker - Only show when connected */}
          {hasZendeskConnection && (
            <div className="w-full max-w-sm">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
          )}
          
          {/* No data state */}
          {!hasZendeskConnection && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900">No data available</h3>
              <p className="mt-2 text-gray-600 max-w-md">
                Connect your Zendesk account to view your support metrics and insights
              </p>
              <Button 
                onClick={() => router.push('/connect-zendesk')}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Your Zendesk Account
              </Button>
            </div>
          )}
          
          {/* Loading state */}
          {hasZendeskConnection && isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-gray-600">Loading your Zendesk data...</p>
            </div>
          )}
          
          {/* Error state */}
          {hasZendeskConnection && error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
              <p className="text-red-600">Error loading data: {error}</p>
              <Button 
                onClick={fetchTicketData} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {/* Tickets Count Box - Only show when connected and data is loaded */}
          {hasZendeskConnection && !isLoading && ticketData && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <TicketsCountBox 
                count={ticketData.total} 
                change={{
                  value: 0, // No previous data to compare yet
                  percentage: 0,
                  timeframe: "previous period"
                }}
              />
              <TicketsCountBox 
                count={ticketData.ticketsByStatus?.open || 0} 
                title="Open Tickets"
                description="Tickets awaiting response"
                change={{
                  value: 0,
                  percentage: 0,
                  timeframe: "previous period"
                }}
              />
              <TicketsCountBox 
                count={ticketData.resolvedTickets} 
                title="Resolved Tickets"
                description="Tickets resolved in period"
                change={{
                  value: 0,
                  percentage: 0,
                  timeframe: "previous period"
                }}
              />
              <TicketsCountBox 
                count={ticketData.ticketsByStatus?.pending || 0} 
                title="Pending Tickets"
                description="Tickets awaiting customer"
                change={{
                  value: 0,
                  percentage: 0,
                  timeframe: "previous period"
                }}
              />
            </div>
          )}
          
          {/* Other Content sections - ONLY SHOW WHEN ZENDESK IS CONNECTED */}
          {hasZendeskConnection && !isLoading && ticketData && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TicketStats />
              <RecentActivity tickets={ticketData.recentTickets} />
              <PerformanceMetrics />
              <FrequentInsights />
            </div>
          )}
        </div>
      </DashboardLayout>

      {/* Zendesk Connection Modal */}
      {showZendeskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Connect Zendesk</h2>
              <button 
                onClick={() => setShowZendeskModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleZendeskConnect} className="space-y-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                  Zendesk Domain
                </label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="your-domain.zendesk.com"
                  value={zendeskForm.domain}
                  onChange={(e) => setZendeskForm(prev => ({ ...prev, domain: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={zendeskForm.email}
                  onChange={(e) => setZendeskForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Zendesk API key"
                  value={zendeskForm.apiKey}
                  onChange={(e) => setZendeskForm(prev => ({ ...prev, apiKey: e.target.value }))}
                  required
                />
              </div>
              {formError && (
                <p className="text-sm text-red-600 mt-2">{formError}</p>
              )}
              <div className="space-y-4 pt-4">
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect with Zendesk'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowZendeskModal(false)}
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Include user stats if connected - ONLY SHOW WHEN ZENDESK IS CONNECTED */}
      {hasZendeskConnection && <UserStats />}
    </div>
  );
} 