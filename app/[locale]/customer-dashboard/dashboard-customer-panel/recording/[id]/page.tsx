import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart } from "../../components/charts"
import { DashboardHeader } from "../../components/dashboard-header"
import { ArrowLeft, Download, FileAudio, Play, Share2 } from "lucide-react"
import Link from "next/link"

export default async function RecordingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In a real app, you would fetch the recording data based on the ID
  const { id: recordingId } = await params;

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/recordings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Customer Support Call #1234</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <Badge variant="outline" className="w-fit">
              ID: {recordingId}
            </Badge>
            <Badge variant="outline" className="w-fit">
              May 15, 2023
            </Badge>
            <Badge variant="outline" className="w-fit">
              4:32
            </Badge>
            <Badge variant="outline" className="w-fit">
              John Smith
            </Badge>
            <Badge className="w-fit">Positive</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Audio Waveform</CardTitle>
            <CardDescription>Visual representation of the call recording</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted/50 rounded-md flex items-center justify-center">
              <FileAudio className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Audio waveform visualization</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="adherence">Adherence Analysis</TabsTrigger>
            <TabsTrigger value="agent">Agent Performance</TabsTrigger>
            <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Adherence Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+5% above average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agent Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.5/5</div>
                  <p className="text-xs text-muted-foreground">Top 15% of agents</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Positive</div>
                  <p className="text-xs text-muted-foreground">85% positive indicators</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Resolved</div>
                  <p className="text-xs text-muted-foreground">First call resolution</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Call Summary</CardTitle>
                <CardDescription>AI-generated summary of the call</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Customer called regarding an issue with their recent order #45678. The customer was concerned about a
                  delayed shipment. Agent John verified the customer&apos;s information and checked the order status. The
                  agent explained that the delay was due to a temporary warehouse issue and provided an updated delivery
                  estimate. The agent offered a 10% discount on the next order as compensation for the inconvenience.
                  The customer accepted the solution and expressed satisfaction with the resolution.
                </p>
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Key Points:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Order #45678 delayed shipment</li>
                    <li>Warehouse issue identified as cause</li>
                    <li>New delivery estimate provided</li>
                    <li>10% discount offered as compensation</li>
                    <li>Customer satisfied with resolution</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adherence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Script Adherence Analysis</CardTitle>
                <CardDescription>Detailed breakdown of script adherence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Overall Adherence</h4>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Section Breakdown</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Introduction</span>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Verification</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Problem Identification</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Solution Presentation</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Closing</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Deviation Points</h4>
                  <div className="space-y-3">
                    <div className="rounded-md border p-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">1:45</span>
                        <Badge variant="outline">Minor</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Agent skipped asking if customer had contacted support previously about this issue.
                      </p>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">3:12</span>
                        <Badge variant="outline">Minor</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Agent used slightly different wording when explaining company policy.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adherence Trends</CardTitle>
                <CardDescription>Historical adherence performance</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for this call</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Communication Clarity</h4>
                      <span className="text-sm font-medium">4.5/5</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Problem Solving</h4>
                      <span className="text-sm font-medium">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Empathy</h4>
                      <span className="text-sm font-medium">4.2/5</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Product Knowledge</h4>
                      <span className="text-sm font-medium">4.7/5</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Resolution Efficiency</h4>
                      <span className="text-sm font-medium">4.5/5</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agent Improvement Areas</CardTitle>
                  <CardDescription>Suggested areas for improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-3">
                    <h4 className="text-sm font-medium">Empathy Expression</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Agent could improve on expressing empathy when customer mentioned frustration with the delay.
                      Consider using more empathetic language like &quot;I understand how frustrating this must be for you.&quot;
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <h4 className="text-sm font-medium">Proactive Information</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Agent could have proactively offered order tracking information without the customer having to ask
                      for it.
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <h4 className="text-sm font-medium">Call Control</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Agent allowed some tangential conversation that extended call time. Gentle redirection techniques
                      could improve efficiency.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Agent Performance Trend</CardTitle>
                <CardDescription>Performance metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Sentiment Analysis</CardTitle>
                  <CardDescription>Emotional analysis throughout the call</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart />
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Sentiment Breakdown</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-md bg-green-100 dark:bg-green-900/20 p-2">
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">Positive</span>
                          <p className="text-2xl font-bold text-green-700 dark:text-green-300">65%</p>
                        </div>
                        <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2">
                          <span className="text-sm font-medium">Neutral</span>
                          <p className="text-2xl font-bold">25%</p>
                        </div>
                        <div className="rounded-md bg-red-100 dark:bg-red-900/20 p-2">
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">Negative</span>
                          <p className="text-2xl font-bold text-red-700 dark:text-red-300">10%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Concerns</CardTitle>
                  <CardDescription>Key issues raised by the customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-3">
                      <h4 className="text-sm font-medium">Delivery Delay</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Primary concern was about the delayed shipment of order #45678. Customer expressed frustration
                        about lack of communication regarding the delay.
                      </p>
                    </div>
                    <div className="rounded-md border p-3">
                      <h4 className="text-sm font-medium">Delivery Timeline</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Customer was concerned about when they would receive their order, as they needed the items for
                        an upcoming event.
                      </p>
                    </div>
                    <div className="rounded-md border p-3">
                      <h4 className="text-sm font-medium">Compensation</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Customer inquired about possible compensation for the inconvenience caused by the delay.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction Indicators</CardTitle>
                <CardDescription>Factors affecting customer satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Transcript</CardTitle>
                <CardDescription>Full transcript with timestamps and speaker identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:00</div>
                    <div className="flex-1">
                      <p className="font-medium">Agent (John)</p>
                      <p className="text-sm">
                        Thank you for calling customer support. My name is John. How may I assist you today?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:08</div>
                    <div className="flex-1">
                      <p className="font-medium">Customer</p>
                      <p className="text-sm">
                        Hi, I&apos;m calling about my order. It was supposed to arrive yesterday, but I still haven&apos;t
                        received it.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:15</div>
                    <div className="flex-1">
                      <p className="font-medium">Agent (John)</p>
                      <p className="text-sm">
                        I&apos;m sorry to hear that. I&apos;d be happy to look into this for you. May I have your order number,
                        please?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:22</div>
                    <div className="flex-1">
                      <p className="font-medium">Customer</p>
                      <p className="text-sm">Yes, it&apos;s 45678.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:25</div>
                    <div className="flex-1">
                      <p className="font-medium">Agent (John)</p>
                      <p className="text-sm">
                        Thank you. And could you please verify your email address on the account?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:30</div>
                    <div className="flex-1">
                      <p className="font-medium">Customer</p>
                      <p className="text-sm">It&apos;s customer@example.com</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:34</div>
                    <div className="flex-1">
                      <p className="font-medium">Agent (John)</p>
                      <p className="text-sm">
                        Perfect, I&apos;ve located your order. Let me check the status for you... I see that there was a
                        delay at our warehouse. I apologize for the inconvenience.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:50</div>
                    <div className="flex-1">
                      <p className="font-medium">Customer</p>
                      <p className="text-sm">That&apos;s frustrating. I needed those items for this weekend.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">0:55</div>
                    <div className="flex-1">
                      <p className="font-medium">Agent (John)</p>
                      <p className="text-sm">
                        I understand your frustration. According to our system, your order has been shipped and should
                        arrive by tomorrow. Would you like me to send you the tracking information?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 shrink-0 text-sm text-muted-foreground">1:10</div>
                    <div className="flex-1">
                      <p className="font-medium">Customer</p>
                      <p className="text-sm">Yes, please.</p>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground py-2">[Transcript continues...]</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
