'use client';
import { useConversation } from '@elevenlabs/react';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface ConversationWidgetProps {
  agentId: string;
}

export function ConversationWidget({ agentId }: ConversationWidgetProps) {
  const [transcript, setTranscript] = useState<string>('');
  const { data: session } = useSession();
  const { toast } = useToast();
  const startTimeRef = useRef<Date | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      startTimeRef.current = new Date(); // Guardamos el tiempo de inicio
      toast({
        title: 'Conectado',
        description: 'La conversación ha iniciado exitosamente'
      });
    },
    onDisconnect: () => {
      toast({
        title: 'Desconectado',
        description: 'La conversación ha finalizado'
      });
    },
    onMessage: (msg) => {
      setTranscript(prev => `${prev}Agente: ${msg.message}\n`);
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: 'Hubo un problema con la conversación',
        variant: 'destructive'
      });
    },
  });

  const saveTranscript = async () => {
    try {
      const startTime = startTimeRef.current || new Date();
      const endTime = new Date();
      const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      console.log('Guardando transcripción:', {
        transcript,
        userId: session?.user?.id,
        agentId,
        duration: durationInSeconds
      });
      
      const response = await fetch('/api/transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          userId: session?.user?.id,
          agentId,
          duration: durationInSeconds,
          cost: 0, // Este valor vendría de la API de ElevenLabs
          status: 'completed',
          metadata: {
            startedAt: startTime,
            endedAt: endTime,
            isSpeaking: conversation.isSpeaking,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error saving transcript');
      }
      
      toast({
        title: 'Conversación guardada',
        description: 'La transcripción se ha guardado correctamente'
      });
    } catch (error) {
      console.error('Error al guardar transcripción:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la transcripción',
        variant: 'destructive'
      });
    }
  };

  // Iniciar la conversación
  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }); // permisos
      await conversation.startSession({ agentId });            // ID del agente de dashboard
    } catch (e) {
      console.error('Error al iniciar:', e);
    }
  }, [conversation, agentId]);

  // Detener la conversación
  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    // Al terminar, guardar la transcripción en la base de datos
    await saveTranscript();
  }, [conversation, saveTranscript]);

  return (
    <div>
      <div>
        <button onClick={startConversation} disabled={conversation.status==='connected'}>
          Iniciar Conversación
        </button>
        <button onClick={stopConversation} disabled={conversation.status!=='connected'}>
          Finalizar Conversación
        </button>
      </div>
      <div>
        <p>Estado: {conversation.status}</p>
        <p>El agente está {conversation.isSpeaking ? 'hablando' : 'escuchando'}</p>
      </div>
      <textarea
        rows={6}
        readOnly
        value={transcript}
        placeholder="Transcripción aparecerá aquí..."
      />
    </div>
  );
}
