"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceMetricsProps {
  className?: string;
}

const data = [
  { name: "Jan", newTickets: 45, resolvedTickets: 38, responseTime: 4.2 },
  { name: "Feb", newTickets: 52, resolvedTickets: 48, responseTime: 3.8 },
  { name: "Mar", newTickets: 48, resolvedTickets: 45, responseTime: 3.5 },
  { name: "Apr", newTickets: 70, resolvedTickets: 65, responseTime: 3.2 },
  { name: "May", newTickets: 95, resolvedTickets: 90, responseTime: 2.8 },
  { name: "Jun", newTickets: 78, resolvedTickets: 82, responseTime: 2.5 },
  { name: "Jul", newTickets: 92, resolvedTickets: 88, responseTime: 2.3 },
  { name: "Aug", newTickets: 85, resolvedTickets: 87, responseTime: 2.2 },
  { name: "Sep", newTickets: 110, resolvedTickets: 105, responseTime: 2.0 },
  { name: "Oct", newTickets: 115, resolvedTickets: 118, responseTime: 1.8 },
  { name: "Nov", newTickets: 102, resolvedTickets: 108, responseTime: 1.5 },
  { name: "Dec", newTickets: 108, resolvedTickets: 112, responseTime: 1.2 },
];

const categoryData = [
  { name: "Bug Report", value: 35 },
  { name: "Feature Request", value: 25 },
  { name: "Account Issue", value: 18 },
  { name: "Billing Query", value: 15 },
  { name: "General Question", value: 7 },
];

export function PerformanceMetrics({ className }: PerformanceMetricsProps) {
  const [activeTab, setActiveTab] = useState("ticket-volume");

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Track your support metrics over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ticket-volume" onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="ticket-volume" className="flex-1">
              Ticket Volume
            </TabsTrigger>
            <TabsTrigger value="response-time" className="flex-1">
              Response Time
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex-1">
              Categories
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ticket-volume">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newTickets"
                    name="New Tickets"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolvedTickets"
                    name="Resolved Tickets"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="response-time">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    name="Avg. Response Time (hrs)"
                    stroke="#1E88E5"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Ticket Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 