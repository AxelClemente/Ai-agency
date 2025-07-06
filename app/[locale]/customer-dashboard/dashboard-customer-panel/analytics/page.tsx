"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "../components/charts"
import { DashboardHeader } from "../components/dashboard-header"
import ReservationCalendar from "./components/reservation-calendar"

// Productos del menú (ejemplo, se puede expandir)
const PRODUCTOS = [
  "Napolitana", "Espinacas", "Fugazzeta", "Alonso", "Tartine", "Bufala", "Franzini", "Norma", "Fumé", "Marinara",
  "Posta", "Bryan", "Fugazzeta Rellena", "Calzone", "Margherita", "4 Quesos", "Capuleto", "Tomatana", "Mitad y Mitad",
  // Entrantes, postres, bebidas...
  "Fainá", "Provolone", "Tomates Quemados", "Ensalada de Burrata", "Parmigiana", "Tarta de Queso", "Tiramisú",
  "Cerveza", "Refrescos", "Agua"
]

// Mock de datos de ventas por producto (luego se conecta a datos reales)
const ventasProductos = PRODUCTOS.map((nombre, i) => ({ name: nombre, value: Math.floor(Math.random() * 20) + 1 }))

// Mock de reservas por día (luego se conecta a datos reales)
const reservasPorDia = [
  { date: "2024-07-01", count: 2 },
  { date: "2024-07-03", count: 5 },
  { date: "2024-07-07", count: 3 },
  { date: "2024-07-12", count: 7 },
  { date: "2024-07-15", count: 1 },
  { date: "2024-07-21", count: 4 },
]

export default function AnalyticsPage() {
  // Cálculos mock para métricas superiores
  const estimateSells = ventasProductos.reduce((acc, p) => acc + p.value * 20, 0) // Suponiendo precio promedio 20€
  const orders = ventasProductos.reduce((acc, p) => acc + p.value, 0)
  const reservations = reservasPorDia.reduce((acc, r) => acc + r.count, 0)

  // Generar fechas de reservas para el mes actual (mock)
  const reservasFechas = reservasPorDia.map(r => new Date(r.date))
  const reservasMap = Object.fromEntries(reservasPorDia.map(r => [r.date, r.count]))

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Tabs defaultValue="adherence" className="space-y-4">
          <TabsList>
            <TabsTrigger value="adherence">Pedidos y Reservas</TabsTrigger>
            <TabsTrigger value="agent">Agent Performance</TabsTrigger>
            <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="adherence" className="space-y-4">
            {/* Métricas superiores */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimate Sells</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{estimateSells}</div>
                  <p className="text-xs text-muted-foreground">Estimación total de ventas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders}</div>
                  <p className="text-xs text-muted-foreground">Total de pedidos detectados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reservations}</div>
                  <p className="text-xs text-muted-foreground">Total de reservas</p>
                </CardContent>
              </Card>
            </div>
            {/* Gráficos principales */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Productos Vendidos</CardTitle>
                  <CardDescription>Top productos pedidos por los clientes</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <BarChart data={ventasProductos} />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Calendario de Reservas</CardTitle>
                  <CardDescription>Días y horas con reservas realizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReservationCalendar reservas={reservasPorDia} month={new Date(2024, 6, 1)} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="agent" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Emily Davis</div>
                  <p className="text-xs text-muted-foreground">94% adherence rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Michael Brown</div>
                  <p className="text-xs text-muted-foreground">68% adherence rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Improved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Sarah Johnson</div>
                  <p className="text-xs text-muted-foreground">+15% improvement</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Agent Performance Comparison</CardTitle>
                  <CardDescription>Performance metrics by agent</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <BarChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Agent Improvement Trends</CardTitle>
                  <CardDescription>Performance improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="customer" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Positive</div>
                  <p className="text-xs text-muted-foreground">65% of all calls</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Customer Issue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Billing Questions</div>
                  <p className="text-xs text-muted-foreground">28% of all calls</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+3% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Customer Sentiment Trends</CardTitle>
                  <CardDescription>Sentiment analysis over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Customer Issues</CardTitle>
                  <CardDescription>Distribution of customer issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Call Volume Trends</CardTitle>
                  <CardDescription>Call volume over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Performance Metrics Over Time</CardTitle>
                  <CardDescription>Key metrics trending</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Comparison</CardTitle>
                <CardDescription>Performance comparison by quarter</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
