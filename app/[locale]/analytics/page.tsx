import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">📊 Analytics Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Voice agent performance insights and metrics
        </p>
      </div>

      {/* Plan Hibrido Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Plan Híbrido - Testing
            <Badge variant="secondary">En Desarrollo</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Prueba las funcionalidades del sistema híbrido de análisis de conversaciones
          </p>

          {/* Sample Conversations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Link href="/analysis/conv-itv-123">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">ITV</Badge>
                    <Badge variant="destructive">Urgente</Badge>
                  </div>
                  <h3 className="font-semibold mb-1">Conversación ITV</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cliente solicita cita urgente para ITV
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📞 +34 600 123 456</span>
                    <span>⏱️ 4:05</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/analysis/conv-neumaticos-456">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">Neumáticos</Badge>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                  <h3 className="font-semibold mb-1">Cambio de Neumáticos</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Consulta precios cambio de ruedas
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📞 +34 600 789 012</span>
                    <span>⏱️ 2:33</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/analysis/conv-frenos-789">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">Frenos</Badge>
                    <Badge variant="destructive">Alto</Badge>
                  </div>
                  <h3 className="font-semibold mb-1">Problema de Frenos</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Emergencia - ruido en frenos
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📞 +34 600 345 678</span>
                    <span>⏱️ 6:12</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Links de Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔗 Enlaces de Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <p className="font-semibold">Test WebSocket API</p>
                    <p className="text-xs text-muted-foreground">Conexión tiempo real</p>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <p className="font-semibold">Test Twilio Webhook</p>
                    <p className="text-xs text-muted-foreground">Integración telefónica</p>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <p className="font-semibold">Test Audio Stream</p>
                    <p className="text-xs text-muted-foreground">Transmisión de audio</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Navigation Dashboards */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Dashboards Especializados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/analytics/automotive">
              <Button variant="outline" size="lg" className="h-auto p-6 w-full">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🚗</span>
                    <p className="font-semibold text-lg">AutoBox Manacor Demo</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dashboard automotive especializado con datos mock realistas
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Datos Mock</Badge>
                    <Badge variant="outline">4 Tabs</Badge>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/analytics/executive">
              <Button variant="default" size="lg" className="h-auto p-6 w-full">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏢</span>
                    <p className="font-semibold text-lg text-white">Dashboard Ejecutivo IA</p>
                  </div>
                  <p className="text-sm text-white/80">
                    Análisis masivo con GPT-4o real de 20 conversaciones diversas
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">GPT-4o Real</Badge>
                    <Badge variant="outline" className="border-white/40 text-white">20 Conversaciones</Badge>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-sm text-muted-foreground">Conversaciones Demo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">20</p>
            <p className="text-sm text-muted-foreground">Conversaciones IA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">GPT-4o</p>
            <p className="text-sm text-muted-foreground">Modelo IA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">~$0.16</p>
            <p className="text-sm text-muted-foreground">Costo Análisis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 