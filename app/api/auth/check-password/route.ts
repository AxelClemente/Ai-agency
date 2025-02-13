import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma'
import { authOptions } from "@/app/api/auth/auth.config"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true }
    })

    return NextResponse.json({ 
      hasPassword: !!user?.password 
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to check password status' },
      { status: 500 }
    )
  }
}