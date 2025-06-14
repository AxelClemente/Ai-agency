import { NextRequest } from 'next/server'
import WebSocket from 'ws'

// WebSocket handler for Twilio Media Streams + ElevenLabs
export async function GET(request: NextRequest) {
  console.log('🔗 WebSocket connection requested for Twilio + ElevenLabs stream')
  
  // This endpoint will be upgraded to WebSocket by the deployment platform
  // For local development, we'll handle this differently
  
  const callSid = request.nextUrl.searchParams.get('callSid')
  const from = request.nextUrl.searchParams.get('from')
  const agentId = request.nextUrl.searchParams.get('agentId')
  
  console.log('🎙️ Stream parameters:', { callSid, from, agentId })
  
  return new Response('WebSocket endpoint ready', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

// Handle WebSocket upgrade and ElevenLabs integration
export async function POST(request: NextRequest) {
  console.log('📞 Twilio Media Stream webhook triggered')
  
  try {
    const body = await request.text()
    console.log('📋 Twilio stream data:', body)
    
    // Parse Twilio Media Stream events
    const events = body.split('\n').filter(line => line.trim())
    
    for (const event of events) {
      try {
        const data = JSON.parse(event)
        await handleTwilioStreamEvent(data)
      } catch (e) {
        console.log('📝 Non-JSON stream data:', event)
      }
    }
    
    return new Response('OK', { status: 200 })
    
  } catch (error) {
    console.error('❌ Error handling Twilio stream:', error)
    return new Response('Error', { status: 500 })
  }
}

async function handleTwilioStreamEvent(data: any) {
  const { event, sequenceNumber, media, start, stop } = data
  
  switch (event) {
    case 'connected':
      console.log('🔗 Twilio stream connected')
      break
      
    case 'start':
      console.log('🎙️ Twilio stream started:', {
        callSid: start?.callSid,
        accountSid: start?.accountSid
      })
      
      // Initialize ElevenLabs conversation here
      await initializeElevenLabsConversation(start)
      break
      
    case 'media':
      console.log('🎵 Audio data received, chunk:', media?.chunk?.slice(0, 20) + '...')
      
      // Forward audio to ElevenLabs
      await forwardAudioToElevenLabs(media)
      break
      
    case 'stop':
      console.log('🛑 Twilio stream stopped')
      
      // Clean up ElevenLabs conversation
      await cleanupElevenLabsConversation(stop)
      break
      
    default:
      console.log('📡 Unknown stream event:', event)
  }
}

async function initializeElevenLabsConversation(startData: any) {
  console.log('🤖 Initializing ElevenLabs conversation...')
  
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY
  
  if (!agentId || !apiKey) {
    console.error('❌ Missing ElevenLabs configuration')
    return
  }
  
  try {
    // Create a conversation session with ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        agent_id: agentId,
        // Add phone-specific configuration
        mode: 'phone',
        call_metadata: {
          twilio_call_sid: startData.callSid,
          customer_phone: startData.customParameters?.from
        }
      })
    })
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }
    
    const conversation = await response.json()
    console.log('✅ ElevenLabs conversation created:', conversation.conversation_id)
    
  } catch (error) {
    console.error('❌ Failed to initialize ElevenLabs conversation:', error)
  }
}

async function forwardAudioToElevenLabs(mediaData: any) {
  // Convert Twilio audio format to ElevenLabs format
  // This is where we'd implement real-time audio forwarding
  console.log('🔄 Audio forwarding to ElevenLabs (placeholder)')
}

async function cleanupElevenLabsConversation(stopData: any) {
  console.log('🧹 Cleaning up ElevenLabs conversation...')
  // Implement cleanup logic
}

// Configuración de audio para Twilio
const TWILIO_AUDIO_CONFIG = {
  format: 'ulaw',
  sampleRate: 8000,
  channels: 1
}

export { TWILIO_AUDIO_CONFIG } 