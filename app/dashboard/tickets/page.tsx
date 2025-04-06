"use client";

import DashboardLayout from "@/components/dashboard/layout";
import { TicketAnalyzer } from "@/components/dashboard/ticket-analyzer";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TicketsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const hasZendeskConnection = user?.user_metadata?.zendesk_connected || false;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">Zendesk Tickets</h2>
            <p className="text-muted-foreground">
              Analyze your Zendesk tickets and export the data
            </p>
          </div>
          {!hasZendeskConnection && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/settings')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Zendesk
            </Button>
          )}
        </div>

        {!hasZendeskConnection ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900">Zendesk not connected</h3>
            <p className="mt-2 text-gray-600 max-w-md">
              To analyze your Zendesk tickets, you need to connect your Zendesk account first.
            </p>
            <Button 
              onClick={() => router.push('/dashboard/settings')}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Your Zendesk Account
            </Button>
          </div>
        ) : (
          <TicketAnalyzer />
        )}
      </div>
    </DashboardLayout>
  );
} 