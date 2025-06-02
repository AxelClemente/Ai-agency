import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "../components/dashboard-header"
import { Download, Search, SlidersHorizontal, UserPlus, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Helper function para determinar el variant del badge
function getAdherenceBadgeVariant(adherence: number): "default" | "destructive" | "outline" | "secondary" {
  if (adherence >= 90) return "default"
  if (adherence >= 75) return "secondary"
  return "destructive"
}

export default function AgentsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search agents..."
                className="w-[200px] lg:w-[300px] pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.5%</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Emily Davis</div>
              <p className="text-xs text-muted-foreground">
                94% adherence rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Michael Brown</div>
              <p className="text-xs text-muted-foreground">
                68% adherence rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell className="font-medium">Role</TableCell>
                  <TableCell className="font-medium">Adherence</TableCell>
                  <TableCell className="font-medium">Calls</TableCell>
                  <TableCell className="font-medium">Avg. Rating</TableCell>
                  <TableCell className="text-right font-medium">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{agent.role}</TableCell>
                    <TableCell>
                      <Badge variant={getAdherenceBadgeVariant(agent.adherence)}>
                        {agent.adherence}%
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.calls}</TableCell>
                    <TableCell>{agent.rating}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const agents = [
  {
    id: 1,
    name: "Emily Davis",
    role: "Senior Agent",
    adherence: 94,
    calls: 156,
    rating: 4.8
  },
  // Add more agents...
]
