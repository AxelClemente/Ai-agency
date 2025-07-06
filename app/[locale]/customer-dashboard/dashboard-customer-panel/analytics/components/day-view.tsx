"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DayViewProps {
  date: Date
  onBack: () => void
}

export default function DayView({ date, onBack }: DayViewProps) {
  // Generar las horas desde 9:00 AM hasta 12:00 AM (medianoche)
  const generateHours = () => {
    const hours = []
    for (let i = 9; i <= 23; i++) {
      const hour12 = i > 12 ? i - 12 : i === 0 ? 12 : i
      const ampm = i >= 12 ? "PM" : "AM"
      const displayHour = i === 12 ? 12 : hour12
      hours.push({
        hour24: i,
        display: `${displayHour}:00 ${ampm}`,
        time: `${i.toString().padStart(2, "0")}:00`,
      })
    }
    hours.push({
      hour24: 0,
      display: "12:00 AM",
      time: "00:00",
    })
    return hours
  }

  const hours = generateHours()
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const currentHour = today.getHours()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold capitalize">{formatDate(date)}</h2>
          {isToday && <p className="text-sm text-muted-foreground">Hoy</p>}
        </div>
      </div>
      {/* Horarios */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {hours.map((hour) => {
          const isPastHour = isToday && currentHour > hour.hour24
          const isCurrentHour = isToday && currentHour === hour.hour24
          return (
            <div
              key={hour.time}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-colors duration-200
                cursor-pointer hover:bg-muted/50
                ${isCurrentHour ? "bg-primary/10 border-primary/20" : "border-border"}
                ${isPastHour ? "opacity-60" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                  text-sm font-medium min-w-[70px]
                  ${isCurrentHour ? "text-primary" : "text-foreground"}
                `}
                >
                  {hour.display}
                </span>
                <div
                  className={`
                  h-px flex-1 
                  ${isCurrentHour ? "bg-primary/30" : "bg-border"}
                `}
                />
              </div>
              {isCurrentHour && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs text-primary font-medium">Ahora</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {/* Footer info */}
      <div className="mt-4 pt-4 border-t text-center">
        <p className="text-xs text-muted-foreground">Horario: 9:00 AM - 12:00 AM</p>
      </div>
    </Card>
  )
} 