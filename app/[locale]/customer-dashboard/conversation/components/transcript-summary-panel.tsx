'use client';
import { X, Clock, MessageSquare, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/conversation';
import Image from 'next/image';

interface TranscriptSummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: string;
  messages: Message[];
  agentId: string;
  duration: number;
}

export function TranscriptSummaryPanel({
  isOpen,
  onClose,
  transcript,
  messages,
  agentId,
  duration
}: TranscriptSummaryPanelProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const userMessages = messages.filter(m => m.role === 'user').length;
  const agentMessages = messages.filter(m => m.role === 'ai').length;

  const getAgentInfo = (id: string) => {
    const agentMap: Record<string, { name: string; image: string; alt: string }> = {
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT || '']: {
        name: 'Soporte',
        image: '/images/support.png',
        alt: 'Agente de soporte'
      },
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA || '']: {
        name: 'Clínica Médica',
        image: '/images/clinica.png',
        alt: 'Agente médico'
      },
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '']: {
        name: 'Hostelería',
        image: '/images/hosteleria2.png',
        alt: 'Agente de hostelería'
      },
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE || '']: {
        name: 'Inmobiliario',
        image: '/images/RealState.png',
        alt: 'Agente inmobiliario'
      }
    };
    return agentMap[id] || { name: 'Agente', image: '/images/default-agent.png', alt: 'Agente' };
  };

  const agentInfo = getAgentInfo(agentId);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div className={`
        fixed top-16 right-0 h-[calc(100vh-4rem)] w-[500px] bg-white shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header con Avatar */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-4">
              {/* Avatar del Agente */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={agentInfo.image}
                  alt={agentInfo.alt}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Resumen de Conversación
                </h2>
                <p className="text-sm text-gray-500">
                  Agente de {agentInfo.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Métricas - Ahora en 2x2 para aprovechar el ancho */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Duración</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {formatDuration(duration)}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Mensajes</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {messages.length}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Usuario</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {userMessages}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Agente</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {agentMessages}
                </p>
              </div>
            </div>

            {/* Transcripción */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Transcripción Completa</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {transcript || 'No hay transcripción disponible'}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <Button 
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              Cerrar Resumen
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 