'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard/layout";
import { TicketStats } from "@/components/dashboard/ticket-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { FrequentInsights } from "@/components/dashboard/frequent-insights";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from 'lucide-react';
import { UserStats } from '@/components/dashboard/user-stats';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import { TicketsCountBox } from '@/components/dashboard/tickets-count-box';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [showZendeskModal, setShowZendeskModal] = useState(false);
  
  // TEMPORARY OVERRIDE: Always show the connect button and hide data
  // When testing is complete, remove this override and use the commented line below
  const hasZendeskConnection = true; // Changed to true for testing
  // const hasZendeskConnection = user?.user_metadata?.zendesk_connected || false;
  
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
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
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for Zendesk connection modal
    if (searchParams?.get('connect') === 'zendesk') {
      setShowZendeskModal(true);
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  const handleZendeskConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsConnecting(true);

    try {
      // Redirect to the multi-step flow instead
      router.push('/connect-zendesk');
      return;
    } catch (err) {
      setError('Failed to connect to Zendesk. Please check your credentials.');
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
          
          {/* Tickets Count Box - Only show when connected */}
          {hasZendeskConnection && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <TicketsCountBox 
                count={1248} 
                change={{
                  value: 148,
                  percentage: 12,
                  timeframe: "previous period"
                }}
              />
              <TicketsCountBox 
                count={42} 
                title="Open Tickets"
                description="Tickets awaiting response"
                change={{
                  value: -4,
                  percentage: 8,
                  timeframe: "previous period"
                }}
              />
              <TicketsCountBox 
                count={982} 
                title="Resolved Tickets"
                description="Tickets resolved in period"
                change={{
                  value: 122,
                  percentage: 14,
                  timeframe: "previous period"
                }}
              />
              <TicketsCountBox 
                count={224} 
                title="Pending Tickets"
                description="Tickets awaiting customer"
                change={{
                  value: 7,
                  percentage: 3,
                  timeframe: "previous period"
                }}
              />
            </div>
          )}
          
          {/* Other Content sections - ONLY SHOW WHEN ZENDESK IS CONNECTED */}
          {hasZendeskConnection && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TicketStats />
              <RecentActivity />
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
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
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