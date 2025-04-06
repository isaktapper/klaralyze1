'use client';

import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrequentInsights } from "@/components/dashboard/frequent-insights";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  MessageSquare,
  Clock,
  CheckCircle,
  RefreshCcw,
  Plus
} from "lucide-react";
import { useAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ZendeskConnectModal } from '@/components/dashboard/zendesk-connect-modal';

export default function InsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const hasZendeskConnection = user?.user_metadata?.zendesk_connected || false;
  const [showZendeskModal, setShowZendeskModal] = useState(false);

  if (!hasZendeskConnection) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">Insights Dashboard</h2>
            <p className="text-muted-foreground">
              AI-powered insights and recommendations from your support data
            </p>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <p className="text-lg font-medium text-muted-foreground">No data available</p>
              <p className="text-sm text-muted-foreground text-center">
                Connect your Zendesk account to view AI-powered insights and recommendations
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
      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">Insights Dashboard</h2>
          <p className="text-muted-foreground">
            AI-powered insights and recommendations from your support data
          </p>
        </div>
        
        <FrequentInsights />
        
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <TrendCard 
                title="Technical Issue Growth" 
                description="Technical issues have grown by 27% month-over-month, primarily in authentication and account management."
                change={27}
                positive={false}
                icon={MessageSquare}
                metric="Technical Issues"
                value="472"
                period="April 2023"
              />
              
              <TrendCard 
                title="Response Time Improvement" 
                description="Average first response time has decreased to 1.2 hours, an improvement of 15% from last month."
                change={15}
                positive={true}
                icon={Clock}
                metric="Avg. Response Time"
                value="1.2 hrs"
                period="April 2023"
              />
              
              <TrendCard 
                title="Resolution Rate Increase" 
                description="Ticket resolution rate has improved to 96.8%, up 2.3% from previous month."
                change={2.3}
                positive={true}
                icon={CheckCircle}
                metric="Resolution Rate"
                value="96.8%"
                period="April 2023"
              />
              
              <TrendCard 
                title="Feature Request Volume" 
                description="Feature requests have increased by 18% this month, with UI/UX improvements being the most requested."
                change={18}
                positive={false}
                icon={MessageSquare}
                metric="Feature Requests"
                value="214"
                period="April 2023"
              />
              
              <TrendCard 
                title="Customer Satisfaction" 
                description="CSAT scores have improved to 4.7/5.0, a 5% increase from last month."
                change={5}
                positive={true}
                icon={UserCheck}
                metric="CSAT Score"
                value="4.7/5.0"
                period="April 2023"
              />
              
              <TrendCard 
                title="Ticket Backlog" 
                description="The backlog has decreased by 12% due to improved team efficiency and resource allocation."
                change={12}
                positive={true}
                icon={RefreshCcw}
                metric="Backlog Tickets"
                value="187"
                period="April 2023"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="anomalies" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <AnomalyCard 
                title="Unusual Spike in Login Issues" 
                description="Login-related tickets have spiked 320% in the last 48 hours, significantly above the expected threshold."
                severity="high"
                timestamp="Detected 2 hours ago"
                affectedArea="Authentication"
                suggestedAction="Investigate recent deployments or infrastructure changes that might affect authentication services."
              />
              
              <AnomalyCard 
                title="Payment Processing Tickets" 
                description="Payment-related tickets have increased 85% above normal levels for this day of week."
                severity="medium"
                timestamp="Detected 5 hours ago"
                affectedArea="Billing"
                suggestedAction="Check payment gateway status and investigate recent updates to payment processing flow."
              />
              
              <AnomalyCard 
                title="Mobile App Rating Drop" 
                description="Mobile app satisfaction has dropped 32% below the 30-day average."
                severity="medium"
                timestamp="Detected 12 hours ago"
                affectedArea="Mobile Experience"
                suggestedAction="Review recent mobile app updates and user feedback for potential usability issues."
              />
              
              <AnomalyCard 
                title="Team C Response Time Increase" 
                description="Support Team C's average response time has increased 78% compared to their usual performance."
                severity="low"
                timestamp="Detected 1 day ago"
                affectedArea="Support Team Performance"
                suggestedAction="Check team workload and scheduling to ensure proper resource allocation."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RecommendationCard 
                title="Improve Authentication Docs" 
                description="Based on the increase in login-related tickets, consider updating authentication documentation with more detailed troubleshooting steps."
                impact="high"
                difficulty="medium"
                expectedOutcome="25-30% reduction in authentication-related support tickets"
              />
              
              <RecommendationCard 
                title="Additional Mobile App Resources" 
                description="Allocate additional developers to address mobile app issues based on decreasing satisfaction scores."
                impact="high"
                difficulty="high"
                expectedOutcome="15-20% improvement in mobile app CSAT scores"
              />
              
              <RecommendationCard 
                title="Implement Chatbot for Billing FAQ" 
                description="Deploy an AI chatbot to handle common billing questions that currently account for 35% of all billing tickets."
                impact="medium"
                difficulty="medium"
                expectedOutcome="40-50% reduction in basic billing inquiries"
              />
              
              <RecommendationCard 
                title="Knowledge Base Enhancement" 
                description="Expand the knowledge base with articles addressing the top 10 most common support issues from the last quarter."
                impact="medium"
                difficulty="low"
                expectedOutcome="15-25% reduction in tickets for common issues"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

