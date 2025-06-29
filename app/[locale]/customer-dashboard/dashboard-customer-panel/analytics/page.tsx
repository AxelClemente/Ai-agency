import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "../components/charts"
import { DashboardHeader } from "../components/dashboard-header"
import { Car } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Tabs defaultValue="adherence" className="space-y-4">
          <TabsList>
            <TabsTrigger value="adherence">Adherence Analysis</TabsTrigger>
            <TabsTrigger value="agent">Agent Performance</TabsTrigger>
            <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="adherence" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Adherence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.5%</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Adherence Issue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Script Deviation</div>
                  <p className="text-xs text-muted-foreground">35% of all issues</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12.3%</div>
                  <p className="text-xs text-muted-foreground">Quarter-over-quarter</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Adherence by Script Section</CardTitle>
                  <CardDescription>Breakdown of adherence by script section</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <BarChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Adherence Reasons</CardTitle>
                  <CardDescription>Common reasons for non-adherence</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="agent" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Emily Davis</div>
                  <p className="text-xs text-muted-foreground">94% adherence rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Michael Brown</div>
                  <p className="text-xs text-muted-foreground">68% adherence rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Improved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Sarah Johnson</div>
                  <p className="text-xs text-muted-foreground">+15% improvement</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Agent Performance Comparison</CardTitle>
                  <CardDescription>Performance metrics by agent</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <BarChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Agent Improvement Trends</CardTitle>
                  <CardDescription>Performance improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="customer" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Positive</div>
                  <p className="text-xs text-muted-foreground">65% of all calls</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Customer Issue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Billing Questions</div>
                  <p className="text-xs text-muted-foreground">28% of all calls</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+3% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Customer Sentiment Trends</CardTitle>
                  <CardDescription>Sentiment analysis over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Customer Issues</CardTitle>
                  <CardDescription>Distribution of customer issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Call Volume Trends</CardTitle>
                  <CardDescription>Call volume over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Performance Metrics Over Time</CardTitle>
                  <CardDescription>Key metrics trending</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Comparison</CardTitle>
                <CardDescription>Performance comparison by quarter</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
