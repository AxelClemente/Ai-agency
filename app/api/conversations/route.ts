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