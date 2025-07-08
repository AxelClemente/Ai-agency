import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { analyzePizzeriaTranscript } from '@/lib/restaurant-agent-openai';
import { mockConversations } from '@/lib/mock-conversations';
import { prisma } from '@/lib/prisma';
import { isValid, parseISO, format } from 'date-fns';

// Cache para análisis de mocks
const mockReservationCache = new Map();

export async function GET() {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- 1. Obtener reservas reales de la base de datos ---
    const dbReservations = await prisma.reservation.findMany({ orderBy: { date: 'asc' } });
    // Definir tipo para los detalles de reserva
    interface ReservationDetails {
      name: string;
      time: string;
      people: number;
      contact: string;
      notes: string | null;
      source: string;
    }
    const dbByDate: Record<string, ReservationDetails[]> = {};
    dbReservations.forEach(res => {
      const dateStr = format(res.date, 'yyyy-MM-dd');
      if (!dbByDate[dateStr]) dbByDate[dateStr] = [];
      dbByDate[dateStr].push({
        name: res.name,
        time: format(res.date, 'HH:mm'),
        people: res.people,
        contact: res.phone,
        notes: res.notes,
        source: 'DB',
      });
    });

    // --- 2. Procesar reservas de mocks (igual que antes) ---
    mockReservationCache.clear();
    const mockReservationIds = mockConversations
      .filter(conv => conv.id.startsWith('mock-') && conv.type === 'reserva')
      .map(conv => conv.id);
    const mockByDate: Record<string, ReservationDetails[]> = {};
    for (const mockId of mockReservationIds) {
      const mock = mockConversations.find(conv => conv.id === mockId);
      if (!mock || !mock.messages || mock.messages.length === 0) continue;
      const firstMessage = mock.messages[0];
      const conversationDate = firstMessage.timestamp ? new Date(firstMessage.timestamp).toISOString().slice(0, 10) : '2025-07-02';
      try {
        const analysisResult = await analyzePizzeriaTranscript(
          mock.messages.map((m: { message: string }) => m.message).join('\n'),
          conversationDate
        );
        if (analysisResult && typeof analysisResult === 'object' && 'type' in analysisResult) {
          const typedResult = analysisResult as { type: string; name?: string; date?: string; time?: string; people?: number; contact?: string; notes?: string; };
          if (typedResult.type === 'reservation') {
            let reservationDate = conversationDate;
            if (typedResult.date && typedResult.date !== 'not provided') {
              const parsed = isValid(new Date(typedResult.date)) ? new Date(typedResult.date) : parseISO(typedResult.date);
              if (isValid(parsed)) reservationDate = format(parsed, 'yyyy-MM-dd');
            }
            const reservationDetails: ReservationDetails = {
              name: String(typedResult.name || 'Sin nombre'),
              time: String(typedResult.time || 'Sin hora'),
              people: Number(typedResult.people || 0),
              contact: String(typedResult.contact || 'Sin contacto'),
              notes: String(typedResult.notes || 'Sin notas'),
              source: 'Mock Analysis',
            };
            if (!mockByDate[reservationDate]) mockByDate[reservationDate] = [];
            mockByDate[reservationDate].push(reservationDetails);
          }
        }
        mockReservationCache.set(mockId, analysisResult);
      } catch {
        // Silenciar errores de mocks
      }
    }

    // --- 3. Combinar ambos orígenes ---
    const allDates = new Set([
      ...Object.keys(dbByDate),
      ...Object.keys(mockByDate),
    ]);
    const combined = Array.from(allDates).map(date => {
      const dbRes = dbByDate[date] || [];
      const mockRes = mockByDate[date] || [];
      return {
        date,
        count: dbRes.length + mockRes.length,
        reservas: [...dbRes, ...mockRes],
      };
    });
    // Ordenar por fecha ascendente
    combined.sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ reservations: combined });
  } catch (error: unknown) {
    console.error('❌ Error in analytics/reservations-by-day:', error);
    return NextResponse.json({ error: 'Failed to get reservations analytics' }, { status: 500 });
  }
} 