import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { prisma } from '@/lib/prisma';
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai';
import { mockConversations } from '@/lib/mock-conversations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params;
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Soporte para mocks
    if (conversationId.startsWith('mock-')) {
      const mock = mockConversations.find(m => m.id === conversationId);
      if (!mock) {
        return NextResponse.json({ error: 'Mock conversation not found' }, { status: 404 });
      }

      // Generar transcript para el análisis
      const transcript = mock.messages.map(m => `${m.role === 'agente' ? 'Agente' : 'Cliente'}: ${m.message}`).join('\n');
      const analysisResult = await analyzePizzeriaTranscript(transcript);

      // Mapear productos
      const products =
        analysisResult.products && Array.isArray(analysisResult.products) && analysisResult.products.length > 0
          ? analysisResult.products
          : (analysisResult.items && Array.isArray(analysisResult.items) && analysisResult.items.length > 0
              ? analysisResult.items
              : []);

      // Simular objeto de análisis (no guardar en DB)
      const restaurantAnalysis = {
        id: 'mock-analysis-' + mock.id,
        conversationId: mock.id,
        userId: 'mock-user',
        agentId: 'mock-agent',
        timestamp: mock.messages[0]?.timestamp || '',
        duration: mock.messages.length * 10,
        products,
        orderType: analysisResult.orderType || analysisResult.order_type,
        totalAmount: analysisResult.totalAmount,
        reservation: analysisResult.reservation,
        customerName: analysisResult.customerName || analysisResult.customer_name,
        customerPhone: analysisResult.customerPhone || analysisResult.contact,
        customerAddress: analysisResult.customerAddress,
        customerIntent: analysisResult.customerIntent,
        outcome: analysisResult.outcome,
        sentiment: analysisResult.sentiment,
        specialRequests: analysisResult.specialRequests,
        paymentMethod: analysisResult.paymentMethod,
        estimatedTime: analysisResult.estimatedTime,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        message: 'Mock analysis completed',
        analysis: restaurantAnalysis
      });
    }

    // Obtener la conversación y verificar que pertenece al usuario
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        user: {
          email: session.user.email
        }
      },
      include: {
        user: true
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Verificar si ya existe un análisis
    const existingAnalysis = await prisma.restaurantAnalysis.findUnique({
      where: { conversationId }
    });

    if (existingAnalysis) {
      return NextResponse.json({ 
        message: 'Analysis already exists',
        analysis: existingAnalysis 
      });
    }

    // Analizar la transcripción usando OpenAI
    const analysisResult = await analyzePizzeriaTranscript(conversation.transcript);
    console.log('[DEBUG] analysisResult:', analysisResult);

    // Mapear items a products para guardar correctamente
    const products =
      analysisResult.products && Array.isArray(analysisResult.products) && analysisResult.products.length > 0
        ? analysisResult.products
        : (analysisResult.items && Array.isArray(analysisResult.items) && analysisResult.items.length > 0
            ? analysisResult.items
            : []);

    // Crear el análisis en la base de datos
    const restaurantAnalysis = await prisma.restaurantAnalysis.create({
      data: {
        conversationId,
        userId: conversation.userId,
        agentId: conversation.agentId,
        timestamp: conversation.startedAt,
        duration: conversation.duration,
        products,
        orderType: analysisResult.orderType || analysisResult.order_type,
        totalAmount: analysisResult.totalAmount,
        reservation: analysisResult.reservation,
        customerName: analysisResult.customerName || analysisResult.customer_name,
        customerPhone: analysisResult.customerPhone || analysisResult.contact,
        customerAddress: analysisResult.customerAddress,
        customerIntent: analysisResult.customerIntent,
        outcome: analysisResult.outcome,
        sentiment: analysisResult.sentiment,
        specialRequests: analysisResult.specialRequests,
        paymentMethod: analysisResult.paymentMethod,
        estimatedTime: analysisResult.estimatedTime
      }
    });
    console.log('[DEBUG] restaurantAnalysis saved:', restaurantAnalysis);

    return NextResponse.json({
      message: 'Analysis completed successfully',
      analysis: restaurantAnalysis
    });

  } catch (error) {
    console.error('Error analyzing restaurant conversation:', error);
    return NextResponse.json(
      { error: 'Failed to analyze conversation' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params;
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Soporte para mocks
    if (conversationId.startsWith('mock-')) {
      const mock = mockConversations.find(m => m.id === conversationId);
      if (!mock) {
        return NextResponse.json({ error: 'Mock conversation not found' }, { status: 404 });
      }

      // Generar transcript para el análisis
      const transcript = mock.messages.map(m => `${m.role === 'agente' ? 'Agente' : 'Cliente'}: ${m.message}`).join('\n');
      const analysisResult = await analyzePizzeriaTranscript(transcript);

      // Mapear productos
      const products =
        analysisResult.products && Array.isArray(analysisResult.products) && analysisResult.products.length > 0
          ? analysisResult.products
          : (analysisResult.items && Array.isArray(analysisResult.items) && analysisResult.items.length > 0
              ? analysisResult.items
              : []);

      // Simular objeto de análisis (no guardar en DB)
      const restaurantAnalysis = {
        id: 'mock-analysis-' + mock.id,
        conversationId: mock.id,
        userId: 'mock-user',
        agentId: 'mock-agent',
        timestamp: mock.messages[0]?.timestamp || '',
        duration: mock.messages.length * 10,
        products,
        orderType: analysisResult.orderType || analysisResult.order_type,
        totalAmount: analysisResult.totalAmount,
        reservation: analysisResult.reservation,
        customerName: analysisResult.customerName || analysisResult.customer_name,
        customerPhone: analysisResult.customerPhone || analysisResult.contact,
        customerAddress: analysisResult.customerAddress,
        customerIntent: analysisResult.customerIntent,
        outcome: analysisResult.outcome,
        sentiment: analysisResult.sentiment,
        specialRequests: analysisResult.specialRequests,
        paymentMethod: analysisResult.paymentMethod,
        estimatedTime: analysisResult.estimatedTime,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({ analysis: restaurantAnalysis });
    }

    // Obtener el análisis existente
    const analysis = await prisma.restaurantAnalysis.findFirst({
      where: {
        conversationId,
        user: {
          email: session.user.email
        }
      }
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Error fetching restaurant analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
} 