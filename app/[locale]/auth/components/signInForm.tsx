'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'

export default function SignInForm() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  console.log('Render - Session Status:', status)
  console.log('Render - Session Data:', session)

  console.log('🔍 Current URL params:', {
    mode: searchParams.get('mode'),
    returnUrl: searchParams.get('returnUrl'),
    callbackUrl: searchParams.get('callbackUrl')
  })

  useEffect(() => {
    console.log('🔄 useEffect triggered:', { 
      status, 
      sessionUser: session?.user,
      currentPath: window.location.pathname + window.location.search
    })
    console.log('useEffect - Checking session:', session)
    if (status === 'authenticated' && session?.user) {
      console.log('useEffect - User authenticated:', session.user)

      // Si es ADMIN o STAFF, redirigir directamente al dashboard
      if (session.user.role === 'ADMIN' || session.user.role === 'STAFF') {
        console.log('Redirecting ADMIN/STAFF to dashboard')
        router.push('/business-dashboard')
        return
      }

      // Si es CUSTOMER, redirigir directamente al customer dashboard
      if (session.user.role === 'CUSTOMER') {
        console.log('Redirecting CUSTOMER to customer dashboard')
        router.push('/customer-dashboard')
        return
      }

      // Para otros roles, procedemos con la verificación de location
      if (session.user.role !== undefined && session.user.location !== undefined) {
        if (session.user.location) {
          if (session.user.role === 'BUSINESS') {
            console.log('Redirecting to business dashboard')
            router.push('/business-dashboard')
          } else {
            console.log('Redirecting to choose role')
            router.push('/auth/choose-role')
          }
        } else {
          console.log('Redirecting to location')
          router.push('/auth/location')
        }
      }
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setError('Invalid credentials')
      }
      // No hacemos redirección aquí, useEffect se encargará
    } catch {
      setError('An error occurred during sign in')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      console.log('🚀 Starting Google sign in...')
      const result = await signIn('google', {
        callbackUrl: '/auth?mode=signin',
        redirect: false,
      })
      console.log('📥 Google sign in result:', result)

      if (result?.error) {
        setError('Error signing in with Google')
      }
    } catch (error) {
      console.error('❌ Google sign in error:', error)
      setError('An error occurred during Google sign in')
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      console.log('🚀 Starting Facebook sign in...')
      const result = await signIn('facebook', {
        callbackUrl: '/auth?mode=signin',
        redirect: false,
      })
      console.log('📥 Facebook sign in result:', result)

      if (result?.error) {
        setError('Error signing in with Facebook')
      }
    } catch (error) {
      console.error('❌ Facebook sign in error:', error)
      setError('An error occurred during Facebook sign in')
    }
  }

  return (
    <div className="w-[400px] sm:w-[514px] h-[700px] sm:h-[822px] bg-white rounded-[20px] shadow-[0_10px_50px_0_rgba(0,0,0,0.1)] p-4 flex flex-col items-center mt-8 sm:mt-0">
      <div className="flex gap-2 mb-6 mt-12">
        <span 
          className="cursor-pointer font-['Open_Sans'] text-[20px] leading-[32.68px] font-[700] text-third-gray"
          onClick={() => router.push('/auth?mode=signup')}
        >
          {t('signUp')}
        </span>
        <span className="font-['Open_Sans'] text-[20px] leading-[32.68px] font-[700] text-third-gray">|</span>
        <span 
          className="cursor-pointer font-['Open_Sans'] text-[20px] leading-[32.68px] font-[700] text-main-dark"
        >
          {t('signIn')}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex flex-col items-center">
        {message === 'password-reset-success' && (
          <div className="p-3 text-green-500 bg-green-100 rounded-md text-sm w-[360px]">
            {t('passwordResetSuccess')}
          </div>
        )}
        
        {error && (
          <div className="p-3 text-red-500 bg-red-100 rounded-md text-sm w-[390px] sm:w-[462px]">
            {t(error)}
          </div>
        )}
        
        <div className="relative">
          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-third-gray" />
          <Input
            type="email"
            placeholder={t('emailPlaceholder')}
            className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] bg-main-gray pl-16 border-0 
                     !text-[16px] !font-semibold text-third-gray
                     placeholder:text-third-gray placeholder:text-[16px] placeholder:font-semibold
                     focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-third-gray" />
            <Input
              type="password"
              placeholder={t('passwordPlaceholder')}
              className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] bg-main-gray pl-16 border-0 
                       !text-[16px] !font-semibold text-third-gray
                       placeholder:text-third-gray placeholder:text-[16px] placeholder:font-semibold
                       focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end w-[390px] sm:w-[462px] pr-4">
            <button
              type="button"
              onClick={() => router.push('/auth/forgot-password')}
              className="text-semi-bold-2 hover:text-gray-900 underline decoration-solid my-3"
            >
              {t('forgotPassword')}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] bg-main-dark text-white hover:bg-main-dark/90 text-[16px] font-semibold"
        >
          {t('loginButton')}
        </Button>

        <div className="w-[390px] sm:w-[462px] relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-third-gray/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-semi-bold-2">{t('or')}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] border-[1px] border-third-gray/30 text-[16px] font-semibold"
          onClick={handleGoogleSignIn}
        >
          <img src="/google.svg" alt="Google logo" className="w-4 h-4 mr-2" />
          {t('googleAccount')}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] bg-[#1877F2] text-white hover:bg-[#166FE5] border-0 text-[16px] font-semibold"
          onClick={handleFacebookSignIn}
        >
          <img src="/facebook.svg" alt="Facebook logo" className="w-4 h-4 mr-2" />
          {t('facebookAccount')}
        </Button>
      </form>
    </div>
  )
}