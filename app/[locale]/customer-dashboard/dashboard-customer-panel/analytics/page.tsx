"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "../components/charts"
import { DashboardHeader } from "../components/dashboard-header"
import ReservationCalendar from "./components/reservation-calendar"
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Tipado local para las conversaciones asociadas a productos
interface ConversationSummary {
  id: string;
  date?: string;
  duration?: number;
}

interface ProductSummary {
  name: string;
  value: number;
  conversations: ConversationSummary[];
  [key: string]: string | number | ConversationSummary[];
}

interface ApiProduct {
  name: string;
  quantity: number;
  conversations: ConversationSummary[];
}

export default function AnalyticsPage() {
  // Estado para reservas por día
  const [reservasPorDia, setReservasPorDia] = useState<{ date: string; count: number }[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [errorReservas, setErrorReservas] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservas() {
      setLoadingReservas(true);
      setErrorReservas(null);
      try {
        console.log('🔄 [FRONTEND] Fetching reservations...');
        const res = await fetch('/api/analytics/reservations-by-day');
        console.log('📥 [FRONTEND] Reservations response status:', res.status);
        const data = await res.json();
        console.log('📥 [FRONTEND] Reservations data:', data);
        if (data.reservations) {
          console.log('✅ [FRONTEND] Setting reservations:', data.reservations);
          setReservasPorDia(data.reservations);
        } else {
          console.log('⚠️ [FRONTEND] No reservations in response');
          setReservasPorDia([]);
        }
      } catch (error) {
        console.error('❌ [FRONTEND] Error fetching reservations:', error);
        setErrorReservas('Error al cargar reservas');
        setReservasPorDia([]);
      } finally {
        setLoadingReservas(false);
      }
    }
    fetchReservas();
  }, []);

  // Estado para productos vendidos (ahora con conversations)
  const [ventasProductos, setVentasProductos] = useState<ProductSummary[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProductos() {
      setLoadingProductos(true);
      try {
        console.log('🔄 [FRONTEND] Fetching products...');
        const res = await fetch('/api/analytics/products');
        console.log('📥 [FRONTEND] Products response status:', res.status);
        const data = await res.json();
        console.log('📥 [FRONTEND] Products data:', data);
        if (data.products) {
          const mappedProducts = data.products.map((p: ApiProduct) => ({
            name: p.name,
            value: p.quantity,
            conversations: p.conversations
          }));
          console.log('✅ [FRONTEND] Setting products:', mappedProducts);
          setVentasProductos(mappedProducts);
        } else {
          console.log('⚠️ [FRONTEND] No products in response');
          setVentasProductos([]);
        }
      } catch (error) {
        console.error('❌ [FRONTEND] Error fetching products:', error);
        setVentasProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    }
    fetchProductos();
  }, []);

  // Cálculos mock para métricas superiores
  const estimateSells = ventasProductos.reduce((acc, p) => acc + p.value * 20, 0) // Suponiendo precio promedio 20€
  const orders = ventasProductos.reduce((acc, p) => acc + p.value, 0)
  const reservations = reservasPorDia.reduce((acc, r) => acc + r.count, 0)

  // Logs de debug para ver el estado final
  console.log('📊 [FRONTEND] Final state:');
  console.log('- ventasProductos:', ventasProductos);
  console.log('- reservasPorDia:', reservasPorDia);
  console.log('- estimateSells:', estimateSells);
  console.log('- orders:', orders);
  console.log('- reservations:', reservations);

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
                  {loadingProductos ? (
                    <div className="text-muted-foreground">Cargando productos...</div>
                  ) : ventasProductos.length === 0 ? (
                    <div className="text-muted-foreground">No hay datos de productos vendidos.</div>
                  ) : (
                    <BarChart
                      data={ventasProductos}
                      onBarClick={(product) => {
                        setSelectedProduct(product as ProductSummary);
                        setModalOpen(true);
                      }}
                    />
                  )}
                  {/* Modal de detalles de conversaciones */}
                  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Conversaciones para &quot;{selectedProduct?.name}&quot;</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {selectedProduct && Array.isArray(selectedProduct.conversations) && selectedProduct.conversations.length > 0 ? (
                          selectedProduct.conversations.map((conv: ConversationSummary) => (
                            <div key={conv.id} className="flex justify-between items-center border-b pb-1 last:border-b-0 last:pb-0">
                              <div>
                                <span className="font-mono text-xs">ID: {conv.id}</span><br />
                                <span className="text-xs text-muted-foreground">{conv.date ? new Date(conv.date).toLocaleString() : 'Sin fecha'}</span>
                              </div>
                              <div className="text-xs">Duración: {Math.floor((conv.duration || 0) / 60)}:{String((conv.duration || 0) % 60).padStart(2, '0')}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground">No hay conversaciones asociadas.</div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Calendario de Reservas</CardTitle>
                  <CardDescription>Días y horas con reservas realizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingReservas ? (
                    <div className="text-center text-muted-foreground">Cargando reservas...</div>
                  ) : errorReservas ? (
                    <div className="text-center text-destructive">{errorReservas}</div>
                  ) : (
                    <ReservationCalendar reservas={reservasPorDia} month={new Date()} />
                  )}
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
