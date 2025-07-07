import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai';
import { mockConversations } from '@/lib/mock-conversations';

// Cache para análisis de mocks
const mockAnalysisCache = new Map();

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Processing ONLY mock conversations for analytics...');
    
    // Limpiar cache para forzar reprocesamiento
    mockAnalysisCache.clear();
    console.log('🧹 Mock analysis cache cleared');

    // Procesar solo los mocks de conversaciones (no reservas)
    const mockConversationIds = mockConversations
      .filter(conv => conv.id.startsWith('mock-') && conv.type === 'pedido')
      .map(conv => conv.id);

    console.log(`🧠 Processing ${mockConversationIds.length} mock conversations for products analytics...`);

    const productsWithMeta: Array<{ 
      name: string; 
      quantity: number; 
      conversationId: string; 
      date: string; 
      duration: number 
    }> = [];

    // Analizar cada mock conversation
    for (const mockId of mockConversationIds) {
      console.log(`🧠 Analyzing mock conversation ${mockId}...`);
      
      const mock = mockConversations.find(conv => conv.id === mockId);
      if (!mock || !mock.messages || mock.messages.length === 0) {
        console.log(`⚠️ Skipping ${mockId}: no messages`);
        continue;
      }

      // Extraer fecha de la conversación del primer mensaje
      const firstMessage = mock.messages[0];
      const conversationDate = firstMessage.timestamp ? 
        new Date(firstMessage.timestamp).toISOString().slice(0, 10) : 
        '2025-07-01'; // fallback

      console.log(`📅 Mock ${mockId} conversation date: ${conversationDate}`);
      console.log(`📅 Using conversation date: ${conversationDate}`);

      try {
        // Analizar con OpenAI
        const analysisResult = await analyzePizzeriaTranscript(
          mock.messages.map((m: { message: string }) => m.message).join('\n'),
          conversationDate
        );

        console.log(`[OpenAI RAW RESPONSE]`, analysisResult);

        // Verificar si es un pedido
        if (analysisResult && typeof analysisResult === 'object' && 'type' in analysisResult) {
          const typedResult = analysisResult as { type: string; items?: Array<{ product: string; quantity: number }> };
          
          if (typedResult.type === 'order' && typedResult.items && Array.isArray(typedResult.items)) {
            console.log(`✅ Order analysis cached for ${mockId}`);
            
            // Procesar productos del pedido
            for (const item of typedResult.items) {
              if (item && typeof item === 'object' && 'product' in item) {
                productsWithMeta.push({
                  name: String(item.product || ''),
                  quantity: Number(item.quantity || 1),
                  conversationId: mockId,
                  date: conversationDate,
                  duration: 0 // Los mocks no tienen duration
                });
              }
            }
          } else {
            console.log(`ℹ️ ${mockId} is not an order (type: ${typedResult.type})`);
          }
        }

        // Cachear el resultado
        mockAnalysisCache.set(mockId, analysisResult);

      } catch (error) {
        console.error(`❌ Error analyzing ${mockId}:`, error);
      }
    }

    // Agrupar productos con meta
    const productMap: Record<string, { 
      quantity: number; 
      conversations: Array<{ id: string; date: string; duration: number }> 
    }> = {};
    
    for (const p of productsWithMeta) {
      const name = (p.name || '').trim().toLowerCase();
      if (!name) continue;
      
      if (!productMap[name]) {
        productMap[name] = { quantity: 0, conversations: [] };
      }
      productMap[name].quantity += p.quantity;
      productMap[name].conversations.push({ 
        id: p.conversationId, 
        date: p.date, 
        duration: p.duration 
      });
    }
    
    const result = Object.entries(productMap).map(([name, data]) => ({ 
      name, 
      quantity: data.quantity, 
      conversations: data.conversations 
    }));
    
    console.log(`📊 Analytics result: ${result.length} products from ${productsWithMeta.length} mock orders`);
    console.log(`📊 Products found:`, result.map(p => `${p.name} (${p.quantity})`));
    console.log(`📊 Final response structure:`, JSON.stringify(result, null, 2));
    
    return NextResponse.json({ products: result });
  } catch (error) {
    console.error('❌ Error in analytics/products:', error);
    return NextResponse.json({ error: 'Failed to get products analytics' }, { status: 500 });
  }
} 