'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link'
import Image from 'next/image'
import { Globe, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'

export function MainHeader() {
  const t = useTranslations('Header');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Lista de idiomas disponibles
  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  // Función para manejar la redirección al dashboard según el rol
  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session?.user?.role === 'CUSTOMER') {
      router.push(`/${currentLocale}/customer-dashboard`);
    } else if (['BUSINESS', 'ADMIN', 'STAFF'].includes(session?.user?.role || '')) {
      router.push(`/${currentLocale}/business-dashboard`);
    }
  };

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cambiar el idioma
  const handleLanguageChange = (locale: string) => {
    // Obtener la ruta actual sin el locale
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    // Construir la nueva ruta con el nuevo locale
    const newPath = `/${locale}${pathWithoutLocale || ''}`;
    
    // Navegar a la nueva ruta
    router.push(newPath);
    router.refresh(); // Forzar un refresh para actualizar la página con el nuevo idioma
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-black text-white p-4 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center">
            <Image
              src="/logofideliza.svg"
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-16">
            <Link 
              href={`/${currentLocale}/about-service`}
              className="text-white hover:text-gray-300 transition font-semibold text-[15.79px] leading-[21.5px]"
            >
              {t('about')}
            </Link>
            
            {session ? (
              // Usuario autenticado - Mostrar Dashboard con redirección condicional
              <button 
                onClick={handleDashboardClick}
                className="text-white hover:text-gray-300 transition font-semibold text-[15.79px] leading-[21.5px]"
              >
                Dashboard
              </button>
            ) : (
              // Usuario no autenticado - Mostrar Registro e Inicio de sesión
              <>
                <Link 
                  href={`/${currentLocale}/auth?mode=signup`}
                  className="text-white hover:text-gray-300 transition font-semibold text-[15.79px] leading-[21.5px]"
                >
                  {t('signup')}
                </Link>
                <Link 
                  href={`/${currentLocale}/auth?mode=signin`}
                  className="text-white hover:text-gray-300 transition font-semibold text-[15.79px] leading-[21.5px]"
                >
                  {t('signin')}
                </Link>
              </>
            )}

            {session && (
              <button 
                onClick={() => signOut()}
                className="text-white hover:text-gray-300 transition font-semibold"
              >
                Cerrar Sesión
              </button>
            )}

            {/* Language Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-white hover:text-gray-300 transition"
              >
                <Globe className="w-5 h-5" />
                <ChevronDown className={`w-5 h-5 stroke-[3] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-black rounded-md shadow-xl z-50">
                  {languages
                    .filter(lang => lang.code !== currentLocale)
                    .map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="block w-full text-left px-4 py-2 text-[15.79px] leading-[21.5px] text-white hover:text-gray-300 transition font-semibold"
                      >
                        {lang.name}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <div className="h-16"></div>
    </>
  )
}