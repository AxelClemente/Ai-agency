'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'

function ResetPasswordContent() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (passwords.password !== passwords.confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: passwords.password
        }),
      })

      if (response.ok) {
        router.push('/auth?mode=signin&message=password-reset-success')
      } else {
        const data = await response.json()
        setError(data.error || t('genericError'))
      }
    } catch {
      setError(t('errorOccurredForgot'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-[400px] sm:w-[514px] h-[700px] sm:h-[822px] bg-white rounded-[20px] shadow-[0_10px_50px_0_rgba(0,0,0,0.1)] p-4 flex flex-col items-center">
      <div className="text-center mb-6 mt-12">
        <h1 className="!text-[20px] font-bold leading-[28px] text-main-dark mb-2 font-open-sans">
          {t('forgotPasswordTitle')}
        </h1>
        <p className="text-[16px] font-semibold leading-[20px] text-center font-open-sans">
          {t('forgotPasswordSubtitle')}
          <br />
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex flex-col items-center">
        {error && (
          <div className="p-3 text-red-500 bg-red-100 rounded-md text-sm w-[390px] sm:w-[462px]">
            {error}
          </div>
        )}

        <div className="relative">
          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-third-gray" />
          <Input
            type="password"
            placeholder={t('passwordPlaceholder')}
            className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] bg-main-gray pl-16 border-0 
                     !text-[16px] !font-semibold text-third-gray
                     placeholder:text-third-gray placeholder:text-[16px] placeholder:font-semibold
                     focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={passwords.password}
            onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-third-gray" />
          <Input
            type="password"
            placeholder={t('confirmPasswordPlaceholder')}
            className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] bg-main-gray pl-16 border-0 
                     !text-[16px] !font-semibold text-third-gray
                     placeholder:text-third-gray placeholder:text-[16px] placeholder:font-semibold
                     focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] bg-main-dark text-white hover:bg-main-dark/90 text-[16px] font-semibold"
          disabled={isLoading}
        >
          {t('verifyButton')}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-[78px] w-[390px] sm:w-[462px] rounded-[100px] hover:text-gray-900 text-[16px] font-semibold leading-[20px] font-open-sans underline decoration-solid"
          onClick={() => router.push('/auth?mode=signin')}
        >
          {t('cancelButton')}
        </Button>
      </form>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense 
      fallback={
        <div className="w-[400px] h-[700px] bg-white rounded-[20px] shadow-[0_10px_50px_0_rgba(0,0,0,0.1)] p-4 flex flex-col items-center justify-center">
          <div className="text-third-gray">Loading...</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}