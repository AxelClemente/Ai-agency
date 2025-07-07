// Script para probar acceso directo al agente específico
// Verifica si podemos acceder al agente directamente

require('dotenv').config({ path: '.env' });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = 'agent_01jwnhydh6eggat3jcjrz1ryfs';
const BASE_URL = 'https://api.elevenlabs.io/v1';

async function testAgentAccess() {
  console.log('🔍 Testing direct agent access...\n');
  
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found');
    process.exit(1);
  }

  console.log('✅ API Key found:', ELEVENLABS_API_KEY.substring(0, 10) + '...');
  console.log('🎯 Target Agent ID:', AGENT_ID);
  
  try {
    // Intentar acceder directamente al agente
    console.log('\n1. Testing direct agent access...');
    const agentResponse = await fetch(`${BASE_URL}/agents/${AGENT_ID}`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    console.log('📊 Response status:', agentResponse.status);
    console.log('📊 Response status text:', agentResponse.statusText);

    if (agentResponse.ok) {
      const agentData = await agentResponse.json();
      console.log('✅ Agent access successful!');
      console.log('📋 Agent details:');
      console.log(`   Name: ${agentData.name}`);
      console.log(`   Description: ${agentData.description || 'No description'}`);
      console.log(`   Tools: ${agentData.tools?.length || 0}`);
      
      if (agentData.tools && agentData.tools.length > 0) {
        console.log('🔧 Current tools:');
        agentData.tools.forEach((tool, index) => {
          console.log(`   ${index + 1}. ${tool.name}: ${tool.description}`);
        });
      }
    } else {
      const errorText = await agentResponse.text();
      console.log('❌ Agent access failed');
      console.log('📄 Error response:', errorText);
      
      if (agentResponse.status === 404) {
        console.log('💡 Agent not found. Possible reasons:');
        console.log('   - Agent ID is incorrect');
        console.log('   - Agent was deleted');
        console.log('   - API key doesn\'t have access to this agent');
      } else if (agentResponse.status === 401) {
        console.log('💡 Authentication failed. Check your API key.');
      } else if (agentResponse.status === 403) {
        console.log('💡 Permission denied. API key might not have access to this agent.');
      }
    }

    // Probar otros endpoints relacionados
    console.log('\n2. Testing other endpoints...');
    
    // Probar endpoint de herramientas
    console.log('   Testing tools endpoint...');
    const toolsResponse = await fetch(`${BASE_URL}/agents/${AGENT_ID}/tools`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });
    
    console.log(`   Tools endpoint status: ${toolsResponse.status}`);
    
    if (toolsResponse.ok) {
      const toolsData = await toolsResponse.json();
      console.log(`   ✅ Found ${toolsData.tools?.length || 0} tools`);
    }

    // Probar endpoint de configuración
    console.log('   Testing configuration endpoint...');
    const configResponse = await fetch(`${BASE_URL}/agents/${AGENT_ID}/config`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });
    
    console.log(`   Config endpoint status: ${configResponse.status}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Ejecutar prueba
testAgentAccess(); 