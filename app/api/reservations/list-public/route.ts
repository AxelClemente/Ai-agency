import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseISO, isValid, format } from 'date-fns';

export async function GET(req: NextRequest) {
  console.log('🔍 [RESERVATION LIST PUBLIC] Starting public reservation list request...');
  
  try {
    const { searchParams } = new URL(req.url);
    const dateFilter = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📥 [RESERVATION LIST PUBLIC] Query parameters:', { dateFilter, limit, offset });

    // Construir filtros - para endpoints públicos, mostramos todas las reservas
    const where: any = {};

    // Filtrar por fecha si se proporciona
    if (dateFilter) {
      try {
        const parsedDate = parseISO(dateFilter);
        if (isValid(parsedDate)) {
          const startOfDay = new Date(parsedDate);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(parsedDate);
          endOfDay.setHours(23, 59, 59, 999);

          where.date = {
            gte: startOfDay,
            lte: endOfDay
          };
          
          console.log('📅 [RESERVATION LIST PUBLIC] Filtering by date:', dateFilter);
        }
      } catch (error) {
        console.log('❌ [RESERVATION LIST PUBLIC] Invalid date filter:', dateFilter);
        return NextResponse.json({ 
          error: 'Invalid date format. Use YYYY-MM-DD' 
        }, { status: 400 });
      }
    }

    // Obtener reservaciones
    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: {
        date: 'asc'
      },
      take: limit,
      skip: offset
    });

    // Obtener total de reservaciones para paginación
    const total = await prisma.reservation.count({ where });

    console.log(`📊 [RESERVATION LIST PUBLIC] Found ${reservations.length} reservations (total: ${total})`);

    // Formatear respuesta
    const formattedReservations = reservations.map(reservation => ({
      id: reservation.id,
      name: reservation.name,
      date: format(reservation.date, 'yyyy-MM-dd'),
      time: format(reservation.date, 'HH:mm'),
      people: reservation.people,
      contact: reservation.phone,
      notes: reservation.notes,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    }));

    return NextResponse.json({
      success: true,
      reservations: formattedReservations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('❌ [RESERVATION LIST PUBLIC] Error listing reservations:', error);
    return NextResponse.json({ 
      error: 'Failed to list reservations' 
    }, { status: 500 });
  }
} 