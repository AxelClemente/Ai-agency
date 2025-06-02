"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X } from "lucide-react"
import { useLocale } from 'next-intl'
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentLocale = useLocale()
  const { data: session } = useSession()

  const handleAuthAction = () => {
    if (session) {
      signOut({ callbackUrl: '/' })
    }
  }

  return (
    <header className="relative z-50 w-full bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              Ai Agency
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer">
              <span>Productos</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer">
              <span>Servicios</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <Link href="/research" className="text-white hover:text-gray-300">
              Precios
            </Link>
            <Link href="/pricing" className="text-white hover:text-gray-300">
              About
            </Link>
            <Link href="/customers" className="text-white hover:text-gray-300">
              Blog
            </Link>
            <div className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer">
              <span>Idiomas</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={`/${currentLocale}/customer-dashboard`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium">
                Solicita una demo
              </Button>
            </Link>
            {session ? (
              <Button 
                variant="ghost" 
                onClick={handleAuthAction}
                className="text-white hover:text-gray-300"
              >
                Sign out
              </Button>
            ) : (
              <Link 
                href={`/${currentLocale}/auth?mode=signin`} 
                className="text-white hover:text-gray-300"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black border-t border-gray-800">
          <div className="px-4 py-6 space-y-4">
            <div className="flex items-center space-x-1 text-white">
              <span>Product</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-1 text-white">
              <span>Solutions</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <Link href="/research" className="block text-white">
              Research
            </Link>
            <Link href="/pricing" className="block text-white">
              Pricing
            </Link>
            <Link href="/customers" className="block text-white">
              Customers
            </Link>
            <div className="flex items-center space-x-1 text-white">
              <span>Resources</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="pt-4 space-y-4">
              <Link href={`/${currentLocale}/customer-dashboard`}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                  Solicita una demo
                </Button>
              </Link>
              {session ? (
                <Button 
                  variant="ghost"
                  onClick={handleAuthAction}
                  className="w-full text-center text-white"
                >
                  Sign out
                </Button>
              ) : (
                <Link 
                  href={`/${currentLocale}/auth?mode=signin`}
                  className="block text-center text-white"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
