import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { restaurantId } = await req.json()
    
    const view = await prisma.restaurantView.create({
      data: {
        restaurantId
      }
    })

    return NextResponse.json(view)
  } catch (error) {
    console.error('Error registering view:', error)
    return new NextResponse('Error registering view', { status: 500 })
  }
}