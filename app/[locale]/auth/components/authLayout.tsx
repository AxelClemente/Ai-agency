'use client'

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthLayoutProps {
  children: React.ReactNode;
  headerText?: {
    title: string;
    subtitle: string;
  };
}

export default function AuthLayout({ children, headerText }: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center overflow-y-auto">
      {/* Contenedor de la imagen de fondo */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute right-[-500px] -top-[-280px]">
          <img 
            src="/logofideliza.svg" 
            alt="Background" 
            className="w-[2124px] h-[1579px] object-contain opacity-20"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* Flecha de retorno (solo móvil) */}
      <button 
        onClick={() => router.push('/')}
        className="fixed top-12 left-5 sm:hidden z-10"
      >
        <ArrowLeft className="h-6 w-6 text-main-dark" />
      </button>

      {/* Texto en la parte superior derecha */}
      {headerText && (
        <div className="absolute sm:fixed top-20 left-5 sm:left-auto sm:right-[5%] mt-6 z-10">
          <h2 className="text-[32px] sm:text-[40px] font-open-sans font-extrabold leading-[1.2] sm:leading-[54.47px] tracking-[0.02em] text-main-dark mb-4">
            {headerText.title}
          </h2>
          <p className="hidden sm:block text-[24px] font-open-sans font-extrabold leading-[32.68px] tracking-[0.02em]">
            {headerText.subtitle}
          </p>
        </div>
      )}

      {/* Contenedor del contenido */}
      <div className="relative mx-auto sm:mx-0 sm:ml-[15%] mt-32 sm:mt-0 w-[90%] sm:w-auto pb-8">
        {children}
      </div>
    </div>
  )
}