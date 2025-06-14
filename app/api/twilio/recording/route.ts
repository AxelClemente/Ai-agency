import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const recordingData = {
      RecordingSid: formData.get('RecordingSid') as string,
      RecordingUrl: formData.get('RecordingUrl') as string,
      CallSid: formData.get('CallSid') as string,
      Duration: formData.get('RecordingDuration') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
    }

    console.log('🎙️ Recording completed:', {
      callSid: recordingData.CallSid,
      from: recordingData.From,
      duration: recordingData.Duration,
      recordingUrl: recordingData.RecordingUrl
    })

    // La transcripción se manejará automáticamente en /api/twilio/transcription
    // Aquí solo confirmamos que la grabación se completó exitosamente

    return new NextResponse(JSON.stringify({
      success: true,
      callSid: recordingData.CallSid,
      message: 'Recording processed successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('❌ Error processing recording:', error)
    
    return new NextResponse(JSON.stringify({
      success: false,
      error: 'Failed to process recording'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 