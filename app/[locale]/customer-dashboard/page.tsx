import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth.config"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions)
  const firstName = session?.user?.name?.split(' ')[0] || 'User'

  const customerMetrics = [
    { score: "24", label: "Chats", sublabel: "This Month" },
    { score: "98%", label: "Success", sublabel: "Rate" },
    { score: "4.9", label: "Rating", sublabel: "Average" },
    { score: "15m", label: "Time", sublabel: "Per Chat" },
  ]

  const customerFeatures = [
    "Conversaciones potenciadas por IA con comprensión del lenguaje natural",
    "Disponibilidad 24/7 para soporte y asistencia instantánea",
    "Respuestas personalizadas basadas en tu historial",
  ]

  const analyticsFeatures = [
    "Real-time conversation tracking and analytics",
    "Detailed insights into customer interactions",
    "Performance metrics and improvement suggestions",
  ]

  return (
    <section className="py-20 bg-black min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Agentes de voz</div>
          <h2 className="text-[40px] font-normal text-white">¿Preparado para el futuro {firstName}?</h2>
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

              <h3 className="text-2xl font-bold text-white mb-4">Atención al cliente</h3>
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

              <Link href="/customer-dashboard/conversation">
                <Button className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-6 py-2 rounded-full">
                  Iniciar nueva conversación
                </Button>
              </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4">
              {customerMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-lg">{metric.score}</span>
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

              <h3 className="text-2xl font-bold text-white mb-4">Agente de Ventas</h3>
              <p className="text-gray-400 mb-6">
                Track your conversation history and performance metrics.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {analyticsFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ArrowRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-6 py-2 rounded-full">
                View Analytics
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