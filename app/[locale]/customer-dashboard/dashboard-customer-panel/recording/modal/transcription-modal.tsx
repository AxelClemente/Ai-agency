'use client';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect } from 'react';

interface TranscriptionMessage {
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: {
    id: string;
    agentId: string;
    duration: number;
    transcript: string;
    messages: TranscriptionMessage[];
    startedAt: string;
  };
}

export function TranscriptionModal({
  isOpen,
  onClose,
  conversation
}: TranscriptionModalProps) {
  
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const agentInfo = getAgentInfo(conversation.agentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
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
                Transcripción de Conversación
              </h2>
              <p className="text-sm text-gray-500">
                Agente de {agentInfo.name} • {new Date(conversation.startedAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Duración */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Duración de la Conversación</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {formatDuration(conversation.duration)}
            </p>
          </div>

          {/* Transcripción como Chat */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <span>💬</span>
              <span>Conversación</span>
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto space-y-3">
              {conversation.messages && conversation.messages.length > 0 ? (
                conversation.messages.map((message: TranscriptionMessage, index: number) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {/* Mensaje del Agente */}
                    {message.role === 'ai' && (
                      <div className="flex items-start space-x-2 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={agentInfo.image}
                            alt={agentInfo.alt}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-2 shadow-sm">
                          <p className="text-sm text-gray-800 leading-relaxed">{message.message}</p>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {new Date(message.timestamp).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mensaje del Usuario */}
                    {message.role === 'user' && (
                      <div className="flex items-start space-x-2 max-w-[80%]">
                        <div className="bg-blue-500 text-white rounded-2xl rounded-tr-md px-4 py-2 shadow-sm">
                          <p className="text-sm leading-relaxed">{message.message}</p>
                          <span className="text-xs text-blue-100 mt-1 block">
                            {new Date(message.timestamp).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">Transcripción sin procesar:</p>
                  <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap font-sans bg-white p-4 rounded border">
                    {conversation.transcript || 'No disponible'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <Button 
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            Cerrar Transcripción
          </Button>
        </div>
      </div>
    </div>
  );
} 