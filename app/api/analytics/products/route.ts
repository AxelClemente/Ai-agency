import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockConversations } from '@/lib/mock-conversations';
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai';

// Cache en memoria para análisis de mocks
const mockAnalysisCache: Record<string, any> = {};

export async function GET(request: NextRequest) {
  try {
    // 1. Obtener análisis reales de la base de datos
    const analyses = await prisma.restaurantAnalysis.findMany();
    // [{ products, conversationId, timestamp, duration }]
    const realProductsWithMeta: Array<{ name: string; quantity: number; conversationId: string; date: string; duration: number }> = [];
    for (const a of analyses) {
      const products = a.products || [];
      for (const p of products) {
        realProductsWithMeta.push({
          name: (p.name || p.product || '').trim(),
          quantity: p.quantity || 1,
          conversationId: a.conversationId,
          date: a.timestamp ? a.timestamp.toISOString ? a.timestamp.toISOString() : String(a.timestamp) : '',
          duration: a.duration || 0
        });
      }
    }

    // 2. Procesar los mocks en memoria con cache
    const mockProductsWithMeta: Array<{ name: string; quantity: number; conversationId: string; date: string; duration: number }> = [];
    for (const mock of mockConversations) {
      let analysisResult;
      if (mockAnalysisCache[mock.id]) {
        analysisResult = mockAnalysisCache[mock.id];
      } else {
        const transcript = mock.messages.map(m => `${m.role === 'agente' ? 'Agente' : 'Cliente'}: ${m.message}`).join('\n');
        analysisResult = await analyzePizzeriaTranscript(transcript);
        mockAnalysisCache[mock.id] = analysisResult;
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

    // 3. Unir y agrupar todos los productos con meta
    const allProducts = [...realProductsWithMeta, ...mockProductsWithMeta];
    const productMap: Record<string, { quantity: number; conversations: Array<{ id: string; date: string; duration: number }> }> = {};
    for (const p of allProducts) {
      const name = (p.name || '').trim().toLowerCase();
      if (!name) continue;
      if (!productMap[name]) {
        productMap[name] = { quantity: 0, conversations: [] };
      }
      productMap[name].quantity += p.quantity;
      productMap[name].conversations.push({ id: p.conversationId, date: p.date, duration: p.duration });
    }
    const result = Object.entries(productMap).map(([name, data]) => ({ name, quantity: data.quantity, conversations: data.conversations }));
    return NextResponse.json({ products: result });
  } catch (error) {
    console.error('Error in analytics/products:', error);
    return NextResponse.json({ error: 'Failed to get products analytics' }, { status: 500 });
  }
} 