import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversationWithAI, validateAnalysisResponse } from '@/lib/openai'

// Real AI analysis using OpenAI GPT-4o
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { transcript, programmaticAnalysis } = await request.json()
    const { conversationId } = await params

    console.log(`🧠 Running REAL AI analysis for conversation ${conversationId}`)

    // Validate input
    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'Transcript is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Call OpenAI GPT-4o for real analysis
    const startTime = Date.now()
    const aiAnalysis = await analyzeConversationWithAI(transcript, programmaticAnalysis)
    const processingTime = Date.now() - startTime

    // Validate response structure
    if (!validateAnalysisResponse(aiAnalysis)) {
      console.error('❌ Invalid AI response structure:', aiAnalysis)
      return NextResponse.json(
        { error: 'Invalid AI response structure' },
        { status: 500 }
      )
    }

    // Enhance with metadata
    const enhancedAnalysis = {
      ...aiAnalysis,
      conversationId,
      processingTime,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    console.log(`✅ AI Analysis completed in ${processingTime}ms, cost: $${aiAnalysis.cost}`)

    // TODO: Save analysis to database
    // await saveAnalysisToDatabase(conversationId, enhancedAnalysis)

    // TODO: Emit WebSocket event for real-time updates
    // emitConversationEvent(conversationId, 'analysis_complete', enhancedAnalysis)

    return NextResponse.json(enhancedAnalysis)

  } catch (error) {
    console.error('❌ AI Analysis error:', error)
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded' },
          { status: 429 }
        )
      }

      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'AI response parsing failed' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'AI analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper functions for mock AI analysis
function generateMockSummary(transcript: string, programmaticAnalysis: any): string {
  const serviceType = programmaticAnalysis?.serviceType || 'General'
  const intent = programmaticAnalysis?.customerIntent || 'Consulta'
  
  return `El cliente contactó para ${intent.toLowerCase()} relacionado con ${serviceType}. Durante la conversación se mostró interesado en obtener información sobre los servicios disponibles. La interacción fue profesional y el cliente expresó sus necesidades de manera clara.`
}

function detectSentiment(transcript: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['gracias', 'perfecto', 'excelente', 'bien', 'genial']
  const negativeWords = ['problema', 'mal', 'terrible', 'frustrado', 'molesto']
  
  const lowerTranscript = transcript.toLowerCase()
  
  const positiveCount = positiveWords.filter(word => lowerTranscript.includes(word)).length
  const negativeCount = negativeWords.filter(word => lowerTranscript.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function generateRecommendations(programmaticAnalysis: any): string[] {
  const recommendations = []
  
  if (programmaticAnalysis?.urgencyLevel === 'high') {
    recommendations.push('Contactar al cliente inmediatamente para agendar cita urgente')
  }
  
  if (!programmaticAnalysis?.appointmentScheduled) {
    recommendations.push('Hacer seguimiento para confirmar agendamiento de cita')
  }
  
  if (programmaticAnalysis?.serviceType === 'ITV') {
    recommendations.push('Ofrecer servicios adicionales como revisión general del vehículo')
  }
  
  recommendations.push('Enviar información de precios por WhatsApp o email')
  
  return recommendations
}

function generateNextSteps(programmaticAnalysis: any): string[] {
  const nextSteps = []
  
  if (programmaticAnalysis?.contactInfo?.phone) {
    nextSteps.push('Llamada de seguimiento en 24 horas')
  }
  
  if (programmaticAnalysis?.serviceType !== 'General') {
    nextSteps.push(`Preparar presupuesto específico para ${programmaticAnalysis.serviceType}`)
  }
  
  nextSteps.push('Actualizar CRM con información del cliente')
  nextSteps.push('Programar recordatorio de seguimiento')
  
  return nextSteps
}

// TODO: Implement actual OpenAI/Claude integration
async function callOpenAI(transcript: string, programmaticAnalysis: any) {
  const prompt = `
Contexto: Eres un analista experto de AutoBox Manacor, un taller mecánico especializado en:
- ITV (Inspección Técnica de Vehículos)  
- Cambio de neumáticos
- Reparación de frenos
- Cambio de aceite
- Reparación de dirección

Analiza esta conversación telefónica:

TRANSCRIPCIÓN:
${transcript}

ANÁLISIS PROGRAMÁTICO PREVIO:
${JSON.stringify(programmaticAnalysis, null, 2)}

Proporciona un análisis detallado en formato JSON con:
1. summary: Resumen de la conversación (2-3 frases)
2. sentiment: positive/neutral/negative
3. recommendations: Array de recomendaciones accionables
4. nextSteps: Array de próximos pasos específicos
5. confidenceScore: Nivel de confianza del análisis (0-1)

Responde SOLO con el JSON válido.
`

  // Implementation with OpenAI API
  /*
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  })
  
  return JSON.parse(response.choices[0].message.content)
  */
} 