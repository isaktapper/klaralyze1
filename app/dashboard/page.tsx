'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard/layout";
import { TicketStats } from "@/components/dashboard/ticket-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { FrequentInsights } from "@/components/dashboard/frequent-insights";
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { Button } from "@/components/ui/button";
import { PlayCircle, Plus } from 'lucide-react';
import { UserStats } from '@/components/dashboard/user-stats';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [isGuiding, setIsGuiding] = useState(false);
  const hasZendeskConnection = user?.user_metadata?.zendesk_connected || false;

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout isGuiding={isGuiding}>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
              <p className="text-muted-foreground">
                Key metrics and insights for your support operations
              </p>
            </div>
            <div className="flex gap-2">
              {!hasZendeskConnection && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/org/your-org/connect-zendesk')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Connect Zendesk
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTour(true)}
                className="flex items-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Take the Tour
              </Button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {hasZendeskConnection ? (
              <>
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-xs text-green-600">↑ 12% from last month</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                    <p className="text-2xl font-bold">2h 15m</p>
                    <p className="text-xs text-red-600">↑ 5% from last month</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-green-600">↑ 3% from last month</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">First Contact Resolution</p>
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-green-600">↑ 2% from last month</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-4 rounded-lg border bg-card p-6">
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <p className="text-lg font-medium text-muted-foreground">No data available</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Connect your Zendesk account to view your support metrics and insights
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/org/your-org/connect-zendesk')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Connect Zendesk
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Main Content */}
          {hasZendeskConnection ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
                  <PerformanceMetrics />
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <RecentActivity />
                </div>
              </div>
            </div>
          ) : null}
          
          {/* Insights */}
          {hasZendeskConnection && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">AI-Powered Insights</h3>
              <FrequentInsights />
            </div>
          )}
        </div>
      </DashboardLayout>

      {showTour && (
        <GuidedTour
          onClose={() => setShowTour(false)}
          onGuidingChange={setIsGuiding}
        />
      )}

      <UserStats />
    </div>
  );
} 