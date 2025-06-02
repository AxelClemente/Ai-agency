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

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        startedAt: 'desc'
      },
      select: {
        id: true,
        agentId: true,
        duration: true,
        status: true,
        startedAt: true,
        endedAt: true,
        cost: true,
        transcript: true,
        messages: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      conversations 
    });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: 'conversationId y userId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la conversación pertenece al usuario
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: userId
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada o no autorizada' },
        { status: 404 }
      );
    }

    // Eliminar la conversación
    await prisma.conversation.delete({
      where: {
        id: conversationId
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Conversación eliminada correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar conversación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 