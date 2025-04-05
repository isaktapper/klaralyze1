"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlySatisfactionData = [
  { name: "Jan", score: 4.2 },
  { name: "Feb", score: 4.3 },
  { name: "Mar", score: 4.1 },
  { name: "Apr", score: 4.4 },
  { name: "May", score: 4.5 },
  { name: "Jun", score: 4.6 },
  { name: "Jul", score: 4.7 },
  { name: "Aug", score: 4.6 },
  { name: "Sep", score: 4.8 },
  { name: "Oct", score: 4.7 },
  { name: "Nov", score: 4.9 },
  { name: "Dec", score: 4.8 },
];

const ratingDistributionData = [
  { name: "1 Star", value: 20 },
  { name: "2 Stars", value: 35 },
  { name: "3 Stars", value: 120 },
  { name: "4 Stars", value: 480 },
  { name: "5 Stars", value: 845 },
];

const COLORS = ["#ff0000", "#ff8042", "#ffbb28", "#00c49f", "#0088fe"];

const categorySatisfactionData = [
  { name: "Technical Issue", score: 4.2 },
  { name: "Account Problem", score: 4.1 },
  { name: "Billing Question", score: 3.9 },
  { name: "Feature Request", score: 4.5 },
  { name: "Product Question", score: 4.7 },
];

const verbatimFeedback = [
  {
    id: 1,
    ticketId: "TKT-7890",
    rating: 5,
    comment: "Support agent was extremely helpful and resolved my issue quickly. Outstanding service!",
    date: "2023-05-18",
  },
  {
    id: 2,
    ticketId: "TKT-7885",
    rating: 4,
    comment: "Good response time and solution worked well. Would have been 5 stars if first solution had worked.",
    date: "2023-05-16",
  },
  {
    id: 3,
    ticketId: "TKT-7878",
    rating: 5,
    comment: "James was extremely knowledgeable and patient. He explained everything clearly.",
    date: "2023-05-15",
  },
  {
    id: 4,
    ticketId: "TKT-7872",
    rating: 3,
    comment: "Issue was resolved but took longer than expected. Had to follow up multiple times.",
    date: "2023-05-14",
  },
  {
    id: 5,
    ticketId: "TKT-7863",
    rating: 5,
    comment: "Sophia provided exceptional service. She anticipated my needs and went above and beyond.",
    date: "2023-05-12",
  },
];

export function SatisfactionScore() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Customer Satisfaction Score</CardTitle>
            <CardDescription>Monthly CSAT trend over the past year</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-5xl font-bold">4.6</div>
            <div className="text-sm text-muted-foreground">
              <div className="font-medium">out of 5.0</div>
              <div>12-month average</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlySatisfactionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="CSAT Score (out of 5)"
                  stroke="#0088fe"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Distribution of customer satisfaction ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ratingDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ratings`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSAT by Ticket Category</CardTitle>
          <CardDescription>Satisfaction scores by ticket type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySatisfactionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="CSAT Score (out of 5)" fill="#0088fe" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Verbatim comments from customer satisfaction surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verbatimFeedback.map((feedback) => (
              <div key={feedback.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Ticket: {feedback.ticketId}</div>
                  <div className="flex items-center space-x-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{feedback.comment}</p>
                <div className="mt-2 text-xs text-muted-foreground text-right">
                  {feedback.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 