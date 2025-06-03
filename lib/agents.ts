export interface Agent {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  status: 'active' | 'inactive';
}

export const AGENTS: Record<string, Agent> = {
  [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT || '']: {
    id: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT || '',
    name: 'Agente de Soporte',
    description: 'Especializado en atención al cliente y resolución de problemas',
    image: '/images/support.png',
    category: 'Support',
    status: 'active'
  },
  [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA || '']: {
    id: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA || '',
    name: 'Agente Médico',
    description: 'Gestión de citas médicas y consultas de salud',
    image: '/images/clinica.png',
    category: 'Healthcare',
    status: 'active'
  },
  [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '']: {
    id: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '',
    name: 'Agente de Hostelería',
    description: 'Toma de pedidos y atención en restaurantes',
    image: '/images/hosteleria2.png',
    category: 'Restaurant',
    status: 'active'
  },
  [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE || '']: {
    id: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE || '',
    name: 'Agente Inmobiliario',
    description: 'Consultas sobre propiedades y bienes raíces',
    image: '/images/RealState.png',
    category: 'Real Estate',
    status: 'active'
  }
};

export function getAgentById(id: string): Agent | null {
  return AGENTS[id] || null;
}

export function getAllAgents(): Agent[] {
  return Object.values(AGENTS).filter(agent => agent.id);
}

export function getAgentsByCategory(category: string): Agent[] {
  return getAllAgents().filter(agent => agent.category === category);
} 