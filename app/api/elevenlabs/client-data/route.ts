import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🍕 ElevenLabs requesting client data - Connecting to Hospitality Agent');
  
  try {
    const body = await request.json();
    console.log('📞 ElevenLabs phone call initiated:', {
      caller_id: body.caller_id,
      agent_id: body.agent_id,
      called_number: body.called_number,
      call_sid: body.call_sid,
      timestamp: new Date().toISOString()
    });
    
    // Usar SIEMPRE el agente de hostelería
    const hospitalityAgentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    const customerPhone = body.caller_id || "+34640182728";
    const callSid = body.call_sid || "unknown";
    
    console.log('🍕 Preparing conversation data for Pizza Posta hospitality (hostelería agent)');
    
    // FORMATO OFICIAL SEGÚN DOCUMENTACIÓN ELEVENLABS
    const response = {
      type: "conversation_initiation_client_data",
      dynamic_variables: {
        customer_phone: customerPhone,
        call_id: callSid,
        restaurant_name: "Pizza Posta",
        business_type: "Italian Restaurant",
        services_available: "delivery, takeaway, reservations",
        current_time: new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
      },
      conversation_config_override: {
        agent: {
          agent_id: hospitalityAgentId,
          prompt: {
            prompt: `Eres el asistente de IA de Pizza Posta, un restaurante italiano especializado en pizzas artesanales.\n\nEl cliente te está llamando desde el número: ${customerPhone}\nID de llamada: ${callSid}\n\nTu trabajo es:\n- Ayudar con pedidos de pizza y comida italiana\n- Gestionar reservas de mesa\n- Proporcionar información sobre el menú y precios\n- Ser amable, eficiente y profesional\n- Hablar en español de forma natural y cercana\n\nEl restaurante ofrece:\n- Delivery y takeaway\n- Reservas para comer en el local\n- Pizzas artesanales, pasta, ensaladas\n- Horario: Martes a Domingo 12:00-23:00\n\nSi el cliente quiere hacer un pedido, toma todos los detalles y confirma la dirección de entrega.`
          },
          first_message: "¡Hola! Gracias por llamar a Pizza Posta. Soy tu asistente de IA. ¿En qué puedo ayudarte hoy? ¿Quieres hacer un pedido, una reserva, o necesitas información sobre nuestro menú?",
          language: "es"
        }
      }
    };
    
    console.log('✅ Returning official ElevenLabs format (hostelería agent)');
    console.log('📋 Response preview:', {
      type: response.type,
      agent_id: hospitalityAgentId,
      dynamic_variables_count: Object.keys(response.dynamic_variables).length,
      has_override: !!response.conversation_config_override
    });
    
    // Guardar información de la llamada
    await savePhoneCallInfo(callSid, customerPhone, body.called_number, 'hosteleria');
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Error processing ElevenLabs client data request:', error);
    
    // Fallback con formato oficial y agente de hostelería
    const hospitalityAgentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    const fallbackResponse = {
      type: "conversation_initiation_client_data",
      dynamic_variables: {
        customer_phone: "+34640182728",
        restaurant_name: "Pizza Posta"
      },
      conversation_config_override: {
        agent: {
          agent_id: hospitalityAgentId,
          first_message: "¡Hola! Gracias por llamar a Pizza Posta. ¿En qué puedo ayudarte?",
          language: "es"
        }
      }
    };
    
    return NextResponse.json(fallbackResponse);
  }
}

async function savePhoneCallInfo(callSid: string, from: string, to: string, agentType: string) {
  try {
    console.log('💾 Saving phone call info:', {
      callSid,
      from,
      to,
      agentType,
      source: 'elevenlabs_phone_native_official',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Phone call info logged successfully');
    
  } catch (error) {
    console.error('❌ Error saving phone call info:', error);
  }
} 