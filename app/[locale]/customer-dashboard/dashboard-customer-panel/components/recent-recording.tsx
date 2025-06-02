"use client"

import { FileAudio, MoreHorizontal, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const recordings = [
  {
    id: "rec-001",
    title: "Customer Support Call #1234",
    date: "2023-05-15",
    duration: "4:32",
    agent: "John Smith",
    sentiment: "positive",
  },
  {
    id: "rec-002",
    title: "Technical Support #5678",
    date: "2023-05-14",
    duration: "8:15",
    agent: "Sarah Johnson",
    sentiment: "neutral",
  },
  {
    id: "rec-003",
    title: "Billing Inquiry #9012",
    date: "2023-05-13",
    duration: "3:45",
    agent: "Michael Brown",
    sentiment: "negative",
  },
  {
    id: "rec-004",
    title: "Sales Call #3456",
    date: "2023-05-12",
    duration: "6:20",
    agent: "Emily Davis",
    sentiment: "positive",
  },
]

export function RecentRecordings() {
  return (
    <div className="space-y-4">
      {recordings.map((recording) => (
        <div key={recording.id} className="flex items-center justify-between space-x-4 rounded-md border p-3">
          <div className="flex items-center space-x-4">
            <div className="rounded-md bg-primary/10 p-2">
              <FileAudio className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{recording.title}</p>
              <div className="flex items-center pt-1">
                <p className="text-xs text-muted-foreground">
                  {recording.date} • {recording.duration} • {recording.agent}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                recording.sentiment === "positive"
                  ? "default"
                  : recording.sentiment === "neutral"
                    ? "secondary"
                    : "destructive"
              }
            >
              {recording.sentiment}
            </Badge>
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
        </div>
      ))}
    </div>
  )
}
