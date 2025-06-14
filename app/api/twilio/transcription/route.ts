import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversationWithAI } from '@/lib/openai'

// Interface para los datos de transcripción de Twilio
interface TwilioTranscriptionData {
  TranscriptionSid: string
  TranscriptionText: string
  TranscriptionStatus: string
  RecordingSid: string
  RecordingUrl: string
  CallSid: string
  AccountSid: string
  From: string
  To: string
  Duration: string
  DateCreated: string
}

export async function POST(request: NextRequest) {
  try {
    // Parsear los datos del webhook de Twilio
    const formData = await request.formData()
    const transcriptionData: TwilioTranscriptionData = {
      TranscriptionSid: formData.get('TranscriptionSid') as string,
      TranscriptionText: formData.get('TranscriptionText') as string,
      TranscriptionStatus: formData.get('TranscriptionStatus') as string,
      RecordingSid: formData.get('RecordingSid') as string,
      RecordingUrl: formData.get('RecordingUrl') as string,
      CallSid: formData.get('CallSid') as string,
      AccountSid: formData.get('AccountSid') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      Duration: formData.get('Duration') as string,
      DateCreated: formData.get('DateCreated') as string,
    }

    console.log('📝 Transcription received from Twilio:', {
      callSid: transcriptionData.CallSid,
      from: transcriptionData.From,
      duration: transcriptionData.Duration,
      status: transcriptionData.TranscriptionStatus,
      textLength: transcriptionData.TranscriptionText?.length || 0
    })

    // Verificar que la transcripción sea exitosa y tenga contenido
    if (transcriptionData.TranscriptionStatus !== 'completed' || !transcriptionData.TranscriptionText) {
      console.warn('⚠️ Transcription not completed or empty:', transcriptionData.TranscriptionStatus)
      return new NextResponse('Transcription not ready', { status: 200 })
    }

    // 1. Crear registro de conversación en tiempo real
    const conversation = {
      id: transcriptionData.CallSid,
      transcript: transcriptionData.TranscriptionText,
      timestamp: new Date(transcriptionData.DateCreated),
      duration: parseInt(transcriptionData.Duration),
      customerPhone: transcriptionData.From,
      twilioPhone: transcriptionData.To,
      recordingUrl: transcriptionData.RecordingUrl,
      source: 'twilio_real_call',
      status: 'transcribed'
    }

    console.log('🤖 Starting AI analysis for real conversation:', conversation.id)

    // 2. Ejecutar análisis IA automático con GPT-4o
    const aiAnalysis = await analyzeConversationWithAI(transcriptionData.TranscriptionText)

    console.log('✅ AI Analysis completed for real call:', {
      callSid: conversation.id,
      serviceType: aiAnalysis.serviceType,
      urgencyLevel: aiAnalysis.urgencyLevel,
      estimatedRevenue: aiAnalysis.estimatedRevenue,
      conversionProbability: aiAnalysis.businessMetrics.conversionProbability
    })

    // 3. Combinamos conversación + análisis
    const completeAnalysis = {
      conversation,
      analysis: aiAnalysis,
      analysisTimestamp: new Date(),
      isRealTimeCall: true
    }

    // 4. TODO: Broadcast via WebSocket a dashboard en tiempo real
    // broadcast('new-real-conversation', completeAnalysis)

    // 5. TODO: Guardar en base de datos para persistencia
    // await saveRealConversation(completeAnalysis)

    // 6. TODO: Trigger alertas si es alta prioridad
    if (aiAnalysis.urgencyLevel === 'high') {
      console.log('🚨 HIGH PRIORITY CALL detected - should trigger alert:', {
        phone: conversation.customerPhone,
        service: aiAnalysis.serviceType,
        revenue: aiAnalysis.estimatedRevenue
      })
      // TODO: Send notification/email/SMS to AutoBox team
    }

    return new NextResponse(JSON.stringify({
      success: true,
      callSid: conversation.id,
      analysis: {
        serviceType: aiAnalysis.serviceType,
        urgencyLevel: aiAnalysis.urgencyLevel,
        estimatedRevenue: aiAnalysis.estimatedRevenue,
        conversionProbability: aiAnalysis.businessMetrics.conversionProbability,
        customerProfile: aiAnalysis.customerProfile
      },
      message: 'Real conversation analyzed successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('❌ Error processing Twilio transcription:', error)
    
    return new NextResponse(JSON.stringify({
      success: false,
      error: 'Failed to process transcription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 