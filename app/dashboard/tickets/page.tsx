import Link from "next/link";
import DashboardLayout from "@/components/dashboard/layout";
import TicketsTable from "@/components/dashboard/tickets-table";

export default function TicketsPage() {
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