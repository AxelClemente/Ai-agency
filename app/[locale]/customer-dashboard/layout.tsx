import React from 'react'
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/app/api/auth/auth.config"
import { Metadata } from 'next'
import { metadata as siteMetadata } from '../../metadata-config'

export const metadata: Metadata = {
  title: siteMetadata.client.title,
  description: siteMetadata.client.description,
}

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth?mode=signin')
  }

  const userRole = session.user?.role
  if (!userRole || userRole !== 'CUSTOMER') {
    console.log('Redirecting: Invalid role', userRole)
    redirect('/auth?mode=signin')
  }

  return (
    <>
      
      <div className="flex flex-col w-full min-h-screen">
        <main className="w-full flex-1 mt-0">
          {children}
        </main>
      </div>
    </>
  )
}

