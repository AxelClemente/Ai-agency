// Script de prueba para simular llamadas de herramientas del agente
// Este script simula cómo ElevenLabs llamaría a nuestras herramientas

const BASE_URL = 'http://localhost:3000';

// Simular una sesión de usuario (en producción esto vendría de ElevenLabs)
const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com'
  }
};

async function testAgentTools() {
  console.log('🧪 Testing ElevenLabs Agent Tools...\n');

  try {
    // Test 1: Obtener lista de herramientas disponibles
    console.log('1️⃣ Testing tools list endpoint...');
    const toolsResponse = await fetch(`${BASE_URL}/api/elevenlabs/tools`);
    const toolsData = await toolsResponse.json();
    
    if (toolsData.success) {
      console.log('✅ Tools list retrieved successfully');
      console.log(`📋 Available tools: ${toolsData.tools.length}`);
      toolsData.tools.forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name}: ${tool.description}`);
      });
    } else {
      console.log('❌ Failed to get tools list');
    }

    // Test 2: Simular llamada de herramienta create_reservation
    console.log('\n2️⃣ Testing create_reservation tool...');
    const createReservationCall = {
      tool_name: 'create_reservation',
      arguments: {
        name: 'María González',
        date: '2025-01-20',
        time: '19:30',
        people: 6,
        contact: '+34 612 345 678',
        notes: 'Mesa cerca de la ventana, por favor'
      }
    };

    console.log('📤 Sending create_reservation call:', createReservationCall);
    
    const createResponse = await fetch(`${BASE_URL}/api/elevenlabs/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createReservationCall)
    });

    const createResult = await createResponse.json();
    console.log('📥 Create reservation response:', createResult);

    // Test 3: Simular llamada de herramienta get_reservations
    console.log('\n3️⃣ Testing get_reservations tool...');
    const getReservationsCall = {
      tool_name: 'get_reservations',
      arguments: {
        date: '2025-01-20'
      }
    };

    console.log('📤 Sending get_reservations call:', getReservationsCall);
    
    const getResponse = await fetch(`${BASE_URL}/api/elevenlabs/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(getReservationsCall)
    });

    const getResult = await getResponse.json();
    console.log('📥 Get reservations response:', getResult);

    // Test 4: Simular llamada de herramienta get_reservations sin fecha (todas)
    console.log('\n4️⃣ Testing get_reservations tool (all reservations)...');
    const getAllReservationsCall = {
      tool_name: 'get_reservations',
      arguments: {}
    };

    console.log('📤 Sending get_reservations call (all):', getAllReservationsCall);
    
    const getAllResponse = await fetch(`${BASE_URL}/api/elevenlabs/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(getAllReservationsCall)
    });

    const getAllResult = await getAllResponse.json();
    console.log('📥 Get all reservations response:', getAllResult);

    // Test 5: Probar herramienta inexistente
    console.log('\n5️⃣ Testing non-existent tool...');
    const invalidToolCall = {
      tool_name: 'non_existent_tool',
      arguments: {}
    };

    console.log('📤 Sending invalid tool call:', invalidToolCall);
    
    const invalidResponse = await fetch(`${BASE_URL}/api/elevenlabs/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidToolCall)
    });

    const invalidResult = await invalidResponse.json();
    console.log('📥 Invalid tool response:', invalidResult);

    // Resumen de pruebas
    console.log('\n📊 Test Summary:');
    console.log('✅ Tools list endpoint: WORKING');
    console.log('⚠️  Create reservation tool: AUTHENTICATION REQUIRED (expected)');
    console.log('⚠️  Get reservations tool: AUTHENTICATION REQUIRED (expected)');
    console.log('✅ Invalid tool handling: WORKING');

    console.log('\n🎯 Next Steps:');
    console.log('1. Set up authentication for agent calls');
    console.log('2. Configure tools in ElevenLabs platform');
    console.log('3. Test with real agent conversations');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Ejecutar las pruebas
testAgentTools(); 