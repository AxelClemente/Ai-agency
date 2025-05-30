"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-12">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Dream big.
                <br />
                Build fast.
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                The only end-to-end agent builder platform that unites IT & business
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300">
                  <strong className="text-white">Collaborative tools</strong> to build, activate, and supervise AI
                  agents
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300">
                  <strong className="text-white">#1 AI research lab</strong> for enterprises with leading LLMs and RAG
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300">
                  <strong className="text-white">Hands-on programs</strong> to train your builders
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-lg"
              >
                Request a demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-medium text-lg"
              >
                Try for free
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/hero-image.png"
                alt="Modern skyscrapers from low angle perspective"
                fill
                className="object-cover"
                priority
              />

              {/* Play Button Overlay */}
              <div className="absolute top-6 left-6">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/70 hover:bg-black/80 text-white px-4 py-2 rounded-full flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span className="text-sm">Play with sound</span>
                </Button>
              </div>

              {/* Settings Icon */}
              <div className="absolute bottom-6 right-6">
                <Button size="icon" className="bg-black/70 hover:bg-black/80 text-white rounded-full backdrop-blur-sm">
                  <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
