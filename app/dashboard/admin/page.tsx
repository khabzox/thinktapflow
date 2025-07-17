"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  TrendingUp,
  AlertTriangle,
  Server,
  Activity,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Eye,
  UserCheck,
  UserX,
  Database,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Admin-specific sample data
const systemMetrics = [
  { month: "Jan", users: 1200, revenue: 24000, generations: 45000 },
  { month: "Feb", users: 1450, revenue: 29000, generations: 67000 },
  { month: "Mar", users: 1680, revenue: 33600, generations: 89000 },
  { month: "Apr", users: 1920, revenue: 38400, generations: 112000 },
  { month: "May", users: 2180, revenue: 43600, generations: 134000 },
  { month: "Jun", users: 2450, revenue: 49000, generations: 156000 },
];

const userActivity = [
  { time: "00:00", active: 120 },
  { time: "04:00", active: 80 },
  { time: "08:00", active: 450 },
  { time: "12:00", active: 680 },
  { time: "16:00", active: 520 },
  { time: "20:00", active: 340 },
];

const recentAlerts = [
  {
    id: 1,
    type: "warning",
    message: "High API usage detected - 95% of daily limit",
    time: "5 minutes ago",
    severity: "high",
  },
  {
    id: 2,
    type: "info",
    message: "New user registration spike: +15% today",
    time: "1 hour ago",
    severity: "medium",
  },
  {
    id: 3,
    type: "error",
    message: "Content moderation queue requires attention",
    time: "2 hours ago",
    severity: "high",
  },
];

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
  generations: {
    label: "Generations",
    color: "hsl(var(--chart-3))",
  },
  active: {
    label: "Active Users",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Admin Dashboard Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              System Administration
            </h1>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-lg text-muted-foreground">
            Monitor system health, user activity, and platform performance.
          </p>
        </div>

        {/* Admin-focused Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100/50 transition-all duration-300 hover:shadow-lg dark:from-red-950/50 dark:to-red-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                Total Users
              </CardTitle>
              <div className="rounded-lg bg-red-500/10 p-2">
                <Users className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">2,450</div>
              <div className="flex items-center text-sm">
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="font-medium text-green-600">+12%</span>
                <span className="ml-1 text-muted-foreground">this month</span>
              </div>
              <Progress value={85} className="mt-3 h-2" />
              <p className="mt-1 text-xs text-muted-foreground">85% growth target</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100/50 transition-all duration-300 hover:shadow-lg dark:from-green-950/50 dark:to-green-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Monthly Revenue
              </CardTitle>
              <div className="rounded-lg bg-green-500/10 p-2">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">$49.0K</div>
              <div className="flex items-center text-sm">
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="font-medium text-green-600">+18%</span>
                <span className="ml-1 text-muted-foreground">vs last month</span>
              </div>
              <Progress value={92} className="mt-3 h-2" />
              <p className="mt-1 text-xs text-muted-foreground">92% of target</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 transition-all duration-300 hover:shadow-lg dark:from-blue-950/50 dark:to-blue-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                System Load
              </CardTitle>
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Server className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">67%</div>
              <div className="flex items-center text-sm">
                <ArrowDown className="mr-1 h-3 w-3 text-green-500" />
                <span className="font-medium text-green-600">-5%</span>
                <span className="ml-1 text-muted-foreground">from yesterday</span>
              </div>
              <Progress value={67} className="mt-3 h-2" />
              <p className="mt-1 text-xs text-muted-foreground">Optimal range</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 transition-all duration-300 hover:shadow-lg dark:from-orange-950/50 dark:to-orange-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Active Issues
              </CardTitle>
              <div className="rounded-lg bg-orange-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">3</div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-orange-600">2 High Priority</span>
              </div>
              <Progress value={30} className="mt-3 h-2" />
              <p className="mt-1 text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Dashboard Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    Platform Growth
                  </CardTitle>
                  <CardDescription>Users, revenue, and content generation trends</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={systemMetrics}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-600" />
                    User Activity (24h)
                  </CardTitle>
                  <CardDescription>Active users throughout the day</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userActivity}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,847</div>
                  <p className="text-sm text-muted-foreground">Currently online</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserX className="h-5 w-5 text-red-600" />
                    Suspended Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-sm text-muted-foreground">Require review</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    New Signups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-sm text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Used</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Query Performance</span>
                      <span>Excellent</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-green-600" />
                    Server Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>System notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 rounded-lg border p-4 ${
                        alert.severity === "high"
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                          : alert.severity === "medium"
                            ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30"
                            : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                      }`}
                    >
                      <div
                        className={`mt-2 h-2 w-2 rounded-full ${
                          alert.severity === "high"
                            ? "bg-red-500"
                            : alert.severity === "medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                      <Badge
                        variant={alert.severity === "high" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
