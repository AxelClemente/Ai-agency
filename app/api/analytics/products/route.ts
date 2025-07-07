import { NextRequest, NextResponse } from 'next/server';
import { mockConversations } from '@/lib/mock-conversations';
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai';

// Cache en memoria para análisis de mocks
let mockAnalysisCache: Record<string, any> = {};

// Función para limpiar el cache
function clearMockCache() {
  mockAnalysisCache = {};
  console.log('🧹 Mock analysis cache cleared');
}

export async function GET(request: NextRequest) {
  try {
    // SOLO usar mocks - no datos reales de la base de datos
    console.log('🔄 Processing ONLY mock conversations for analytics...');
    
    // Limpiar cache para forzar reprocesamiento con nuevas instrucciones
    clearMockCache();
    
    // Procesar los mocks en memoria con cache
    const mockProductsWithMeta: Array<{ name: string; quantity: number; conversationId: string; date: string; duration: number }> = [];
    
    for (const mock of mockConversations) {
      // Solo procesar mocks de pedidos (no reservas)
      if (mock.type !== 'pedido') continue;
      
      let analysisResult;
      if (mockAnalysisCache[mock.id]) {
        analysisResult = mockAnalysisCache[mock.id];
        console.log(`📋 Using cached analysis for ${mock.id}`);
      } else {
        console.log(`🧠 Analyzing mock conversation ${mock.id}...`);
        const transcript = mock.messages.map(m => `${m.role === 'agente' ? 'Agente' : 'Cliente'}: ${m.message}`).join('\n');
        const conversationDate = mock.messages[0]?.timestamp ? new Date(mock.messages[0].timestamp).toISOString().slice(0,10) : undefined;
        console.log(`📅 Mock ${mock.id} conversation date: ${conversationDate}`);
        analysisResult = await analyzePizzeriaTranscript(transcript, conversationDate);
        mockAnalysisCache[mock.id] = analysisResult;
        console.log(`✅ Analysis cached for ${mock.id}`);
      }
      
      const products =
        analysisResult.products && Array.isArray(analysisResult.products) && analysisResult.products.length > 0
          ? analysisResult.products
          : (analysisResult.items && Array.isArray(analysisResult.items) && analysisResult.items.length > 0
              ? analysisResult.items
              : []);
              
      for (const p of products) {
        mockProductsWithMeta.push({
          name: (p.name || p.product || '').trim(),
          quantity: p.quantity || 1,
          conversationId: mock.id,
          date: mock.messages[0]?.timestamp || '',
          duration: mock.messages.length * 10
        });
      }
    }

    // Agrupar productos con meta
    const productMap: Record<string, { quantity: number; conversations: Array<{ id: string; date: string; duration: number }> }> = {};
    
    for (const p of mockProductsWithMeta) {
      const name = (p.name || '').trim().toLowerCase();
      if (!name) continue;
      if (!productMap[name]) {
        productMap[name] = { quantity: 0, conversations: [] };
      }
      productMap[name].quantity += p.quantity;
      productMap[name].conversations.push({ id: p.conversationId, date: p.date, duration: p.duration });
    }
    
    const result = Object.entries(productMap).map(([name, data]) => ({ 
      name, 
      quantity: data.quantity, 
      conversations: data.conversations 
    }));
    
    console.log(`📊 Analytics result: ${result.length} products from ${mockProductsWithMeta.length} mock orders`);
    
    return NextResponse.json({ products: result });
  } catch (error) {
    console.error('Error in analytics/products:', error);
    return NextResponse.json({ error: 'Failed to get products analytics' }, { status: 500 });
  }
} 