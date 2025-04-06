'use client';

import Link from "next/link";
import DashboardLayout from "@/components/dashboard/layout";
import TicketsTable from "@/components/dashboard/tickets-table";
import { useAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TicketsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const hasZendeskConnection = user?.user_metadata?.zendesk_connected || false;

  if (!hasZendeskConnection) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
            <p className="text-muted-foreground">
              View and manage all your customer support tickets
            </p>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <p className="text-lg font-medium text-muted-foreground">No data available</p>
              <p className="text-sm text-muted-foreground text-center">
                Connect your Zendesk account to view and manage your support tickets
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/org/your-org/connect-zendesk')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Connect Zendesk
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">
            View and manage all your customer support tickets
          </p>
        </div>
        
        <TicketsTable />
      </div>
    </DashboardLayout>
  );
} 