'use client';
import { X, Clock,Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/conversation';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  analyzeRestaurantOrder,
  analyzeSupportTicket,
  analyzeMedicalAppointment,
  analyzeRealEstateInquiry,
  RestaurantAnalysisComponent,
  SupportAnalysisComponent,
  MedicalAnalysisComponent,
  RealEstateAnalysisComponent,
  BusinessInsight
} from '../utils/analysis';
import type { RestaurantAnalysis, SupportAnalysis, MedicalAnalysis, RealEstateAnalysis } from '../utils/types/analysis-types';

interface TranscriptSummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: string;
  messages: Message[];
  agentId: string;
  duration: number;
  conversationId: string;
}

export function TranscriptSummaryPanel({
  isOpen,
  onClose,
  transcript,
  messages,
  agentId,
  duration,
  conversationId
}: TranscriptSummaryPanelProps) {
  const router = useRouter();

  // Deshabilitar scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar scroll cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatDuration = (seconds: number) => {
    console.log('Duration recibida:', seconds, typeof seconds);
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    console.log('Mins calculados:', mins, 'Secs calculados:', secs);
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // const conversationId = conversationId // Reservado para uso futuro
  // const userMessages = messages.filter(m => m.role === 'user').length // Reservado para uso futuro
  // const agentMessages = messages.filter(m => m.role === 'ai').length // Reservado para uso futuro

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

  // Análisis inteligente por tipo de agente
  const getBusinessInsights = (agentId: string, transcript: string): BusinessInsight => {
    const agentInsights: Record<string, BusinessInsight> = {
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '']: {
        type: 'hosteleria',
        icon: '🍕',
        title: 'Análisis del Pedido',
        insights: analyzeRestaurantOrder(transcript)
      },
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT || '']: {
        type: 'support',
        icon: '🎧',
        title: 'Análisis de Soporte',
        insights: analyzeSupportTicket(transcript)
      },
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA || '']: {
        type: 'medical',
        icon: '🏥',
        title: 'Análisis de Cita',
        insights: analyzeMedicalAppointment(transcript)
      },
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE || '']: {
        type: 'realstate',
        icon: '🏠',
        title: 'Análisis Inmobiliario',
        insights: analyzeRealEstateInquiry(transcript)
      }
    };
    
    return agentInsights[agentId] || {
      type: 'general',
      icon: '💬',
      title: 'Análisis General',
      insights: { completed: true, summary: 'Interacción registrada exitosamente' }
    };
  };

  const businessData = getBusinessInsights(agentId, transcript);

  // Renderizar componente específico de análisis
  const renderAnalysisComponent = () => {
    switch (businessData.type) {
      case 'hosteleria':
        return <RestaurantAnalysisComponent insights={businessData.insights as RestaurantAnalysis} />;
      case 'support':
        return <SupportAnalysisComponent insights={businessData.insights as SupportAnalysis} />;
      case 'medical':
        return <MedicalAnalysisComponent insights={businessData.insights as MedicalAnalysis} />;
      case 'realstate':
        return <RealEstateAnalysisComponent insights={businessData.insights as RealEstateAnalysis} />;
      default:
        return <div className="text-sm text-gray-600">Análisis no disponible</div>;
    }
  };

  const handleViewFullAnalysis = () => {
    router.push('/customer-dashboard/dashboard-customer-panel/analytics');
  };

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
        fixed top-16 right-0 h-[calc(100vh-4rem)] w-[600px] bg-white shadow-2xl z-50
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

          {/* Content mejorado */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Solo Duración - más prominente */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Duración de la Conversación</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatDuration(duration)}
              </p>
            </div>

            {/* Análisis Inteligente por Negocio - más espacio */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">{businessData.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{businessData.title}</h3>
              </div>
              
              {/* Renderizado específico por tipo de agente */}
              {renderAnalysisComponent()}

              {/* Resumen automático - más prominente */}
              <div className="mt-6 p-4 bg-white/80 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Resumen Automático</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{businessData.insights.summary}</p>
              </div>
            </div>

            {/* Transcripción como Chat */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <span>💬</span>
                <span>Conversación</span>
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto space-y-3">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {/* Mensaje del Agente */}
                      {message.role === 'ai' && (
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          {/* Avatar del agente */}
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                              src={agentInfo.image}
                              alt={agentInfo.alt}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          {/* Burbuja del agente */}
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
                          {/* Burbuja del usuario */}
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
                  // Fallback si no hay mensajes estructurados
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">No hay mensajes disponibles</p>
                    <p className="text-xs mt-1">Transcripción sin procesar:</p>
                    <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap font-sans">
                      {transcript || 'No disponible'}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 space-y-3">
            <Button 
              variant="outline"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={handleViewFullAnalysis}
            >
              📊 Ver Análisis Completo
            </Button>
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