import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: NextRequest) {
  console.log('🎙️ Processing speech with ElevenLabs integration');
  
  try {
    // Parse the form data from Twilio
    const formData = await request.formData();
    const speechResult = formData.get('SpeechResult') as string;
    const callSid = formData.get('CallSid') as string;
    const from = formData.get('From') as string;
    
    // Get URL parameters
    const url = new URL(request.url);
    const fromParam = url.searchParams.get('from');
    const callSidParam = url.searchParams.get('callSid');
    
    console.log('📝 Speech processing:', {
      speechResult,
      callSid: callSid || callSidParam,
      from: from || fromParam,
      timestamp: new Date().toISOString()
    });

    // Create TwiML response
    const twiml = new VoiceResponse();
    
    if (!speechResult || speechResult.trim() === '') {
      // No speech detected
      twiml.say({
        voice: 'alice',
        language: 'es-ES'
      }, 'No he podido escuchar su consulta. Gracias por llamar. Hasta luego.');
      
    } else {
      // Process speech with ElevenLabs
      const aiResponse = await processWithElevenLabs(speechResult, callSid || callSidParam || 'unknown');
      
      // Return AI response
      twiml.say({
        voice: 'alice',
        language: 'es-ES'
      }, aiResponse);
      
      // Ask if they need anything else
      twiml.pause({ length: 1 });
      
      const gather = twiml.gather({
        input: ['speech'],
        language: 'es-ES',
        speechTimeout: 'auto',
        action: `/api/twilio/process-speech?callSid=${callSid || callSidParam}&from=${from || fromParam}`,
        method: 'POST',
        timeout: 5
      });
      
      gather.say({
        voice: 'alice',
        language: 'es-ES'
      }, '¿Hay algo más en lo que pueda ayudarle?');
      
      // Final fallback
      twiml.say({
        voice: 'alice',
        language: 'es-ES'
      }, 'Gracias por contactar con nuestra agencia de inteligencia artificial. ¡Que tenga un buen día!');
    }
    
    // Log the TwiML response
    console.log('📋 AI Response TwiML:', twiml.toString());
    
    // Save conversation to database
    await saveConversation(callSid || callSidParam || 'unknown', speechResult, 'phone');
    
    // Return TwiML response
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
    
  } catch (error) {
    console.error('❌ Error processing speech:', error);
    
    // Return error TwiML
    const errorTwiml = new VoiceResponse();
    errorTwiml.say({
      voice: 'alice',
      language: 'es-ES'
    }, 'Lo siento, ha ocurrido un error procesando su consulta. Por favor, inténtelo de nuevo más tarde.');
    
    return new NextResponse(errorTwiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

async function processWithElevenLabs(userMessage: string, callSid: string): Promise<string> {
  console.log('🤖 Processing with ElevenLabs:', userMessage);
  
  // Use Support agent for phone calls (most generic)
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!agentId || !apiKey) {
    console.log('⚠️ ElevenLabs not configured, using fallback response');
    console.log('Missing:', { agentId: !!agentId, apiKey: !!apiKey });
    return generateFallbackResponse(userMessage);
  }
  
  console.log('📞 Using Support agent for phone call:', agentId);
  
  try {
    // Create conversation with ElevenLabs
    const conversationResponse = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        agent_id: agentId,
        mode: 'text_mode'  // Use text mode for simpler integration
      })
    });
    
    if (!conversationResponse.ok) {
      throw new Error(`Failed to create conversation: ${conversationResponse.status}`);
    }
    
    const conversation = await conversationResponse.json();
    const conversationId = conversation.conversation_id;
    
    console.log('✅ Created ElevenLabs conversation:', conversationId);
    
    // Send message to ElevenLabs
    const messageResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        message: userMessage,
        mode: 'text_mode'
      })
    });
    
    if (!messageResponse.ok) {
      throw new Error(`Failed to send message: ${messageResponse.status}`);
    }
    
    const messageResult = await messageResponse.json();
    console.log('🎯 ElevenLabs response:', messageResult);
    
    // Extract the text response
    const aiResponse = messageResult.message || messageResult.text || 'Lo siento, no he podido procesar su consulta correctamente.';
    
    return aiResponse;
    
  } catch (error) {
    console.error('❌ ElevenLabs integration error:', error);
    return generateFallbackResponse(userMessage);
  }
}

function generateFallbackResponse(userMessage: string): string {
  // Simple keyword-based responses as fallback
  const message = userMessage.toLowerCase();
  
  if (message.includes('precio') || message.includes('costo') || message.includes('cuanto')) {
    return 'Nuestros servicios de inteligencia artificial tienen precios competitivos. Le recomiendo que visite nuestro sitio web o solicite una consulta personalizada para obtener un presupuesto detallado.';
  }
  
  if (message.includes('servicio') || message.includes('que hacen') || message.includes('ofrecen')) {
    return 'Ofrecemos soluciones completas de inteligencia artificial: chatbots conversacionales, análisis de datos, automatización de procesos, y dashboards inteligentes. ¿Le interesa algún servicio en particular?';
  }
  
  if (message.includes('cita') || message.includes('reunion') || message.includes('contacto')) {
    return 'Perfecto, estaremos encantados de reunirnos con usted. Puede contactarnos a través de nuestro sitio web o llamarnos para coordinar una cita. ¿Prefiere una reunión presencial o virtual?';
  }
  
  // Default response
  return `Entiendo que está interesado en "${userMessage}". Somos una agencia especializada en soluciones de inteligencia artificial. Le recomiendo que visite nuestro sitio web para más información, o podemos coordinar una llamada para discutir sus necesidades específicas.`;
}

async function saveConversation(callSid: string, userMessage: string, source: string) {
  try {
    console.log('💾 Saving phone conversation:', { callSid, userMessage, source });
    
    // Here we would save to the same database structure as web conversations
    // For now, just log it
    console.log('✅ Phone conversation logged successfully');
    
  } catch (error) {
    console.error('❌ Error saving phone conversation:', error);
  }
} 