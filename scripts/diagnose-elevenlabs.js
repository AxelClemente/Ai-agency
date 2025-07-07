// Script de diagnóstico para ElevenLabs
// Verifica la API key y lista los agentes disponibles

require('dotenv').config({ path: '.env' });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1';

async function diagnoseElevenLabs() {
  console.log('🔍 Diagnosing ElevenLabs configuration...\n');
  
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found in environment variables');
    process.exit(1);
  }

  console.log('✅ API Key found:', ELEVENLABS_API_KEY.substring(0, 10) + '...');
  
  try {
    // 1. Verificar que la API key es válida
    console.log('\n1. Testing API key validity...');
    const userResponse = await fetch(`${BASE_URL}/user`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!userResponse.ok) {
      throw new Error(`API key validation failed: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    console.log('✅ API key is valid');
    console.log('👤 User:', userData.first_name, userData.last_name);
    console.log('📧 Email:', userData.email);

    // 2. Listar todos los agentes disponibles
    console.log('\n2. Listing available agents...');
    const agentsResponse = await fetch(`${BASE_URL}/agents`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!agentsResponse.ok) {
      throw new Error(`Failed to get agents: ${agentsResponse.statusText}`);
    }

    const agentsData = await agentsResponse.json();
    console.log(`✅ Found ${agentsData.agents.length} agents:`);
    
    agentsData.agents.forEach((agent, index) => {
      console.log(`   ${index + 1}. ${agent.name} (${agent.agent_id})`);
      console.log(`      Description: ${agent.description || 'No description'}`);
      console.log(`      Tools: ${agent.tools?.length || 0}`);
      console.log('');
    });

    // 3. Verificar el agente específico
    const targetAgentId = 'agent_01jwnhydh6eggat3jcjrz1ryfs';
    console.log(`\n3. Checking target agent: ${targetAgentId}`);
    
    const targetAgent = agentsData.agents.find(agent => agent.agent_id === targetAgentId);
    
    if (targetAgent) {
      console.log('✅ Target agent found!');
      console.log('📋 Agent details:');
      console.log(`   Name: ${targetAgent.name}`);
      console.log(`   Description: ${targetAgent.description || 'No description'}`);
      console.log(`   Tools: ${targetAgent.tools?.length || 0}`);
      
      if (targetAgent.tools && targetAgent.tools.length > 0) {
        console.log('🔧 Current tools:');
        targetAgent.tools.forEach((tool, index) => {
          console.log(`   ${index + 1}. ${tool.name}: ${tool.description}`);
        });
      }
    } else {
      console.log('❌ Target agent not found in available agents');
      console.log('💡 Available agent IDs:');
      agentsData.agents.forEach(agent => {
        console.log(`   - ${agent.agent_id}`);
      });
    }

    console.log('\n🎉 Diagnosis completed successfully!');

  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 This might be an authentication issue. Check your API key.');
    } else if (error.message.includes('403')) {
      console.log('💡 This might be a permissions issue. Check your API key permissions.');
    }
    
    process.exit(1);
  }
}

// Ejecutar diagnóstico
diagnoseElevenLabs(); 