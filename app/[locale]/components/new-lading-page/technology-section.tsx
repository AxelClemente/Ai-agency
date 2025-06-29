import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUp } from "lucide-react"

export default function TechnologySection() {
  const llmMetrics = [
    { score: "10", label: "IQ", sublabel: "85% Accuracy" },
    { score: "11", label: "Reasoning", sublabel: "III Benchmark" },
    { score: "11", label: "Coding", sublabel: "85.9% HumanEval" },
    { score: "11", label: "Math", sublabel: "9.04 MATH Benchmark" },
  ]

  const llmFeatures = [
    "Agent-ready: Advanced reasoning, tool-calling, and more",
    "Trusted: Secure, private, IP-friendly and commercially safe",
    "Specialized: Proactive deprecation policies and no LLM sprawl",
  ]

  const knowledgeFeatures = [
    "Uncompromising accuracy: Data retrieval of semantic relationships",
    "Business-user friendly: Bring full-text search interfaces and connectors",
    "Transparent and reliable: Decomposed thought process and clear citations",
  ]

  return (
    <section className="py-20 bg-black relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">TECHNOLOGY</div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white">#1 AI research lab for enterprises</h2>
        </div>

        {/* Technology Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* State-of-the-art LLMs Card */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
            <div className="mb-8">
              {/* Model Icons */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-600 border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">L</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-600 border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">State-of-the-art LLMs</h3>
              <p className="text-gray-400 mb-6">
                Our family of specialized LLMs built for any industry and adaptable to any agent.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {llmFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ArrowRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-6 py-2 rounded-full">
                Explore Palmyra LLMs
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4">
              {llmMetrics.map((metric, index) => (
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

          {/* Knowledge Graph Card */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
            <div className="mb-8">
              {/* Knowledge Graph Icon */}
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                <div className="w-6 h-6 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="6" cy="6" r="2" />
                    <circle cx="18" cy="6" r="2" />
                    <circle cx="6" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />
                    <path d="M9 9l6 6M9 15l6-6" stroke="currentColor" strokeWidth="1" fill="none" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Knowledge Graph</h3>
              <p className="text-gray-400 mb-6">
                Connect LLMs to your data to ground generative AI in your business context.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {knowledgeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ArrowRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-6 py-2 rounded-full">
                Explore Knowledge Graph
              </Button>
            </div>

            {/* Knowledge Graph Visualization */}
            <div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Network nodes and connections visualization */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                      Advisory
                    </div>
                  </div>

                  {/* Surrounding nodes */}
                  <div className="absolute top-4 left-8 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    Data
                  </div>
                  <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    Insights
                  </div>
                  <div className="absolute bottom-4 left-8 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                    Models
                  </div>
                  <div className="absolute bottom-4 right-8 w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">
                    Results
                  </div>

                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Flecha flotante para volver arriba */}
      <a
        href="#hero"
        aria-label="Volver arriba"
        className="flex fixed right-4 bottom-4 md:right-8 md:bottom-8 z-50 items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 shadow-lg hover:bg-indigo-700 transition-colors duration-200 group"
      >
        <ArrowUp className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:-translate-y-1 transition-transform duration-200" />
      </a>
    </section>
  )
}
