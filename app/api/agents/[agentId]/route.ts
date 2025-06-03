import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  console.log('🔍 GET Agent - Agent ID:', agentId);
  
  try {
    if (!agentId) {
      console.log('❌ No agent ID provided');
      return NextResponse.json({ error: 'Agent ID requerido' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.log('❌ No ElevenLabs API key found');
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    console.log('📡 Fetching agent config from ElevenLabs...');
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 ElevenLabs response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ ElevenLabs error:', errorBody);
      return NextResponse.json({ 
        error: 'Error obteniendo configuración del agente',
        details: errorBody 
      }, { status: response.status });
    }

    const agentData = await response.json();
    console.log('✅ Agent data received:', {
      agentId: agentData.agent_id,
      name: agentData.name,
      hasPrompt: !!agentData.conversation_config?.agent?.prompt?.prompt,
      hasFirstMessage: !!agentData.conversation_config?.agent?.first_message
    });
    
    return NextResponse.json({ 
      success: true, 
      agent: agentData 
    });

  } catch (error) {
    console.error('💥 Error in GET agent:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  console.log('🔧 PATCH Agent - Agent ID:', agentId);
  
  try {
    const { firstMessage, systemPrompt } = await req.json();
    
    console.log('📝 Update data:', {
      agentId,
      firstMessage: firstMessage?.substring(0, 50) + '...',
      systemPrompt: systemPrompt?.substring(0, 50) + '...'
    });

    // Validaciones básicas
    if (!agentId) {
      console.log('❌ No agent ID provided');
      return NextResponse.json({ error: 'Agent ID requerido' }, { status: 400 });
    }

    if (typeof firstMessage !== 'string' || typeof systemPrompt !== 'string') {
      console.log('❌ Invalid data types');
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    if (firstMessage.length > 1000 || systemPrompt.length > 5000) {
      console.log('❌ Content too long');
      return NextResponse.json({ 
        error: 'Contenido demasiado largo. First message: máx 1000 chars, System prompt: máx 5000 chars' 
      }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.log('❌ No ElevenLabs API key found');
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    console.log('📡 Updating agent in ElevenLabs...');
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      method: 'PATCH',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation_config: {
          agent: {
            first_message: firstMessage,
            prompt: {
              prompt: systemPrompt
            }
          }
        }
      })
    });

    console.log('📡 ElevenLabs update response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ ElevenLabs update error:', errorBody);
      return NextResponse.json({ 
        error: 'Error actualizando agente en ElevenLabs',
        details: errorBody 
      }, { status: response.status });
    }

    const updatedAgent = await response.json();
    console.log('✅ Agent updated successfully');
    
    return NextResponse.json({ 
      success: true, 
      agent: updatedAgent,
      message: 'Agente actualizado correctamente'
    });

  } catch (error) {
    console.error('💥 Error in PATCH agent:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 