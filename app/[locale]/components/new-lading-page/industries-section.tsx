import { ArrowUpRight, Building2, Heart, ShoppingBag, Laptop } from "lucide-react"

export default function IndustriesSection() {
  const industries = [
    {
      title: "Restauración",
      icon: Building2,
      href: "/industries/financial-services",
    },
    {
      title: "Hoteles",
      icon: Heart,
      href: "/industries/healthcare",
    },
    {
      title: "Talleres",
      icon: ShoppingBag,
      href: "/industries/retail",
    },
    {
      title: "Salud",
      icon: Laptop,
      href: "/industries/technology",
    },
  ]

  return (
    <section className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">INDUSTRIES</div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white">Una solución. Múltiples industrias.</h2>
        </div>

        {/* Industries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => {
            const IconComponent = industry.icon
            return (
              <a
                key={index}
                href={industry.href}
                className="group bg-gray-900 hover:bg-gray-800 rounded-2xl p-8 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-semibold text-lg mb-4 flex-grow">{industry.title}</h3>

                  {/* Arrow */}
                  <div className="flex justify-end">
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
