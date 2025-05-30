"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function PlatformSection() {
  const [activeTab, setActiveTab] = useState("BUILD")

  const tabs = ["BUILD", "ACTIVATE", "SUPERVISE"]

  return (
    <section className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">PLATFORM</div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">IT & business, united at last</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Eliminate silos with the end-to-end platform designed for collaboration—without compromise.
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-1 bg-gray-900 rounded-full p-1">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeTab === tab ? "bg-green-500 text-black" : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Demo */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Platform Interface */}
          <div className="relative">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Platform interface showing workflow builder"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <div className="text-sm font-medium text-green-500 uppercase tracking-wider mb-4">
                For technical & business builders
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Build faster,
                <br />
                together.
              </h3>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">
                  <strong className="text-white">Powerful building blocks</strong> to create AI agents
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">
                  <strong className="text-white">Flexible blueprints</strong> to guide best practices
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">
                  <strong className="text-white">Seamless, drag-and-drop</strong> UI builder and more
                </span>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Button className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full font-medium">
                Explore AI HQ
              </Button>
            </div>

            {/* Testimonial */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <blockquote className="text-gray-300 mb-4">
                "Writer enables us to co-build, combining IT's technical skills and the business' domain knowledge to
                drive greater impact than we could alone."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Customer testimonial"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Chief Information Officer</div>
                  <div className="text-gray-400 text-xs">CHAMPION</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
