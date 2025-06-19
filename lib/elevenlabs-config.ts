export const ELEVENLABS_CONFIG = {
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || 'agent_default',
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceSettings: {
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.0,
    useSpeakerBoost: true
  }
}; 