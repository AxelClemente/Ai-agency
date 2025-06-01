'use client'

import { ConversationWidget } from './components/conversation-widget'

export default function ConversationPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🎙️ Habla con nuestro agente</h1>
      <p className="mb-4 text-gray-600">
        Usa los controles de abajo para interactuar con nuestro asistente virtual.
      </p>
      
      <div className="w-full max-w-xl">
        <ConversationWidget 
          agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ''} 
        />
      </div>
    </main>
  )
}
