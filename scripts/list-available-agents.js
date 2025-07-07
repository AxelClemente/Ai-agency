// Script para listar agentes disponibles
// Intenta diferentes endpoints para encontrar agentes

require('dotenv').config({ path: '.env' });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1';

async function listAvailableAgents() {
  console.log('🔍 Listing available agents...\n');
  
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found');
    process.exit(1);
  }

  console.log('✅ API Key found:', ELEVENLABS_API_KEY.substring(0, 10) + '...');
  
  const headers = {
    'xi-api-key': ELEVENLABS_API_KEY
  };

  try {
    // Intentar diferentes endpoints para listar agentes
    
    // 1. Endpoint principal de agentes
    console.log('1. Trying main agents endpoint...');
    try {
      const response1 = await fetch(`${BASE_URL}/agents`, { headers });
      console.log(`   Status: ${response1.status}`);
      
      if (response1.ok) {
        const data = await response1.json();
        console.log(`   ✅ Found ${data.agents?.length || 0} agents`);
        if (data.agents) {
          data.agents.forEach((agent, index) => {
            console.log(`      ${index + 1}. ${agent.name} (${agent.agent_id})`);
          });
        }
      } else {
        const errorText = await response1.text();
        console.log(`   ❌ Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`   ❌ Exception: ${error.message}`);
    }

    // 2. Endpoint de proyectos (algunos agentes pueden estar en proyectos)
    console.log('\n2. Trying projects endpoint...');
    try {
      const response2 = await fetch(`${BASE_URL}/projects`, { headers });
      console.log(`   Status: ${response2.status}`);
      
      if (response2.ok) {
        const data = await response2.json();
        console.log(`   ✅ Found ${data.projects?.length || 0} projects`);
        if (data.projects) {
          data.projects.forEach((project, index) => {
            console.log(`      ${index + 1}. ${project.name} (${project.project_id})`);
          });
        }
      } else {
        const errorText = await response2.text();
        console.log(`   ❌ Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`   ❌ Exception: ${error.message}`);
    }

    // 3. Endpoint de workspaces
    console.log('\n3. Trying workspaces endpoint...');
    try {
      const response3 = await fetch(`${BASE_URL}/workspaces`, { headers });
      console.log(`   Status: ${response3.status}`);
      
      if (response3.ok) {
        const data = await response3.json();
        console.log(`   ✅ Found ${data.workspaces?.length || 0} workspaces`);
        if (data.workspaces) {
          data.workspaces.forEach((workspace, index) => {
            console.log(`      ${index + 1}. ${workspace.name} (${workspace.workspace_id})`);
          });
        }
      } else {
        const errorText = await response3.text();
        console.log(`   ❌ Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`   ❌ Exception: ${error.message}`);
    }

    // 4. Verificar si hay algún endpoint específico para agentes
    console.log('\n4. Trying agent-specific endpoints...');
    
    // Probar con diferentes IDs de agentes que podrían existir
    const possibleAgentIds = [
      'agent_01jwnhydh6eggat3jcjrz1ryfs', // El original
      'agent_01jwkfxcw5fq9bzh6hk33dh48c', // Del .env
      'agent_01jwngnrpwecfrjebshg4p5jm2', // Del .env
      'agent_01jwnhk094e7btxkp3yv3r36vw'  // Del .env
    ];

    for (const agentId of possibleAgentIds) {
      try {
        const response = await fetch(`${BASE_URL}/agents/${agentId}`, { headers });
        console.log(`   ${agentId}: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const agentData = await response.json();
          console.log(`      ✅ Found: ${agentData.name}`);
        }
      } catch (error) {
        console.log(`   ${agentId}: Error - ${error.message}`);
      }
    }

    console.log('\n💡 Recommendations:');
    console.log('1. Check if you have the correct Agent ID');
    console.log('2. Verify that the agent exists in your ElevenLabs account');
    console.log('3. Make sure your API key has the necessary permissions');
    console.log('4. Try creating a new agent if needed');

  } catch (error) {
    console.error('❌ List failed:', error.message);
  }
}

// Ejecutar lista
listAvailableAgents(); 