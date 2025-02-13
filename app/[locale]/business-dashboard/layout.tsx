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
  
  if (!session?.user?.id) {
    redirect('/auth?mode=signin')
  }

  if (session.user?.role !== 'BUSINESS') {
    console.log('Redirecting: Invalid role', session.user?.role)
    redirect('/choose-role')
  }

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