"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Globe } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function MobileMainHeader() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLangOpen, setIsLangOpen] = React.useState(false)
  const langDropdownRef = React.useRef<HTMLDivElement>(null)
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Header.languages')
  const { data: session } = useSession()

  const languages = [
    { code: 'es', name: t('es') },
    { code: 'en', name: t('en') },
    { code: 'fr', name: t('fr') }
  ]

  // Cerrar el dropdown cuando se hace clic fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (locale: string) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '')
    const newPath = `/${locale}${pathWithoutLocale || ''}`
    router.push(newPath)
    router.refresh()
    setIsLangOpen(false)
  }

  // Función para manejar la redirección al dashboard según el rol
  const handleDashboardClick = () => {
    setIsOpen(false) // Cerrar el menú móvil
    if (session?.user?.role === 'CUSTOMER') {
      router.push(`/${currentLocale}/customer-dashboard`)
    } else if (['BUSINESS', 'ADMIN', 'STAFF'].includes(session?.user?.role || '')) {
      router.push(`/${currentLocale}/business-dashboard`)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-black text-white p-4 z-50">
        <div className="flex justify-between items-center">
          <Link href={`/${currentLocale}`}>
            <Image
              src="/logofideliza.svg"
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center text-white hover:text-gray-300 transition"
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {isLangOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-black rounded-md shadow-xl z-50">
                  {languages
                    .filter(lang => lang.code !== currentLocale)
                    .map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:text-gray-300 transition"
                      >
                        {lang.name}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-10">
          <nav className="flex flex-col h-[calc(100vh-80px)] justify-end px-4">
            <div className="mb-24 space-y-4">
              {session ? (
                // Usuario autenticado - Mostrar Dashboard
                <button 
                  onClick={handleDashboardClick}
                  className="block w-[390px] h-[78px] leading-[78px] text-lg font-[800] text-white bg-black text-center border border-black rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                // Usuario no autenticado - Mostrar Sign In y Join now
                <>
                  <Link 
                    href="/auth?mode=signin" 
                    onClick={() => setIsOpen(false)}
                    className="block w-[390px] h-[78px] leading-[78px] text-lg font-[800] text-white bg-black text-center border border-black rounded-full hover:bg-white hover:text-black transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth?mode=signup" 
                    onClick={() => setIsOpen(false)}
                    className="block text-lg font-[800] text-black text-center transition-colors hover:text-gray-600"
                  >
                    Join now
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}