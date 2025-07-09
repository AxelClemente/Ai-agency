"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReservationDetail {
  name?: string;
  time?: string;
  people?: number;
  contact?: string;
  notes?: string;
  source?: string;
}

interface DayViewProps {
  date: Date;
  reservas: ReservationDetail[];
  onBack: () => void;
}

export default function DayView({ date, reservas, onBack }: DayViewProps) {
  // Generar las horas desde 9:00 AM hasta 12:00 AM (medianoche) en intervalos de 30 minutos
  const generateHalfHours = () => {
    const hours = [];
    for (let i = 9; i <= 23; i++) {
      for (let m = 0; m < 60; m += 30) {
        const hour12 = i > 12 ? i - 12 : i === 0 ? 12 : i;
        const ampm = i >= 12 ? "PM" : "AM";
        const displayHour = i === 12 ? 12 : hour12;
        const minStr = m === 0 ? "00" : "30";
        hours.push({
          hour24: i,
          minute: m,
          display: `${displayHour}:${minStr} ${ampm}`,
          time: `${i.toString().padStart(2, "0")}:${minStr}`,
        });
      }
    }
    // 12:00 AM
    hours.push({
      hour24: 0,
      minute: 0,
      display: "12:00 AM",
      time: "00:00",
    });
    return hours;
  };

  const hours = generateHalfHours();
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

  // Agrupar reservas por hora y minuto (HH:MM)
  const reservasPorHora: Record<string, ReservationDetail[]> = {};
  reservas.forEach(r => {
    if (r.time) {
      if (!reservasPorHora[r.time]) reservasPorHora[r.time] = [];
      reservasPorHora[r.time].push(r);
    }
  });

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
      {/* Horarios con reservas */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {hours.map((hour) => {
          const isPastHour = isToday && (currentHour > hour.hour24 || (currentHour === hour.hour24 && today.getMinutes() > hour.minute));
          const isCurrentHour = isToday && currentHour === hour.hour24 && today.getMinutes() >= hour.minute && today.getMinutes() < hour.minute + 30;
          const reservasEnHora = reservasPorHora[hour.time] || [];
          const hasReserva = reservasEnHora.length > 0;
          return (
            <div
              key={hour.time}
              className={`
                flex flex-col p-3 rounded-lg border transition-colors duration-200
                cursor-pointer
                ${hasReserva ? "bg-blue-100 border-blue-400" : isCurrentHour ? "bg-primary/10 border-primary/20" : "border-border"}
                ${isPastHour ? "opacity-60" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                  text-sm font-medium min-w-[70px]
                  ${isCurrentHour ? "text-primary" : hasReserva ? "text-blue-900" : "text-foreground"}
                `}
                >
                  {hour.display}
                </span>
                <div
                  className={`
                  h-px flex-1 
                  ${isCurrentHour ? "bg-primary/30" : hasReserva ? "bg-blue-300" : "bg-border"}
                `}
                />
                {isCurrentHour && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-primary font-medium">Ahora</span>
                  </div>
                )}
              </div>
              {/* Mostrar reservas de esta hora */}
              {hasReserva && (
                <ul className="mt-1 space-y-1">
                  {reservasEnHora.map((r, i) => (
                    <li key={i} className="text-xs pl-2 border-l-2 border-blue-500">
                      <span className="font-medium">{r.name || 'Sin nombre'}</span> — {r.people || '?'} pers. {r.source && (
                        <span className="ml-1 text-[10px] text-muted-foreground">({r.source})</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      {/* Footer info */}
      <div className="mt-4 pt-4 border-t text-center">
        <p className="text-xs text-muted-foreground">Horario: 9:00 AM - 12:00 AM</p>
      </div>
    </Card>
  );
} 