'use client'

import { useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface ExecutiveMetrics {
  totalConversations: number
  totalRevenue: number
  averageConversionRate: number
  serviceDistribution: Record<string, number>
  urgencyDistribution: Record<string, number>
  sentimentDistribution: Record<string, number>
  topInsights: string[]
  competitiveAdvantages: string[]
  lostOpportunities: LostOpportunity[]
  totalCost: number
  averageProcessingTime: number
  successRate: number
}

interface BatchAnalysisResponse {
  batchId: string
  timestamp: string
  totalConversations: number
  successfulAnalyses: number
  failedAnalyses: number
  successRate: number
  totalProcessingTime: number
  averageProcessingTime: number
  totalCost: number
  aggregatedMetrics: ExecutiveMetrics
}

interface LostOpportunity {
  reason?: string
  conversationId?: string
  [key: string]: unknown
}

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null)
  const [batchInfo, setBatchInfo] = useState<Partial<BatchAnalysisResponse> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runBatchAnalysis() {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🚀 Starting batch AI analysis for executive dashboard...')
      
      const response = await fetch('/api/conversations/batch-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          includeAggregation: true
        })
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      
      const data: BatchAnalysisResponse = await response.json()
      
      setMetrics(data.aggregatedMetrics)
      setBatchInfo({
        batchId: data.batchId,
        timestamp: data.timestamp,
        totalConversations: data.totalConversations,
        successfulAnalyses: data.successfulAnalyses,
        successRate: data.successRate,
        totalProcessingTime: data.totalProcessingTime,
        totalCost: data.totalCost
      })
      setLastUpdate(new Date().toLocaleString())
      
      console.log('✅ Batch analysis completed successfully')
      
    } catch (error) {
      console.error('❌ Error running batch analysis:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  // Transform data for charts
  const serviceChartData = metrics ? Object.entries(metrics.serviceDistribution).map(([service, count]) => ({
    name: service,
    value: count,
    percentage: Math.round((count / metrics.totalConversations) * 100)
  })) : []

  // Declaraciones para uso futuro (descomentar cuando se necesiten)
  // const urgencyChartData = metrics ? Object.entries(metrics.urgencyDistribution).map(([urgency, count]) => ({
  //   urgency,
  //   count,
  //   percentage: Math.round((count / metrics.totalConversations) * 100)
  // })) : []

  // const sentimentChartData = metrics ? Object.entries(metrics.sentimentDistribution).map(([sentiment, count]) => ({
  //   sentiment,
  //   count,
  //   percentage: Math.round((count / metrics.totalConversations) * 100)
  // })) : []

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🏢 Dashboard Ejecutivo AutoBox Manacor</h1>
          <p className="text-muted-foreground">
            Análisis agregado con IA GPT-4o de todas las conversaciones
          </p>
          {lastUpdate && (
            <p className="text-sm text-muted-foreground mt-1">
              Última actualización: {lastUpdate}
            </p>
          )}
        </div>
        <Button 
          onClick={runBatchAnalysis} 
          disabled={isLoading}
          size="lg"
          className="min-w-[250px]"
        >
          {isLoading ? '🔄 Analizando 20 Conversaciones...' : '🚀 Ejecutar Análisis IA Masivo'}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="text-xl">❌</span>
              <div>
                <p className="font-semibold">Error en el análisis</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg font-semibold">Procesando 20 conversaciones con GPT-4o...</p>
              <p className="text-muted-foreground">
                Esto puede tomar 2-3 minutos. Analizando servicios, intenciones, métricas de negocio...
              </p>
              <Progress value={33} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Extrayendo insights de negocio y métricas de conversión...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {!metrics && !isLoading && !error && (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">🎯 Dashboard Ejecutivo con IA Real</h3>
            <p className="text-muted-foreground mb-6">
              Ejecuta análisis IA masivo para obtener insights ejecutivos de 20 conversaciones diversas de AutoBox Manacor
            </p>
            <Button onClick={runBatchAnalysis} size="lg">
              🚀 Comenzar Análisis IA Masivo
            </Button>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold">Conversaciones</p>
                <p className="text-lg">20</p>
              </div>
              <div>
                <p className="font-semibold">Modelo IA</p>
                <p className="text-lg">GPT-4o</p>
              </div>
              <div>
                <p className="font-semibold">Costo Estimado</p>
                <p className="text-lg">~$0.16</p>
              </div>
              <div>
                <p className="font-semibold">Tiempo Estimado</p>
                <p className="text-lg">~3 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {metrics && batchInfo && (
        <>
          {/* Batch Info */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Información del Análisis Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-semibold">Conversaciones Analizadas</p>
                  <p className="text-2xl font-bold text-blue-600">{batchInfo.totalConversations}</p>
                </div>
                <div>
                  <p className="font-semibold">Análisis Exitosos</p>
                  <p className="text-2xl font-bold text-green-600">{batchInfo.successfulAnalyses}</p>
                </div>
                <div>
                  <p className="font-semibold">Costo Total IA</p>
                  <p className="text-2xl font-bold text-orange-600">${batchInfo.totalCost?.toFixed(4)}</p>
                </div>
                <div>
                  <p className="font-semibold">Tiempo Total</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round((batchInfo.totalProcessingTime || 0) / 1000)}s</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Ingresos Totales Detectados</p>
                  <p className="text-3xl font-bold text-green-600">€{metrics.totalRevenue}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Tasa Conversión Promedio</p>
                  <p className="text-3xl font-bold text-blue-600">{Math.round(metrics.averageConversionRate * 100)}%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Oportunidades Perdidas</p>
                  <p className="text-3xl font-bold text-red-600">{metrics.lostOpportunities.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Tasa Éxito IA</p>
                  <p className="text-3xl font-bold text-purple-600">{metrics.successRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>🔧 Distribución de Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceChartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{item.name}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-muted-foreground text-right">
                      {item.value} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Insights */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Insights Clave Más Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="font-bold text-yellow-700 text-lg">{index + 1}.</span>
                    <p className="text-yellow-900">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitive Advantages */}
          <Card>
            <CardHeader>
              <CardTitle>🏆 Ventajas Competitivas Identificadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="font-bold text-green-700">🏆</span>
                    <p className="text-green-900">{advantage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 