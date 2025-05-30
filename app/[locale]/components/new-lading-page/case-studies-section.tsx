"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"

export default function CaseStudiesSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const caseStudies = [
    {
      company: "Vanguard",
      metric: "Efficiency",
      description:
        "Delivering exceptional value to our company, this system significantly and seamlessly enhanced our team achievements.",
      author: {
        name: "Nitin Tandon",
        title: "Chief Information Officer",
        image: "/placeholder.svg?height=80&width=80",
      },
      gradient: "from-purple-600 to-pink-600",
    },
    {
      company: "Qualcomm",
      metric: "2.4k",
      metricLabel: "hours saved per month",
      description: "Streamlined our workflow processes significantly.",
      author: {
        name: "Don McGuire",
        title: "Chief Marketing Officer",
        image: "/placeholder.svg?height=80&width=80",
      },
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      company: "INTUIT",
      metric: "18x",
      metricLabel: "ROI",
      description: "Transformed our content creation capabilities.",
      author: {
        name: "Tina O'Berg",
        title: "Director, Content Strategy",
        image: "/placeholder.svg?height=80&width=80",
      },
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      company: "KAUFMAN ROSSIN",
      metric: "50-70%",
      metricLabel: "Time saved",
      description: "Revolutionized our client service delivery.",
      author: {
        name: "Albert Primo",
        title: "Managing Partner",
        image: "/placeholder.svg?height=80&width=80",
      },
      gradient: "from-gray-600 to-gray-800",
    },
    {
      company: "Salesforce",
      metric: "20%",
      metricLabel: "Time saved per week",
      description: "Enhanced our sales team productivity.",
      author: {
        name: "Jessica Bergmann",
        title: "VP of Sales Operations",
        image: "/placeholder.svg?height=80&width=80",
      },
      gradient: "from-green-600 to-teal-600",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, caseStudies.length - 2))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, caseStudies.length - 2)) % Math.max(1, caseStudies.length - 2))
  }

  return (
    <section className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Proven in pilots. Scaled in production. Delivering real ROI.
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex space-x-2">
            <Button onClick={prevSlide} size="icon" className="bg-gray-800 hover:bg-gray-700 text-white rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button onClick={nextSlide} size="icon" className="bg-gray-800 hover:bg-gray-700 text-white rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Cards Container */}
          <div className="overflow-hidden ml-20">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              {caseStudies.map((study, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-3">
                  <div
                    className={`bg-gradient-to-br ${study.gradient} rounded-2xl p-8 h-80 flex flex-col justify-between relative overflow-hidden`}
                  >
                    {/* Company Logo */}
                    <div className="mb-4">
                      <div className="text-white font-bold text-lg">{study.company}</div>
                    </div>

                    {/* Metric */}
                    <div className="mb-6">
                      <div className="text-4xl lg:text-5xl font-bold text-white mb-1">{study.metric}</div>
                      {study.metricLabel && <div className="text-white/80 text-sm">{study.metricLabel}</div>}
                    </div>

                    {/* Author */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20">
                        <Image
                          src={study.author.image || "/placeholder.svg"}
                          alt={study.author.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{study.author.name}</div>
                        <div className="text-white/80 text-xs">{study.author.title}</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center space-x-2 text-white hover:text-white/80 cursor-pointer">
                      <span className="text-sm font-medium">See the case study</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
