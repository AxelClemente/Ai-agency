'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

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
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript
      setTranscript(text)

      // Enviar texto al backend y obtener respuesta del agente
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })

      const data = await res.json()
      setResponse(data.reply)

      // Aquí podrías hacer TTS usando ElevenLabs
    }

    recognition.onerror = (e) => {
      console.error('Error de reconocimiento:', e)
    }

    recognitionRef.current = recognition
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }

    setIsRecording(!isRecording)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🎙️ Habla con nuestro agente</h1>
      <p className="mb-4 text-gray-600">
        Pulsa el botón para empezar a hablar con Pizzería Nonna Mia.
      </p>
      <Button onClick={toggleRecording}>
        {isRecording ? '🛑 Detener' : '🎤 Empezar'}
      </Button>

      {transcript && (
        <div className="mt-6 w-full max-w-xl bg-white shadow-md rounded p-4">
          <p className="text-sm text-gray-500">Tú:</p>
          <p className="text-lg">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 w-full max-w-xl bg-white shadow-md rounded p-4">
          <p className="text-sm text-gray-500">Agente:</p>
          <p className="text-lg">{response}</p>
        </div>
      )}
    </main>
  )
}
