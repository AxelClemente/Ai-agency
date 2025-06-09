// Mock conversations for AutoBox Manacor aggregated dashboard
export interface MockConversation {
  id: string
  phoneNumber: string
  duration: number
  timestamp: string
  transcript: string
  status: 'completed'
  expectedService: string
  expectedUrgency: 'low' | 'medium' | 'high'
  expectedOutcome: string
}

export const DIVERSE_CONVERSATIONS: MockConversation[] = [
  // ========== ITV SCENARIOS ==========
  {
    id: 'conv-itv-urgent-001',
    phoneNumber: '+34 600 111 001',
    duration: 245,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, buenos días. Quería saber si tienen disponibilidad para la ITV de mi coche esta semana. Es urgente porque se me vence el miércoles y necesito hacer un viaje el jueves. ¿Qué horarios tienen disponibles? También me gustaría saber el precio.',
    status: 'completed',
    expectedService: 'ITV',
    expectedUrgency: 'high',
    expectedOutcome: 'scheduled'
  },
  {
    id: 'conv-itv-routine-002',
    phoneNumber: '+34 600 111 002',
    duration: 180,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenas tardes. Tengo que pasar la ITV de mi SEAT León del 2020. No tengo prisa, pero me gustaría saber precios y cuándo tienen disponibilidad para la próxima semana o la que viene.',
    status: 'completed',
    expectedService: 'ITV',
    expectedUrgency: 'low',
    expectedOutcome: 'quote_requested'
  },
  {
    id: 'conv-itv-failed-003',
    phoneNumber: '+34 600 111 003',
    duration: 320,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, vengo de pasar la ITV en otro sitio y me ha dado fallo por las luces. ¿Pueden revisarme las luces y después llevarme a pasar la ITV de nuevo? Es urgente porque necesito el coche arreglado cuanto antes.',
    status: 'completed',
    expectedService: 'ITV',
    expectedUrgency: 'high',
    expectedOutcome: 'repair_and_retest'
  },

  // ========== NEUMÁTICOS SCENARIOS ==========
  {
    id: 'conv-tire-winter-004',
    phoneNumber: '+34 600 222 004',
    duration: 280,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenas tardes. Llamo para preguntar por el cambio de neumáticos de invierno. Tengo un Mercedes Clase A y quiero cambiar las cuatro ruedas antes de que llegue el frío. ¿Qué marcas tienen y cuánto me costaría? También me gustaría saber si tienen Michelin.',
    status: 'completed',
    expectedService: 'Neumáticos',
    expectedUrgency: 'medium',
    expectedOutcome: 'quote_requested'
  },
  {
    id: 'conv-tire-emergency-005',
    phoneNumber: '+34 600 222 005',
    duration: 195,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, tengo una emergencia. Se me ha pinchado una rueda y necesito cambiarla urgentemente. ¿Pueden atenderme hoy mismo? Estoy en Manacor centro y tengo que ir a trabajar mañana temprano. Es un BMW X3.',
    status: 'completed',
    expectedService: 'Neumáticos',
    expectedUrgency: 'high',
    expectedOutcome: 'emergency_repair'
  },
  {
    id: 'conv-tire-quote-006',
    phoneNumber: '+34 600 222 006',
    duration: 220,
    timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenos días. Quería un presupuesto para cambiar los neumáticos delanteros de mi Volkswagen Golf. No hay prisa, pero quiero comparar precios. ¿Qué marcas tienen disponibles y cuáles me recomiendan?',
    status: 'completed',
    expectedService: 'Neumáticos',
    expectedUrgency: 'low',
    expectedOutcome: 'quote_only'
  },

  // ========== FRENOS SCENARIOS ==========
  {
    id: 'conv-brake-noise-007',
    phoneNumber: '+34 600 333 007',
    duration: 372,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    transcript: 'Hola, tengo una emergencia. Mi coche está haciendo un ruido muy fuerte cuando freno y tengo que viajar mañana temprano. ¿Pueden atenderme hoy mismo? Es un Seat León del 2018. El ruido es como un chirrido muy fuerte cuando piso el freno. Estoy preocupado porque puede ser peligroso.',
    status: 'completed',
    expectedService: 'Frenos',
    expectedUrgency: 'high',
    expectedOutcome: 'emergency_scheduled'
  },
  {
    id: 'conv-brake-routine-008',
    phoneNumber: '+34 600 333 008',
    duration: 190,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenas tardes. Tengo que cambiar las pastillas de freno de mi Audi A4. Me lo dijo el mecánico en la última revisión, pero no es urgente. ¿Cuándo tienen disponibilidad y cuánto me costaría?',
    status: 'completed',
    expectedService: 'Frenos',
    expectedUrgency: 'medium',
    expectedOutcome: 'scheduled'
  },

  // ========== ACEITE SCENARIOS ==========
  {
    id: 'conv-oil-change-009',
    phoneNumber: '+34 600 444 009',
    duration: 145,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, necesito cambiar el aceite de mi coche. Es un mantenimiento rutinario, no hay prisa. ¿Qué tipos de aceite tienen y cuánto cuesta? También me gustaría saber si incluye el filtro.',
    status: 'completed',
    expectedService: 'Aceite',
    expectedUrgency: 'low',
    expectedOutcome: 'scheduled'
  },
  {
    id: 'conv-oil-urgent-010',
    phoneNumber: '+34 600 444 010',
    duration: 165,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenos días, se me ha encendido la luz del aceite en el salpicadero. ¿Pueden revisarme el coche hoy? No sé si es grave, pero no me atrevo a conducir mucho así. Es un Mercedes Clase C.',
    status: 'completed',
    expectedService: 'Aceite',
    expectedUrgency: 'high',
    expectedOutcome: 'emergency_check'
  },

  // ========== DIRECCIÓN SCENARIOS ==========
  {
    id: 'conv-steering-011',
    phoneNumber: '+34 600 555 011',
    duration: 210,
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenas tardes. Mi coche tira hacia la izquierda cuando conduzco. Creo que necesita una alineación. ¿Pueden revisarlo esta semana? También noto que el volante vibra un poco.',
    status: 'completed',
    expectedService: 'Dirección',
    expectedUrgency: 'medium',
    expectedOutcome: 'scheduled'
  },

  // ========== SERVICIOS MÚLTIPLES ==========
  {
    id: 'conv-multi-service-012',
    phoneNumber: '+34 600 666 012',
    duration: 420,
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, necesito una revisión completa de mi coche. Tengo que pasar la ITV el mes que viene y quiero asegurarme de que todo está bien. También creo que necesito cambiar el aceite y las pastillas de freno. ¿Pueden hacerme un presupuesto completo?',
    status: 'completed',
    expectedService: 'General',
    expectedUrgency: 'medium',
    expectedOutcome: 'comprehensive_quote'
  },

  // ========== CONSULTAS DE PRECIO SOLO ==========
  {
    id: 'conv-price-only-013',
    phoneNumber: '+34 600 777 013',
    duration: 90,
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, quería saber cuánto cuesta la ITV. Solo el precio, gracias. Estoy comparando varios talleres de la zona.',
    status: 'completed',
    expectedService: 'ITV',
    expectedUrgency: 'low',
    expectedOutcome: 'price_inquiry_only'
  },
  {
    id: 'conv-price-tires-014',
    phoneNumber: '+34 600 777 014',
    duration: 120,
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenos días, ¿cuánto cuesta cambiar cuatro neumáticos de un Ford Focus? Solo quiero el precio aproximado para comparar. Gracias.',
    status: 'completed',
    expectedService: 'Neumáticos',
    expectedUrgency: 'low',
    expectedOutcome: 'price_inquiry_only'
  },

  // ========== CLIENTES INSATISFECHOS ==========
  {
    id: 'conv-complaint-015',
    phoneNumber: '+34 600 888 015',
    duration: 180,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    transcript: 'Llamo para quejarme. Vine la semana pasada a cambiar las pastillas de freno y ahora hacen ruido. Esto no puede ser normal. Quiero que me lo solucionen sin coste adicional porque claramente hay algo mal hecho.',
    status: 'completed',
    expectedService: 'Frenos',
    expectedUrgency: 'high',
    expectedOutcome: 'complaint_resolution'
  },

  // ========== COMPETIDORES ==========
  {
    id: 'conv-competitor-016',
    phoneNumber: '+34 600 999 016',
    duration: 150,
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, me han dado un presupuesto en otro taller para cambiar los neumáticos por 400 euros. ¿Ustedes pueden mejorarlo? Si no, me voy al otro sitio.',
    status: 'completed',
    expectedService: 'Neumáticos',
    expectedUrgency: 'medium',
    expectedOutcome: 'lost_to_competitor'
  },

  // ========== SEGUIMIENTOS ==========
  {
    id: 'conv-followup-017',
    phoneNumber: '+34 600 100 017',
    duration: 85,
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, llamé ayer para agendar la ITV. ¿Ya tienen disponibilidad para esta semana? Me dijeron que me llamarían de vuelta pero no he recibido ninguna llamada.',
    status: 'completed',
    expectedService: 'ITV',
    expectedUrgency: 'medium',
    expectedOutcome: 'follow_up'
  },

  // ========== CLIENTES SATISFECHOS ==========
  {
    id: 'conv-satisfied-018',
    phoneNumber: '+34 600 200 018',
    duration: 110,
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenos días, llamo para agendar otra cita. El mes pasado me cambiaron las pastillas de freno y quedé muy contento con el servicio. Ahora necesito cambiar el aceite. ¿Cuándo tienen disponibilidad?',
    status: 'completed',
    expectedService: 'Aceite',
    expectedUrgency: 'low',
    expectedOutcome: 'returning_customer'
  },

  // ========== EMERGENCIAS NOCTURNAS ==========
  {
    id: 'conv-emergency-019',
    phoneNumber: '+34 600 300 019',
    duration: 200,
    timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    transcript: 'Hola, sé que es tarde pero tengo una emergencia. Mi coche no frena bien y mañana tengo que llevar a mi hijo al hospital para una cita médica importante. ¿Hay alguna forma de que me puedan atender urgentemente?',
    status: 'completed',
    expectedService: 'Frenos',
    expectedUrgency: 'high',
    expectedOutcome: 'emergency_after_hours'
  },

  // ========== CONSULTA TÉCNICA ==========
  {
    id: 'conv-technical-020',
    phoneNumber: '+34 600 400 020',
    duration: 250,
    timestamp: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
    transcript: 'Buenos días, mi coche hace un ruido extraño al arrancar. Solo dura unos segundos y después para. Un amigo me dijo que podría ser la correa de distribución. ¿Pueden revisarlo? Es un Volkswagen Passat del 2019.',
    status: 'completed',
    expectedService: 'Diagnosis',
    expectedUrgency: 'medium',
    expectedOutcome: 'diagnostic_needed'
  }
]

// Helper function to get conversation by ID
export function getConversationById(id: string): MockConversation | undefined {
  return DIVERSE_CONVERSATIONS.find(conv => conv.id === id)
}

// Helper function to get all conversation IDs
export function getAllConversationIds(): string[] {
  return DIVERSE_CONVERSATIONS.map(conv => conv.id)
} 