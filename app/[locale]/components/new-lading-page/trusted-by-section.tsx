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
  
    return (
      <section className="py-16 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-lg text-gray-400">World-class enterprises trust Writer</h2>
          </div>
  
          {/* Company Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
            {companies.map((company, index) => (
              <div
                key={index}
                className="text-gray-500 font-medium text-sm lg:text-base hover:text-gray-300 transition-colors duration-200"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  