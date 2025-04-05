'use client';

import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, BarChart3, PieChart, LineChart } from 'lucide-react';
import { cn } from "@/lib/utils";

const templates = [
  {
    id: 'standard',
    name: 'Standard Report',
    description: 'Basic overview of key metrics and performance indicators',
    icon: LayoutDashboard,
    features: ['Ticket Volume', 'Response Times', 'Customer Satisfaction', 'Team Performance'],
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Deep dive into support metrics and trends',
    icon: BarChart3,
    features: ['Trend Analysis', 'Forecasting', 'Custom Metrics', 'Comparative Analysis'],
  },
  {
    id: 'customer',
    name: 'Customer Insights',
    description: 'Focus on customer experience and satisfaction metrics',
    icon: PieChart,
    features: ['CSAT Scores', 'Customer Feedback', 'Sentiment Analysis', 'Retention Metrics'],
  },
  {
    id: 'performance',
    name: 'Performance Dashboard',
    description: 'Team and individual performance tracking',
    icon: LineChart,
    features: ['Agent Productivity', 'Resolution Rates', 'Quality Scores', 'Training Needs'],
  },
];

export default function DashboardsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('standard');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-3xl font-bold tracking-tight">Dashboards</h2>
              <p className="text-muted-foreground">
                Create and manage your custom dashboards
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Dashboard
            </Button>
          </div>

          {/* Templates */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "rounded-lg border bg-card p-6 cursor-pointer transition-all",
                  selectedTemplate === template.id
                    ? "border-blue-500 ring-2 ring-blue-500"
                    : "hover:border-blue-300"
                )}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <template.icon className="h-6 w-6 text-blue-500" />
                  <h3 className="font-semibold">{template.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                <ul className="space-y-2">
                  {template.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Preview */}
          {selectedTemplate && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">
                {templates.find(t => t.id === selectedTemplate)?.name} Preview
              </h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Dashboard preview will be shown here
                </p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
} 