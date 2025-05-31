export default function TrustedBySection() {
    const companies = [
      "Salesforce",
      "Prudential",
      "Qualcomm",
      "American Eagle",
      "ally",
      "Uber",
      "LENNAR",
      "Kenvu",
      "accenture",
      "INTUIT",
      "Hilton",
      "Dropbox",
    ]
  
    // Duplicamos el array para crear un efecto continuo
    const duplicatedCompanies = [...companies, ...companies]
  
    return (
      <section className="py-16 bg-black overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-lg">
                Soluciones de IA elegidas por empresas que apuestan por el futuro
            </h2>
          </div>
  
          {/* Contenedor con overflow hidden */}
          <div className="relative">
            {/* Contenedor de logos con animación */}
            <div className="flex space-x-8 animate-scroll">
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={`${company}-${index}`}
                  className="flex-none text-gray-500 font-medium text-sm lg:text-base hover:text-gray-300 transition-colors duration-200 whitespace-nowrap"
                >
                  {company}
                </div>
              ))}
            </div>
  
            {/* Gradiente para suavizar los bordes */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-black to-transparent" />
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-black to-transparent" />
          </div>
        </div>
      </section>
    )
  }
  