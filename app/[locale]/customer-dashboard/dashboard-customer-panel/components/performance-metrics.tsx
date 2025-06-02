"use client"

import { Progress } from "@/components/ui/progress"

const metrics = [
  {
    name: "Script Adherence",
    value: 87,
    target: 90,
    change: "+5%",
  },
  {
    name: "Customer Satisfaction",
    value: 84,
    target: 85,
    change: "+2%",
  },
  {
    name: "Call Resolution Rate",
    value: 92,
    target: 90,
    change: "+3%",
  },
  {
    name: "Average Handle Time",
    value: 78,
    target: 80,
    change: "-4%",
  },
]

export function PerformanceMetrics() {
  return (
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{metric.name}</p>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target}% • Change: {metric.change}
              </p>
            </div>
            <div className="text-sm font-medium">{metric.value}%</div>
          </div>
          <Progress value={metric.value} className="h-2" />
        </div>
      ))}
    </div>
  )
}
