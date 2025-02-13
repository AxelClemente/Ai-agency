'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import VerifyCode from '../components/verifyCode'
import AuthLayout from '../components/authLayout'

// Componente que usa useSearchParamsss
function VerifyCodeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const headerText = {
    title: "Forgot the password?",
    subtitle: "The confirmation code usually arrives in 55 sec"
  }

  return (
    <AuthLayout headerText={headerText}>
      <VerifyCode email={email} />
    </AuthLayout>
  )
}

// Página principal envuelta en Suspense
export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <VerifyCodeContent />
    </Suspense>
  )
}