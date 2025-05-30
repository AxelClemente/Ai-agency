"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AgentsSection() {
  const [activeTab, setActiveTab] = useState("Sales")

  const tabs = ["Sales", "Marketing", "Operations", "Support"]

  return (
    <section className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 grid grid-cols-2 gap-1">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Agents that actually work</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            They know the job, know their limits, and self-orchestrate—without the guesswork.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-gray-900 rounded-full p-1">
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeTab === tab ? "bg-white text-black" : "bg-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 lg:p-12 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">{activeTab} Agent Demo</h3>
            <p className="text-gray-300 mb-8">
              Interactive demo content for {activeTab.toLowerCase()} agents would be displayed here.
            </p>
            <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium">
              Explore {activeTab} Agents
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
