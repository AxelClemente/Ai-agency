// Mock conversations for AutoBox Manacor aggregated dashboard
export interface MockMessage {
  role: 'agente' | 'cliente';
  message: string;
  timestamp: string;
}

export interface MockConversation {
  id: string;
  isMock: true;
  type: 'pedido' | 'reserva';
  messages: MockMessage[];
}

export const mockConversations: MockConversation[] = [
  // Pedido 1
  {
    id: 'mock-1',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: '¡Hola! Gracias por llamar a Pizza Posta, ¿qué te gustaría pedir hoy?', timestamp: '2025-07-01T12:00:00' },
      { role: 'cliente', message: 'Hola, quiero una pizza Napolitana y una cerveza.', timestamp: '2025-07-01T12:00:10' },
      { role: 'agente', message: 'Perfecto, una Napolitana y una cerveza. ¿Algo más?', timestamp: '2025-07-01T12:00:20' },
      { role: 'cliente', message: 'No, eso es todo. ¿Cuánto sería?', timestamp: '2025-07-01T12:00:30' },
      { role: 'agente', message: 'Serían 25,5 euros en total. ¿Lo pasas a recoger o prefieres entrega?', timestamp: '2025-07-01T12:00:40' },
      { role: 'cliente', message: 'Lo recojo yo, gracias.', timestamp: '2025-07-01T12:00:50' },
      { role: 'agente', message: '¡Perfecto! Estará listo en 20 minutos.', timestamp: '2025-07-01T12:01:00' },
    ],
  },
  // Pedido 2
  {
    id: 'mock-2',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Bienvenido a Pizza Posta, ¿qué deseas ordenar?', timestamp: '2025-07-01T13:10:00' },
      { role: 'cliente', message: '¿Tienen pizza Fugazzeta?', timestamp: '2025-07-01T13:10:10' },
      { role: 'agente', message: 'Sí, Fugazzeta cuesta 20 euros. ¿Te la preparo?', timestamp: '2025-07-01T13:10:20' },
      { role: 'cliente', message: 'Sí, una Fugazzeta y una tarta de queso.', timestamp: '2025-07-01T13:10:30' },
      { role: 'agente', message: 'Perfecto, Fugazzeta y tarta de queso. Total: 26 euros. ¿Para recoger o envío?', timestamp: '2025-07-01T13:10:40' },
      { role: 'cliente', message: 'Para recoger.', timestamp: '2025-07-01T13:10:50' },
      { role: 'agente', message: 'Listo, en 25 minutos estará tu pedido.', timestamp: '2025-07-01T13:11:00' },
    ],
  },
  // Pedido 3
  {
    id: 'mock-3',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: '¡Buenas tardes! ¿Qué te gustaría pedir?', timestamp: '2025-07-01T14:20:00' },
      { role: 'cliente', message: 'Una pizza 4 Quesos y dos cervezas.', timestamp: '2025-07-01T14:20:10' },
      { role: 'agente', message: 'Perfecto, 4 Quesos y dos cervezas. Total: 31 euros. ¿Algo más?', timestamp: '2025-07-01T14:20:20' },
      { role: 'cliente', message: 'No, gracias.', timestamp: '2025-07-01T14:20:30' },
      { role: 'agente', message: '¿Para recoger o envío?', timestamp: '2025-07-01T14:20:40' },
      { role: 'cliente', message: 'Envío, por favor.', timestamp: '2025-07-01T14:20:50' },
      { role: 'agente', message: 'En 40 minutos lo tienes en tu casa.', timestamp: '2025-07-01T14:21:00' },
    ],
  },
  // Pedido 4
  {
    id: 'mock-4',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿en qué puedo ayudarte?', timestamp: '2025-07-01T15:00:00' },
      { role: 'cliente', message: '¿Tienen opciones veganas?', timestamp: '2025-07-01T15:00:10' },
      { role: 'agente', message: 'Sí, todas nuestras pizzas pueden ser veganas. ¿Te gustaría alguna en especial?', timestamp: '2025-07-01T15:00:20' },
      { role: 'cliente', message: 'Una pizza Marinara vegana y un refresco.', timestamp: '2025-07-01T15:00:30' },
      { role: 'agente', message: 'Perfecto, Marinara vegana y refresco. Total: 19,5 euros. ¿Para recoger?', timestamp: '2025-07-01T15:00:40' },
      { role: 'cliente', message: 'Sí, gracias.', timestamp: '2025-07-01T15:00:50' },
      { role: 'agente', message: 'Estará listo en 15 minutos.', timestamp: '2025-07-01T15:01:00' },
    ],
  },
  // Pedido 5
  {
    id: 'mock-5',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Qué deseas pedir hoy?', timestamp: '2025-07-01T16:00:00' },
      { role: 'cliente', message: 'Una pizza Capuleto y una tarta de queso.', timestamp: '2025-07-01T16:00:10' },
      { role: 'agente', message: 'Capuleto y tarta de queso. Total: 29 euros. ¿Algo más?', timestamp: '2025-07-01T16:00:20' },
      { role: 'cliente', message: 'No, solo eso.', timestamp: '2025-07-01T16:00:30' },
      { role: 'agente', message: '¿Para recoger o envío?', timestamp: '2025-07-01T16:00:40' },
      { role: 'cliente', message: 'Recogeré yo.', timestamp: '2025-07-01T16:00:50' },
      { role: 'agente', message: 'Perfecto, en 20 minutos estará listo.', timestamp: '2025-07-01T16:01:00' },
    ],
  },
  /*
  // Pedido 6
  {
    id: 'mock-6',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Bienvenido a Pizza Posta, ¿qué te apetece hoy?', timestamp: '2025-07-01T17:00:00' },
      { role: 'cliente', message: '¿Cuánto cuesta la pizza Bryan?', timestamp: '2025-07-01T17:00:10' },
      { role: 'agente', message: 'La Bryan cuesta 23 euros.', timestamp: '2025-07-01T17:00:20' },
      { role: 'cliente', message: 'Perfecto, quiero una Bryan y un tiramisú.', timestamp: '2025-07-01T17:00:30' },
      { role: 'agente', message: 'Bryan y tiramisú. Total: 29 euros. ¿Para recoger?', timestamp: '2025-07-01T17:00:40' },
      { role: 'cliente', message: 'Sí, gracias.', timestamp: '2025-07-01T17:00:50' },
      { role: 'agente', message: 'Listo, en 20 minutos.', timestamp: '2025-07-01T17:01:00' },
    ],
  },
  // Pedido 7
  {
    id: 'mock-7',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿qué deseas pedir?', timestamp: '2025-07-01T18:00:00' },
      { role: 'cliente', message: 'Una pizza Margherita, por favor.', timestamp: '2025-07-01T18:00:10' },
      { role: 'agente', message: 'Margherita, 20 euros. ¿Algo más?', timestamp: '2025-07-01T18:00:20' },
      { role: 'cliente', message: 'No, solo eso.', timestamp: '2025-07-01T18:00:30' },
      { role: 'agente', message: '¿Para recoger o envío?', timestamp: '2025-07-01T18:00:40' },
      { role: 'cliente', message: 'Envío, por favor.', timestamp: '2025-07-01T18:00:50' },
      { role: 'agente', message: 'En 30 minutos lo tienes.', timestamp: '2025-07-01T18:01:00' },
    ],
  },
  // Pedido 8
  {
    id: 'mock-8',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Te gustaría probar alguna de nuestras pizzas especiales?', timestamp: '2025-07-01T19:00:00' },
      { role: 'cliente', message: '¿Qué lleva la pizza Alonso?', timestamp: '2025-07-01T19:00:10' },
      { role: 'agente', message: 'Lleva boniato, queso azul, nueces y cebolllino. Cuesta 22 euros.', timestamp: '2025-07-01T19:00:20' },
      { role: 'cliente', message: 'Perfecto, una Alonso y una cerveza.', timestamp: '2025-07-01T19:00:30' },
      { role: 'agente', message: 'Alonso y cerveza. Total: 25,5 euros. ¿Para recoger?', timestamp: '2025-07-01T19:00:40' },
      { role: 'cliente', message: 'Sí, gracias.', timestamp: '2025-07-01T19:00:50' },
      { role: 'agente', message: 'Listo, en 20 minutos.', timestamp: '2025-07-01T19:01:00' },
    ],
  },
  // Pedido 9
  {
    id: 'mock-9',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Bienvenido a Pizza Posta, ¿qué deseas?', timestamp: '2025-07-01T20:00:00' },
      { role: 'cliente', message: 'Una pizza Tartine y un refresco.', timestamp: '2025-07-01T20:00:10' },
      { role: 'agente', message: 'Tartine y refresco. Total: 25 euros. ¿Algo más?', timestamp: '2025-07-01T20:00:20' },
      { role: 'cliente', message: 'No, solo eso.', timestamp: '2025-07-01T20:00:30' },
      { role: 'agente', message: '¿Para recoger?', timestamp: '2025-07-01T20:00:40' },
      { role: 'cliente', message: 'Sí.', timestamp: '2025-07-01T20:00:50' },
      { role: 'agente', message: 'En 15 minutos estará listo.', timestamp: '2025-07-01T20:01:00' },
    ],
  },
  // Pedido 10
  {
    id: 'mock-10',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿en qué puedo ayudarte?', timestamp: '2025-07-01T21:00:00' },
      { role: 'cliente', message: 'Quiero una pizza Bufala y una ensalada de burrata.', timestamp: '2025-07-01T21:00:10' },
      { role: 'agente', message: 'Bufala y ensalada de burrata. Total: 35 euros. ¿Para recoger?', timestamp: '2025-07-01T21:00:20' },
      { role: 'cliente', message: 'Sí, gracias.', timestamp: '2025-07-01T21:00:30' },
      { role: 'agente', message: 'En 20 minutos estará listo.', timestamp: '2025-07-01T21:00:40' },
    ],
  },
  // Pedido 11
  {
    id: 'mock-11',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Qué te gustaría pedir?', timestamp: '2025-07-01T22:00:00' },
      { role: 'cliente', message: 'Una pizza Fumé y una cerveza.', timestamp: '2025-07-01T22:00:10' },
      { role: 'agente', message: 'Fumé y cerveza. Total: 26,5 euros. ¿Algo más?', timestamp: '2025-07-01T22:00:20' },
      { role: 'cliente', message: 'No, solo eso.', timestamp: '2025-07-01T22:00:30' },
      { role: 'agente', message: '¿Para recoger?', timestamp: '2025-07-01T22:00:40' },
      { role: 'cliente', message: 'Sí.', timestamp: '2025-07-01T22:00:50' },
      { role: 'agente', message: 'En 20 minutos estará listo.', timestamp: '2025-07-01T22:01:00' },
    ],
  },
  // Pedido 12
  {
    id: 'mock-12',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Bienvenido a Pizza Posta, ¿qué deseas pedir?', timestamp: '2025-07-01T23:00:00' },
      { role: 'cliente', message: 'Una pizza Posta y un vino por copa.', timestamp: '2025-07-01T23:00:10' },
      { role: 'agente', message: 'Posta y vino. Total: 28 euros. ¿Para recoger?', timestamp: '2025-07-01T23:00:20' },
      { role: 'cliente', message: 'Sí, gracias.', timestamp: '2025-07-01T23:00:30' },
      { role: 'agente', message: 'En 20 minutos estará listo.', timestamp: '2025-07-01T23:00:40' },
    ],
  },
  // Pedido 13
  {
    id: 'mock-13',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿qué deseas pedir?', timestamp: '2025-07-02T12:00:00' },
      { role: 'cliente', message: 'Una pizza Franzini y una cerveza.', timestamp: '2025-07-02T12:00:10' },
      { role: 'agente', message: 'Franzini y cerveza. Total: 26,5 euros. ¿Algo más?', timestamp: '2025-07-02T12:00:20' },
      { role: 'cliente', message: 'No, solo eso.', timestamp: '2025-07-02T12:00:30' },
      { role: 'agente', message: '¿Para recoger?', timestamp: '2025-07-02T12:00:40' },
      { role: 'cliente', message: 'Sí.', timestamp: '2025-07-02T12:00:50' },
      { role: 'agente', message: 'En 20 minutos estará listo.', timestamp: '2025-07-02T12:01:00' },
    ],
  },
  // Pedido 14
  {
    id: 'mock-14',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Qué te gustaría pedir hoy?', timestamp: '2025-07-02T13:00:00' },
      { role: 'cliente', message: 'Una pizza Capuleto y un tiramisú.', timestamp: '2025-07-02T13:00:10' },
      { role: 'agente', message: 'Capuleto y tiramisú. Total: 29 euros. ¿Para recoger?', timestamp: '2025-07-02T12:00:20' },
      { role: 'cliente', message: 'Sí, gracias.', timestamp: '2025-07-02T13:00:30' },
      { role: 'agente', message: 'En 20 minutos estará listo.', timestamp: '2025-07-02T13:00:40' },
    ],
  },
  // Pedido 15
  {
    id: 'mock-15',
    isMock: true,
    type: 'pedido',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿qué deseas pedir?', timestamp: '2025-07-02T14:00:00' },
      { role: 'cliente', message: 'Una pizza Mitad y Mitad, por favor.', timestamp: '2025-07-02T14:00:10' },
      { role: 'agente', message: 'Mitad y Mitad, 25 euros. ¿Algo más?', timestamp: '2025-07-02T14:00:20' },
      { role: 'cliente', message: 'No, solo eso.', timestamp: '2025-07-02T14:00:30' },
      { role: 'agente', message: '¿Para recoger?', timestamp: '2025-07-02T14:00:40' },
      { role: 'cliente', message: 'Sí.', timestamp: '2025-07-02T14:00:50' },
      { role: 'agente', message: 'En 20 minutos estará listo.', timestamp: '2025-07-02T14:01:00' },
    ],
  },
  */
  // Reserva 1
  {
    id: 'mock-16',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Deseas hacer una reserva o pedir para llevar?', timestamp: '2025-07-02T15:00:00' },
      { role: 'cliente', message: 'Quiero reservar una mesa para 4 personas a las 21:00.', timestamp: '2025-07-02T15:00:10' },
      { role: 'agente', message: 'Reserva para 4 a las 21:00. ¿Nombre de la reserva?', timestamp: '2025-07-02T15:00:20' },
      { role: 'cliente', message: 'A nombre de Laura.', timestamp: '2025-07-02T15:00:30' },
      { role: 'agente', message: 'Listo, reserva confirmada. ¡Te esperamos!', timestamp: '2025-07-02T15:00:40' },
    ],
  },
  // Reserva 2
  {
    id: 'mock-17',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿en qué puedo ayudarte?', timestamp: '2025-07-02T16:00:00' },
      { role: 'cliente', message: '¿Puedo reservar para 2 personas hoy a las 20:30?', timestamp: '2025-07-02T16:00:10' },
      { role: 'agente', message: 'Sí, reserva para 2 a las 20:30. ¿Nombre?', timestamp: '2025-07-02T16:00:20' },
      { role: 'cliente', message: 'Carlos.', timestamp: '2025-07-02T16:00:30' },
      { role: 'agente', message: 'Reserva confirmada, Carlos. ¡Hasta luego!', timestamp: '2025-07-02T16:00:40' },
    ],
  },
  // Reserva 3
  {
    id: 'mock-18',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: '¡Buenas tardes! ¿Reserva o pedido?', timestamp: '2025-07-02T17:00:00' },
      { role: 'cliente', message: 'Reserva para 6 personas mañana a las 22:00.', timestamp: '2025-07-02T17:00:10' },
      { role: 'agente', message: 'Reserva para 6 a las 22:00. ¿Nombre?', timestamp: '2025-07-02T17:00:20' },
      { role: 'cliente', message: 'Martina.', timestamp: '2025-07-02T17:00:30' },
      { role: 'agente', message: 'Reserva hecha, Martina. ¡Gracias!', timestamp: '2025-07-02T17:00:40' },
    ],
  },
  // Reserva 4
  {
    id: 'mock-19',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿quieres reservar o pedir?', timestamp: '2025-07-02T18:00:00' },
      { role: 'cliente', message: 'Reservar para 3 personas hoy a las 20:00.', timestamp: '2025-07-02T18:00:10' },
      { role: 'agente', message: 'Reserva para 3 a las 20:00. ¿Nombre?', timestamp: '2025-07-02T18:00:20' },
      { role: 'cliente', message: 'Sofía.', timestamp: '2025-07-02T18:00:30' },
      { role: 'agente', message: 'Reserva confirmada, Sofía.', timestamp: '2025-07-02T18:00:40' },
    ],
  },
  // Reserva 5
  {
    id: 'mock-20',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Deseas reservar mesa o pedir para llevar?', timestamp: '2025-07-02T19:00:00' },
      { role: 'cliente', message: 'Reservar para 2 personas el viernes a las 22:30.', timestamp: '2025-07-02T19:00:10' },
      { role: 'agente', message: 'Reserva para 2 a las 22:30 el viernes. ¿Nombre?', timestamp: '2025-07-02T19:00:20' },
      { role: 'cliente', message: 'Miguel.', timestamp: '2025-07-02T19:00:30' },
      { role: 'agente', message: 'Reserva confirmada, Miguel. ¡Te esperamos!', timestamp: '2025-07-02T19:00:40' },
    ],
  },
  // Reservas adicionales para pruebas de calendario y análisis
  {
    id: 'mock-21',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Deseas reservar mesa o pedir para llevar?', timestamp: '2025-07-23T13:00:00' },
      { role: 'cliente', message: 'Reservar para 2 personas el 23 de julio a las 20:00.', timestamp: '2025-07-23T13:00:10' },
      { role: 'agente', message: 'Reserva para 2 a las 20:00 el 23 de julio. ¿Nombre?', timestamp: '2025-07-23T13:00:20' },
      { role: 'cliente', message: 'Valeria.', timestamp: '2025-07-25T13:00:30' },
      { role: 'agente', message: 'Reserva confirmada, Valeria. ¡Te esperamos!', timestamp: '2025-07-23T13:00:40' },
    ],
  },
  {
    id: 'mock-22',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿en qué puedo ayudarte?', timestamp: '2025-07-26T18:00:00' },
      { role: 'cliente', message: 'Quiero reservar para 4 personas el 26 de julio a las 21:30.', timestamp: '2025-07-26T18:00:10' },
      { role: 'agente', message: 'Reserva para 4 a las 21:30 el 26 de julio. ¿Nombre?', timestamp: '2025-07-26T18:00:20' },
      { role: 'cliente', message: 'Andrés.', timestamp: '2025-07-26T18:00:30' },
      { role: 'agente', message: 'Reserva confirmada, Andrés. ¡Hasta pronto!', timestamp: '2025-07-26T18:00:40' },
    ],
  },
  {
    id: 'mock-23',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: '¡Buenas tardes! ¿Reserva o pedido?', timestamp: '2025-07-29T19:00:00' },
      { role: 'cliente', message: 'Reservar para 3 personas el 29 de julio a las 22:00.', timestamp: '2025-07-29T19:00:10' },
      { role: 'agente', message: 'Reserva para 3 a las 22:00 el 29 de julio. ¿Nombre?', timestamp: '2025-07-29T19:00:20' },
      { role: 'cliente', message: 'Lucía.', timestamp: '2025-07-29T19:00:30' },
      { role: 'agente', message: 'Reserva hecha, Lucía. ¡Gracias!', timestamp: '2025-07-29T19:00:40' },
    ],
  },
  {
    id: 'mock-24',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: 'Pizza Posta, ¿quieres reservar o pedir?', timestamp: '2025-08-05T20:00:00' },
      { role: 'cliente', message: 'Reservar para 5 personas el 5 de agosto a las 20:30.', timestamp: '2025-08-05T20:00:10' },
      { role: 'agente', message: 'Reserva para 5 a las 20:30 el 5 de agosto. ¿Nombre?', timestamp: '2025-08-05T20:00:20' },
      { role: 'cliente', message: 'Javier.', timestamp: '2025-08-05T20:00:30' },
      { role: 'agente', message: 'Reserva confirmada, Javier. ¡Te esperamos!', timestamp: '2025-08-05T20:00:40' },
    ],
  },
  {
    id: 'mock-25',
    isMock: true,
    type: 'reserva',
    messages: [
      { role: 'agente', message: '¡Hola! ¿Deseas reservar mesa o pedir para llevar?', timestamp: '2025-08-15T21:00:00' },
      { role: 'cliente', message: 'Reservar para 2 personas el 15 de agosto a las 21:00.', timestamp: '2025-08-15T21:00:10' },
      { role: 'agente', message: 'Reserva para 2 a las 21:00 el 15 de agosto. ¿Nombre?', timestamp: '2025-08-15T21:00:20' },
      { role: 'cliente', message: 'Elena.', timestamp: '2025-08-15T21:00:30' },
      { role: 'agente', message: 'Reserva confirmada, Elena. ¡Hasta pronto!', timestamp: '2025-08-15T21:00:40' },
    ],
  },
];

// Helper function to get conversation by ID
export function getConversationById(id: string): MockConversation | undefined {
  return mockConversations.find(conv => conv.id === id)
}

// Helper function to get all conversation IDs
export function getAllConversationIds(): string[] {
  return mockConversations.map(conv => conv.id)
} 