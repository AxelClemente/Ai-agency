import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { parseISO, isValid, format } from 'date-fns';

export async function GET(req: NextRequest) {
  console.log('🔍 [RESERVATION LIST] Starting reservation list request...');
  
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('❌ [RESERVATION LIST] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateFilter = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📥 [RESERVATION LIST] Query parameters:', { dateFilter, limit, offset });

    // Construir filtros
    const where: {
      userId: string;
      date?: {
        gte: Date;
        lte: Date;
      };
    } = {
      userId: session.user.id
    };

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
          
          console.log('📅 [RESERVATION LIST] Filtering by date:', dateFilter);
        }
      } catch {
        console.log('❌ [RESERVATION LIST] Invalid date filter:', dateFilter);
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

    console.log(`📊 [RESERVATION LIST] Found ${reservations.length} reservations (total: ${total})`);

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
    console.error('❌ [RESERVATION LIST] Error listing reservations:', error);
    return NextResponse.json({ 
      error: 'Failed to list reservations' 
    }, { status: 500 });
  }
} 