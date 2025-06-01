'use client';
import { useConversation } from '@elevenlabs/react';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Message, Role, ConversationStatus } from '@/types/conversation';

interface ConversationWidgetProps {
  agentId: string;
}

export function ConversationWidget({ agentId }: ConversationWidgetProps) {
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();
  const { toast } = useToast();
  const startTimeRef = useRef<Date | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      startTimeRef.current = new Date();
      toast({
        title: 'Conectado',
        description: 'La conversación ha iniciado exitosamente'
      });
    },
    onMessage: (msg: { message: string; source: Role }) => {
      const timestamp = new Date();
      setTranscript(prev => `${prev}Agente: ${msg.message}\n`);
      setMessages(prev => [...prev, {
        role: msg.source,
        message: msg.message,
        timestamp
      }]);
    },
    onUserMessage: (msg: string) => {
      const timestamp = new Date();
      setTranscript(prev => `${prev}Usuario: ${msg}\n`);
      setMessages(prev => [...prev, {
        role: 'user',
        message: msg,
        timestamp
      }]);
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

      const response = await fetch('/api/transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          userId: session?.user?.id,
          agentId,
          duration: durationInSeconds,
          cost: 0, // Por ahora lo dejamos en 0
          status: 'completed' as ConversationStatus,
          messages,
          metadata: {
            startedAt: startTime,
            endedAt: endTime,
            isSpeaking: false, // Por ahora lo dejamos en false
            systemInfo: {
              version: '1.0',
              timestamp: new Date()
            }
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
    <div className="space-y-4 flex flex-col items-center">
      <div className="flex justify-center gap-4">
        <Button 
          onClick={startConversation} 
          disabled={conversation.status === 'connected'}
          className="bg-black hover:bg-gray-800 text-white rounded-full 
                     px-8 h-12 transition-all duration-200"
        >
          Iniciar Conversación
        </Button>
        <Button 
          onClick={stopConversation} 
          disabled={conversation.status !== 'connected'}
          variant="outline"
          className="text-gray-500 hover:text-gray-700 rounded-full 
                     px-8 h-12 transition-all duration-200 border-gray-300"
        >
          Finalizar Conversación
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        <p>Estado: {conversation.status}</p>
      </div>

      <div className="relative w-full">
        <textarea
          className="w-full min-h-[300px] p-6 border rounded-2xl bg-white shadow-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-none font-medium text-gray-700"
          readOnly
          value={transcript}
          placeholder="La transcripción aparecerá aquí..."
        />
        {conversation.status === 'connected' && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">Escuchando...</span>
          </div>
        )}
      </div>
    </div>
  );
}
