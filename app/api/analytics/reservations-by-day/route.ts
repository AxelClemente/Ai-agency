import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { isValid, parseISO, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Processing REAL database analytics for reservations...');
    
    // Obtener reservaciones reales de la base de datos
    const realReservations = await prisma.reservation.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        date: 'asc'
      }
    });

    console.log(`📊 Found ${realReservations.length} real reservations in database`);

    // Obtener análisis de restaurante de la base de datos (solo reservas de AI)
    const restaurantAnalyses = await prisma.restaurantAnalysis.findMany({
      where: {
        userId: session.user.id,
        customerIntent: 'reservation' // Solo reservas, no pedidos
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

    console.log(`📊 Found ${restaurantAnalyses.length} AI reservation analyses in database`);

    // Procesar reservas reales
    const realReservas: Array<{ 
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
    
    // Agregar reservaciones reales
    for (const reservation of realReservations) {
      const dateStr = format(reservation.date, 'yyyy-MM-dd');
      const timeStr = format(reservation.date, 'HH:mm');
      
      const reservationDetails = {
        name: reservation.name,
        time: timeStr,
        people: reservation.people,
        contact: reservation.phone,
        notes: reservation.notes || 'Sin notas',
        source: 'Real'
      };
      
      realReservas.push({ 
        date: dateStr, 
        count: 1,
        reservas: [reservationDetails]
      });
    }

    // Procesar reservas de análisis de AI
    for (const analysis of restaurantAnalyses) {
      const reservation = analysis.reservation;
      if (!reservation || typeof reservation !== 'object') continue;
      
      let dateStr = null;
      
      if (reservation.date && reservation.date !== 'not provided') {
        const parsed = isValid(new Date(reservation.date)) ? new Date(reservation.date) : parseISO(reservation.date);
        if (isValid(parsed)) dateStr = format(parsed, 'yyyy-MM-dd');
      }
      
      if (!dateStr) {
        // Fallback: usar timestamp de la conversación
        dateStr = format(analysis.timestamp, 'yyyy-MM-dd');
      }
      
      // Extraer detalles de la reserva
      const reservationDetails = {
        name: String(reservation.name || 'Sin nombre'),
        time: String(reservation.time || 'Sin hora'),
        people: Number(reservation.people || 0),
        contact: String(reservation.contact || 'Sin contacto'),
        notes: String(reservation.notes || 'Sin notas'),
        source: 'AI Analysis'
      };
      
      realReservas.push({ 
        date: dateStr, 
        count: 1,
        reservas: [reservationDetails]
      });
    }

    // Agrupar reservas por fecha
    const groupedReservations: Record<string, { count: number; reservas: any[] }> = {};
    
    for (const reserva of realReservas) {
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

    console.log(`📅 Calendar result: ${result.length} dates with ${realReservas.length} total reservations (Real: ${realReservations.length}, AI: ${restaurantAnalyses.length})`);
    
    return NextResponse.json({ reservations: result });
  } catch (error) {
    console.error('Error in analytics/reservations-by-day:', error);
    return NextResponse.json({ error: 'Failed to get reservations analytics' }, { status: 500 });
  }
} 