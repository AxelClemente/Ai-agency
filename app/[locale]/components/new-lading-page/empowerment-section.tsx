import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function EmpowermentSection() {
  const features = [
    {
      title: "Diseña tus flujos",
      description: "Define conversaciones, crea reglas personalizadas y automatiza cada interacción con precisión.",
    },
    {
      title: "Entiende a tus clientes",
      description: "Analiza comportamientos, identifica patrones y actúa con base en datos reales.",
    },
    {
      title: "Controla y escala",
      description: "Haz upselling, deriva llamadas a humanos cuando sea necesario y mejora continuamente cada punto de contacto",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-stretch min-h-full">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">Dashboard personalizado</div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Insights y métricas</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
              Desarrollamos software que te ofrece información relevante y análisis inteligentes, ayudándote a entender el comportamiento de tus clientes y a mejorar tus procesos.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <ArrowRight className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Link */}
            <div>
              <Link
                href="/talk-to-expert"
                className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>Solicita una demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Content - Carousel */}
          <div className="flex flex-col gap-8 h-full min-h-full items-stretch">
            <div className="relative rounded-3xl overflow-hidden w-full h-full min-h-[240px]">
              <Image
                src="/images/dashboard1.png"
                alt="Dashboard ejemplo 1"
                width={1200}
                height={800}
                className="w-full h-full object-cover rounded-3xl"
                priority
              />
            </div>
            <div className="relative rounded-3xl overflow-hidden w-full h-full min-h-[240px]">
              <Image
                src="/images/dashboard2.png"
                alt="Dashboard ejemplo 2"
                width={1200}
                height={800}
                className="w-full h-full object-cover rounded-3xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
