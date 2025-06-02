"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "../components/dashboard-header"
import { FileAudio, Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setProgress(0)
    setUploading(false)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Upload Recording</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Upload Audio Recording</CardTitle>
              <CardDescription>Upload a call recording for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Audio File</Label>
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                  {!file ? (
                    <>
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="rounded-full bg-primary/10 p-4">
                          <FileAudio className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Drag and drop your audio file here or click to browse</p>
                          <p className="text-xs text-muted-foreground">Supports MP3, WAV, M4A up to 100MB</p>
                        </div>
                        <Input id="file" type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                        <Button variant="outline" onClick={() => document.getElementById("file")?.click()}>
                          Browse Files
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileAudio className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {uploading && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Recording Title</Label>
                <Input id="title" placeholder="Enter a title for this recording" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agent">Agent</Label>
                  <Select>
                    <SelectTrigger id="agent">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="michael-brown">Michael Brown</SelectItem>
                      <SelectItem value="emily-davis">Emily Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Call Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="technical-support">Technical Support</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Add any additional notes about this recording" rows={4} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleUpload} disabled={!file || uploading}>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Recording"}
              </Button>
            </CardFooter>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Analysis Options</CardTitle>
              <CardDescription>Configure how this recording will be analyzed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="script">Reference Script</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="script">
                    <SelectValue placeholder="Select script" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Customer Support Script</SelectItem>
                    <SelectItem value="technical">Technical Support Script</SelectItem>
                    <SelectItem value="sales">Sales Script</SelectItem>
                    <SelectItem value="billing">Billing Support Script</SelectItem>
                    <SelectItem value="none">No Script (General Analysis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="analysis-depth">Analysis Depth</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="analysis-depth">
                    <SelectValue placeholder="Select depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (Quick Analysis)</SelectItem>
                    <SelectItem value="standard">Standard (Recommended)</SelectItem>
                    <SelectItem value="deep">Deep (Detailed Analysis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="focus-areas">Focus Areas</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="focus-areas">
                    <SelectValue placeholder="Select focus areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="adherence">Script Adherence Only</SelectItem>
                    <SelectItem value="agent">Agent Performance Only</SelectItem>
                    <SelectItem value="customer">Customer Sentiment Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification">Notification</Label>
                <Select defaultValue="email">
                  <SelectTrigger id="notification">
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Notification</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="dashboard">Dashboard Only</SelectItem>
                    <SelectItem value="both">Email & Dashboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
