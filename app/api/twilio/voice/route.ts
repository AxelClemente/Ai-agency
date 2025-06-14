import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  console.log('📞 Twilio webhook - Direct ElevenLabs integration with client data')
  
  try {
    // Parse the form data from Twilio
    const formData = await request.formData()
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const callSid = formData.get('CallSid') as string
    
    console.log('📞 Call details:', {
      from,
      to,
      callSid,
      timestamp: new Date().toISOString()
    })

    // Get ElevenLabs configuration
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
    const apiKey = process.env.ELEVENLABS_API_KEY
    
    if (!agentId || !apiKey) {
      throw new Error('ElevenLabs configuration missing')
    }
    
    console.log('🤖 Using ElevenLabs agent:', agentId)

    // Prepare client data for the conversation
    const clientData = {
      custom_llm_extra_body: {
        caller_phone_number: from,
        call_sid: callSid,
        twilio_call_data: {
          from: from,
          to: to,
          call_type: "inbound"
        }
      }
    }

    // Get signed URL for ElevenLabs WebSocket connection (back to GET method)
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey
        }
      }
    );
    
    if (!signedUrlResponse.ok) {
      const errorText = await signedUrlResponse.text()
      console.error('❌ ElevenLabs signed URL error:', errorText)
      throw new Error(`Failed to get ElevenLabs signed URL: ${signedUrlResponse.status}`)
    }
    
    const { signed_url } = await signedUrlResponse.json()
    console.log('✅ Got ElevenLabs signed URL')
    
    // Create TwiML to connect to ElevenLabs WebSocket
    const twiml = new VoiceResponse()
    
    // Connect to ElevenLabs WebSocket
    const connect = twiml.connect()
    const stream = connect.stream({
      url: signed_url,
    })
    
    // Add call metadata as parameters
    stream.parameter({
      name: 'callSid',
      value: callSid
    })
    
    stream.parameter({
      name: 'from',
      value: from
    })
    
    stream.parameter({
      name: 'to',
      value: to
    })
    
    // Log the TwiML response
    console.log('📋 TwiML ElevenLabs Direct Integration:', twiml.toString())
    
    // Save call info
    await saveCallInfo(callSid, from, to, agentId)
    
    // Return TwiML response
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    })
    
  } catch (error) {
    console.error('❌ Error connecting to ElevenLabs:', error)
    
    // Fallback TwiML
    const errorTwiml = new VoiceResponse()
    errorTwiml.say({
      voice: 'alice',
      language: 'es-ES'
    }, 'Lo siento, nuestro servicio de inteligencia artificial no está disponible en este momento. Por favor, inténtelo más tarde.')
    
    return new NextResponse(errorTwiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  }
}

async function saveCallInfo(callSid: string, from: string, to: string, agentId: string) {
  try {
    console.log('💾 Saving call info:', { callSid, from, to, agentId })
    console.log('✅ Call info logged successfully')
    
  } catch (error) {
    console.error('❌ Error saving call info:', error)
  }
} 