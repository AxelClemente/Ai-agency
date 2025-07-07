import { NextRequest, NextResponse } from 'next/server';
import { mockConversations } from '@/lib/mock-conversations';
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai';
import { isValid, parseISO, format } from 'date-fns';

// Cache en memoria para análisis de mocks
let mockAnalysisCache: Record<string, any> = {};

// Función para limpiar el cache
function clearMockCache() {
  mockAnalysisCache = {};
  console.log('🧹 Mock analysis cache cleared');
}

export async function GET(req: NextRequest) {
  try {
    // SOLO usar mocks - no datos reales de la base de datos
    console.log('🔄 Processing ONLY mock reservations for calendar...');
    
    // Limpiar cache para forzar reprocesamiento con nuevas instrucciones
    clearMockCache();
    
    // Procesar los mocks de reserva en memoria con cache
    const mockReservas: Array<{ 
      date: string; 
      count: number; 
      reservas: Array<{
        name?: string;
        time?: string;
        people?: number;
        contact?: string;
        notes?: string;
      }>;
    }> = [];
    
    for (const mock of mockConversations) {
      if (mock.type !== 'reserva') continue;
      
      let analysisResult;
      if (mockAnalysisCache[mock.id]) {
        analysisResult = mockAnalysisCache[mock.id];
        console.log(`📋 Using cached analysis for reservation ${mock.id}`);
      } else {
        console.log(`🧠 Analyzing mock reservation ${mock.id}...`);
        const transcript = mock.messages.map(m => `${m.role === 'agente' ? 'Agente' : 'Cliente'}: ${m.message}`).join('\n');
        const conversationDate = mock.messages[0]?.timestamp ? new Date(mock.messages[0].timestamp).toISOString().slice(0,10) : undefined;
        console.log(`📅 Mock ${mock.id} conversation date: ${conversationDate}`);
        analysisResult = await analyzePizzeriaTranscript(transcript, conversationDate);
        mockAnalysisCache[mock.id] = analysisResult;
        console.log(`✅ Reservation analysis cached for ${mock.id}`);
      }
      
      const reservation = analysisResult.reservation || analysisResult;
      let dateStr = null;
      
      if (reservation && reservation.date && reservation.date !== 'not provided') {
        const parsed = isValid(new Date(reservation.date)) ? new Date(reservation.date) : parseISO(reservation.date);
        if (isValid(parsed)) dateStr = format(parsed, 'yyyy-MM-dd');
      }
      
      if (!dateStr) {
        // Fallback: usar timestamp de la conversación
        dateStr = format(new Date(mock.messages[0]?.timestamp), 'yyyy-MM-dd');
      }
      
      // Extraer detalles de la reserva
      const reservationDetails = {
        name: reservation?.name || 'Sin nombre',
        time: reservation?.time || 'Sin hora',
        people: reservation?.people || 0,
        contact: reservation?.contact || 'Sin contacto',
        notes: reservation?.notes || 'Sin notas'
      };
      
      mockReservas.push({ 
        date: dateStr, 
        count: 1,
        reservas: [reservationDetails]
      });
    }

    // Agrupar reservas por fecha
    const groupedReservations: Record<string, { count: number; reservas: any[] }> = {};
    
    for (const reserva of mockReservas) {
      if (!groupedReservations[reserva.date]) {
        groupedReservations[reserva.date] = { count: 0, reservas: [] };
      }
      groupedReservations[reserva.date].count += reserva.count;
      groupedReservations[reserva.date].reservas.push(...reserva.reservas);
    }

    const result = Object.entries(groupedReservations).map(([date, data]) => ({
      date,
      count: data.count,
      reservas: data.reservas
    }));

    console.log(`📅 Calendar result: ${result.length} dates with ${mockReservas.length} total reservations`);
    
    return NextResponse.json({ reservations: result });
  } catch (error) {
    console.error('Error in analytics/reservations-by-day:', error);
    return NextResponse.json({ error: 'Failed to get reservations analytics' }, { status: 500 });
  }
} 