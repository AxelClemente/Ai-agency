import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { isValid, parseISO, isFuture } from 'date-fns';

export async function POST(req: NextRequest) {
  console.log('🔧 [RESERVATION CREATE] Starting reservation creation...');
  
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('❌ [RESERVATION CREATE] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('📥 [RESERVATION CREATE] Request body:', body);

    // Validar campos requeridos
    const { name, date, time, people, contact, notes } = body;

    if (!name || !date || !time || !people) {
      console.log('❌ [RESERVATION CREATE] Missing required fields:', { name, date, time, people });
      return NextResponse.json({ 
        error: 'Missing required fields: name, date, time, people' 
      }, { status: 400 });
    }

    // Validar formato de fecha
    let parsedDate: Date;
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      console.log('❌ [RESERVATION CREATE] Invalid date format:', date);
      return NextResponse.json({ 
        error: 'Invalid date format. Use YYYY-MM-DD' 
      }, { status: 400 });
    }

    // Validar que la fecha sea futura
    if (!isFuture(parsedDate)) {
      console.log('❌ [RESERVATION CREATE] Date is in the past:', date);
      return NextResponse.json({ 
        error: 'Reservation date must be in the future' 
      }, { status: 400 });
    }

    // Validar formato de hora (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      console.log('❌ [RESERVATION CREATE] Invalid time format:', time);
      return NextResponse.json({ 
        error: 'Invalid time format. Use HH:MM (24-hour format)' 
      }, { status: 400 });
    }

    // Validar número de personas
    const peopleCount = parseInt(people);
    if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > 20) {
      console.log('❌ [RESERVATION CREATE] Invalid people count:', people);
      return NextResponse.json({ 
        error: 'Number of people must be between 1 and 20' 
      }, { status: 400 });
    }

    // Combinar fecha y hora
    const [hours, minutes] = time.split(':').map(Number);
    const reservationDateTime = new Date(parsedDate);
    reservationDateTime.setHours(hours, minutes, 0, 0);

    console.log('📅 [RESERVATION CREATE] Combined date/time:', reservationDateTime);

    // Verificar disponibilidad (opcional - por ahora solo validamos que no haya reservas duplicadas)
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        date: reservationDateTime,
        name: name
      }
    });

    if (existingReservation) {
      console.log('❌ [RESERVATION CREATE] Duplicate reservation found');
      return NextResponse.json({ 
        error: 'A reservation with this name already exists for this date and time' 
      }, { status: 409 });
    }

    // Crear la reservación
    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        phone: contact || 'No proporcionado',
        date: reservationDateTime,
        people: peopleCount,
        notes: notes || null
      }
    });

    console.log('✅ [RESERVATION CREATE] Reservation created successfully:', {
      id: reservation.id,
      name: reservation.name,
      date: reservation.date,
      people: reservation.people
    });

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        name: reservation.name,
        date: reservation.date,
        time: time,
        people: reservation.people,
        contact: reservation.phone,
        notes: reservation.notes
      }
    });

  } catch (error) {
    console.error('❌ [RESERVATION CREATE] Error creating reservation:', error);
    return NextResponse.json({ 
      error: 'Failed to create reservation' 
    }, { status: 500 });
  }
} 