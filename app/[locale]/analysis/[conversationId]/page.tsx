'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useConversationUpdates } from '@/components/websocket-provider'
import type { AIAnalysis } from '../../../../types/conversation'

interface ConversationData {
  id: string
  phoneNumber: string
  duration: number
  timestamp: string
  transcript: string
  status: 'active' | 'completed' | 'analyzing'
  twilioCallSid?: string
}

interface ProgrammaticAnalysis {
  serviceType: string
  customerIntent: string
  urgencyLevel: 'low' | 'medium' | 'high'
  keyTopics: string[]
  appointmentScheduled: boolean
  contactInfo: {
    name?: string
    phone?: string
    vehicle?: string
  }
}

export default function ConversationAnalysisPage({
  params
}: {
  params: Promise<{ conversationId: string }>
}) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  
  // Resolve params
  useEffect(() => {
    params.then(resolvedParams => {
      setConversationId(resolvedParams.conversationId)
    })
  }, [params])
  
  // WebSocket real-time updates (only when conversationId is available)
  const { transcript: liveTranscript, status: liveStatus } = useConversationUpdates(conversationId || undefined)
  
  // Local state
  const [conversationData, setConversationData] = useState<ConversationData | null>(null)
  const [programmaticAnalysis, setProgrammaticAnalysis] = useState<ProgrammaticAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aiAnalysis] = useState<AIAnalysis | null>(null)

  // Load conversation data when conversationId is available
  useEffect(() => {
    if (conversationId) {
      loadConversationData()
    }
  }, [conversationId])

  // Update with real-time data
  useEffect(() => {
    if (liveTranscript && conversationData) {
      setConversationData(prev => prev ? { ...prev, transcript: liveTranscript } : null)
      
      // Auto-run programmatic analysis on transcript updates
      runProgrammaticAnalysis(liveTranscript)
    }
  }, [liveTranscript])

  async function loadConversationData() {
    if (!conversationId) return
    
    try {
      // First, try to load from diverse conversations
      const { getConversationById } = await import('@/lib/mock-conversations')
      const foundConversation = getConversationById(conversationId)
      
      let mockData: ConversationData
      
      if (foundConversation) {
        // Use diverse conversation data
        mockData = {
          id: foundConversation.id,
          phoneNumber: foundConversation.phoneNumber,
          duration: foundConversation.duration,
          timestamp: foundConversation.timestamp,
          transcript: foundConversation.transcript,
          status: 'completed',
          twilioCallSid: `CA${foundConversation.id.slice(-10)}`
        }
      } else {
        // Fallback to original mock data for existing conversation IDs
        // Type assertion since we know conversationId is not null here
        const id = conversationId as string
        
        switch (conversationId) {
          case 'conv-itv-123':
            mockData = {
              id,
              phoneNumber: '+34 600 123 456',
              duration: 245,
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
              transcript: 'Hola, buenos días. Quería saber si tienen disponibilidad para la ITV de mi coche esta semana. Es urgente porque se me vence el miércoles y necesito hacer un viaje el jueves. ¿Qué horarios tienen disponibles? También me gustaría saber el precio.',
              status: 'completed',
              twilioCallSid: 'CA1234567890abcdef'
            }
            break
            
          case 'conv-neumaticos-456':
            mockData = {
              id,
              phoneNumber: '+34 600 789 012',
              duration: 153,
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
              transcript: 'Buenas tardes. Llamo para preguntar por el cambio de neumáticos. Tengo un Mercedes Clase A y creo que necesito cambiar las ruedas delanteras. ¿Podrían darme un presupuesto? También me gustaría saber qué marcas tienen disponibles y cuánto tiempo tardan en hacerlo.',
              status: 'completed',
              twilioCallSid: 'CA9876543210fedcba'
            }
            break
            
          case 'conv-frenos-789':
            mockData = {
              id,
              phoneNumber: '+34 600 345 678',
              duration: 372,
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
              transcript: 'Hola, tengo una emergencia. Mi coche está haciendo un ruido muy fuerte cuando freno y tengo que viajar mañana temprano. ¿Pueden atenderme hoy mismo? Es un Seat León del 2018. El ruido es como un chirrido muy fuerte cuando piso el freno. Estoy preocupado porque puede ser peligroso.',
              status: 'completed',
              twilioCallSid: 'CA5555666677778888'
            }
            break
            
          default:
            mockData = {
              id,
              phoneNumber: '+34 600 000 000',
              duration: 120,
              timestamp: new Date().toISOString(),
              transcript: 'Hola, buenos días. Quería información general sobre sus servicios...',
              status: 'completed',
              twilioCallSid: 'CA0000000000000000'
            }
        }
      }
      
      setConversationData(mockData)
      
      // Run initial programmatic analysis
      runProgrammaticAnalysis(mockData.transcript)
      
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  function runProgrammaticAnalysis(transcript: string) {
    // Análisis programático inmediato (del plan original elevenlabs.md)
    const analysis: ProgrammaticAnalysis = {
      serviceType: detectServiceType(transcript),
      customerIntent: detectCustomerIntent(transcript),
      urgencyLevel: detectUrgencyLevel(transcript),
      keyTopics: extractKeyTopics(transcript),
      appointmentScheduled: detectAppointmentScheduled(transcript),
      contactInfo: extractContactInfo(transcript)
    }
    
    setProgrammaticAnalysis(analysis)
  }

  async function runAIAnalysis() {
    if (!conversationData || isAnalyzing) return
    
    setIsAnalyzing(true)
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/ai-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: conversationData.transcript,
          programmaticAnalysis
        })
      })
      
      await response.json()
      
    } catch (error) {
      console.error('Error running AI analysis:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper functions for programmatic analysis
  function detectServiceType(transcript: string): string {
    const services = {
      'ITV': ['itv', 'inspección técnica', 'inspección', 'pasar la itv'],
      'Neumáticos': ['neumático', 'rueda', 'goma', 'cambio de ruedas'],
      'Frenos': ['freno', 'pastilla', 'disco', 'frenar'],
      'Aceite': ['aceite', 'cambio de aceite', 'lubricante'],
      'Dirección': ['dirección', 'volante', 'alineación']
    }
    
    const lowerTranscript = transcript.toLowerCase()
    
    for (const [service, keywords] of Object.entries(services)) {
      if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
        return service
      }
    }
    
    return 'General'
  }

  function detectCustomerIntent(transcript: string): string {
    const intents = {
      'Agendar Cita': ['cita', 'agendar', 'reservar', 'disponibilidad', 'cuándo'],
      'Consultar Precio': ['precio', 'coste', 'cuánto', 'tarifa'],
      'Información General': ['información', 'pregunta', 'saber'],
      'Emergencia': ['urgente', 'emergencia', 'ahora', 'inmediato'],
      'Seguimiento': ['seguimiento', 'estado', 'listo']
    }
    
    const lowerTranscript = transcript.toLowerCase()
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
        return intent
      }
    }
    
    return 'Consulta General'
  }

  function detectUrgencyLevel(transcript: string): 'low' | 'medium' | 'high' {
    const urgentKeywords = ['urgente', 'emergencia', 'ahora', 'inmediato', 'hoy']
    const mediumKeywords = ['esta semana', 'pronto', 'cuanto antes']
    
    const lowerTranscript = transcript.toLowerCase()
    
    if (urgentKeywords.some(keyword => lowerTranscript.includes(keyword))) {
      return 'high'
    }
    
    if (mediumKeywords.some(keyword => lowerTranscript.includes(keyword))) {
      return 'medium'
    }
    
    return 'low'
  }

  function extractKeyTopics(transcript: string): string[] {
    const topics = []
    const lowerTranscript = transcript.toLowerCase()
    
    if (lowerTranscript.includes('precio') || lowerTranscript.includes('coste')) {
      topics.push('Pricing')
    }
    if (lowerTranscript.includes('tiempo') || lowerTranscript.includes('duración')) {
      topics.push('Duration')
    }
    if (lowerTranscript.includes('disponibilidad') || lowerTranscript.includes('horario')) {
      topics.push('Availability')
    }
    
    return topics
  }

  function detectAppointmentScheduled(transcript: string): boolean {
    const appointmentKeywords = ['reservado', 'agendado', 'confirmado', 'nos vemos']
    return appointmentKeywords.some(keyword => 
      transcript.toLowerCase().includes(keyword)
    )
  }

  function extractContactInfo(transcript: string) {
    // Simple extraction - could be improved with regex
    return {
      name: transcript.match(/me llamo (\w+)/i)?.[1],
      phone: transcript.match(/(\d{9})/)?.[1],
      vehicle: transcript.match(/(mercedes|bmw|audi|seat|volkswagen)/i)?.[1]
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!conversationData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>No se encontró la conversación.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Conversación</h1>
          <p className="text-muted-foreground">
            ID: {conversationId}
          </p>
        </div>
        <Badge variant={liveStatus === 'active' ? 'default' : 'secondary'}>
          {liveStatus === 'active' ? '🔴 En Vivo' : '✅ Finalizada'}
        </Badge>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-semibold">Teléfono</p>
            <p className="text-muted-foreground">{conversationData.phoneNumber}</p>
          </div>
          <div>
            <p className="font-semibold">Duración</p>
            <p className="text-muted-foreground">{Math.floor(conversationData.duration / 60)}:{(conversationData.duration % 60).toString().padStart(2, '0')}</p>
          </div>
          <div>
            <p className="font-semibold">Fecha</p>
            <p className="text-muted-foreground">
              {new Date(conversationData.timestamp).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="font-semibold">Twilio Call ID</p>
            <p className="text-muted-foreground text-xs">{conversationData.twilioCallSid}</p>
          </div>
        </CardContent>
      </Card>

      {/* Transcript */}
      <Card>
        <CardHeader>
          <CardTitle>Transcripción</CardTitle>
          {liveStatus === 'active' && (
            <Badge variant="outline">🔴 Actualizándose en tiempo real</Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="whitespace-pre-wrap">
              {liveTranscript || conversationData.transcript}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Programmatic Analysis */}
      {programmaticAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Análisis Programático (Inmediato)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">Tipo de Servicio</p>
                <Badge>{programmaticAnalysis.serviceType}</Badge>
              </div>
              <div>
                <p className="font-semibold">Intención del Cliente</p>
                <Badge variant="outline">{programmaticAnalysis.customerIntent}</Badge>
              </div>
              <div>
                <p className="font-semibold">Nivel de Urgencia</p>
                <Badge variant={
                  programmaticAnalysis.urgencyLevel === 'high' ? 'destructive' :
                  programmaticAnalysis.urgencyLevel === 'medium' ? 'default' : 'secondary'
                }>
                  {programmaticAnalysis.urgencyLevel === 'high' ? '🔴 Alto' :
                   programmaticAnalysis.urgencyLevel === 'medium' ? '🟡 Medio' : '🟢 Bajo'}
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Temas Clave</p>
                <div className="flex flex-wrap gap-2">
                  {programmaticAnalysis.keyTopics.map(topic => (
                    <Badge key={topic} variant="outline">{topic}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Estado de Cita</p>
                <Badge variant={programmaticAnalysis.appointmentScheduled ? 'default' : 'secondary'}>
                  {programmaticAnalysis.appointmentScheduled ? '✅ Agendada' : '❌ No agendada'}
                </Badge>
              </div>
            </div>

            {programmaticAnalysis.contactInfo && (
              <>
                <Separator />
                <div>
                  <p className="font-semibold mb-2">Información de Contacto</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Nombre:</span> {programmaticAnalysis.contactInfo.name || 'No detectado'}
                    </div>
                    <div>
                      <span className="font-medium">Teléfono:</span> {programmaticAnalysis.contactInfo.phone || 'No detectado'}
                    </div>
                    <div>
                      <span className="font-medium">Vehículo:</span> {programmaticAnalysis.contactInfo.vehicle || 'No detectado'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🧠 Análisis con IA GPT-4o (Bajo Demanda)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!aiAnalysis ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ejecuta un análisis detallado con IA para obtener insights profundos sobre esta conversación usando GPT-4o especializado para AutoBox Manacor.
              </p>
              <Button 
                onClick={runAIAnalysis} 
                disabled={isAnalyzing}
                className="w-full md:w-auto"
              >
                {isAnalyzing ? '🔄 Analizando con GPT-4o...' : '🚀 Analizar con IA GPT-4o'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <p className="font-semibold mb-2">📋 Resumen</p>
                <p className="bg-blue-50 p-4 rounded-lg">{aiAnalysis.summary}</p>
              </div>

              {/* Main Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-semibold mb-2">🔧 Servicio</p>
                  <Badge variant="default">{aiAnalysis.serviceType}</Badge>
                </div>
                <div>
                  <p className="font-semibold mb-2">🎯 Intención</p>
                  <Badge variant="outline">{aiAnalysis.customerIntent?.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <p className="font-semibold mb-2">⚡ Urgencia</p>
                  <Badge variant={
                    aiAnalysis.urgencyLevel === 'high' ? 'destructive' :
                    aiAnalysis.urgencyLevel === 'medium' ? 'default' : 'secondary'
                  }>
                    {aiAnalysis.urgencyLevel === 'high' ? '🔴 Alta' :
                     aiAnalysis.urgencyLevel === 'medium' ? '🟡 Media' : '🟢 Baja'}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold mb-2">😊 Sentimiento</p>
                  <Badge variant={
                    aiAnalysis.sentiment === 'positive' ? 'default' :
                    aiAnalysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                  }>
                    {aiAnalysis.sentiment === 'positive' ? '😊 Positivo' :
                     aiAnalysis.sentiment === 'negative' ? '😞 Negativo' : '😐 Neutral'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Business Metrics */}
              <div>
                <p className="font-semibold mb-3">💰 Métricas de Negocio</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-700">Ingresos Estimados</p>
                    <p className="text-2xl font-bold text-green-900">€{aiAnalysis.estimatedRevenue}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Probabilidad Conversión</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {Math.round(aiAnalysis.businessMetrics?.conversionProbability * 100 || 0)}%
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-700">Valor Cliente</p>
                    <p className="text-2xl font-bold text-purple-900">
                      €{aiAnalysis.businessMetrics?.customerLifetimeValue || 0}
                    </p>
                  </div>
                </div>
                {aiAnalysis.businessMetrics?.competitiveAdvantage && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-700">🏆 Ventaja Competitiva</p>
                    <p className="text-orange-900">{aiAnalysis.businessMetrics.competitiveAdvantage}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Customer Profile */}
              {aiAnalysis.customerProfile && (
                <>
                  <div>
                    <p className="font-semibold mb-3">👤 Perfil del Cliente</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Nombre</p>
                        <p className="text-muted-foreground">{aiAnalysis.customerProfile.name || 'No detectado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Teléfono</p>
                        <p className="text-muted-foreground">{aiAnalysis.customerProfile.phone || 'No detectado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Vehículo</p>
                        <p className="text-muted-foreground">{aiAnalysis.customerProfile.vehicle || 'No detectado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cliente Recurrente</p>
                        <Badge variant={aiAnalysis.customerProfile.isReturningCustomer ? 'default' : 'secondary'}>
                          {aiAnalysis.customerProfile.isReturningCustomer ? '✅ Sí' : '❌ No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Key Insights */}
              {aiAnalysis.keyInsights && aiAnalysis.keyInsights.length > 0 && (
                <>
                  <div>
                    <p className="font-semibold mb-3">💡 Insights Clave</p>
                    <div className="space-y-2">
                      {aiAnalysis.keyInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                          <span className="text-yellow-600 font-bold">{index + 1}.</span>
                          <p className="text-yellow-900">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Recommendations & Next Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-3">💡 Recomendaciones</p>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-3">📋 Próximos Pasos</p>
                  <ul className="space-y-2">
                    {aiAnalysis.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">{index + 1}.</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold">🎯 Nivel de Confianza del Análisis</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${aiAnalysis.confidenceScore * 100}%` }}
                    ></div>
                  </div>
                  <Badge variant="outline">
                    {Math.round(aiAnalysis.confidenceScore * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 