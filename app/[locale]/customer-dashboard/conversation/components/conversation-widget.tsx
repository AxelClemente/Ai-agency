'use client';
import { useConversation } from '@elevenlabs/react';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Message, Role, ConversationStatus } from '@/types/conversation';
import { TranscriptSummaryPanel } from './transcript-summary-panel';

interface ConversationWidgetProps {
  agentId: string;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
}

export function ConversationWidget({ agentId, isPanelOpen, setIsPanelOpen }: ConversationWidgetProps) {
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [finalDuration, setFinalDuration] = useState<number>(0);
  const { data: session } = useSession();
  const { toast } = useToast();
  const startTimeRef = useRef<Date | null>(null);

  const conversation = useConversation({
    agentId,
    onConnect: () => {
      startTimeRef.current = new Date();
      console.log('Conversación iniciada en:', startTimeRef.current);
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
        timestamp,
        agentId
      }]);
    },
    onUserMessage: (msg: string) => {
      const timestamp = new Date();
      setTranscript(prev => `${prev}Usuario: ${msg}\n`);
      setMessages(prev => [...prev, {
        role: 'user',
        message: msg,
        timestamp,
        agentId
      }]);
    },
    onError: () => {
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
          agentId,
          userId: session?.user?.id,
          duration: durationInSeconds,
          cost: 0,
          status: 'completed' as ConversationStatus,
          messages,
          metadata: {
            startedAt: startTime,
            endedAt: endTime,
            isSpeaking: false,
            systemInfo: {
              version: '1.0',
              timestamp: new Date(),
              agentId
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error saving transcript');
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

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId });
      console.log('Iniciando conversación con agentId:', agentId);
    } catch (e) {
      console.error('Error al iniciar:', e);
      toast({
        title: 'Error',
        description: 'No se pudo iniciar la conversación',
        variant: 'destructive'
      });
    }
  }, [conversation, agentId, toast]);

  const stopConversation = useCallback(async () => {
    try {
      const endTime = new Date();
      const startTime = startTimeRef.current || endTime;
      const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      
      setFinalDuration(durationInSeconds);
      
      console.log('Duración final calculada:', durationInSeconds);
      
      await conversation.endSession();
      await saveTranscript();
      
      toast({
        title: 'Conversación finalizada',
        description: 'La conversación se ha guardado exitosamente'
      });
      
      setIsPanelOpen(true);
      
    } catch (error) {
      console.error('Error al finalizar conversación:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al finalizar la conversación',
        variant: 'destructive'
      });
    }
  }, [conversation, saveTranscript, setIsPanelOpen, toast]);

  const handleTestPanel = () => {
    setIsPanelOpen(true);
    toast({
      title: 'Panel de prueba',
      description: 'Abriendo panel en modo de prueba'
    });
  };

  const getDuration = () => {
    if (finalDuration > 0) {
      console.log('Usando duración final guardada:', finalDuration);
      return finalDuration;
    }
    
    if (!startTimeRef.current) return 0;
    
    const now = new Date().getTime();
    const start = startTimeRef.current.getTime();
    const diffMs = now - start;
    const diffSeconds = Math.floor(diffMs / 1000);
    
    console.log('Calculando duración en tiempo real:', diffSeconds);
    return diffSeconds;
  };

  return (
    <>
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
          <Button 
            onClick={handleTestPanel}
            variant="outline"
            className="text-blue-500 hover:text-blue-700 rounded-full 
                       px-8 h-12 transition-all duration-200 border-blue-300"
          >
            Test
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

      <TranscriptSummaryPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        transcript={transcript}
        messages={messages}
        agentId={agentId}
        duration={getDuration()}
      />
    </>
  );
}
