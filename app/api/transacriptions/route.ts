// pages/api/saveTranscript.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { transcript, userId } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Sin datos' },
        { status: 400 }
      );
    }

    const convo = await prisma.conversation.create({
      data: {
        transcript,
        userId
      }
    });

    return NextResponse.json({ success: true, id: convo.id });
  } catch (error) {
    console.error('Error saving transcript:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
