import DashboardLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "@/components/dashboard/overview-metrics";
import { CategoryDistribution } from "@/components/dashboard/category-distribution";
import { ResponseTimes } from "@/components/dashboard/response-times";
import { SatisfactionScore } from "@/components/dashboard/satisfaction-score";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
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