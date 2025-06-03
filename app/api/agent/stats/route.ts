import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAllAgents } from '@/lib/agents';

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

    // Obtener todos los agentes configurados
    const agents = getAllAgents();

    // Obtener estadísticas de conversaciones por agente
    const agentStats = await Promise.all(
      agents.map(async (agent) => {
        const conversationCount = await prisma.conversation.count({
          where: {
            userId: userId,
            agentId: agent.id
          }
        });

        return {
          ...agent,
          calls: conversationCount
        };
      })
    );

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