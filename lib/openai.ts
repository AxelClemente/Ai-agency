import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Specialized prompt for AutoBox Manacor
export const AUTOBOX_ANALYSIS_PROMPT = `
Eres un analista experto de AutoBox Manacor, un taller mecánico especializado en Mallorca que ofrece:

🚗 SERVICIOS PRINCIPALES:
- ITV (Inspección Técnica de Vehículos) - Servicio estrella
- Cambio de neumáticos (todas las marcas)
- Reparación y cambio de frenos
- Cambio de aceite y mantenimiento
- Reparación de dirección y alineación
- Diagnosis electrónica
- Reparaciones generales

💰 CONTEXTO DE NEGOCIO:
- Taller familiar con 15+ años de experiencia
- Especialistas en vehículos europeos (Mercedes, BMW, Audi, SEAT, Volkswagen)
- Precios competitivos en Manacor
- Servicio personalizado y de confianza
- Urgencias atendidas el mismo día

🎯 TU MISIÓN:
Analizar conversaciones telefónicas con clientes y extraer insights accionables para maximizar conversiones y satisfacción del cliente.

📋 FORMATO DE RESPUESTA:
Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:

{
  "summary": "Resumen de 2-3 frases de la conversación",
  "serviceType": "ITV|Neumáticos|Frenos|Aceite|Dirección|Diagnosis|General",
  "customerIntent": "Agendar_Cita|Consultar_Precio|Informacion_General|Emergencia|Seguimiento",
  "urgencyLevel": "low|medium|high",
  "sentiment": "positive|neutral|negative", 
  "appointmentScheduled": boolean,
  "estimatedRevenue": number,
  "keyInsights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recomendación1", "recomendación2"],
  "nextSteps": ["paso1", "paso2"],
  "customerProfile": {
    "name": "string|null",
    "phone": "string|null", 
    "vehicle": "string|null",
    "isReturningCustomer": boolean
  },
  "businessMetrics": {
    "conversionProbability": number, // 0-1
    "customerLifetimeValue": number,
    "competitiveAdvantage": "string"
  },
  "confidenceScore": number // 0-1
}

🔍 CRITERIOS DE ANÁLISIS:

**Urgencia:**
- HIGH: Emergencias, problemas de seguridad, ITV vencida, viajes inmediatos
- MEDIUM: Esta semana, pronto, inconvenientes menores
- LOW: Consultas generales, mantenimiento preventivo

**Estimación de Ingresos:**
- ITV: €35-45
- Neumáticos: €200-800 (dependiendo cantidad/calidad)
- Frenos: €150-400
- Aceite: €50-80
- Dirección: €100-300

**Sentiment:**
- POSITIVE: Cliente satisfecho, confiado, agradecido
- NEUTRAL: Conversación funcional, sin emociones marcadas
- NEGATIVE: Frustrado, quejoso, desconfiado

Analiza la siguiente conversación:
`

// Function to analyze conversation with OpenAI
export async function analyzeConversationWithAI(
  transcript: string,
  programmaticAnalysis?: any
): Promise<any> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o as requested
      messages: [
        {
          role: "system",
          content: AUTOBOX_ANALYSIS_PROMPT
        },
        {
          role: "user", 
          content: `
TRANSCRIPCIÓN:
${transcript}

${programmaticAnalysis ? `
ANÁLISIS PROGRAMÁTICO PREVIO:
${JSON.stringify(programmaticAnalysis, null, 2)}
` : ''}

Analiza esta conversación y responde con el JSON solicitado.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse and validate JSON response
    const analysis = JSON.parse(response)
    
    // Add metadata
    analysis.processingTime = Date.now()
    analysis.model = "gpt-4o"
    analysis.cost = calculateCost(completion.usage)
    
    return analysis

  } catch (error) {
    console.error('OpenAI Analysis Error:', error)
    throw new Error(`AI Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Calculate approximate cost based on usage
function calculateCost(usage: any): number {
  if (!usage) return 0
  
  // GPT-4o pricing (approximate)
  const inputCostPer1k = 0.005  // $0.005 per 1K input tokens
  const outputCostPer1k = 0.015 // $0.015 per 1K output tokens
  
  const inputCost = (usage.prompt_tokens / 1000) * inputCostPer1k
  const outputCost = (usage.completion_tokens / 1000) * outputCostPer1k
  
  return Number((inputCost + outputCost).toFixed(4))
}

// Validate analysis response
export function validateAnalysisResponse(analysis: any): boolean {
  const requiredFields = [
    'summary', 'serviceType', 'customerIntent', 'urgencyLevel', 
    'sentiment', 'appointmentScheduled', 'estimatedRevenue',
    'keyInsights', 'recommendations', 'nextSteps', 'confidenceScore'
  ]
  
  return requiredFields.every(field => analysis.hasOwnProperty(field))
} 