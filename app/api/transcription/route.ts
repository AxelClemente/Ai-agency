// pages/api/saveTranscript.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Message, ConversationMetrics, ConversationStatus, ConversationMetadata } from '@/types/conversation';

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
    const safeMessages = Array.isArray(messages) ? messages : [];

    // Calculamos métricas agregadas con validación
    const metrics: ConversationMetrics = {
      totalLatency: safeMessages.length ? safeMessages.reduce((acc: number, msg: Message) => acc + (msg.latency || 0), 0) : 0,
      averageLatency: safeMessages.length ? safeMessages.reduce((acc: number, msg: Message) => acc + (msg.latency || 0), 0) / safeMessages.length : 0,
      messageCount: safeMessages.length,
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

    // Convertir a JSON plano para Prisma
    const metricsPlain = JSON.parse(JSON.stringify(metrics));
    const metadataPlain = JSON.parse(JSON.stringify(conversationMetadata));

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
        messages: safeMessages,
        metrics: metricsPlain,
        metadata: metadataPlain
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
