// Script para configurar herramientas en ElevenLabs
// Este script registra las herramientas con el agente de ElevenLabs

// Cargar variables de entorno desde .env
require('dotenv').config({ path: '.env' });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT || 'agent_01jwnhydh6eggat3jcjrz1ryfs';
const BASE_URL = 'https://api.elevenlabs.io/v1';

async function setupElevenLabsTools() {
  console.log('🔧 Setting up ElevenLabs tools for agent:', AGENT_ID);
  
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found in environment variables');
    process.exit(1);
  }

  try {
    // 1. Obtener información del agente
    console.log('\n1. Getting agent information...');
    const agentResponse = await fetch(`${BASE_URL}/agents/${AGENT_ID}`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!agentResponse.ok) {
      throw new Error(`Failed to get agent: ${agentResponse.statusText}`);
    }

    const agentData = await agentResponse.json();
    console.log('✅ Agent found:', agentData.name);

    // 2. Definir las herramientas
    const tools = [
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

    // 3. Configurar las herramientas en el agente
    console.log('\n2. Configuring tools in agent...');
    const updateResponse = await fetch(`${BASE_URL}/agents/${AGENT_ID}`, {
      method: 'PATCH',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tools: tools
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      throw new Error(`Failed to update agent: ${updateResponse.statusText} - ${errorData}`);
    }

    const updateData = await updateResponse.json();
    console.log('✅ Tools configured successfully!');
    console.log('📋 Updated agent data:', {
      name: updateData.name,
      tools_count: updateData.tools?.length || 0
    });

    // 4. Verificar la configuración
    console.log('\n3. Verifying configuration...');
    const verifyResponse = await fetch(`${BASE_URL}/agents/${AGENT_ID}`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    const verifyData = await verifyResponse.json();
    console.log('✅ Verification successful!');
    console.log('🔧 Configured tools:');
    verifyData.tools?.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name}: ${tool.description}`);
    });

    console.log('\n🎉 ElevenLabs tools setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure your server is running on the correct URL');
    console.log('2. Test the tools through the ElevenLabs platform');
    console.log('3. The agent can now create and manage reservations');

  } catch (error) {
    console.error('❌ Error setting up ElevenLabs tools:', error);
    process.exit(1);
  }
}

// Ejecutar el script
setupElevenLabsTools(); 