"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart, 
  Bar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const monthlyData = [
  { name: "Jan", newTickets: 420, resolvedTickets: 390, backlog: 30 },
  { name: "Feb", newTickets: 450, resolvedTickets: 420, backlog: 60 },
  { name: "Mar", newTickets: 480, resolvedTickets: 460, backlog: 80 },
  { name: "Apr", newTickets: 520, resolvedTickets: 500, backlog: 100 },
  { name: "May", newTickets: 600, resolvedTickets: 550, backlog: 150 },
  { name: "Jun", newTickets: 650, resolvedTickets: 630, backlog: 170 },
  { name: "Jul", newTickets: 700, resolvedTickets: 680, backlog: 190 },
  { name: "Aug", newTickets: 720, resolvedTickets: 720, backlog: 190 },
  { name: "Sep", newTickets: 780, resolvedTickets: 760, backlog: 210 },
  { name: "Oct", newTickets: 820, resolvedTickets: 800, backlog: 230 },
  { name: "Nov", newTickets: 780, resolvedTickets: 790, backlog: 220 },
  { name: "Dec", newTickets: 750, resolvedTickets: 770, backlog: 200 },
];

const teamPerformanceData = [
  { name: "Support Team A", ticketsResolved: 420, responseTime: 2.5, satisfactionScore: 4.2 },
  { name: "Support Team B", ticketsResolved: 350, responseTime: 3.1, satisfactionScore: 3.9 },
  { name: "Support Team C", ticketsResolved: 480, responseTime: 1.8, satisfactionScore: 4.5 },
  { name: "Support Team D", ticketsResolved: 290, responseTime: 4.2, satisfactionScore: 3.7 },
  { name: "Support Team E", ticketsResolved: 390, responseTime: 2.7, satisfactionScore: 4.0 },
];

export function OverviewMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Ticket Trends</CardTitle>
          <CardDescription>Monthly ticket volume and resolution trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="newTickets"
                  name="New Tickets"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="resolvedTickets"
                  name="Resolved Tickets"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Area
                  type="monotone"
                  dataKey="backlog"
                  name="Backlog"
                  stackId="3"
                  stroke="#ffc658"
                  fill="#ffc658"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Rate</CardTitle>
          <CardDescription>Ticket resolution efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">94.3%</div>
              <p className="text-sm text-muted-foreground mt-1">Average resolution rate</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium">96.8%</span>
              </div>
              <div className="bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2 w-[96.8%]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Last Month</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2 w-[94.2%]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Last Quarter</span>
                <span className="font-medium">92.5%</span>
              </div>
              <div className="bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2 w-[92.5%]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Support team metrics comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resolved">
            <TabsList className="mb-4">
              <TabsTrigger value="resolved">Tickets Resolved</TabsTrigger>
              <TabsTrigger value="response">Response Time</TabsTrigger>
              <TabsTrigger value="satisfaction">Satisfaction Score</TabsTrigger>
            </TabsList>
            <TabsContent value="resolved">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ticketsResolved" name="Tickets Resolved" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="response">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="responseTime" name="Avg. Response Time (hrs)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="satisfaction">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="satisfactionScore" name="Satisfaction Score (out of 5)" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 