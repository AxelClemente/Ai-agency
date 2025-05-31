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
              <h1 className="text-[58px] leading-[58px] font-normal text-white">
                Piensa, Automatiza
                <br />
                Escala
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                La agencia de AI que transforma procesos en resultados medibles.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300 font-graphik text-feature-list font-semibold">
                  <strong className="text-[#d2b3ee]">Chatbots </strong>personalizados que escalan tu atención al cliente
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300 font-graphik text-feature-list font-semibold">
                  <strong className="text-[#d2b3ee]">Agentes de voz</strong> entienden, responden y venden en tiempo real
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowRight className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-gray-300 font-graphik text-feature-list font-semibold">
                  <strong className="text-[#d2b3ee]">Software con IA</strong> automatizaciones, herramientas a medida y web Apps inteligentes
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-[13px] leading-[24px] font-poppins"
              >
                Request a demo
              </Button>
              <Button
                size="lg"
                className="bg-black text-white border border-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold text-[13px] leading-[24px] font-poppins"
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
