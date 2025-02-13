'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SignInForm from '@/app/[locale]/auth/components/signInForm'
import SignUpForm from '@/app/[locale]/auth/components/signUpForm'
import AuthLayout from '@/app/[locale]/auth/components/authLayout'
import { useTranslations } from 'next-intl'

// Componente que usa useSearchParams
function AuthContent() {
  const t = useTranslations('Auth')
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  
  const headerText = mode === 'signup' 
    ? {
        title: t('signUp'),
        subtitle: t('signUpSubtitle'),
        subtitleClassName: "hidden sm:block mb-6 sm:mb-0"
      }
    : {
        title: t('signIn'),
        subtitle: t('signInSubtitle'),
        subtitleClassName: "hidden sm:block mb-6 sm:mb-0"
      }

  return (
    <AuthLayout headerText={headerText}>
      {mode === 'signup' ? <SignUpForm /> : <SignInForm />}
    </AuthLayout>
  )
}

// Página principal envuelta en Suspense
export default function AuthPage() {
  const t = useTranslations('Auth')
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">{t('loading')}</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}