import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function EmpowermentSection() {
  const features = [
    {
      title: "Self-paced training",
      description: "Writer AI Academy: certifications, on-demand courses, and more",
    },
    {
      title: "Proven methodology",
      description: "Tested by change management and AI transformation programs",
    },
    {
      title: "Dedicated team",
      description: "Experts who understand AI maturity, train your technical teams, and more",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">EMPOWERMENT</div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">We build your builders</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your team knows the work best. We upskill your next generation of AI builders to reimagine how work gets
                done—with AI at the center.
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
              <a
                href="/talk-to-expert"
                className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>Talk to an expert</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Content - Image Collage */}
          <div className="relative">
            <div className="relative">
              {/* Main container with circular pattern overlay */}
              <div className="relative rounded-3xl overflow-hidden">
                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="space-y-4">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Team collaboration"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Training session"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Workshop"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Team meeting"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Circular Pattern Overlay */}
                <div className="absolute bottom-4 right-4">
                  <div className="w-20 h-20 rounded-full border-4 border-purple-600 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-400">
                      <div className="w-full h-full rounded-full border border-purple-300 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                      </div>
                    </div>
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
