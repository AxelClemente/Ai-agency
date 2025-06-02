import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Download, FileAudio, Filter, MoreHorizontal, Play, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "../components/dashboard-header"

export default function RecordingsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Recordings</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search recordings..." className="w-[200px] lg:w-[300px] pl-8" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>All Recordings</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Customer Support</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Technical Support</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Sales Calls</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Billing Inquiries</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  View
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Date (Newest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Date (Oldest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Duration (Longest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Duration (Shortest first)</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recording</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Adherence</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recordings.map((recording) => (
                <TableRow key={recording.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileAudio className="h-4 w-4 text-primary" />
                      <span>{recording.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{recording.date}</TableCell>
                  <TableCell>{recording.duration}</TableCell>
                  <TableCell>{recording.agent}</TableCell>
                  <TableCell>
                    <Badge variant={getAdherenceBadgeVariant(recording.adherence)}>{recording.adherence}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        recording.sentiment === "Positive"
                          ? "default"
                          : recording.sentiment === "Neutral"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {recording.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Analysis</DropdownMenuItem>
                          <DropdownMenuItem>Download Recording</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function getAdherenceBadgeVariant(adherence: number) {
  if (adherence >= 90) return "default"
  if (adherence >= 75) return "secondary"
  return "destructive"
}

const recordings = [
  {
    id: "rec-001",
    title: "Customer Support Call #1234",
    date: "2023-05-15",
    duration: "4:32",
    agent: "John Smith",
    adherence: 92,
    sentiment: "Positive",
  },
  {
    id: "rec-002",
    title: "Technical Support #5678",
    date: "2023-05-14",
    duration: "8:15",
    agent: "Sarah Johnson",
    adherence: 85,
    sentiment: "Neutral",
  },
  {
    id: "rec-003",
    title: "Billing Inquiry #9012",
    date: "2023-05-13",
    duration: "3:45",
    agent: "Michael Brown",
    adherence: 68,
    sentiment: "Negative",
  },
  {
    id: "rec-004",
    title: "Sales Call #3456",
    date: "2023-05-12",
    duration: "6:20",
    agent: "Emily Davis",
    adherence: 94,
    sentiment: "Positive",
  },
  {
    id: "rec-005",
    title: "Customer Complaint #7890",
    date: "2023-05-11",
    duration: "5:45",
    agent: "David Wilson",
    adherence: 72,
    sentiment: "Negative",
  },
  {
    id: "rec-006",
    title: "Product Inquiry #2345",
    date: "2023-05-10",
    duration: "4:10",
    agent: "Jennifer Lee",
    adherence: 88,
    sentiment: "Neutral",
  },
  {
    id: "rec-007",
    title: "Technical Support #6789",
    date: "2023-05-09",
    duration: "7:30",
    agent: "Robert Taylor",
    adherence: 90,
    sentiment: "Positive",
  },
  {
    id: "rec-008",
    title: "Sales Follow-up #0123",
    date: "2023-05-08",
    duration: "3:25",
    agent: "Amanda Clark",
    adherence: 95,
    sentiment: "Positive",
  },
]
