import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Voice agent performance insights and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/analytics/automotive">
            <Button variant="outline">AutoBox Manacor Demo</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Plan Híbrido - Testing</CardTitle>
          <p className="text-sm text-muted-foreground">
            Prueba las funcionalidades del sistema híbrido de análisis de conversaciones
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/analysis/conv-itv-123">
              <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>ITV</Badge>
                    <Badge variant="outline">Urgente</Badge>
                  </div>
                  <h3 className="font-semibold">Conversación ITV</h3>
                  <p className="text-sm text-muted-foreground">
                    Cliente solicita cita urgente para ITV
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
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
                    <Badge>Neumáticos</Badge>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                  <h3 className="font-semibold">Cambio de Neumáticos</h3>
                  <p className="text-sm text-muted-foreground">
                    Consulta precios cambio de ruedas
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
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
                    <Badge>Frenos</Badge>
                    <Badge variant="destructive">Alto</Badge>
                  </div>
                  <h3 className="font-semibold">Problema de Frenos</h3>
                  <p className="text-sm text-muted-foreground">
                    Emergencia - ruido en frenos
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>📞 +34 600 345 678</span>
                    <span>⏱️ 6:12</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">🔗 Enlaces de Testing</h4>
            <div className="flex flex-wrap gap-2">
              <Link href="/api/socket">
                <Button variant="outline" size="sm">
                  Test WebSocket API
                </Button>
              </Link>
              <Link href="/api/twilio/voice">
                <Button variant="outline" size="sm">
                  Test Twilio Webhook
                </Button>
              </Link>
              <Link href="/api/twilio/stream">
                <Button variant="outline" size="sm">
                  Test Audio Stream
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 