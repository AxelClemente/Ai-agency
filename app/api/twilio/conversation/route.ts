import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

// Agent ID mapping
const AGENT_IDS = {
  support: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT,
  clinica: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA,
  hosteleria: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
  realstate: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE
};

// Agent names for logging
const AGENT_NAMES = {
  support: 'Soporte General',
  clinica: 'Clínica Médica',
  hosteleria: 'Hostelería',
  realstate: 'Inmobiliaria'
};

export async function POST(request: NextRequest) {
  console.log('🎙️ Starting conversation with selected agent');
  
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const selectedAgent = url.searchParams.get('agent') || 'support';
    const callSid = url.searchParams.get('callSid');
    const from = url.searchParams.get('from');
    
    // Parse form data for speech result (if coming from speech processing)
    const formData = await request.formData();
    const speechResult = formData.get('SpeechResult') as string;
    
    const agentId = AGENT_IDS[selectedAgent as keyof typeof AGENT_IDS];
    const agentName = AGENT_NAMES[selectedAgent as keyof typeof AGENT_NAMES];
    
    console.log('📞 Conversation details:', {
      selectedAgent,
      agentId,
      agentName,
      callSid,
      from,
      speechResult,
      timestamp: new Date().toISOString()
    });

    // Create TwiML response
    const twiml = new VoiceResponse();
    
    if (!speechResult) {
      // First interaction - natural agent introduction
      let greeting = '';
      
      if (selectedAgent === 'hosteleria') {
        greeting = '¡Hola! Soy el asistente especializado en hostelería de nuestra agencia de inteligencia artificial. Puedo ayudarle con sistemas de reservas, chatbots para hoteles, análisis de ocupación y más. ¿En qué puedo asistirle?';
      } else {
        greeting = `¡Hola! Soy su especialista en ${agentName}. ¿En qué puedo ayudarle hoy?`;
      }
      
      twiml.say({
        voice: 'alice',
        language: 'es-ES'
      }, greeting);
      
      // Pause to let them process
      twiml.pause({ length: 2 });
      
      // Gather user input
      const gather = twiml.gather({
        input: ['speech'],
        language: 'es-ES',
        speechTimeout: 'auto',
        action: `/api/twilio/conversation?agent=${selectedAgent}&callSid=${callSid}&from=${from}`,
        method: 'POST',
        timeout: 15 // More time for them to think
      });
      
      gather.say({
        voice: 'alice',
        language: 'es-ES'
      }, 'Por favor, cuénteme qué necesita o en qué puedo ayudarle.');
      
      // Fallback if no speech
      twiml.say({
        voice: 'alice',
        language: 'es-ES'
      }, 'No he recibido respuesta. Si necesita ayuda, puede llamarnos de nuevo. Gracias y que tenga un buen día.');
      
    } else {
      // Process speech with selected agent
      console.log('🎤 Processing user speech:', speechResult);
      const aiResponse = await processWithSelectedAgent(speechResult, selectedAgent, callSid || 'unknown');
      
      // Return AI response
      twiml.say({
        voice: 'alice',
        language: 'es-ES'
      }, aiResponse);
      
      // Ask if they need anything else
      twiml.pause({ length: 2 });
      
      const gather = twiml.gather({
        input: ['speech'],
        language: 'es-ES',
        speechTimeout: 'auto',
        action: `/api/twilio/conversation?agent=${selectedAgent}&callSid=${callSid}&from=${from}`,
        method: 'POST',
        timeout: 10
      });
      
      gather.say({
        voice: 'alice',
        language: 'es-ES'
      }, '¿Necesita algo más o tiene alguna otra consulta?');
      
      // Final goodbye
      twiml.say({
        voice: 'alice',
        language: 'es-ES'
      }, `Ha sido un placer atenderle. Gracias por contactar con nuestros servicios de ${agentName}. ¡Que tenga un excelente día!`);
    }
    
    // Log the TwiML response
    console.log('📋 Agent conversation TwiML:', twiml.toString());
    
    // Save conversation to database
    await saveAgentConversation(callSid || 'unknown', selectedAgent, speechResult, from || 'unknown');
    
    // Return TwiML response
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
    
  } catch (error) {
    console.error('❌ Error in agent conversation:', error);
    
    // Return error TwiML
    const errorTwiml = new VoiceResponse();
    errorTwiml.say({
      voice: 'alice',
      language: 'es-ES'
    }, 'Lo siento, ha ocurrido un error con nuestro especialista. Por favor, inténtelo de nuevo más tarde.');
    
    return new NextResponse(errorTwiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

async function processWithSelectedAgent(userMessage: string, agentType: string, callSid: string): Promise<string> {
  console.log('🤖 Processing with selected agent:', { agentType, userMessage });
  
  const agentId = AGENT_IDS[agentType as keyof typeof AGENT_IDS];
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!agentId || !apiKey) {
    console.log('⚠️ ElevenLabs not configured for agent:', agentType);
    return generateAgentFallbackResponse(userMessage, agentType);
  }
  
  console.log('📞 Using agent for phone call:', { agentType, agentId });
  
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
        mode: 'text_mode'
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
    
    const aiResponse = messageResult.message || messageResult.text || 'Lo siento, no he podido procesar su consulta correctamente.';
    
    return aiResponse;
    
  } catch (error) {
    console.error('❌ ElevenLabs integration error:', error);
    return generateAgentFallbackResponse(userMessage, agentType);
  }
}

