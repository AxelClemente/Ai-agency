import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "../../components/dashboard-header"
import { AutomotiveMetrics } from "../components/automotive/automotive-metrics"
import { ServicePerformance } from "../components/automotive/service-performance"
import { CustomerIntent } from "../components/automotive/customer-intent"
import { AutomotiveCharts } from "../components/automotive/automotive-charts"
import { ArrowLeft, Car } from "lucide-react"
import Link from "next/link"

export default function AutomotiveAnalyticsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <Link href="/customer-dashboard/dashboard-customer-panel/analytics">
            <Button variant="outline" size="sm" className="w-full sm:w-auto mb-2 sm:mb-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Analytics General
            </Button>
          </Link>
          <div className="flex flex-col items-center sm:items-start w-full">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center space-x-2 text-center sm:text-left">
              <Car className="h-8 w-8 text-blue-600" />
              <span>AutoBox Manacor</span>
            </h2>
            <p className="text-muted-foreground text-center sm:text-left">
              Análisis completo de conversaciones del agente de voz especializado en servicios automotrices
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2 w-full mb-8 sm:flex-nowrap sm:mb-0">
            <TabsTrigger value="performance">Rendimiento de Conversaciones</TabsTrigger>
            <TabsTrigger value="services">Análisis de Servicios</TabsTrigger>
            <TabsTrigger value="intent">Intención del Cliente</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <AutomotiveMetrics />
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tasa de Conversión por Día</CardTitle>
                  <CardDescription>Porcentaje de llamadas que resultan en citas agendadas</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <AutomotiveCharts type="conversion" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Puntos de Abandono</CardTitle>
                  <CardDescription>Momentos más comunes donde los clientes abandonan la conversación</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutomotiveCharts type="abandonment" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <ServicePerformance />
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Servicios Más Solicitados</CardTitle>
                  <CardDescription>Distribución de servicios consultados por los clientes</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <AutomotiveCharts type="services" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Conversión por Tipo de Servicio</CardTitle>
                  <CardDescription>Efectividad del agente según el tipo de servicio solicitado</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutomotiveCharts type="serviceConversion" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="intent" className="space-y-4">
            <CustomerIntent />
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Intenciones</CardTitle>
                  <CardDescription>Qué buscan los clientes cuando llaman a AutoBox</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <AutomotiveCharts type="intent" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Análisis de satisfacción y confianza del cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutomotiveCharts type="sentiment" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencias Estacionales</CardTitle>
                  <CardDescription>Patrones de demanda a lo largo del año</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <AutomotiveCharts type="seasonal" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Horarios de Mayor Demanda</CardTitle>
                  <CardDescription>Distribución de llamadas por día y hora</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutomotiveCharts type="schedule" />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Evolución Mensual de Métricas</CardTitle>
                <CardDescription>Rendimiento del agente a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AutomotiveCharts type="monthly" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 