import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import { Droplets, Settings, Car } from "lucide-react"

// Simplified data without icons for now
const serviceData = [
  {
    service: "ITV",
    requests: 234,
    percentage: 27.6,
    conversionRate: 89.2,
    avgDuration: 3.1,
    revenue: "Alto",
    seasonality: "Marzo-Julio",
    urgency: "Alta",
    color: "bg-blue-500"
  },
  {
    service: "Neumáticos",
    requests: 198,
    percentage: 23.4,
    conversionRate: 71.7,
    avgDuration: 4.8,
    revenue: "Muy Alto",
    seasonality: "Nov-Feb",
    urgency: "Media",
    color: "bg-green-500"
  },
  {
    service: "Frenos",
    requests: 167,
    percentage: 19.7,
    conversionRate: 85.6,
    avgDuration: 5.2,
    revenue: "Alto",
    seasonality: "Todo el año",
    urgency: "Muy Alta",
    color: "bg-red-500"
  },
  {
    service: "Aceite",
    icon: Droplets,
    requests: 143,
    percentage: 16.9,
    conversionRate: 92.3,
    avgDuration: 2.7,
    revenue: "Medio",
    seasonality: "Todo el año",
    urgency: "Baja",
    color: "bg-yellow-500"
  },
  {
    service: "Dirección",
    icon: Car,
    requests: 67,
    percentage: 7.9,
    conversionRate: 76.1,
    avgDuration: 4.3,
    revenue: "Alto",
    seasonality: "Todo el año",
    urgency: "Media",
    color: "bg-purple-500"
  },
  {
    service: "Otros",
    icon: Settings,
    requests: 38,
    percentage: 4.5,
    conversionRate: 55.3,
    avgDuration: 6.1,
    revenue: "Variable",
    seasonality: "Todo el año",
    urgency: "Variable",
    color: "bg-gray-500"
  }
]

const getRevenueColor = (revenue: string) => {
  switch (revenue) {
    case "Muy Alto": return "bg-green-600 text-white"
    case "Alto": return "bg-green-500 text-white"
    case "Medio": return "bg-yellow-500 text-black"
    case "Variable": return "bg-gray-500 text-white"
    default: return "bg-gray-300 text-black"
  }
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "Muy Alta": return "bg-red-600 text-white"
    case "Alta": return "bg-red-500 text-white"
    case "Media": return "bg-yellow-500 text-black"
    case "Baja": return "bg-green-500 text-white"
    case "Variable": return "bg-gray-500 text-white"
    default: return "bg-gray-300 text-black"
  }
}

export function ServicePerformance() {
  const maxRequests = Math.max(...serviceData.map(s => s.requests))
  
  return (
    <div className="space-y-4">
      {/* Resumen de servicios */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Servicio Top</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ITV</div>
            <p className="text-xs text-muted-foreground">27.6% de todas las consultas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mayor Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aceite</div>
            <p className="text-xs text-muted-foreground">92.3% de tasa de conversión</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Más Urgente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Frenos</div>
            <p className="text-xs text-muted-foreground">Requiere atención inmediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla simplificada de servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado por Servicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceData.map((service, index) => (
            <div key={service.service} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              {/* Servicio */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${service.color} text-white w-8 h-8 flex items-center justify-center`}>
                  {service.service.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{service.service}</div>
                  <div className="text-sm text-muted-foreground">{service.requests} consultas</div>
                </div>
              </div>

              {/* Volumen */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Volumen</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(service.requests / maxRequests) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">{service.percentage}%</div>
              </div>

              {/* Conversión */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Conversión</div>
                <div className="text-lg font-bold">{service.conversionRate}%</div>
                <div className="text-xs text-muted-foreground">tasa de éxito</div>
              </div>

              {/* Revenue */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Revenue</div>
                <Badge className={getRevenueColor(service.revenue)}>{service.revenue}</Badge>
                <div className="text-xs text-muted-foreground">{service.seasonality}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Clave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-900">ITV es el motor del negocio</div>
            <div className="text-sm text-blue-700">Alta demanda estacional con excelente conversión.</div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-medium text-green-900">Aceite: conversión perfecta</div>
            <div className="text-sm text-green-700">92.3% de conversión pero bajo revenue.</div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="font-medium text-red-900">Frenos: urgencia alta, revenue alto</div>
            <div className="text-sm text-red-700">Clientes motivados por seguridad.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 