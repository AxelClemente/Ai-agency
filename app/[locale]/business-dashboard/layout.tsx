import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'


import { authOptions } from "@/app/api/auth/auth.config"
import { Metadata } from 'next'
import { metadata as siteMetadata } from '../../metadata-config'

export const metadata: Metadata = {
  title: siteMetadata.business.title,
  description: siteMetadata.business.description,
}

export default async function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  console.log('🔒 Business Dashboard Layout - Session Check:', {
    hasSession: !!session,
    userId: session?.user?.id,
    userRole: session?.user?.role,
    fullSession: session
  })

  if (!session?.user?.id) {
    console.log('❌ No session or user ID, redirecting to auth')
    redirect('/auth?mode=signin')
  }

  if (session.user?.role !== 'BUSINESS') {
    console.log('❌ Invalid role:', {
      currentRole: session.user?.role,
      expectedRole: 'BUSINESS'
    })
    redirect('/auth/choose-role')
  }

  console.log('✅ Access granted to Business Dashboard')

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="block sm:hidden">
        
      </div>
      <div className="hidden sm:block">
        
      </div>
      <main className="w-full flex-1 mt-16 sm:mt-0">
        
          {children}
        
      </main>
    </div>
  )
}