"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLocale } from "next-intl"

export default function HeroSection() {
  const locale = useLocale()

  return (
    <section className="relative overflow-hidden bg-black min-h-[60vh] flex items-center" style={{maxHeight: 500}}>
      {/* Video Background - Right Half, only inside hero section */}
      <div className="absolute top-0 right-0 w-1/2 h-full z-0 max-h-[500px]">
        <video
          src="/videos/video-landing.mp4"
          className="object-cover w-full h-full max-h-[500px]"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        />
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

      {/* Content Container */}
      <div className="relative z-10 w-full px-0">
        <div className="flex items-center min-h-[60vh] py-12" style={{maxHeight: 500}}>
          {/* Left Content - Takes up to 50% of the width */}
          <div className="w-full lg:w-1/2 space-y-8 pl-32">
            <div className="space-y-6">
              <h1 className="text-[58px] leading-[58px] font-normal text-white">
                Automatiza procesos
                <br />
                Con AI
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
              <Link href={`/${locale}/customer-dashboard`}>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-8 rounded-full font-semibold text-[13px] leading-[24px] font-poppins w-full sm:w-auto h-[45px]"
                >
                  Solicita una demo
                </Button>
              </Link>
              <Link href={`/${locale}/customer-dashboard`}>
                <Button
                  size="lg"
                  className="bg-black text-white border border-white hover:bg-white hover:text-black px-8 rounded-full font-semibold text-[13px] leading-[24px] font-poppins w-full sm:w-auto h-[45px]"
                >
                  Pruebalo gratis
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side is now just empty space for the video background */}
          <div className="hidden lg:block w-1/2"></div>
        </div>
      </div>
    </section>
  )
}
