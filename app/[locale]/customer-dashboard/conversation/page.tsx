'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConversationWidget } from './components/conversation-widget'

// Definimos las interfaces necesarias para la Web Speech API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function ConversationPage() {
  const [showWidget, setShowWidget] = useState(false)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🎙️ Habla con nuestro agente</h1>
      <p className="mb-4 text-gray-600">
        Pulsa el botón para empezar a hablar con nuestro asistente virtual.
      </p>

      {!showWidget ? (
        <Button 
          onClick={() => setShowWidget(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          🎤 Empezar
        </Button>
      ) : (
        <div className="w-full max-w-xl">
          <ConversationWidget 
            agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ''} 
          />
        </div>
      )}
    </main>
  )
}
