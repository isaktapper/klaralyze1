"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  RefreshCcw, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  change?: {
    value: string;
    positive: boolean;
  };
}

function StatCard({ title, value, description, icon: Icon, change }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change && (
          <div className="mt-2 flex items-center text-xs">
            {change.positive ? 
              <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" /> : 
              <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />
            }
            <span className={change.positive ? "text-emerald-500" : "text-rose-500"}>
              {change.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TicketStats() {
  const stats = [
    {
      title: "Total Tickets",
      value: "1,248",
      description: "All tickets this month",
      icon: MessageSquare,
      change: {
        value: "12% from last month",
        positive: true,
      },
    },
    {
      title: "Open Tickets",
      value: "42",
      description: "Tickets awaiting response",
      icon: Clock,
      change: {
        value: "8% from last month",
        positive: false,
      },
    },
    {
      title: "Resolved Tickets",
      value: "982",
      description: "Tickets resolved this month",
      icon: CheckCircle2,
      change: {
        value: "14% from last month",
        positive: true,
      },
    },
    {
      title: "Pending Tickets",
      value: "224",
      description: "Tickets awaiting customer",
      icon: RefreshCcw,
      change: {
        value: "3% from last month",
        positive: true,
      },
    },
    {
      title: "Positive Feedback",
      value: "89%",
      description: "Customer satisfaction rate",
      icon: ThumbsUp,
      change: {
        value: "4% from last month",
        positive: true,
      },
    },
    {
      title: "Negative Feedback",
      value: "11%",
      description: "Customer dissatisfaction rate",
      icon: ThumbsDown,
      change: {
        value: "4% from last month",
        positive: false,
      },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
} 