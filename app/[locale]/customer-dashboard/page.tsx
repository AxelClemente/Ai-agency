"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CustomerDashboardPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const router = useRouter()

  const customerMetrics = [
    { 
      image: "/images/support.png", 
      label: "Support", 
      sublabel: "Atención al cliente",
      alt: "Agente de soporte",
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT
    },
    { 
      image: "/images/clinica.png", 
      label: "Clínica Médica", 
      sublabel: "Agenda de citas",
      alt: "Agente médico",
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA
    },
    { 
      image: "/images/hosteleria2.png", 
      label: "Hostelería", 
      sublabel: "Pedidos y reservas",
      alt: "Agente de hostelería",
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
    },
    { 
      image: "/images/RealState.png", 
      label: "Real-state", 
      sublabel: "venta y alquiler",
      alt: "Agente de e-commerce",
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE
    },
  ]

  const customerFeatures = [
    "Conversaciones potenciadas por IA con comprensión del lenguaje natural",
    "Disponibilidad 24/7 para soporte y asistencia instantánea",
    "Respuestas personalizadas basadas en tu historial",
  ]

  const analyticsFeatures = [
    "Conectamos tu agente a sistemas como CRMs o herramientas de gestión para acceder fácilmente a datos como pedidos, suscripciones activas y más.",
    "Nuestro bot puede realizar acciones como actualizar la dirección de un cliente, modificar una suscripción o registrar una solicitud, todo desde la conversación.",
    "Visualiza estadísticas detalladas sobre el rendimiento del bot, identificamos puntos de mejora y optimizamos la experiencia del cliente con datos claros y útiles.",
  ]

  useEffect(() => {
    document.body.style.background = "#000";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const handleStartConversation = () => {
    if (!selectedAgent) {
      toast("Por favor, selecciona un agente antes de iniciar una conversación.")
      return
    }
    router.push(`/customer-dashboard/conversation?agentId=${selectedAgent}`)
  }

  return (
    <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-20 bg-black min-h-screen">
      {/* Go Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 flex items-center text-white hover:text-purple-400 transition z-20"
        aria-label="Volver al inicio"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="hidden sm:inline">Ai Agency</span>
      </button>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Reduce un 60% tus costes
          </div>
          <h2 className="text-[40px] font-normal text-white">
          Llamadas telefónicas con IA  
          </h2>
        </div>

        {/* Dashboard Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Service Card */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
            <div className="mb-8">
              {/* Service Icons */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">CS</span>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Agentes de voz</h3>
              <p className="text-gray-400 mb-6">
                Asistencia avanzada de IA adaptada a tus necesidades y preferencias.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {customerFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ArrowRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-6 py-2 rounded-full`}
                onClick={handleStartConversation}
              >
                Iniciar nueva conversación
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4">
              {customerMetrics.map((metric, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedAgent(metric.agentId || null)}
                  className={`text-center cursor-pointer transition-all duration-200
                    ${selectedAgent === metric.agentId ? 'scale-105' : ''}`}
                >
                  <div className={`w-16 h-16 rounded-full overflow-hidden bg-white/10 mx-auto mb-2
                    ${selectedAgent === metric.agentId ? 'ring-2 ring-purple-500' : ''}`}>
                    <Image
                      src={metric.image}
                      alt={metric.alt}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      priority={index < 2}
                    />
                  </div>
                  <div className="text-white font-semibold text-sm">{metric.label}</div>
                  <div className="text-gray-400 text-xs">{metric.sublabel}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
            <div className="mb-8">
              {/* Analytics Icon */}
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                <div className="w-6 h-6 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16v16H4V4zm2 4h4v8H6V8zm5 0h4v8h-4V8zm5 0h2v8h-2V8z"/>
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Chatbots</h3>
              <p className="text-gray-400 mb-6">
              Tus clientes resuelven dudas y realizan acciones fácilmente mediante un chat inteligente.              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {analyticsFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ArrowRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-6 py-2 rounded-full"
                onClick={() => toast("Próximamente")}
              >
                Probar demo
              </Button>
            </div>

            {/* Analytics Visualization */}
            <div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-full px-8">
                    <div className="bg-purple-500/20 h-32 rounded-lg"></div>
                    <div className="bg-blue-500/20 h-24 rounded-lg"></div>
                    <div className="bg-green-500/20 h-40 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}