// pages/api/saveTranscript.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Message, ConversationMetrics, ConversationStatus, ConversationMetadata } from '@/types/conversation';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    let { 
      transcript, 
      userId, 
      agentId,
      duration,
      cost,
      status,
      messages = [],
      metadata 
    } = await request.json();

    if (!transcript || !userId || !agentId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (transcript, userId, agentId)' },
        { status: 400 }
      );
    }

    // Validación de tipos en runtime
    if (!Array.isArray(messages)) {
      console.warn('Messages no es un array:', messages);
      messages = [];
    }

    // Calculamos métricas agregadas con validación
    const metrics: ConversationMetrics = {
      totalLatency: messages.length ? messages.reduce((acc: number, msg: Message) => acc + (msg.latency || 0), 0) : 0,
      averageLatency: messages.length ? messages.reduce((acc: number, msg: Message) => acc + (msg.latency || 0), 0) / messages.length : 0,
      messageCount: messages.length,
      creditsUsed: cost || 0,
      costPerMinute: duration ? (cost || 0) / (duration / 60) : 0,
      totalTokens: metadata?.totalTokens || 0,
      sentiment: metadata?.sentiment
    };

    const conversationMetadata: ConversationMetadata = {
      startedAt: new Date(metadata?.startedAt || Date.now()),
      endedAt: new Date(metadata?.endedAt || Date.now()),
      isSpeaking: metadata?.isSpeaking || false,
      systemInfo: {
        version: '1.0',
        timestamp: new Date(),
      },
      userIntent: metadata?.userIntent,
      topics: metadata?.topics
    };

    const convo = await prisma.conversation.create({
      data: {
        transcript,
        userId,
        agentId,
        duration,
        cost: cost || 0,
        status: status as ConversationStatus,
        startedAt: conversationMetadata.startedAt,
        endedAt: conversationMetadata.endedAt,
        messages,
        metrics,
        metadata: conversationMetadata
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: convo.id,
      message: 'Conversación guardada exitosamente',
      metrics
    });
  } catch (error) {
    console.error('Error completo al guardar transcript:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
