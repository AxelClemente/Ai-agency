import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Phone, Clock, Users, CheckCircle } from "lucide-react"

// Datos hardcodeados realistas para AutoBox Manacor
const automotiveMetrics = {
  totalCalls: 847,
  conversionRate: 68.4,
  conversionChange: +5.2,
  averageDuration: 4.2,
  durationChange: +0.3,
  abandonmentRate: 23.1,
  abandonmentChange: -2.8,
  appointmentsScheduled: 579,
  appointmentChange: +12.4,
  topService: "ITV",
  topServicePercentage: 27.6,
  customerSatisfaction: 87.3,
  satisfactionChange: +3.1
}

export function AutomotiveMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Llamadas</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{automotiveMetrics.totalCalls.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Últimos 90 días
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{automotiveMetrics.conversionRate}%</div>
          <div className="flex items-center text-xs">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+{automotiveMetrics.conversionChange}%</span>
            <span className="text-muted-foreground ml-1">vs mes anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Duración Promedio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{automotiveMetrics.averageDuration} min</div>
          <div className="flex items-center text-xs">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+{automotiveMetrics.durationChange} min</span>
            <span className="text-muted-foreground ml-1">conversaciones más completas</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Citas Agendadas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{automotiveMetrics.appointmentsScheduled}</div>
          <div className="flex items-center text-xs">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+{automotiveMetrics.appointmentChange}%</span>
            <span className="text-muted-foreground ml-1">vs mes anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Servicio Más Demandado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{automotiveMetrics.topService}</div>
            <Badge variant="secondary">{automotiveMetrics.topServicePercentage}% del total</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Las inspecciones ITV dominan las consultas, especialmente en temporada alta
          </p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Abandono</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-2xl font-bold">{automotiveMetrics.abandonmentRate}%</div>
              <div className="flex items-center text-xs">
                <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">{automotiveMetrics.abandonmentChange}%</span>
                <span className="text-muted-foreground ml-1">mejora continua</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Principales motivos: Precio (45%), Disponibilidad (28%), Ubicación (18%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 