const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestConversation() {
  try {
    // Primero, obtener un usuario existente
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('❌ No se encontró ningún usuario. Crea un usuario primero.');
      return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Crear una conversación de prueba con transcripción de pizzería
    const testConversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        agentId: 'pizzeria-agent-123', // ID ficticio del agente de pizzería
        transcript: `Cliente: Hola, buenas tardes. Quisiera hacer un pedido para llevar.
Agente: ¡Hola! Bienvenido a Pizzeria Deliciosa. Con gusto te ayudo con tu pedido. ¿Qué te gustaría ordenar hoy?
Cliente: Me gustaría una pizza margarita grande y una pizza pepperoni mediana.
Agente: Excelente elección. Las pizzas margarita grandes cuestan 15 euros y las pepperoni medianas 12 euros. ¿Te parece bien?
Cliente: Sí, perfecto. También quisiera una bebida, ¿qué tienen?
Agente: Tenemos Coca-Cola, Fanta, Sprite y agua. Todas cuestan 2.50 euros.
Cliente: Una Coca-Cola entonces.
Agente: Perfecto. Entonces tienes: 1 pizza margarita grande (15€), 1 pizza pepperoni mediana (12€) y 1 Coca-Cola (2.50€). El total es 29.50 euros. ¿Para cuándo lo necesitas?
Cliente: Para dentro de una hora, por favor.
Agente: Perfecto. ¿Me puedes dar tu nombre y número de teléfono para el pedido?
Cliente: Sí, me llamo Juan Pérez y mi teléfono es 612345678.
Agente: Gracias Juan. Tu pedido estará listo en aproximadamente 45 minutos. ¿Prefieres pagar en efectivo o con tarjeta?
Cliente: Con tarjeta, por favor.
Agente: Perfecto. Tu pedido está confirmado. Te llamaremos cuando esté listo. ¿Hay algo más en lo que pueda ayudarte?
Cliente: No, eso es todo. Muchas gracias.
Agente: ¡Gracias a ti por elegir Pizzeria Deliciosa! Que tengas un buen día.`,
        duration: 180, // 3 minutos
        cost: 0.15,
        status: 'completed',
        messages: [
          {
            role: 'user',
            message: 'Hola, buenas tardes. Quisiera hacer un pedido para llevar.',
            timestamp: '2024-01-15T14:00:00Z'
          },
          {
            role: 'ai',
            message: '¡Hola! Bienvenido a Pizzeria Deliciosa. Con gusto te ayudo con tu pedido. ¿Qué te gustaría ordenar hoy?',
            timestamp: '2024-01-15T14:00:05Z'
          },
          {
            role: 'user',
            message: 'Me gustaría una pizza margarita grande y una pizza pepperoni mediana.',
            timestamp: '2024-01-15T14:00:15Z'
          },
          {
            role: 'ai',
            message: 'Excelente elección. Las pizzas margarita grandes cuestan 15 euros y las pepperoni medianas 12 euros. ¿Te parece bien?',
            timestamp: '2024-01-15T14:00:25Z'
          },
          {
            role: 'user',
            message: 'Sí, perfecto. También quisiera una bebida, ¿qué tienen?',
            timestamp: '2024-01-15T14:00:35Z'
          },
          {
            role: 'ai',
            message: 'Tenemos Coca-Cola, Fanta, Sprite y agua. Todas cuestan 2.50 euros.',
            timestamp: '2024-01-15T14:00:45Z'
          },
          {
            role: 'user',
            message: 'Una Coca-Cola entonces.',
            timestamp: '2024-01-15T14:00:55Z'
          },
          {
            role: 'ai',
            message: 'Perfecto. Entonces tienes: 1 pizza margarita grande (15€), 1 pizza pepperoni mediana (12€) y 1 Coca-Cola (2.50€). El total es 29.50 euros. ¿Para cuándo lo necesitas?',
            timestamp: '2024-01-15T14:01:05Z'
          },
          {
            role: 'user',
            message: 'Para dentro de una hora, por favor.',
            timestamp: '2024-01-15T14:01:15Z'
          },
          {
            role: 'ai',
            message: 'Perfecto. ¿Me puedes dar tu nombre y número de teléfono para el pedido?',
            timestamp: '2024-01-15T14:01:25Z'
          },
          {
            role: 'user',
            message: 'Sí, me llamo Juan Pérez y mi teléfono es 612345678.',
            timestamp: '2024-01-15T14:01:35Z'
          },
          {
            role: 'ai',
            message: 'Gracias Juan. Tu pedido estará listo en aproximadamente 45 minutos. ¿Prefieres pagar en efectivo o con tarjeta?',
            timestamp: '2024-01-15T14:01:45Z'
          },
          {
            role: 'user',
            message: 'Con tarjeta, por favor.',
            timestamp: '2024-01-15T14:01:55Z'
          },
          {
            role: 'ai',
            message: 'Perfecto. Tu pedido está confirmado. Te llamaremos cuando esté listo. ¿Hay algo más en lo que pueda ayudarte?',
            timestamp: '2024-01-15T14:02:05Z'
          },
          {
            role: 'user',
            message: 'No, eso es todo. Muchas gracias.',
            timestamp: '2024-01-15T14:02:15Z'
          },
          {
            role: 'ai',
            message: '¡Gracias a ti por elegir Pizzeria Deliciosa! Que tengas un buen día.',
            timestamp: '2024-01-15T14:02:25Z'
          }
        ],
        metrics: {
          totalMessages: 16,
          userMessages: 8,
          aiMessages: 8,
          averageResponseTime: 10
        },
        metadata: {
          agentType: 'restaurant',
          businessType: 'pizzeria'
        }
      }
    });

    console.log('✅ Conversación de prueba creada exitosamente');
    console.log('📋 ID de la conversación:', testConversation.id);
    console.log('👤 Usuario:', user.email);
    console.log('⏱️ Duración:', testConversation.duration, 'segundos');
    console.log('📝 Mensajes:', testConversation.messages.length);

    // Crear también una conversación con reserva
    const reservationConversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        agentId: 'pizzeria-agent-123',
        transcript: `Cliente: Hola, buenas noches. Quisiera hacer una reserva para mañana.
Agente: ¡Hola! Bienvenido a Pizzeria Deliciosa. Con gusto te ayudo con tu reserva. ¿Para cuántas personas y a qué hora?
Cliente: Para 4 personas, a las 8 de la noche.
Agente: Perfecto. ¿Prefieres mesa interior o terraza?
Cliente: Interior, por favor.
Agente: Excelente. ¿Me puedes dar tu nombre y número de teléfono para confirmar la reserva?
Cliente: Sí, me llamo María García y mi teléfono es 698765432.
Agente: Gracias María. Tu reserva está confirmada para mañana a las 20:00 horas, mesa interior para 4 personas. ¿Hay algo más en lo que pueda ayudarte?
Cliente: No, eso es todo. Muchas gracias.
Agente: ¡Gracias a ti! Te esperamos mañana. Que tengas una buena noche.`,
        duration: 120, // 2 minutos
        cost: 0.10,
        status: 'completed',
        messages: [
          {
            role: 'user',
            message: 'Hola, buenas noches. Quisiera hacer una reserva para mañana.',
            timestamp: '2024-01-15T20:00:00Z'
          },
          {
            role: 'ai',
            message: '¡Hola! Bienvenido a Pizzeria Deliciosa. Con gusto te ayudo con tu reserva. ¿Para cuántas personas y a qué hora?',
            timestamp: '2024-01-15T20:00:05Z'
          },
          {
            role: 'user',
            message: 'Para 4 personas, a las 8 de la noche.',
            timestamp: '2024-01-15T20:00:15Z'
          },
          {
            role: 'ai',
            message: 'Perfecto. ¿Prefieres mesa interior o terraza?',
            timestamp: '2024-01-15T20:00:25Z'
          },
          {
            role: 'user',
            message: 'Interior, por favor.',
            timestamp: '2024-01-15T20:00:35Z'
          },
          {
            role: 'ai',
            message: 'Excelente. ¿Me puedes dar tu nombre y número de teléfono para confirmar la reserva?',
            timestamp: '2024-01-15T20:00:45Z'
          },
          {
            role: 'user',
            message: 'Sí, me llamo María García y mi teléfono es 698765432.',
            timestamp: '2024-01-15T20:00:55Z'
          },
          {
            role: 'ai',
            message: 'Gracias María. Tu reserva está confirmada para mañana a las 20:00 horas, mesa interior para 4 personas. ¿Hay algo más en lo que pueda ayudarte?',
            timestamp: '2024-01-15T20:01:05Z'
          },
          {
            role: 'user',
            message: 'No, eso es todo. Muchas gracias.',
            timestamp: '2024-01-15T20:01:15Z'
          },
          {
            role: 'ai',
            message: '¡Gracias a ti! Te esperamos mañana. Que tengas una buena noche.',
            timestamp: '2024-01-15T20:01:25Z'
          }
        ],
        metrics: {
          totalMessages: 10,
          userMessages: 5,
          aiMessages: 5,
          averageResponseTime: 10
        },
        metadata: {
          agentType: 'restaurant',
          businessType: 'pizzeria'
        }
      }
    });

    console.log('✅ Conversación de reserva creada exitosamente');
    console.log('📋 ID de la reserva:', reservationConversation.id);

  } catch (error) {
    console.error('❌ Error creando conversaciones de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestConversation(); 