'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ConversationWidget } from './components/conversation-widget'

export default function ConversationPage() {
  const searchParams = useSearchParams()
  const agentId = searchParams.get('agentId')
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)

  // Añadimos un console.log para debug
  console.log('Agent ID recibido:', agentId)

  if (!agentId) {
    return <div>Error: No se especificó un agente</div>
  }

  return (
    <main className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 transition-all duration-300 ${
      isPanelOpen ? 'mr-[500px]' : ''
    }`}>
      <h1 className="text-[40px] font-normal font-poppins mb-6">
        🎙️ Habla con nuestro agente
      </h1>
      <p className="mb-4 text-gray-600">
        Usa los controles de abajo para interactuar con nuestro asistente virtual.
      </p>
      
      <div className="w-full max-w-xl">
        <ConversationWidget 
          agentId={agentId}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />
      </div>
    </main>
  )
}
