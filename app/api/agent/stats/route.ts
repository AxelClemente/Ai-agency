import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsApiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Obtener agentes desde ElevenLabs API
    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      method: 'GET',
      headers: {
        'xi-api-key': elevenLabsApiKey,
      },
    });

    if (!response.ok) {
      console.error('ElevenLabs API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch agents from ElevenLabs' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📡 ElevenLabs agents response:', data);

    const elevenlabsAgents = data.agents || [];

    // Transformar agentes de ElevenLabs al formato esperado por el frontend
    const agentStats = await Promise.all(
      elevenlabsAgents.map(async (agent: unknown) => {
        const ag = agent as { agent_id: string; name: string };
        const conversationCount = await prisma.conversation.count({
          where: {
            userId: userId,
            agentId: ag.agent_id
          }
        });

        return {
          id: ag.agent_id,
          name: ag.name,
          description: ag.name, // ElevenLabs no devuelve description en el list, usamos name
          image: '/placeholder.svg?height=32&width=32', // Placeholder image
          category: 'AI Agent', // Categoría por defecto
          status: 'active' as const, // Los agentes de ElevenLabs se consideran activos
          calls: conversationCount
        };
      })
    );

    console.log('✅ Transformed agents:', agentStats.length);

    return NextResponse.json({ 
      success: true, 
      agents: agentStats 
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de agentes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 