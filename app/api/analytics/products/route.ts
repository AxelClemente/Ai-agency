import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Processing REAL database analytics for products...');
    
    // Obtener análisis de restaurante de la base de datos
    const restaurantAnalyses = await prisma.restaurantAnalysis.findMany({
      where: {
        userId: session.user.id,
        customerIntent: 'order' // Solo pedidos, no reservas
      },
      include: {
        conversation: {
          select: {
            id: true,
            startedAt: true,
            duration: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    console.log(`📊 Found ${restaurantAnalyses.length} order analyses in database`);

    // Procesar productos de análisis reales
    const productsWithMeta: Array<{ name: string; quantity: number; conversationId: string; date: string; duration: number }> = [];
    
    for (const analysis of restaurantAnalyses) {
      const products = Array.isArray(analysis.products) ? analysis.products : [];
      const conversationDate = analysis.timestamp.toISOString().slice(0, 10);
      
      for (const product of products) {
        if (product && typeof product === 'object' && 'name' in product) {
          productsWithMeta.push({
            name: String(product.name || ''),
            quantity: Number(product.quantity || 1),
            conversationId: analysis.conversationId,
            date: conversationDate,
            duration: analysis.duration
          });
        }
      }
    }

    // Agrupar productos con meta
    const productMap: Record<string, { quantity: number; conversations: Array<{ id: string; date: string; duration: number }> }> = {};
    
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
    
    console.log(`📊 Analytics result: ${result.length} products from ${productsWithMeta.length} real orders`);
    
    return NextResponse.json({ products: result });
  } catch (error) {
    console.error('Error in analytics/products:', error);
    return NextResponse.json({ error: 'Failed to get products analytics' }, { status: 500 });
  }
} 