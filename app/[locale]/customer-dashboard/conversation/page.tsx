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
    <main className={`flex flex-col items-center justify-center min-h-screen bg-[#f2f4f5] pt-6 pb-8 sm:pt-12 sm:pb-16 lg:pt-20 lg:pb-20 transition-all duration-300 ${
      isPanelOpen ? 'mr-[500px]' : ''
    }`}>
      <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-normal font-poppins mb-4 sm:mb-6 text-center">
        🎙️ Habla con nuestro agente
      </h1>
      <p className="mb-4 text-gray-600 text-sm sm:text-base text-center">
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
