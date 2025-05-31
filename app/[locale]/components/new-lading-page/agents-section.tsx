"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AgentsSection() {
  const [activeTab, setActiveTab] = useState("Sales")

  const tabs = ["Atención al cliente", "Ventas"]

  return (
    <section className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 grid grid-cols-2 gap-1">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
              <div className="w-4 h-4 bg-white rounded-sm"></div>
              <div className="w-4 h-4 bg-white rounded-sm"></div>
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>

          <h2 className="text-[40px] font-normal text-white mb-6">Automatiza tu atención al cliente</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            con agentes que interactúan como si fueran parte de tu equipo.
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
            <Link href={activeTab === "Atención al cliente" ? "/customer-dashboard/conversation" : "#"}>
              <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium">
                Agente de {activeTab}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