function generateAgentFallbackResponse(userMessage: string, agentType: string): string {
  const message = userMessage.toLowerCase();
  
  // Agent-specific responses
  switch (agentType) {
    case 'clinica':
      if (message.includes('cita') || message.includes('consulta')) {
        return 'Para agendar una cita médica, nuestros especialistas están disponibles de lunes a viernes. Le recomiendo que llame directamente a nuestra clínica para coordinar una consulta personalizada.';
      }
      return 'Somos especialistas en servicios de salud digital. Ofrecemos telemedicina, análisis de datos médicos e IA para diagnósticos. ¿Le interesa algún servicio específico?';
      
    case 'hosteleria':
      if (message.includes('reserva') || message.includes('hotel')) {
        return 'Nuestras soluciones para hostelería incluyen sistemas de reservas inteligentes, chatbots para atención al cliente y análisis predictivo de ocupación. ¿Necesita ayuda con algún aspecto específico?';
      }
      return 'Especializados en tecnología para el sector hostelero: reservas automatizadas, gestión de huéspedes con IA, y optimización de ingresos. ¿En qué podemos ayudarle?';
      
    case 'realstate':
      if (message.includes('casa') || message.includes('piso') || message.includes('inmueble')) {
        return 'Ofrecemos soluciones de IA para el sector inmobiliario: valoraciones automáticas, matching de propiedades, y chatbots especializados. ¿Busca alguna propiedad o es profesional del sector?';
      }
      return 'Somos expertos en tecnología inmobiliaria: análisis de mercado con IA, tours virtuales, y sistemas de gestión inteligente. ¿Le interesa alguna solución específica?';
      
    default: // support
      if (message.includes('precio') || message.includes('costo')) {
        return 'Nuestros servicios de IA tienen precios competitivos. Ofrecemos desde chatbots básicos hasta soluciones empresariales completas. Le recomiendo una consulta gratuita para evaluar sus necesidades.';
      }
      return `Entiendo su interés en "${userMessage}". Como agencia de IA, podemos ayudarle con chatbots, análisis de datos, automatización y más. ¿Le gustaría agendar una consulta?`;
  }
}

async function saveAgentConversation(callSid: string, agentType: string, userMessage: string, from: string) {
  try {
    console.log('💾 Saving agent conversation:', { callSid, agentType, userMessage, from });
    console.log('✅ Agent conversation logged successfully');
  } catch (error) {
    console.error('❌ Error saving agent conversation:', error);
  }
} 