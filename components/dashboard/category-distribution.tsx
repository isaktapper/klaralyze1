"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];

const categoryData = [
  { name: "Technical Issue", value: 35 },
  { name: "Account Problem", value: 25 },
  { name: "Billing Question", value: 18 },
  { name: "Feature Request", value: 12 },
  { name: "Product Question", value: 10 },
];

const priorityData = [
  { name: "Low", value: 20 },
  { name: "Medium", value: 40 },
  { name: "High", value: 30 },
  { name: "Critical", value: 10 },
];

const channelData = [
  { name: "Email", value: 42 },
  { name: "Web Form", value: 28 },
  { name: "Chat", value: 15 },
  { name: "Phone", value: 10 },
  { name: "Social Media", value: 5 },
];

const trendData = [
  { name: "Jan", technical: 32, account: 22, billing: 15, feature: 10, product: 8 },
  { name: "Feb", technical: 30, account: 25, billing: 16, feature: 12, product: 9 },
  { name: "Mar", technical: 35, account: 23, billing: 18, feature: 11, product: 8 },
  { name: "Apr", technical: 38, account: 24, billing: 17, feature: 10, product: 9 },
  { name: "May", technical: 35, account: 26, billing: 18, feature: 12, product: 10 },
  { name: "Jun", technical: 32, account: 28, billing: 19, feature: 13, product: 11 },
];

export function CategoryDistribution() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ticket Categories</CardTitle>
          <CardDescription>Distribution of support tickets by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Priority</CardTitle>
          <CardDescription>Distribution of support tickets by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Channels</CardTitle>
          <CardDescription>Distribution of tickets by submission channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Trends</CardTitle>
          <CardDescription>Ticket categories over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendData}
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
                <Bar dataKey="technical" name="Technical Issue" stackId="a" fill="#0088FE" />
                <Bar dataKey="account" name="Account Problem" stackId="a" fill="#00C49F" />
                <Bar dataKey="billing" name="Billing Question" stackId="a" fill="#FFBB28" />
                <Bar dataKey="feature" name="Feature Request" stackId="a" fill="#FF8042" />
                <Bar dataKey="product" name="Product Question" stackId="a" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 