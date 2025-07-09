"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DayView from "./day-view"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

interface ReservationDetail {
  date: string // formato YYYY-MM-DD
  name?: string
  time?: string
  people?: number
}

interface ReservationCalendarProps {
  reservas: { date: string; count: number; reservas?: ReservationDetail[] }[]
  month?: Date // Opcional, para inicializar el mes
}

export default function ReservationCalendar({ reservas, month }: ReservationCalendarProps) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(month ?? new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Obtener el primer día del mes y cuántos días tiene
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Navegar entre meses
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Generar los días del calendario
  const generateCalendarDays = () => {
    const days = []
    // Días vacíos al inicio
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null)
    }
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }
  const calendarDays = generateCalendarDays()

  // Crear un mapa de reservas para acceso rápido
  const reservasMap: Record<string, { count: number; reservas?: ReservationDetail[] }> = {}
  reservas.forEach(r => { reservasMap[r.date] = { count: r.count, reservas: r.reservas } })

  // Verificar si un día es hoy
  const isToday = (day: number | null) => {
    if (!day) return false
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  // Obtener string YYYY-MM-DD para un día
  const getDateStr = (day: number) => {
    const m = (currentMonth + 1).toString().padStart(2, '0')
    const d = day.toString().padStart(2, '0')
    return `${currentYear}-${m}-${d}`
  }

  // Handler para seleccionar un día
  const handleDayClick = (day: number | null) => {
    if (!day) return
    setSelectedDay(new Date(currentYear, currentMonth, day))
  }

  // Handler para volver del DayView
  const handleBack = () => setSelectedDay(null)

  if (selectedDay) {
    // Obtener reservas del día seleccionado
    const dateStr = `${selectedDay.getFullYear()}-${(selectedDay.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.getDate().toString().padStart(2, '0')}`;
    const reservaInfo = reservasMap[dateStr] || { reservas: [] };
    return <DayView date={selectedDay} reservas={reservaInfo.reservas || []} onBack={handleBack} />;
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto p-4">
        {/* Header con navegación */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dateStr = day ? getDateStr(day) : ''
            const reservaInfo = reservasMap[dateStr]
            return (
              <div
                key={index}
                className={`
                  h-10 flex items-center justify-center text-sm rounded-md cursor-pointer
                  transition-colors duration-200 relative
                  ${day ? "hover:bg-muted" : ""}
                  ${isToday(day) ? "bg-primary text-primary-foreground font-semibold" : day ? "text-foreground" : ""}
                `}
                onClick={() => handleDayClick(day)}
              >
                {day && <span>{day}</span>}
                {/* Badge de reservas con tooltip */}
                {day && reservaInfo && reservaInfo.count > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="absolute -bottom-1 right-0 bg-blue-500 text-white text-xs rounded-full px-1 min-w-[18px] text-center cursor-pointer">
                        {reservaInfo.count}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="text-xs font-semibold mb-1">Reservas para este día:</div>
                      {reservaInfo.reservas && reservaInfo.reservas.length > 0 ? (
                        <ul className="space-y-1">
                          {reservaInfo.reservas.map((r, i) => (
                            <li key={i} className="border-b last:border-b-0 pb-1 last:pb-0">
                              <span className="font-medium">{r.name || 'Sin nombre'}</span> — {r.people || '?'} pers. — {r.time || 'Sin hora'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-muted-foreground">Sin detalles de reserva.</div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )
          })}
        </div>
        {/* Indicador del día actual */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Hoy: {today.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </Card>
    </TooltipProvider>
  )
} 