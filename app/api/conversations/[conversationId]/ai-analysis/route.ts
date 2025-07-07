import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversationWithAI, validateAnalysisResponse } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'

// Interfaz para el resultado del análisis
interface PizzeriaAnalysisResult {
  type: 'order' | 'reservation' | 'information';
  items?: Array<{ product: string; quantity: number }>;
  order_type?: string;
  name?: string;
  date?: string;
  time?: string;
  people?: number;
  contact?: string;
  notes?: string;
  customer_name?: string;
  tableType?: string;
}

// Normalizador de reservas para limpiar valores 'not provided' o vacíos
function normalizeReservation(reservation: PizzeriaAnalysisResult) {
  if (!reservation) return undefined;
  return {
    date: reservation.date && reservation.date !== 'not provided' ? reservation.date : undefined,
    time: reservation.time && reservation.time !== 'not provided' ? reservation.time : undefined,
    people: reservation.people ? reservation.people : undefined,
    name: reservation.name && reservation.name !== 'not provided' ? reservation.name : undefined,
    contact: reservation.contact && reservation.contact !== 'not provided' ? reservation.contact : undefined,
    notes: reservation.notes && reservation.notes !== 'not provided' ? reservation.notes : undefined,
    tableType: reservation.tableType && reservation.tableType !== 'not provided' ? reservation.tableType : undefined,
  };
}

// Real AI analysis using OpenAI GPT-4o
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = params
    const { transcript, conversationDate } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 })
    }

    // Verificar que la conversación existe y pertenece al usuario
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Analizar la transcripción con OpenAI
    console.log(`🧠 Analyzing conversation ${conversationId}...`)
    const analysisResult = await analyzePizzeriaTranscript(transcript, conversationDate) as PizzeriaAnalysisResult
    console.log(`✅ Analysis completed for ${conversationId}:`, analysisResult)

    // Extraer datos del análisis
    const isOrder = analysisResult.type === 'order'
    const isReservation = analysisResult.type === 'reservation'

    // Preparar datos para la base de datos
    const products = isOrder && analysisResult.items ? analysisResult.items.map((item) => ({
      name: item.product,
      quantity: item.quantity || 1,
      price: null // Se calculará después con la tabla de precios
    })) : []

    const reservation = isReservation ? normalizeReservation(analysisResult) : null

    // Calcular total aproximado (usando precios del menú)
    const MENU_PRICES: Record<string, number> = {
      "Napolitana": 18.50,
      "Margarita": 16.00,
      "4 Quesos": 20.00,
      "Fugazzeta": 19.50,
      "Marinara": 15.00,
      "Capuleto": 22.00,
      "Bryan": 23.00,
      "Beer": 3.50,
      "Soft drinks": 2.50,
      "Cheesecake with Jam": 6.00,
      "Tiramisú": 7.00
    }

    const totalAmount = products.reduce((sum: number, product) => {
      const price = MENU_PRICES[product.name] || 0
      return sum + (price * product.quantity)
    }, 0)

    // Determinar tipo de pedido y resultado
    const orderType = isOrder ? (analysisResult.order_type || 'pickup') : null
    const customerIntent = isOrder ? 'order' : isReservation ? 'reservation' : 'information'
    const outcome = isOrder ? 'completed_order' : isReservation ? 'completed_reservation' : 'information_only'

    // Guardar análisis en la base de datos
    const restaurantAnalysis = await prisma.restaurantAnalysis.upsert({
      where: {
        conversationId: conversationId
      },
      update: {
        products: products,
        orderType: orderType,
        totalAmount: totalAmount,
        reservation: reservation,
        customerName: analysisResult.customer_name || analysisResult.name,
        customerPhone: analysisResult.contact,
        customerIntent: customerIntent,
        outcome: outcome,
        sentiment: 'positive', // Por defecto, se puede mejorar con análisis de sentimiento
        updatedAt: new Date()
      },
      create: {
        conversationId: conversationId,
        userId: session.user.id,
        agentId: conversation.agentId,
        timestamp: conversation.startedAt,
        duration: conversation.duration,
        products: products,
        orderType: orderType,
        totalAmount: totalAmount,
        reservation: reservation,
        customerName: analysisResult.customer_name || analysisResult.name,
        customerPhone: analysisResult.contact,
        customerIntent: customerIntent,
        outcome: outcome,
        sentiment: 'positive'
      }
    })

    console.log(`💾 Analysis saved to database for conversation ${conversationId}`)

    return NextResponse.json({
      success: true,
      analysis: restaurantAnalysis,
      rawAnalysis: analysisResult
    })

  } catch (error) {
    console.error('Error in AI analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze conversation' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = params

    // Buscar análisis existente
    const analysis = await prisma.restaurantAnalysis.findFirst({
      where: {
        conversationId: conversationId,
        userId: session.user.id
      }
    })

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
} 