interface TrendCardProps {
  title: string;
  description: string;
  change: number;
  positive: boolean;
  icon: React.ElementType;
  metric: string;
  value: string;
  period: string;
}

function TrendCard({ title, description, change, positive, icon: Icon, metric, value, period }: TrendCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant={positive ? "outline" : "secondary"} className="mb-2">
            {positive ? (
              <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1 text-amber-500" />
            )}
            {change}% {positive ? "improvement" : "change"}
          </Badge>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{metric}</span>
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-xs text-muted-foreground mt-1">{period}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface AnomalyCardProps {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
  affectedArea: string;
  suggestedAction: string;
}

function AnomalyCard({ title, description, severity, timestamp, affectedArea, suggestedAction }: AnomalyCardProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case "high": return "text-red-500 bg-red-50";
      case "medium": return "text-amber-500 bg-amber-50";
      case "low": return "text-blue-500 bg-blue-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor()}`}>
            {severity} severity
          </div>
          <div className="text-xs text-muted-foreground">
            {timestamp}
          </div>
        </div>
        <CardTitle className="text-base mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium">Affected Area:</span>
            <span className="text-sm ml-2">{affectedArea}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Suggested Action:</span>
            <p className="text-sm text-muted-foreground mt-1">{suggestedAction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecommendationCardProps {
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  difficulty: "low" | "medium" | "high";
  expectedOutcome: string;
}

function RecommendationCard({ title, description, impact, difficulty, expectedOutcome }: RecommendationCardProps) {
  const getImpactColor = () => {
    switch (impact) {
      case "high": return "text-emerald-500 bg-emerald-50";
      case "medium": return "text-blue-500 bg-blue-50";
      case "low": return "text-gray-500 bg-gray-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "high": return "text-red-500 bg-red-50";
      case "medium": return "text-amber-500 bg-amber-50";
      case "low": return "text-emerald-500 bg-emerald-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex space-x-2">
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${getImpactColor()}`}>
              {impact} impact
            </div>
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor()}`}>
              {difficulty} effort
            </div>
          </div>
          <Lightbulb className="h-4 w-4 text-amber-500" />
        </div>
        <CardTitle className="text-base mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <span className="text-sm font-medium">Expected Outcome:</span>
          <p className="text-sm text-muted-foreground mt-1">{expectedOutcome}</p>
        </div>
      </CardContent>
    </Card>
  );
} 