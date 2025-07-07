// Script para crear un agente de prueba
// Crea un nuevo agente para probar las herramientas

require('dotenv').config({ path: '.env' });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1';

async function createTestAgent() {
  console.log('🔧 Creating test agent for tools...\n');
  
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found');
    process.exit(1);
  }

  console.log('✅ API Key found:', ELEVENLABS_API_KEY.substring(0, 10) + '...');
  
  const headers = {
    'xi-api-key': ELEVENLABS_API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    // Definir el agente de prueba
    const agentData = {
      name: "Restaurant Reservation Agent",
      description: "AI agent for managing restaurant reservations",
      instructions: "You are a helpful restaurant reservation assistant. You can create and manage reservations for customers.",
      tools: [
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
      ]
    };

    console.log('📝 Creating agent with data:', {
      name: agentData.name,
      description: agentData.description,
      tools_count: agentData.tools.length
    });

    // Intentar crear el agente
    const response = await fetch(`${BASE_URL}/agents`, {
      method: 'POST',
      headers,
      body: JSON.stringify(agentData)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response status text:', response.statusText);

    if (response.ok) {
      const newAgent = await response.json();
      console.log('✅ Agent created successfully!');
      console.log('📋 Agent details:');
      console.log(`   ID: ${newAgent.agent_id}`);
      console.log(`   Name: ${newAgent.name}`);
      console.log(`   Description: ${newAgent.description}`);
      console.log(`   Tools: ${newAgent.tools?.length || 0}`);
      
      // Actualizar el archivo .env con el nuevo Agent ID
      console.log('\n💾 Updating .env file...');
      const envContent = `# ElevenLabs Configuration
ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT=${newAgent.agent_id}

# Other agents (keeping for reference)
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_01jwkfxcw5fq9bzh6hk33dh48c
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA=agent_01jwngnrpwecfrjebshg4p5jm2
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE=agent_01jwnhk094e7btxkp3yv3r36vw
ELEVENLABS_AUTOBOX_AGENT_ID=\${NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT}

# Add your other environment variables here
`;

      const fs = require('fs');
      fs.writeFileSync('.env', envContent);
      console.log('✅ .env file updated with new agent ID');
      
      console.log('\n🎉 Setup completed!');
      console.log('📝 Next steps:');
      console.log(`1. Use the new agent ID: ${newAgent.agent_id}`);
      console.log('2. Test the tools with: node scripts/test-agent-tools.js');
      console.log('3. The agent is ready to use with your application');
      
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create agent');
      console.log('📄 Error response:', errorText);
      
      if (response.status === 403) {
        console.log('💡 This might be a permissions issue. Check your API key permissions.');
      } else if (response.status === 401) {
        console.log('💡 Authentication failed. Check your API key.');
      }
    }

  } catch (error) {
    console.error('❌ Create failed:', error.message);
  }
}

// Ejecutar creación
createTestAgent(); 