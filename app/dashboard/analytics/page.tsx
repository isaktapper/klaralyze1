'use client';

import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "@/components/dashboard/overview-metrics";
import { CategoryDistribution } from "@/components/dashboard/category-distribution";
import { ResponseTimes } from "@/components/dashboard/response-times";
import { SatisfactionScore } from "@/components/dashboard/satisfaction-score";
import { useAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ZendeskConnectModal } from '@/components/dashboard/zendesk-connect-modal';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const hasZendeskConnection = user?.user_metadata?.zendesk_connected || false;
  const [showZendeskModal, setShowZendeskModal] = useState(false);

  if (!hasZendeskConnection) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              Detailed insights and trends from your support tickets
            </p>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <p className="text-lg font-medium text-muted-foreground">No data available</p>
              <p className="text-sm text-muted-foreground text-center">
                Connect your Zendesk account to view your support analytics and trends
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/connect-zendesk')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Connect Zendesk
              </Button>
            </CardContent>
          </Card>
        </div>

        <ZendeskConnectModal 
          isOpen={showZendeskModal}
          onClose={() => setShowZendeskModal(false)}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Detailed insights and trends from your support tickets
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="response">Response Times</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <OverviewMetrics />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <CategoryDistribution />
          </TabsContent>
          
          <TabsContent value="response" className="space-y-4">
            <ResponseTimes />
          </TabsContent>
          
          <TabsContent value="satisfaction" className="space-y-4">
            <SatisfactionScore />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 