"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const monthlyResponseData = [
  { name: "Jan", firstResponse: 4.2, resolution: 36.5 },
  { name: "Feb", firstResponse: 3.8, resolution: 32.8 },
  { name: "Mar", firstResponse: 3.5, resolution: 30.2 },
  { name: "Apr", firstResponse: 3.2, resolution: 28.5 },
  { name: "May", firstResponse: 2.8, resolution: 25.0 },
  { name: "Jun", firstResponse: 2.5, resolution: 22.5 },
  { name: "Jul", firstResponse: 2.3, resolution: 20.8 },
  { name: "Aug", firstResponse: 2.2, resolution: 19.5 },
  { name: "Sep", firstResponse: 2.0, resolution: 18.2 },
  { name: "Oct", firstResponse: 1.8, resolution: 16.5 },
  { name: "Nov", firstResponse: 1.5, resolution: 15.2 },
  { name: "Dec", firstResponse: 1.2, resolution: 14.0 },
];

const priorityResponseData = [
  { name: "Critical", response: 0.5, resolution: 8.2 },
  { name: "High", response: 1.2, resolution: 12.5 },
  { name: "Medium", response: 3.5, resolution: 24.8 },
  { name: "Low", response: 8.2, resolution: 42.5 },
];

const timeOfDayData = [
  { name: "12 AM", response: 4.5 },
  { name: "2 AM", response: 4.2 },
  { name: "4 AM", response: 3.8 },
  { name: "6 AM", response: 3.5 },
  { name: "8 AM", response: 1.5 },
  { name: "10 AM", response: 1.2 },
  { name: "12 PM", response: 1.0 },
  { name: "2 PM", response: 1.2 },
  { name: "4 PM", response: 1.5 },
  { name: "6 PM", response: 2.0 },
  { name: "8 PM", response: 3.0 },
  { name: "10 PM", response: 4.0 },
];

const agentResponseData = [
  {
    name: "James Smith",
    firstResponse: 1.2,
    resolution: 14.5,
    satisfaction: 4.8,
    tickets: 350,
  },
  {
    name: "Olivia Brown",
    firstResponse: 1.4,
    resolution: 16.2,
    satisfaction: 4.5,
    tickets: 420,
  },
  {
    name: "Noah Williams",
    firstResponse: 2.1,
    resolution: 18.5,
    satisfaction: 4.2,
    tickets: 310,
  },
  {
    name: "Sophia Garcia",
    firstResponse: 1.0,
    resolution: 12.8,
    satisfaction: 4.9,
    tickets: 280,
  },
  {
    name: "William Taylor",
    firstResponse: 1.8,
    resolution: 15.5,
    satisfaction: 4.3,
    tickets: 380,
  },
];

const SLAData = [
  { subject: "First Response (1h)", A: 95, fullMark: 100 },
  { subject: "Technical (4h)", A: 88, fullMark: 100 },
  { subject: "Account (8h)", A: 92, fullMark: 100 },
  { subject: "Billing (4h)", A: 90, fullMark: 100 },
  { subject: "Feature Request (24h)", A: 98, fullMark: 100 },
  { subject: "Product Questions (12h)", A: 94, fullMark: 100 },
];

export function ResponseTimes() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Response Time Trends</CardTitle>
          <CardDescription>Average response and resolution times by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyResponseData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="firstResponse"
                  name="First Response Time (hrs)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="resolution"
                  name="Resolution Time (hrs)"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response by Priority</CardTitle>
          <CardDescription>Average response times by ticket priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityResponseData}
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
                <Bar dataKey="response" name="First Response (hrs)" fill="#8884d8" />
                <Bar dataKey="resolution" name="Resolution Time (hrs)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response by Time of Day</CardTitle>
          <CardDescription>How time of day affects response times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeOfDayData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="response"
                  name="First Response Time (hrs)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
          <CardDescription>Response time metrics by support agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Agent</th>
                  <th className="text-left p-2">Tickets</th>
                  <th className="text-left p-2">First Response</th>
                  <th className="text-left p-2">Resolution Time</th>
                  <th className="text-left p-2">CSAT</th>
                  <th className="text-left p-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {agentResponseData.map((agent) => (
                  <tr key={agent.name} className="border-b">
                    <td className="p-2 font-medium">{agent.name}</td>
                    <td className="p-2">{agent.tickets}</td>
                    <td className="p-2">{agent.firstResponse} hrs</td>
                    <td className="p-2">{agent.resolution} hrs</td>
                    <td className="p-2">{agent.satisfaction}/5.0</td>
                    <td className="p-2">
                      <Badge variant={agent.firstResponse < 1.5 ? "default" : "secondary"}>
                        {agent.firstResponse < 1.5 ? "Excellent" : "Good"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SLA Performance</CardTitle>
          <CardDescription>Service Level Agreement compliance by ticket type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={SLAData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="SLA Compliance %"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 