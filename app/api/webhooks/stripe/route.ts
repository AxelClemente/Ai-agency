import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: unknown) {
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, subscriptionId, placeId } = session.metadata || {}

    if (!userId || !subscriptionId || !placeId) {
      return new NextResponse('Missing required metadata', { status: 400 })
    }

    try {
      // Obtener la información de la suscripción
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId }
      })

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      // Calcular fechas
      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // Suscripción por 1 mes

      // Crear la suscripción del usuario
      const userSubscription = await prisma.userSubscription.create({
        data: {
          userId,
          subscriptionId,
          placeId,
          status: 'ACTIVE',
          startDate: now,
          endDate: endDate,
          lastPayment: now,
          nextPayment: endDate,
          amount: subscription.price,
          isActive: true,
          payments: {
            create: {
              amount: session.amount_total! / 100, // Convertir de centavos a dólares
              status: 'COMPLETED',
              paymentMethod: 'CREDIT_CARD',
              transactionId: session.payment_intent as string
            }
          }
        }
      })

      console.log('UserSubscription created:', userSubscription)
    } catch (error) {
      console.error('Error processing subscription:', error)
      return new NextResponse('Error processing subscription', { status: 500 })
    }
  }

  return new NextResponse(null, { status: 200 })
}