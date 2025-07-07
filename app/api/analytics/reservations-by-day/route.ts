import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai';
import { mockConversations } from '@/lib/mock-conversations';
import { isValid, parseISO, format } from 'date-fns';

// Cache para análisis de mocks
const mockReservationCache = new Map();

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Processing ONLY mock reservations for calendar...');
    
    // Limpiar cache para forzar reprocesamiento
    mockReservationCache.clear();
    console.log('🧹 Mock analysis cache cleared');

    // Procesar solo los mocks de reservas
    const mockReservationIds = mockConversations
      .filter(conv => conv.id.startsWith('mock-') && conv.type === 'reserva')
      .map(conv => conv.id);

    console.log(`🧠 Processing ${mockReservationIds.length} mock reservations for calendar...`);

    const reservationsByDate: Array<{ 
      date: string; 
      count: number; 
      reservas: Array<{
        name?: string;
        time?: string;
        people?: number;
        contact?: string;
        notes?: string;
        source?: string;
      }>;
    }> = [];

    // Analizar cada mock reservation
    for (const mockId of mockReservationIds) {
      console.log(`🧠 Analyzing mock reservation ${mockId}...`);
      
      const mock = mockConversations.find(conv => conv.id === mockId);
      if (!mock || !mock.messages || mock.messages.length === 0) {
        console.log(`⚠️ Skipping ${mockId}: no messages`);
        continue;
      }

      // Extraer fecha de la conversación del primer mensaje
      const firstMessage = mock.messages[0];
      const conversationDate = firstMessage.timestamp ? 
        new Date(firstMessage.timestamp).toISOString().slice(0, 10) : 
        '2025-07-02'; // fallback

      console.log(`📅 Mock ${mockId} conversation date: ${conversationDate}`);
      console.log(`📅 Using conversation date: ${conversationDate}`);

      try {
        // Analizar con OpenAI
        const analysisResult = await analyzePizzeriaTranscript(
          mock.messages.map((m: { message: string }) => m.message).join('\n'),
          conversationDate
        );

        console.log(`[OpenAI RAW RESPONSE]`, analysisResult);

        // Verificar si es una reserva
        if (analysisResult && typeof analysisResult === 'object' && 'type' in analysisResult) {
          const typedResult = analysisResult as { 
            type: string; 
            name?: string;
            date?: string;
            time?: string;
            people?: number;
            contact?: string;
            notes?: string;
          };
          
          if (typedResult.type === 'reservation') {
            console.log(`✅ Reservation analysis cached for ${mockId}`);
            
            // Extraer fecha de la reserva
            let reservationDate = conversationDate; // fallback a fecha de conversación
            
            if (typedResult.date && typedResult.date !== 'not provided') {
              const parsed = isValid(new Date(typedResult.date)) ? 
                new Date(typedResult.date) : 
                parseISO(typedResult.date);
              if (isValid(parsed)) {
                reservationDate = format(parsed, 'yyyy-MM-dd');
              }
            }

            // Crear objeto de reserva
            const reservationDetails = {
              name: String(typedResult.name || 'Sin nombre'),
              time: String(typedResult.time || 'Sin hora'),
              people: Number(typedResult.people || 0),
              contact: String(typedResult.contact || 'Sin contacto'),
              notes: String(typedResult.notes || 'Sin notas'),
              source: 'Mock Analysis'
            };

            // Agregar a la lista de reservas por fecha
            const existingDate = reservationsByDate.find(r => r.date === reservationDate);
            if (existingDate) {
              existingDate.count += 1;
              existingDate.reservas.push(reservationDetails);
            } else {
              reservationsByDate.push({
                date: reservationDate,
                count: 1,
                reservas: [reservationDetails]
              });
            }

            console.log(`📅 Added reservation for ${reservationDate}: ${typedResult.name} - ${typedResult.people} people at ${typedResult.time}`);
          } else {
            console.log(`ℹ️ ${mockId} is not a reservation (type: ${typedResult.type})`);
          }
        }

        // Cachear el resultado
        mockReservationCache.set(mockId, analysisResult);

      } catch (error) {
        console.error(`❌ Error analyzing ${mockId}:`, error);
      }
    }

    // Ordenar por fecha
    const result = reservationsByDate.sort((a, b) => a.date.localeCompare(b.date));

    const totalReservations = result.reduce((sum, date) => sum + date.count, 0);
    console.log(`📅 Calendar result: ${result.length} dates with ${totalReservations} total reservations`);
    console.log(`📅 Dates with reservations:`, result.map(r => `${r.date} (${r.count})`));
    console.log(`📅 Final response structure:`, JSON.stringify(result, null, 2));
    
    return NextResponse.json({ reservations: result });
  } catch (error) {
    console.error('❌ Error in analytics/reservations-by-day:', error);
    return NextResponse.json({ error: 'Failed to get reservations analytics' }, { status: 500 });
  }
} 