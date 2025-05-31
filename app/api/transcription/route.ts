// pages/api/saveTranscript.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { 
      transcript, 
      userId, 
      agentId,
      duration,
      cost,
      status,
      metadata 
    } = await request.json();

    if (!transcript || !userId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const convo = await prisma.conversation.create({
      data: {
        transcript,
        userId,
        agentId,
        duration: duration || 0,
        cost: cost || 0,
        status: status || 'completed',
        startedAt: new Date(metadata?.startedAt || Date.now()),
        endedAt: new Date(metadata?.endedAt || Date.now()),
        metadata: metadata || {}
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: convo.id,
      message: 'Conversación guardada exitosamente' 
    });
  } catch (error) {
    console.error('Error saving transcript:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
