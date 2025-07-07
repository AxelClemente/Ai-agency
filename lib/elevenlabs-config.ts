import { ELEVENLABS_TOOLS } from './elevenlabs-tools';

export const ELEVENLABS_CONFIG = {
  // Agente de hostelería
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT || 'agent_01jwnhydh6eggat3jcjrz1ryfs',
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceSettings: {
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.0,
    useSpeakerBoost: true
  },
  // Configuración de herramientas
  tools: ELEVENLABS_TOOLS,
  toolsEndpoint: '/api/elevenlabs/tools'
}; 