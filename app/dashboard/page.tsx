import Link from "next/link";
import DashboardLayout from "@/components/dashboard/layout";
import { TicketStats } from "@/components/dashboard/ticket-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { FrequentInsights } from "@/components/dashboard/frequent-insights";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your support ticket analytics and performance
          </p>
        </div>
        
        <TicketStats />
        
        <FrequentInsights />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <PerformanceMetrics className="lg:col-span-4" />
          <RecentActivity className="lg:col-span-3" />
        </div>
      </div>
    </DashboardLayout>
  );
} 