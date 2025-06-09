import { NextRequest, NextResponse } from 'next/server'
import { VoiceResponse } from 'twilio/lib/twiml/VoiceResponse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const callSid = formData.get('CallSid') as string
    const from = formData.get('From') as string
    const to = formData.get('To') as string

    console.log(`📞 Incoming call: ${from} → ${to} (${callSid})`)

    const twiml = new VoiceResponse()

    // Mensaje de bienvenida
    twiml.say({
      voice: 'Polly.Joanna-Neural',
      language: 'es-ES'
    }, 'Hola, te estoy conectando con AutoBox Manacor. Un momento por favor.')

    // Intentar conectar con ElevenLabs Agent
    try {
      // TODO: Implementar streaming hacia ElevenLabs
      const connect = twiml.connect()
      connect.stream({
        url: `wss://${request.headers.get('host')}/api/twilio/stream`,
        name: 'elevenlabs-stream'
      })

    } catch (error) {
      console.error('❌ Error connecting to ElevenLabs:', error)
      
      // Fallback: Redireccionar a móvil
      twiml.say({
        voice: 'Polly.Joanna-Neural', 
        language: 'es-ES'
      }, 'Te estoy redirigiendo con nuestro especialista.')
      
      twiml.dial(process.env.MOBILE_FALLBACK_NUMBER || '+34600000000')
    }

    // Registrar llamada en base de datos
    // TODO: Guardar en DB con WebSocket notification

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })

  } catch (error) {
    console.error('❌ Twilio webhook error:', error)
    
    const twiml = new VoiceResponse()
    twiml.say('Lo siento, hay un problema técnico. Inténtalo más tarde.')
    twiml.hangup()

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  }
} 