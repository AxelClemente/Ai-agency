// ElevenLabs Tools Configuration
// Herramientas para el agente de ElevenLabs

export interface ReservationData {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  people: number;
  contact?: string;
  notes?: string;
}

export interface ReservationResponse {
  success: boolean;
  reservation?: {
    id: string;
    name: string;
    date: string;
    time: string;
    people: number;
    contact: string;
    notes?: string;
  };
  error?: string;
}

export interface ReservationListResponse {
  success: boolean;
  reservations: Array<{
    id: string;
    name: string;
    date: string;
    time: string;
    people: number;
    contact: string;
    notes?: string;
  }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Herramienta para crear reservaciones
export async function createReservation(data: ReservationData): Promise<ReservationResponse> {
  console.log('🔧 [ELEVENLABS TOOL] Creating reservation:', data);
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/reservations/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Nota: En producción, necesitarías manejar la autenticación del agente
        // Por ahora usamos una sesión válida
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('📤 [ELEVENLABS TOOL] Create reservation response:', result);

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create reservation'
      };
    }

    return {
      success: true,
      reservation: result.reservation
    };

  } catch (error) {
    console.error('❌ [ELEVENLABS TOOL] Error creating reservation:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

// Herramienta para obtener reservaciones
export async function getReservations(date?: string): Promise<ReservationListResponse> {
  console.log('🔍 [ELEVENLABS TOOL] Getting reservations for date:', date || 'all');
  
  try {
    const url = new URL(`${process.env.NEXTAUTH_URL}/api/reservations/list`);
    if (date) {
      url.searchParams.set('date', date);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Nota: En producción, necesitarías manejar la autenticación del agente
      }
    });

    const result = await response.json();
    console.log('📤 [ELEVENLABS TOOL] Get reservations response:', {
      success: result.success,
      count: result.reservations?.length || 0
    });

    if (!response.ok) {
      return {
        success: false,
        reservations: [],
        pagination: { total: 0, limit: 50, offset: 0, hasMore: false },
        error: result.error || 'Failed to get reservations'
      };
    }

    return result;

  } catch (error) {
    console.error('❌ [ELEVENLABS TOOL] Error getting reservations:', error);
    return {
      success: false,
      reservations: [],
      pagination: { total: 0, limit: 50, offset: 0, hasMore: false },
      error: 'Internal server error'
    };
  }
}

// Configuración de herramientas para ElevenLabs
export const ELEVENLABS_TOOLS = [
  {
    name: 'create_reservation',
    description: 'Create a new restaurant reservation',
    input_schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Customer name for the reservation'
        },
        date: {
          type: 'string',
          description: 'Reservation date in YYYY-MM-DD format'
        },
        time: {
          type: 'string',
          description: 'Reservation time in HH:MM format (24-hour)'
        },
        people: {
          type: 'number',
          description: 'Number of people for the reservation (1-20)'
        },
        contact: {
          type: 'string',
          description: 'Customer contact information (phone/email)'
        },
        notes: {
          type: 'string',
          description: 'Additional notes or special requests'
        }
      },
      required: ['name', 'date', 'time', 'people']
    }
  },
  {
    name: 'get_reservations',
    description: 'Get restaurant reservations for a specific date or all reservations',
    input_schema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date to filter reservations (YYYY-MM-DD format). If not provided, returns all reservations.'
        }
      }
    }
  }
];

// Mapeo de nombres de herramientas a funciones
export const TOOL_FUNCTIONS: Record<string, Function> = {
  create_reservation: createReservation,
  get_reservations: getReservations
}; 