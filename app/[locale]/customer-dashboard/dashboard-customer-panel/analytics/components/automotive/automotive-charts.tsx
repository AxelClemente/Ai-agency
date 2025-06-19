"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from "recharts"

// Datos para tasa de conversión por día
const conversionData = [
  { day: "Lun", conversions: 72.3, calls: 134 },
  { day: "Mar", conversions: 68.7, calls: 127 },
  { day: "Mié", conversions: 71.2, calls: 142 },
  { day: "Jue", conversions: 69.8, calls: 138 },
  { day: "Vie", conversions: 74.1, calls: 156 },
  { day: "Sáb", conversions: 65.4, calls: 89 },
  { day: "Dom", conversions: 58.2, calls: 61 }
]

// Datos para puntos de abandono
const abandonmentData = [
  { point: "Bienvenida", percentage: 5.2, stage: "Inicio" },
  { point: "Identificación Problema", percentage: 8.7, stage: "Diagnóstico" },
  { point: "Consulta Precios", percentage: 31.4, stage: "Información" },
  { point: "Disponibilidad Citas", percentage: 22.8, stage: "Agenda" },
  { point: "Proceso Reserva", percentage: 18.3, stage: "Cierre" },
  { point: "Confirmación Final", percentage: 13.6, stage: "Finalización" }
]

// Datos para servicios más solicitados
const servicesData = [
  { name: "ITV", value: 234, percentage: 27.6 },
  { name: "Neumáticos", value: 198, percentage: 23.4 },
  { name: "Frenos", value: 167, percentage: 19.7 },
  { name: "Aceite", value: 143, percentage: 16.9 },
  { name: "Dirección", value: 67, percentage: 7.9 },
  { name: "Otros", value: 38, percentage: 4.5 }
]

// Datos para conversión por tipo de servicio
const serviceConversionData = [
  { service: "Aceite", conversion: 92.3, urgency: "Baja", revenue: 180 },
  { service: "ITV", conversion: 89.2, urgency: "Alta", revenue: 45 },
  { service: "Frenos", conversion: 85.6, urgency: "Muy Alta", revenue: 420 },
  { service: "Dirección", conversion: 76.1, urgency: "Media", revenue: 350 },
  { service: "Neumáticos", conversion: 71.7, urgency: "Media", revenue: 480 },
  { service: "Otros", conversion: 55.3, urgency: "Variable", revenue: 280 }
]

// Datos para intenciones del cliente
const intentData = [
  { name: "Agendar Cita", value: 36.8, count: 312 },
  { name: "Consultar Precios", value: 34.1, count: 289 },
  { name: "Información General", value: 18.4, count: 156 },
  { name: "Urgencia/Emergencia", value: 7.9, count: 67 },
  { name: "Seguimiento", value: 2.7, count: 23 }
]

// Datos para análisis de sentimientos
const sentimentData = [
  { sentiment: "Muy Positivo", percentage: 23.4, color: "#22c55e" },
  { sentiment: "Positivo", percentage: 45.8, color: "#84cc16" },
  { sentiment: "Neutral", percentage: 19.7, color: "#facc15" },
  { sentiment: "Negativo", percentage: 8.9, color: "#f97316" },
  { sentiment: "Muy Negativo", percentage: 2.2, color: "#ef4444" }
]

// Datos para tendencias estacionales
const seasonalData = [
  { month: "Ene", itv: 12, neumaticos: 45, frenos: 23, aceite: 18 },
  { month: "Feb", itv: 15, neumaticos: 52, frenos: 25, aceite: 20 },
  { month: "Mar", itv: 78, neumaticos: 34, frenos: 28, aceite: 22 },
  { month: "Abr", itv: 92, neumaticos: 28, frenos: 31, aceite: 24 },
  { month: "May", itv: 87, neumaticos: 25, frenos: 29, aceite: 26 },
  { month: "Jun", itv: 94, neumaticos: 22, frenos: 33, aceite: 28 },
  { month: "Jul", itv: 89, neumaticos: 26, frenos: 35, aceite: 30 },
  { month: "Ago", itv: 45, neumaticos: 31, frenos: 32, aceite: 27 },
  { month: "Sep", itv: 32, neumaticos: 38, frenos: 29, aceite: 25 },
  { month: "Oct", itv: 28, neumaticos: 42, frenos: 27, aceite: 23 },
  { month: "Nov", itv: 34, neumaticos: 58, frenos: 24, aceite: 21 },
  { month: "Dec", itv: 38, neumaticos: 61, frenos: 26, aceite: 19 }
]

