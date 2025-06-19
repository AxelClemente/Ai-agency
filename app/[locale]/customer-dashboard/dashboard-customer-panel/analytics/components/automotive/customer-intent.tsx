import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import { Search, AlertTriangle } from "lucide-react"

// Simplified data without icons for now
const intentData = [
  {
    intent: "Agendar Cita",
    frequency: 312,
    percentage: 36.8,
    conversionRate: 94.2,
    avgDuration: 3.8,
    satisfaction: 91.7,
    urgency: "Alta",
    examples: ["Necesito una cita para ITV", "¿Cuándo puedo llevar el coche?", "Reservar revisión"],
    color: "bg-green-500"
  },
  {
    intent: "Consultar Precios",
    frequency: 289,
    percentage: 34.1,
    conversionRate: 52.9,
    avgDuration: 4.9,
    satisfaction: 78.3,
    urgency: "Media",
    examples: ["¿Cuánto cuesta cambiar frenos?", "Precio de neumáticos", "Tarifas de ITV"],
    color: "bg-blue-500"
  },
  {
    intent: "Información General",
    frequency: 156,
    percentage: 18.4,
    conversionRate: 31.4,
    avgDuration: 2.9,
    satisfaction: 85.6,
    urgency: "Baja",
    examples: ["¿Qué documentos necesito?", "Horarios de atención", "Ubicación del taller"],
    color: "bg-purple-500"
  },
  {
    intent: "Urgencia/Emergencia",
    icon: AlertTriangle,
    frequency: 67,
    percentage: 7.9,
    conversionRate: 97.1,
    avgDuration: 6.2,
    satisfaction: 94.8,
    urgency: "Crítica",
    examples: ["Frenos no funcionan", "Ruido extraño al frenar", "El coche no arranca"],
    color: "bg-red-500"
  },
  {
    intent: "Seguimiento",
    icon: Search,
    frequency: 23,
    percentage: 2.7,
    conversionRate: 78.3,
    avgDuration: 2.1,
    satisfaction: 88.9,
    urgency: "Baja",
    examples: ["¿Está listo mi coche?", "Estado de la reparación", "Cuándo puedo recogerlo"],
    color: "bg-yellow-500"
  }
]

const customerJourney = [
  {
    stage: "Identificación del Problema",
    percentage: 23.4,
    commonPhrases: ["Tengo un problema con...", "Se me ha roto...", "Necesito revisar..."],
    agentResponse: "Identificación rápida y empática del problema"
  },
  {
    stage: "Búsqueda de Información",
    percentage: 34.1,
    commonPhrases: ["¿Cuánto cuesta?", "¿Cuánto tiempo tarda?", "¿Qué incluye?"],
    agentResponse: "Información clara y detallada de precios/servicios"
  },
  {
    stage: "Evaluación de Opciones",
    percentage: 18.7,
    commonPhrases: ["¿Es urgente?", "¿Puedo esperar?", "¿Hay otras opciones?"],
    agentResponse: "Asesoramiento profesional y opciones personalizadas"
  },
  {
    stage: "Toma de Decisión",
    percentage: 36.8,
    commonPhrases: ["Quiero agendar", "¿Cuándo pueden atenderme?", "Reservo la cita"],
    agentResponse: "Facilitación del proceso de agenda"
  },
  {
    stage: "Abandono",
    percentage: 23.1,
    commonPhrases: ["Lo pensaré", "Llamaré después", "Muy caro"],
    agentResponse: "Identificar motivos y ofrecer alternativas"
  }
]

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "Crítica": return "bg-red-600 text-white"
    case "Alta": return "bg-red-500 text-white"
    case "Media": return "bg-yellow-500 text-black"
    case "Baja": return "bg-green-500 text-white"
    default: return "bg-gray-300 text-black"
  }
}

export function CustomerIntent() {
  const maxFrequency = Math.max(...intentData.map(i => i.frequency))
  
  return (
    <div className="space-y-6">
      {/* Resumen de intenciones */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Intención Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Agendar</div>
            <p className="text-xs text-muted-foreground">36.8% de las llamadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mayor Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Urgencias</div>
            <p className="text-xs text-muted-foreground">97.1% de conversión</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Más Satisfacción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Urgencias</div>
            <p className="text-xs text-muted-foreground">94.8% satisfacción</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Oportunidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Precios</div>
            <p className="text-xs text-muted-foreground">52.9% conversión</p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis simplificado de intenciones */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado de Intenciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {intentData.map((intent) => (
            <div key={intent.intent} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              {/* Intención */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${intent.color} text-white w-8 h-8 flex items-center justify-center`}>
                  {intent.intent.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{intent.intent}</div>
                  <div className="text-sm text-muted-foreground">{intent.frequency} llamadas</div>
                </div>
              </div>

              {/* Frecuencia */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Frecuencia</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(intent.frequency / maxFrequency) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">{intent.percentage}%</div>
              </div>

              {/* Conversión */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Conversión</div>
                <div className="text-lg font-bold">{intent.conversionRate}%</div>
                <div className="text-xs text-muted-foreground">tasa de éxito</div>
              </div>

              {/* Urgencia */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Urgencia</div>
                <Badge className={getUrgencyColor(intent.urgency)}>{intent.urgency}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ejemplos de frases comunes */}
      <Card>
        <CardHeader>
          <CardTitle>Frases Comunes por Intención</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {intentData.map((intent) => (
            <div key={intent.intent} className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`p-1 rounded ${intent.color} text-white w-6 h-6 flex items-center justify-center text-xs`}>
                  {intent.intent.charAt(0)}
                </div>
                <div className="font-semibold">{intent.intent}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {intent.examples.map((example, idx) => (
                  <div key={idx} className="text-sm bg-gray-50 p-2 rounded italic">
                    &quot;{example}&quot;
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Customer Journey */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Journey Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerJourney.map((stage, index) => (
              <div key={stage.stage} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{stage.stage}</h4>
                    <Badge variant="outline">{stage.percentage}%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>Frases comunes:</strong> {stage.commonPhrases.join(", ")}
                  </div>
                  <div className="text-sm text-blue-700">
                    <strong>Respuesta del agente:</strong> {stage.agentResponse}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 