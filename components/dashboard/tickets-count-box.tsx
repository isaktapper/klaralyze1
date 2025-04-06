"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowUp, ArrowDown } from "lucide-react";

interface TicketsCountBoxProps {
  count: number;
  title?: string;
  description?: string;
  change?: {
    value: number;
    percentage: number;
    timeframe: string;
  };
}

export function TicketsCountBox({
  count,
  title = "Total Tickets",
  description = "All tickets in selected period",
  change,
}: TicketsCountBoxProps) {
  const isPositiveChange = change ? change.value >= 0 : false;
  const formattedCount = new Intl.NumberFormat().format(count);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formattedCount}</div>
        <CardDescription>{description}</CardDescription>
        
        {change && (
          <div className="mt-4 flex items-center text-sm">
            {isPositiveChange ? (
              <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 text-rose-500" />
            )}
            <span
              className={
                isPositiveChange ? "text-emerald-500" : "text-rose-500"
              }
            >
              {Math.abs(change.value)} tickets ({Math.abs(change.percentage)}%)
            </span>
            <span className="ml-1 text-muted-foreground">
              vs {change.timeframe}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 