// Datos para horarios de demanda
const scheduleData = [
  { hour: "8:00", calls: 12, conversion: 85.3 },
  { hour: "9:00", calls: 24, conversion: 78.9 },
  { hour: "10:00", calls: 31, conversion: 73.2 },
  { hour: "11:00", calls: 28, conversion: 69.8 },
  { hour: "12:00", calls: 18, conversion: 65.4 },
  { hour: "13:00", calls: 8, conversion: 72.1 },
  { hour: "14:00", calls: 15, conversion: 76.8 },
  { hour: "15:00", calls: 29, conversion: 71.5 },
  { hour: "16:00", calls: 35, conversion: 74.2 },
  { hour: "17:00", calls: 42, conversion: 68.7 },
  { hour: "18:00", calls: 38, conversion: 66.3 },
  { hour: "19:00", calls: 22, conversion: 63.9 }
]

// Datos para evolución mensual
const monthlyData = [
  { month: "Ene", calls: 678, conversion: 64.2, satisfaction: 82.1, revenue: 28400 },
  { month: "Feb", calls: 723, conversion: 66.8, satisfaction: 84.3, revenue: 31200 },
  { month: "Mar", calls: 892, conversion: 71.3, satisfaction: 86.7, revenue: 42300 },
  { month: "Abr", calls: 945, conversion: 73.9, satisfaction: 88.2, revenue: 47800 },
  { month: "May", calls: 887, conversion: 72.1, satisfaction: 87.9, revenue: 44600 },
  { month: "Jun", calls: 934, conversion: 74.8, satisfaction: 89.1, revenue: 48900 },
  { month: "Jul", calls: 876, conversion: 71.7, satisfaction: 86.8, revenue: 43700 },
  { month: "Ago", calls: 812, conversion: 69.4, satisfaction: 85.6, revenue: 38900 },
  { month: "Sep", calls: 798, conversion: 68.1, satisfaction: 84.9, revenue: 37200 },
  { month: "Oct", calls: 834, conversion: 70.3, satisfaction: 86.2, revenue: 39800 },
  { month: "Nov", calls: 923, conversion: 73.6, satisfaction: 87.8, revenue: 45600 },
  { month: "Dec", calls: 847, conversion: 68.4, satisfaction: 85.3, revenue: 41100 }
]

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"
]

interface AutomotiveChartsProps {
  type: "conversion" | "abandonment" | "services" | "serviceConversion" | "intent" | "sentiment" | "seasonal" | "schedule" | "monthly"
}

export function AutomotiveCharts({ type }: AutomotiveChartsProps) {
  switch (type) {
    case "conversion":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === "conversions" ? `${value}%` : value,
                name === "conversions" ? "Conversión" : "Llamadas"
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="conversions" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      )

    case "abandonment":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={abandonmentData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="point" type="category" width={120} />
            <Tooltip formatter={(value) => [`${value}%`, "Abandono"]} />
            <Bar dataKey="percentage" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      )

    case "services":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={servicesData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percentage }) => `${name} ${percentage}%`}
            >
              {servicesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )

    case "serviceConversion":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={serviceConversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === "conversion" ? `${value}%` : `€${value}`,
                name === "conversion" ? "Conversión" : "Revenue Promedio"
              ]}
            />
            <Bar dataKey="conversion" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )

    case "intent":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={intentData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
            >
              {intentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
          </PieChart>
        </ResponsiveContainer>
      )

    case "sentiment":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={sentimentData}>
            <RadialBar
              dataKey="percentage"
              cornerRadius={10}
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </RadialBar>
            <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
            <Legend />
          </RadialBarChart>
        </ResponsiveContainer>
      )

    case "seasonal":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="itv" stroke="#3b82f6" name="ITV" />
            <Line type="monotone" dataKey="neumaticos" stroke="#10b981" name="Neumáticos" />
            <Line type="monotone" dataKey="frenos" stroke="#ef4444" name="Frenos" />
            <Line type="monotone" dataKey="aceite" stroke="#f59e0b" name="Aceite" />
          </LineChart>
        </ResponsiveContainer>
      )

    case "schedule":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={scheduleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === "calls" ? value : `${value}%`,
                name === "calls" ? "Llamadas" : "Conversión"
              ]}
            />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="calls" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.3}
              name="Llamadas"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="conversion" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Conversión %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )

    case "monthly":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                const nameStr = String(name);
                if (nameStr.includes("revenue")) return [`€${value}`, "Revenue"]
                if (nameStr.includes("conversion") || nameStr.includes("satisfaction")) return [`${value}%`, name]
                return [value, name]
              }}
            />
            <Legend />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="calls" 
              stroke="#3b82f6" 
              name="Llamadas" 
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="conversion" 
              stroke="#10b981" 
              name="Conversión %" 
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="satisfaction" 
              stroke="#f59e0b" 
              name="Satisfacción %" 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="revenue" 
              stroke="#ef4444" 
              name="Revenue €" 
            />
          </LineChart>
        </ResponsiveContainer>
      )

    default:
      return <div className="flex items-center justify-center h-[300px] text-muted-foreground">Chart type not found</div>
  }
} 