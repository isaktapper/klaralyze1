"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Clock, AlertCircle, ArrowRight } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  category: "trend" | "anomaly" | "action" | "improvement";
  timeframe: string;
}

function InsightCard({ title, description, category, timeframe }: InsightCardProps) {
  const getCategoryIcon = () => {
    switch (category) {
      case "trend": return <TrendingUp className="h-4 w-4" />;
      case "anomaly": return <AlertCircle className="h-4 w-4" />;
      case "action": return <ArrowRight className="h-4 w-4" />;
      case "improvement": return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case "trend": return "bg-blue-50 text-blue-700";
      case "anomaly": return "bg-red-50 text-red-700";
      case "action": return "bg-purple-50 text-purple-700";
      case "improvement": return "bg-emerald-50 text-emerald-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-full ${getCategoryColor()}`}>
              {getCategoryIcon()}
            </div>
            <Badge variant="outline">{category}</Badge>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {timeframe}
          </div>
        </div>
        <CardTitle className="text-base mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
      <div className="p-3 pt-0 mt-auto">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View Details
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
}

export function FrequentInsights() {
  const insights: InsightCardProps[] = [
    {
      title: "Increase in Technical Issues",
      description: "Technical issues have increased by 27% compared to last month. Primary areas affected are login and account management.",
      category: "trend",
      timeframe: "Last 30 days",
    },
    {
      title: "Response Time Improvement",
      description: "First response time has improved by 15%. Team B shows the most significant improvement.",
      category: "improvement",
      timeframe: "This week",
    },
    {
      title: "Ticket Backlog Alert",
      description: "Billing-related tickets are accumulating faster than they're being resolved. Consider assigning more resources.",
      category: "anomaly",
      timeframe: "Last 7 days",
    },
    {
      title: "Customer Satisfaction Opportunity",
      description: "CSAT for feature requests is 12% higher than other categories. Consider expanding feature-related documentation.",
      category: "action",
      timeframe: "This month",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Key Insights</h3>
          <p className="text-sm text-muted-foreground">AI-powered insights from your support data</p>
        </div>
        <Button variant="outline" size="sm">
          View All Insights
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>
    </div>
  );
} 